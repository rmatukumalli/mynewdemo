import csv
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

# Add project root to sys.path to allow imports from 'app'
# Assumes this script is in 'management/' directory directly under project root
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

try:
    from app.models import Capability, Competency, Skill, Behavior, db
except ImportError as e:
    print(f"Error importing models from 'app.models': {e}")
    print("Please ensure that 'app.models' exists and is importable, and that this script is run from a context where 'app' package is discoverable.")
    print(f"Current sys.path includes: {project_root}")
    sys.exit(1)

# --- Configuration ---
CSV_FILE_PATH = '/Users/raj.matukumalli/Library/CloudStorage/OneDrive-SkillsoftCorporation/Desktop/Private Talent Marketplace/talent-marketplace/skills raw data/skillsrawdata.csv'
DATABASE_URL = f"sqlite:///{os.path.join(project_root, 'site.db')}"

# --- SQLAlchemy Setup ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Bind metadata if using Flask-SQLAlchemy 'db' instance
if hasattr(db, 'metadata'):
    db.metadata.bind = engine
else:
    print("Warning: The imported 'db' object does not have a 'metadata' attribute. Model binding might be incomplete.")

# --- Helper Function ---
def get_or_create(session, model, defaults=None, **kwargs):
    """
    Retrieves an instance of a model if it exists, otherwise creates a new one.
    Returns (instance, created_boolean).
    """
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    else:
        params = kwargs.copy()
        if defaults:
            params.update(defaults)
        instance = model(**params)
        try:
            session.add(instance)
            session.flush()  # Flush to get ID for relationships, handle IntegrityError early
        except IntegrityError:
            session.rollback() # Rollback this specific add
            instance = session.query(model).filter_by(**kwargs).first()
            if not instance: # Should not happen if IntegrityError was due to this item
                # This could happen if the unique constraint involves fields not in kwargs
                # or if there's a complex interaction. Re-raise for diagnosis.
                print(f"IntegrityError for model {model.__name__} with params {params}, and instance not found after rollback and re-query.")
                raise 
            return instance, False # Return existing instance
        return instance, True

# --- Main Processing Logic ---
def populate_database(session):
    print(f"Attempting to read CSV file from: {CSV_FILE_PATH}")
    try:
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8-sig') as csvfile: # utf-8-sig to handle potential BOM
            reader = csv.DictReader(csvfile)
            
            # Verify expected columns - adjust these to actual column names in CSV
            # These are assumed based on the prompt.
            expected_headers = ['Capability', 'Competency', 'Name', 'Type']
            actual_headers = reader.fieldnames
            
            if actual_headers is None:
                print("Error: Could not read headers from CSV. The file might be empty or malformed.")
                return

            print(f"CSV Headers found: {actual_headers}")
            if not all(header in actual_headers for header in expected_headers):
                print(f"Warning: CSV file headers differ from expected.")
                print(f"Expected headers: {expected_headers}")
                missing_headers = [h for h in expected_headers if h not in actual_headers]
                if missing_headers:
                    print(f"Missing expected headers: {missing_headers}")
                extra_headers = [h for h in actual_headers if h not in expected_headers]
                if extra_headers:
                    print(f"Found extra headers not in expected list: {extra_headers}")
                print("Proceeding with found headers, but data mapping might be incorrect if names don't match intent.")
                # For robustness, you might want to map user-provided names to these expected names
                # or make the script more flexible with column names.

            for row_num, row in enumerate(reader, 1):
                try:
                    # Use .get with default to empty string to avoid KeyError if a column is unexpectedly missing
                    capability_name = row.get('Capability', '').strip()
                    competency_name = row.get('Competency', '').strip()
                    item_name = row.get('Name', '').strip() # Name of Skill or Behavior
                    item_type = row.get('Type', '').strip().capitalize() # 'Skill' or 'Behavior'

                    if not all([capability_name, competency_name, item_name, item_type]):
                        print(f"Skipping row {row_num}: missing one or more required fields (Capability, Competency, Name, Type). Data: {row}")
                        continue

                    # 1. Get or create Capability
                    capability, cap_created = get_or_create(session, Capability, name=capability_name)
                    if cap_created:
                        print(f"Row {row_num}: Created Capability: {capability.name}")

                    # 2. Get or create Competency
                    competency, comp_created = get_or_create(session, Competency, name=competency_name)
                    if comp_created:
                        print(f"Row {row_num}: Created Competency: {competency.name}")

                    # 3. Link Capability and Competency (M2M)
                    if competency not in capability.competencies:
                        capability.competencies.append(competency)
                        print(f"Row {row_num}: Linked Competency '{competency.name}' to Capability '{capability.name}'")
                    
                    # 4. Handle Skill or Behavior
                    if item_type == 'Skill':
                        skill, skill_created = get_or_create(session, Skill, name=item_name)
                        if skill_created:
                            print(f"Row {row_num}: Created Skill: {skill.name}")
                        # Link Skill to Competency (M2M)
                        if skill not in competency.skills:
                            competency.skills.append(skill)
                            print(f"Row {row_num}: Linked Skill '{skill.name}' to Competency '{competency.name}'")
                    
                    elif item_type == 'Behavior':
                        # For Behavior, uniqueness is typically name + competency_id
                        behavior, beh_created = get_or_create(session, Behavior, name=item_name, competency_id=competency.id)
                        if beh_created:
                            print(f"Row {row_num}: Created Behavior: '{behavior.name}' for Competency '{competency.name}'")
                    
                    else:
                        print(f"Skipping row {row_num}: Unknown item type '{item_type}'. Expected 'Skill' or 'Behavior'. Data: {row}")

                except Exception as e:
                    session.rollback() # Rollback changes for this specific row
                    print(f"Error processing row {row_num}: {row}. Error: {e}. Changes for this row rolled back.")
                    # Continue to the next row

            session.commit()
            print("Database population completed successfully.")

    except FileNotFoundError:
        print(f"Error: CSV file not found at {CSV_FILE_PATH}")
    except csv.Error as e:
        print(f"Error reading CSV file: {e}")
    except Exception as e:
        session.rollback() # Rollback any changes if a major error occurs during file processing
        print(f"An unexpected error occurred: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()
        print("Database session closed.")

# --- Script Execution ---
if __name__ == "__main__":
    print("Starting database population script...")
    
    if not os.path.exists(CSV_FILE_PATH):
        print(f"Critical Error: CSV file not found at {CSV_FILE_PATH}. Aborting.")
        sys.exit(1)

    session = SessionLocal()
    populate_database(session)
    print("Script finished.")
