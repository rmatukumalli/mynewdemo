from . import db # Import db from app/__init__.py

class RelationshipType(db.Model):
    __tablename__ = 'relationship_type'
    id = db.Column(db.String(50), primary_key=True) # e.g., 'related_to', 'prerequisite_of'
    name = db.Column(db.String(100), nullable=False, unique=True) # e.g., 'Related to', 'Prerequisite of'
    description = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<RelationshipType {self.name}>"

class SkillRelationship(db.Model):
    __tablename__ = 'skill_relationship'
    id = db.Column(db.Integer, primary_key=True) # Auto-incrementing ID for each relationship instance
    source_skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=False)
    target_skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=False)
    relationship_type_id = db.Column(db.String(50), db.ForeignKey('relationship_type.id'), nullable=False)

    # Define relationships to Skill and RelationshipType models
    source_skill = db.relationship('Skill', foreign_keys=[source_skill_id], back_populates="source_relationships")
    target_skill = db.relationship('Skill', foreign_keys=[target_skill_id], back_populates="target_relationships")
    relationship_type = db.relationship('RelationshipType', backref='skill_relationships', lazy='selectin')

    def __repr__(self):
        return f"<SkillRelationship {self.source_skill_id} {self.relationship_type_id} {self.target_skill_id}>"


# Association table for Competency and Skill (Many-to-Many)
competency_skills = db.Table('competency_skills',
    db.Column('competency_id', db.String(150), db.ForeignKey('competency.id'), primary_key=True),
    db.Column('skill_id', db.String(150), db.ForeignKey('skill.id'), primary_key=True)
)

capability_competencies = db.Table('capability_competencies',
    db.Column('capability_id', db.String(150), db.ForeignKey('capability.id'), primary_key=True),
    db.Column('competency_id', db.String(150), db.ForeignKey('competency.id'), primary_key=True)
)

class Capability(db.Model):
    __tablename__ = 'capability'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    custom_fields = db.Column(db.JSON, nullable=True) # For custom attributes/metadata
    
    competencies = db.relationship(
        'Competency',
        secondary='capability_competencies',
        back_populates='capabilities',
        lazy='selectin'
    )

    def __repr__(self):
        return f"<Capability {self.name}>"

class Competency(db.Model):
    __tablename__ = 'competency'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)

    capabilities = db.relationship(
        'Capability',
        secondary='capability_competencies',
        back_populates='competencies',
        lazy='selectin'
    )
    
    skills = db.relationship(
        'Skill',
        secondary=competency_skills,
        back_populates='competencies',
        lazy='selectin'
    )

    roles = db.relationship(
        'Role',
        secondary='role_competencies',
        back_populates='competencies',
        lazy='selectin'
    )

    behaviors = db.relationship('Behavior', backref='competency', lazy='selectin', cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Competency {self.name}>"

class Behavior(db.Model):
    __tablename__ = 'behavior'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    competency_id = db.Column(db.String(150), db.ForeignKey('competency.id'), nullable=False)

    def __repr__(self):
        return f"<Behavior {self.name}>"

class Skill(db.Model):
    __tablename__ = 'skill'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True) 
    criticality = db.Column(db.String(50), nullable=True) # e.g., 'High', 'Medium', 'Low'
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    custom_fields = db.Column(db.JSON, nullable=True) # For custom attributes/metadata
    is_active = db.Column(db.Boolean, default=True) # Soft delete

    tags = db.relationship(
        'SkillTag',
        secondary='skill_tag_map',
        back_populates='skills',
        lazy='selectin'
    )
    
    competencies = db.relationship(
        'Competency',
        secondary=competency_skills,
        back_populates='skills',
        lazy='selectin'
    )
    
    proficiencies = db.relationship('Proficiency', backref='skill', lazy='selectin')

    source_relationships = db.relationship(
        'SkillRelationship',
        foreign_keys=[SkillRelationship.source_skill_id],
        back_populates='source_skill',
        lazy='selectin',
        cascade='all, delete-orphan'
    )
    target_relationships = db.relationship(
        'SkillRelationship',
        foreign_keys=[SkillRelationship.target_skill_id],
        back_populates='target_skill',
        lazy='selectin',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f"<Skill {self.name}>"

class Proficiency(db.Model):
    __tablename__ = 'proficiency'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    level = db.Column(db.Integer, nullable=False)
    
    skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=False)

    def __repr__(self):
        return f"<Proficiency {self.name} (Level {self.level})>"

