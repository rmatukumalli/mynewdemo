from flask import Flask, send_from_directory, jsonify, request
import json
import os

app = Flask(__name__, static_folder='.')

@app.route('/')
def serve_index():
    return send_from_directory('RoleDictionary', 'index.html')

@app.route('/Role Dictionary V2/add-role-form/<path:filename>')
def serve_add_role_form_files(filename):
    return send_from_directory('RoleDictionary/Role Dictionary V2/add-role-form', filename)

@app.route('/Role Dictionary V2/<path:filename>')
def serve_v2_files(filename):
    return send_from_directory('RoleDictionary/Role Dictionary V2', filename)

@app.route('/add-role-form')
def serve_add_role_form():
    return send_from_directory('RoleDictionary/Role Dictionary V2/add-role-form', 'index.html')

@app.route('/step-<int:step_number>-<string:page_name>.html')
def serve_step_files(step_number, page_name):
    return send_from_directory('RoleDictionary/Role Dictionary V2/add-role-form', f'step-{step_number}-{page_name}.html')

@app.route('/<path:filename>')
def serve_static(filename):
    # This route will handle requests for files directly under the RoleDictionary folder
    # e.g., /app.py, /mock-data.json, /index.html (if not handled by root)
    # It needs to be smart about which subdirectory to look in.
    # For now, let's assume most static files are within RoleDictionary itself or its subfolders.
    # We'll adjust this if more specific routing is needed.
    if filename.startswith('RoleDictionary/'):
        return send_from_directory('.', filename)
    else:
        return send_from_directory('RoleDictionary', filename)

@app.route('/api/mock-data')
def get_mock_data():
    with open('RoleDictionary/mock-data.json') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/generate-jd', methods=['POST'])
def generate_jd():
    data = request.get_json()
    role_title = data.get('role_title')
    role_summary = data.get('role_summary')
    key_responsibilities = data.get('key_responsibilities')

    # Placeholder job description
    job_description = f"""
**Job Title:** {role_title}

**Job Summary:**
{role_summary}

**Key Responsibilities:**
{key_responsibilities}

---
*This is a placeholder job description. To enable AI-powered generation, please provide an OpenAI API key.*
"""
    return jsonify({'job_description': job_description})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)
