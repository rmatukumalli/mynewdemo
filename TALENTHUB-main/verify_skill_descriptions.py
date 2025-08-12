import os
import sys
from app import create_app, db
from app.models import Skill

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def verify_skill_descriptions():
    """
    Verifies the descriptions of all skills in the database.
    """
    app = create_app()
    with app.app_context():
        all_skills = Skill.query.all()

        if not all_skills:
            print("No skills found in the database.")
            return

        print("Verifying skill descriptions...")
        for skill in all_skills:
            print(f"  - Skill: {skill.name}, Description: {skill.description}")

if __name__ == '__main__':
    verify_skill_descriptions()
