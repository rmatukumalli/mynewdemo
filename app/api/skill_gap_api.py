from flask import Blueprint, request, jsonify
from ..models import db, SkillGap, User, Skill, JobProfile
from ..schemas import SkillGapSchema

skill_gap_bp = Blueprint('skill_gap_api', __name__)
skill_gap_schema = SkillGapSchema()
skill_gaps_schema = SkillGapSchema(many=True)

@skill_gap_bp.route('/skill_gaps', methods=['GET'])
def get_skill_gaps():
    all_skill_gaps = SkillGap.query.all()
    return jsonify(skill_gaps_schema.dump(all_skill_gaps))

@skill_gap_bp.route('/skill_gaps/<string:id>', methods=['GET'])
def get_skill_gap(id):
    skill_gap = SkillGap.query.get(id)
    if not skill_gap:
        return jsonify({"message": "Skill Gap not found"}), 404
    return jsonify(skill_gap_schema.dump(skill_gap))

@skill_gap_bp.route('/skill_gaps', methods=['POST'])
def add_skill_gap():
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        skill_id = data.pop('skill_id', None)
        job_profile_id = data.pop('job_profile_id', None)

        skill_gap_data = skill_gap_schema.load(data, session=db.session)
        
        if user_id:
            user = User.query.get(user_id)
            if user:
                skill_gap_data.user = user
        if skill_id:
            skill = Skill.query.get(skill_id)
            if skill:
                skill_gap_data.skill = skill
        if job_profile_id:
            job_profile = JobProfile.query.get(job_profile_id)
            if job_profile:
                skill_gap_data.job_profile = job_profile

        db.session.add(skill_gap_data)
        db.session.commit()
        return jsonify(skill_gap_schema.dump(skill_gap_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating skill gap", "details": str(e)}), 400

@skill_gap_bp.route('/skill_gaps/<string:id>', methods=['PUT'])
def update_skill_gap(id):
    skill_gap = SkillGap.query.get(id)
    if not skill_gap:
        return jsonify({"message": "Skill Gap not found"}), 404
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        skill_id = data.pop('skill_id', None)
        job_profile_id = data.pop('job_profile_id', None)

        skill_gap_data = skill_gap_schema.load(data, instance=skill_gap, session=db.session, partial=True)
        
        if user_id is not None:
            user = User.query.get(user_id)
            if user:
                skill_gap_data.user = user
            else:
                skill_gap_data.user = None
        if skill_id is not None:
            skill = Skill.query.get(skill_id)
            if skill:
                skill_gap_data.skill = skill
            else:
                skill_gap_data.skill = None
        if job_profile_id is not None:
            job_profile = JobProfile.query.get(job_profile_id)
            if job_profile:
                skill_gap_data.job_profile = job_profile
            else:
                skill_gap_data.job_profile = None

        db.session.commit()
        return jsonify(skill_gap_schema.dump(skill_gap_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating skill gap", "details": str(e)}), 400

@skill_gap_bp.route('/skill_gaps/<string:id>', methods=['DELETE'])
def delete_skill_gap(id):
    skill_gap = SkillGap.query.get(id)
    if not skill_gap:
        return jsonify({"message": "Skill Gap not found"}), 404
    try:
        db.session.delete(skill_gap)
        db.session.commit()
        return jsonify({"message": "Skill Gap deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting skill gap", "details": str(e)}), 400
