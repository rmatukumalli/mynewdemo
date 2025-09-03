from flask import Blueprint, request, jsonify
from ..models import db, Role
from ..schemas import RoleSchema

role_bp = Blueprint('role_api', __name__)
role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)

@role_bp.route('/roles', methods=['GET'])
def get_roles():
    all_roles = Role.query.all()
    return jsonify(roles_schema.dump(all_roles))

@role_bp.route('/roles/<string:id>', methods=['GET'])
def get_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({"message": "Role not found"}), 404
    return jsonify(role_schema.dump(role))

@role_bp.route('/roles', methods=['POST'])
def add_role():
    try:
        role_data = role_schema.load(request.json, session=db.session)
        db.session.add(role_data)
        db.session.commit()
        return jsonify(role_schema.dump(role_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating role", "details": str(e)}), 400

@role_bp.route('/roles/<string:id>', methods=['PUT'])
def update_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({"message": "Role not found"}), 404
    try:
        role_data = role_schema.load(request.json, instance=role, session=db.session, partial=True)
        db.session.commit()
        return jsonify(role_schema.dump(role_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating role", "details": str(e)}), 400

@role_bp.route('/roles/<string:id>', methods=['DELETE'])
def delete_role(id):
    role = Role.query.get(id)
    if not role:
        return jsonify({"message": "Role not found"}), 404
    try:
        db.session.delete(role)
        db.session.commit()
        return jsonify({"message": "Role deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting role", "details": str(e)}), 400
