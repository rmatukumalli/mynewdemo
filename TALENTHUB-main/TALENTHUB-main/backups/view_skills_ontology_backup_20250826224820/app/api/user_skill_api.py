from flask import Blueprint, request, jsonify
from ..models import db, UserSkill, User, Skill, Proficiency
from ..schemas import UserSkillSchema

user_skill_bp = Blueprint('user_skill_api', __name__)
user_skill_schema = UserSkillSchema()
user_skills_schema = UserSkillSchema(many=True)

@user_skill_bp.route('/user_skills', methods=['GET'])
def get_user_skills():
    all_user_skills = UserSkill.query.all()
    return jsonify(user_skills_schema.dump(all_user_skills))

@user_skill_bp.route('/user_skills/<string:id>', methods=['GET'])
def get_user_skill(id):
    user_skill = UserSkill.query.get(id)
    if not user_skill:
        return jsonify({"message": "User Skill not found"}), 404
    return jsonify(user_skill_schema.dump(user_skill))

@user_skill_bp.route('/user_skills', methods=['POST'])
def add_user_skill():
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        skill_id = data.pop('skill_id', None)
        proficiency_id = data.pop('proficiency_id', None)

        user_skill_data = user_skill_schema.load(data, session=db.session)
        
        if user_id:
            user = User.query.get(user_id)
            if user:
                user_skill_data.user = user
        if skill_id:
            skill = Skill.query.get(skill_id)
            if skill:
                user_skill_data.skill = skill
        if proficiency_id:
            proficiency = Proficiency.query.get(proficiency_id)
            if proficiency:
                user_skill_data.proficiency = proficiency

        db.session.add(user_skill_data)
        db.session.commit()
        return jsonify(user_skill_schema.dump(user_skill_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user skill", "details": str(e)}), 400

@user_skill_bp.route('/user_skills/<string:id>', methods=['PUT'])
def update_user_skill(id):
    user_skill = UserSkill.query.get(id)
    if not user_skill:
        return jsonify({"message": "User Skill not found"}), 404
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        skill_id = data.pop('skill_id', None)
        proficiency_id = data.pop('proficiency_id', None)

        user_skill_data = user_skill_schema.load(data, instance=user_skill, session=db.session, partial=True)
        
        if user_id is not None:
            user = User.query.get(user_id)
            if user:
                user_skill_data.user = user
            else:
                user_skill_data.user = None
        if skill_id is not None:
            skill = Skill.query.get(skill_id)
            if skill:
                user_skill_data.skill = skill
            else:
                user_skill_data.skill = None
        if proficiency_id is not None:
            proficiency = Proficiency.query.get(proficiency_id)
            if proficiency:
                user_skill_data.proficiency = proficiency
            else:
                user_skill_data.proficiency = None

        db.session.commit()
        return jsonify(user_skill_schema.dump(user_skill_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user skill", "details": str(e)}), 400

@user_skill_bp.route('/user_skills/<string:id>', methods=['DELETE'])
def delete_user_skill(id):
    user_skill = UserSkill.query.get(id)
    if not user_skill:
        return jsonify({"message": "User Skill not found"}), 404
    try:
        db.session.delete(user_skill)
        db.session.commit()
        return jsonify({"message": "User Skill deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user skill", "details": str(e)}), 400
