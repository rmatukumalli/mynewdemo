import os
import sys
import json

# Add project root to Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from app import create_app, db
from app.models import Capability, Competency, Behavior, Skill, Proficiency

# --- Configuration ---
# For a real ESCO integration, you'd fetch this data from the ESCO API
# For now, we can simulate it or load from a local JSON/CSV file if available.
ESCO_DATA_SOURCE = None # Placeholder for ESCO data file or API endpoint

# --- Sample Data ---
# This data should ideally be in separate JSON/CSV files for maintainability

PROFICIENCY_LEVELS_DATA = [
    {"name": "Novice", "description": "Basic understanding, requires supervision.", "level": 1},
    {"name": "Beginner", "description": "Can perform tasks with guidance.", "level": 2},
    {"name": "Intermediate", "description": "Works independently on most tasks.", "level": 3},
    {"name": "Advanced", "description": "Can guide others, handles complex tasks.", "level": 4},
    {"name": "Expert", "description": "Recognized authority, innovates and strategizes.", "level": 5},
]

ONTOLOGY_DATA = {
    "Software Engineering": {
        "capability": "Software Development Lifecycle Management",
        "competencies": [
            {
                "name": "Requirement Analysis & Design",
                "behaviors": [
                    {
                        "name": "Eliciting Requirements",
                        "skills": [
                            {"name": "Stakeholder Interviewing", "category": "Communication", "criticality": "High"},
                            {"name": "Use Case Modeling", "category": "Analysis", "criticality": "Medium"},
                        ]
                    },
                    {
                        "name": "System Architecture Design",
                        "skills": [
                            {"name": "Microservices Architecture", "category": "Design", "criticality": "High"},
                            {"name": "Design Patterns", "category": "Design", "criticality": "High"},
                        ]
                    }
                ]
            },
            {
                "name": "Coding & Implementation",
                "behaviors": [
                    {
                        "name": "Writing Clean Code",
                        "skills": [
                            {"name": "Python Programming", "category": "Programming", "criticality": "High"},
                            {"name": "JavaScript Programming", "category": "Programming", "criticality": "High"},
                            {"name": "Code Refactoring", "category": "Quality", "criticality": "Medium"},
                        ]
                    },
                    {
                        "name": "Version Control Management",
                        "skills": [
                            {"name": "Git", "category": "Tools", "criticality": "High"},
                        ]
                    }
                ]
            },
            {
                "name": "Testing & Quality Assurance",
                "behaviors": [
                    {
                        "name": "Developing Test Cases",
                        "skills": [
                            {"name": "Unit Testing", "category": "Testing", "criticality": "High"},
                            {"name": "Integration Testing", "category": "Testing", "criticality": "Medium"},
                        ]
                    }
                ]
            }
        ]
    },
    "Product Management": {
        "capability": "Product Strategy & Execution",
        "competencies": [
            {
                "name": "Market Research & Analysis",
                "behaviors": [
                    {
                        "name": "Identifying Market Needs",
                        "skills": [
                            {"name": "Competitive Analysis", "category": "Strategy", "criticality": "High"},
                            {"name": "User Persona Development", "category": "UX", "criticality": "Medium"},
                        ]
                    }
                ]
            },
            {
                "name": "Product Roadmapping",
                "behaviors": [
                    {
                        "name": "Prioritizing Features",
                        "skills": [
                            {"name": "Agile Methodology", "category": "Process", "criticality": "High"},
                            {"name": "Roadmap Software (e.g., Jira, Aha!)", "category": "Tools", "criticality": "Medium"},
                        ]
                    }
                ]
            }
        ]
    },
    "Aviation Industry": {
        "capability": "Flight Operations Management",
        "competencies": [
            {
                "name": "Flight Planning & Execution",
                "behaviors": [
                    {
                        "name": "Pre-flight Procedures",
                        "skills": [
                            {"name": "Meteorological Analysis for Aviation", "category": "Safety", "criticality": "High"},
                            {"name": "Aircraft Systems Check", "category": "Technical", "criticality": "High"},
                        ]
                    }
                ]
            },
            {
                "name": "Air Traffic Coordination",
                "behaviors": [
                    {
                        "name": "Communicating with ATC",
                        "skills": [
                            {"name": "Aviation Radio Communication", "category": "Communication", "criticality": "High"},
                            {"name": "Understanding Airspace Regulations", "category": "Regulatory", "criticality": "High"},
                        ]
                    }
                ]
            }
        ]
    }
}

