from flask import Blueprint, request, jsonify
from ..models import db, SkillTag
from ..schemas import SkillTagSchema

skilltag_bp = Blueprint('skilltag_api', __name__)
skilltag_schema = SkillTagSchema()
skilltags_schema = SkillTagSchema(many=True)

@skilltag_bp.route('/skill_tags', methods=['GET'])
def get_skill_tags():
    all_skill_tags = SkillTag.query.all()
    return jsonify(skilltags_schema.dump(all_skill_tags))

@skilltag_bp.route('/skill_tags/<string:id>', methods=['GET'])
def get_skill_tag(id):
    skill_tag = SkillTag.query.get(id)
    if not skill_tag:
        return jsonify({"message": "Skill Tag not found"}), 404
    return jsonify(skilltag_schema.dump(skill_tag))

@skilltag_bp.route('/skill_tags', methods=['POST'])
def add_skill_tag():
    try:
        skill_tag_data = skilltag_schema.load(request.json, session=db.session)
        db.session.add(skill_tag_data)
        db.session.commit()
        return jsonify(skilltag_schema.dump(skill_tag_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating skill tag", "details": str(e)}), 400

@skilltag_bp.route('/skill_tags/<string:id>', methods=['PUT'])
def update_skill_tag(id):
    skill_tag = SkillTag.query.get(id)
    if not skill_tag:
        return jsonify({"message": "Skill Tag not found"}), 404
    try:
        skill_tag_data = skilltag_schema.load(request.json, instance=skill_tag, session=db.session, partial=True)
        db.session.commit()
        return jsonify(skilltag_schema.dump(skill_tag_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating skill tag", "details": str(e)}), 400

@skilltag_bp.route('/skill_tags/<string:id>', methods=['DELETE'])
def delete_skill_tag(id):
    skill_tag = SkillTag.query.get(id)
    if not skill_tag:
        return jsonify({"message": "Skill Tag not found"}), 404
    try:
        db.session.delete(skill_tag)
        db.session.commit()
        return jsonify({"message": "Skill Tag deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting skill tag", "details": str(e)}), 400
