from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import Competency, Capability
from app.schemas import CompetencySchema
from marshmallow import ValidationError
from sqlalchemy.orm import joinedload

competencies_bp = Blueprint('competencies_bp', __name__, url_prefix='/v1/competencies')
competency_schema = CompetencySchema()
competencies_schema = CompetencySchema(many=True)


# New endpoint for Job Architecture Workflow to add competencies
@competencies_bp.route('/ontology/add', methods=['POST'])
def add_competency_to_ontology():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    competency_name = json_data.get('name', '').strip()
    capability_id = json_data.get('capabilityId') # Note: frontend sends 'capabilityId'

    if not competency_name:
        return jsonify({"message": "Competency name is required"}), 422
    if not capability_id:
        return jsonify({"message": "Capability ID is required to link the competency"}), 422
    
    # Check if capability_id is valid (exists in Capability table)
    if not Capability.query.get(capability_id):
        return jsonify({"message": f"Invalid capabilityId: {capability_id} does not exist."}), 422

    # First, check if the competency name is globally unique, due to model constraint unique=True on Competency.name
    existing_global_competency = Competency.query.filter(Competency.name.ilike(competency_name)).first()
    if existing_global_competency:
        # If it exists globally, check if it's under a *different* capability
        if existing_global_competency.capability_id != capability_id:
            existing_capability = Capability.query.get(existing_global_competency.capability_id)
            existing_capability_name = existing_capability.name if existing_capability else "another capability"
            return jsonify({"message": f"Competency name '{competency_name}' already exists globally under '{existing_capability_name}'. Competency names must be unique across all capabilities."}), 409
        else:
            # This case means it exists under the *same* capability, which is also a conflict.
             return jsonify({"message": f"Competency '{competency_name}' already exists for this capability."}), 409
    
    # Prepare data for CompetencySchema
    # The frontend sends 'name', 'description', 'capabilityId'
    # Competency model expects 'name', 'description', 'capability_id'
    competency_data_for_schema = {
        "name": competency_name,
        "description": json_data.get('description', f"User-added competency: {competency_name}"),
        "capability_id": capability_id # Schema expects 'capability_id'
    }

    try:
        new_competency = competency_schema.load(competency_data_for_schema, session=db.session)
        db.session.add(new_competency)
        db.session.commit()
        # Dump with nested capability info if schema is configured for it
        return jsonify(competency_schema.dump(new_competency)), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 422
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding new competency: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred while adding competency."}), 500


@competencies_bp.route('/', methods=['GET'])
def get_competencies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    # Example: Filter by capability_id
    capability_id = request.args.get('capability_id', type=int)
    query = Competency.query
    if capability_id:
        query = query.filter(Competency.capability_id == capability_id)
    
    competencies_pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    competencies = competencies_pagination.items
    return jsonify({
        "competencies": competencies_schema.dump(competencies),
        "total": competencies_pagination.total,
        "pages": competencies_pagination.pages,
        "current_page": competencies_pagination.page
    })

@competencies_bp.route('/all', methods=['GET'])
def get_all_competencies():
    try:
        # Eager load behaviors and capabilities for the schema to dump them
        all_competencies = Competency.query.options(
            joinedload(Competency.behaviors),
            joinedload(Competency.capabilities)
        ).order_by(Competency.name).all()
        
        return jsonify(competencies_schema.dump(all_competencies))
    except Exception as e:
        # from flask import current_app # Import if using logger
        # current_app.logger.error(f"Error in get_all_competencies: {e}", exc_info=True)
        return jsonify({"message": "Error processing competencies list.", "error_details": str(e)}), 500

@competencies_bp.route('/<int:id>', methods=['GET'])
def get_competency(id):
    # Eager load behaviors and capabilities for the schema to dump them
    competency = Competency.query.options(
        joinedload(Competency.behaviors),
        joinedload(Competency.capabilities)
    ).get_or_404(id)
    return jsonify(competency_schema.dump(competency))

