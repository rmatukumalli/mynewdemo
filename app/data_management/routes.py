from flask import Blueprint, request, send_file, jsonify, render_template
from app import db
from app.models import Capability, Competency, Skill, Behavior, Proficiency
import pandas as pd
from io import BytesIO

bp = Blueprint('data_management', __name__, url_prefix='/data-management')

@bp.route('')
def index():
    try:
        return render_template('data_management.html')
    except Exception as e:
        return str(e), 500

@bp.route('/export', methods=['GET'])
def export_data():
    """
    Exports data from the database to an Excel file with multiple sheets.
    """
    # Query data from the database
    capabilities = Capability.query.all()
    competencies = Competency.query.all()
    skills = Skill.query.all()
    behaviors = Behavior.query.all()
    proficiencies = Proficiency.query.all()

    # Convert data to pandas DataFrames
    capabilities_df = pd.DataFrame([
        {
            'id': c.id,
            'name': c.name,
            'description': c.description,
            'custom_fields': c.custom_fields
        } for c in capabilities
    ])

    competencies_df = pd.DataFrame([
        {
            'id': c.id,
            'name': c.name,
            'description': c.description,
        } for c in competencies
    ])

    skills_df = pd.DataFrame([
        {
            'id': s.id,
            'name': s.name,
            'description': s.description,
            'category': s.category,
            'criticality': s.criticality,
            'custom_fields': s.custom_fields,
            'is_active': s.is_active
        } for s in skills
    ])

    behaviors_df = pd.DataFrame([
        {
            'id': b.id,
            'name': b.name,
            'description': b.description,
            'competency_id': b.competency_id
        } for b in behaviors
    ])

    proficiencies_df = pd.DataFrame([
        {
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'level': p.level,
            'skill_id': p.skill_id
        } for p in proficiencies
    ])

    # Create an Excel file in memory
    excel_file = BytesIO()
    with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
        capabilities_df.to_excel(writer, sheet_name='Capabilities', index=False)
        competencies_df.to_excel(writer, sheet_name='Competencies', index=False)
        skills_df.to_excel(writer, sheet_name='Skills', index=False)
        behaviors_df.to_excel(writer, sheet_name='Behaviors', index=False)
        proficiencies_df.to_excel(writer, sheet_name='Proficiency Levels', index=False)

    excel_file.seek(0)

    # Return the Excel file as a response
    return send_file(
        excel_file,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        download_name='data_export.xlsx',
        as_attachment=True
    )

@bp.route('/import', methods=['POST'])
def import_data():
    """
    Imports data from an Excel file to the database.
    """
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and file.filename.endswith('.xlsx'):
        try:
            # Read all sheets from the Excel file
            excel_data = pd.read_excel(file, sheet_name=None)

            # Extract DataFrames from the dictionary
            capabilities_df = excel_data.get('Capabilities')
            competencies_df = excel_data.get('Competencies')
            skills_df = excel_data.get('Skills')
            behaviors_df = excel_data.get('Behaviors')
            proficiencies_df = excel_data.get('Proficiency Levels')

            # Validate the dataframes
            if capabilities_df is None or competencies_df is None or skills_df is None or behaviors_df is None or proficiencies_df is None:
                return jsonify({'message': 'Missing sheets in Excel file'}), 400

            # Get the import mode from the request
            mode = request.args.get('mode', 'append')  # Default to 'append' if not specified

            # Validate mode
            if mode not in ['overwrite', 'append']:
                return jsonify({'message': 'Invalid mode. Must be "overwrite" or "append".'}), 400

            # Validate dataframes and extract data
            validation_errors = validate_dataframes(excel_data)
            if validation_errors:
                return jsonify({'message': 'Validation errors', 'errors': validation_errors}), 400

            capabilities_data = excel_data['Capabilities'].to_dict('records')
            competencies_data = excel_data['Competencies'].to_dict('records')
            skills_data = excel_data['Skills'].to_dict('records')
            behaviors_data = excel_data['Behaviors'].to_dict('records')
            proficiencies_data = excel_data['Proficiency Levels'].to_dict('records')

            if mode == 'overwrite':
                # Delete existing data (in reverse order of dependencies)
                Proficiency.query.delete()
                Behavior.query.delete()
                Skill.query.delete()
                Competency.query.delete()
                Capability.query.delete()
                db.session.flush()  # Flush the session to execute the DELETE statements

            # Import data
            for data in capabilities_data:
                capability = Capability(**data)
                db.session.add(capability)

            for data in competencies_data:
                competency = Competency(**data)
                db.session.add(competency)

            for data in skills_data:
                skill = Skill(**data)
                db.session.add(skill)

            for data in behaviors_data:
                behavior = Behavior(**data)
                db.session.add(behavior)

            for data in proficiencies_data:
                proficiency = Proficiency(**data)
                db.session.add(proficiency)

            db.session.commit()
            return jsonify({'message': 'Data imported successfully', 'mode': mode}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'message': str(e)}), 500
    else:
        return jsonify({'message': 'Invalid file type. Please upload an XLSX file'}), 400

def validate_dataframes(excel_data):
    """
    Validates the dataframes and returns a list of errors.
    """
    errors = []

    # Check for missing sheets
    required_sheets = ['Capabilities', 'Competencies', 'Skills', 'Behaviors', 'Proficiency Levels']
    for sheet in required_sheets:
        if sheet not in excel_data:
            errors.append(f'Missing sheet: {sheet}')

    if errors:
        return errors

    # Check for missing columns in each sheet
    required_columns = {
        'Capabilities': ['id', 'name', 'description', 'custom_fields'],
        'Competencies': ['id', 'name', 'description'],
        'Skills': ['id', 'name', 'description', 'category', 'criticality', 'custom_fields', 'is_active'],
        'Behaviors': ['id', 'name', 'description', 'competency_id'],
        'Proficiency Levels': ['id', 'name', 'description', 'level', 'skill_id']
    }

    for sheet, columns in required_columns.items():
        df = excel_data[sheet]
        for column in columns:
            if column not in df.columns:
                errors.append(f'Missing column {column} in sheet {sheet}')

    if errors:
        return errors

    # Check for unique IDs within each sheet
    for sheet in ['Capabilities', 'Competencies', 'Skills', 'Behaviors', 'Proficiency Levels']:
        df = excel_data[sheet]
        if df['id'].duplicated().any():
            errors.append(f'Duplicate IDs found in sheet {sheet}')

    if errors:
        return errors

    # Check for foreign key relationships
    # (This is a simplified example - you'll need to adapt it to your specific relationships)
    skills_df = excel_data['Skills']
    competencies_df = excel_data['Competencies']
    behaviors_df = excel_data['Behaviors']
    proficiencies_df = excel_data['Proficiency Levels']

    # Check if competency_id in Behaviors exists in Competencies
    if not behaviors_df['competency_id'].isin(competencies_df['id']).all():
        errors.append('Invalid competency_id found in Behaviors')

    # Check if skill_id in Proficiencies exists in Skills
    if not proficiencies_df['skill_id'].isin(skills_df['id']).all():
        errors.append('Invalid skill_id found in Proficiency Levels')

    return errors
