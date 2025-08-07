from flask import Blueprint, request, jsonify
from ..models import db, LearningResource, Skill
from ..schemas import LearningResourceSchema

learning_resource_bp = Blueprint('learning_resource_api', __name__)
learning_resource_schema = LearningResourceSchema()
learning_resources_schema = LearningResourceSchema(many=True)

@learning_resource_bp.route('/learning_resources', methods=['GET'])
def get_learning_resources():
    all_learning_resources = LearningResource.query.all()
    return jsonify(learning_resources_schema.dump(all_learning_resources))

@learning_resource_bp.route('/learning_resources/<string:id>', methods=['GET'])
def get_learning_resource(id):
    learning_resource = LearningResource.query.get(id)
    if not learning_resource:
        return jsonify({"message": "Learning Resource not found"}), 404
    return jsonify(learning_resource_schema.dump(learning_resource))

@learning_resource_bp.route('/learning_resources', methods=['POST'])
def add_learning_resource():
    try:
        data = request.json
        skill_ids = data.pop('skill_ids', [])

        learning_resource_data = learning_resource_schema.load(data, session=db.session)
        
        for skill_id in skill_ids:
            skill = Skill.query.get(skill_id)
            if skill:
                learning_resource_data.skills.append(skill)

        db.session.add(learning_resource_data)
        db.session.commit()
        return jsonify(learning_resource_schema.dump(learning_resource_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating learning resource", "details": str(e)}), 400

@learning_resource_bp.route('/learning_resources/<string:id>', methods=['PUT'])
def update_learning_resource(id):
    learning_resource = LearningResource.query.get(id)
    if not learning_resource:
        return jsonify({"message": "Learning Resource not found"}), 404
    try:
        data = request.json
        skill_ids = data.pop('skill_ids', None)

        learning_resource_data = learning_resource_schema.load(data, instance=learning_resource, session=db.session, partial=True)
        
        if skill_ids is not None:
            learning_resource_data.skills = []
            for skill_id in skill_ids:
                skill = Skill.query.get(skill_id)
                if skill:
                    learning_resource_data.skills.append(skill)

        db.session.commit()
        return jsonify(learning_resource_schema.dump(learning_resource_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating learning resource", "details": str(e)}), 400

@learning_resource_bp.route('/learning_resources/<string:id>', methods=['DELETE'])
def delete_learning_resource(id):
    learning_resource = LearningResource.query.get(id)
    if not learning_resource:
        return jsonify({"message": "Learning Resource not found"}), 404
    try:
        db.session.delete(learning_resource)
        db.session.commit()
        return jsonify({"message": "Learning Resource deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting learning resource", "details": str(e)}), 400
