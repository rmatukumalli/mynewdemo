from . import ma
from .models import (
    Organization, BusinessUnit, Department, RoleGroup, JobLevel, JobProfile,
    User, Role, Capability, Competency, Behavior, Skill, SkillTag, RelationshipType,
    Proficiency, Assessment, LearningResource, LearningPath, CareerPath, Certification,
    Feedback, ProjectOrAssignment, SkillGap, UserSkill, UserCareerHistory,
    SkillRelationship, LearningPathResourceAssociation
)

# A simplified schema for nested skill representations to avoid circular dependencies.
class SimpleSkillSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Skill
        load_instance = True
        fields = ("id", "name")

class RelationshipTypeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RelationshipType
        load_instance = True
        include_relationships = True

class SkillRelationshipSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SkillRelationship
        load_instance = True
        include_relationships = True
        exclude = ()

    # Use the simple schema for nested skills to prevent recursion.
    source_skill = ma.Nested(SimpleSkillSchema, dump_only=True)
    target_skill = ma.Nested(SimpleSkillSchema, dump_only=True)
    relationship_type = ma.Nested(RelationshipTypeSchema, dump_only=True)

    source_skill_id = ma.String(required=True, load_only=True)
    target_skill_id = ma.String(required=True, load_only=True)
    relationship_type_id = ma.String(required=True, load_only=True)


class CapabilitySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Capability
        load_instance = True

    competency_ids = ma.List(ma.String(), load_only=True, required=False)


class CompetencySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Competency
        load_instance = True
    
    capabilities = ma.List(ma.Nested(lambda: CapabilitySchema(only=('id', 'name'))), dump_only=True)
    behaviors = ma.List(ma.Nested(lambda: BehaviorSchema(only=('id', 'name', 'description'))), dump_only=True)
    # Use the simple schema for nested skills.
    skills = ma.List(ma.Nested(SimpleSkillSchema), dump_only=True)

    capability_ids = ma.List(ma.String(), load_only=True, required=False)
    skill_ids = ma.List(ma.String(), load_only=True, required=False)


class BehaviorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Behavior
        include_fk = True
        load_instance = True

    competency = ma.Nested(lambda: CompetencySchema(only=('id', 'name')), dump_only=True)
    competency_id = ma.String(dump_only=True)
    level = ma.String(dump_only=True)


class SkillSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Skill
        load_instance = True
        include_fk = True
        include_relationships = True

    # Use exclude on nested schemas to prevent infinite recursion.
    competencies = ma.List(ma.Nested(lambda: CompetencySchema(exclude=("skills", "capabilities"))), dump_only=True)
    proficiencies = ma.List(ma.Nested(lambda: ProficiencySchema()), dump_only=True)
    source_relationships = ma.List(ma.Nested(lambda: SkillRelationshipSchema(exclude=("source_skill",))), dump_only=True)
    target_relationships = ma.List(ma.Nested(lambda: SkillRelationshipSchema(exclude=("target_skill",))), dump_only=True)


class ProficiencySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Proficiency
        include_fk = True
        load_instance = True

class OrganizationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Organization
        load_instance = True
        include_relationships = True

class BusinessUnitSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BusinessUnit
        load_instance = True
        include_relationships = True

class DepartmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Department
        load_instance = True
        include_relationships = True

class RoleGroupSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = RoleGroup
        load_instance = True
        include_relationships = True

class JobLevelSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = JobLevel
        load_instance = True
        include_relationships = True

class JobProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = JobProfile
        load_instance = True
        include_relationships = True
    
    organization = ma.Nested(OrganizationSchema, dump_only=True)
    business_unit = ma.Nested(BusinessUnitSchema, dump_only=True)
    department = ma.Nested(DepartmentSchema, dump_only=True)
    role_group = ma.Nested(RoleGroupSchema, dump_only=True)
    job_level = ma.Nested(JobLevelSchema, dump_only=True)
    
    organization_id = ma.String(load_only=True, required=False)
    business_unit_id = ma.String(load_only=True, required=False)
    department_id = ma.String(load_only=True, required=False)
    role_group_id = ma.String(load_only=True, required=False)
    job_level_id = ma.String(load_only=True, required=False)

    required_skills = ma.List(ma.Nested(lambda: SkillSchema(only=('id', 'name'))), dump_only=True)
    required_skill_ids = ma.List(ma.String(), load_only=True, required=False)

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_relationships = True

    role = ma.Nested(lambda: RoleSchema(only=('id', 'name')), dump_only=True)
    role_id = ma.String(load_only=True, required=False)

class RoleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Role
        load_instance = True
        include_relationships = True

class SkillTagSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SkillTag
        load_instance = True
        include_relationships = True

class AssessmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Assessment
        load_instance = True
        include_relationships = True

    user = ma.Nested(UserSchema, dump_only=True)
    skill = ma.Nested(SkillSchema, dump_only=True)
    proficiency = ma.Nested(ProficiencySchema, dump_only=True)

    user_id = ma.String(load_only=True, required=False)
    skill_id = ma.String(load_only=True, required=False)
    proficiency_id = ma.String(load_only=True, required=False)

class LearningResourceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LearningResource
        load_instance = True
        include_relationships = True

    skills = ma.List(ma.Nested(lambda: SkillSchema(only=('id', 'name'))), dump_only=True)
    skill_ids = ma.List(ma.String(), load_only=True, required=False)

class LearningPathSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LearningPath
        load_instance = True
        include_relationships = True

    skills = ma.List(ma.Nested(lambda: SkillSchema(only=('id', 'name'))), dump_only=True)
    skill_ids = ma.List(ma.String(), load_only=True, required=False)

    resources = ma.List(ma.Nested(lambda: LearningResourceSchema(only=('id', 'title'))), dump_only=True)
    resource_ids = ma.List(ma.String(), load_only=True, required=False)

class CareerPathSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CareerPath
        load_instance = True
        include_relationships = True

    from_job_profile = ma.Nested(JobProfileSchema, dump_only=True)
    to_job_profile = ma.Nested(JobProfileSchema, dump_only=True)

    from_job_profile_id = ma.String(load_only=True, required=False)
    to_job_profile_id = ma.String(load_only=True, required=False)

class CertificationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Certification
        load_instance = True
        include_relationships = True

    skills = ma.List(ma.Nested(lambda: SkillSchema(only=('id', 'name'))), dump_only=True)
    skill_ids = ma.List(ma.String(), load_only=True, required=False)

class FeedbackSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Feedback
        load_instance = True
        include_relationships = True

    user = ma.Nested(UserSchema, dump_only=True)
    skill = ma.Nested(SkillSchema, dump_only=True)

    user_id = ma.String(load_only=True, required=False)
    skill_id = ma.String(load_only=True, required=False)

class ProjectOrAssignmentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ProjectOrAssignment
        load_instance = True
        include_relationships = True

    skills = ma.List(ma.Nested(lambda: SkillSchema(only=('id', 'name'))), dump_only=True)
    skill_ids = ma.List(ma.String(), load_only=True, required=False)

class SkillGapSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SkillGap
        load_instance = True
        include_relationships = True

    user = ma.Nested(UserSchema, dump_only=True)
    skill = ma.Nested(SkillSchema, dump_only=True)
    job_profile = ma.Nested(JobProfileSchema, dump_only=True)

    user_id = ma.String(load_only=True, required=False)
    skill_id = ma.String(load_only=True, required=False)
    job_profile_id = ma.String(load_only=True, required=False)

class UserSkillSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserSkill
        load_instance = True
        include_relationships = True

    user = ma.Nested(UserSchema, dump_only=True)
    skill = ma.Nested(SkillSchema, dump_only=True)
    proficiency = ma.Nested(ProficiencySchema, dump_only=True)

    user_id = ma.String(load_only=True, required=False)
    skill_id = ma.String(load_only=True, required=False)
    proficiency_id = ma.String(load_only=True, required=False)

class UserCareerHistorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserCareerHistory
        load_instance = True
        include_relationships = True

    user = ma.Nested(UserSchema, dump_only=True)
    job_profile = ma.Nested(JobProfileSchema, dump_only=True)

    user_id = ma.String(load_only=True, required=False)
    job_profile_id = ma.String(load_only=True, required=False)

class LearningPathResourceAssociationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = LearningPathResourceAssociation
        load_instance = True
        include_relationships = True

    learning_path = ma.Nested(LearningPathSchema, dump_only=True)
    learning_resource = ma.Nested(LearningResourceSchema, dump_only=True)

    learning_path_id = ma.String(load_only=True, required=False)
    learning_resource_id = ma.String(load_only=True, required=False)

class SkillHierarchySchema(ma.Schema):
    id = ma.Str(dump_only=True)
    name = ma.Str(dump_only=True)
    category = ma.Str(dump_only=True)
    description = ma.Str(dump_only=True)
    
    # Nested relationships
    parents = ma.List(ma.Nested(SimpleSkillSchema), dump_only=True)
    children = ma.List(ma.Nested(SimpleSkillSchema), dump_only=True)
    siblings = ma.List(ma.Nested(SimpleSkillSchema), dump_only=True)
    grandparents = ma.List(ma.Nested(SimpleSkillSchema), dump_only=True)
    
    competencies = ma.List(ma.Nested(lambda: CompetencySchema(only=("id", "name"))), dump_only=True)
    capabilities = ma.List(ma.Nested(lambda: CapabilitySchema(only=("id", "name"))), dump_only=True)
    behaviors = ma.List(ma.Nested(lambda: BehaviorSchema(only=("id", "name"))), dump_only=True)
    proficiencies = ma.List(ma.Nested(lambda: ProficiencySchema()), dump_only=True)
    
    related_skills = ma.List(ma.Nested(SkillRelationshipSchema), dump_only=True)