# --- Helper Functions ---
def get_or_create(session, model, defaults=None, **kwargs):
    """
    Gets an instance of a model or creates it if it doesn't exist.
    """
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    else:
        params = dict((k, v) for k, v in kwargs.items())
        if defaults:
            params.update(defaults)
        instance = model(**params)
        session.add(instance)
        session.flush()  # Flush to ensure ID is populated for new instances
        return instance, True

# --- ESCO Integration (Conceptual) ---
def generate_from_esco():
    """
    Conceptual function to generate or fetch ontology from ESCO.
    This would involve API calls to ESCO, parsing responses, and mapping
    to the local database models.
    For now, this is a placeholder.
    """
    print("Conceptual: Fetching and processing data from ESCO...")
    if ESCO_DATA_SOURCE:
        # Example: Load from a JSON file if ESCO_DATA_SOURCE is a path
        # with open(ESCO_DATA_SOURCE, 'r') as f:
        #     esco_data = json.load(f)
        # process_esco_data(esco_data)
        pass
    print("Conceptual: ESCO processing complete.")

# --- Data Loading Functions ---
def load_proficiencies(session):
    print("Loading proficiency levels...")
    created_count = 0
    for prof_data in PROFICIENCY_LEVELS_DATA:
        proficiency, created = get_or_create(session, Proficiency, 
                                             name=prof_data["name"], 
                                             level=prof_data["level"],
                                             defaults={'description': prof_data["description"]})
        if created:
            created_count += 1
    session.commit()
    print(f"Loaded {created_count} new proficiency levels.")
    return session.query(Proficiency).all()


