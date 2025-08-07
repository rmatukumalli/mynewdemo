from flask import Blueprint, request, jsonify
from ..models import db, BusinessUnit
from ..schemas import BusinessUnitSchema

business_unit_bp = Blueprint('business_unit_api', __name__)
business_unit_schema = BusinessUnitSchema()
business_units_schema = BusinessUnitSchema(many=True)

@business_unit_bp.route('/business_units', methods=['GET'])
def get_business_units():
    all_business_units = BusinessUnit.query.all()
    return jsonify(business_units_schema.dump(all_business_units))

@business_unit_bp.route('/business_units/<string:id>', methods=['GET'])
def get_business_unit(id):
    business_unit = BusinessUnit.query.get(id)
    if not business_unit:
        return jsonify({"message": "Business Unit not found"}), 404
    return jsonify(business_unit_schema.dump(business_unit))

@business_unit_bp.route('/business_units', methods=['POST'])
def add_business_unit():
    try:
        business_unit_data = business_unit_schema.load(request.json, session=db.session)
        db.session.add(business_unit_data)
        db.session.commit()
        return jsonify(business_unit_schema.dump(business_unit_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating business unit", "details": str(e)}), 400

@business_unit_bp.route('/business_units/<string:id>', methods=['PUT'])
def update_business_unit(id):
    business_unit = BusinessUnit.query.get(id)
    if not business_unit:
        return jsonify({"message": "Business Unit not found"}), 404
    try:
        business_unit_data = business_unit_schema.load(request.json, instance=business_unit, session=db.session, partial=True)
        db.session.commit()
        return jsonify(business_unit_schema.dump(business_unit_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating business unit", "details": str(e)}), 400

@business_unit_bp.route('/business_units/<string:id>', methods=['DELETE'])
def delete_business_unit(id):
    business_unit = BusinessUnit.query.get(id)
    if not business_unit:
        return jsonify({"message": "Business Unit not found"}), 404
    try:
        db.session.delete(business_unit)
        db.session.commit()
        return jsonify({"message": "Business Unit deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting business unit", "details": str(e)}), 400
