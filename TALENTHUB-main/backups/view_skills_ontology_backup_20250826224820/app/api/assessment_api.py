from flask import Blueprint, request, jsonify
from ..models import db, Assessment, User, Skill, Proficiency
from ..schemas import AssessmentSchema

assessment_bp = Blueprint('assessment_api', __name__)
assessment_schema = AssessmentSchema()
assessments_schema = AssessmentSchema(many=True)

@assessment_bp.route('/assessments', methods=['GET'])
def get_assessments():
    all_assessments = Assessment.query.all()
    return jsonify(assessments_schema.dump(all_assessments))

@assessment_bp.route('/assessments/<string:id>', methods=['GET'])
def get_assessment(id):
    assessment = Assessment.query.get(id)
    if not assessment:
        return jsonify({"message": "Assessment not found"}), 404
    return jsonify(assessment_schema.dump(assessment))

@assessment_bp.route('/assessments', methods=['POST'])
def add_assessment():
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        skill_id = data.pop('skill_id', None)
        proficiency_id = data.pop('proficiency_id', None)

        assessment_data = assessment_schema.load(data, session=db.session)
        
        if user_id:
            user = User.query.get(user_id)
            if user:
                assessment_data.user = user
        if skill_id:
            skill = Skill.query.get(skill_id)
            if skill:
                assessment_data.skill = skill
        if proficiency_id:
            proficiency = Proficiency.query.get(proficiency_id)
            if proficiency:
                assessment_data.proficiency = proficiency

        db.session.add(assessment_data)
        db.session.commit()
        return jsonify(assessment_schema.dump(assessment_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating assessment", "details": str(e)}), 400

@assessment_bp.route('/assessments/<string:id>', methods=['PUT'])
def update_assessment(id):
    assessment = Assessment.query.get(id)
    if not assessment:
        return jsonify({"message": "Assessment not found"}), 404
    try:
        data = request.json
        user_id = data.pop('user_id', None)
        skill_id = data.pop('skill_id', None)
        proficiency_id = data.pop('proficiency_id', None)

        assessment_data = assessment_schema.load(data, instance=assessment, session=db.session, partial=True)
        
        if user_id is not None:
            user = User.query.get(user_id)
            if user:
                assessment_data.user = user
            else:
                assessment_data.user = None
        if skill_id is not None:
            skill = Skill.query.get(skill_id)
            if skill:
                assessment_data.skill = skill
            else:
                assessment_data.skill = None
        if proficiency_id is not None:
            proficiency = Proficiency.query.get(proficiency_id)
            if proficiency:
                assessment_data.proficiency = proficiency
            else:
                assessment_data.proficiency = None

        db.session.commit()
        return jsonify(assessment_schema.dump(assessment_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating assessment", "details": str(e)}), 400

@assessment_bp.route('/assessments/<string:id>', methods=['DELETE'])
def delete_assessment(id):
    assessment = Assessment.query.get(id)
    if not assessment:
        return jsonify({"message": "Assessment not found"}), 404
    try:
        db.session.delete(assessment)
        db.session.commit()
        return jsonify({"message": "Assessment deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting assessment", "details": str(e)}), 400
