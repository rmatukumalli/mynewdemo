from flask import Blueprint, request, jsonify
from app import db
from app.models import Proficiency
from app.schemas import ProficiencySchema
from marshmallow import ValidationError

proficiencies_bp = Blueprint('proficiencies_bp', __name__, url_prefix='/api/v1/proficiencies')
proficiency_schema = ProficiencySchema()
proficiencies_schema = ProficiencySchema(many=True)

@proficiencies_bp.route('/', methods=['GET'])
def get_proficiencies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    # Example: Filter by skill_id
    skill_id = request.args.get('skill_id', type=int)
    query = Proficiency.query
    if skill_id:
        query = query.filter(Proficiency.skill_id == skill_id)
    
    proficiencies_pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    proficiencies = proficiencies_pagination.items
    return jsonify({
        "proficiencies": proficiencies_schema.dump(proficiencies),
        "total": proficiencies_pagination.total,
        "pages": proficiencies_pagination.pages,
        "current_page": proficiencies_pagination.page
    })

@proficiencies_bp.route('/<int:id>', methods=['GET'])
def get_proficiency(id):
    proficiency = Proficiency.query.get_or_404(id)
    return jsonify(proficiency_schema.dump(proficiency))

@proficiencies_bp.route('/', methods=['POST'])
def create_proficiency():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400
    try:
        data = proficiency_schema.load(json_data, session=db.session)
    except ValidationError as err:
        return jsonify(err.messages), 422
    
    db.session.add(data)
    db.session.commit()
    return jsonify(proficiency_schema.dump(data)), 201

@proficiencies_bp.route('/<int:id>', methods=['PUT'])
def update_proficiency(id):
    proficiency = Proficiency.query.get_or_404(id)
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400
    try:
        updated_proficiency = proficiency_schema.load(json_data, instance=proficiency, partial=True, session=db.session)
    except ValidationError as err:
        return jsonify(err.messages), 422
    
    db.session.commit()
    return jsonify(proficiency_schema.dump(updated_proficiency))

@proficiencies_bp.route('/<int:id>', methods=['DELETE'])
def delete_proficiency(id):
    proficiency = Proficiency.query.get_or_404(id)
    db.session.delete(proficiency)
    db.session.commit()
    return jsonify({"message": "Proficiency deleted successfully"}), 200
