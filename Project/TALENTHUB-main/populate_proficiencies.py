import os
from app import create_app, db
from app.models import Skill, Proficiency

# Create a Flask app context
app = create_app()
app.app_context().push()

def populate_proficiencies():
    """
    Populates proficiency levels for all existing skills in the database.
    """
    print("Starting proficiency population...")

    # Define standard proficiency levels
    proficiency_levels = [
        {"name": "Beginner", "level": 1, "description": "Basic understanding of fundamental concepts. Can follow instructions and complete simple tasks with supervision."},
        {"name": "Intermediate", "level": 2, "description": "Can work independently on most tasks. Understands the 'why' behind the 'what'. Can troubleshoot common issues."},
        {"name": "Advanced", "level": 3, "description": "Can handle complex tasks and situations. Has a deep understanding of the subject matter. Can mentor others."},
        {"name": "Expert", "level": 4, "description": "Recognized as a go-to person for this skill. Can develop new strategies and approaches. Can innovate and lead in this area."},
        {"name": "Master", "level": 5, "description": "Has a commanding knowledge of the skill. Can influence the industry and set new standards. Pushes the boundaries of what is possible."}
    ]

    # Get all skills from the database
    skills = Skill.query.all()
    if not skills:
        print("No skills found in the database. Aborting proficiency population.")
        return

    print(f"Found {len(skills)} skills. Adding proficiency levels to each...")

    for skill in skills:
        # Check if the skill already has proficiencies to avoid duplicates
        if skill.proficiencies:
            print(f"Skill '{skill.name}' already has proficiencies. Skipping.")
            continue

        for p_data in proficiency_levels:
            proficiency = Proficiency(
                name=p_data["name"],
                level=p_data["level"],
                description=p_data["description"],
                skill_id=skill.id
            )
            db.session.add(proficiency)
        
        print(f"Added {len(proficiency_levels)} proficiency levels to skill '{skill.name}'.")

    try:
        db.session.commit()
        print("Successfully populated proficiencies for all skills.")
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred during commit: {e}")

if __name__ == '__main__':
    populate_proficiencies()
