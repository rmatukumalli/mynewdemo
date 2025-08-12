from flask import Blueprint, render_template, request, jsonify
import time

job_arch_bp = Blueprint('job_arch_bp', __name__, url_prefix='/job_architecture')

@job_arch_bp.after_request
def add_header(response):
    """
    Add headers to force latest content and prevent caching.
    """
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

# --- In-memory Data Store (Comprehensive and updated to new schemas) ---
app_data_store = {
    "organizations": [
        {
            "id": "org_1",
            "company_name": "Akara Airlines",
            "industry": "Aviation",
            "company_size": "10000+",
            "operating_regions": ["North America", "Europe", "Asia"],
            "founded_year": 1990,
            "public_or_private": "Public",
            "stock_symbol": "AKAR",
            "vision_mission": "To connect the world safely and efficiently, fostering global understanding.",
            "org_maturity_level": "Enterprise",
            "hrms_integrated": True,
            "erp_system": "SAP",
            "org_chart_available": True,
            "org_metadata_file": "akara_org_metadata.json"
        }
    ],
    "business_units": [
        {
            "id": "bu_1",
            "name": "Passenger Operations",
            "head": "John Doe",
            "email": "john.doe@akara.com",
            "linked_departments": ["dept_1", "dept_2"],
            "strategic_priority": "Revenue",
            "kpis": "Customer Satisfaction, On-time Performance, Load Factor",
            "business_unit_type": "Core Business",
            "location": "Global",
            "budget_allocation": 500000000
        },
        {
            "id": "bu_2",
            "name": "Cargo Operations",
            "head": "Jane Smith",
            "email": "jane.smith@akara.com",
            "linked_departments": [],
            "strategic_priority": "Support",
            "kpis": "Cargo Volume, Delivery Speed, Damage Rate",
            "business_unit_type": "Support Function",
            "location": "Global",
            "budget_allocation": 100000000
        }
    ],
    "departments": [
        {
            "id": "dept_1",
            "name": "Flight Operations",
            "linked_business_unit": "bu_1",
            "manager": "Pilot Manager",
            "email": "pilot.manager@akara.com",
            "headcount_budget": 500,
            "function_type": "Operational",
            "location": "Various Hubs",
            "shift_coverage": True,
            "time_zone": "UTC",
            "department_code": "FOPS"
        },
        {
            "id": "dept_2",
            "name": "Cabin Crew",
            "linked_business_unit": "bu_1",
            "manager": "Crew Manager",
            "email": "crew.manager@akara.com",
            "headcount_budget": 800,
            "function_type": "Operational",
            "location": "Various Hubs",
            "shift_coverage": True,
            "time_zone": "UTC",
            "department_code": "CCEW"
        }
    ],
    "role_groups": [
        {
            "id": "rg_1",
            "name": "Pilots",
            "description": "Professionals responsible for operating aircraft.",
            "sample_roles": ["Captain", "First Officer"],
            "strategic_importance": "High",
            "business_critical": True,
            "associated_departments": ["dept_1"],
            "role_family_code": "PILOT"
        },
        {
            "id": "rg_2",
            "name": "Cabin Crew",
            "description": "Professionals responsible for passenger safety and service.",
            "sample_roles": ["Flight Attendant", "Purser"],
            "strategic_importance": "High",
            "business_critical": True,
            "associated_departments": ["dept_2"],
            "role_family_code": "CABIN"
        }
    ],
    "job_levels": [
        {
            "id": "jl_1",
            "level_name": "IC1",
            "description": "Individual Contributor Level 1 - Entry Level",
            "salary_band": {"min": 50000, "max": 70000},
            "min_experience_years": 0,
            "allowed_titles": ["Junior Analyst", "Trainee Engineer"],
            "level_code": "IC1",
            "is_managerial": False,
            "promotion_criteria": "Completion of training, positive performance reviews."
        },
        {
            "id": "jl_2",
            "level_name": "L1",
            "description": "Leadership Level 1 - Team Lead",
            "salary_band": {"min": 80000, "max": 100000},
            "min_experience_years": 5,
            "allowed_titles": ["Team Lead", "Senior Specialist"],
            "level_code": "L1",
            "is_managerial": True,
            "promotion_criteria": "Demonstrated leadership, successful project delivery."
        }
    ],
    "jobs_skills": [
        {
            "id": "job_1",
            "job_title": "Captain (A320 Type Rated)",
            "job_level": 5,
            "role_group": "rg_1",
            "job_family": "Pilots",
            "description": "Responsible for safe and efficient flight operations, adhering to all regulations.",
            "required_skills": [
                {"name": "Aircraft Piloting", "level": 5},
                {"name": "Navigation", "level": 4},
                {"name": "Air Traffic Control Communication", "level": 4},
                {"name": "Leadership", "level": 5},
                {"name": "Decision Making", "level": 4},
                {"name": "Stress Management", "level": 3},
                {"name": "Flight Management Systems", "level": 4},
                {"name": "ATPL", "level": 5},
                {"name": "Type Rating (A320)", "level": 5},
                {"name": "Project Management", "level": 3}
            ],
            "education": "Bachelor's Degree in Aviation or equivalent",
            "language_requirements": ["English (Fluent)"],
            "reports_to": "Head of Flight Operations",
            "work_model": "Onsite",
            "job_type": "Full-time",
            "union_affiliation": True,
            "job_code": "SP001",
            "work_location": "Various International Hubs",
            "travel_required": True,
            "compliance_requirements": ["FAA Regulations", "EASA Standards"]
        },
        {
            "id": "job_2",
            "job_title": "First Officer (A320 Type Rated)",
            "job_level": 3,
            "role_group": "rg_1",
            "job_family": "Pilots",
            "description": "Assists the Captain in safe and efficient flight operations.",
            "required_skills": [
                {"name": "Aircraft Piloting", "level": 3},
                {"name": "Navigation", "level": 3},
                {"name": "Air Traffic Control Communication", "level": 3},
                {"name": "Teamwork", "level": 4},
                {"name": "Problem Solving", "level": 3},
                {"name": "Flight Management Systems", "level": 3},
                {"name": "ATPL", "level": 3},
                {"name": "Type Rating (A320)", "level": 3}
            ],
            "education": "Bachelor's Degree in Aviation or equivalent",
            "language_requirements": ["English (Fluent)"],
            "reports_to": "Captain",
            "work_model": "Onsite",
            "job_type": "Full-time",
            "union_affiliation": True,
            "job_code": "FO001",
            "work_location": "Various International Hubs",
            "travel_required": True,
            "compliance_requirements": ["FAA Regulations", "EASA Standards"]
        }
    ],
    "skill_gaps": [
        {
            "id": "sg_1",
            "employee_id": "emp_123",
            "employee_skills": ["Python", "SQL", "Data Analysis"],
            "required_skills": ["Python", "SQL", "Machine Learning", "Cloud Computing"],
            "gap_score": 0.6,
            "urgency": "High",
            "training_suggestions": "Enroll in Machine Learning specialization course, AWS certification.",
            "preferred_learning_format": "Online Course",
            "skill_certification_path": ["Coursera ML Specialization", "AWS Certified Developer"]
        }
    ],
    "career_paths": [
        {
            "id": "cp_1",
            "current_role": "Junior Data Analyst",
            "next_roles": ["Senior Data Analyst", "Data Scientist"],
            "required_skill_delta": ["Advanced Python", "Statistical Modeling", "Big Data Technologies"],
            "time_to_readiness": "12-18 months",
            "learning_resources": ["Udemy Data Science Bootcamp", "Internal mentorship program"],
            "mentorship_available": True,
            "internal_mobility_score": 0.8,
            "recommended_mentors": ["mentor_456", "mentor_789"]
        }
    ],
    "review_ai": {
        "org_completeness_score": 85,
        "skill_coverage_score": 70,
        "role_coverage_map": "mermaid_graph_placeholder", # Placeholder for Mermaid diagram data
        "ai_insights": [
            "**AI Insight:** Organizational structure is robust, but consider adding more regional offices.",
            "**AI Insight:** Critical skill gaps identified in emerging AI/ML technologies across multiple departments.",
            "**AI Insight:** High potential for internal mobility in operational roles; leverage mentorship programs."
        ],
        "talent_risks": ["High attrition in IT department due to competitive market.", "Aging workforce in specialized engineering roles."],
        "suggested_actions": ["Launch targeted recruitment campaign for IT specialists.", "Develop succession plans for key engineering positions."],
        "job_overlap_alerts": ["Potential overlap between 'Marketing Specialist' and 'Digital Campaign Manager' roles."],
        "compliance_alerts": ["Review GDPR compliance for data handling roles."],
        "promotion_blockers": ["Lack of leadership training for mid-level managers."]
    }
}

