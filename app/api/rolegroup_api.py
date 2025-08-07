from flask import Blueprint, request, jsonify
from ..models import db, RoleGroup
from ..schemas import RoleGroupSchema

rolegroup_bp = Blueprint('rolegroup_api', __name__)
rolegroup_schema = RoleGroupSchema()
rolegroups_schema = RoleGroupSchema(many=True)

@rolegroup_bp.route('/rolegroups', methods=['GET'])
def get_rolegroups():
    all_rolegroups = RoleGroup.query.all()
    return jsonify(rolegroups_schema.dump(all_rolegroups))

@rolegroup_bp.route('/rolegroups/<string:id>', methods=['GET'])
def get_rolegroup(id):
    rolegroup = RoleGroup.query.get(id)
    if not rolegroup:
        return jsonify({"message": "Role Group not found"}), 404
    return jsonify(rolegroup_schema.dump(rolegroup))

@rolegroup_bp.route('/rolegroups', methods=['POST'])
def add_rolegroup():
    try:
        rolegroup_data = rolegroup_schema.load(request.json, session=db.session)
        db.session.add(rolegroup_data)
        db.session.commit()
        return jsonify(rolegroup_schema.dump(rolegroup_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating role group", "details": str(e)}), 400

@rolegroup_bp.route('/rolegroups/<string:id>', methods=['PUT'])
def update_rolegroup(id):
    rolegroup = RoleGroup.query.get(id)
    if not rolegroup:
        return jsonify({"message": "Role Group not found"}), 404
    try:
        rolegroup_data = rolegroup_schema.load(request.json, instance=rolegroup, session=db.session, partial=True)
        db.session.commit()
        return jsonify(rolegroup_schema.dump(rolegroup_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating role group", "details": str(e)}), 400

@rolegroup_bp.route('/rolegroups/<string:id>', methods=['DELETE'])
def delete_rolegroup(id):
    rolegroup = RoleGroup.query.get(id)
    if not rolegroup:
        return jsonify({"message": "Role Group not found"}), 404
    try:
        db.session.delete(rolegroup)
        db.session.commit()
        return jsonify({"message": "Role Group deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting role group", "details": str(e)}), 400
