from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import Skill, Proficiency, Behavior, Competency, Capability, SkillRelationship
from app.schemas import SkillSchema, SkillRelationshipSchema
from sqlalchemy.orm import joinedload # Import joinedload
from marshmallow import ValidationError

skills_bp = Blueprint('skills_bp', __name__)
skill_schema = SkillSchema()
skills_schema = SkillSchema(many=True)
skill_relationship_schema = SkillRelationshipSchema()

# This /ontology/add endpoint seems specific to a different workflow (Job Architecture)
# and handles proficiency levels directly. We will keep it separate and ensure
# the main CRUD /api/v1/skills/ endpoints serve skill-management.html
@skills_bp.route('/ontology/add', methods=['POST'])
def add_skill_to_ontology():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    required_fields = ['name', 'capabilityId', 'competencyId', 'proficiencyLevels']
    missing_fields = [field for field in required_fields if field not in json_data or not json_data[field]]
    if missing_fields:
        return jsonify({"message": f"Missing required fields: {', '.join(missing_fields)}"}), 422

    skill_name = json_data['name'].strip()
    if Skill.query.filter(Skill.name.ilike(skill_name)).first():
        return jsonify({"message": f"Skill '{skill_name}' already exists."}), 409

    competency_id_from_payload = json_data.get('competencyId')
    if not competency_id_from_payload:
         return jsonify({"message": "competencyId is required in the payload."}), 422
    
    # Verify competency exists
    target_competency = Competency.query.get(competency_id_from_payload)
    if not target_competency:
        return jsonify({"message": f"Competency with id {competency_id_from_payload} not found."}), 404
    
    # Verify capabilityId matches the competency's capability
    if target_competency.capability_id != json_data.get('capabilityId'):
        return jsonify({"message": "Mismatch between provided capabilityId and competency's actual capability."}), 422

    skill_data_for_schema = {
        "name": skill_name,
        "description": json_data.get('description', '').strip(),
        "tags": ",".join(json_data.get('tags', [])),
        "behavior_id": None, 
        "competency_id": int(competency_id_from_payload),
        "category": json_data.get('type', 'User Added') 
    }

    try:
        new_skill = skill_schema.load(skill_data_for_schema, session=db.session)
        db.session.add(new_skill)
        db.session.flush() 

        proficiencies_data = json_data.get('proficiencyLevels', [])
        if not proficiencies_data:
             db.session.rollback()
             return jsonify({"message": "At least one proficiency level must be provided."}), 422

        for prof_data in proficiencies_data:
            proficiency = Proficiency(
                name=prof_data.get('name', f"Level {prof_data['level']}"),
                description=prof_data.get('descriptor', ''),
                level=prof_data['level'],
                skill_id=new_skill.id
            )
            db.session.add(proficiency)
        
        db.session.commit()
        return jsonify(skill_schema.dump(new_skill)), 201
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 422
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding skill to ontology: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred."}), 500


@skills_bp.route('', methods=['GET'])
def get_skills():
    try:
        current_app.logger.info("Attempting to fetch all skills.")
        # Eager load M2M competencies, and for each competency, its M2M capabilities.
        # Behavior is no longer directly linked to skill.
        skills_query = Skill.query.options(
            joinedload(Skill.competencies).joinedload(Competency.capabilities),
            joinedload(Skill.source_relationships).joinedload(SkillRelationship.relationship_type),
            joinedload(Skill.source_relationships).joinedload(SkillRelationship.target_skill),
            joinedload(Skill.target_relationships).joinedload(SkillRelationship.relationship_type),
            joinedload(Skill.target_relationships).joinedload(SkillRelationship.source_skill)
        ).order_by(Skill.name)
        
        all_skills = skills_query.all()
        current_app.logger.info(f"Successfully fetched {len(all_skills)} skills from the database.")
        
        # The updated SkillSchema will handle nesting competencies,
        # and the CompetencySchema will nest capabilities.
        result = skills_schema.dump(all_skills)
        current_app.logger.info("Successfully serialized skills to JSON.")
        return jsonify(result)
    except Exception as e:
        current_app.logger.error(f"Error in get_skills: {e}", exc_info=True) # Ensure logging is active
        return jsonify({"message": "Error processing skills list.", "error_details": str(e)}), 500