# --- Helper to generate new IDs ---
def generate_new_id(entity_type):
    current_ids = [int(item['id'].split('_')[1]) for item in app_data_store[entity_type] if '_' in item['id']]
    next_id = max(current_ids) + 1 if current_ids else 1
    # Special handling for 'jobs_skills' to be 'job_X'
    prefix = 'job' if entity_type == 'jobs_skills' else entity_type.replace('s', '')
    return f"{prefix}_{next_id}"

# --- Routes ---
@job_arch_bp.route('/')
def index():
    return render_template('job_architecture/index.html')

@job_arch_bp.route('/api/data', methods=['GET'])
def get_all_data():
    return jsonify(app_data_store)

# --- CRUD Endpoints ---
@job_arch_bp.route('/api/organizations', methods=['POST'])
def add_organization():
    new_org = request.json
    new_org['id'] = generate_new_id('organizations')
    app_data_store['organizations'].append(new_org)
    return jsonify(new_org), 201

@job_arch_bp.route('/api/organizations/<id>', methods=['PUT'])
def update_organization(id):
    org_data = request.json
    for i, org in enumerate(app_data_store['organizations']):
        if org['id'] == id:
            app_data_store['organizations'][i] = {**org, **org_data}
            return jsonify(app_data_store['organizations'][i])
    return jsonify({"error": "Organization not found"}), 404

