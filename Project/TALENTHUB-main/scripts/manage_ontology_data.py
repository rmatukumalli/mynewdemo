import os
import sys
import shutil
import datetime

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import db
from app.models import Competency, Skill, Behavior, Proficiency, RelationshipType, SkillRelationship

# Import static proficiency data
from data.proficiency_data import PROFICIENCY_LEVELS_DATA

# Import your "delta" update files
from data.latest_ontology_updates import SKILL_BEHAVIOR_UPDATES
from data.latest_relationships_updates import SKILL_RELATIONSHIP_UPDATES

# --- Utility Functions (Could be moved to a `utils.py` if more grow) ---

def _get_archive_path():
    """Returns the path to the data archive directory."""
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'archive')

def _archive_processed_data_file(file_path):
    """Moves a processed data file to the archive directory with a timestamp."""
    archive_dir = _get_archive_path()
    os.makedirs(archive_dir, exist_ok=True) # Ensure archive directory exists

    filename = os.path.basename(file_path)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    new_filename = f"processed_{timestamp}_{filename}"
    archive_path = os.path.join(archive_dir, new_filename)

    try:
        shutil.move(file_path, archive_path)
        print(f"Archived '{filename}' to '{archive_path}'")
        # Optionally, clear the original file content after archiving
        with open(file_path, 'w') as f:
            if filename.endswith(".py"):
                f.write("# This file was processed and its contents moved to archive.\n")
                if "ontology_updates" in filename:
                    f.write("SKILL_BEHAVIOR_UPDATES = []\n")
                elif "relationships_updates" in filename:
                    f.write("SKILL_RELATIONSHIP_UPDATES = []\n")
            else: # For non-Python data files if you decide to use them (e.g., JSON, CSV)
                 f.write("") # Clear content
        print(f"Cleared original file '{filename}' content.")
    except Exception as e:
        print(f"Error archiving file '{filename}': {e}")


# --- Core Population Functions (Similar to previous, but operating on deltas) ---

def ensure_relationship_types():
    """Ensures base relationship types exist in the database."""
    print("Ensuring RelationshipType 'parent_of' exists...")
    parent_of_rel_type = RelationshipType.query.get("parent_of")
    if not parent_of_rel_type:
        parent_of_rel_type = RelationshipType(
            id="parent_of",
            name="Parent Of",
            description="Indicates that the source skill is a broader category or prerequisite for the target skill."
        )
        db.session.add(parent_of_rel_type)
        print("Added RelationshipType: Parent Of")
    else:
        # Update if description changed
        if parent_of_rel_type.description != "Indicates that the source skill is a broader category or prerequisite for the target skill.":
            parent_of_rel_type.description = "Indicates that the source skill is a broader category or prerequisite for the target skill."
            db.session.add(parent_of_rel_type)
            print("Updated RelationshipType: Parent Of")
        else:
            print("RelationshipType 'Parent Of' already up-to-date.")

    db.session.commit()


