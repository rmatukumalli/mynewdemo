# Database Schema Details

This document provides a detailed overview of the database schema for the Skills Ontology Management System, including all tables, their attributes, and the relationships between them. This schema is designed to support job architecture, career pathing, AI-driven recommendations, and internal mobility use cases.

## Table of Contents
1.  [Core Ontology Tables](#core-ontology-tables)
    *   [Skill](#skill)
    *   [RelationshipType](#relationshiptype)
    *   [SkillRelationship](#skillrelationship)
    *   [Capability](#capability)
    *   [Competency](#competency)
    *   [Behavior](#behavior)
    *   [Proficiency](#proficiency)
2.  [Organizational Data Tables](#organizational-data-tables)
    *   [Organization](#organization)
    *   [BusinessUnit](#businessunit)
    *   [Department](#department)
    *   [RoleGroup](#rolegroup)
    *   [JobLevel](#joblevel)
    *   [JobProfile (formerly JobSkill)](#jobprofile-formerly-jobskill)
3.  [User, Career, and Learning Tables](#user-career-and-learning-tables)
    *   [User](#user)
    *   [Role](#role)
    *   [CareerPath](#careerpath)
    *   [SkillTag](#skilltag)
    *   [UserSkill](#userskill)
    *   [UserCareerHistory](#usercareerhistory)
    *   [Assessment](#assessment)
    *   [LearningResource](#learningresource)
    *   [LearningPath](#learningpath)
    *   [SkillGap](#skillgap)
4.  [Association Tables (Many-to-Many Relationships)](#association-tables-many-to-many-relationships)
    *   [capability_competencies](#capability_competencies)
    *   [competency_skills](#competency_skills)
    *   [role_competencies](#role_competencies)
    *   [skill_tag_map](#skill_tag_map)
    *   [learning_path_resources](#learning_path_resources)
    *   [business_unit_departments](#business_unit_departments)
    *   [job_profile_required_skills](#job_profile_required_skills)
5.  [Key Relationships Overview](#key-relationships-overview)
6.  [Schema Enhancements Implemented](#schema-enhancements-implemented)

---

## 1. Core Ontology Tables

### Skill
Represents a specific ability or expertise.
*   `id`: String (PK) - Unique identifier for the skill (e.g., UUID).
*   `name`: String (Unique, Not Null) - Name of the skill.
*   `description`: Text - Detailed description of the skill.
*   `category`: String - General classification of the skill (e.g., "Technical", "Soft Skill").
*   `criticality`: String - Importance level (e.g., 'High', 'Medium', 'Low').
*   `level`: String (Not Null, Default: 'skill') - Further categorization if needed.
*   `created_at`: DateTime - Timestamp of creation.
*   `updated_at`: DateTime - Timestamp of last update.
*   `custom_fields`: JSON - Flexible field for additional metadata.
*   `is_active`: Boolean (Default: True) - Soft delete flag.

### RelationshipType
Defines the types of relationships between skills.
*   `id`: String (PK) - Unique identifier for the relationship type (e.g., 'related_to', 'prerequisite_of').
*   `name`: String (Unique, Not Null) - Display name of the relationship type.
*   `description`: Text - Description of the relationship type.

### SkillRelationship
Links two skills with a defined relationship type.
*   `id`: Integer (PK) - Auto-incrementing ID for the relationship instance.
*   `source_skill_id`: String (FK to `Skill.id`, Not Null) - The originating skill in the relationship.
*   `target_skill_id`: String (FK to `Skill.id`, Not Null) - The target skill in the relationship.
*   `relationship_type_id`: String (FK to `RelationshipType.id`, Not Null) - The type of relationship.

### Capability
High-level organizational abilities or functions.
*   `id`: String (PK) - Unique identifier for the capability.
*   `name`: String (Unique, Not Null) - Name of the capability.
*   `description`: Text - Description of the capability.
*   `created_at`: DateTime - Timestamp of creation.
*   `updated_at`: DateTime - Timestamp of last update.
*   `custom_fields`: JSON - Flexible field for additional metadata.
*   `is_active`: Boolean (Default: True) - Soft delete flag.

### Competency
Specific sets of knowledge, skills, and abilities required for a role or task.
*   `id`: String (PK) - Unique identifier for the competency.
*   `name`: String (Unique, Not Null) - Name of the competency.
*   `description`: Text - Description of the competency.
*   `custom_fields`: JSON - Flexible field for additional metadata.

### Behavior
Observable actions or conduct associated with a competency.
*   `id`: String (PK) - Unique identifier for the behavior.
*   `name`: String (Not Null) - Name of the behavior.
*   `description`: Text - Description of the behavior.
*   `competency_id`: String (FK to `Competency.id`, Not Null) - The competency this behavior belongs to.
*   `job_level_id`: String (FK to `JobLevel.id`, Optional) - Optional link to a specific job level.
*   `level`: String (Not Null, Default: 'behavior') - Further categorization if needed.

### Proficiency
Defines levels of mastery for skills.
*   `id`: Integer (PK) - Auto-incrementing ID for the proficiency level.
*   `name`: String (Not Null) - Name of the proficiency level (e.g., "Beginner", "Intermediate").
*   `description`: Text - Description of the proficiency level.
*   `level`: Integer (Not Null) - Numerical representation of the level (e.g., 1, 2, 3).
*   `skill_id`: String (FK to `Skill.id`, Optional) - The skill this proficiency level applies to.

---

## 2. Organizational Data Tables

### Organization
Represents a company or top-level entity.
*   `id`: String (PK) - Unique identifier for the organization.
*   `company_name`: String (Unique, Not Null) - Name of the company.
*   `industry`: String
*   `company_size`: String
*   `operating_regions`: String
*   `founded_year`: Integer
*   `public_or_private`: String
*   `stock_symbol`: String
*   `vision_mission`: String
*   `org_maturity_level`: String
*   `hrms_integrated`: Boolean
*   `erp_system`: String
*   `org_chart_available`: Boolean
*   `org_metadata_file`: String

### BusinessUnit
Represents a division or business unit within an organization.
*   `id`: String (PK) - Unique identifier for the business unit.
*   `name`: String (Unique, Not Null) - Name of the business unit.
*   `head`: String - Head of the business unit.
*   `email`: String - Email of the business unit head.
*   `organization_id`: String (FK to `Organization.id`, Optional) - The organization this business unit belongs to.
*   `strategic_priority`: String
*   `kpis`: String
*   `business_unit_type`: String
*   `location`: String
*   `budget_allocation`: Integer

### Department
Represents a department within a business unit.
*   `id`: String (PK) - Unique identifier for the department.
*   `name`: String (Unique, Not Null) - Name of the department.
*   `business_unit_id`: String (FK to `BusinessUnit.id`, Optional) - The business unit this department belongs to.
*   `manager`: String - Manager of the department.
*   `email`: String - Email of the department manager.
*   `headcount_budget`: Integer
*   `function_type`: String
*   `location`: String
*   `shift_coverage`: Boolean
*   `time_zone`: String
*   `department_code`: String

### RoleGroup
Groups similar job roles together (e.g., "Engineering", "Marketing").
*   `id`: String (PK) - Unique identifier for the role group.
*   `name`: String (Unique, Not Null) - Name of the role group.
*   `description`: Text - Description of the role group.
*   `sample_roles`: String
*   `strategic_importance`: String
*   `business_critical`: Boolean
*   `associated_departments`: String
*   `role_family_code`: String

### JobLevel
Defines hierarchical job levels (e.g., L1, L5, Senior PM).
*   `id`: String (PK) - Unique identifier for the job level.
*   `level_name`: String (Unique, Not Null) - Name of the job level.
*   `description`: Text - Description of the job level.
*   `salary_band_min`: Integer
*   `salary_band_max`: Integer
*   `min_experience_years`: Integer
*   `allowed_titles`: String
*   `level_code`: String
*   `is_managerial`: Boolean
*   `promotion_criteria`: String

### JobProfile (formerly JobSkill)
Describes a general job position or profile, including its characteristics and directly required skills.
*   `id`: String (PK) - Unique identifier for the job profile.
*   `job_title`: String (Not Null) - Title of the job profile.
*   `job_level_id`: String (FK to `JobLevel.id`, Optional) - The job level associated with this profile.
*   `role_group_id`: String (FK to `RoleGroup.id`, Optional) - The role group this profile belongs to.
*   `job_family`: String
*   `description`: Text
*   `education`: String
*   `language_requirements`: String
*   `reports_to`: String
*   `work_model`: String
*   `job_type`: String
*   `union_affiliation`: Boolean
*   `job_code`: String
*   `work_location`: String
*   `travel_required`: Boolean
*   `compliance_requirements`: String

---

## 3. User, Career, and Learning Tables

### User
Represents an individual user in the system.
*   `id`: String (PK) - Unique identifier for the user.
*   `username`: String (Unique, Not Null) - User's unique username.
*   `email`: String (Unique, Not Null) - User's email address.
*   _Other user-related fields can be added here (e.g., name, employee_id, etc.)_

### Role
Defines specific job roles within departments and at certain job levels.
*   `id`: String (PK) - Unique identifier for the role.
*   `name`: String (Unique, Not Null) - Name of the role (e.g., "Associate PM", "Senior Software Engineer").
*   `description`: Text - Description of the role.
*   `department_id`: String (FK to `Department.id`, Optional) - The department this role belongs to.
*   `job_level_id`: String (FK to `JobLevel.id`, Optional) - The job level of this role.
*   `created_at`: DateTime - Timestamp of creation.
*   `updated_at`: DateTime - Timestamp of last update.
*   `custom_fields`: JSON - Flexible field for additional metadata.
*   `is_active`: Boolean (Default: True) - Soft delete flag.

### CareerPath
Defines possible transitions between roles.
*   `id`: String (PK) - Unique identifier for the career path.
*   `source_role_id`: String (FK to `Role.id`, Not Null) - The starting role in the path.
*   `target_role_id`: String (FK to `Role.id`, Not Null) - The destination role in the path.
*   `transition_type`: String - Type of transition (e.g., 'promotion', 'lateral', 'cross-functional').
*   `notes`: Text - Additional notes about the path.
*   `is_default`: Boolean (Default: False) - Indicates if this is a default or recommended path.

### SkillTag
Allows for categorization and filtering of skills.
*   `id`: String (PK) - Unique identifier for the skill tag.
*   `name`: String (Unique, Not Null) - Name of the tag (e.g., "technical", "leadership").
*   `description`: Text - Description of the tag.

### UserSkill
Tracks individual user skill levels.
*   `id`: Integer (PK) - Auto-incrementing ID for the user skill record.
*   `user_id`: String (FK to `User.id`, Not Null) - The user who possesses the skill.
*   `skill_id`: String (FK to `Skill.id`, Not Null) - The skill being tracked.
*   `proficiency_level_id`: Integer (FK to `Proficiency.id`, Optional) - The user's proficiency level for this skill.
*   `acquired_date`: Date - Date the skill was acquired.
*   `last_validated_date`: Date - Date the skill proficiency was last validated.
*   `validation_status`: String - How the skill was validated (e.g., 'self-declared', 'manager-assessed', 'test-based').

### UserCareerHistory
Tracks a user's past and current roles for historical progression analysis.
*   `id`: Integer (PK) - Auto-incrementing ID for the history record.
*   `user_id`: String (FK to `User.id`, Not Null) - The user whose career history is being tracked.
*   `role_id`: String (FK to `Role.id`, Not Null) - The role held by the user.
*   `start_date`: Date (Not Null) - Start date in the role.
*   `end_date`: Date - End date in the role (nullable for current roles).
*   `notes`: Text - Any additional notes about the role period.

### Assessment
Tracks evaluations or validations of skills.
*   `id`: Integer (PK) - Auto-incrementing ID for the assessment.
*   `name`: String (Not Null) - Name of the assessment.
*   `description`: Text - Description of the assessment.
*   `skill_id`: String (FK to `Skill.id`, Not Null) - The skill being assessed.
*   `assessment_type`: String - Type of assessment (e.g., 'quiz', 'project', 'interview').
*   `date_created`: Date (Not Null) - Date the assessment record was created.
*   `last_updated`: Date (Not Null) - Date the assessment record was last updated.

### LearningResource
Associates skills with courses, readings, or other materials.
*   `id`: Integer (PK) - Auto-incrementing ID for the learning resource.
*   `title`: String (Not Null) - Title of the learning resource.
*   `description`: Text - Description of the resource.
*   `url`: Text - URL to the resource (changed to Text for longer URLs).
*   `resource_type`: String - Type of resource (e.g., 'course', 'article', 'book', 'video').
*   `skill_id`: String (FK to `Skill.id`, Not Null) - The skill this resource helps develop.
*   `author`: String - Author or provider of the resource.
*   `estimated_time_minutes`: Integer - Estimated time to complete the resource.

### LearningPath
Groups related learning resources into curated journeys.
*   `id`: String (PK) - Unique identifier for the learning path.
*   `title`: String (Not Null) - Title of the learning path.
*   `description`: Text - Description of the learning path.
*   `role_id`: String (FK to `Role.id`, Optional) - Optional link to a specific role this path is for.
*   `created_by`: String - User who created the learning path.
*   `estimated_duration`: Integer - Estimated total duration of the path.
*   `created_at`: DateTime - Timestamp of creation.
*   `updated_at`: DateTime - Timestamp of last update.
*   `is_active`: Boolean (Default: True) - Soft delete flag.

### SkillGap
Stores computed or manually tracked gaps between current and expected skill levels for a user.
*   `id`: String (PK) - Unique identifier for the skill gap record.
*   `user_id`: String (FK to `User.id`, Not Null) - The user with the skill gap.
*   `skill_id`: String (FK to `Skill.id`, Not Null) - The skill for which the gap exists.
*   `required_proficiency`: Integer (Not Null) - The proficiency level required.
*   `current_proficiency`: Integer (Not Null) - The user's current proficiency level.
*   `gap_score`: Integer (Not Null) - Auto-computed difference (e.g., `required - current`).

---

## 4. Association Tables (Many-to-Many Relationships)

These tables facilitate many-to-many relationships between entities.

### capability_competencies
Links `Capability` and `Competency`.
*   `capability_id`: String (PK, FK to `Capability.id`)
*   `competency_id`: String (PK, FK to `Competency.id`)

### competency_skills
Links `Competency` and `Skill`.
*   `competency_id`: String (PK, FK to `Competency.id`)
*   `skill_id`: String (PK, FK to `Skill.id`)

### role_competencies
Links `Role` and `Competency`.
*   `role_id`: String (PK, FK to `Role.id`)
*   `competency_id`: String (PK, FK to `Competency.id`)

### skill_tag_map
Links `Skill` and `SkillTag`.
*   `skill_id`: String (PK, FK to `Skill.id`)
*   `tag_id`: String (PK, FK to `SkillTag.id`)

### learning_path_resources
Links `LearningPath` and `LearningResource`.
*   `learning_path_id`: String (PK, FK to `LearningPath.id`)
*   `learning_resource_id`: Integer (PK, FK to `LearningResource.id`)
*   `sequence_order`: Integer (Not Null) - Defines the order of resources within a learning path.

### business_unit_departments
Links `BusinessUnit` and `Department`.
*   `business_unit_id`: String (PK, FK to `BusinessUnit.id`)
*   `department_id`: String (PK, FK to `Department.id`)

### job_profile_required_skills
Links `JobProfile` and `Skill` for direct skill requirements.
*   `job_profile_id`: String (PK, FK to `JobProfile.id`)
*   `skill_id`: String (PK, FK to `Skill.id`)

---

## 5. Key Relationships Overview

The schema is designed with a hierarchical and interconnected structure:

*   **Organizational Hierarchy**: `Organization` -> `BusinessUnit` (Many-to-Many with `Department`) -> `Department` -> `Role`.
*   **Job Structure**: `JobLevel` and `RoleGroup` define characteristics for `JobProfile`s. `JobProfile`s can directly require `Skill`s.
*   **Competency Framework**: `Capability`s contain `Competency`s, which in turn have `Behavior`s and contain `Skill`s. `Role`s require `Competency`s.
*   **Skill Management**: `Skill`s can have `Proficiency` levels, be linked by `SkillRelationship`s, and categorized by `SkillTag`s.
*   **User-Centric Data**: `User`s have `UserSkill`s (tracking proficiency and validation status), `UserCareerHistory` (tracking roles over time), and `SkillGap`s (identifying development needs).
*   **Learning & Development**: `LearningResource`s are associated with `Skill`s and can be grouped into `LearningPath`s. `LearningPath`s can optionally be tied to `Role`s.

## 6. Schema Enhancements Implemented

*   **Audit/Versioning**: Added `created_at` and `updated_at` timestamps to `Capability`, `Skill`, `Role`, and `LearningPath` models for better tracking of changes.
*   **Custom Attributes / Metadata**: Included a `custom_fields` JSON column in `Capability`, `Competency`, `Skill`, and `Role` models to allow for flexible, schema-less storage of additional attributes without requiring database migrations.
*   **Soft Delete**: Implemented an `is_active` boolean flag for non-destructive deletion on `Capability`, `Skill`, `Role`, and `LearningPath` models. This allows data to be logically removed without being permanently deleted.
*   **UserCareerHistory Table**: A new table to explicitly track the historical progression of users through different roles, enabling detailed career path analysis.
*   **ValidationStatus in UserSkill**: Added a field to `UserSkill` to record how a user's skill proficiency was validated (e.g., self-declared, manager-assessed, test-based).
*   **Normalization of Organizational Data**: `organization_id` (FK) added to `BusinessUnit`, `business_unit_id` (FK) added to `Department`. `linked_departments` and `linked_business_unit` were replaced by a `business_unit_departments` association table for proper Many-to-Many relationships.
*   **JobProfile Renaming and Relationships**: `JobSkill` was renamed to `JobProfile`. Its `job_level` and `role_group` fields were converted to foreign keys (`job_level_id`, `role_group_id`). A `job_profile_required_skills` association table was added to directly link `JobProfile`s to `Skill`s.
*   **User Model Integration**: A dedicated `User` model was created, and all `user_id` fields in related tables (`UserSkill`, `UserCareerHistory`, `SkillGap`) were updated to be foreign keys referencing `User.id`.
*   **LearningResource URL Length**: The `url` field in `LearningResource` was changed to `db.Text` to support longer URLs.

This comprehensive schema provides a robust foundation for managing and analyzing skills, roles, career paths, and learning within the talent marketplace.
