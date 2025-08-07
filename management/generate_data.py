import uuid
import datetime
import json
import random
from faker import Faker
import os
import sys

# Add the parent directory to the sys.path to allow importing app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import (
    RelationshipType, SkillRelationship, Capability, Competency, Behavior, Skill,
    Proficiency, Organization, BusinessUnit, Department, RoleGroup, JobLevel,
    JobProfile, CareerPath, Role, SkillTag, UserSkill, UserCareerHistory,
    Assessment, LearningResource, LearningPath, User, SkillGap,
    ProjectOrAssignment, Certification, Feedback, LearningPathResourceAssociation # Added new models
    # Import association tables if they are defined as db.Table objects and need direct manipulation
    # For many-to-many relationships, SQLAlchemy typically handles insertions via relationships
    # so explicit import of these might not be needed for direct insertion.
    # However, for clearing, we might need to reference them.
    # For now, let's assume direct models are sufficient for clearing.
)

fake = Faker()

# Define the skill lists provided by the user
SKILL_LISTS = {
    "Product Management": [
        "Technical expertise", "UX understanding", "Business savvy", "Critical thinking",
        "Data analysis", "Research skills", "Problem-solving", "Prioritization & roadmapping",
        "Strategic thinking", "Communication & storytelling", "Leadership & team building",
        "Adaptability & agility", "Risk management", "Time management", "Technical writing",
        "Empathy & emotional intelligence", "Relationship management", "Self-awareness",
        "Storytelling", "AI tool proficiency", "Market adaptability", "Experimentation mindset",
        "Deep work focus", "Budgeting", "Stakeholder management", "Competitive analysis",
        "Metrics definition (OKRs/KPIs)", "User testing", "Product positioning",
        "Product launch strategy", "Pricing models", "Go-to-market planning",
        "Customer feedback integration", "UX stakeholder liaison", "Cross-functional facilitation",
        "Documentation", "Negotiation", "Presentation skills", "Vendor management",
        "Performance tracking", "Cost-benefit analysis", "Cross-market research",
        "Specification writing", "Regulatory awareness", "Product visioning", "ROI evaluation",
        "Backlog grooming", "Sprint planning", "Product lifecycle management", "Agile methodologies",
        "Feature definition", "User story creation", "A/B testing", "Market research synthesis",
        "Roadmap communication", "Interpersonal skills", "Conflict resolution for product teams",
        "Product discovery", "Value proposition design", "Competitive intelligence",
        "Product pricing strategy", "Data visualization for product insights",
        "Market segmentation analysis", "Customer journey mapping", "Feature prioritization frameworks"
    ],
    "Software Engineering": [
        "Programming (Python)", "Programming (Java)", "Programming (C++)", "Programming (JavaScript)",
        "Algorithms & data structures", "Software architecture (OOD)", "Software development methodologies (Agile)",
        "Software development methodologies (DevOps)", "Testing & debugging", "Database management (SQL)",
        "Database management (NoSQL)", "Version control (Git)", "API design & integration (REST)",
        "API design & integration (GraphQL)", "Cloud platforms (AWS)", "Cloud platforms (Azure)",
        "Cloud platforms (GCP)", "Containerization (Docker)", "Containerization (Kubernetes)",
        "Frontend frameworks (React)", "Frontend frameworks (Angular)", "Frontend frameworks (Vue.js)",
        "Backend frameworks (Node.js)", "Backend frameworks (Django)", "Backend frameworks (Spring)",
        "Software performance optimization", "CI/CD pipelines", "Security best practices", "Problem-solving",
        "Communication", "Teamwork", "Time management", "Attention to detail", "Object-oriented design",
        "Functional programming paradigms", "Code review & refactoring", "Design patterns",
        "Performance profiling", "Technical documentation", "Mentorship", "System design",
        "Scalability & reliability engineering", "Debugging tools (GDB)", "Debugging tools (Chrome DevTools)",
        "API testing tools (Postman)", "API testing tools (REST Assured)", "UX-aware coding",
        "Cross-platform development", "Mobile development (iOS)", "Mobile development (Android)",
        "DevOps culture adoption", "Cloud infrastructure-as-code (Terraform)", "Observability & logging",
        "Data privacy compliance (GDPR)", "Unit testing frameworks (JUnit)", "Unit testing frameworks (PyTest)",
        "Integration testing", "Performance testing", "Code optimization", "Build automation (Maven)",
        "Build automation (Gradle)", "CI/CD tools (Jenkins)", "CI/CD tools (CircleCI)", "Monitoring tools",
        "Problem anticipation", "Creative idea generation", "Serverless architecture", "Microservices architecture",
        "Message queues (Kafka)", "Real-time systems design", "Event-driven design", "Blockchain fundamentals",
        "Machine learning integration", "Big data technologies (Spark)", "Distributed systems"
    ],
    "Human Resources": [
        "Employee relations", "Onboarding & offboarding", "HRIS systems (Workday)", "HRIS systems (SAP SuccessFactors)",
        "Performance management", "Project management", "Payroll administration", "Compliance (FMLA)",
        "Compliance (Labor Law)", "Communication", "Teamwork", "Scheduling & logistics",
        "Discretion & confidentiality", "Business acumen", "Strategic planning", "Leadership & coaching",
        "Human capital development", "Diversity & inclusion", "Emotional intelligence", "Conflict management",
        "Active listening", "Data-driven decisions (KPIs)", "Data-driven decisions (Benchmarking)",
        "HR strategy alignment", "Digital literacy & technology adoption", "Coaching & mentoring",
        "Talent acquisition & recruitment", "Employer branding", "Learning & development design",
        "Succession planning", "Change management", "Compensation & benefits", "Cultural competency",
        "Training delivery", "Policy development", "Regulatory compliance", "Wellness program design",
        "Analytics (Turnover)", "Analytics (Engagement)", "Vendor management", "HR analytics tools",
        "Onboarding process optimization", "Performance review frameworks", "Succession pipelines",
        "Workforce planning", "Workforce diversity", "ROI evaluation (HR Programs)", "Engagement surveys",
        "Compensation benchmarking", "Exit interview best practices", "Workplace investigations",
        "Remote work policy development", "Compensation modeling", "Employee engagement strategies",
        "HR legal knowledge", "Global HR practices", "Organizational development", "HR reporting",
        "Employee counseling", "Negotiation (labor relations)"
    ],
    "Aviation": [
        "Aviation communication/verbal protocol", "Situational awareness", "Analytical thinking",
        "Technical proficiency (aircraft systems)", "Teamwork", "Leadership & crew coordination",
        "Decision-making under pressure", "Time management", "Self-discipline & stress management",
        "Foreign language proficiency (Aviation English)", "Problem-solving", "Adaptability",
        "Attention to detail", "Conflict resolution", "Crisis management", "Stress resilience",
        "Risk management", "Crew resource management (CRM)", "Emergency response",
        "Navigation & meteorology", "Regulatory knowledge (FAA)", "Regulatory knowledge (EASA)",
        "Safety compliance", "Ground operations coordination", "Maintenance oversight",
        "Instruction & training", "Customer service (Aviation)", "Load planning",
        "Air traffic control liaison", "Quality assurance (Aviation)", "Technical documentation (Aircraft)",
        "Scheduling & dispatch", "Aviation security protocols", "Fatigue management", "SOP adherence",
        "Regulatory reporting", "Flight planning", "Fuel management", "Weight/balance calculations",
        "Performance monitoring (Aircraft)", "Telecommunication (Aviation)", "Logistics (Aviation)",
        "Airport operations", "Regulatory audit (Aviation)", "Manual dexterity (Flight Controls)",
        "Simulator training", "Instructor evaluation (Flight)", "Environmental awareness (Aviation)",
        "Maintenance logging", "Airworthiness standards", "Aerodynamics fundamentals", "Aircraft marshalling",
        "Air cargo operations", "Passenger handling procedures", "Runway safety", "Aviation cybersecurity",
        "International flight procedures", "Aircraft systems troubleshooting"
    ]
}

def generate_organization_data(num=3):
    data = []
    for _ in range(num):
        org_id = str(uuid.uuid4())
        data.append({
            "id": org_id,
            "company_name": fake.company(),
            "industry": fake.job(),
            "company_size": random.choice(["Small", "Medium", "Large", "Enterprise"]),
            "operating_regions": ", ".join(random.sample([fake.country() for _ in range(5)], random.randint(1, 3))),
            "founded_year": fake.year(),
            "public_or_private": random.choice(["Public", "Private"]),
            "stock_symbol": fake.pystr(min_chars=3, max_chars=5).upper() if random.choice([True, False]) else None,
            "vision_mission": fake.sentence(nb_words=10),
            "org_maturity_level": random.choice(["Startup", "Growth", "Mature", "Stagnant"]),
            "hrms_integrated": fake.boolean(),
            "erp_system": random.choice(["SAP", "Oracle", "Workday", "None"]),
            "org_chart_available": fake.boolean(),
            "org_metadata_file": fake.file_name(category='documents', extension='pdf')
        })
    return data

