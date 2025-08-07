from flask import Blueprint, request, jsonify
from ..models import db, ProjectOrAssignment, Skill
from ..schemas import ProjectOrAssignmentSchema

project_or_assignment_bp = Blueprint('project_or_assignment_api', __name__)
project_or_assignment_schema = ProjectOrAssignmentSchema()
projects_or_assignments_schema = ProjectOrAssignmentSchema(many=True)

@project_or_assignment_bp.route('/projects_or_assignments', methods=['GET'])
def get_projects_or_assignments():
    all_projects_or_assignments = ProjectOrAssignment.query.all()
    return jsonify(projects_or_assignments_schema.dump(all_projects_or_assignments))

@project_or_assignment_bp.route('/projects_or_assignments/<string:id>', methods=['GET'])
def get_project_or_assignment(id):
    project_or_assignment = ProjectOrAssignment.query.get(id)
    if not project_or_assignment:
        return jsonify({"message": "Project or Assignment not found"}), 404
    return jsonify(project_or_assignment_schema.dump(project_or_assignment))

@project_or_assignment_bp.route('/projects_or_assignments', methods=['POST'])
def add_project_or_assignment():
    try:
        data = request.json
        skill_ids = data.pop('skill_ids', [])

        project_or_assignment_data = project_or_assignment_schema.load(data, session=db.session)
        
        for skill_id in skill_ids:
            skill = Skill.query.get(skill_id)
            if skill:
                project_or_assignment_data.skills.append(skill)

        db.session.add(project_or_assignment_data)
        db.session.commit()
        return jsonify(project_or_assignment_schema.dump(project_or_assignment_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating project or assignment", "details": str(e)}), 400

@project_or_assignment_bp.route('/projects_or_assignments/<string:id>', methods=['PUT'])
def update_project_or_assignment(id):
    project_or_assignment = ProjectOrAssignment.query.get(id)
    if not project_or_assignment:
        return jsonify({"message": "Project or Assignment not found"}), 404
    try:
        data = request.json
        skill_ids = data.pop('skill_ids', None)

        project_or_assignment_data = project_or_assignment_schema.load(data, instance=project_or_assignment, session=db.session, partial=True)
        
        if skill_ids is not None:
            project_or_assignment_data.skills = []
            for skill_id in skill_ids:
                skill = Skill.query.get(skill_id)
                if skill:
                    project_or_assignment_data.skills.append(skill)

        db.session.commit()
        return jsonify(project_or_assignment_schema.dump(project_or_assignment_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating project or assignment", "details": str(e)}), 400

@project_or_assignment_bp.route('/projects_or_assignments/<string:id>', methods=['DELETE'])
def delete_project_or_assignment(id):
    project_or_assignment = ProjectOrAssignment.query.get(id)
    if not project_or_assignment:
        return jsonify({"message": "Project or Assignment not found"}), 404
    try:
        db.session.delete(project_or_assignment)
        db.session.commit()
        return jsonify({"message": "Project or Assignment deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting project or assignment", "details": str(e)}), 400
