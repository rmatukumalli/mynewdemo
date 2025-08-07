from flask import Blueprint, request, jsonify
from app import db, ma
from app.models import Capability, Competency, Behavior, Skill, Proficiency, RelationshipType, SkillRelationship
from app.schemas import CapabilitySchema, CompetencySchema, BehaviorSchema, SkillSchema, ProficiencySchema, RelationshipTypeSchema, SkillRelationshipSchema, SkillHierarchySchema
from sqlalchemy.orm import joinedload, selectinload

ontology_bp = Blueprint('ontology_bp', __name__, url_prefix='/api/v1/ontology')

# Initialize schemas
capability_schema = CapabilitySchema()
capabilities_schema = CapabilitySchema(many=True)
competency_schema = CompetencySchema()
competencies_schema = CompetencySchema(many=True)
behavior_schema = BehaviorSchema()
behaviors_schema = BehaviorSchema(many=True)
skill_schema = SkillSchema()
skills_schema = SkillSchema(many=True)
proficiency_schema = ProficiencySchema()
proficiencies_schema = ProficiencySchema(many=True)
relationship_type_schema = RelationshipTypeSchema()
relationship_types_schema = RelationshipTypeSchema(many=True)
skill_relationship_schema = SkillRelationshipSchema()
skill_relationships_schema = SkillRelationshipSchema(many=True)
skill_hierarchy_schema = SkillHierarchySchema()


@ontology_bp.route('/capabilities', methods=['GET'])
def get_capabilities():
    """
    Fetches all capabilities and sorts them based on a predefined relevance order.
    Capabilities not in the predefined list are sorted alphabetically and appended.
    """
    try:
        # Predefined order of capability IDs for relevance
        relevance_order = [
            "product_and_business",
            "data_and_ai",
            "engineering_and_it",
            "security_and_compliance",
            "leadership_and_management",
            "professional_skills"
        ]
        
        capabilities = Capability.query.all()
        
        # Create a dictionary for quick lookups
        capability_dict = {cap.id: cap for cap in capabilities}
        
        # Separate into ordered and unordered lists
        ordered_capabilities = []
        unordered_capabilities = []
        
        # Populate the ordered list based on relevance_order
        for cap_id in relevance_order:
            if cap_id in capability_dict:
                ordered_capabilities.append(capability_dict.pop(cap_id))
        
        # Any remaining capabilities are sorted alphabetically by name
        remaining_capabilities = sorted(capability_dict.values(), key=lambda x: x.name)
        
        # Combine the lists
        sorted_capabilities = ordered_capabilities + remaining_capabilities
        
        return jsonify(capabilities_schema.dump(sorted_capabilities))
        
    except Exception as e:
        import traceback
        from flask import current_app
        current_app.logger.error(f"Error fetching and sorting capabilities: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An unexpected error occurred while fetching capabilities.", "details": str(e)}), 500

