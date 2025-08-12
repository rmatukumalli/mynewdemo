import os
import google.generativeai as genai
from app import create_app, db
from app.models import Skill, Proficiency

# Load the API key from environment variables
# Make sure to set the GOOGLE_API_KEY environment variable
# export GOOGLE_API_KEY='your-api-key'
api_key = os.getenv("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def generate_proficiency_description(skill_name, proficiency_name):
    """
    Generates a description for a given skill and proficiency level using the Google Gemini API.
    """
    if not api_key:
        print("Google API key not found. Please set the GOOGLE_API_KEY environment variable.")
        # Fallback to a simple description if the API key is not set
        return f"This is a {proficiency_name} level description for {skill_name}."

    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = (
            f"Generate a concise (1-2 sentence) description for the proficiency level '{proficiency_name}' "
            f"of the skill '{skill_name}'. The description should clearly outline the expected capabilities "
            f"at this level."
        )
        
        response = model.generate_content(prompt)
        
        # Check if the response has the 'text' attribute
        if hasattr(response, 'text'):
            return response.text.strip()
        else:
            # Handle cases where the response might not contain text (e.g., safety settings)
            # You might want to log the full response for debugging
            print(f"Warning: No text found in response for {skill_name} ({proficiency_name}). Full response: {response}")
            return f"A {proficiency_name} level of proficiency in {skill_name}."

    except Exception as e:
        print(f"Error generating description for {skill_name} ({proficiency_name}): {e}")
        # Fallback in case of API error
        return f"A {proficiency_name} level of proficiency in {skill_name}."

def update_all_skill_proficiencies():
    """
    Iterates through all skills and adds 5 proficiency levels if they don't exist.
    """
    app = create_app()
    with app.app_context():
        skills = Skill.query.all()
        
        if not skills:
            print("No skills found in the database.")
            return

        for skill in skills:
            if not skill.proficiencies:
                print(f"Generating proficiency levels for skill: '{skill.name}'")
                
                proficiency_levels = [
                    {"name": "Beginner", "level": 1},
                    {"name": "Intermediate", "level": 2},
                    {"name": "Advanced", "level": 3},
                    {"name": "Expert", "level": 4},
                    {"name": "Master", "level": 5}
                ]
                
                for prof_data in proficiency_levels:
                    description = generate_proficiency_description(skill.name, prof_data["name"])
                    
                    new_proficiency = Proficiency(
                        name=prof_data["name"],
                        level=prof_data["level"],
                        description=description,
                        skill_id=skill.id
                    )
                    db.session.add(new_proficiency)
                
                print(f"Added 5 proficiency levels for '{skill.name}'.")
            else:
                print(f"Skill '{skill.name}' already has proficiency levels. Skipping.")
        
        try:
            db.session.commit()
            print("\nSuccessfully updated all skills with proficiency levels.")
        except Exception as e:
            db.session.rollback()
            print(f"\nAn error occurred during the database commit: {e}")

if __name__ == '__main__':
    update_all_skill_proficiencies()