class Organization(db.Model):
    __tablename__ = 'organization'
    id = db.Column(db.String(150), primary_key=True)
    company_name = db.Column(db.String(255), nullable=False, unique=True)
    industry = db.Column(db.String(100))
    company_size = db.Column(db.String(50))
    operating_regions = db.Column(db.Text)
    founded_year = db.Column(db.Integer)
    public_or_private = db.Column(db.String(50))
    stock_symbol = db.Column(db.String(10))
    vision_mission = db.Column(db.Text)
    org_maturity_level = db.Column(db.String(50))
    hrms_integrated = db.Column(db.Boolean)
    erp_system = db.Column(db.String(100))
    org_chart_available = db.Column(db.Boolean)
    org_metadata_file = db.Column(db.Text)

    business_units = db.relationship('BusinessUnit', backref='organization', lazy='selectin')

    def __repr__(self):
        return f"<Organization {self.company_name}>"

class BusinessUnit(db.Model):
    __tablename__ = 'business_unit'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    head = db.Column(db.String(150))
    email = db.Column(db.String(150))
    organization_id = db.Column(db.String(150), db.ForeignKey('organization.id'), nullable=False) # FK to Organization
    # linked_departments will be handled by an association table
    strategic_priority = db.Column(db.Text)
    kpis = db.Column(db.Text)
    business_unit_type = db.Column(db.String(100))
    location = db.Column(db.String(150))
    budget_allocation = db.Column(db.Integer)

    departments = db.relationship(
        'Department',
        secondary='business_unit_departments',
        back_populates='business_units',
        lazy='selectin'
    )

    def __repr__(self):
        return f"<BusinessUnit {self.name}>"

# Association table for BusinessUnit and Department (Many-to-Many)
business_unit_departments = db.Table('business_unit_departments',
    db.Column('business_unit_id', db.String(150), db.ForeignKey('business_unit.id'), primary_key=True),
    db.Column('department_id', db.String(150), db.ForeignKey('department.id'), primary_key=True)
)

class Department(db.Model):
    __tablename__ = 'department'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    business_unit_id = db.Column(db.String(150), db.ForeignKey('business_unit.id'), nullable=False) # FK to BusinessUnit
    manager = db.Column(db.String(150))
    email = db.Column(db.String(150))
    headcount_budget = db.Column(db.Integer)
    function_type = db.Column(db.String(100))
    location = db.Column(db.String(150))
    shift_coverage = db.Column(db.Boolean)
    time_zone = db.Column(db.String(50))
    department_code = db.Column(db.String(50))

    business_units = db.relationship(
        'BusinessUnit',
        secondary='business_unit_departments',
        back_populates='departments',
        lazy='selectin'
    )

    def __repr__(self):
        return f"<Department {self.name}>"

class RoleGroup(db.Model):
    __tablename__ = 'role_group'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.Text)
    sample_roles = db.Column(db.Text)
    strategic_importance = db.Column(db.String(100))
    business_critical = db.Column(db.Boolean)
    associated_departments = db.Column(db.Text)
    role_family_code = db.Column(db.String(50))

    def __repr__(self):
        return f"<RoleGroup {self.name}>"

class JobLevel(db.Model):
    __tablename__ = 'job_level'
    id = db.Column(db.String(150), primary_key=True)
    level_name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.Text)
    salary_band_min = db.Column(db.Integer)
    salary_band_max = db.Column(db.Integer)
    min_experience_years = db.Column(db.Integer)
    allowed_titles = db.Column(db.Text)
    level_code = db.Column(db.String(50))
    is_managerial = db.Column(db.Boolean)
    promotion_criteria = db.Column(db.Text)

    def __repr__(self):
        return f"<JobLevel {self.level_name}>"

# Association table for JobProfile and Skill (Many-to-Many)
job_profile_required_skills = db.Table('job_profile_required_skills',
    db.Column('job_profile_id', db.String(150), db.ForeignKey('job_profile.id'), primary_key=True),
    db.Column('skill_id', db.String(150), db.ForeignKey('skill.id'), primary_key=True)
)

