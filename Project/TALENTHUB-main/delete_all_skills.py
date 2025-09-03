from app import create_app, db
from app.models import Skill, Proficiency, skill_relationships, Behavior, Competency, Capability

def delete_all_skill_data():
    """
    Deletes all data from Skill, Proficiency, skill_relationships,
    Behavior, Competency, and Capability tables.
    """
    application = create_app()
    with application.app_context():
        try:
            # Order of deletion is important due to foreign key constraints.
            # Delete entities that are depended upon last.

            # 1. Delete Proficiencies (depends on Skill)
            num_proficiencies_deleted = Proficiency.query.delete()
            print(f"Deleted {num_proficiencies_deleted} proficiency records.")

            # 2. Delete from skill_relationships join table (depends on Skill)
            db.session.execute(skill_relationships.delete())
            print("Deleted all entries from skill_relationships join table.")
            
            # 3. Delete Skills (depends on Behavior and Competency, but those FKs are nullable)
            # However, to be thorough and ensure a clean slate for "skills data",
            # we are deleting Behaviors and Competencies too.
            num_skills_deleted = Skill.query.delete()
            print(f"Deleted {num_skills_deleted} skill records.")

            # 4. Delete Behaviors (depends on Competency)
            num_behaviors_deleted = Behavior.query.delete()
            print(f"Deleted {num_behaviors_deleted} behavior records.")

            # 5. Delete Competencies (depends on Capability)
            num_competencies_deleted = Competency.query.delete()
            print(f"Deleted {num_competencies_deleted} competency records.")

            # 6. Delete Capabilities
            num_capabilities_deleted = Capability.query.delete()
            print(f"Deleted {num_capabilities_deleted} capability records.")

            db.session.commit()
            print("Successfully deleted all specified skill ecosystem data and committed changes.")
        except Exception as e:
            db.session.rollback()
            print(f"An error occurred: {e}")
            print("Rolled back database changes.")

if __name__ == '__main__':
    confirm = input("Are you sure you want to delete ALL skill, behavior, competency, and capability data? This action cannot be undone. (yes/no): ")
    if confirm.lower() == 'yes':
        delete_all_skill_data()
    else:
        print("Operation cancelled by the user.")
