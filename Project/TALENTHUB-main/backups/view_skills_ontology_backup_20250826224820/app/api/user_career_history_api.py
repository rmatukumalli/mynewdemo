from flask import Blueprint, request, jsonify
from ..models import db, UserCareerHistory, User, JobProfile
from ..schemas import UserCareerHistorySchema

user_career_history_bp = Blueprint('user_career_history_api', __name__)
user_career_history_schema = UserCareerHistorySchema()
user_career_histories_schema = UserCareerHistorySchema(many=True)

@user_career_history_bp.route('/user_career_histories', methods=['GET'])
def get_user_career_histories():
    all_user_career_histories = UserCareerHistory.query.all()
    return jsonify(user_career_histories_schema.dump(all_user_career_histories))

@user_career_history_bp.route('/user_career_histories/<string:id>', methods=['GET'])
def get_user_career_history(id):
    user_career_history = UserCareerHistory.query.get(id)
    if not user_career_history:
        return jsonify({"message": "User Career History not found"}), 404
    return jsonify(user_career_history_schema.dump(user_career_history))

@user_career_history_bp.route('/user_career_histories', methods=['POST'])
def add_user_career_history():
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        job_profile_id = data.pop('job_profile_id', None)

        user_career_history_data = user_career_history_schema.load(data, session=db.session)
        
        if user_id:
            user = User.query.get(user_id)
            if user:
                user_career_history_data.user = user
        if job_profile_id:
            job_profile = JobProfile.query.get(job_profile_id)
            if job_profile:
                user_career_history_data.job_profile = job_profile

        db.session.add(user_career_history_data)
        db.session.commit()
        return jsonify(user_career_history_schema.dump(user_career_history_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user career history", "details": str(e)}), 400

@user_career_history_bp.route('/user_career_histories/<string:id>', methods=['PUT'])
def update_user_career_history(id):
    user_career_history = UserCareerHistory.query.get(id)
    if not user_career_history:
        return jsonify({"message": "User Career History not found"}), 404
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        job_profile_id = data.pop('job_profile_id', None)

        user_career_history_data = user_career_history_schema.load(data, instance=user_career_history, session=db.session, partial=True)
        
        if user_id is not None:
            user = User.query.get(user_id)
            if user:
                user_career_history_data.user = user
            else:
                user_career_history_data.user = None
        if job_profile_id is not None:
            job_profile = JobProfile.query.get(job_profile_id)
            if job_profile:
                user_career_history_data.job_profile = job_profile
            else:
                user_career_history_data.job_profile = None

        db.session.commit()
        return jsonify(user_career_history_schema.dump(user_career_history_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user career history", "details": str(e)}), 400

@user_career_history_bp.route('/user_career_histories/<string:id>', methods=['DELETE'])
def delete_user_career_history(id):
    user_career_history = UserCareerHistory.query.get(id)
    if not user_career_history:
        return jsonify({"message": "User Career History not found"}), 404
    try:
        db.session.delete(user_career_history)
        db.session.commit()
        return jsonify({"message": "User Career History deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user career history", "details": str(e)}), 400
