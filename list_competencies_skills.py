from app import create_app, db
from app.models import Competency, Skill

def list_competencies_and_skills():
    app = create_app()
    with app.app_context():
        print("Listing all competencies and their associated skills:")
        competencies = Competency.query.order_by(Competency.name).all()

        if not competencies:
            print("No competencies found in the database.")
            return

        for competency in competencies:
            print(f"\nCompetency: {competency.name} (ID: {competency.id})")
            if competency.skills:
                for skill in competency.skills:
                    print(f"  - Skill: {skill.name} (ID: {skill.id})")
            else:
                print("  (No skills associated with this competency)")

if __name__ == "__main__":
    list_competencies_and_skills()
