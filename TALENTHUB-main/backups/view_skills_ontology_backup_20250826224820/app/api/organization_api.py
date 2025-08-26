from flask import Blueprint, request, jsonify
from ..models import db, Organization
from ..schemas import OrganizationSchema

organization_bp = Blueprint('organization_api', __name__)
organization_schema = OrganizationSchema()
organizations_schema = OrganizationSchema(many=True)

@organization_bp.route('/organizations', methods=['GET'])
def get_organizations():
    all_organizations = Organization.query.all()
    return jsonify(organizations_schema.dump(all_organizations))

@organization_bp.route('/organizations/<string:id>', methods=['GET'])
def get_organization(id):
    organization = Organization.query.get(id)
    if not organization:
        return jsonify({"message": "Organization not found"}), 404
    return jsonify(organization_schema.dump(organization))

@organization_bp.route('/organizations', methods=['POST'])
def add_organization():
    try:
        organization_data = organization_schema.load(request.json, session=db.session)
        db.session.add(organization_data)
        db.session.commit()
        return jsonify(organization_schema.dump(organization_data)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating organization", "details": str(e)}), 400

@organization_bp.route('/organizations/<string:id>', methods=['PUT'])
def update_organization(id):
    organization = Organization.query.get(id)
    if not organization:
        return jsonify({"message": "Organization not found"}), 404
    try:
        organization_data = organization_schema.load(request.json, instance=organization, session=db.session, partial=True)
        db.session.commit()
        return jsonify(organization_schema.dump(organization_data))
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating organization", "details": str(e)}), 400

@organization_bp.route('/organizations/<string:id>', methods=['DELETE'])
def delete_organization(id):
    organization = Organization.query.get(id)
    if not organization:
        return jsonify({"message": "Organization not found"}), 404
    try:
        db.session.delete(organization)
        db.session.commit()
        return jsonify({"message": "Organization deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting organization", "details": str(e)}), 400
