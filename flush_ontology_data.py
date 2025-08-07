import os
from app import create_app, db
from app.models import (
    SkillRelationship, RelationshipType, Capability, Competency, Behavior, Skill, Proficiency,
    Organization, BusinessUnit, Department, RoleGroup, JobLevel, JobProfile
)

# Create a Flask app context
app = create_app()
app.app_context().push()

def flush_all_data():
    """Deletes all data from the ontology-related tables in the correct order."""
    try:
        print("Flushing all data from ontology-related tables...")

        # Disable foreign key checks for SQLite to allow deletion in any order
        # This is a common practice for bulk deletions in SQLite, but be cautious in production
        if db.engine.name == 'sqlite':
            db.session.execute(db.text("PRAGMA foreign_keys = OFF"))
            db.session.commit()

        # Delete from tables with foreign key dependencies first
        db.session.query(SkillRelationship).delete()
        db.session.query(Behavior).delete()
        db.session.query(Proficiency).delete()

        # Delete from association tables
        db.session.execute(db.text("DELETE FROM competency_skills"))
        db.session.execute(db.text("DELETE FROM capability_competencies"))

        # Delete from main tables
        db.session.query(Skill).delete()
        db.session.query(Competency).delete()
        db.session.query(Capability).delete()
        db.session.query(RelationshipType).delete()

        # Delete from other organizational tables
        db.session.query(JobProfile).delete()
        db.session.query(JobLevel).delete()
        db.session.query(RoleGroup).delete()
        db.session.query(Department).delete()
        db.session.query(BusinessUnit).delete()
        db.session.query(Organization).delete()

        db.session.commit()

        # Re-enable foreign key checks for SQLite
        if db.engine.name == 'sqlite':
            db.session.execute(db.text("PRAGMA foreign_keys = ON"))
            db.session.commit()

        print("All ontology-related data flushed successfully.")

    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.session.close()

if __name__ == "__main__":
    flush_all_data()