@ontology_bp.route('/capabilities/<string:capability_id>/competencies', methods=['GET'])
def get_competencies_by_capability(capability_id):
    try:
        capability = Capability.query.get(capability_id)
        if not capability:
            return jsonify({"error": "Capability not found"}), 404
        return jsonify(competencies_schema.dump(capability.competencies))
    except Exception as e:
        import traceback
        from flask import current_app
        current_app.logger.error(f"Error fetching competencies for capability {capability_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500

@ontology_bp.route('/competencies/<string:competency_id>/behaviors', methods=['GET'])
def get_behaviors_by_competency(competency_id):
    try:
        competency = Competency.query.get(competency_id)
        if not competency:
            return jsonify({"error": "Competency not found"}), 404
        return jsonify(behaviors_schema.dump(competency.behaviors))
    except Exception as e:
        import traceback
        from flask import current_app
        current_app.logger.error(f"Error fetching behaviors for competency {competency_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500

@ontology_bp.route('/competencies/<string:competency_id>/skills', methods=['GET'])
def get_skills_by_competency(competency_id):
    try:
        competency = Competency.query.get(competency_id)
        if not competency:
            return jsonify({"error": "Competency not found"}), 404
        return jsonify(skills_schema.dump(competency.skills))
    except Exception as e:
        import traceback
        from flask import current_app
        current_app.logger.error(f"Error fetching skills for competency {competency_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500

@ontology_bp.route('/proficiencies', methods=['GET'])
def get_proficiencies():
    # Removed selectinload for stability
    proficiencies = Proficiency.query.all()
    return jsonify(proficiencies_schema.dump(proficiencies))

@ontology_bp.route('/relationship_types', methods=['GET'])
def get_relationship_types():
    relationship_types = RelationshipType.query.all()
    return jsonify(relationship_types_schema.dump(relationship_types))

@ontology_bp.route('/skills/<string:skill_id>/relationships', methods=['GET'])
def get_skill_relationships(skill_id):
    """
    Fetches all relationships for a given skill, where the skill is either the source or target.
    """
    try:
        skill = Skill.query.get(skill_id)
        if not skill:
            return jsonify({"error": f"Skill with ID {skill_id} not found."}), 404

        # Get relationships where the skill is the source or target, eagerly loading related data
        all_relationships = SkillRelationship.query.options(
            selectinload(SkillRelationship.source_skill),
            selectinload(SkillRelationship.target_skill),
            selectinload(SkillRelationship.relationship_type)
        ).filter(
            (SkillRelationship.source_skill_id == skill_id) | 
            (SkillRelationship.target_skill_id == skill_id)
        ).all()
        
        # Use the schema to dump the relationships
        result = skill_relationships_schema.dump(all_relationships)
        
        return jsonify(result)
    except Exception as e:
        import traceback
        from flask import current_app
        current_app.logger.error(f"Error fetching skill relationships for {skill_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An unexpected error occurred while fetching skill relationships.", "details": str(e)}), 500

@ontology_bp.route('/skill_relationships', methods=['GET'])
def get_all_skill_relationships(): # Renamed to avoid conflict with the new route
    skill_relationships = SkillRelationship.query.options(
        selectinload(SkillRelationship.source_skill),
        selectinload(SkillRelationship.target_skill),
        selectinload(SkillRelationship.relationship_type)
    ).all()
    return jsonify(skill_relationships_schema.dump(skill_relationships))

# You can add POST, PUT, DELETE methods for each resource as needed.
# Example for adding a new skill:
@ontology_bp.route('/skills', methods=['POST'])
def add_skill():
    try:
        skill_data = skill_schema.load(request.json, session=db.session)
        db.session.add(skill_data)
        db.session.commit()
        return jsonify(skill_schema.dump(skill_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@ontology_bp.route('/skills/<string:skill_id>/details_full', methods=['GET'])
def get_skill_details_full(skill_id):
    """
    Fetches a skill with all its associated relationships (source and target).
    """
    try:
        skill = Skill.query.options(
            selectinload(Skill.proficiencies),
            selectinload(Skill.competencies),
            selectinload(Skill.source_relationships).selectinload(SkillRelationship.target_skill),
            selectinload(Skill.source_relationships).selectinload(SkillRelationship.relationship_type),
            selectinload(Skill.target_relationships).selectinload(SkillRelationship.source_skill),
            selectinload(Skill.target_relationships).selectinload(SkillRelationship.relationship_type)
        ).get(skill_id)

        if not skill:
            return jsonify({"error": f"Skill with ID {skill_id} not found."}), 404

        # Use the schema to dump the skill data, which will handle all relationships
        result = skill_schema.dump(skill)
        return jsonify(result)

    except Exception as e:
        import traceback
        from flask import current_app
        current_app.logger.error(f"Error fetching focused skill details for {skill_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An unexpected error occurred while fetching focused skill details.", "details": str(e)}), 500

@ontology_bp.route('/skills/<string:skill_id>/hierarchy', methods=['GET'])
def get_skill_hierarchy(skill_id):
    """
    Fetches a comprehensive hierarchy for a given skill, including its parents,
    children, siblings, grandparents, and associated competencies, capabilities,
    behaviors, and proficiencies.
    """
    try:
        skill = Skill.query.options(
            selectinload(Skill.proficiencies),
            selectinload(Skill.competencies).selectinload(Competency.capabilities),
            selectinload(Skill.competencies).selectinload(Competency.behaviors),
            selectinload(Skill.source_relationships).selectinload(SkillRelationship.target_skill),
            selectinload(Skill.target_relationships).selectinload(SkillRelationship.source_skill)
        ).get(skill_id)

        if not skill:
            return jsonify({"error": f"Skill with ID {skill_id} not found."}), 404

        # Initialize data structure
        hierarchy_data = {
            "id": skill.id,
            "name": skill.name,
            "category": skill.category,
            "description": skill.description,
            "parents": [],
            "children": [],
            "siblings": set(),
            "grandparents": set(),
            "competencies": list(skill.competencies),
            "capabilities": set(),
            "behaviors": set(),
            "proficiencies": list(skill.proficiencies),
            "related_skills": skill.source_relationships + skill.target_relationships
        }

        # Gather competencies, capabilities, and behaviors
        for comp in skill.competencies:
            hierarchy_data["capabilities"].update(comp.capabilities)
            hierarchy_data["behaviors"].update(comp.behaviors)

        # Process relationships
        parents = [rel.source_skill for rel in skill.target_relationships if rel.relationship_type_id == 'is_child_of']
        children = [rel.target_skill for rel in skill.source_relationships if rel.relationship_type_id == 'is_child_of']
        
        hierarchy_data["parents"] = parents
        hierarchy_data["children"] = children

        # Calculate siblings and grandparents
        for parent in parents:
            # Grandparents are parents of the parent
            grandparents_of_parent = [rel.source_skill for rel in parent.target_relationships if rel.relationship_type_id == 'is_child_of']
            hierarchy_data["grandparents"].update(grandparents_of_parent)
            
            # Siblings are other children of the parent
            siblings_of_parent = [rel.target_skill for rel in parent.source_relationships if rel.relationship_type_id == 'is_child_of' and rel.target_skill_id != skill_id]
            hierarchy_data["siblings"].update(siblings_of_parent)

        # Convert sets to lists for JSON serialization
        hierarchy_data["siblings"] = list(hierarchy_data["siblings"])
        hierarchy_data["grandparents"] = list(hierarchy_data["grandparents"])
        hierarchy_data["capabilities"] = list(hierarchy_data["capabilities"])
        hierarchy_data["behaviors"] = list(hierarchy_data["behaviors"])

        # Serialize the data
        result = skill_hierarchy_schema.dump(hierarchy_data)
        
        return jsonify(result)

    except Exception as e:
        import traceback
        from flask import current_app
        current_app.logger.error(f"Error fetching skill hierarchy for {skill_id}: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An unexpected error occurred while fetching the skill hierarchy.", "details": str(e)}), 500

# Example for adding a new skill relationship
@ontology_bp.route('/skill_relationships', methods=['POST'])
def add_skill_relationship():
    try:
        relationship_data = skill_relationship_schema.load(request.json, session=db.session)
        db.session.add(relationship_data)
        db.session.commit()
        return jsonify(skill_relationship_schema.dump(relationship_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
