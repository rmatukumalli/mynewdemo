from app import create_app, db
from app.models import RelationshipType, Skill, SkillRelationship, Competency, Capability

app = create_app()
app.app_context().push()

def populate_relationship_types():
    """Populates the database with predefined relationship types."""
    relationship_types_data = [
        {"id": "prerequisite", "name": "Prerequisite", "description": "Skill A must be mastered before Skill B can be learned or applied."},
        {"id": "part_of", "name": "Part Of", "description": "Skill A is a component or sub-skill of Skill B."},
        {"id": "dependent_on", "name": "Dependent On", "description": "Skill A relies on Skill B for its effective execution."},
        {"id": "related_to", "name": "Related To", "description": "A general connection between two skills that are thematically linked but not strictly prerequisite or part of each other."},
        {"id": "alternative_to", "name": "Alternative To", "description": "Skill A can be used in place of Skill B to achieve a similar outcome."},
        {"id": "conflicts_with", "name": "Conflicts With", "description": "Skill A's application might be detrimental or counterproductive when combined with Skill B."}
    ]

    print("Populating Relationship Types...")
    for data in relationship_types_data:
        if not RelationshipType.query.get(data["id"]):
            rel_type = RelationshipType(id=data["id"], name=data["name"], description=data["description"])
            db.session.add(rel_type)
            print(f"Added RelationshipType: {rel_type.name}")
        else:
            print(f"RelationshipType '{data['name']}' already exists. Skipping.")
    db.session.commit()
    print("Relationship Types population complete.")

def add_dummy_skill_relationships():
    """Adds some dummy skill relationships for testing."""
    print("Adding Dummy Skill Relationships...")

    # Example relationships (adjust IDs as per your actual data)
    # You might need to query existing skills to get valid IDs
    skill_ids = [s.id for s in Skill.query.limit(10).all()] # Get first 10 skill IDs for examples

    if len(skill_ids) < 2:
        print("Not enough skills in the database to create relationships. Please populate skills first.")
        return

    relationships_to_add = [
        # Prerequisite: SKL_BS_001 (Strategic Planning) -> SKL_BS_002 (Market Analysis)
        {"source_skill_id": "SKL_BS_001", "target_skill_id": "SKL_BS_002", "relationship_type_id": "prerequisite"},
        # Part Of: SKL_BS_002 (Market Analysis) -> SKL_BS_001 (Strategic Planning)
        {"source_skill_id": "SKL_BS_002", "target_skill_id": "SKL_BS_001", "relationship_type_id": "part_of"},
        # Dependent On: SKL_FE_006 (API Integration) -> SKL_BD_001 (API Design)
        {"source_skill_id": "SKL_FE_006", "target_skill_id": "SKL_BD_001", "relationship_type_id": "dependent_on"},
        # Related To: SKL_CS_001 (Active Listening) -> SKL_CS_004 (Conflict De-escalation)
        {"source_skill_id": "SKL_CS_001", "target_skill_id": "SKL_CS_004", "relationship_type_id": "related_to"},
        # Alternative To: SKL_PO_002 (Lean Principles) -> SKL_PO_003 (Six Sigma)
        {"source_skill_id": "SKL_PO_002", "target_skill_id": "SKL_PO_003", "relationship_type_id": "alternative_to"},
        # Conflicts With: SKL_SM_001 (Hazard Identification) -> SKL_SM_005 (OHS Regulations) - (example, might not be a true conflict)
        {"source_skill_id": "SKL_SM_001", "target_skill_id": "SKL_SM_005", "relationship_type_id": "conflicts_with"},
        
        # Adding more relationships for "Strategic Planning" (SKL_BS_001)
        {"source_skill_id": "SKL_BS_001", "target_skill_id": "SKL_CS_001", "relationship_type_id": "dependent_on"},
        {"source_skill_id": "SKL_BS_001", "target_skill_id": "SKL_PO_002", "relationship_type_id": "related_to"},
        {"source_skill_id": "SKL_A1D69E42", "target_skill_id": "SKL_BS_001", "relationship_type_id": "related_to"},
    ]

    for rel_data in relationships_to_add:
        source_skill = Skill.query.get(rel_data["source_skill_id"])
        target_skill = Skill.query.get(rel_data["target_skill_id"])
        rel_type = RelationshipType.query.get(rel_data["relationship_type_id"])

        if source_skill and target_skill and rel_type:
            # Check if relationship already exists to prevent duplicates
            existing_rel = SkillRelationship.query.filter_by(
                source_skill_id=source_skill.id,
                target_skill_id=target_skill.id,
                relationship_type_id=rel_type.id
            ).first()

            if not existing_rel:
                new_rel = SkillRelationship(
                    source_skill=source_skill,
                    target_skill=target_skill,
                    relationship_type=rel_type
                )
                db.session.add(new_rel)
                print(f"Added relationship: {source_skill.name} --({rel_type.name})--> {target_skill.name}")
            else:
                print(f"Relationship already exists: {source_skill.name} --({rel_type.name})--> {target_skill.name}. Skipping.")
        else:
            print(f"Skipping relationship due to missing skill or relationship type: {rel_data}")
    db.session.commit()
    print("Dummy Skill Relationships added.")

def link_competencies_to_capabilities():
    """Ensures all competencies are linked to a capability."""
    print("Linking Competencies to Capabilities...")
    competencies = Competency.query.all()
    capabilities = Capability.query.all()

    if not capabilities:
        print("No capabilities found. Please populate capabilities first.")
        return

    # Create a default capability if none exist, or use an existing one
    default_capability = capabilities[0] if capabilities else None
    if not default_capability:
        default_capability = Capability(id="default_cap", name="Default Capability", description="Auto-created default capability")
        db.session.add(default_capability)
        db.session.commit()
        print(f"Created default capability: {default_capability.name}")
        capabilities = Capability.query.all() # Refresh capabilities list

    for comp in competencies:
        # Check if the competency is already linked to any capability
        if not comp.capabilities: # Assuming 'capabilities' is the relationship attribute
            # Link to the first available capability or a default one
            comp.capabilities.append(default_capability)
            db.session.add(comp)
            print(f"Linked Competency '{comp.name}' to Capability '{default_capability.name}'")
        else:
            print(f"Competency '{comp.name}' already linked to capabilities. Skipping.")
    
    # Explicitly link 'Business Strategy' competency to 'Product & Business' capability for testing
    business_strategy_comp = Competency.query.filter_by(id="business_strategy").first()
    product_business_cap = Capability.query.filter_by(id="product_and_business").first() # Assuming this ID

    if business_strategy_comp and product_business_cap:
        if product_business_cap not in business_strategy_comp.capabilities:
            business_strategy_comp.capabilities.append(product_business_cap)
            db.session.add(business_strategy_comp)
            print(f"Explicitly linked 'Business Strategy' to 'Product & Business'.")
        else:
            print(f"'Business Strategy' already linked to 'Product & Business'. Skipping explicit link.")
    else:
        print("Could not find 'Business Strategy' competency or 'Product & Business' capability for explicit linking.")

    db.session.commit()
    print("Competency-Capability linking complete.")


if __name__ == '__main__':
    print("Starting database population script...")
    populate_relationship_types()
    link_competencies_to_capabilities()
    add_dummy_skill_relationships()
    print("Database population script finished.")
