from flask import Blueprint, render_template, request, jsonify
from models import db, Organization, BusinessUnit, Department, RoleGroup, JobLevel, JobSkill
import json

main = Blueprint('main', __name__)

def model_to_dict(model_instance):
    d = {}
    for column in model_instance.__table__.columns:
        d[column.name] = getattr(model_instance, column.name)
    return d

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/api/data', methods=['GET'])
def get_all_data():
    data = {
        "organizations": [model_to_dict(org) for org in Organization.query.all()],
        "business_units": [model_to_dict(bu) for bu in BusinessUnit.query.all()],
        "departments": [model_to_dict(dept) for dept in Department.query.all()],
        "role_groups": [model_to_dict(rg) for rg in RoleGroup.query.all()],
        "job_levels": [model_to_dict(jl) for jl in JobLevel.query.all()],
        "jobs_skills": [model_to_dict(js) for js in JobSkill.query.all()],
    }
    return jsonify(data)

# --- CRUD Endpoints for Organization ---
@main.route('/api/organizations', methods=['POST'])
def add_organization():
    data = request.json
    new_org = Organization(**data)
    db.session.add(new_org)
    db.session.commit()
    return jsonify(model_to_dict(new_org)), 201

@main.route('/api/organizations/<id>', methods=['PUT'])
def update_organization(id):
    data = request.json
    org = Organization.query.get(id)
    if org:
        for key, value in data.items():
            setattr(org, key, value)
        db.session.commit()
        return jsonify(model_to_dict(org))
    return jsonify({"error": "Organization not found"}), 404

@main.route('/api/organizations/<id>', methods=['DELETE'])
def delete_organization(id):
    org = Organization.query.get(id)
    if org:
        db.session.delete(org)
        db.session.commit()
        return jsonify({"message": "Organization deleted"})
    return jsonify({"error": "Organization not found"}), 404

# --- CRUD Endpoints for BusinessUnit ---
@main.route('/api/business_units', methods=['POST'])
def add_business_unit():
    data = request.json
    new_bu = BusinessUnit(**data)
    db.session.add(new_bu)
    db.session.commit()
    return jsonify(model_to_dict(new_bu)), 201

@main.route('/api/business_units/<id>', methods=['PUT'])
def update_business_unit(id):
    data = request.json
    bu = BusinessUnit.query.get(id)
    if bu:
        for key, value in data.items():
            setattr(bu, key, value)
        db.session.commit()
        return jsonify(model_to_dict(bu))
    return jsonify({"error": "Business Unit not found"}), 404

@main.route('/api/business_units/<id>', methods=['DELETE'])
def delete_business_unit(id):
    bu = BusinessUnit.query.get(id)
    if bu:
        db.session.delete(bu)
        db.session.commit()
        return jsonify({"message": "Business Unit deleted"})
    return jsonify({"error": "Business Unit not found"}), 404

# --- CRUD Endpoints for Department ---
@main.route('/api/departments', methods=['POST'])
def add_department():
    data = request.json
    new_dept = Department(**data)
    db.session.add(new_dept)
    db.session.commit()
    return jsonify(model_to_dict(new_dept)), 201

@main.route('/api/departments/<id>', methods=['PUT'])
def update_department(id):
    data = request.json
    dept = Department.query.get(id)
    if dept:
        for key, value in data.items():
            setattr(dept, key, value)
        db.session.commit()
        return jsonify(model_to_dict(dept))
    return jsonify({"error": "Department not found"}), 404

@main.route('/api/departments/<id>', methods=['DELETE'])
def delete_department(id):
    dept = Department.query.get(id)
    if dept:
        db.session.delete(dept)
        db.session.commit()
        return jsonify({"message": "Department deleted"})
    return jsonify({"error": "Department not found"}), 404

# --- CRUD Endpoints for RoleGroup ---
@main.route('/api/rolegroups', methods=['POST'])
def add_role_group():
    data = request.json
    new_rg = RoleGroup(**data)
    db.session.add(new_rg)
    db.session.commit()
    return jsonify(model_to_dict(new_rg)), 201

@main.route('/api/rolegroups/<id>', methods=['PUT'])
def update_role_group(id):
    data = request.json
    rg = RoleGroup.query.get(id)
    if rg:
        for key, value in data.items():
            setattr(rg, key, value)
        db.session.commit()
        return jsonify(model_to_dict(rg))
    return jsonify({"error": "Role Group not found"}), 404

@main.route('/api/rolegroups/<id>', methods=['DELETE'])
def delete_role_group(id):
    rg = RoleGroup.query.get(id)
    if rg:
        db.session.delete(rg)
        db.session.commit()
        return jsonify({"message": "Role Group deleted"})
    return jsonify({"error": "Role Group not found"}), 404

# --- CRUD Endpoints for JobLevel ---
@main.route('/api/joblevels', methods=['POST'])
def add_job_level():
    data = request.json
    new_jl = JobLevel(**data)
    db.session.add(new_jl)
    db.session.commit()
    return jsonify(model_to_dict(new_jl)), 201

@main.route('/api/joblevels/<id>', methods=['PUT'])
def update_job_level(id):
    data = request.json
    jl = JobLevel.query.get(id)
    if jl:
        for key, value in data.items():
            setattr(jl, key, value)
        db.session.commit()
        return jsonify(model_to_dict(jl))
    return jsonify({"error": "Job Level not found"}), 404

@main.route('/api/joblevels/<id>', methods=['DELETE'])
def delete_job_level(id):
    jl = JobLevel.query.get(id)
    if jl:
        db.session.delete(jl)
        db.session.commit()
        return jsonify({"message": "Job Level deleted"})
    return jsonify({"error": "Job Level not found"}), 404

# --- CRUD Endpoints for JobSkill ---
@main.route('/api/jobs_skills', methods=['POST'])
def add_job_skill():
    data = request.json
    # Handle nested JSON objects for skills
    if 'required_skills' in data and isinstance(data['required_skills'], list):
        data['required_skills'] = json.dumps(data['required_skills'])
    new_js = JobSkill(**data)
    db.session.add(new_js)
    db.session.commit()
    return jsonify(model_to_dict(new_js)), 201

@main.route('/api/jobs_skills/<id>', methods=['PUT'])
def update_job_skill(id):
    data = request.json
    js = JobSkill.query.get(id)
    if js:
        if 'required_skills' in data and isinstance(data['required_skills'], list):
            data['required_skills'] = json.dumps(data['required_skills'])
        for key, value in data.items():
            setattr(js, key, value)
        db.session.commit()
        return jsonify(model_to_dict(js))
    return jsonify({"error": "Job Skill not found"}), 404

@main.route('/api/jobs_skills/<id>', methods=['DELETE'])
def delete_job_skill(id):
    js = JobSkill.query.get(id)
    if js:
        db.session.delete(js)
        db.session.commit()
        return jsonify({"message": "Job Skill deleted"})
    return jsonify({"error": "Job Skill not found"}), 404

@main.route('/step/<step_name>')
def get_step_partial(step_name):
    valid_steps = [
        "organization", "business_units", "departments", "role_groups",
        "job_levels", "jobs_skills", "skill_gaps", "career_paths", "review_ai"
    ]
    if step_name not in valid_steps:
        return "Step not found", 404
    return render_template(f'{step_name}.html')
