from app import create_app, db
from app.models import Skill

def update_skill_description():
    """Updates the description for a specific skill."""
    app = create_app()
    with app.app_context():
        skill_name = "Strategic Planning & Vision Setting"
        skill = Skill.query.filter_by(name=skill_name).first()

        if skill:
            new_description = "Strategic planning and vision setting are crucial processes for any organization aiming for success. They involve defining a clear vision of the future, setting goals, and developing strategies to achieve them. This process ensures that an organization's daily operations align with its long-term aspirations."
            skill.description = new_description
            db.session.commit()
            print(f"Successfully updated the description for skill: {skill_name}")
        else:
            print(f"Skill with name '{skill_name}' not found.")

if __name__ == '__main__':
    update_skill_description()