class JobProfile(db.Model):
    __tablename__ = 'job_profile' # Renamed from JobSkill
    id = db.Column(db.String(150), primary_key=True)
    job_title = db.Column(db.String(255), nullable=False)
    job_level_id = db.Column(db.String(150), db.ForeignKey('job_level.id'), nullable=True) # FK
    role_group_id = db.Column(db.String(150), db.ForeignKey('role_group.id'), nullable=True) # FK
    job_family = db.Column(db.String(150))
    description = db.Column(db.Text)
    # required_skills will be handled by the association table
    education = db.Column(db.Text)
    language_requirements = db.Column(db.Text)
    reports_to = db.Column(db.String(150)) # Assuming this refers to a role or user ID string
    work_model = db.Column(db.String(50))
    job_type = db.Column(db.String(50))
    union_affiliation = db.Column(db.Boolean)
    job_code = db.Column(db.String(50))
    work_location = db.Column(db.String(150))
    travel_required = db.Column(db.Boolean)
    compliance_requirements = db.Column(db.Text)

    required_skills = db.relationship(
        'Skill',
        secondary=job_profile_required_skills,
        backref='job_profiles',
        lazy='selectin'
    )

    def __repr__(self):
        return f"<JobProfile {self.job_title}>"

class CareerPath(db.Model):
    __tablename__ = 'career_path'
    id = db.Column(db.String(150), primary_key=True) # Using String for UUID
    source_role_id = db.Column(db.String(150), db.ForeignKey('role.id'), nullable=False)
    target_role_id = db.Column(db.String(150), db.ForeignKey('role.id'), nullable=False)
    transition_type = db.Column(db.String(100), nullable=False) # e.g., ‘promotion’, ‘lateral’, ‘cross-functional’
    notes = db.Column(db.Text, nullable=True)
    is_default = db.Column(db.Boolean, default=False)

    source_role = db.relationship('Role', foreign_keys=[source_role_id], backref=db.backref('outgoing_career_paths', lazy='selectin'))
    target_role = db.relationship('Role', foreign_keys=[target_role_id], backref=db.backref('incoming_career_paths', lazy='selectin'))

    def __repr__(self):
        return f"<CareerPath {self.source_role_id} -> {self.target_role_id}>"

class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    department_id = db.Column(db.String(150), db.ForeignKey('department.id'), nullable=False)
    job_level_id = db.Column(db.String(150), db.ForeignKey('job_level.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    custom_fields = db.Column(db.JSON, nullable=True) # For custom attributes/metadata
    is_active = db.Column(db.Boolean, default=True) # Soft delete

    competencies = db.relationship(
        'Competency',
        secondary='role_competencies',
        back_populates='roles',
        lazy='selectin'
    )

    def __repr__(self):
        return f"<Role {self.name}>"

# Association table for Role and Competency (Many-to-Many)
role_competencies = db.Table('role_competencies',
    db.Column('role_id', db.String(150), db.ForeignKey('role.id'), primary_key=True),
    db.Column('competency_id', db.String(150), db.ForeignKey('competency.id'), primary_key=True)
)

class SkillTag(db.Model):
    __tablename__ = 'skill_tag'
    id = db.Column(db.String(150), primary_key=True) # Using String for UUID
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)

    skills = db.relationship(
        'Skill',
        secondary='skill_tag_map',
        back_populates='tags',
        lazy='selectin'
    )

    def __repr__(self):
        return f"<SkillTag {self.name}>"

# Association table for Skill and SkillTag (Many-to-Many)
skill_tag_map = db.Table('skill_tag_map',
    db.Column('skill_id', db.String(150), db.ForeignKey('skill.id'), primary_key=True),
    db.Column('tag_id', db.String(150), db.ForeignKey('skill_tag.id'), primary_key=True)
)

class UserSkill(db.Model):
    __tablename__ = 'user_skill'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(150), db.ForeignKey('user.id'), nullable=False)
    skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=False)
    proficiency_level_id = db.Column(db.Integer, db.ForeignKey('proficiency.id'), nullable=False)
    acquired_date = db.Column(db.Date, nullable=False)
    last_validated_date = db.Column(db.Date, nullable=True)
    validation_status = db.Column(db.String(50), nullable=True) # e.g., 'self-declared', 'manager-assessed', 'test-based'

    skill = db.relationship('Skill', backref='user_skills', lazy='selectin')
    proficiency = db.relationship('Proficiency', backref='user_skills_at_level', lazy='selectin')

    def __repr__(self):
        return f"<UserSkill User:{self.user_id} Skill:{self.skill_id} Level:{self.proficiency_level_id}>"

