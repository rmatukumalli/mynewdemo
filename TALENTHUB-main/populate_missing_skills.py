from app import create_app, db
from app.models import Competency, Skill, Proficiency, competency_skills
import uuid

def populate_missing_skills_for_competencies():
    app = create_app()
    with app.app_context():
        print("Checking for competencies without associated skills...")

        competencies_without_skills = db.session.query(Competency).outerjoin(competency_skills).filter(competency_skills.c.skill_id == None).all()

        if not competencies_without_skills:
            print("All competencies already have associated skills. No action needed.")
            return

        print(f"Found {len(competencies_without_skills)} competencies without skills. Populating placeholder skills...")

        # Define generic proficiency levels to be used for new skills
        proficiency_levels_data = [
            {"name": "Beginner", "description": "Has basic understanding and can perform simple tasks with guidance.", "level": 1},
            {"name": "Intermediate", "description": "Can perform tasks independently and solve common problems.", "level": 2},
            {"name": "Advanced", "description": "Proficient in complex tasks, can troubleshoot and guide others.", "level": 3},
            {"name": "Expert", "description": "Master of the skill, can innovate, set standards, and lead initiatives.", "level": 4}
        ]

        for competency in competencies_without_skills:
            print(f"  - Competency: {competency.name} (ID: {competency.id})")

            # Create a placeholder skill for the competency
            skill_id = f"SKL_GENERIC_{uuid.uuid4().hex[:8].upper()}"
            skill_name = f"Foundational Skill for {competency.name}"
            skill_description = f"A foundational skill automatically generated for the '{competency.name}' competency."

            new_skill = Skill(
                id=skill_id,
                name=skill_name,
                description=skill_description,
                category="Generic",
                criticality="Medium"
            )
            db.session.add(new_skill)
            print(f"    - Added Skill: {new_skill.name}")

            # Link the new skill to the competency
            competency.skills.append(new_skill)
            print(f"    - Linked Skill '{new_skill.name}' to Competency '{competency.name}'")

            # Add proficiency levels for the new skill
            for prof_data in proficiency_levels_data:
                new_proficiency = Proficiency(
                    name=prof_data["name"],
                    description=prof_data["description"],
                    level=prof_data["level"],
                    skill_id=new_skill.id
                )
                db.session.add(new_proficiency)
                print(f"      - Added Proficiency '{new_proficiency.name}' (Level {new_proficiency.level}) for Skill: {new_skill.name}")

        try:
            db.session.commit()
            print("Successfully populated missing skills for competencies.")
        except Exception as e:
            db.session.rollback()
            print(f"Error populating missing skills: {e}")

if __name__ == "__main__":
    populate_missing_skills_for_competencies()
