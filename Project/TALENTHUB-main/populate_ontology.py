import os
import json
from app import create_app, db
from app.models import Capability, Competency, Behavior, Skill, RelationshipType, SkillRelationship

# Create a Flask app context
app = create_app()
app.app_context().push()

def populate_ontology_data():
    print("Starting ontology data population from competency-skills-behavior-batch1.json...")

    # Clear existing data (optional, for fresh runs)
    # with app.app_context():
    #     db.drop_all()
    #     db.create_all()

    # Define relationship types (these are generic and can remain)
    relationship_types_data = [
        {"id": "related_to", "name": "Related to", "description": "Indicates a general connection or relevance."},
        {"id": "similar_to", "name": "Similar to", "description": "Indicates functional equivalence or strong resemblance."},
        {"id": "alternative_to", "name": "Alternative to", "description": "Indicates a viable substitute or different approach."},
        {"id": "co_occurs_with", "name": "Co-occurs with", "description": "Skills or behaviors that frequently appear together."},
        {"id": "requires", "name": "Requires", "description": "Skill A requires Skill B as a prerequisite."},
        {"id": "is_required_by", "name": "Is required by", "description": "Skill A is required by Skill B (inverse of 'requires')."},
        {"id": "prerequisite_of", "name": "Prerequisite of", "description": "Skill A is a prerequisite for Skill B."},
        {"id": "has_prerequisite", "name": "Has prerequisite", "description": "Skill A has Skill B as a prerequisite (inverse of 'prerequisite of')."},
        {"id": "used_for", "name": "Used for", "description": "Skill A is used for performing Task/Skill B."},
        {"id": "uses", "name": "Uses", "description": "Skill A utilizes Skill B or a concept from Skill B."},
        {"id": "enables", "name": "Enables", "description": "Skill A enables the execution or development of Skill B."},
        {"id": "is_enabled_by", "name": "Is enabled by", "description": "Skill A is enabled by Skill B (inverse of 'enables')."},
        {"id": "leads_to", "name": "Leads to", "description": "Mastering Skill A can lead to Skill B."},
        {"id": "progresses_to", "name": "Progresses to", "description": "Skill A is a foundational step that progresses to Skill B."},
        {"id": "builds_on", "name": "Builds on", "description": "Skill A builds upon the concepts or foundations of Skill B."},
        {"id": "is_foundational_for", "name": "Is foundational for", "description": "Skill A is foundational for Skill B (inverse of 'builds on')."},
        {"id": "part_of", "name": "Part of", "description": "Skill A is a component or sub-skill of Skill B."},
        {"id": "has_part", "name": "Has part", "description": "Skill A comprises Skill B as a component (inverse of 'part of')."},
        {"id": "combination_of", "name": "Combination of", "description": "Skill A is a combination of Skill B and Skill C."},
        {"id": "equivalent_to", "name": "Equivalent to", "description": "Skill A is functionally equivalent to Skill B."},
        {"id": "inverse_of", "name": "Inverse of", "description": "Skill A is the inverse relationship of Skill B."},
        {"id": "precedes", "name": "Precedes", "description": "Skill A typically comes before Skill B in a workflow or learning path."},
        {"id": "follows", "name": "Follows", "description": "Skill A typically comes after Skill B in a workflow or learning path (inverse of 'precedes')."},
        {"id": "is_applicable_in", "name": "Is applicable in", "description": "Skill A is applied within the context of Skill B or a domain."},
        {"id": "is_used_in", "name": "Is used in", "description": "Skill A is a tool or method used in Skill B."},
        {"id": "approach_within", "name": "Approach within", "description": "Skill A is an approach or methodology used within Skill B."}
    ]

    existing_relationship_types = {rt.id: rt for rt in RelationshipType.query.all()}
    for rt_data in relationship_types_data:
        if rt_data["id"] not in existing_relationship_types:
            rt = RelationshipType(id=rt_data["id"], name=rt_data["name"], description=rt_data["description"])
            db.session.add(rt)
            print(f"Added RelationshipType: {rt.name}")
    db.session.commit()
    print("Relationship types populated.")

    # Load data from competency-skills-behavior-batch1.json
    project_root = os.path.abspath(os.path.dirname(__file__))
    data_path = os.path.join(project_root, 'competency-skills-behavior-batch1.json')
    
    try:
        with open(data_path, 'r') as f:
            json_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: {data_path} not found. Please ensure competency-skills-behavior-batch1.json exists in the root directory.")
        return

    # Simple mapping for capabilities based on competency names for initial population
    # This can be refined if a more complex capability structure is needed
    competency_to_capability_map = {
        "Aircraft Maintenance": "Maintenance & Engineering",
        "Backend Development": "Technology & Data",
        "Brand Management": "Marketing & Sales",
        "Budgeting & Forecasting": "Finance & Accounting",
        "Business Strategy": "Product & Business",
        "Cabin Operations": "Flight Operations",
        "Cloud & DevOps": "Technology & Data",
        "Customer Data Analysis": "Customer Experience",
        "Customer Service": "Customer Experience",
        "Customer Service Excellence": "Customer Experience",
        "Data & Analytics": "Technology & Data",
        "Design Thinking": "Product & Business",
        "DevOps & Infrastructure": "Technology & Data",
        "Financial Reporting": "Finance & Accounting",
        "Flight Crew Operations": "Flight Operations",
        "Frontend Development": "Technology & Data",
        "IT Infrastructure Management": "Technology & Data",
        "Ideation & Concept Generation": "Product & Business",
        "Innovation Management": "Product & Business",
        "Logistics & Distribution": "Operations",
        "Market Analysis": "Marketing & Sales",
        "Performance Management": "Human Resources",
        "Process Optimization": "Operations",
        "Product Management": "Product & Business",
        "Project Management": "Product & Business",
        "Quality Assurance": "Operations",
        "Regulatory Compliance": "Safety & Compliance",
        "Safety Management": "Safety & Compliance",
        "Sales Strategy & Execution": "Marketing & Sales",
        "Scientific Research": "Research & Development",
        "Service Design": "Customer Experience",
        "Software Design & Architecture": "Technology & Data",
        "Software Development": "Technology & Data",
        "Software Development Lifecycle (SDLC)": "Technology & Data",
        "Software Testing & Quality Assurance": "Technology & Data",
        "Supplier Relationship Management": "Operations",
        "Systems Engineering": "Maintenance & Engineering",
        "Talent Acquisition": "Human Resources",
        "Uncategorized": "General",
        "Vision & Goal Setting": "Leadership"
    }

    capabilities_map = {} # {name: Capability_obj}
    competencies_map = {} # {id: Competency_obj}
    skills_map = {} # {id: Skill_obj}
    behaviors_map = {} # {id: Behavior_obj}

    # First pass: Populate Capabilities and Competencies
    for comp_data in json_data:
        comp_name = comp_data['competency_name']
        comp_id = comp_data['competency_id']
        
        # Determine capability for the current competency
        cap_name = competency_to_capability_map.get(comp_name, "General")
        cap_id = cap_name.lower().replace(" ", "_").replace("&", "and").replace("-", "_")

        capability = capabilities_map.get(cap_name)
        if not capability:
            capability = Capability.query.get(cap_id)
            if not capability:
                capability = Capability(id=cap_id, name=cap_name, description=f"Capability: {cap_name}")
                db.session.add(capability)
                print(f"Added Capability: {cap_name}")
            capabilities_map[cap_name] = capability
        
        competency = Competency.query.get(comp_id)
        if not competency:
            competency = Competency(id=comp_id, name=comp_name, description=f"Competency: {comp_name}")
            db.session.add(competency)
            print(f"Added Competency: {comp_name}")
        
        if capability not in competency.capabilities:
            competency.capabilities.append(capability)
        competencies_map[comp_id] = competency
    
    db.session.commit()
    print("Capabilities and Competencies populated.")

    # Second pass: Populate Skills and Behaviors
    for comp_data in json_data:
        comp_id = comp_data['competency_id']
        competency = competencies_map.get(comp_id)

        if not competency:
            print(f"Warning: Competency '{comp_id}' not found in map. Skipping skills/behaviors for it.")
            continue

        for skill_data in comp_data.get('skills', []):
            skill_id = skill_data['skill_id']
            skill_name = skill_data['skill_name']
            
            # Check if skill exists by name first to avoid unique constraint error
            skill = Skill.query.filter_by(name=skill_name).first()
            if not skill:
                skill = Skill(name=skill_name, description=f"Skill: {skill_name}", custom_fields={})
                db.session.add(skill)
                print(f"Added Skill: {skill_name} (new) under {competency.name}")

            if competency not in skill.competencies:
                skill.competencies.append(competency)
            skills_map[skill_id] = skill # Store by the ID from the JSON for relationships later

        for behavior_data in comp_data.get('behaviors', []):
            behavior_id = behavior_data['behavior_id']
            behavior_name = behavior_data['behavior_name']

            behavior = Behavior.query.get(behavior_id)
            if not behavior:
                behavior = Behavior(id=behavior_id, name=behavior_name, description=f"Behavior: {behavior_name}", competency=competency)
                db.session.add(behavior)
                behaviors_map[behavior_id] = behavior
                print(f"Added Behavior: {behavior_name} under {competency.name}")
            else:
                behaviors_map[behavior_id] = behavior
    
    db.session.commit()
    print("Skills and Behaviors populated.")

    # --- Populate Skill Relationships (if any, from the original data.json structure) ---
    # The provided competency-skills-behavior-batch1.json does not contain explicit relationships
    # If relationships are needed, they would need to be defined or inferred from another source.
    print("Skipping skill relationship population as no explicit relationships are defined in the provided JSON.")
    print("Ontology data population complete.")

if __name__ == '__main__':
    populate_ontology_data()