@skills_bp.route('/<int:id>', methods=['GET'])
def get_skill(id):
    try:
        skill = Skill.query.options(
            joinedload(Skill.competencies).joinedload(Competency.capabilities),
            joinedload(Skill.source_relationships).joinedload(SkillRelationship.relationship_type),
            joinedload(Skill.source_relationships).joinedload(SkillRelationship.target_skill),
            joinedload(Skill.target_relationships).joinedload(SkillRelationship.relationship_type),
            joinedload(Skill.target_relationships).joinedload(SkillRelationship.source_skill)
        ).get_or_404(id)
        return jsonify(skill_schema.dump(skill))
    except Exception as e:
        # current_app.logger.error(f"Error in get_skill {id}: {e}", exc_info=True)
        return jsonify({"message": "Error processing skill details.", "error_details": str(e)}), 500


@skills_bp.route('', methods=['POST'])
def create_skill():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    skill_name = json_data.get('name', '').strip()
    description = json_data.get('description', '').strip()
    competency_id = json_data.get('competency_id')

    if not skill_name:
        return jsonify({"message": "Skill name is required"}), 422
    if not competency_id:
        return jsonify({"message": "Competency ID is required"}), 422

    competency = Competency.query.get(competency_id)
    if not competency:
        return jsonify({"message": f"Competency with id {competency_id} not found"}), 404

    if Skill.query.filter(Skill.name.ilike(skill_name)).first():
        return jsonify({"message": f"A skill with the name '{skill_name}' already exists."}), 409

    try:
        new_skill = Skill(
            name=skill_name,
            description=description,
            category='User Added'
        )
        new_skill.competencies.append(competency)
        
        db.session.add(new_skill)
        db.session.commit()
        
        return jsonify(skill_schema.dump(new_skill)), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating skill: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred while creating the skill."}), 500


@skills_bp.route('/<int:id>', methods=['PUT'])
def update_skill(id):
    skill_to_update = Skill.query.options(
        joinedload(Skill.competencies)
    ).get_or_404(id)
    json_data = request.get_json()

    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    skill_name = json_data.get('name', skill_to_update.name).strip()
    description = json_data.get('description', skill_to_update.description).strip()
    competency_id = json_data.get('competency_id')

    if not skill_name:
        return jsonify({"message": "Skill name cannot be empty"}), 422

    if skill_name.lower() != skill_to_update.name.lower():
        if Skill.query.filter(Skill.name.ilike(skill_name)).filter(Skill.id != id).first():
            return jsonify({"message": f"A skill with the name '{skill_name}' already exists."}), 409

    try:
        skill_to_update.name = skill_name
        skill_to_update.description = description

        if competency_id:
            competency = Competency.query.get(competency_id)
            if not competency:
                return jsonify({"message": f"Competency with id {competency_id} not found"}), 404
            skill_to_update.competencies = [competency]

        db.session.commit()
        
        detailed_skill = Skill.query.options(
            joinedload(Skill.competencies).joinedload(Competency.capabilities)
        ).get(id)
        return jsonify(skill_schema.dump(detailed_skill))

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating skill {id}: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred while updating the skill."}), 500


@skills_bp.route('/<int:id>', methods=['DELETE'])
def delete_skill(id):
    skill = Skill.query.get_or_404(id)
    db.session.delete(skill)
    db.session.commit()
    return jsonify({"message": "Skill deleted successfully"}), 200 # Or 204 No Content

