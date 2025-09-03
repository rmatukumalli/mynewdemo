from flask import Blueprint, request, jsonify
from ..models import db, Certification, Skill
from ..schemas import CertificationSchema

certification_bp = Blueprint('certification_api', __name__)
certification_schema = CertificationSchema()
certifications_schema = CertificationSchema(many=True)

@certification_bp.route('/certifications', methods=['GET'])
def get_certifications():
    all_certifications = Certification.query.all()
    return jsonify(certifications_schema.dump(all_certifications))

@certification_bp.route('/certifications/<string:id>', methods=['GET'])
def get_certification(id):
    certification = Certification.query.get(id)
    if not certification:
        return jsonify({"message": "Certification not found"}), 404
    return jsonify(certification_schema.dump(certification))

@certification_bp.route('/certifications', methods=['POST'])
def add_certification():
    try:
        data = request.json
        skill_ids = data.pop('skill_ids', [])

        certification_data = certification_schema.load(data, session=db.session)
        
        for skill_id in skill_ids:
            skill = Skill.query.get(skill_id)
            if skill:
                certification_data.skills.append(skill)

        db.session.add(certification_data)
        db.session.commit()
        return jsonify(certification_schema.dump(certification_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating certification", "details": str(e)}), 400

@certification_bp.route('/certifications/<string:id>', methods=['PUT'])
def update_certification(id):
    certification = Certification.query.get(id)
    if not certification:
        return jsonify({"message": "Certification not found"}), 404
    try:
        data = request.json
        skill_ids = data.pop('skill_ids', None)

        certification_data = certification_schema.load(data, instance=certification, session=db.session, partial=True)
        
        if skill_ids is not None:
            certification_data.skills = []
            for skill_id in skill_ids:
                skill = Skill.query.get(skill_id)
                if skill:
                    certification_data.skills.append(skill)

        db.session.commit()
        return jsonify(certification_schema.dump(certification_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating certification", "details": str(e)}), 400

@certification_bp.route('/certifications/<string:id>', methods=['DELETE'])
def delete_certification(id):
    certification = Certification.query.get(id)
    if not certification:
        return jsonify({"message": "Certification not found"}), 404
    try:
        db.session.delete(certification)
        db.session.commit()
        return jsonify({"message": "Certification deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting certification", "details": str(e)}), 400
