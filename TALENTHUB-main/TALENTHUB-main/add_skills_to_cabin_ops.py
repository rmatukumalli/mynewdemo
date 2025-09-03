from app import db, create_app
from app.models import Competency, Skill, Behavior, Proficiency

def add_skills_to_cabin_ops():
    app = create_app()
    with app.app_context():
        # Find the "Cabin Operations" competency
        cabin_ops_competency = Competency.query.filter_by(name="Cabin Operations").first()

        if not cabin_ops_competency:
            print("Competency 'Cabin Operations' not found.")
            return

        print("Found competency 'Cabin Operations'. Adding skills and behaviors...")

        # Define skills and behaviors
        skills_to_add = [
            {"skill_id": "SKL082", "skill_name": "Passenger Safety Procedures", "skill_description": "Knowledge and application of safety procedures to ensure passenger well-being during flights."},
            {"skill_id": "SKL083", "skill_name": "In-Flight Service", "skill_description": "Providing high-quality service to passengers during a flight."},
            {"skill_id": "SKL084", "skill_name": "Emergency Response", "skill_description": "The ability to respond effectively to in-flight emergencies."}
        ]

        behaviors_to_add = [
            {"behavior_id": "BEH076", "behavior_name": "Conducts pre-flight safety checks.", "behavior_description": "Ensures all safety equipment is in place and functional before takeoff."},
            {"behavior_id": "BEH077", "behavior_name": "Demonstrates safety procedures to passengers.", "behavior_description": "Clearly communicates safety information to passengers."},
            {"behavior_id": "BEH078", "behavior_name": "Responds calmly and effectively to passenger needs.", "behavior_description": "Addresses passenger requests and concerns in a professional manner."}
        ]
        
        proficiency_levels_data = [
            {"name": "Beginner", "description": "Has basic understanding and can perform simple tasks with guidance.", "level": 1},
            {"name": "Intermediate", "description": "Can perform tasks independently and solve common problems.", "level": 2},
            {"name": "Advanced", "description": "Proficient in complex tasks, can troubleshoot and guide others.", "level": 3},
            {"name": "Expert", "description": "Master of the skill, can innovate, set standards, and lead initiatives.", "level": 4}
        ]

        # Add Skills
        for skill_data in skills_to_add:
            skill = Skill.query.get(skill_data["skill_id"])
            if not skill:
                skill = Skill(
                    id=skill_data["skill_id"],
                    name=skill_data["skill_name"],
                    description=skill_data["skill_description"]
                )
                db.session.add(skill)
                print(f"Added Skill: {skill.name}")

                # Add proficiency levels for the new skill
                for prof_data in proficiency_levels_data:
                    new_proficiency = Proficiency(
                        name=prof_data["name"],
                        description=prof_data["description"],
                        level=prof_data["level"],
                        skill_id=skill.id
                    )
                    db.session.add(new_proficiency)
                    print(f"Added Proficiency '{new_proficiency.name}' for Skill: {skill.name}")

            # Link skill to competency
            if skill not in cabin_ops_competency.skills:
                cabin_ops_competency.skills.append(skill)
                print(f"Linked Skill '{skill.name}' to Competency 'Cabin Operations'")

        # Add Behaviors
        for beh_data in behaviors_to_add:
            behavior = Behavior.query.get(beh_data["behavior_id"])
            if not behavior:
                behavior = Behavior(
                    id=beh_data["behavior_id"],
                    name=beh_data["behavior_name"],
                    description=beh_data["behavior_description"],
                    competency_id=cabin_ops_competency.id
                )
                db.session.add(behavior)
                print(f"Added Behavior: {behavior.name}")

        try:
            db.session.commit()
            print("Successfully added skills and behaviors to 'Cabin Operations'.")
        except Exception as e:
            db.session.rollback()
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    add_skills_to_cabin_ops()
