from flask import Blueprint, request, jsonify, send_from_directory, current_app
from sqlalchemy import or_
from ..models import db, Organization, BusinessUnit, Department, RoleGroup, JobLevel, JobProfile, Skill, Competency, Capability, SkillRelationship, RelationshipType
from ..schemas import SkillSchema, CompetencySchema, CapabilitySchema, SkillRelationshipSchema
import os
import uuid

job_architecture_bp = Blueprint('job_architecture_bp', __name__,
                                template_folder='templates',
                                static_folder='static')

# Initialize schemas
skill_schema = SkillSchema()
skills_schema = SkillSchema(many=True)
competency_schema = CompetencySchema()
competencies_schema = CompetencySchema(many=True)
capability_schema = CapabilitySchema()
capabilities_schema = CapabilitySchema(many=True)
skill_relationship_schema = SkillRelationshipSchema()

def model_to_dict(model_instance):
    d = {}
    for column in model_instance.__table__.columns:
        d[column.name] = getattr(model_instance, column.name)
    return d

@job_architecture_bp.route('/api/data', methods=['GET'])
def get_all_data():
    try:
        data = {
            "organizations": [model_to_dict(org) for org in Organization.query.all()],
            "business_units": [model_to_dict(bu) for bu in BusinessUnit.query.all()],
            "departments": [model_to_dict(dept) for dept in Department.query.all()],
            "role_groups": [model_to_dict(rg) for rg in RoleGroup.query.all()],
            "job_levels": [model_to_dict(jl) for jl in JobLevel.query.all()],
            "job_profiles": [model_to_dict(jp) for jp in JobProfile.query.all()],
        }
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching data: {e}")
        return jsonify({"error": "An unexpected error occurred while fetching data.", "details": str(e)}), 500

# --- AI Wizard Endpoints ---
@job_architecture_bp.route('/api/ontology_elements', methods=['GET'])
def get_ontology_elements():
    """
    Fetches all capabilities, competencies, and skills from the database.
    """
    try:
        capabilities = Capability.query.all()
        competencies = Competency.query.all()
        skills = Skill.query.all()

        return jsonify({
            "capabilities": capabilities_schema.dump(capabilities),
            "competencies": competencies_schema.dump(competencies),
            "skills": skills_schema.dump(skills)
        })
    except Exception as e:
        import traceback
        current_app.logger.error(f"Error fetching ontology elements: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "An unexpected error occurred while fetching ontology elements.", "details": str(e)}), 500

@job_architecture_bp.route('/api/ai/suggest_skills', methods=['POST'])
def suggest_skills():
    """
    Suggests skills based on job title and summary by querying the database.
    """
    data = request.json
    job_title = data.get('job_title', '')
    job_summary = data.get('job_summary', '')

    if not job_title and not job_summary:
        return jsonify({"error": "Job title or summary is required for skill suggestion."}), 400

    search_terms = []
    if job_title:
        search_terms.extend(job_title.lower().split())
    if job_summary:
        search_terms.extend(job_summary.lower().split())

    # Remove duplicates and common stop words if necessary
    search_terms = list(set(search_terms))

    # Build dynamic query for skills
    skill_filters = []
    for term in search_terms:
        skill_filters.append(Skill.name.ilike(f'%{term}%'))
        skill_filters.append(Skill.description.ilike(f'%{term}%'))
        skill_filters.append(Skill.category.ilike(f'%{term}%'))

    suggested_skills_query = Skill.query.filter(or_(*skill_filters)).limit(10)
    suggested_skills = skills_schema.dump(suggested_skills_query.all())

    return jsonify(suggested_skills)

@job_architecture_bp.route('/api/ai/map_skill', methods=['POST'])
def map_skill():
    """
    Maps a suggested skill to an existing Skill, Competency, or Capability in the database.
    Creates a new SkillRelationship if mapping to an existing ontology element.
    """
    data = request.json
    suggested_skill_name = data.get('suggested_skill_name')
    target_id = data.get('target_id')
    target_type = data.get('target_type') # 'skill', 'competency', 'capability'
    relationship_type_id = data.get('relationship_type_id', 'related_to') # Default to 'related_to'

    if not suggested_skill_name or not target_id or not target_type:
        return jsonify({"error": "Missing required fields: suggested_skill_name, target_id, target_type"}), 400

    try:
        # Find or create the suggested skill
        suggested_skill = Skill.query.filter_by(name=suggested_skill_name).first()
        if not suggested_skill:
            suggested_skill = Skill(id=str(uuid.uuid4()), name=suggested_skill_name, description=f"Suggested skill: {suggested_skill_name}")
            db.session.add(suggested_skill)
            db.session.flush() # Flush to get the ID for relationships

        # Find the target ontology element
        target_element = None
        if target_type == 'skill':
            target_element = Skill.query.get(target_id)
        elif target_type == 'competency':
            target_element = Competency.query.get(target_id)
        elif target_type == 'capability':
            target_element = Capability.query.get(target_id)
        else:
            return jsonify({"error": "Invalid target_type. Must be 'skill', 'competency', or 'capability'."}), 400

        if not target_element:
            return jsonify({"error": f"Target {target_type} with ID {target_id} not found."}), 404

        # Create a relationship if mapping to an existing Skill, Competency, or Capability
        if target_type == 'skill':
            # Check if relationship already exists
            existing_relationship = SkillRelationship.query.filter_by(
                source_skill_id=suggested_skill.id,
                target_skill_id=target_element.id,
                relationship_type_id=relationship_type_id
            ).first()
            if existing_relationship:
                return jsonify({"message": "Skill relationship already exists."}), 200

            new_relationship = SkillRelationship(
                source_skill_id=suggested_skill.id,
                target_skill_id=target_element.id,
                relationship_type_id=relationship_type_id
            )
            db.session.add(new_relationship)
        elif target_type == 'competency':
            # Add skill to competency's skills
            if suggested_skill not in target_element.skills:
                target_element.skills.append(suggested_skill)
            else:
                return jsonify({"message": "Skill already associated with this competency."}), 200
        elif target_type == 'capability':
            # This mapping is less direct. A skill maps to a competency, which maps to a capability.
            # For simplicity, we'll just associate the skill with the capability directly for now,
            # or you might choose to create a new competency under the capability and associate the skill.
            # For now, let's assume direct association for demonstration, or return an error if not supported.
            return jsonify({"error": "Direct mapping of skill to capability is not supported. Please map to a competency or skill."}), 400

        db.session.commit()
        return jsonify({"message": f"Skill '{suggested_skill_name}' mapped successfully to {target_type} '{target_element.name}'."})

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error mapping skill: {e}")
        return jsonify({"error": "An unexpected error occurred while mapping skill.", "details": str(e)}), 500

@job_architecture_bp.route('/<path:filename>')
def serve_static(filename):
    base_path = os.path.abspath(os.path.join(current_app.root_path, '..', 'job-architecture'))
    file_path = os.path.abspath(os.path.join(base_path, filename))

    if not file_path.startswith(base_path):
        return "Forbidden", 403

    directory = os.path.dirname(file_path)
    file = os.path.basename(file_path)
    return send_from_directory(directory, file)
