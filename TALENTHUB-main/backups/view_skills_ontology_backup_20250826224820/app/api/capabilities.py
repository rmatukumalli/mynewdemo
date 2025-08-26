from flask import Blueprint, request, jsonify
from app import db
from app.models import Capability
from app.schemas import CapabilitySchema
from marshmallow import ValidationError

capabilities_bp = Blueprint('capabilities_bp', __name__, url_prefix='/v1/capabilities')
capability_schema = CapabilitySchema()
capabilities_schema = CapabilitySchema(many=True)


# New endpoint for Job Architecture Workflow to add capabilities
@capabilities_bp.route('/ontology/add', methods=['POST'])
def add_capability_to_ontology():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    capability_name = json_data.get('name', '').strip()
    if not capability_name:
        return jsonify({"message": "Capability name is required"}), 422

    # Check for unique capability name (case-insensitive)
    if Capability.query.filter(Capability.name.ilike(capability_name)).first():
        return jsonify({"message": f"Capability '{capability_name}' already exists."}), 409
    
    # Prepare data for CapabilitySchema
    # The frontend sends 'name' and 'description'
    capability_data_for_schema = {
        "name": capability_name,
        "description": json_data.get('description', f"User-added capability: {capability_name}")
    }

    try:
        new_capability = capability_schema.load(capability_data_for_schema, session=db.session)
        db.session.add(new_capability)
        db.session.commit()
        return jsonify(capability_schema.dump(new_capability)), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 422
    except Exception as e:
        db.session.rollback()
        # Consider logging the error: current_app.logger.error(...)
        return jsonify({"message": "An unexpected error occurred while adding capability."}), 500


@capabilities_bp.route('/', methods=['GET'])
def get_capabilities():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    capabilities_pagination = Capability.query.paginate(page=page, per_page=per_page, error_out=False)
    capabilities = capabilities_pagination.items
    return jsonify({
        "capabilities": capabilities_schema.dump(capabilities),
        "total": capabilities_pagination.total,
        "pages": capabilities_pagination.pages,
        "current_page": capabilities_pagination.page
    })

@capabilities_bp.route('/all', methods=['GET'])
def get_all_capabilities():
    try:
        all_capabilities = Capability.query.order_by(Capability.name).all()
        # Schema will now handle dumping the M2M relationship 'competencies' as a list of nested objects
        return jsonify(capabilities_schema.dump(all_capabilities))
    except Exception as e:
        # from flask import current_app # Import if using logger
        # current_app.logger.error(f"Error in get_all_capabilities: {e}", exc_info=True)
        return jsonify({"message": "Error processing capabilities list.", "error_details": str(e)}), 500

@capabilities_bp.route('/<int:id>', methods=['GET'])
def get_capability(id):
    capability = Capability.query.get_or_404(id)
    return jsonify(capability_schema.dump(capability))

@capabilities_bp.route('/', methods=['POST'])
def create_capability():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    capability_name = json_data.get('name', '').strip()
    if not capability_name:
        return jsonify({"message": "Capability name is required"}), 422

    if Capability.query.filter(Capability.name.ilike(capability_name)).first():
        return jsonify({"message": f"Capability '{capability_name}' already exists."}), 409

    # Expect a list of competency IDs for M2M relationship
    competency_ids = json_data.get('competency_ids', [])
    
    data_for_schema = {
        "name": capability_name,
        "description": json_data.get('description', ''),
        "competency_ids": competency_ids # Pass to schema for loading
    }

    try:
        # Schema should handle creating the Capability instance and linking competencies
        new_capability = capability_schema.load(data_for_schema, session=db.session)
        db.session.add(new_capability)
        db.session.commit()

        # Re-fetch to ensure relationships are loaded for the response
        detailed_capability = Capability.query.options(
            joinedload(Capability.competencies)
        ).get(new_capability.id)
        return jsonify(capability_schema.dump(detailed_capability)), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 422
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating capability: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred while creating capability."}), 500

@capabilities_bp.route('/<int:id>', methods=['PUT'])
def update_capability(id):
    capability_to_update = Capability.query.options(
        joinedload(Capability.competencies) # Eager load for modification
    ).get_or_404(id)
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    new_name = json_data.get('name', capability_to_update.name).strip()
    if not new_name:
        return jsonify({"message": "Capability name cannot be empty"}), 422

    if new_name.lower() != capability_to_update.name.lower():
        if Capability.query.filter(Capability.name.ilike(new_name)).filter(Capability.id != id).first():
            return jsonify({"message": f"Capability name '{new_name}' already exists."}), 409
            
    new_competency_ids = json_data.get('competency_ids', None) # None means don't change

    data_for_schema = {
        "name": new_name,
        "description": json_data.get('description', capability_to_update.description)
    }

    if new_competency_ids is not None:
        data_for_schema["competency_ids"] = new_competency_ids
        # Validate competency IDs if provided
        for comp_id in new_competency_ids:
            if not Competency.query.get(comp_id):
                return jsonify({"message": f"Competency with id {comp_id} not found"}), 404
    
    try:
        updated_capability = capability_schema.load(
            data_for_schema,
            instance=capability_to_update,
            partial=True,
            session=db.session
        )
        db.session.commit()

        detailed_capability = Capability.query.options(
            joinedload(Capability.competencies)
        ).get(updated_capability.id)
        return jsonify(capability_schema.dump(detailed_capability))
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 422
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating capability {id}: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred while updating capability."}), 500

@capabilities_bp.route('/<int:id>', methods=['DELETE'])
def delete_capability(id):
    capability = Capability.query.get_or_404(id)
    db.session.delete(capability)
    db.session.commit()
    return jsonify({"message": "Capability deleted successfully"}), 200