def generate_business_unit_data(organizations, num_per_org=3):
    data = []
    for org in organizations:
        org_id = org["id"]
        for _ in range(num_per_org):
            bu_id = str(uuid.uuid4())
            data.append({
                "id": bu_id,
                "name": fake.bs(),
                "head": fake.name(),
                "email": fake.email(),
                "organization_id": org_id,
                "strategic_priority": fake.sentence(nb_words=5),
                "kpis": f"Revenue Growth: {random.randint(5,20)}%, Customer Satisfaction: {random.randint(70,95)}%",
                "business_unit_type": random.choice(["Product", "Service", "Regional", "Support"]),
                "location": fake.city(),
                "budget_allocation": random.randint(1000000, 50000000)
            })
    return data

def generate_department_data(business_units, num_per_bu=4):
    data = []
    used_department_names = set()
    for bu in business_units:
        bu_id = bu["id"]
        for _ in range(num_per_bu):
            dept_id = str(uuid.uuid4())
            dept_name = ""
            # Generate a unique department name
            while True:
                dept_name = fake.word().capitalize() + " Department"
                if dept_name not in used_department_names:
                    used_department_names.add(dept_name)
                    break
            
            data.append({
                "id": dept_id,
                "name": dept_name,
                "business_unit_id": bu_id,
                "manager": fake.name(),
                "email": fake.email(),
                "headcount_budget": random.randint(10, 200),
                "function_type": random.choice(["Core", "Support", "R&D", "Sales"]),
                "location": fake.city(),
                "shift_coverage": fake.boolean(),
                "time_zone": fake.timezone(),
                "department_code": fake.pystr(min_chars=3, max_chars=5).upper()
            })
    return data

def generate_job_level_data():
    levels = [
        ("Intern", "Entry-level position for students or recent graduates.", 30000, 40000, 0, ["Intern", "Trainee"]),
        ("Junior", "Entry-level professional with limited experience.", 45000, 60000, 1, ["Junior Associate", "Analyst I"]),
        ("Associate", "Developing professional with some experience.", 65000, 85000, 2, ["Associate", "Specialist"]),
        ("Senior", "Experienced professional with significant expertise.", 90000, 120000, 5, ["Senior Associate", "Lead Specialist"]),
        ("Manager", "Manages a small team or specific function.", 125000, 160000, 7, ["Manager", "Team Lead"]),
        ("Director", "Oversees multiple teams or a major department.", 165000, 220000, 10, ["Director", "Senior Manager"]),
        ("VP", "Executive leading a major business unit or division.", 225000, 350000, 12, ["Vice President", "Executive Director"])
    ]
    data = []
    for i, (name, desc, min_sal, max_sal, min_exp, titles) in enumerate(levels):
        data.append({
            "id": str(uuid.uuid4()),
            "level_name": name,
            "description": desc,
            "salary_band_min": min_sal,
            "salary_band_max": max_sal,
            "min_experience_years": min_exp,
            "allowed_titles": ", ".join(titles),
            "level_code": f"JL{i+1:02d}",
            "is_managerial": "Manager" in name or "Director" in name or "VP" in name,
            "promotion_criteria": fake.sentence(nb_words=8)
        })
    return data

def generate_role_group_data():
    groups = [
        ("Core Product Development", "Focuses on building and iterating core product features.", "Product Manager, Product Designer, Software Engineer", "High", True, "Product, Engineering", "RPD"),
        ("Customer Experience", "Ensures positive customer interactions and support.", "Customer Support Specialist, UX Designer, Customer Success Manager", "Medium", False, "Customer Service, UX", "CX"),
        ("Strategic HR", "Develops and implements HR strategies.", "HR Business Partner, Talent Acquisition Manager", "High", True, "Human Resources", "SHR"),
        ("Flight Operations", "Handles all aspects of flight execution and safety.", "Pilot, Flight Attendant, Dispatcher", "Critical", True, "Aviation", "FO")
    ]
    data = []
    for name, desc, sample_roles, strategic_importance, business_critical, associated_departments, code in groups:
        data.append({
            "id": str(uuid.uuid4()),
            "name": name,
            "description": desc,
            "sample_roles": sample_roles,
            "strategic_importance": strategic_importance,
            "business_critical": business_critical,
            "associated_departments": associated_departments,
            "role_family_code": code
        })
    return data

def generate_capability_data():
    data = []
    capabilities = ["Product Management", "Software Engineering", "Human Resources", "Aviation"]
    for capability_name in capabilities:
        data.append({
            "id": str(uuid.uuid4()),
            "name": capability_name,
            "description": f"Skills related to {capability_name}",
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "custom_fields": json.dumps({"version": "1.0", "owner": fake.name()}),
            "is_active": True
        })
    return data

def generate_unique_skill_data():
    data = []
    all_unique_skill_names = set()
    
    for capability_name, skills_for_capability in SKILL_LISTS.items():
        for skill_name in skills_for_capability:
            all_unique_skill_names.add(skill_name)

    for skill_name in sorted(list(all_unique_skill_names)):
        skill_id = str(uuid.uuid4())
        data.append({
            "id": skill_id,
            "name": skill_name,
            "description": fake.sentence(nb_words=8),
            "category": random.choice(["Technical", "Soft", "Domain", "Tool"]),
            "criticality": random.choice(["High", "Medium", "Low"]),
            "level": random.choice(["Beginner", "Intermediate", "Advanced", "Expert"]),
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "custom_fields": json.dumps({}), # No direct capability mapping here
            "is_active": True
        })
    return data

def generate_competency_data(capabilities):
    data = []
    for capability in capabilities:
        comp_names = {
            "Product Management": ["Market Understanding", "Product Strategy", "Execution & Delivery", "Stakeholder Management"],
            "Software Engineering": ["Technical Proficiency", "System Design", "Problem Solving", "Collaboration & Quality"],
            "Human Resources": ["Talent Management", "HR Operations", "Strategic Partnership", "Employee Advocacy"],
            "Aviation": ["Flight Operations Mastery", "Safety & Compliance", "Crew Resource Management", "Technical Systems Knowledge"]
        }
        for name in comp_names.get(capability["name"], []):
            data.append({
                "id": str(uuid.uuid4()),
                "name": name,
                "description": fake.sentence(nb_words=10),
                "custom_fields": json.dumps({"capability_id": capability["id"]}) # Keep for reference if needed
            })
    return data

def generate_behavior_data(competencies_objects, job_levels): # Renamed parameter
    data = []
    behavior_templates = {
        "Market Understanding": [
            "Analyzes market trends to identify opportunities.",
            "Conducts thorough competitive analysis.",
            "Translates customer needs into product requirements."
        ],
        "Product Strategy": [
            "Defines clear product vision and roadmap.",
            "Prioritizes features based on business value and impact.",
            "Communicates product strategy effectively to stakeholders."
        ],
        "Execution & Delivery": [
            "Manages product backlog efficiently.",
            "Collaborates with engineering for timely delivery.",
            "Ensures product quality through testing and feedback loops."
        ],
        "Stakeholder Management": [
            "Builds strong relationships with internal and external stakeholders.",
            "Negotiates effectively to achieve product goals.",
            "Manages expectations and resolves conflicts."
        ],
        "Technical Proficiency": [
            "Writes clean, efficient, and well-documented code.",
            "Applies appropriate data structures and algorithms.",
            "Debugs complex issues systematically."
        ],
        "System Design": [
            "Designs scalable and resilient software architectures.",
            "Considers security and performance in design choices.",
            "Evaluates different technology stacks for optimal solutions."
        ],
        "Problem Solving": [
            "Identifies root causes of technical issues.",
            "Develops innovative solutions to complex problems.",
            "Breaks down large problems into manageable components."
        ],
        "Collaboration & Quality": [
            "Participates actively in code reviews.",
            "Adheres to coding standards and best practices.",
            "Contributes to a positive team environment."
        ],
        "Talent Management": [

            "Develops effective recruitment strategies.",
            "Implements robust performance management systems.",
            "Facilitates employee development and career growth."
        ],
        "HR Operations": [
            "Manages payroll and benefits accurately.",
            "Ensures compliance with labor laws and regulations.",
            "Administers HRIS effectively."
        ],
        "Strategic Partnership": [
            "Advises leadership on human capital strategies.",
            "Aligns HR initiatives with business objectives.",
            "Acts as a trusted advisor to employees and managers."
        ],
        "Employee Advocacy": [
            "Promotes a positive and inclusive workplace culture.",
            "Resolves employee conflicts fairly and impartially.",
            "Champions employee well-being and engagement."
        ],
        "Flight Operations Mastery": [
            "Executes flight plans with precision and safety.",
            "Demonstrates expert navigation and meteorology knowledge.",
            "Manages fuel and weight/balance effectively."
        ],
        "Safety & Compliance": [
            "Adheres strictly to aviation regulations (FAA/EASA).",
            "Identifies and mitigates aviation risks.",
            "Responds effectively to in-flight emergencies."
        ],
        "Crew Resource Management": [
            "Communicates clearly and concisely with crew members.",
            "Exercises effective leadership in the cockpit.",
            "Fosters a culture of teamwork and mutual support."
        ],
        "Technical Systems Knowledge": [
            "Demonstrates in-depth understanding of aircraft systems.",
            "Troubleshoots mechanical and electronic issues.",
            "Performs pre-flight and post-flight checks meticulously."
        ]
    }

    for competency_obj in competencies_objects: # Iterate over objects
        competency_id = competency_obj.id # Access ID from object
        comp_name = competency_obj.name # Access name from object
        for jl in job_levels:
            job_level_id = jl["id"]
            behaviors = behavior_templates.get(comp_name, [])
            for behavior_desc in behaviors:
                data.append({
                    "id": str(uuid.uuid4()),
                    "name": f"{comp_name} - {behavior_desc[:30]}...",
                    "description": behavior_desc,
                    "competency_id": competency_id,
                    "job_level_id": job_level_id, # Optional, adding it to some
                    "level": random.choice(["Novice", "Proficient", "Expert"])
                })
    return data


