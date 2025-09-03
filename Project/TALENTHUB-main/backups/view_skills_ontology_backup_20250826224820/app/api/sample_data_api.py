from flask import Blueprint, jsonify, current_app, request
from sqlalchemy import text, exc

sample_data_bp = Blueprint('sample_data_bp', __name__)

@sample_data_bp.route('/sample_data/<string:table_name>', methods=['GET'])
def get_sample_data(table_name):
    from app import db # Import db here to avoid circular imports and ensure app context

    # Basic validation to prevent SQL injection for table_name
    # Only allow alphanumeric and underscore characters for table names
    if not table_name.replace('_', '').isalnum():
        return jsonify({"error": "Invalid table name"}), 400

    try:
        # Limit to a small number of rows for sample data
        # Use text() for raw SQL to query dynamic table names
        query = text(f"SELECT * FROM {table_name} LIMIT 5")
        
        with db.session.begin():
            result = db.session.execute(query)
            
            # Fetch column names
            columns = result.keys()
            
            # Fetch rows
            rows = result.fetchall()
            
            # Format data as list of dictionaries
            sample_data = []
            for row in rows:
                sample_data.append(dict(zip(columns, row)))
        
        return jsonify({"table": table_name, "data": sample_data})

    except exc.NoSuchTableError:
        current_app.logger.error(f"Table '{table_name}' does not exist.")
        return jsonify({"error": f"Table '{table_name}' not found."}), 404
    except Exception as e:
        print(f"Error fetching sample data for table {table_name}: {e}") # Print to console for debugging
        current_app.logger.error(f"Error fetching sample data for table {table_name}: {e}")
        return jsonify({"error": "An internal error occurred.", "details": str(e)}), 500
