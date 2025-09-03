from flask import Blueprint, request, jsonify
from ..models import db, JobProfile, Skill
from ..schemas import JobProfileSchema

jobprofile_bp = Blueprint('jobprofile_api', __name__)
jobprofile_schema = JobProfileSchema()
jobprofiles_schema = JobProfileSchema(many=True)

@jobprofile_bp.route('/job_profiles', methods=['GET'])
def get_job_profiles():
    all_job_profiles = JobProfile.query.all()
    return jsonify(jobprofiles_schema.dump(all_job_profiles))

@jobprofile_bp.route('/job_profiles/<string:id>', methods=['GET'])
def get_job_profile(id):
    job_profile = JobProfile.query.get(id)
    if not job_profile:
        return jsonify({"message": "Job Profile not found"}), 404
    return jsonify(jobprofile_schema.dump(job_profile))

@jobprofile_bp.route('/job_profiles', methods=['POST'])
def add_job_profile():
    try:
        data = request.json
        required_skill_ids = data.pop('required_skill_ids', [])

        job_profile_data = jobprofile_schema.load(data, session=db.session)
        
        for skill_id in required_skill_ids:
            skill = Skill.query.get(skill_id)
            if skill:
                job_profile_data.required_skills.append(skill)

        db.session.add(job_profile_data)
        db.session.commit()
        return jsonify(jobprofile_schema.dump(job_profile_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating job profile", "details": str(e)}), 400

@jobprofile_bp.route('/job_profiles/<string:id>', methods=['PUT'])
def update_job_profile(id):
    job_profile = JobProfile.query.get(id)
    if not job_profile:
        return jsonify({"message": "Job Profile not found"}), 404
    try:
        data = request.json
        required_skill_ids = data.pop('required_skill_ids', None)

        job_profile_data = jobprofile_schema.load(data, instance=job_profile, session=db.session, partial=True)
        
        if required_skill_ids is not None:
            job_profile_data.required_skills = []
            for skill_id in required_skill_ids:
                skill = Skill.query.get(skill_id)
                if skill:
                    job_profile_data.required_skills.append(skill)

        db.session.commit()
        return jsonify(jobprofile_schema.dump(job_profile_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating job profile", "details": str(e)}), 400

@jobprofile_bp.route('/job_profiles/<string:id>', methods=['DELETE'])
def delete_job_profile(id):
    job_profile = JobProfile.query.get(id)
    if not job_profile:
        return jsonify({"message": "Job Profile not found"}), 404
    try:
        db.session.delete(job_profile)
        db.session.commit()
        return jsonify({"message": "Job Profile deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting job profile", "details": str(e)}), 400