@job_arch_bp.route('/api/organizations/<id>', methods=['DELETE'])
def delete_organization(id):
    global app_data_store
    initial_len = len(app_data_store['organizations'])
    app_data_store['organizations'] = [org for org in app_data_store['organizations'] if org['id'] != id]
    if len(app_data_store['organizations']) < initial_len:
        return jsonify({"message": "Organization deleted"}), 200
    return jsonify({"error": "Organization not found"}), 404

@job_arch_bp.route('/api/business_units', methods=['POST'])
def add_business_unit():
    new_bu = request.json
    new_bu['id'] = generate_new_id('business_units')
    app_data_store['business_units'].append(new_bu)
    return jsonify(new_bu), 201

@job_arch_bp.route('/api/business_units/<id>', methods=['PUT'])
def update_business_unit(id):
    bu_data = request.json
    for i, bu in enumerate(app_data_store['business_units']):
        if bu['id'] == id:
            app_data_store['business_units'][i] = {**bu, **bu_data}
            return jsonify(app_data_store['business_units'][i])
    return jsonify({"error": "Business Unit not found"}), 404

@job_arch_bp.route('/api/business_units/<id>', methods=['DELETE'])
def delete_business_unit(id):
    global app_data_store
    initial_len = len(app_data_store['business_units'])
    app_data_store['business_units'] = [bu for bu in app_data_store['business_units'] if bu['id'] != id]
    if len(app_data_store['business_units']) < initial_len:
        return jsonify({"message": "Business Unit deleted"}), 200
    return jsonify({"error": "Business Unit not found"}), 404

@job_arch_bp.route('/api/departments', methods=['POST'])
def add_department():
    new_dept = request.json
    new_dept['id'] = generate_new_id('departments')
    app_data_store['departments'].append(new_dept)
    return jsonify(new_dept), 201

@job_arch_bp.route('/api/departments/<id>', methods=['PUT'])
def update_department(id):
    dept_data = request.json
    for i, dept in enumerate(app_data_store['departments']):
        if dept['id'] == id:
            app_data_store['departments'][i] = {**dept, **dept_data}
            return jsonify(app_data_store['departments'][i])
    return jsonify({"error": "Department not found"}), 404

