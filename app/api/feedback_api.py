from flask import Blueprint, request, jsonify
from ..models import db, Feedback, User, Skill
from ..schemas import FeedbackSchema

feedback_bp = Blueprint('feedback_api', __name__)
feedback_schema = FeedbackSchema()
feedbacks_schema = FeedbackSchema(many=True)

@feedback_bp.route('/feedbacks', methods=['GET'])
def get_feedbacks():
    all_feedbacks = Feedback.query.all()
    return jsonify(feedbacks_schema.dump(all_feedbacks))

@feedback_bp.route('/feedbacks/<string:id>', methods=['GET'])
def get_feedback(id):
    feedback = Feedback.query.get(id)
    if not feedback:
        return jsonify({"message": "Feedback not found"}), 404
    return jsonify(feedback_schema.dump(feedback))

@feedback_bp.route('/feedbacks', methods=['POST'])
def add_feedback():
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        skill_id = data.pop('skill_id', None)

        feedback_data = feedback_schema.load(data, session=db.session)
        
        if user_id:
            user = User.query.get(user_id)
            if user:
                feedback_data.user = user
        if skill_id:
            skill = Skill.query.get(skill_id)
            if skill:
                feedback_data.skill = skill

        db.session.add(feedback_data)
        db.session.commit()
        return jsonify(feedback_schema.dump(feedback_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating feedback", "details": str(e)}), 400

@feedback_bp.route('/feedbacks/<string:id>', methods=['PUT'])
def update_feedback(id):
    feedback = Feedback.query.get(id)
    if not feedback:
        return jsonify({"message": "Feedback not found"}), 404
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        skill_id = data.pop('skill_id', None)

        feedback_data = feedback_schema.load(data, instance=feedback, session=db.session, partial=True)
        
        if user_id is not None:
            user = User.query.get(user_id)
            if user:
                feedback_data.user = user
            else:
                feedback_data.user = None
        if skill_id is not None:
            skill = Skill.query.get(skill_id)
            if skill:
                feedback_data.skill = skill
            else:
                feedback_data.skill = None

        db.session.commit()
        return jsonify(feedback_schema.dump(feedback_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating feedback", "details": str(e)}), 400

@feedback_bp.route('/feedbacks/<string:id>', methods=['DELETE'])
def delete_feedback(id):
    feedback = Feedback.query.get(id)
    if not feedback:
        return jsonify({"message": "Feedback not found"}), 404
    try:
        db.session.delete(feedback)
        db.session.commit()
        return jsonify({"message": "Feedback deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting feedback", "details": str(e)}), 400