def generate_proficiency_data(skills):
    data = []
    for skill in skills:
        skill_id = skill["id"]
        for i in range(1, 6): # Levels 1 to 5
            data.append({
                # "id": str(uuid.uuid4()), # Removed manual ID generation, let DB auto-increment
                "name": f"Level {i}",
                "description": f"Proficiency level {i} for {skill['name']}",
                "level": i,
                "skill_id": skill_id
            })
    return data

def generate_role_data(departments, job_levels):
    data = []
    
    # Calculate total number of roles needed across all departments
    total_roles_needed = sum(random.randint(2, 5) for _ in departments)
    
    # Generate a pool of unique role names upfront
    unique_role_names = set()
    role_names_pool = [
        "Product Manager", "Software Engineer", "HR Business Partner", "Pilot",
        "Senior Product Manager", "Lead Software Engineer", "Talent Acquisition Specialist", "Flight Attendant",
        "UX Designer", "DevOps Engineer", "Compensation & Benefits Analyst", "Aircraft Maintenance Technician"
    ]
    
    # Populate unique_role_names with predefined names first
    for name in role_names_pool:
        unique_role_names.add(name)

    # Generate additional unique names using faker until we have enough
    while len(unique_role_names) < total_roles_needed + 50: # Add a buffer
        new_name = fake.job()
        if new_name not in unique_role_names:
            unique_role_names.add(new_name)
    
    # Convert to a list and shuffle for random assignment
    shuffled_unique_role_names = list(unique_role_names)
    random.shuffle(shuffled_unique_role_names)

    name_index = 0
    for dept in departments:
        dept_id = dept["id"]
        for _ in range(random.randint(2, 5)):
            role_id = str(uuid.uuid4())
            job_level = random.choice(job_levels)
            
            # Assign a unique role name from the shuffled pool
            if name_index < len(shuffled_unique_role_names):
                role_name = shuffled_unique_role_names[name_index]
                name_index += 1
            else:
                # Fallback if somehow we run out of pre-generated unique names (shouldn't happen with buffer)
                role_name = f"Fallback Role {uuid.uuid4().hex[:8]}" 

            data.append({
                "id": role_id,
                "name": role_name,
                "description": fake.sentence(nb_words=10),
                "department_id": dept_id,
                "job_level_id": job_level["id"],
                "created_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat(),
                "custom_fields": json.dumps({"responsibilities": fake.paragraph(nb_sentences=2)}),
                "is_active": True
            })
    return data

def generate_job_profile_data(job_levels, role_groups):
    data = []
    job_titles = {
        "Product Management": ["Product Manager", "Senior Product Manager", "Associate Product Manager"],
        "Software Engineering": ["Software Engineer I", "Software Engineer II", "Senior Software Engineer", "Lead Software Engineer"],
        "Human Resources": ["HR Generalist", "HR Business Partner", "Talent Acquisition Specialist", "Compensation Analyst"],
        "Aviation": ["First Officer", "Captain", "Flight Instructor", "Air Traffic Controller"]
    }
    for jl in job_levels:
        for rg in role_groups:
            if "Product" in rg["name"] and "Product Management" in job_titles:
                titles = job_titles["Product Management"]
            elif "Software" in rg["name"] and "Software Engineering" in job_titles:
                titles = job_titles["Software Engineering"]
            elif "HR" in rg["name"] and "Human Resources" in job_titles:
                titles = job_titles["Human Resources"]
            elif "Flight" in rg["name"] and "Aviation" in job_titles:
                titles = job_titles["Aviation"]
            else:
                titles = [fake.job()] # Fallback

            for _ in range(random.randint(1, 2)):
                data.append({
                    "id": str(uuid.uuid4()),
                    "job_title": random.choice(titles),
                    "job_level_id": jl["id"],
                    "role_group_id": rg["id"],
                    "job_family": rg["name"],
                    "description": fake.paragraph(nb_sentences=3),
                    "education": random.choice(["Bachelor's", "Master's", "PhD", "High School"]),
                    "language_requirements": random.choice(["English", "English, Spanish", "None"]),
                    "reports_to": fake.name() + " (Manager)",
                    "work_model": random.choice(["Remote", "Hybrid", "On-site"]),
                    "job_type": random.choice(["Full-time", "Part-time", "Contract"]),
                    "union_affiliation": fake.boolean(),
                    "job_code": fake.pystr(min_chars=4, max_chars=6).upper(),
                    "work_location": fake.city(),
                    "travel_required": fake.boolean(),
                    "compliance_requirements": fake.sentence(nb_words=5)
                })
    return data

def generate_relationship_type_data():
    types = [
        ("Prerequisite", "One skill must be acquired before another."),
        ("Complementary", "Two skills enhance each other."),
        ("Sub-skill", "One skill is a specific component of a broader skill."),
        ("Related", "Skills are generally associated but not directly dependent.")
    ]
    data = []
    for name, desc in types:
        data.append({
            "id": str(uuid.uuid4()),
            "name": name,
            "description": desc
        })
    return data

def generate_skill_relationship_data(skills, relationship_types):
    data = []
    # Ensure a reasonable number of relationships without making it too dense
    num_relationships = len(skills) * 2 # Roughly 2 relationships per skill on average
    if len(skills) < 2: return [] # Cannot create relationships with less than 2 skills

    # Create a mapping from skill name to skill object for easy lookup
    skill_name_to_obj = {skill['name']: skill for skill in skills}

    # Collect all possible skill relationships based on SKILL_LISTS
    # This is a simplified approach; in a real scenario, you'd define these relationships explicitly
    potential_relationships = []
    for capability_name, skills_in_cap in SKILL_LISTS.items():
        for i in range(len(skills_in_cap)):
            for j in range(i + 1, len(skills_in_cap)):
                s1_name = skills_in_cap[i]
                s2_name = skills_in_cap[j]
                
                s1_obj = skill_name_to_obj.get(s1_name)
                s2_obj = skill_name_to_obj.get(s2_name)

                if s1_obj and s2_obj:
                    # Randomly pick a relationship type
                    rel_type = random.choice(relationship_types)
                    potential_relationships.append({
                        "source_skill_id": s1_obj["id"],
                        "target_skill_id": s2_obj["id"],
                        "relationship_type_id": rel_type["id"]
                    })
                    # Add reverse relationship for 'Complementary' or 'Related'
                    if rel_type["name"] in ["Complementary", "Related"]:
                        potential_relationships.append({
                            "source_skill_id": s2_obj["id"],
                            "target_skill_id": s1_obj["id"],
                            "relationship_type_id": rel_type["id"]
                        })
    
    # Deduplicate relationships to avoid integrity errors
    unique_relationships = set()
    for rel in potential_relationships:
        # Create a tuple of sorted IDs and type to ensure uniqueness regardless of order for symmetric types
        if rel['relationship_type_id'] in [t['id'] for t in relationship_types if t['name'] in ["Complementary", "Related"]]:
            key = tuple(sorted((rel['source_skill_id'], rel['target_skill_id']))) + (rel['relationship_type_id'],)
        else:
            key = (rel['source_skill_id'], rel['target_skill_id'], rel['relationship_type_id'])
        
        if key not in unique_relationships:
            data.append({
                # "id": len(data) + 1, # Removed manual ID generation, let DB auto-increment
                **rel
            })
            unique_relationships.add(key)

    return data

def generate_skill_tag_data():
    tags = ["Software", "Product", "HR", "Aviation", "Soft Skills", "Technical", "Management", "Compliance"]
    data = []
    for tag_name in tags:
        data.append({
            "id": str(uuid.uuid4()),
            "name": tag_name,
            "description": f"Skills related to {tag_name.lower()}"
        })
    return data

def generate_skill_tag_map_data(skills, skill_tags):
    data = []
    for skill in skills:
        num_tags = random.randint(1, 3)
        assigned_tags = random.sample(skill_tags, min(num_tags, len(skill_tags)))
        for tag in assigned_tags:
            data.append({
                "skill_id": skill["id"],
                "tag_id": tag["id"]
            })
    return data

def generate_user_data(num=50):
    data = []
    for _ in range(num):
        data.append({
            "id": str(uuid.uuid4()),
            "username": fake.user_name(),
            "email": fake.email()
        })
    return data

