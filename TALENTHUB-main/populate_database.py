import sqlite3
import uuid
from faker import Faker
import random
import json
from datetime import datetime

# Initialize Faker
fake = Faker()

# Database connection
db_path = 'site.db'

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by the db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except sqlite3.Error as e:
        print(e)
    return conn

def populate_data():
    conn = create_connection(db_path)
    if conn is None:
        print("Error! cannot create the database connection.")
        return

    with conn:
        cur = conn.cursor()

        # Clear existing data
        # Correct order for deletion
        tables_to_delete = [
            'learning_path_resources', 'user_career_history', 'feedback', 'career_path', 'role_competencies',
            'project_or_assignment', 'learning_path', 'role', 'user_skill', 'job_profile_required_skills',
            'department', 'business_unit_departments', 'business_unit', 'skill_gap', 'skill_relationship',
            'skill_tag_map', 'assessment', 'learning_resource', 'proficiency', 'certification',
            'job_profile', 'behavior', 'competency_skills', 'skill',
            'competency', 'capability', 'user', 'skill_tag', 'role_group', 'relationship_type',
            'organization', 'job_level'
        ]
        for table in tables_to_delete:
            try:
                cur.execute(f"DELETE FROM {table};")
            except sqlite3.OperationalError as e:
                print(f"Could not delete from {table}: {e}")

        # Populate organization
        organizations = []
        for _ in range(5):
            org = (
                str(uuid.uuid4()), fake.company(), fake.bs(), fake.random_element(elements=('1-50', '51-200', '201-500', '501-1000', '1000+')),
                ', '.join([fake.country() for _ in range(random.randint(1, 5))]), fake.year(), fake.random_element(elements=('Public', 'Private')),
                fake.lexify(text='????').upper(), fake.catch_phrase(), fake.random_element(elements=('Startup', 'Growth', 'Mature')),
                fake.boolean(), fake.random_element(elements=('SAP', 'Oracle', 'NetSuite', 'Custom')), fake.boolean(), None
            )
            organizations.append(org)
        cur.executemany("INSERT INTO organization VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", organizations)
        organization_ids = [org[0] for org in organizations]

        # Populate users
        users = []
        for _ in range(100):
            user = (str(uuid.uuid4()), fake.user_name(), fake.email(), fake.text(max_nb_chars=200))
            users.append(user)
        cur.executemany("INSERT INTO user VALUES (?,?,?,?)", users)
        user_ids = [user[0] for user in users]

        # Populate skills
        skills = []
        for _ in range(200):
            skill = (
                str(uuid.uuid4()), fake.job(), fake.text(max_nb_chars=200),
                fake.random_element(elements=('Technical', 'Soft', 'Business')),
                fake.random_element(elements=('High', 'Medium', 'Low')),
                datetime.now(), datetime.now(), json.dumps({}), True
            )
            skills.append(skill)
        cur.executemany("INSERT INTO skill VALUES (?,?,?,?,?,?,?,?,?)", skills)
        skill_ids = [skill[0] for skill in skills]

        # Populate competencies
        competencies = []
        for _ in range(50):
            competency = (str(uuid.uuid4()), fake.bs(), fake.text(max_nb_chars=200), json.dumps({}))
            competencies.append(competency)
        cur.executemany("INSERT INTO competency VALUES (?,?,?,?)", competencies)
        competency_ids = [c[0] for c in competencies]

        # Populate capabilities
        capabilities = []
        for _ in range(20):
            capability = (
                str(uuid.uuid4()), fake.bs(), fake.text(max_nb_chars=200),
                datetime.now(), datetime.now(), json.dumps({}), True
            )
            capabilities.append(capability)
        cur.executemany("INSERT INTO capability VALUES (?,?,?,?,?,?,?)", capabilities)
        capability_ids = [c[0] for c in capabilities]

        # Populate capability_competencies
        capability_competencies_data = []
        for cap_id in capability_ids:
            for _ in range(random.randint(1, 5)):
                comp_id = random.choice(competency_ids)
                if (cap_id, comp_id) not in capability_competencies_data:
                    capability_competencies_data.append((cap_id, comp_id))
        cur.executemany("INSERT INTO capability_competencies VALUES (?,?)", capability_competencies_data)

        # Populate competency_skills
        competency_skills_data = []
        for comp_id in competency_ids:
            for _ in range(random.randint(2, 10)):
                skill_id = random.choice(skill_ids)
                if (comp_id, skill_id) not in competency_skills_data:
                    competency_skills_data.append((comp_id, skill_id))
        cur.executemany("INSERT INTO competency_skills VALUES (?,?)", competency_skills_data)

        # Populate job_level
        job_levels = []
        for i in range(1, 6):
            level = (
                str(uuid.uuid4()), f"Level {i}", f"Description for Level {i}",
                50000 * i, 80000 * i, i * 2, f"Title {i}", f"L{i}", i > 3, "Promotion criteria..."
            )
            job_levels.append(level)
        cur.executemany("INSERT INTO job_level VALUES (?,?,?,?,?,?,?,?,?,?)", job_levels)
        job_level_ids = [level[0] for level in job_levels]

        # Populate role_group
        role_groups = []
        for _ in range(10):
            group = (
                str(uuid.uuid4()), fake.job(), fake.text(max_nb_chars=100),
                "Sample roles...", "High", fake.boolean(), "IT, HR", f"RG{random.randint(100,999)}"
            )
            role_groups.append(group)
        cur.executemany("INSERT INTO role_group VALUES (?,?,?,?,?,?,?,?)", role_groups)
        role_group_ids = [group[0] for group in role_groups]

        # Populate job_profile
        job_profiles = []
        for _ in range(50):
            profile = (
                str(uuid.uuid4()), fake.job(), random.choice(job_level_ids), random.choice(role_group_ids),
                fake.bs(), fake.text(), "Bachelor's Degree", "English", None,
                random.choice(['Remote', 'Hybrid', 'On-site']), random.choice(['Full-time', 'Part-time']),
                fake.boolean(), f"JC{random.randint(1000,9999)}", fake.city(), fake.boolean(), "None"
            )
            job_profiles.append(profile)
        cur.executemany("INSERT INTO job_profile VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", job_profiles)
        job_profile_ids = [p[0] for p in job_profiles]

        # Populate job_profile_required_skills
        job_profile_skills = []
        for profile_id in job_profile_ids:
            for _ in range(random.randint(3, 15)):
                skill_id = random.choice(skill_ids)
                if (profile_id, skill_id) not in job_profile_skills:
                    job_profile_skills.append((profile_id, skill_id))
        cur.executemany("INSERT INTO job_profile_required_skills VALUES (?,?)", job_profile_skills)

        # Populate business_unit
        business_units = []
        for org_id in organization_ids:
            for _ in range(random.randint(2, 5)):
                bu = (
                    str(uuid.uuid4()), fake.bs(), fake.name(), fake.email(), org_id,
                    "Strategic priority...", "KPIs...", "Division", fake.city(), random.randint(100000, 1000000)
                )
                business_units.append(bu)
        cur.executemany("INSERT INTO business_unit VALUES (?,?,?,?,?,?,?,?,?,?)", business_units)
        business_unit_ids = [bu[0] for bu in business_units]

        # Populate department
        departments = []
        for bu_id in business_unit_ids:
            for _ in range(random.randint(2, 5)):
                dept = (
                    str(uuid.uuid4()), fake.job(), bu_id, fake.name(), fake.email(),
                    random.randint(50000, 200000), "Function", fake.city(), fake.boolean(),
                    fake.timezone(), f"D{random.randint(100,999)}"
                )
                departments.append(dept)
        cur.executemany("INSERT INTO department VALUES (?,?,?,?,?,?,?,?,?,?,?)", departments)
        department_ids = [d[0] for d in departments]

        # Populate role
        roles = []
        for _ in range(100):
            role = (
                str(uuid.uuid4()), fake.job(), fake.text(max_nb_chars=200),
                random.choice(department_ids), random.choice(job_level_ids),
                datetime.now(), datetime.now(), json.dumps({}), True
            )
            roles.append(role)
        cur.executemany("INSERT INTO role VALUES (?,?,?,?,?,?,?,?,?)", roles)
        role_ids = [r[0] for r in roles]

        print("Database populated successfully.")

if __name__ == '__main__':
    populate_data()
