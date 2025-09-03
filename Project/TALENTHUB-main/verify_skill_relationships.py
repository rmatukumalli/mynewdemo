from app import create_app, db
from app.models import Skill, Competency, Capability, SkillRelationship
from sqlalchemy.orm import joinedload, selectinload

app = create_app()
app.app_context().push()

def verify_data(skill_id):
    """
    Verifies that a skill has the expected nested relationships:
    Skill -> Competencies -> Capabilities
    and that skill-to-skill relationships are loaded.
    """
    print(f"--- Verifying data for Skill ID: {skill_id} ---")

    # Query the skill with all necessary data eagerly loaded, similar to the API
    skill = Skill.query.options(
        selectinload(Skill.competencies).selectinload(Competency.capabilities),
        selectinload(Skill.source_relationships).joinedload(SkillRelationship.relationship_type),
        selectinload(Skill.source_relationships).joinedload(SkillRelationship.target_skill),
        selectinload(Skill.target_relationships).joinedload(SkillRelationship.relationship_type),
        selectinload(Skill.target_relationships).joinedload(SkillRelationship.source_skill)
    ).get(skill_id)

    if not skill:
        print(f"ERROR: Skill with ID '{skill_id}' not found.")
        return

    print(f"Skill: {skill.name} (ID: {skill.id})")

    # Verify Grandparent Capabilities
    if not skill.competencies:
        print("  - This skill is not associated with any competencies.")
    else:
        print("  - Associated Competencies and their Capabilities (Grandparents):")
        for comp in skill.competencies:
            print(f"    - Competency: {comp.name} (ID: {comp.id})")
            if not comp.capabilities:
                print("      - WARNING: This competency is NOT linked to any capabilities.")
            else:
                print("      - Linked Capabilities:")
                for cap in comp.capabilities:
                    print(f"        - Capability: {cap.name} (ID: {cap.id})")

    # Verify Skill Relationships
    print("\n  - Verifying Skill-to-Skill Relationships:")
    if not skill.source_relationships and not skill.target_relationships:
        print("  - This skill has no source or target relationships.")
    else:
        if skill.source_relationships:
            print("  - Source Relationships (This skill -> Other skills):")
            for rel in skill.source_relationships:
                print(f"    - {skill.name} --({rel.relationship_type.name})--> {rel.target_skill.name}")
        if skill.target_relationships:
            print("  - Target Relationships (Other skills -> This skill):")
            for rel in skill.target_relationships:
                print(f"    - {rel.source_skill.name} --({rel.relationship_type.name})--> {skill.name}")

    print("\n--- Verification complete ---")


if __name__ == '__main__':
    # We use skill 'SKL_BS_001' and 'SKL_BS_002' because populate_relationships.py creates relationships for them.
    print("Starting data verification script...")
    verify_data("SKL_BS_001")
    print("\n" + "="*50 + "\n")
    verify_data("SKL_BS_002")
    print("\nData verification script finished.")