def generate_user_skill_data(users, skills, proficiencies):
    data = []
    for user in users:
        num_skills = random.randint(5, 20) # Each user has 5-20 skills
        user_skills = random.sample(skills, min(num_skills, len(skills)))
        for i, skill in enumerate(user_skills):
            # Ensure proficiency level exists for the skill
            # Since proficiency IDs are UUIDs now, we need to pick one from the generated proficiencies
            # that matches the skill_id. This requires a lookup.
            
            # Find proficiencies for the current skill
            skill_proficiencies = [p for p in proficiencies if p.skill_id == skill['id']] # Access .skill_id from object
            if not skill_proficiencies:
                print(f"Warning: No proficiencies found for skill {skill['name']}. Skipping user skill entry.")
                continue
            
            # Pick a random proficiency level ID for this skill
            proficiency_level_record = random.choice(skill_proficiencies)
            proficiency_level_id = proficiency_level_record.id # Access .id from object

            data.append({
                # "id": len(data) + 1, # Removed manual ID generation, let DB auto-increment
                "user_id": user["id"],
                "skill_id": skill["id"],
                "proficiency_level_id": proficiency_level_id, # This expects the Integer ID of the proficiency level
                "acquired_date": fake.date_this_decade().isoformat(),
                "last_validated_date": fake.date_this_year().isoformat() if random.random() > 0.5 else None,
                "validation_status": random.choice(["Validated", "Self-Assessed", "Pending"])
            })
    return data

def generate_user_career_history_data(users, roles):
    data = []
    for user in users:
        num_roles = random.randint(1, 3)
        user_roles = random.sample(roles, min(num_roles, len(roles)))
        for i, role in enumerate(user_roles):
            start_date = fake.date_this_decade()
            end_date = start_date + datetime.timedelta(days=random.randint(365, 1825)) # 1-5 years
            data.append({
                # "id": len(data) + 1, # Removed manual ID generation, let DB auto-increment
                "user_id": user["id"],
                "role_id": role.id, # Access .id from object
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "notes": fake.sentence(nb_words=10)
            })
    return data

def generate_assessment_data(skills):
    data = []
    for skill in skills:
        for i in range(random.randint(1, 2)): # 1-2 assessments per skill
            data.append({
                # "id": len(data) + 1, # Removed manual ID generation, let DB auto-increment
                "name": f"{skill['name']} Assessment {i+1}",
                "description": fake.paragraph(nb_sentences=2),
                "skill_id": skill["id"],
                "assessment_type": random.choice(["Quiz", "Practical", "Interview", "Peer Review"]),
                "date_created": fake.date_this_year().isoformat(),
                "last_updated": fake.date_this_month().isoformat()
            })
    return data

def generate_learning_resource_data(skills):
    data = []
    for skill in skills:
        for i in range(random.randint(1, 3)): # 1-3 resources per skill
            data.append({
                # "id": len(data) + 1, # Removed manual ID generation, let DB auto-increment
                "title": f"Mastering {skill['name']} - Part {i+1}",
                "description": fake.paragraph(nb_sentences=2),
                "url": fake.url(),
                "resource_type": random.choice(["Course", "Book", "Article", "Video", "Workshop"]),
                "skill_id": skill["id"],
                "author": fake.name(),
                "estimated_time_minutes": random.randint(30, 600)
            })
    return data

def generate_learning_path_data(roles):
    data = []
    for role in roles:
        if random.random() > 0.5: # About half the roles get a learning path
            data.append({
                "id": str(uuid.uuid4()),
                "title": f"Career Path for {role.name}", # Access .name from object
                "description": fake.paragraph(nb_sentences=3),
                "role_id": role.id, # Access .id from object
                "created_by": fake.name(),
                "estimated_duration": random.randint(10, 100), # in hours
                "created_at": datetime.datetime.now().isoformat(),
                "updated_at": datetime.datetime.now().isoformat(),
                "is_active": True
            })
    return data

def generate_learning_path_resources_data(learning_paths, learning_resources):
    data = []
    if not learning_resources: return [] # Handle case where no resources exist
    for lp in learning_paths:
        num_resources = random.randint(3, 8)
        selected_resources = random.sample(learning_resources, min(num_resources, len(learning_resources)))
        for i, res in enumerate(selected_resources):
            data.append({
                "learning_path_id": lp["id"],
                "learning_resource_id": res.id, # Access .id from object
                "sequence_order": i + 1
            })
    return data

def generate_skill_gap_data(users, skills, proficiencies):
    data = []
    for user in users:
        num_gaps = random.randint(1, 5)
        gapped_skills = random.sample(skills, min(num_gaps, len(skills)))
        for i, skill in enumerate(gapped_skills):
            required_prof = random.randint(3, 5)
            current_prof = random.randint(1, required_prof - 1) if required_prof > 1 else 1 # Ensure current < required
            if current_prof == 0: current_prof = 1 # Minimum 1
            
            # Find a proficiency object for the current skill to get a valid proficiency_level_id
            skill_proficiencies = [p for p in proficiencies if p.skill_id == skill['id']]
            if not skill_proficiencies:
                print(f"Warning: No proficiencies found for skill {skill['name']}. Skipping user skill entry.")
                continue
            
            random_prof_obj = random.choice(skill_proficiencies)
            proficiency_level_id = random_prof_obj.id # Use the actual DB ID

            data.append({
                "id": str(uuid.uuid4()),
                "user_id": user["id"],
                "skill_id": skill["id"],
                "required_proficiency": required_prof,
                "current_proficiency": current_prof,
                "gap_score": required_prof - current_prof
            })
    return data

def generate_career_path_data(roles):
    data = []
    if len(roles) < 2: return []
    num_paths = len(roles) * 2 # Roughly 2 paths per role
    for _ in range(num_paths):
        source_role = random.choice(roles)
        target_role = random.choice(roles)
        if source_role.id == target_role.id: # Access .id from object
            continue # No self-paths

        data.append({
            "id": str(uuid.uuid4()),
            "source_role_id": source_role.id, # Access .id from object
            "target_role_id": target_role.id, # Access .id from object
            "transition_type": random.choice(["Vertical Promotion", "Lateral Move", "Cross-Functional"]),
            "notes": fake.sentence(nb_words=8),
            "is_default": fake.boolean()
        })
    return data

def generate_capability_competency_map_data(capabilities, competencies):
    data = []
    # Map capability name to its ID
    cap_name_to_id = {cap['name']: cap['id'] for cap in capabilities}
    # Map competency name to its ID
    comp_name_to_id = {comp.name: comp.id for comp in competencies}

    # Define which competencies belong to which capabilities based on comp_names in generate_competency_data
    comp_names_by_capability = {
        "Product Management": ["Market Understanding", "Product Strategy", "Execution & Delivery", "Stakeholder Management"],
        "Software Engineering": ["Technical Proficiency", "System Design", "Problem Solving", "Collaboration & Quality"],
        "Human Resources": ["Talent Management", "HR Operations", "Strategic Partnership", "Employee Advocacy"],
        "Aviation": ["Flight Operations Mastery", "Safety & Compliance", "Crew Resource Management", "Technical Systems Knowledge"]
    }

    for cap_name, comp_names_list in comp_names_by_capability.items():
        cap_id = cap_name_to_id.get(cap_name)
        if cap_id:
            for comp_name in comp_names_list:
                comp_id = comp_name_to_id.get(comp_name)
                if comp_id:
                    data.append({
                        "capability_id": cap_id,
                        "competency_id": comp_id
                    })
    return data

def generate_competency_skill_map_data(skills, competencies):
    data = []
    # Map skill name to its ID
    skill_name_to_id = {skill['name']: skill['id'] for skill in skills}
    # Map competency name to its ID
    comp_name_to_id = {comp.name: comp.id for comp in competencies}

    # Define a simplified mapping from competency to a subset of skills from SKILL_LISTS
    # This is a heuristic; a more precise mapping would require explicit definition
    competency_to_skill_keywords = {
        "Market Understanding": ["Market research", "Competitive analysis", "Data analysis"],
        "Product Strategy": ["Prioritization & roadmapping", "Strategic thinking", "Product visioning"],
        "Execution & Delivery": ["Agile methodologies", "Sprint planning", "Feature definition"],
        "Stakeholder Management": ["Communication", "Negotiation", "Relationship management"],
        "Technical Proficiency": ["Programming", "Algorithms", "Testing & debugging"],
        "System Design": ["Software architecture", "System design", "Scalability"],
        "Problem Solving": ["Problem-solving", "Critical thinking", "Debugging tools"],
        "Collaboration & Quality": ["Code review", "Teamwork", "CI/CD pipelines"],
        "Talent Management": ["Talent acquisition", "Performance management", "Learning & development"],
        "HR Operations": ["Payroll administration", "Compliance", "HRIS systems"],
        "Strategic Partnership": ["Strategic partnership", "Business acumen", "HR strategy alignment"],
        "Employee Advocacy": ["Employee relations", "Conflict management", "Diversity & inclusion"],
        "Flight Operations Mastery": ["Flight planning", "Navigation & meteorology", "Fuel management"],
        "Safety & Compliance": ["Safety compliance", "Regulatory knowledge", "Risk management"],
        "Crew Resource Management": ["Teamwork", "Leadership & crew coordination", "Communication"],
        "Technical Systems Knowledge": ["Technical proficiency (aircraft systems)", "Aircraft systems troubleshooting", "Maintenance logging"]
    }

    for comp in competencies:
        comp_id = comp.id
        comp_name = comp.name
        
        keywords = competency_to_skill_keywords.get(comp_name, [])
        
        # Find skills that match keywords or are generally related
        relevant_skills = []
        for skill_name in skill_name_to_id.keys():
            if any(kw.lower() in skill_name.lower() for kw in keywords):
                relevant_skills.append(skill_name_to_id[skill_name])
        
        # Add a few random skills if not enough relevant ones found
        if len(relevant_skills) < 3 and len(skills) > 5:
            additional_skills = random.sample([s['id'] for s in skills if s['id'] not in relevant_skills], min(3, len(skills) - len(relevant_skills)))
            relevant_skills.extend(additional_skills)

        for skill_id in relevant_skills:
            data.append({
                "competency_id": comp_id,
                "skill_id": skill_id
            })
    
    # Deduplicate to avoid integrity errors on primary key (competency_id, skill_id)
    unique_data = []
    seen = set()
    for item in data:
        key = (item['competency_id'], item['skill_id'])
        if key not in seen:
            unique_data.append(item)
            seen.add(key)
    return unique_data

