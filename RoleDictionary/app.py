from flask import Flask, send_from_directory, jsonify, request
import json
import os

# Set static_folder to the root of the repository.
# When gunicorn runs RoleDictionary.app:app from the root,
# the current working directory for app.py is the repository root.
app = Flask(__name__, static_folder='.')

@app.route('/')
def serve_index():
    # index.html is located at RoleDictionary/index.html relative to the repository root
    return send_from_directory('RoleDictionary', 'index.html')

@app.route('/Role Dictionary V2/add-role-form/<path:filename>')
def serve_add_role_form_files(filename):
    # Files are located at RoleDictionary/Role Dictionary V2/add-role-form/<filename>
    return send_from_directory('RoleDictionary/Role Dictionary V2/add-role-form', filename)

@app.route('/Role Dictionary V2/<path:filename>')
def serve_v2_files(filename):
    # Files are located at RoleDictionary/Role Dictionary V2/<filename>
    return send_from_directory('RoleDictionary/Role Dictionary V2', filename)

@app.route('/add-role-form')
def serve_add_role_form():
    # The add-role-form index.html is at RoleDictionary/Role Dictionary V2/add-role-form/index.html
    return send_from_directory('RoleDictionary/Role Dictionary V2/add-role-form', 'index.html')

@app.route('/step-<int:step_number>-<string:page_name>.html')
def serve_step_files(step_number, page_name):
    # Files are located at RoleDictionary/Role Dictionary V2/add-role-form/step-<int>-<string>.html
    return send_from_directory('RoleDictionary/Role Dictionary V2/add-role-form', f'step-{step_number}-{page_name}.html')

@app.route('/<path:filename>')
def serve_static(filename):
    # This route should serve static files that are directly under the RoleDictionary/ directory
    # e.g., RoleDictionary/mock-data.json, RoleDictionary/skills-ontology.html, RoleDictionary/Images/tip.jpg
    # The filename here would be 'mock-data.json', 'skills-ontology.html', 'Images/tip.jpg'
    # So we need to prepend 'RoleDictionary/' to the path.
    return send_from_directory('RoleDictionary', filename)

@app.route('/TALENTHUB-main/<path:filename>')
def serve_talenthub_main_files(filename):
    # Files are located at TALENTHUB-main/<filename> relative to the repository root
    return send_from_directory('TALENTHUB-main', filename)

@app.route('/api/mock-data')
def get_mock_data():
    # mock-data.json is located at RoleDictionary/mock-data.json relative to the repository root
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
