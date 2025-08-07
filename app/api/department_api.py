from flask import Blueprint, request, jsonify
from ..models import db, Department
from ..schemas import DepartmentSchema

department_bp = Blueprint('department_api', __name__)
department_schema = DepartmentSchema()
departments_schema = DepartmentSchema(many=True)

@department_bp.route('/departments', methods=['GET'])
def get_departments():
    all_departments = Department.query.all()
    return jsonify(departments_schema.dump(all_departments))

@department_bp.route('/departments/<string:id>', methods=['GET'])
def get_department(id):
    department = Department.query.get(id)
    if not department:
        return jsonify({"message": "Department not found"}), 404
    return jsonify(department_schema.dump(department))

@department_bp.route('/departments', methods=['POST'])
def add_department():
    try:
        department_data = department_schema.load(request.json, session=db.session)
        db.session.add(department_data)
        db.session.commit()
        return jsonify(department_schema.dump(department_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating department", "details": str(e)}), 400

@department_bp.route('/departments/<string:id>', methods=['PUT'])
def update_department(id):
    department = Department.query.get(id)
    if not department:
        return jsonify({"message": "Department not found"}), 404
    try:
        department_data = department_schema.load(request.json, instance=department, session=db.session, partial=True)
        db.session.commit()
        return jsonify(department_schema.dump(department_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating department", "details": str(e)}), 400

@department_bp.route('/departments/<string:id>', methods=['DELETE'])
def delete_department(id):
    department = Department.query.get(id)
    if not department:
        return jsonify({"message": "Department not found"}), 404
    try:
        db.session.delete(department)
        db.session.commit()
        return jsonify({"message": "Department deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting department", "details": str(e)}), 400