class UserCareerHistory(db.Model):
    __tablename__ = 'user_career_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(150), db.ForeignKey('user.id'), nullable=False)
    role_id = db.Column(db.String(150), db.ForeignKey('role.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    notes = db.Column(db.Text, nullable=True)

    role = db.relationship('Role', backref='user_career_history', lazy='selectin')

    def __repr__(self):
        return f"<UserCareerHistory User:{self.user_id} Role:{self.role_id} ({self.start_date} - {self.end_date})>"

class Assessment(db.Model):
    __tablename__ = 'assessment'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=False)
    assessment_type = db.Column(db.String(100), nullable=False) # e.g., 'quiz', 'project', 'interview'
    date_created = db.Column(db.Date, nullable=False)
    last_updated = db.Column(db.Date, nullable=False)

    skill = db.relationship('Skill', backref='assessments', lazy='selectin')

    def __repr__(self):
        return f"<Assessment {self.name} for Skill:{self.skill_id}>"

class LearningResource(db.Model):
    __tablename__ = 'learning_resource'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.Text, nullable=True) # Changed to Text for longer URLs
    resource_type = db.Column(db.String(100), nullable=False) # e.g., 'course', 'article', 'book', 'video'
    skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=False)
    author = db.Column(db.String(150), nullable=True)
    estimated_time_minutes = db.Column(db.Integer, nullable=True)

    skill = db.relationship('Skill', backref='learning_resources', lazy='selectin')
    
    learning_paths_through_association = db.relationship(
        'LearningPathResourceAssociation',
        back_populates='learning_resource',
        lazy='selectin'
    )

    def __repr__(self):
        return f"<LearningResource {self.title} for Skill:{self.skill_id}>"

class LearningPath(db.Model):
    __tablename__ = 'learning_path'
    id = db.Column(db.String(150), primary_key=True) # Using String for UUID
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    role_id = db.Column(db.String(150), db.ForeignKey('role.id'), nullable=True) # Optional FK to roles.id
    created_by = db.Column(db.String(150), nullable=True)
    estimated_duration = db.Column(db.Integer, nullable=True) # in minutes or hours
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    is_active = db.Column(db.Boolean, default=True) # Soft delete

    resources = db.relationship(
        'LearningPathResourceAssociation',
        back_populates='learning_path',
        lazy='selectin'
    )

    def __repr__(self):
        return f"<LearningPath {self.title}>"

class LearningPathResourceAssociation(db.Model):
    __tablename__ = 'learning_path_resources'
    learning_path_id = db.Column(db.String(150), db.ForeignKey('learning_path.id'), primary_key=True)
    learning_resource_id = db.Column(db.Integer, db.ForeignKey('learning_resource.id'), primary_key=True)
    sequence_order = db.Column(db.Integer, nullable=False)

    learning_path = db.relationship('LearningPath', back_populates='resources')
    learning_resource = db.relationship('LearningResource', back_populates='learning_paths_through_association')

    def __repr__(self):
        return f"<LearningPathResourceAssociation LP:{self.learning_path_id} LR:{self.learning_resource_id} Order:{self.sequence_order}>"

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String(150), primary_key=True) # Or Integer, depending on your user ID strategy
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True) # Added for user bio/description
    # ... other user attributes

    user_skills = db.relationship('UserSkill', backref='user', lazy='selectin')
    career_history = db.relationship('UserCareerHistory', backref='user', lazy='selectin')
    skill_gaps = db.relationship('SkillGap', backref='user', lazy='selectin')

    def __repr__(self):
        return f"<User {self.username}>"