def generate_role_competency_map_data(roles, competencies):
    data = []
    # Map role ID to role name for easier logic
    role_id_to_name = {role.id: role.name for role in roles} # Access .id and .name from object
    # Map competency name to competency ID
    comp_name_to_id = {comp.name: comp.id for comp in competencies}

    # Define a heuristic for linking roles to competencies
    # This is a simplified mapping; in a real system, this would be more explicit
    role_to_competency_keywords = {
        "Product Manager": ["Market Understanding", "Product Strategy", "Execution & Delivery", "Stakeholder Management"],
        "Software Engineer": ["Technical Proficiency", "System Design", "Problem Solving", "Collaboration & Quality"],
        "HR Business Partner": ["Talent Management", "HR Operations", "Strategic Partnership", "Employee Advocacy"],
        "Pilot": ["Flight Operations Mastery", "Safety & Compliance", "Crew Resource Management", "Technical Systems Knowledge"],
        "UX Designer": ["Market Understanding", "Execution & Delivery"], # Example for cross-over
        "DevOps Engineer": ["Technical Proficiency", "System Design", "Collaboration & Quality"],
        "Flight Attendant": ["Crew Resource Management", "Safety & Compliance"],
        "Talent Acquisition Specialist": ["Talent Management", "HR Operations"],
        "Compensation & Benefits Analyst": ["HR Operations", "Strategic Partnership"],
        "Aircraft Maintenance Technician": ["Technical Systems Knowledge", "Safety & Compliance"]
    }

    for role in roles:
        role_id = role.id # Access .id from object
        role_name = role.name # Access .name from object
        
        competency_keywords = []
        # Try to find direct matches first
        if role_name in role_to_competency_keywords:
            competency_keywords.extend(role_to_competency_keywords[role_name])
        else:
            # Fallback to general matches if no direct role mapping
            if "Product" in role_name:
                competency_keywords.extend(role_to_competency_keywords["Product Manager"])
            if "Software" in role_name or "Engineer" in role_name:
                competency_keywords.extend(role_to_competency_keywords["Software Engineer"])
            if "HR" in role_name or "Talent" in role_name:
                competency_keywords.extend(role_to_competency_keywords["HR Business Partner"])
            if "Flight" in role_name or "Pilot" in role_name or "Aviation" in role_name:
                competency_keywords.extend(role_to_competency_keywords["Pilot"])
            
            # Add some random competencies if still empty or too few
            if not competency_keywords or len(competency_keywords) < 2:
                competency_keywords.extend(random.sample(list(comp_name_to_id.keys()), min(2, len(comp_name_to_id))))

        # Add unique competencies for this role
        added_competencies = set()
        for comp_kw in competency_keywords:
            comp_id = comp_name_to_id.get(comp_kw)
            if comp_id and comp_id not in added_competencies:
                data.append({
                    "role_id": role_id,
                    "competency_id": comp_id
                })
                added_competencies.add(comp_id)
    
    # Deduplicate to avoid integrity errors on primary key (role_id, competency_id)
    unique_data = []
    seen = set()
    for item in data:
        key = (item['role_id'], item['competency_id'])
        if key not in seen:
            unique_data.append(item)
            seen.add(key)
    return unique_data

def generate_job_profile_required_skills_data(job_profiles, skills):
    data = []
    # Map skill ID to skill object for easier lookup
    skill_id_to_obj = {skill['id']: skill for skill in skills}

    for jp in job_profiles:
        num_skills = random.randint(3, 10) # Each job profile requires 3-10 skills
        
        # Try to pick skills relevant to the job family
        relevant_skills_ids = []
        if "Product" in jp['job_family']:
            relevant_skills_ids.extend([s['id'] for s in skills if "Product" in s['name'] or "UX" in s['name'] or "Data analysis" in s['name']])
        elif "Software" in jp['job_family'] or "Engineer" in jp['job_title']:
            relevant_skills_ids.extend([s['id'] for s in skills if "Programming" in s['name'] or "Software" in s['name'] or "API" in s['name']])
        elif "HR" in jp['job_family'] or "HR" in jp['job_title']:
            relevant_skills_ids.extend([s['id'] for s in skills if "HRIS" in s['name'] or "Compliance" in s['name'] or "Talent" in s['name']])
        elif "Aviation" in jp['job_family'] or "Pilot" in jp['job_title'] or "Flight" in jp['job_title']:
            relevant_skills_ids.extend([s['id'] for s in skills if "Aviation" in s['name'] or "Flight" in s['name'] or "Aircraft" in s['name']])
        
        # Ensure uniqueness and pick enough skills
        selected_skill_ids = list(set(relevant_skills_ids))
        if len(selected_skill_ids) < num_skills:
            # Fill up with random skills if not enough relevant ones
            remaining_needed = num_skills - len(selected_skill_ids)
            all_skill_ids = [s['id'] for s in skills]
            random_skills = random.sample([s_id for s_id in all_skill_ids if s_id not in selected_skill_ids], min(remaining_needed, len(all_skill_ids) - len(selected_skill_ids)))
            selected_skill_ids.extend(random_skills)

        for skill_id in selected_skill_ids:
            data.append({
                "job_profile_id": jp["id"],
                "skill_id": skill_id
            })
    
    # Deduplicate to avoid integrity errors on primary key (job_profile_id, skill_id)
    unique_data = []
    seen = set()
    for item in data:
        key = (item['job_profile_id'], item['skill_id'])
        if key not in seen:
            unique_data.append(item)
            seen.add(key)
    return unique_data

def generate_business_unit_department_map_data(business_units, departments):
    data = []
    # Map business unit ID to business unit object
    bu_id_to_obj = {bu['id']: bu for bu in business_units}
    # Map department ID to department object
    dept_id_to_obj = {dept['id']: dept for dept in departments}

    for bu in business_units:
        bu_id = bu['id']
        # Link each business unit to a random subset of departments
        num_departments_to_link = random.randint(1, min(len(departments), 3)) # Link to 1-3 departments
        selected_departments = random.sample(departments, num_departments_to_link)
        
        for dept in selected_departments:
            dept_id = dept['id']
            data.append({
                "business_unit_id": bu_id,
                "department_id": dept_id
            })
    
    # Deduplicate to avoid integrity errors on primary key (business_unit_id, department_id)
    unique_data = []
    seen = set()
    for item in data:
        key = (item['business_unit_id'], item['department_id'])
        if key not in seen:
            unique_data.append(item)
            seen.add(key)
    return unique_data

def generate_project_or_assignment_data(users, roles, organizations, num=30):
    data = []
    for _ in range(num):
        user = random.choice(users)
        role = random.choice(roles)
        org = random.choice(organizations)
        
        start_date = fake.date_this_year()
        end_date = start_date + datetime.timedelta(days=random.randint(30, 365))
        
        data.append({
            "id": str(uuid.uuid4()),
            "name": fake.catch_phrase(),
            "description": fake.paragraph(nb_sentences=2),
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "status": random.choice(["Planned", "In Progress", "Completed", "On Hold"]),
            "project_type": random.choice(["Internal", "Client", "R&D", "Operational"]),
            "budget": random.randint(10000, 1000000),
            "manager_id": user["id"], # Assuming manager is a user
            "organization_id": org["id"],
            "associated_role_id": role.id, # Link to a role
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "is_active": fake.boolean()
        })
    return data

