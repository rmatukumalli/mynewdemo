from flask import Blueprint, request, jsonify
from ..models import db, SkillRelationship, Skill, RelationshipType
from ..schemas import SkillRelationshipSchema

skill_relationship_bp = Blueprint('skill_relationship_api', __name__)
skill_relationship_schema = SkillRelationshipSchema()
skill_relationships_schema = SkillRelationshipSchema(many=True)

@skill_relationship_bp.route('/skill_relationships', methods=['GET'])
def get_skill_relationships():
    all_skill_relationships = SkillRelationship.query.all()
    return jsonify(skill_relationships_schema.dump(all_skill_relationships))

@skill_relationship_bp.route('/skill_relationships/<string:id>', methods=['GET'])
def get_skill_relationship(id):
    skill_relationship = SkillRelationship.query.get(id)
    if not skill_relationship:
        return jsonify({"message": "Skill Relationship not found"}), 404
    return jsonify(skill_relationship_schema.dump(skill_relationship))

@skill_relationship_bp.route('/skill_relationships', methods=['POST'])
def add_skill_relationship():
    try:
        data = request.json
        source_skill_id = data.pop('source_skill_id', None)
        target_skill_id = data.pop('target_skill_id', None)
        relationship_type_id = data.pop('relationship_type_id', None)

        skill_relationship_data = skill_relationship_schema.load(data, session=db.session)
        
        if source_skill_id:
            source_skill = Skill.query.get(source_skill_id)
            if source_skill:
                skill_relationship_data.source_skill = source_skill
        if target_skill_id:
            target_skill = Skill.query.get(target_skill_id)
            if target_skill:
                skill_relationship_data.target_skill = target_skill
        if relationship_type_id:
            relationship_type = RelationshipType.query.get(relationship_type_id)
            if relationship_type:
                skill_relationship_data.relationship_type = relationship_type

        db.session.add(skill_relationship_data)
        db.session.commit()
        return jsonify(skill_relationship_schema.dump(skill_relationship_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating skill relationship", "details": str(e)}), 400

@skill_relationship_bp.route('/skill_relationships/<string:id>', methods=['PUT'])
def update_skill_relationship(id):
    skill_relationship = SkillRelationship.query.get(id)
    if not skill_relationship:
        return jsonify({"message": "Skill Relationship not found"}), 404
    try:
        data = request.json
        source_skill_id = data.pop('source_skill_id', None)
        target_skill_id = data.pop('target_skill_id', None)
        relationship_type_id = data.pop('relationship_type_id', None)

        skill_relationship_data = skill_relationship_schema.load(data, instance=skill_relationship, session=db.session, partial=True)
        
        if source_skill_id is not None:
            source_skill = Skill.query.get(source_skill_id)
            if source_skill:
                skill_relationship_data.source_skill = source_skill
            else:
                skill_relationship_data.source_skill = None
        if target_skill_id is not None:
            target_skill = Skill.query.get(target_skill_id)
            if target_skill:
                skill_relationship_data.target_skill = target_skill
            else:
                skill_relationship_data.target_skill = None
        if relationship_type_id is not None:
            relationship_type = RelationshipType.query.get(relationship_type_id)
            if relationship_type:
                skill_relationship_data.relationship_type = relationship_type
            else:
                skill_relationship_data.relationship_type = None

        db.session.commit()
        return jsonify(skill_relationship_schema.dump(skill_relationship_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating skill relationship", "details": str(e)}), 400

@skill_relationship_bp.route('/skill_relationships/<string:id>', methods=['DELETE'])
def delete_skill_relationship(id):
    skill_relationship = SkillRelationship.query.get(id)
    if not skill_relationship:
        return jsonify({"message": "Skill Relationship not found"}), 404
    try:
        db.session.delete(skill_relationship)
        db.session.commit()
        return jsonify({"message": "Skill Relationship deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting skill relationship", "details": str(e)}), 400