# --- Relationship Management ---
@skills_bp.route('/<int:skill_id>/add_related', methods=['POST'])
def add_related_skill(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400
    
    try:
        data = skill_relationship_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    related_skill_id = data.get('related_skill_id')
    related_skill = Skill.query.get_or_404(related_skill_id)

    if skill == related_skill:
        return jsonify({"message": "Cannot relate a skill to itself"}), 400

    # Assuming 'related_skills' is the relationship attribute on the Skill model
    # and 'skill_relationships' is the association table.
    # The relationship on the model should handle appending.
    if related_skill not in skill.related_skills:
        skill.related_skills.append(related_skill)
        # If your relationship is bidirectional and not handled by backref automatically for append:
        # related_skill.related_skills.append(skill) 
        # However, with a proper backref like `related_to` on the other side, this might be automatic
        # or you might need to manage the `skill_relationships` table directly if using `relationship_type`.
        
        # For explicit relationship type:
        # stmt = skill_relationships.insert().values(skill_a_id=skill_id, skill_b_id=related_skill_id, relationship_type="related")
        # db.session.execute(stmt)
        
        db.session.commit()
        return jsonify({"message": f"Skill {related_skill.name} added as related to {skill.name}"}), 200
    else:
        return jsonify({"message": "Relationship already exists"}), 409


@skills_bp.route('/<int:skill_id>/remove_related', methods=['POST']) # Should ideally be DELETE
def remove_related_skill(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    try:
        data = skill_relationship_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422
        
    related_skill_id = data.get('related_skill_id')
    related_skill = Skill.query.get_or_404(related_skill_id)

    if related_skill in skill.related_skills:
        skill.related_skills.remove(related_skill)
        # If bidirectional and not handled by backref:
        # related_skill.related_skills.remove(skill)
        db.session.commit()
        return jsonify({"message": f"Skill {related_skill.name} removed from related of {skill.name}"}), 200
    else:
        return jsonify({"message": "Relationship does not exist"}), 404

# --- Ontology Management ---

@skills_bp.route('/ontology', methods=['GET'])
def get_ontology():
    """
    Fetches the entire skills ontology, structured in a nested format.
    Capabilities > Competencies > Skills > Behaviors.
    """
    try:
        # Eagerly load all levels of the hierarchy to avoid N+1 query problems.
        capabilities = Capability.query.options(
            joinedload(Capability.competencies).
            joinedload(Competency.skills).
            joinedload(Skill.behaviors)
        ).all()
        
        result = []
        for cap in capabilities:
            cap_data = {
                "id": cap.id,
                "name": cap.name,
                "description": cap.description or "",
                "competencies": []
            }
            for comp in sorted(cap.competencies, key=lambda c: c.id): # Consistent ordering
                # Aggregate skills and their associated behaviors for the current competency
                skills_list = [skill.name for skill in sorted(comp.skills, key=lambda s: s.id)]
                behaviors_list = [b.name for skill in sorted(comp.skills, key=lambda s: s.id) for b in sorted(skill.behaviors, key=lambda b: b.id)]

                comp_data = {
                    "id": comp.id,
                    "name": comp.name,
                    "description": comp.description or "",
                    "skills": skills_list,
                    "behaviors": behaviors_list
                }
                cap_data["competencies"].append(comp_data)
            result.append(cap_data)
            
        return jsonify(result)
    except Exception as e:
        current_app.logger.error(f"Error fetching ontology: {e}", exc_info=True)
        return jsonify({"message": "An error occurred while fetching the ontology."}), 500

@skills_bp.route('/ontology', methods=['POST'])
def create_ontology_item():
    """
    Creates a new item in the ontology (Capability or Competency).
    If creating a Competency, also handles creating its associated Skills and Behaviors.
    """
    data = request.get_json()
    item_type = data.get('type')
    name = data.get('name')
    description = data.get('description', '')
    parent_id = data.get('parent_id')

    if not name or not item_type:
        return jsonify({"message": "Name and type are required."}), 400

    try:
        if item_type == 'capability':
            if Capability.query.filter(Capability.name.ilike(name)).first():
                return jsonify({"message": f"Capability '{name}' already exists."}), 409
            new_item = Capability(name=name, description=description)
            db.session.add(new_item)

        elif item_type == 'competency':
            if not parent_id:
                return jsonify({"message": "A parent capability is required to create a competency."}), 400
            if Competency.query.filter(Competency.name.ilike(name), Competency.capability_id == parent_id).first():
                 return jsonify({"message": f"Competency '{name}' already exists in this capability."}), 409
            
            new_item = Competency(name=name, description=description, capability_id=parent_id)
            db.session.add(new_item)
            db.session.flush()  # Flush to get the new_item.id

            # Create and associate skills
            skill_names = data.get('skills', [])
            created_skills = []
            for skill_name in set(skill_names): # Use set to handle duplicates from input
                if skill_name:
                    skill = Skill(name=skill_name, description=description) # Inherit competency desc
                    skill.competencies.append(new_item)
                    db.session.add(skill)
                    created_skills.append(skill)
            
            # Create and associate behaviors to the newly created skills
            behavior_names = data.get('behaviors', [])
            if created_skills: # Only add behaviors if skills were created
                db.session.flush() # Flush to get skill IDs
                for behavior_name in set(behavior_names):
                    if behavior_name:
                        # Associate behavior with all skills created in this transaction for this competency
                        for skill in created_skills:
                            behavior = Behavior(name=behavior_name, description=description, skill_id=skill.id)
                            db.session.add(behavior)
        else:
            return jsonify({"message": "This endpoint only supports creating 'capability' or 'competency'."}), 400
        
        db.session.commit()
        # The frontend refetches, so a simple success message is sufficient.
        return jsonify({"message": f"{item_type.capitalize()} created successfully."}), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating ontology item: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred."}), 500

@skills_bp.route('/ontology/<int:id>', methods=['PUT'])
def update_ontology_item(id):
    """
    Updates an existing ontology item (Capability or Competency).
    For Competencies, it performs a diff-based update on its child Skills and Behaviors.
    """
    data = request.get_json()
    item_type = data.get('type')
    name = data.get('name')
    description = data.get('description', '')

    if not all([item_type, name]):
        return jsonify({'message': 'Name and type are required.'}), 400

    model_map = {'capability': Capability, 'competency': Competency}
    model = model_map.get(item_type)
    if not model:
        return jsonify({'message': 'Invalid item type for update.'}), 400

    item = model.query.get_or_404(id)
    item.name = name
    item.description = description

    try:
        if item_type == 'competency':
            # --- Diff-based update for Skills ---
            current_skill_names = {s.name for s in item.skills}
            new_skill_names = set(data.get('skills', []))

            # Delete skills that are no longer present
            skills_to_delete = [s for s in item.skills if s.name not in new_skill_names]
            for skill in skills_to_delete:
                # Must delete child behaviors first
                Behavior.query.filter_by(skill_id=skill.id).delete()
                db.session.delete(skill)

            # Add new skills
            skills_to_add = new_skill_names - current_skill_names
            for skill_name in skills_to_add:
                if skill_name:
                    new_skill = Skill(name=skill_name, description=description)
                    new_skill.competencies.append(item)
                    db.session.add(new_skill)
            
            db.session.flush() # Ensure new skills get IDs

            # --- Diff-based update for Behaviors ---
            # This is more complex as behaviors are children of skills.
            # We'll get all current behaviors for this competency.
            current_behaviors = Behavior.query.join(Skill).filter(Skill.competencies.any(id=item.id))
            current_behavior_names = {b.name for b in current_behaviors}
            new_behavior_names = set(data.get('behaviors', []))

            # Delete behaviors that are no longer present
            behaviors_to_delete = new_behavior_names.symmetric_difference(current_behavior_names)
            
            # This simplified logic removes any behavior that's not in the new list.
            # A more granular approach might be needed for complex cases.
            for behavior in current_behaviors:
                if behavior.name not in new_behavior_names:
                    db.session.delete(behavior)

            # Add new behaviors to all skills under this competency
            behaviors_to_add = new_behavior_names - current_behavior_names
            for skill in item.skills: # Add to all current and newly added skills
                for behavior_name in behaviors_to_add:
                    if behavior_name:
                        new_behavior = Behavior(name=behavior_name, description=description, skill_id=skill.id)
                        db.session.add(new_behavior)

        db.session.commit()
        return jsonify({"message": f"{item_type.capitalize()} updated successfully."}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating ontology item {id}: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred."}), 500

@skills_bp.route('/ontology/<int:id>', methods=['DELETE'])
def delete_ontology_item(id):
    """
    Deletes an item from the ontology. Implements cascading deletes for parent items.
    e.g., Deleting a Capability deletes all its child Competencies, Skills, and Behaviors.
    """
    item_type = request.args.get('type')
    
    model_map = {'capability': Capability, 'competency': Competency}
    model = model_map.get(item_type)

    if not model:
        return jsonify({'message': 'Invalid item type for deletion.'}), 400

    item = model.query.get_or_404(id)

    try:
        if item_type == 'capability':
            # Manually cascade delete for full control
            for competency in item.competencies:
                for skill in competency.skills:
                    Behavior.query.filter_by(skill_id=skill.id).delete(synchronize_session=False)
                    db.session.delete(skill)
                db.session.delete(competency)
        
        elif item_type == 'competency':
            for skill in item.skills:
                Behavior.query.filter_by(skill_id=skill.id).delete(synchronize_session=False)
                db.session.delete(skill)

        # Finally, delete the item itself
        db.session.delete(item)
        db.session.commit()
        
        return jsonify({"message": f"{item_type.capitalize()} and its children deleted successfully."}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting ontology item {id}: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred during deletion."}), 500