def process_skill_behavior_updates(updates_data):
    """Processes a list of skill and behavior updates."""
    print("\n--- Processing Skill and Behavior Updates ---")

    for comp_data_entry in updates_data:
        competency_id = comp_data_entry["competency_id"]
        competency = Competency.query.get(competency_id)

        if not competency:
            print(f"Warning: Competency with ID '{competency_id}' not found. Skipping its skills and behaviors.")
            continue # Skip if the parent competency doesn't exist

        print(f"\nProcessing updates for Competency: {competency.name} (ID: {competency.id})")

        # Handle Skills
        for skill_data in comp_data_entry.get("skills", []):
            skill = Skill.query.filter_by(name=skill_data["skill_name"]).first()
            if not skill:
                skill = Skill(
                    name=skill_data["skill_name"],
                    description=skill_data["skill_description"]
                )
                db.session.add(skill)
                print(f"  Added Skill: {skill.name}")
            else:
                # Check if an update is needed
                if skill.description != skill_data["skill_description"]:
                    skill.description = skill_data["skill_description"]
                    db.session.add(skill) # Mark for update
                    print(f"  Updated Skill: {skill.name}")
                else:
                    print(f"  Skill already up-to-date: {skill.name}")
            
            db.session.flush()

            if skill not in competency.skills:
                competency.skills.append(skill)
                print(f"  Linked Competency '{competency.name}' to Skill '{skill.name}'")
            else:
                print(f"  Competency '{competency.name}' already linked to Skill '{skill.name}'")

            # Ensure Proficiencies exist for this skill
            for prof_data in PROFICIENCY_LEVELS_DATA:
                proficiency = Proficiency.query.filter_by(skill_id=skill.id, level=prof_data["level"]).first()
                if not proficiency:
                    new_proficiency = Proficiency(
                        name=prof_data["name"],
                        description=prof_data["description"],
                        level=prof_data["level"],
                        skill_id=skill.id
                    )
                    db.session.add(new_proficiency)
                    print(f"    Added Proficiency '{new_proficiency.name}' (Level {new_proficiency.level}) for Skill: {skill.name}")
                else:
                    if proficiency.name != prof_data["name"] or proficiency.description != prof_data["description"]:
                        proficiency.name = prof_data["name"]
                        proficiency.description = prof_data["description"]
                        db.session.add(proficiency)
                        print(f"    Updated Proficiency '{proficiency.name}' (Level {proficiency.level}) for Skill: {skill.name}")
                    else:
                        print(f"    Proficiency '{proficiency.name}' (Level {proficiency.level}) for Skill '{skill.name}' already up-to-date.")

        # Handle Behaviors
        for beh_data in comp_data_entry.get("behaviors", []):
            behavior = Behavior.query.get(beh_data["behavior_id"])
            if not behavior:
                behavior = Behavior(
                    id=beh_data["behavior_id"],
                    name=beh_data["behavior_name"],
                    description=beh_data["behavior_description"],
                    competency_id=competency.id
                )
                db.session.add(behavior)
                print(f"  Added Behavior: {behavior.name} ({behavior.id})")
            else:
                # Check if an update is needed
                if (behavior.name != beh_data["behavior_name"] or
                    behavior.description != beh_data["behavior_description"] or
                    behavior.competency_id != competency.id): # Check competency link too
                    behavior.name = beh_data["behavior_name"]
                    behavior.description = beh_data["behavior_description"]
                    behavior.competency_id = competency.id
                    db.session.add(behavior) # Mark for update
                    print(f"  Updated Behavior: {behavior.name} ({behavior.id})")
                else:
                    print(f"  Behavior already up-to-date: {behavior.name} ({behavior.id})")

    try:
        db.session.commit()
        print("\nSkills, Behaviors, and Proficiencies update process complete.")
    except Exception as e:
        db.session.rollback()
        print(f"Error during skills, behaviors, and proficiencies update: {e}")


def process_skill_relationship_updates(updates_data):
    """Processes a list of skill relationship updates."""
    print("\n--- Processing Skill Relationship Updates ---")

    for rel_data in updates_data:
        source_skill = Skill.query.filter_by(name=rel_data["source_skill_name"]).first()
        target_skill = Skill.query.filter_by(name=rel_data["target_skill_name"]).first()
        rel_type = RelationshipType.query.get(rel_data["relationship_type_id"])

        if not source_skill:
            print(f"Warning: Source skill '{rel_data['source_skill_name']}' not found for relationship. Skipping.")
            continue
        if not target_skill:
            print(f"Warning: Target skill '{rel_data['target_skill_name']}' not found for relationship. Skipping.")
            continue
        if not rel_type:
            print(f"Warning: Relationship type '{rel_data['relationship_type_id']}' not found. Skipping relationship.")
            continue

        existing_rel = SkillRelationship.query.filter_by(
            source_skill_id=source_skill.id,
            target_skill_id=target_skill.id,
            relationship_type_id=rel_type.id
        ).first()

        if not existing_rel:
            new_rel = SkillRelationship(
                source_skill_id=source_skill.id,
                target_skill_id=target_skill.id,
                relationship_type_id=rel_type.id
            )
            db.session.add(new_rel)
            print(f"  Added SkillRelationship: {source_skill.name} {rel_type.name} {target_skill.name}")
        else:
            print(f"  SkillRelationship already exists: {source_skill.name} {rel_type.name} {target_skill.name}")

    try:
        db.session.commit()
        print("Skill Relationships update process complete.")
    except Exception as e:
        db.session.rollback()
        print(f"Error during skill relationships update: {e}")


def main_management_function():
    """Main function to manage ontology data updates."""
    print(f"--- Starting Ontology Data Management at {datetime.datetime.now()} ---")

    # 1. Ensure core relationship types exist
    ensure_relationship_types()

    # 2. Process skill and behavior updates from the delta file
    if SKILL_BEHAVIOR_UPDATES:
        process_skill_behavior_updates(SKILL_BEHAVIOR_UPDATES)
    else:
        print("No new skill/behavior updates found in 'latest_ontology_updates.py'. Skipping.")


    # 3. Process skill relationship updates from the delta file
    if SKILL_RELATIONSHIP_UPDATES:
        process_skill_relationship_updates(SKILL_RELATIONSHIP_UPDATES)
    else:
        print("No new skill relationship updates found in 'latest_relationships_updates.py'. Skipping.")

    print(f"--- Ontology Data Management Complete at {datetime.datetime.now()} ---")


if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        main_management_function()