def load_ontology_data(session, all_proficiencies):
    print("Loading ontology data (Capabilities, Competencies, Behaviors, Skills)...")
    
    for industry_name, industry_data in ONTOLOGY_DATA.items():
        print(f"\nProcessing Industry: {industry_name}")
        
        # 1. Capability
        cap_name = industry_data["capability"]
        capability, created_cap = get_or_create(session, Capability, name=cap_name, 
                                                defaults={'description': f"Capability for {industry_name}"})
        if created_cap:
            print(f"  Created Capability: {capability.name}")
        else:
            print(f"  Found Capability: {capability.name}")

        # 2. Competencies
        for comp_data in industry_data.get("competencies", []):
            competency, created_comp = get_or_create(session, Competency, 
                                                     name=comp_data["name"], 
                                                     capability_id=capability.id,
                                                     defaults={'description': comp_data.get("description", "")})
            if created_comp:
                print(f"    Created Competency: {competency.name} (under {capability.name})")
            else:
                print(f"    Found Competency: {competency.name} (under {capability.name})")

            # 3. Behaviors
            for beh_data in comp_data.get("behaviors", []):
                behavior, created_beh = get_or_create(session, Behavior,
                                                      name=beh_data["name"],
                                                      competency_id=competency.id,
                                                      defaults={'description': beh_data.get("description", "")})
                if created_beh:
                    print(f"      Created Behavior: {behavior.name} (under {competency.name})")
                else:
                    print(f"      Found Behavior: {behavior.name} (under {competency.name})")

                # 4. Skills
                for skill_data in beh_data.get("skills", []):
                    skill, created_skill = get_or_create(session, Skill,
                                                         name=skill_data["name"],
                                                         behavior_id=behavior.id,
                                                         defaults={
                                                             'description': skill_data.get("description", ""),
                                                             'category': skill_data.get("category", industry_name),
                                                             'criticality': skill_data.get("criticality", "Medium"),
                                                             'tags': skill_data.get("tags", "")
                                                         })
                    if created_skill:
                        print(f"        Created Skill: {skill.name} (under {behavior.name})")
                        # 5. Assign all proficiency levels to this new skill
                        for prof_level in all_proficiencies:
                            # Check if this specific proficiency (name+level) for this skill already exists
                            # This check is more robust if Proficiency model had a unique constraint on (skill_id, name) or (skill_id, level)
                            # For now, we assume Proficiency model's get_or_create handles global proficiencies well,
                            # and here we are linking them.
                            # If Proficiency is meant to be skill-specific instances, the model and this logic would change.
                            # Current model: Proficiency.skill_id links a global proficiency definition to a skill.
                            # This might mean a skill has a list of applicable proficiency *types* rather than skill-specific instances.
                            # Let's adjust: The Proficiency model has skill_id, so we create skill-specific proficiencies.
                            
                            # Re-thinking: The current Proficiency model seems to imply a global set of proficiency levels
                            # that can be associated with skills. If skill_id in Proficiency is NOT NULL, then each
                            # proficiency record is specific to a skill.
                            # The request "skills have proficiencies" implies this.
                            # The PROFICIENCY_LEVELS_DATA defines templates.
                            
                            # Let's assume each skill gets its own set of proficiency instances based on the templates.
                            skill_prof, created_skill_prof = get_or_create(
                                session, Proficiency,
                                name=prof_level['name'], # Use template name
                                level=prof_level['level'], # Use template level
                                skill_id=skill.id, # Link to this specific skill
                                defaults={'description': prof_level['description']}
                            )
                            if created_skill_prof:
                                print(f"          Added Proficiency: {skill_prof.name} (Level {skill_prof.level}) to Skill: {skill.name}")
                    else:
                        print(f"        Found Skill: {skill.name} (under {behavior.name})")
                        # Optionally, ensure proficiencies are linked even if skill existed
                        # This part can be complex if proficiencies can change. For initial load, this is okay.

    session.commit()
    print("\nOntology data loading complete.")

# --- Main Execution ---
def main():
    app = create_app()
    with app.app_context():
        # Ensure database tables are created
        db.create_all()
        print("Database tables checked/created.")

        print("Starting skills ontology management script...")
        
        # Step 1: (Conceptual) Generate/Update from ESCO
        # generate_from_esco() # This is a placeholder

        # Step 2: Load global proficiency levels (if they are templates)
        # Or, if Proficiency instances are always skill-specific, this step might be different.
        # Based on current Proficiency model (skill_id is nullable), we can have global templates.
        # However, the request "skills have proficiencies" and the sample data structure implies
        # that each skill will have its own set of proficiency entries.
        # Let's refine: PROFICIENCY_LEVELS_DATA are templates. When a skill is created,
        # we create Proficiency records for that skill based on these templates.

        # The load_proficiencies function as written creates global proficiency levels.
        # Let's adjust load_ontology_data to create skill-specific proficiencies using these as templates.
        
        # First, ensure the global proficiency *definitions* (templates) exist or are known.
        # For simplicity, we'll use PROFICIENCY_LEVELS_DATA directly as templates in load_ontology_data.
        # So, we don't need to call load_proficiencies() to pre-populate global ones if they are just templates.
        # If Proficiency table was meant to store ONLY global levels, then load_proficiencies() would be it.
        # Given Proficiency.skill_id, it's designed for skill-specific proficiency records.

        # Step 2: Load the main ontology data (Capabilities, Competencies, Behaviors, Skills)
        # and create skill-specific proficiencies.
        load_ontology_data(db.session, PROFICIENCY_LEVELS_DATA) # Pass templates directly

        print("\nScript finished.")

if __name__ == "__main__":
    main()
