from flask import Blueprint, request, jsonify
from ..models import db, CareerPath, JobProfile
from ..schemas import CareerPathSchema

career_path_bp = Blueprint('career_path_api', __name__)
career_path_schema = CareerPathSchema()
career_paths_schema = CareerPathSchema(many=True)

@career_path_bp.route('/career_paths', methods=['GET'])
def get_career_paths():
    all_career_paths = CareerPath.query.all()
    return jsonify(career_paths_schema.dump(all_career_paths))

@career_path_bp.route('/career_paths/<string:id>', methods=['GET'])
def get_career_path(id):
    career_path = CareerPath.query.get(id)
    if not career_path:
        return jsonify({"message": "Career Path not found"}), 404
    return jsonify(career_path_schema.dump(career_path))

@career_path_bp.route('/career_paths', methods=['POST'])
def add_career_path():
    try:
        data = request.json
        from_job_profile_id = data.pop('from_job_profile_id', None)
        to_job_profile_id = data.pop('to_job_profile_id', None)

        career_path_data = career_path_schema.load(data, session=db.session)
        
        if from_job_profile_id:
            from_job_profile = JobProfile.query.get(from_job_profile_id)
            if from_job_profile:
                career_path_data.from_job_profile = from_job_profile
        if to_job_profile_id:
            to_job_profile = JobProfile.query.get(to_job_profile_id)
            if to_job_profile:
                career_path_data.to_job_profile = to_job_profile

        db.session.add(career_path_data)
        db.session.commit()
        return jsonify(career_path_schema.dump(career_path_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating career path", "details": str(e)}), 400

@career_path_bp.route('/career_paths/<string:id>', methods=['PUT'])
def update_career_path(id):
    career_path = CareerPath.query.get(id)
    if not career_path:
        return jsonify({"message": "Career Path not found"}), 404
    try:
        data = request.json
        from_job_profile_id = data.pop('from_job_profile_id', None)
        to_job_profile_id = data.pop('to_job_profile_id', None)

        career_path_data = career_path_schema.load(data, instance=career_path, session=db.session, partial=True)
        
        if from_job_profile_id is not None:
            from_job_profile = JobProfile.query.get(from_job_profile_id)
            if from_job_profile:
                career_path_data.from_job_profile = from_job_profile
            else:
                career_path_data.from_job_profile = None
        if to_job_profile_id is not None:
            to_job_profile = JobProfile.query.get(to_job_profile_id)
            if to_job_profile:
                career_path_data.to_job_profile = to_job_profile
            else:
                career_path_data.to_job_profile = None

        db.session.commit()
        return jsonify(career_path_schema.dump(career_path_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating career path", "details": str(e)}), 400

@career_path_bp.route('/career_paths/<string:id>', methods=['DELETE'])
def delete_career_path(id):
    career_path = CareerPath.query.get(id)
    if not career_path:
        return jsonify({"message": "Career Path not found"}), 404
    try:
        db.session.delete(career_path)
        db.session.commit()
        return jsonify({"message": "Career Path deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting career path", "details": str(e)}), 400