def generate_certification_data(users, skills, organizations, num=40):
    data = []
    for _ in range(num):
        user = random.choice(users)
        skill = random.choice(skills)
        org = random.choice(organizations)
        
        issue_date = fake.date_this_decade()
        expiry_date = issue_date + datetime.timedelta(days=random.randint(365, 1825)) # 1-5 years
        
        data.append({
            "id": str(uuid.uuid4()),
            "name": f"{skill['name']} Certified Professional",
            "issuing_organization": fake.company(),
            "issue_date": issue_date.isoformat(),
            "expiry_date": expiry_date.isoformat() if random.random() > 0.2 else None, # 80% have expiry
            "credential_id": fake.bothify(text='????-####-????-####').upper(),
            "credential_url": fake.url(),
            "user_id": user["id"],
            "skill_id": skill["id"],
            "organization_id": org["id"],
            "certification_type": random.choice(["Industry Standard", "Vendor Specific", "Internal"]),
            "status": random.choice(["Active", "Expired", "Pending"]),
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat()
        })
    return data

def generate_feedback_data(users, roles, num=50):
    data = []
    for _ in range(num):
        giver = random.choice(users)
        receiver = random.choice(users)
        # Ensure giver and receiver are different
        while giver["id"] == receiver["id"]:
            receiver = random.choice(users)
        
        associated_role = random.choice(roles)
        
        feedback_date = fake.date_this_year()
        
        data.append({
            "id": str(uuid.uuid4()),
            "giver_id": giver["id"],
            "receiver_id": receiver["id"],
            "feedback_text": fake.paragraph(nb_sentences=3),
            "feedback_date": feedback_date.isoformat(),
            "feedback_type": random.choice(["Performance", "Development", "Peer", "360 Review"]),
            "rating": random.randint(1, 5),
            "associated_role_id": associated_role.id,
            "private_notes": fake.sentence() if random.random() > 0.5 else None,
            "action_items": fake.sentence() if random.random() > 0.5 else None,
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat()
        })
    return data


def generate_all_data_staged(organizations, capabilities, job_levels, role_groups, relationship_types, skill_tags, users, business_units, skills, competencies, job_profiles, departments, roles, learning_resources, proficiencies_from_db=None):
    """
    Generates data for tables that depend on previously inserted data,
    especially those with auto-incrementing IDs.
    """
    all_data = {}

    # Level 3: Dependent on Level 2 (and potentially auto-incremented IDs)
    # Behaviors depend on Competencies and JobLevels (both UUIDs)
    all_data["BEHAVIOR"] = generate_behavior_data(competencies, job_levels)

    # Association data (depend on UUIDs)
    all_data["CAPABILITY_COMPETENCY_MAP"] = generate_capability_competency_map_data(capabilities, competencies)
    all_data["COMPETENCY_SKILL_MAP"] = generate_competency_skill_map_data(skills, competencies)
    all_data["SKILL_TAG_MAP"] = generate_skill_tag_map_data(skills, skill_tags)
    all_data["JOB_PROFILE_REQUIRED_SKILLS_MAP"] = generate_job_profile_required_skills_data(job_profiles, skills)
    all_data["BUSINESS_UNIT_DEPARTMENTS_MAP"] = generate_business_unit_department_map_data(business_units, departments)

    # Level 4: Dependent on Level 3 (and potentially auto-incremented IDs)
    # Roles depend on Departments and JobLevels (UUIDs)
    # Roles are generated here, but inserted later in populate_database
    # to ensure they are available for LearningPath and CareerPath
    # roles = generate_role_data(departments, job_levels)
    # all_data["ROLE"] = roles # This will be generated and inserted in populate_database

    # Skill Relationships depend on Skills and RelationshipTypes (UUIDs)
    all_data["SKILL_RELATIONSHIP"] = generate_skill_relationship_data(skills, relationship_types)

    # Learning Resources depend on Skills (UUIDs)
    all_data["LEARNING_RESOURCE"] = generate_learning_resource_data(skills)

    # Assessments depend on Skills (UUIDs)
    all_data["ASSESSMENT"] = generate_assessment_data(skills)

    # ProjectOrAssignment depends on Users, Roles, Organizations (all UUIDs)
    all_data["PROJECT_OR_ASSIGNMENT"] = generate_project_or_assignment_data(users, roles, organizations)

    # Certification depends on Users, Skills, Organizations (all UUIDs)
    all_data["CERTIFICATION"] = generate_certification_data(users, skills, organizations)

    # Feedback depends on Users, Roles (all UUIDs)
    all_data["FEEDBACK"] = generate_feedback_data(users, roles)

    # Level 5: Dependent on Level 4 (and auto-incremented IDs)
    # User Skills depend on Users (UUID), Skills (UUID), and Proficiencies (Integer, auto-incremented)
    # This needs proficiencies_from_db to be passed in
    if proficiencies_from_db is not None:
        all_data["USER_SKILL"] = generate_user_skill_data(users, skills, proficiencies_from_db)
    else:
        all_data["USER_SKILL"] = [] # Placeholder, will be generated later

    # User Career History depends on Users (UUID) and Roles (UUID)
    all_data["USER_CAREER_HISTORY"] = generate_user_career_history_data(users, roles)

    # Learning Paths depend on Roles (UUID)
    all_data["LEARNING_PATH"] = generate_learning_path_data(roles)

    # Career Paths depend on Roles (UUID)
    all_data["CAREER_PATH"] = generate_career_path_data(roles)

    # Skill Gaps depend on Users (UUID), Skills (UUID), and Proficiencies (Integer, auto-incremented)
    # This needs proficiencies_from_db to be passed in
    if proficiencies_from_db is not None:
        all_data["SKILL_GAP"] = generate_skill_gap_data(users, skills, proficiencies_from_db)
    else:
        all_data["SKILL_GAP"] = [] # Placeholder, will be generated later

    # Level 6: Dependent on Level 5 (and auto-incremented IDs)
    # Learning Path Resources depend on Learning Paths (UUID) and Learning Resources (Integer, auto-incremented)
    # This will be generated and inserted in populate_database after learning_paths and learning_resources are inserted
    # all_data["LEARNING_PATH_RESOURCES"] = generate_learning_path_resources_data(learning_paths, learning_resources)

    return all_data


# Global model_map for easy lookup
model_map = {
    "ORGANIZATION": Organization,
    "CAPABILITY": Capability,
    "JOB_LEVEL": JobLevel,
    "ROLE_GROUP": RoleGroup,
    "RELATIONSHIP_TYPE": RelationshipType,
    "SKILL_TAG": SkillTag,
    "USER": User,
    "BUSINESS_UNIT": BusinessUnit,
    "SKILL": Skill,
    "COMPETENCY": Competency,
    "JOB_PROFILE": JobProfile,
    "DEPARTMENT": Department,
    "PROFICIENCY": Proficiency,
    "BEHAVIOR": Behavior,
    "ROLE": Role,
    "SKILL_RELATIONSHIP": SkillRelationship,
    "LEARNING_RESOURCE": LearningResource,
    "ASSESSMENT": Assessment,
    "USER_SKILL": UserSkill,
    "USER_CAREER_HISTORY": UserCareerHistory,
    "LEARNING_PATH": LearningPath,
    "CAREER_PATH": CareerPath,
    "SKILL_GAP": SkillGap,
    "PROJECT_OR_ASSIGNMENT": ProjectOrAssignment, # Added new models
    "CERTIFICATION": Certification,
    "FEEDBACK": Feedback,
}


