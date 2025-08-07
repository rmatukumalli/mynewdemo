import os
import sys
import google.generativeai as genai
from app import create_app, db
from app.models import Skill
from sqlalchemy import or_

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Configure the Gemini API key
GEMINI_API_KEY = "AIzaSyDL5JOWnuCXdnVntat7eFtlAygm1hzxAIE"
genai.configure(api_key=GEMINI_API_KEY)

def generate_description_with_llm(skill_name):
    """
    Generates a description for a given skill name using the Gemini API.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = f"Write a brief, professional description for the following skill: {skill_name}"
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating description for {skill_name}: {e}")
        return None

def populate_all_skill_descriptions():
    """
    Populates the description for all skills that have a missing or empty description.
    """
    app = create_app()
    with app.app_context():
        skills_to_update = Skill.query.filter(
            or_(
                Skill.description == None,
                Skill.description == '',
                Skill.description.like('Skill: %'),
                Skill.description.like('This is a generated description for the skill: %')
            )
        ).all()

        if not skills_to_update:
            print("All skills already have descriptions.")
            return

        print(f"Found {len(skills_to_update)} skills with missing descriptions. Populating now...")

        for skill in skills_to_update:
            print(f"Generating description for skill: {skill.name}...")
            new_description = generate_description_with_llm(skill.name)

            if new_description:
                skill.description = new_description
                print(f"  -> Generated description: {new_description}")
            else:
                print(f"  -> Failed to generate description for skill: {skill.name}")

        try:
            db.session.commit()
            print("Successfully updated all skill descriptions.")
        except Exception as e:
            db.session.rollback()
            print(f"An error occurred while updating the database: {e}")

if __name__ == '__main__':
    populate_all_skill_descriptions()
