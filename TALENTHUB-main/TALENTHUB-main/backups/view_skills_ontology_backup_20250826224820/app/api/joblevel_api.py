from flask import Blueprint, request, jsonify
from ..models import db, JobLevel
from ..schemas import JobLevelSchema

joblevel_bp = Blueprint('joblevel_api', __name__)
joblevel_schema = JobLevelSchema()
joblevels_schema = JobLevelSchema(many=True)

@joblevel_bp.route('/joblevels', methods=['GET'])
def get_joblevels():
    all_joblevels = JobLevel.query.all()
    return jsonify(joblevels_schema.dump(all_joblevels))

@joblevel_bp.route('/joblevels/<string:id>', methods=['GET'])
def get_joblevel(id):
    joblevel = JobLevel.query.get(id)
    if not joblevel:
        return jsonify({"message": "Job Level not found"}), 404
    return jsonify(joblevel_schema.dump(joblevel))

@joblevel_bp.route('/joblevels', methods=['POST'])
def add_joblevel():
    try:
        joblevel_data = joblevel_schema.load(request.json, session=db.session)
        db.session.add(joblevel_data)
        db.session.commit()
        return jsonify(joblevel_schema.dump(joblevel_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating job level", "details": str(e)}), 400

@joblevel_bp.route('/joblevels/<string:id>', methods=['PUT'])
def update_joblevel(id):
    joblevel = JobLevel.query.get(id)
    if not joblevel:
        return jsonify({"message": "Job Level not found"}), 404
    try:
        joblevel_data = joblevel_schema.load(request.json, instance=joblevel, session=db.session, partial=True)
        db.session.commit()
        return jsonify(joblevel_schema.dump(joblevel_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating job level", "details": str(e)}), 400

@joblevel_bp.route('/joblevels/<string:id>', methods=['DELETE'])
def delete_joblevel(id):
    joblevel = JobLevel.query.get(id)
    if not joblevel:
        return jsonify({"message": "Job Level not found"}), 404
    try:
        db.session.delete(joblevel)
        db.session.commit()
        return jsonify({"message": "Job Level deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting job level", "details": str(e)}), 400