def populate_database():
    app = create_app()
    with app.app_context():
        print("Generating data...")
        
        # Phase 0: Generate initial independent data (UUID-based IDs)
        organizations_data = generate_organization_data()
        capabilities_data = generate_capability_data()
        job_levels_data = generate_job_level_data()
        role_groups_data = generate_role_group_data()
        relationship_types_data = generate_relationship_type_data()
        skill_tags_data = generate_skill_tag_data()
        users_data = generate_user_data()
        business_units_data = generate_business_unit_data(organizations_data)
        skills_data = generate_unique_skill_data()
        # competencies_data will be generated and inserted in Phase 1
        job_profiles_data = generate_job_profile_data(job_levels_data, role_groups_data)
        departments_data = generate_department_data(business_units_data)

        # Define models in reverse dependency order for clearing
        models_in_order = [
            LearningPathResourceAssociation, # New association model
            LearningPath, LearningResource, Assessment, UserSkill, UserCareerHistory, SkillGap,
            CareerPath, SkillRelationship, ProjectOrAssignment, Certification, Feedback, # Added new models for clearing
            Role, Behavior, Proficiency, SkillTag, Skill, Competency, JobProfile,
            Department, BusinessUnit, Organization, JobLevel, RoleGroup, RelationshipType, User, Capability
        ]

        print("Clearing existing data...")
        for Model in models_in_order:
            print(f"Clearing {Model.__tablename__}...")
            db.session.query(Model).delete()
        db.session.commit()
        print("Existing data cleared.")

        print("Populating database...")

        # Step 1: Insert tables with UUID primary keys
        print("Inserting Phase 1 tables (UUID PKs)...")
        tables_to_insert_phase1 = {
            "ORGANIZATION": (Organization, organizations_data),
            "CAPABILITY": (Capability, capabilities_data),
            "JOB_LEVEL": (JobLevel, job_levels_data),
            "ROLE_GROUP": (RoleGroup, role_groups_data),
            "RELATIONSHIP_TYPE": (RelationshipType, relationship_types_data),
            "SKILL_TAG": (SkillTag, skill_tags_data),
            "USER": (User, users_data),
            "BUSINESS_UNIT": (BusinessUnit, business_units_data),
            "SKILL": (Skill, skills_data),
            "COMPETENCY": (Competency, generate_competency_data(capabilities_data)), # Generate competencies here
            "JOB_PROFILE": (JobProfile, job_profiles_data),
            "DEPARTMENT": (Department, departments_data),
        }

        # Store inserted competency objects for later use
        inserted_competencies_objects = []

        for table_name, (Model, records) in tables_to_insert_phase1.items():
            if not records:
                print(f"No data generated for {table_name}. Skipping insertion.")
                continue
            print(f"Inserting {len(records)} records into {table_name}...")
            for record in records:
                for key in ['created_at', 'updated_at']:
                    if key in record and isinstance(record[key], str):
                        record[key] = datetime.datetime.fromisoformat(record[key])
                for key in ['acquired_date', 'last_validated_date', 'start_date', 'end_date', 'date_created', 'last_updated']:
                    if key in record and isinstance(record[key], str):
                        record[key] = datetime.date.fromisoformat(record[key])
                if 'custom_fields' in record and isinstance(record['custom_fields'], str):
                    record['custom_fields'] = json.loads(record['custom_fields'])
                new_record = Model(**record)
                db.session.add(new_record)
                if table_name == "COMPETENCY":
                    inserted_competencies_objects.append(new_record) # Collect competency objects
            db.session.commit()
            print(f"Successfully inserted records into {table_name}.")

        # Step 2: Insert tables with auto-incrementing integer primary keys
        # and retrieve the actual objects with their assigned IDs
        print("Inserting auto-incrementing PK tables and retrieving IDs...")
        
        # Proficiencies
        proficiencies_to_insert = generate_proficiency_data(skills_data)
        inserted_proficiencies = []
        if proficiencies_to_insert:
            print(f"Inserting {len(proficiencies_to_insert)} records into PROFICIENCY...")
            for record in proficiencies_to_insert:
                new_record = Proficiency(
                    name=record['name'],
                    description=record['description'],
                    level=record['level'],
                    skill_id=record['skill_id']
                )
                db.session.add(new_record)
                inserted_proficiencies.append(new_record) # Keep reference to object
            db.session.commit()
            print(f"Successfully inserted records into PROFICIENCY.")
        
        # SkillRelationships
        skill_relationships_to_insert = generate_skill_relationship_data(skills_data, relationship_types_data)
        inserted_skill_relationships = []
        if skill_relationships_to_insert:
            print(f"Inserting {len(skill_relationships_to_insert)} records into SKILL_RELATIONSHIP...")
            for record in skill_relationships_to_insert:
                new_record = SkillRelationship(
                    source_skill_id=record['source_skill_id'],
                    target_skill_id=record['target_skill_id'],
                    relationship_type_id=record['relationship_type_id']
                )
                db.session.add(new_record)
                inserted_skill_relationships.append(new_record)
            db.session.commit()
            print(f"Successfully inserted records into SKILL_RELATIONSHIP.")

        # LearningResources
        learning_resources_to_insert = generate_learning_resource_data(skills_data)
        inserted_learning_resources = []
        if learning_resources_to_insert:
            print(f"Inserting {len(learning_resources_to_insert)} records into LEARNING_RESOURCE...")
            for record in learning_resources_to_insert:
                new_record = LearningResource(
                    title=record['title'],
                    description=record['description'],
                    url=record['url'],
                    resource_type=record['resource_type'],
                    skill_id=record['skill_id'],
                    author=record['author'],
                    estimated_time_minutes=record['estimated_time_minutes']
                )
                db.session.add(new_record)
                inserted_learning_resources.append(new_record)
            db.session.commit()
            print(f"Successfully inserted records into LEARNING_RESOURCE.")

        # Assessments
        assessments_to_insert = generate_assessment_data(skills_data)
        inserted_assessments = []
        if assessments_to_insert:
            print(f"Inserting {len(assessments_to_insert)} records into ASSESSMENT...")
            for record in assessments_to_insert:
                new_record = Assessment(
                    name=record['name'],
                    description=record['description'],
                    skill_id=record['skill_id'],
                    assessment_type=record['assessment_type'],
                    date_created=datetime.date.fromisoformat(record['date_created']),
                    last_updated=datetime.date.fromisoformat(record['last_updated'])
                )
                db.session.add(new_record)
                inserted_assessments.append(new_record)
            db.session.commit()
            print(f"Successfully inserted records into ASSESSMENT.")

        # Refresh all objects to ensure auto-generated IDs are available
        db.session.expire_all() # Use expire_all to clear identity map and force refresh on next access

        # Step 3: Generate and insert remaining dependent data (including those that need auto-incremented IDs)
        print("Inserting Phase 2 tables (dependent data and associations)...")

        # Generate data that depends on auto-incremented IDs or other UUID tables
        # Insert Roles (depends on Department, JobLevel - both UUIDs, already inserted)
        roles_data = generate_role_data(departments_data, job_levels_data)
        inserted_roles = []
        if roles_data:
            print(f"Inserting {len(roles_data)} records into ROLE...")
            for record in roles_data:
                for key in ['created_at', 'updated_at']:
                    if key in record and isinstance(record[key], str):
                        record[key] = datetime.datetime.fromisoformat(record[key])
                for key in ['acquired_date', 'last_validated_date', 'start_date', 'end_date', 'date_created', 'last_updated']:
                    if key in record and isinstance(record[key], str):
                        record[key] = datetime.date.fromisoformat(record[key])
                if 'custom_fields' in record and isinstance(record['custom_fields'], str):
                    record['custom_fields'] = json.loads(record['custom_fields'])
                new_record = Role(**record)
                db.session.add(new_record)
                inserted_roles.append(new_record)
            db.session.commit()
            print(f"Successfully inserted records into ROLE.")
        db.session.expire_all() # Refresh roles to get their IDs

        # Generate data that depends on auto-incremented IDs or other UUID tables
        # Pass the actual SQLAlchemy objects for lookups, including the newly inserted roles
        staged_generated_data = generate_all_data_staged(
            organizations_data, capabilities_data, job_levels_data, role_groups_data,
            relationship_types_data, skill_tags_data, users_data, business_units_data,
            skills_data, inserted_competencies_objects, # Pass actual competency objects
            job_profiles_data, departments_data,
            inserted_roles, inserted_learning_resources, # Pass actual roles and learning resources
            proficiencies_from_db=inserted_proficiencies # Pass actual proficiency objects
        )

        # Generate LearningPathResources (depends on LearningPath and LearningResource)
        # This needs to be generated after learning paths are generated within generate_all_data_staged
        learning_path_resources_data = generate_learning_path_resources_data(staged_generated_data["LEARNING_PATH"], inserted_learning_resources)
        staged_generated_data["LEARNING_PATH_RESOURCES"] = learning_path_resources_data

        # Generate Role Competency Map data after roles and competencies are inserted
        role_competency_map_data = generate_role_competency_map_data(inserted_roles, inserted_competencies_objects)
        staged_generated_data["ROLE_COMPETENCY_MAP"] = role_competency_map_data

        # Define insertion order for remaining tables and association tables
        insertion_order_phase2_final = [
            "BEHAVIOR",
            "PROJECT_OR_ASSIGNMENT", # New table
            "CERTIFICATION", # New table
            "FEEDBACK", # New table
            "USER_SKILL", # Depends on User, Skill, Proficiency (all inserted)
            "SKILL_GAP", # Depends on User, Skill, Proficiency (all inserted)
            "USER_CAREER_HISTORY", # Depends on User, Role (all inserted)
            "LEARNING_PATH", # Depends on Role (all inserted)
            "CAREER_PATH", # Depends on Role (all inserted)
            "CAPABILITY_COMPETENCY_MAP",
            "COMPETENCY_SKILL_MAP",
            "SKILL_TAG_MAP",
            "ROLE_COMPETENCY_MAP",
            "JOB_PROFILE_REQUIRED_SKILLS_MAP",
            "BUSINESS_UNIT_DEPARTMENTS_MAP",
            "LEARNING_PATH_RESOURCES"
        ]

        # Explicitly insert data for each table type
        # BEHAVIOR
        records = staged_generated_data.get("BEHAVIOR")
        if records:
            print(f"Inserting {len(records)} records into BEHAVIOR...")
            for record in records:
                new_record = Behavior(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into BEHAVIOR.")

        # PROJECT_OR_ASSIGNMENT
        records = staged_generated_data.get("PROJECT_OR_ASSIGNMENT")
        if records:
            print(f"Inserting {len(records)} records into PROJECT_OR_ASSIGNMENT...")
            for record in records:
                # Handle date conversions
                if 'start_date' in record and isinstance(record['start_date'], str):
                    record['start_date'] = datetime.date.fromisoformat(record['start_date'])
                if 'end_date' in record and isinstance(record['end_date'], str):
                    record['end_date'] = datetime.date.fromisoformat(record['end_date'])
                # Handle datetime conversions
                for key in ['created_at', 'updated_at']:
                    if key in record and isinstance(record[key], str):
                        record[key] = datetime.datetime.fromisoformat(record[key])
                if 'custom_fields' in record and isinstance(record['custom_fields'], str):
                    record['custom_fields'] = json.loads(record['custom_fields'])
                new_record = ProjectOrAssignment(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into PROJECT_OR_ASSIGNMENT.")

        # CERTIFICATION
        records = staged_generated_data.get("CERTIFICATION")
        if records:
            print(f"Inserting {len(records)} records into CERTIFICATION...")
            for record in records:
                # Handle date conversions
                if 'issue_date' in record and isinstance(record['issue_date'], str):
                    record['issue_date'] = datetime.date.fromisoformat(record['issue_date'])
                if 'expiry_date' in record and isinstance(record['expiry_date'], str):
                    record['expiry_date'] = datetime.date.fromisoformat(record['expiry_date'])
                # Handle datetime conversions
                for key in ['created_at', 'updated_at']:
                    if key in record and isinstance(record[key], str):
                        record[key] = datetime.datetime.fromisoformat(record[key])
                new_record = Certification(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into CERTIFICATION.")

        # FEEDBACK
        records = staged_generated_data.get("FEEDBACK")
        if records:
            print(f"Inserting {len(records)} records into FEEDBACK...")
            for record in records:
                # Handle date conversions
                if 'feedback_date' in record and isinstance(record['feedback_date'], str):
                    record['feedback_date'] = datetime.date.fromisoformat(record['feedback_date'])
                # Handle datetime conversions
                for key in ['created_at', 'updated_at']:
                    if key in record and isinstance(record[key], str):
                        record[key] = datetime.datetime.fromisoformat(record[key])
                new_record = Feedback(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into FEEDBACK.")

        # USER_SKILL
        records = staged_generated_data.get("USER_SKILL")
        if records:
            print(f"Inserting {len(records)} records into USER_SKILL...")
            for record in records:
                # Handle date conversions
                if 'acquired_date' in record and isinstance(record['acquired_date'], str):
                    record['acquired_date'] = datetime.date.fromisoformat(record['acquired_date'])
                if 'last_validated_date' in record and isinstance(record['last_validated_date'], str):
                    record['last_validated_date'] = datetime.date.fromisoformat(record['last_validated_date'])
                new_record = UserSkill(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into USER_SKILL.")

        # SKILL_GAP
        records = staged_generated_data.get("SKILL_GAP")
        if records:
            print(f"Inserting {len(records)} records into SKILL_GAP...")
            for record in records:
                new_record = SkillGap(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into SKILL_GAP.")

        # USER_CAREER_HISTORY
        records = staged_generated_data.get("USER_CAREER_HISTORY")
        if records:
            print(f"Inserting {len(records)} records into USER_CAREER_HISTORY...")
            for record in records:
                # Handle date conversions
                if 'start_date' in record and isinstance(record['start_date'], str):
                    record['start_date'] = datetime.date.fromisoformat(record['start_date'])
                if 'end_date' in record and isinstance(record['end_date'], str):
                    record['end_date'] = datetime.date.fromisoformat(record['end_date'])
                new_record = UserCareerHistory(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into USER_CAREER_HISTORY.")

        # LEARNING_PATH
        records = staged_generated_data.get("LEARNING_PATH")
        if records:
            print(f"Inserting {len(records)} records into LEARNING_PATH...")
            for record in records:
                # Handle datetime conversions
                for key in ['created_at', 'updated_at']:
                    if key in record and isinstance(record[key], str):
                        record[key] = datetime.datetime.fromisoformat(record[key])
                new_record = LearningPath(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into LEARNING_PATH.")

        # CAREER_PATH
        records = staged_generated_data.get("CAREER_PATH")
        if records:
            print(f"Inserting {len(records)} records into CAREER_PATH...")
            for record in records:
                new_record = CareerPath(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into CAREER_PATH.")

        # Association tables (handled via relationships, no direct insertion of records)
        # CAPABILITY_COMPETENCY_MAP
        records = staged_generated_data.get("CAPABILITY_COMPETENCY_MAP")
        if records:
            print(f"Processing {len(records)} records for CAPABILITY_COMPETENCY_MAP...")
            for record in records:
                cap_obj = Capability.query.get(record['capability_id'])
                comp_obj = Competency.query.get(record['competency_id'])
                if cap_obj and comp_obj:
                    cap_obj.competencies.append(comp_obj)
                else:
                    print(f"Warning: Could not map capability_id {record['capability_id']} or competency_id {record['competency_id']} for CAPABILITY_COMPETENCY_MAP.")
            db.session.commit()
            print(f"Successfully processed association table CAPABILITY_COMPETENCY_MAP.")

        # COMPETENCY_SKILL_MAP
        records = staged_generated_data.get("COMPETENCY_SKILL_MAP")
        if records:
            print(f"Processing {len(records)} records for COMPETENCY_SKILL_MAP...")
            for record in records:
                comp_obj = Competency.query.get(record['competency_id'])
                skill_obj = Skill.query.get(record['skill_id'])
                if comp_obj and skill_obj:
                    comp_obj.skills.append(skill_obj)
                else:
                    print(f"Warning: Could not map competency_id {record['competency_id']} or skill_id {record['skill_id']} for COMPETENCY_SKILL_MAP.")
            db.session.commit()
            print(f"Successfully processed association table COMPETENCY_SKILL_MAP.")

        # SKILL_TAG_MAP
        records = staged_generated_data.get("SKILL_TAG_MAP")
        if records:
            print(f"Processing {len(records)} records for SKILL_TAG_MAP...")
            for record in records:
                skill_obj = Skill.query.get(record['skill_id'])
                tag_obj = SkillTag.query.get(record['tag_id'])
                if skill_obj and tag_obj:
                    skill_obj.tags.append(tag_obj)
                else:
                    print(f"Warning: Could not map skill_id {record['skill_id']} or tag_id {record['tag_id']} for SKILL_TAG_MAP.")
            db.session.commit()
            print(f"Successfully processed association table SKILL_TAG_MAP.")

        # ROLE_COMPETENCY_MAP
        records = staged_generated_data.get("ROLE_COMPETENCY_MAP")
        if records:
            print(f"Processing {len(records)} records for ROLE_COMPETENCY_MAP...")
            for record in records:
                role_obj = Role.query.get(record['role_id'])
                comp_obj = Competency.query.get(record['competency_id'])
                if role_obj and comp_obj:
                    role_obj.competencies.append(comp_obj)
                else:
                    print(f"Warning: Could not map role_id {record['role_id']} or competency_id {record['competency_id']} for ROLE_COMPETENCY_MAP.")
            db.session.commit()
            print(f"Successfully processed association table ROLE_COMPETENCY_MAP.")

        # JOB_PROFILE_REQUIRED_SKILLS_MAP
        records = staged_generated_data.get("JOB_PROFILE_REQUIRED_SKILLS_MAP")
        if records:
            print(f"Processing {len(records)} records for JOB_PROFILE_REQUIRED_SKILLS_MAP...")
            for record in records:
                jp_obj = JobProfile.query.get(record['job_profile_id'])
                skill_obj = Skill.query.get(record['skill_id'])
                if jp_obj and skill_obj:
                    jp_obj.required_skills.append(skill_obj)
                else:
                    print(f"Warning: Could not map job_profile_id {record['job_profile_id']} or skill_id {record['skill_id']} for JOB_PROFILE_REQUIRED_SKILLS_MAP.")
            db.session.commit()
            print(f"Successfully processed association table JOB_PROFILE_REQUIRED_SKILLS_MAP.")

        # BUSINESS_UNIT_DEPARTMENTS_MAP
        records = staged_generated_data.get("BUSINESS_UNIT_DEPARTMENTS_MAP")
        if records:
            print(f"Processing {len(records)} records for BUSINESS_UNIT_DEPARTMENTS_MAP...")
            for record in records:
                bu_obj = BusinessUnit.query.get(record['business_unit_id'])
                dept_obj = Department.query.get(record['department_id'])
                if bu_obj and dept_obj:
                    bu_obj.departments.append(dept_obj)
                else:
                    print(f"Warning: Could not map business_unit_id {record['business_unit_id']} or department_id {record['department_id']} for BUSINESS_UNIT_DEPARTMENTS_MAP.")
            db.session.commit()
            print(f"Successfully processed association table BUSINESS_UNIT_DEPARTMENTS_MAP.")

        # LEARNING_PATH_RESOURCES (now a direct model insertion)
        records = staged_generated_data.get("LEARNING_PATH_RESOURCES")
        if records:
            print(f"Inserting {len(records)} records into LEARNING_PATH_RESOURCES...")
            for record in records:
                new_record = LearningPathResourceAssociation(**record)
                db.session.add(new_record)
            db.session.commit()
            print(f"Successfully inserted records into LEARNING_PATH_RESOURCES.")

if __name__ == "__main__":
    populate_database()