@job_arch_bp.route('/api/departments/<id>', methods=['DELETE'])
def delete_department(id):
    global app_data_store
    initial_len = len(app_data_store['departments'])
    app_data_store['departments'] = [dept for dept in app_data_store['departments'] if dept['id'] != id]
    if len(app_data_store['departments']) < initial_len:
        return jsonify({"message": "Department deleted"}), 200
    return jsonify({"error": "Department not found"}), 404

@job_arch_bp.route('/api/rolegroups', methods=['POST'])
def add_role_group():
    new_rg = request.json
    new_rg['id'] = generate_new_id('role_groups')
    app_data_store['role_groups'].append(new_rg)
    return jsonify(new_rg), 201

@job_arch_bp.route('/api/rolegroups/<id>', methods=['PUT'])
def update_role_group(id):
    rg_data = request.json
    for i, rg in enumerate(app_data_store['role_groups']):
        if rg['id'] == id:
            app_data_store['role_groups'][i] = {**rg, **rg_data}
            return jsonify(app_data_store['role_groups'][i])
    return jsonify({"error": "Role Group not found"}), 404

@job_arch_bp.route('/api/rolegroups/<id>', methods=['DELETE'])
def delete_role_group(id):
    global app_data_store
    initial_len = len(app_data_store['role_groups'])
    app_data_store['role_groups'] = [rg for rg in app_data_store['role_groups'] if rg['id'] != id]
    if len(app_data_store['role_groups']) < initial_len:
        return jsonify({"message": "Role Group deleted"}), 200
    return jsonify({"error": "Role Group not found"}), 404

@job_arch_bp.route('/api/joblevels', methods=['POST'])
def add_job_level():
    new_jl = request.json
    new_jl['id'] = generate_new_id('job_levels')
    app_data_store['job_levels'].append(new_jl)
    return jsonify(new_jl), 201

@job_arch_bp.route('/api/joblevels/<id>', methods=['PUT'])
def update_job_level(id):
    jl_data = request.json
    for i, jl in enumerate(app_data_store['job_levels']):
        if jl['id'] == id:
            app_data_store['job_levels'][i] = {**jl, **jl_data}
            return jsonify(app_data_store['job_levels'][i])
    return jsonify({"error": "Job Level not found"}), 404

@job_arch_bp.route('/api/joblevels/<id>', methods=['DELETE'])
def delete_job_level(id):
    global app_data_store
    initial_len = len(app_data_store['job_levels'])
    app_data_store['job_levels'] = [jl for jl in app_data_store['job_levels'] if jl['id'] != id]
    if len(app_data_store['job_levels']) < initial_len:
        return jsonify({"message": "Job Level deleted"}), 200
    return jsonify({"error": "Job Level not found"}), 404

@job_arch_bp.route('/api/jobs_skills', methods=['POST'])
def add_job_skill():
    new_js = request.json
    new_js['id'] = generate_new_id('jobs_skills')
    app_data_store['jobs_skills'].append(new_js)
    return jsonify(new_js), 201

@job_arch_bp.route('/api/jobs_skills/<id>', methods=['PUT'])
def update_job_skill(id):
    js_data = request.json
    for i, js in enumerate(app_data_store['jobs_skills']):
        if js['id'] == id:
            app_data_store['jobs_skills'][i] = {**js, **js_data}
            return jsonify(app_data_store['jobs_skills'][i])
    return jsonify({"error": "Job Skill not found"}), 404

@job_arch_bp.route('/api/jobs_skills/<id>', methods=['DELETE'])
def delete_job_skill(id):
    global app_data_store
    initial_len = len(app_data_store['jobs_skills'])
    app_data_store['jobs_skills'] = [js for js in app_data_store['jobs_skills'] if js['id'] != id]
    if len(app_data_store['jobs_skills']) < initial_len:
        return jsonify({"message": "Job Skill deleted"}), 200
    return jsonify({"error": "Job Skill not found"}), 404

