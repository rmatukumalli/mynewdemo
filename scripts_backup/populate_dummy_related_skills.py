import random
from collections import defaultdict
from app import create_app, db
from app.models import Skill, SkillRelationship, RelationshipType, Competency
from sqlalchemy.orm import joinedload

app = create_app()
app.app_context().push()

def clear_all_skill_relationships():
    """Deletes all existing skill relationships from the database for a clean slate."""
    print("Clearing all existing skill relationships...")
    try:
        num_deleted = db.session.query(SkillRelationship).delete()
        db.session.commit()
        print(f"Successfully deleted {num_deleted} old relationships.")
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred while deleting relationships: {e}")

def populate_rich_skill_by_skill_relationships():
    """
    For each skill, attempts to create a portfolio of different relationship types
    (hierarchical, prerequisite, associative) with other skills in the same competency.
    """
    print("Starting to populate rich, skill-by-skill relationships...")

    # 1. Pre-processing
    all_skills = Skill.query.all()
    all_competencies = Competency.query.options(joinedload(Competency.skills)).all()
    
    skill_to_competency_pool = defaultdict(list)
    for comp in all_competencies:
        skill_ids = [s.id for s in comp.skills]
        for skill_id in skill_ids:
            # For each skill, its pool is all other skills in the same competency
            skill_to_competency_pool[skill_id] = [sid for sid in skill_ids if sid != skill_id]

    relationships_to_add = set()
    existing_pairs = set()

    # 2. Main Loop - Iterate through every skill
    for skill in all_skills:
        pool = skill_to_competency_pool.get(skill.id, [])
        if not pool:
            continue

        # Helper to add a relationship if the pair doesn't already exist
        def add_relationship(s1_id, s2_id, rel_type):
            if s1_id == s2_id: return
            pair = tuple(sorted((s1_id, s2_id)))
            if pair in existing_pairs: return
            
            relationships_to_add.add((s1_id, s2_id, rel_type))
            existing_pairs.add(pair)

        random.shuffle(pool)
        
        # 3. Generate relationships for the current skill
        
        # - Hierarchical: 1 Parent, up to 2 Children
        if pool: add_relationship(skill.id, pool.pop(), "part_of") # This skill is part of a broader one
        for _ in range(2):
            if pool: add_relationship(pool.pop(), skill.id, "part_of") # A narrower skill is part of this one

        # - Prerequisite: 1 Prereq for this, this is a prereq for 1 other
        if pool: add_relationship(pool.pop(), skill.id, "prerequisite") # A skill is a prereq for this one
        if pool: add_relationship(skill.id, pool.pop(), "prerequisite") # This skill is a prereq for another

        # - Associative: Up to 2 related skills
        for _ in range(2):
            if pool: add_relationship(skill.id, pool.pop(), "related_to")

    # 4. Bulk Save
    if relationships_to_add:
        print(f"Adding {len(relationships_to_add)} new, rich relationships...")
        rel_objects = [
            SkillRelationship(source_skill_id=s1, target_skill_id=s2, relationship_type_id=rt)
            for s1, s2, rt in relationships_to_add
        ]
        db.session.bulk_save_objects(rel_objects)
        db.session.commit()
        print("Successfully added new relationships.")
    else:
        print("No new relationships were generated.")


if __name__ == '__main__':
    clear_all_skill_relationships()
    populate_rich_skill_by_skill_relationships()
    print("Script finished.")