@competencies_bp.route('/', methods=['POST'])
def create_competency():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    # Validate name
    competency_name = json_data.get('name', '').strip()
    if not competency_name:
        return jsonify({"message": "Competency name is required"}), 422

    # Check for unique competency name (case-insensitive)
    # Competency names are globally unique as per the model
    if Competency.query.filter(Competency.name.ilike(competency_name)).first():
        return jsonify({"message": f"Competency name '{competency_name}' already exists."}), 409

    capability_ids = json_data.get('capability_ids', []) # Expect a list of capability IDs
    # The skill-management.js currently sends a single capability_id for a new competency.
    # For M2M, we should handle a list. The frontend will need to send it as a list.
    # If skill-management.js sends 'capability_id', we might need to adapt here or change JS.
    # For now, assume 'capability_ids' list is sent.
    # If 'capability_id' (singular) is sent from old JS, adapt:
    if 'capability_id' in json_data and not capability_ids: # Handle old singular key if present
        single_cap_id = json_data.get('capability_id')
        if single_cap_id:
            capability_ids = [single_cap_id]


    # Validate capability IDs
    capabilities_for_competency = []
    if capability_ids: # It's optional to link capabilities at creation, but if IDs are given, they must be valid
        for cap_id in capability_ids:
            cap = Capability.query.get(cap_id)
            if not cap:
                return jsonify({"message": f"Capability with id {cap_id} not found"}), 404
            capabilities_for_competency.append(cap)
    
    # Prepare data for schema loading, excluding relationship IDs that we'll handle manually
    # The schema is set up with `capability_ids` as load_only, so it should work.
    data_for_schema = {
        "name": competency_name,
        "description": json_data.get('description', ''),
        "capability_ids": capability_ids # Pass IDs for schema to process
    }

    try:
        # The schema with load_instance=True should create a Competency instance
        # and the `capability_ids` field in the schema should trigger loading/assigning capabilities.
        new_competency = competency_schema.load(data_for_schema, session=db.session)
        
        # If schema doesn't automatically link, we might need to do:
        # new_competency.capabilities = capabilities_for_competency
        # But Marshmallow's `ma.List(ma.Integer(), load_only=True)` for M2M usually handles this.

        db.session.add(new_competency)
        db.session.commit()
        
        # Re-fetch to ensure all relationships are loaded for the response
        detailed_competency = Competency.query.options(
            joinedload(Competency.capabilities),
            joinedload(Competency.skills),
            joinedload(Competency.behaviors)
        ).get(new_competency.id)
        return jsonify(competency_schema.dump(detailed_competency)), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 422
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating competency: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred while creating the competency."}), 500

@competencies_bp.route('/<int:id>', methods=['PUT'])
def update_competency(id):
    competency_to_update = Competency.query.options(
        joinedload(Competency.capabilities) # Eager load for modification
    ).get_or_404(id)
    
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    new_name = json_data.get('name', competency_to_update.name).strip()
    if not new_name:
        return jsonify({"message": "Competency name cannot be empty"}), 422

    # Check for unique competency name if it's being changed
    if new_name.lower() != competency_to_update.name.lower():
        if Competency.query.filter(Competency.name.ilike(new_name)).filter(Competency.id != id).first():
            return jsonify({"message": f"Competency name '{new_name}' already exists."}), 409
            
    # Handle capability_ids for M2M update
    new_capability_ids = json_data.get('capability_ids', None) # None means don't change, [] means remove all

    data_for_schema = {
        "name": new_name,
        "description": json_data.get('description', competency_to_update.description)
    }
    
    # If new_capability_ids are provided, they will be processed by the schema
    if new_capability_ids is not None:
        data_for_schema["capability_ids"] = new_capability_ids
        # Validate capability IDs if provided
        validated_capabilities = []
        for cap_id in new_capability_ids:
            cap = Capability.query.get(cap_id)
            if not cap:
                return jsonify({"message": f"Capability with id {cap_id} not found"}), 404
            validated_capabilities.append(cap)
        # The schema should handle assigning these based on IDs, but if not,
        # we would assign `competency_to_update.capabilities = validated_capabilities` after schema load.

    try:
        # Use schema to load data into the instance. Partial=True allows updating only provided fields.
        # The schema's `capability_ids` field (load_only) should handle updating the M2M relationship.
        updated_competency = competency_schema.load(
            data_for_schema, 
            instance=competency_to_update, 
            partial=True, 
            session=db.session
        )
        
        db.session.commit()
        
        # Re-fetch to ensure all relationships are loaded for the response
        detailed_competency = Competency.query.options(
            joinedload(Competency.capabilities),
            joinedload(Competency.skills),
            joinedload(Competency.behaviors)
        ).get(updated_competency.id)
        return jsonify(competency_schema.dump(detailed_competency))
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 422
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating competency {id}: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred while updating the competency."}), 500

@competencies_bp.route('/<int:id>', methods=['DELETE'])
def delete_competency(id):
    competency = Competency.query.get_or_404(id)
    db.session.delete(competency)
    db.session.commit()
    return jsonify({"message": "Competency deleted successfully"}), 200