# --- GenAI Integration Endpoints (Simulated) ---
@job_arch_bp.route('/api/ai/generate_job_description', methods=['POST'])
def ai_generate_job_description():
    data = request.json
    job_title = data.get('jobTitle', 'Default Job')
    time.sleep(1.5) # Simulate AI processing time
    return jsonify({
        "description": f"AI-generated detailed description for {job_title}: This role involves comprehensive responsibilities in {job_title.lower()} operations, requiring strong analytical and leadership skills.",
        "core_skills": [f"Advanced {job_title.replace(' ', '')} Skills", "Strategic Planning"],
        "soft_skills": ["Communication", "Teamwork"],
            "tools_technologies": ["Industry Software X", "Analytics Platform Y"],
            "certifications": ["Relevant Certification Z"]
        })

@job_arch_bp.route('/api/ai/suggest_missing_skills', methods=['POST'])
def ai_suggest_missing_skills():
    data = request.json
    current_skills = data.get('currentSkills', [])
    job_title = data.get('jobTitle', 'Generic Role')
    time.sleep(1.0)
    return jsonify({
        "suggested_skills": [f"AI Suggested Skill for {job_title} 1", f"AI Suggested Skill for {job_title} 2"]
    })

@job_arch_bp.route('/api/ai/career_path_recommendation', methods=['POST'])
def ai_career_path_recommendation():
    data = request.json
    current_role = data.get('currentRole', 'Current Role')
    time.sleep(1.0)
    return jsonify({
        "next_roles": [f"Senior {current_role}", f"Lead {current_role.replace('Junior ', '')}"],
        "required_skill_delta": ["Leadership Skills", "Project Management"],
        "time_to_readiness": "6-12 months",
        "learning_resources": ["Online Course: Leadership", "Mentorship Program"],
        "mentorship_available": True,
        "internal_mobility_score": 0.75,
        "recommended_mentors": ["Mentor A", "Mentor B"]
    })

@job_arch_bp.route('/api/ai/risk_predictions', methods=['POST'])
def ai_risk_predictions():
    data = request.json
    time.sleep(1.0)
    return jsonify({
        "talent_risks": ["High attrition risk in junior roles.", "Skill shortage in emerging tech."],
        "promotion_blockers": ["Lack of clear career progression paths for mid-level staff."]
    })

@job_arch_bp.route('/api/ai/training_plan_generation', methods=['POST'])
def ai_training_plan_generation():
    data = request.json
    skill_gap = data.get('skillGap', 'Generic Skill Gap')
    time.sleep(1.0)
    return jsonify({
        "training_plan": f"Comprehensive training plan for {skill_gap}: Module 1 (Basics), Module 2 (Advanced), Project-based learning."
    })

@job_arch_bp.route('/api/ai/organizational_insights', methods=['POST'])
def ai_organizational_insights():
    data = request.json
    time.sleep(1.5)
    return jsonify({
        "insights": [
            "**AI Insight:** Overall organizational completeness is good.",
            "**AI Insight:** Skill coverage needs improvement in specific departments.",
            "**AI Insight:** Role overlaps detected in certain business units."
        ],
        "job_overlap_alerts": ["Marketing Specialist vs. Digital Campaign Manager"],
        "compliance_alerts": ["Data privacy roles require updated certifications."],
        "promotion_blockers": ["Insufficient leadership development programs."]
    })

@job_arch_bp.route('/api/ai/role_clustering_recommendations', methods=['POST'])
def ai_role_clustering_recommendations():
    data = request.json
    time.sleep(1.0)
    return jsonify({
        "role_clusters": ["Sales & Marketing Cluster", "Engineering & Product Cluster"],
        "bu_recommendations": ["Consider a new 'Digital Transformation' Business Unit."],
        "department_recommendations": ["Merge 'Customer Support' and 'Technical Support' departments."]
    })

@job_arch_bp.route('/career_paths_content')
def career_paths_content():
    return render_template('job_architecture/career_paths_content.html')

@job_arch_bp.route('/step/<step_name>')
def get_step_partial(step_name):
    # Ensure the step_name corresponds to an existing template file
    # This prevents arbitrary file access
    valid_steps = [
        "organization", "business_units", "departments", "role_groups",
        "job_levels", "jobs_skills", "skill_gaps", "career_paths", "review_ai"
    ]
    if step_name not in valid_steps:
        return "Step not found", 404
    return render_template(f'job_architecture/{step_name}.html')
