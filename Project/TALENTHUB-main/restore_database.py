import sqlite3

def restore_data():
    backup_conn = sqlite3.connect('site.db.bak')
    main_conn = sqlite3.connect('site.db')

    backup_cur = backup_conn.cursor()
    main_cur = main_conn.cursor()

    tables = [
        'organization', 'user', 'capability', 'competency', 'skill', 'behavior', 'proficiency',
        'job_level', 'role_group', 'job_profile', 'department', 'business_unit', 'role',
        'skill_tag', 'assessment', 'learning_resource', 'learning_path', 'career_path',
        'user_skill', 'user_career_history', 'skill_gap', 'certification', 'feedback',
        'project_or_assignment', 'competency_skills', 'capability_competencies',
        'business_unit_departments', 'role_competencies', 'job_profile_required_skills',
        'skill_tag_map', 'learning_path_resources', 'skill_relationship', 'relationship_type'
    ]

    for table in tables:
        print(f"Restoring table: {table}")
        try:
            backup_cur.execute(f"SELECT * FROM {table}")
            data = backup_cur.fetchall()
            if data:
                placeholders = ','.join(['?'] * len(data[0]))
                main_cur.executemany(f"INSERT INTO {table} VALUES ({placeholders})", data)
                print(f"Restored {len(data)} rows to {table}")
        except sqlite3.Error as e:
            print(f"Error restoring table {table}: {e}")
            if "no such table" in str(e):
                print(f"Skipping table {table} as it does not exist in the backup.")
                continue

    main_conn.commit()
    main_conn.close()
    backup_conn.close()

if __name__ == '__main__':
    restore_data()
