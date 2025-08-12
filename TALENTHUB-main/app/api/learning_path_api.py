from flask import Blueprint, request, jsonify
from ..models import db, LearningPath, Skill, LearningResource
from ..schemas import LearningPathSchema

learning_path_bp = Blueprint('learning_path_api', __name__)
learning_path_schema = LearningPathSchema()
learning_paths_schema = LearningPathSchema(many=True)

@learning_path_bp.route('/learning_paths', methods=['GET'])
def get_learning_paths():
    all_learning_paths = LearningPath.query.all()
    return jsonify(learning_paths_schema.dump(all_learning_paths))

@learning_path_bp.route('/learning_paths/<string:id>', methods=['GET'])
def get_learning_path(id):
    learning_path = LearningPath.query.get(id)
    if not learning_path:
        return jsonify({"message": "Learning Path not found"}), 404
    return jsonify(learning_path_schema.dump(learning_path))

@learning_path_bp.route('/learning_paths', methods=['POST'])
def add_learning_path():
    try:
        data = request.json
        skill_ids = data.pop('skill_ids', [])
        resource_ids = data.pop('resource_ids', [])

        learning_path_data = learning_path_schema.load(data, session=db.session)
        
        for skill_id in skill_ids:
            skill = Skill.query.get(skill_id)
            if skill:
                learning_path_data.skills.append(skill)
        
        for resource_id in resource_ids:
            resource = LearningResource.query.get(resource_id)
            if resource:
                learning_path_data.resources.append(resource)

        db.session.add(learning_path_data)
        db.session.commit()
        return jsonify(learning_path_schema.dump(learning_path_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating learning path", "details": str(e)}), 400

@learning_path_bp.route('/learning_paths/<string:id>', methods=['PUT'])
def update_learning_path(id):
    learning_path = LearningPath.query.get(id)
    if not learning_path:
        return jsonify({"message": "Learning Path not found"}), 404
    try:
        data = request.json
        skill_ids = data.pop('skill_ids', None)
        resource_ids = data.pop('resource_ids', None)

        learning_path_data = learning_path_schema.load(data, instance=learning_path, session=db.session, partial=True)
        
        if skill_ids is not None:
            learning_path_data.skills = []
            for skill_id in skill_ids:
                skill = Skill.query.get(skill_id)
                if skill:
                    learning_path_data.skills.append(skill)
        
        if resource_ids is not None:
            learning_path_data.resources = []
            for resource_id in resource_ids:
                resource = LearningResource.query.get(resource_id)
                if resource:
                    learning_path_data.resources.append(resource)

        db.session.commit()
        return jsonify(learning_path_schema.dump(learning_path_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating learning path", "details": str(e)}), 400

@learning_path_bp.route('/learning_paths/<string:id>', methods=['DELETE'])
def delete_learning_path(id):
    learning_path = LearningPath.query.get(id)
    if not learning_path:
        return jsonify({"message": "Learning Path not found"}), 404
    try:
        db.session.delete(learning_path)
        db.session.commit()
        return jsonify({"message": "Learning Path deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting learning path", "details": str(e)}), 400
