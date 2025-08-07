import json
from app import create_app, db
from app.models import Competency, Skill, Behavior, Proficiency, competency_skills

def merge_competency_data(json_file_path):
    app = create_app()
    with app.app_context():
        print(f"Merging data from {json_file_path} into the database...")

        try:
            with open(json_file_path, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            print(f"Error: JSON file not found at {json_file_path}")
            return
        except json.JSONDecodeError:
            print(f"Error: Could not decode JSON from {json_file_path}. Check file format.")
            return

        # Define generic proficiency levels to be used for new skills
        proficiency_levels_data = [
            {"name": "Beginner", "description": "Has basic understanding and can perform simple tasks with guidance.", "level": 1},
            {"name": "Intermediate", "description": "Can perform tasks independently and solve common problems.", "level": 2},
            {"name": "Advanced", "description": "Proficient in complex tasks, can troubleshoot and guide others.", "level": 3},
            {"name": "Expert", "description": "Master of the skill, can innovate, set standards, and lead initiatives.", "level": 4}
        ]

        for comp_data in data:
            competency_id = comp_data.get("competency_id")
            competency_name = comp_data.get("competency_name")
            
            if not competency_id or not competency_name:
                print(f"Skipping invalid competency entry: {comp_data}")
                continue

            # Handle Competency
            competency = Competency.query.get(competency_id)
            if not competency:
                competency = Competency(
                    id=competency_id,
                    name=competency_name,
                    description=comp_data.get("competency_description")
                )
                db.session.add(competency)
                print(f"Added Competency: {competency.name}")
            else:
                # Update name and description if they differ
                if competency.name != competency_name:
                    competency.name = competency_name
                    print(f"Updated Competency name for ID {competency_id}: {competency.name}")
                if comp_data.get("competency_description") and competency.description != comp_data["competency_description"]:
                    competency.description = comp_data["competency_description"]
                    print(f"Updated Competency description for ID {competency_id}: {competency.name}")
                print(f"Competency already exists and is up-to-date (or updated): {competency.name}")

            # Handle Skills
            for skill_data in comp_data.get("skills", []):
                skill_id = skill_data.get("skill_id")
                skill_name = skill_data.get("skill_name")
                skill_description = skill_data.get("skill_description")
                
                if not skill_id or not skill_name:
                    print(f"  Skipping invalid skill entry for competency {competency_name}: {skill_data}")
                    continue

                skill = Skill.query.get(skill_id) # Try to find by ID first
                skill_was_new = False

                if not skill: # If not found by ID, try to find by name
                    skill = Skill.query.filter_by(name=skill_name).first()

                if not skill: # If still not found, create a new skill
                    skill = Skill(
                        id=skill_id,
                        name=skill_name,
                        description=skill_description
                    )
                    db.session.add(skill)
                    skill_was_new = True
                    print(f"    Added Skill: {skill.name}")
                else: # Skill found by ID or Name
                    updated = False
                    # If found by name but ID is different, update the ID to match the JSON
                    # Only update ID if the new ID is not already taken by another skill
                    if skill.id != skill_id and Skill.query.get(skill_id) is None: 
                        skill.id = skill_id
                        updated = True
                        print(f"    Updated Skill ID for '{skill.name}' to '{skill_id}'")
                    
                    # Update name and description if they differ
                    if skill.name != skill_name:
                        skill.name = skill_name
                        updated = True
                        print(f"    Updated Skill name for ID {skill.id}: {skill.name}")
                    if skill.description != skill_description:
                        skill.description = skill_description
                        updated = True
                        print(f"    Updated Skill description for ID {skill.id}: {skill.name}")
                    
                    if updated:
                        db.session.add(skill) # Re-add to session to mark as dirty if any changes were made
                        print(f"    Skill updated: {skill.name}")
                    else:
                        print(f"    Skill already exists and is up-to-date: {skill.name}")

                # Add proficiency levels for the skill if it was just created
                if skill_was_new:
                    for prof_data in proficiency_levels_data:
                        new_proficiency = Proficiency(
                            name=prof_data["name"],
                            description=prof_data["description"],
                            level=prof_data["level"],
                            skill_id=skill.id
                        )
                        db.session.add(new_proficiency)
                        print(f"      Added Proficiency '{new_proficiency.name}' (Level {new_proficiency.level}) for new Skill: {skill.name}")


                # Establish Competency-Skill relationship
                if skill not in competency.skills:
                    competency.skills.append(skill)
                    print(f"    Linked Competency '{competency.name}' to Skill '{skill.name}'")
                else:
                    print(f"    Competency '{competency.name}' already linked to Skill '{skill.name}'")

            # Handle Behaviors
            for beh_data in comp_data.get("behaviors", []):
                behavior_id = beh_data.get("behavior_id")
                behavior_name = beh_data.get("behavior_name")

                if not behavior_id or not behavior_name:
                    print(f"  Skipping invalid behavior entry for competency {competency_name}: {beh_data}")
                    continue

                behavior = Behavior.query.get(behavior_id)
                if not behavior:
                    behavior = Behavior(
                        id=behavior_id,
                        name=behavior_name,
                        description=beh_data.get("behavior_description"),
                        competency_id=competency.id
                    )
                    db.session.add(behavior)
                    print(f"    Added Behavior: {behavior.name} for Competency: {competency.name}")
                else:
                    # Update name, description, and competency_id if they differ
                    updated = False
                    if behavior.name != behavior_name:
                        behavior.name = behavior_name
                        updated = True
                    if beh_data.get("behavior_description") and behavior.description != beh_data["behavior_description"]:
                        behavior.description = beh_data["behavior_description"]
                        updated = True
                    if behavior.competency_id != competency.id:
                        behavior.competency_id = competency.id
                        updated = True
                    
                    if updated:
                        db.session.add(behavior) # Re-add to session to mark as dirty
                        print(f"    Updated Behavior: {behavior.name} for Competency: {competency.name}")
                    else:
                        print(f"    Behavior already exists and is up-to-date: {behavior.name} for Competency: {competency.name}")

        try:
            db.session.commit()
            print("Data merge complete.")
        except Exception as e:
            db.session.rollback()
            print(f"Error merging data: {e}")

if __name__ == "__main__":
    json_file = "/Users/raj.matukumalli/Library/CloudStorage/OneDrive-SkillsoftCorporation/Desktop/Latest/talent-marketplace/competency-skills-behavior-batch1.json"
    merge_competency_data(json_file)
