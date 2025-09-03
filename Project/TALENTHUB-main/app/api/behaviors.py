from flask import Blueprint, request, jsonify
from app import db
from app.models import Behavior
from app.schemas import BehaviorSchema
from marshmallow import ValidationError

behaviors_bp = Blueprint('behaviors_bp', __name__, url_prefix='/v1/behaviors')
behavior_schema = BehaviorSchema()
behaviors_schema = BehaviorSchema(many=True)

@behaviors_bp.route('/', methods=['GET'])
def get_behaviors():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    # Example: Filter by competency_id
    competency_id = request.args.get('competency_id', type=int)
    query = Behavior.query
    if competency_id:
        query = query.filter(Behavior.competency_id == competency_id)

    behaviors_pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    behaviors = behaviors_pagination.items
    return jsonify({
        "behaviors": behaviors_schema.dump(behaviors),
        "total": behaviors_pagination.total,
        "pages": behaviors_pagination.pages,
        "current_page": behaviors_pagination.page
    })

@behaviors_bp.route('/<int:id>', methods=['GET'])
def get_behavior(id):
    behavior = Behavior.query.get_or_404(id)
    return jsonify(behavior_schema.dump(behavior))

@behaviors_bp.route('/', methods=['POST'])
def create_behavior():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400
    try:
        data = behavior_schema.load(json_data, session=db.session)
    except ValidationError as err:
        return jsonify(err.messages), 422
    
    db.session.add(data)
    db.session.commit()
    return jsonify(behavior_schema.dump(data)), 201

@behaviors_bp.route('/<int:id>', methods=['PUT'])
def update_behavior(id):
    behavior = Behavior.query.get_or_404(id)
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400
    try:
        updated_behavior = behavior_schema.load(json_data, instance=behavior, partial=True, session=db.session)
    except ValidationError as err:
        return jsonify(err.messages), 422
    
    db.session.commit()
    return jsonify(behavior_schema.dump(updated_behavior))

@behaviors_bp.route('/<int:id>', methods=['DELETE'])
def delete_behavior(id):
    behavior = Behavior.query.get_or_404(id)
    db.session.delete(behavior)
    db.session.commit()
    return jsonify({"message": "Behavior deleted successfully"}), 200
