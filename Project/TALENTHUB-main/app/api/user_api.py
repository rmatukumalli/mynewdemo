from flask import Blueprint, request, jsonify
from ..models import db, User, Role
from ..schemas import UserSchema

user_bp = Blueprint('user_api', __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@user_bp.route('/users', methods=['GET'])
def get_users():
    all_users = User.query.all()
    return jsonify(users_schema.dump(all_users))

@user_bp.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user_schema.dump(user))

@user_bp.route('/users', methods=['POST'])
def add_user():
    try:
        data = request.json
        role_id = data.pop('role_id', None)

        user_data = user_schema.load(data, session=db.session)
        
        if role_id:
            role = Role.query.get(role_id)
            if role:
                user_data.role = role

        db.session.add(user_data)
        db.session.commit()
        return jsonify(user_schema.dump(user_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user", "details": str(e)}), 400

@user_bp.route('/users/<string:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    try:
        data = request.json
        role_id = data.pop('role_id', None)

        user_data = user_schema.load(data, instance=user, session=db.session, partial=True)
        
        if role_id is not None:
            role = Role.query.get(role_id)
            if role:
                user_data.role = role
            else:
                user_data.role = None # Clear role if ID is provided but not found

        db.session.commit()
        return jsonify(user_schema.dump(user_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user", "details": str(e)}), 400

@user_bp.route('/users/<string:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user", "details": str(e)}), 400
