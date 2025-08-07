from flask import Blueprint, request, jsonify
from ..models import db, LearningPathResourceAssociation, LearningPath, LearningResource
from ..schemas import LearningPathResourceAssociationSchema

learning_path_resource_association_bp = Blueprint('learning_path_resource_association_api', __name__)
learning_path_resource_association_schema = LearningPathResourceAssociationSchema()
learning_path_resource_associations_schema = LearningPathResourceAssociationSchema(many=True)

@learning_path_resource_association_bp.route('/learning_path_resource_associations', methods=['GET'])
def get_learning_path_resource_associations():
    all_learning_path_resource_associations = LearningPathResourceAssociation.query.all()
    return jsonify(learning_path_resource_associations_schema.dump(all_learning_path_resource_associations))

@learning_path_resource_association_bp.route('/learning_path_resource_associations/<string:id>', methods=['GET'])
def get_learning_path_resource_association(id):
    learning_path_resource_association = LearningPathResourceAssociation.query.get(id)
    if not learning_path_resource_association:
        return jsonify({"message": "Learning Path Resource Association not found"}), 404
    return jsonify(learning_path_resource_association_schema.dump(learning_path_resource_association))

@learning_path_resource_association_bp.route('/learning_path_resource_associations', methods=['POST'])
def add_learning_path_resource_association():
    try:
        data = request.json
        learning_path_id = data.pop('learning_path_id', None)
        learning_resource_id = data.pop('learning_resource_id', None)

        association_data = learning_path_resource_association_schema.load(data, session=db.session)
        
        if learning_path_id:
            learning_path = LearningPath.query.get(learning_path_id)
            if learning_path:
                association_data.learning_path = learning_path
        if learning_resource_id:
            learning_resource = LearningResource.query.get(learning_resource_id)
            if learning_resource:
                association_data.learning_resource = learning_resource

        db.session.add(association_data)
        db.session.commit()
        return jsonify(learning_path_resource_association_schema.dump(association_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating learning path resource association", "details": str(e)}), 400

@learning_path_resource_association_bp.route('/learning_path_resource_associations/<string:id>', methods=['PUT'])
def update_learning_path_resource_association(id):
    association = LearningPathResourceAssociation.query.get(id)
    if not association:
        return jsonify({"message": "Learning Path Resource Association not found"}), 404
    try:
        data = request.json
        learning_path_id = data.pop('learning_path_id', None)
        learning_resource_id = data.pop('learning_resource_id', None)

        association_data = learning_path_resource_association_schema.load(data, instance=association, session=db.session, partial=True)
        
        if learning_path_id is not None:
            learning_path = LearningPath.query.get(learning_path_id)
            if learning_path:
                association_data.learning_path = learning_path
            else:
                association_data.learning_path = None
        if learning_resource_id is not None:
            learning_resource = LearningResource.query.get(learning_resource_id)
            if learning_resource:
                association_data.learning_resource = learning_resource
            else:
                association_data.learning_resource = None

        db.session.commit()
        return jsonify(learning_path_resource_association_schema.dump(association_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating learning path resource association", "details": str(e)}), 400

@learning_path_resource_association_bp.route('/learning_path_resource_associations/<string:id>', methods=['DELETE'])
def delete_learning_path_resource_association(id):
    association = LearningPathResourceAssociation.query.get(id)
    if not association:
        return jsonify({"message": "Learning Path Resource Association not found"}), 404
    try:
        db.session.delete(association)
        db.session.commit()
        return jsonify({"message": "Learning Path Resource Association deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting learning path resource association", "details": str(e)}), 400