class SkillGap(db.Model):
    __tablename__ = 'skill_gap'
    id = db.Column(db.String(150), primary_key=True) # Using String for UUID
    user_id = db.Column(db.String(150), db.ForeignKey('user.id'), nullable=False)
    skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=False)
    required_proficiency = db.Column(db.Integer, nullable=False)
    current_proficiency = db.Column(db.Integer, nullable=False)
    gap_score = db.Column(db.Integer, nullable=False) # auto-computed, e.g., required - current

    skill = db.relationship('Skill', backref='skill_gaps', lazy='selectin')

    def __repr__(self):
        return f"<SkillGap User:{self.user_id} Skill:{self.skill_id} Gap:{self.gap_score}>"

class ProjectOrAssignment(db.Model):
    __tablename__ = 'project_or_assignment'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(50), nullable=False) # e.g., 'Planned', 'In Progress', 'Completed', 'On Hold'
    project_type = db.Column(db.String(100), nullable=False) # e.g., 'Internal', 'Client', 'R&D'
    budget = db.Column(db.Integer, nullable=True)
    manager_id = db.Column(db.String(150), db.ForeignKey('user.id'), nullable=False) # Manager is a User
    organization_id = db.Column(db.String(150), db.ForeignKey('organization.id'), nullable=False)
    associated_role_id = db.Column(db.String(150), db.ForeignKey('role.id'), nullable=True) # Role associated with the project
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    is_active = db.Column(db.Boolean, default=True)

    manager = db.relationship('User', foreign_keys=[manager_id], backref='managed_projects', lazy='selectin')
    organization = db.relationship('Organization', backref='projects_or_assignments', lazy='selectin')
    associated_role = db.relationship('Role', backref='projects_or_assignments', lazy='selectin')

    def __repr__(self):
        return f"<ProjectOrAssignment {self.name}>"

class Certification(db.Model):
    __tablename__ = 'certification'
    id = db.Column(db.String(150), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    issuing_organization = db.Column(db.String(255), nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    expiry_date = db.Column(db.Date, nullable=True)
    credential_id = db.Column(db.String(255), nullable=True)
    credential_url = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.String(150), db.ForeignKey('user.id'), nullable=False)
    skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=True) # Skill associated with the certification
    organization_id = db.Column(db.String(150), db.ForeignKey('organization.id'), nullable=True) # Organization that recognizes/requires it
    certification_type = db.Column(db.String(100), nullable=False) # e.g., 'Industry Standard', 'Vendor Specific', 'Internal'
    status = db.Column(db.String(50), nullable=False) # e.g., 'Active', 'Expired', 'Pending'
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', backref='certifications', lazy='selectin')
    skill = db.relationship('Skill', backref='certifications', lazy='selectin')
    organization = db.relationship('Organization', backref='certifications', lazy='selectin')

    def __repr__(self):
        return f"<Certification {self.name} for User:{self.user_id}>"

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.String(150), primary_key=True)
    giver_id = db.Column(db.String(150), db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.String(150), db.ForeignKey('user.id'), nullable=False)
    feedback_text = db.Column(db.Text, nullable=False)
    feedback_date = db.Column(db.Date, nullable=False)
    feedback_type = db.Column(db.String(100), nullable=False) # e.g., 'Performance', 'Development', 'Peer', '360 Review'
    rating = db.Column(db.Integer, nullable=True) # e.g., 1-5 scale
    associated_role_id = db.Column(db.String(150), db.ForeignKey('role.id'), nullable=True) # Role context for feedback
    skill_id = db.Column(db.String(150), db.ForeignKey('skill.id'), nullable=True) # New column
    competency_id = db.Column(db.String(150), db.ForeignKey('competency.id'), nullable=True) # New column
    private_notes = db.Column(db.Text, nullable=True) # Notes visible only to giver/receiver
    action_items = db.Column(db.Text, nullable=True) # Actionable items derived from feedback
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    giver = db.relationship('User', foreign_keys=[giver_id], backref='given_feedback', lazy='selectin')
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref='received_feedback', lazy='selectin')
    associated_role = db.relationship('Role', backref='feedback_for_role', lazy='selectin')
    skill = db.relationship('Skill', foreign_keys=[skill_id], backref='feedback', lazy='selectin') # New relationship
    competency = db.relationship('Competency', foreign_keys=[competency_id], backref='feedback', lazy='selectin') # New relationship

    def __repr__(self):
        return f"<Feedback from {self.giver_id} to {self.receiver_id} on {self.feedback_date}>"
