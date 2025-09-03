from flask import Blueprint, request, jsonify
from ..models import db, RelationshipType
from ..schemas import RelationshipTypeSchema

relationship_type_bp = Blueprint('relationship_type_api', __name__)
relationship_type_schema = RelationshipTypeSchema()
relationship_types_schema = RelationshipTypeSchema(many=True)

@relationship_type_bp.route('/relationship_types', methods=['GET'])
def get_relationship_types():
    all_relationship_types = RelationshipType.query.all()
    return jsonify(relationship_types_schema.dump(all_relationship_types))

@relationship_type_bp.route('/relationship_types/<string:id>', methods=['GET'])
def get_relationship_type(id):
    relationship_type = RelationshipType.query.get(id)
    if not relationship_type:
        return jsonify({"message": "Relationship Type not found"}), 404
    return jsonify(relationship_type_schema.dump(relationship_type))

@relationship_type_bp.route('/relationship_types', methods=['POST'])
def add_relationship_type():
    try:
        relationship_type_data = relationship_type_schema.load(request.json, session=db.session)
        db.session.add(relationship_type_data)
        db.session.commit()
        return jsonify(relationship_type_schema.dump(relationship_type_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating relationship type", "details": str(e)}), 400

@relationship_type_bp.route('/relationship_types/<string:id>', methods=['PUT'])
def update_relationship_type(id):
    relationship_type = RelationshipType.query.get(id)
    if not relationship_type:
        return jsonify({"message": "Relationship Type not found"}), 404
    try:
        relationship_type_data = relationship_type_schema.load(request.json, instance=relationship_type, session=db.session, partial=True)
        db.session.commit()
        return jsonify(relationship_type_schema.dump(relationship_type_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating relationship type", "details": str(e)}), 400

@relationship_type_bp.route('/relationship_types/<string:id>', methods=['DELETE'])
def delete_relationship_type(id):
    relationship_type = RelationshipType.query.get(id)
    if not relationship_type:
        return jsonify({"message": "Relationship Type not found"}), 404
    try:
        db.session.delete(relationship_type)
        db.session.commit()
        return jsonify({"message": "Relationship Type deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting relationship type", "details": str(e)}), 400
