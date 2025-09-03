CREATE TABLE alembic_version (
	version_num VARCHAR(32) NOT NULL, 
	CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);
CREATE TABLE capability (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(150) NOT NULL, 
	description TEXT, 
	created_at DATETIME, 
	updated_at DATETIME, 
	custom_fields JSON, 
	is_active BOOLEAN, 
	PRIMARY KEY (id), 
	UNIQUE (name)
);
CREATE TABLE competency (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(150) NOT NULL, 
	description TEXT, 
	custom_fields JSON, 
	PRIMARY KEY (id), 
	UNIQUE (name)
);
CREATE TABLE job_level (
	id VARCHAR(150) NOT NULL, 
	level_name VARCHAR(150) NOT NULL, 
	description TEXT, 
	salary_band_min INTEGER, 
	salary_band_max INTEGER, 
	min_experience_years INTEGER, 
	allowed_titles TEXT, 
	level_code VARCHAR(50), 
	is_managerial BOOLEAN, 
	promotion_criteria TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (level_name)
);
CREATE TABLE organization (
	id VARCHAR(150) NOT NULL, 
	company_name VARCHAR(255) NOT NULL, 
	industry VARCHAR(100), 
	company_size VARCHAR(50), 
	operating_regions TEXT, 
	founded_year INTEGER, 
	public_or_private VARCHAR(50), 
	stock_symbol VARCHAR(10), 
	vision_mission TEXT, 
	org_maturity_level VARCHAR(50), 
	hrms_integrated BOOLEAN, 
	erp_system VARCHAR(100), 
	org_chart_available BOOLEAN, 
	org_metadata_file TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (company_name)
);
CREATE TABLE relationship_type (
	id VARCHAR(50) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (name)
);
CREATE TABLE role_group (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(150) NOT NULL, 
	description TEXT, 
	sample_roles TEXT, 
	strategic_importance VARCHAR(100), 
	business_critical BOOLEAN, 
	associated_departments TEXT, 
	role_family_code VARCHAR(50), 
	PRIMARY KEY (id), 
	UNIQUE (name)
);
CREATE TABLE skill (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(150) NOT NULL, 
	description TEXT, 
	category VARCHAR(100), 
	criticality VARCHAR(50), 
	created_at DATETIME, 
	updated_at DATETIME, 
	custom_fields JSON, 
	is_active BOOLEAN, 
	PRIMARY KEY (id), 
	UNIQUE (name)
);
CREATE TABLE skill_tag (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (name)
);
CREATE TABLE user (
	id VARCHAR(150) NOT NULL, 
	username VARCHAR(100) NOT NULL, 
	email VARCHAR(150) NOT NULL, 
	description TEXT, 
	PRIMARY KEY (id), 
	UNIQUE (email), 
	UNIQUE (username)
);
CREATE TABLE assessment (
	id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	description TEXT, 
	skill_id VARCHAR(150) NOT NULL, 
	assessment_type VARCHAR(100) NOT NULL, 
	date_created DATE NOT NULL, 
	last_updated DATE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id)
);
CREATE TABLE behavior (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	description TEXT, 
	competency_id VARCHAR(150) NOT NULL, 
	job_level_id VARCHAR(150), 
	PRIMARY KEY (id), 
	FOREIGN KEY(competency_id) REFERENCES competency (id), 
	FOREIGN KEY(job_level_id) REFERENCES job_level (id)
);
CREATE TABLE business_unit (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(150) NOT NULL, 
	head VARCHAR(150), 
	email VARCHAR(150), 
	organization_id VARCHAR(150) NOT NULL, 
	strategic_priority TEXT, 
	kpis TEXT, 
	business_unit_type VARCHAR(100), 
	location VARCHAR(150), 
	budget_allocation INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id), 
	UNIQUE (name)
);
CREATE TABLE capability_competencies (
	capability_id VARCHAR(150) NOT NULL, 
	competency_id VARCHAR(150) NOT NULL, 
	PRIMARY KEY (capability_id, competency_id), 
	FOREIGN KEY(capability_id) REFERENCES capability (id), 
	FOREIGN KEY(competency_id) REFERENCES competency (id)
);
CREATE TABLE certification (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	issuing_organization VARCHAR(255) NOT NULL, 
	issue_date DATE NOT NULL, 
	expiry_date DATE, 
	credential_id VARCHAR(255), 
	credential_url TEXT, 
	user_id VARCHAR(150) NOT NULL, 
	skill_id VARCHAR(150), 
	organization_id VARCHAR(150), 
	certification_type VARCHAR(100) NOT NULL, 
	status VARCHAR(50) NOT NULL, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id), 
	FOREIGN KEY(user_id) REFERENCES user (id)
);
CREATE TABLE competency_skills (
	competency_id VARCHAR(150) NOT NULL, 
	skill_id VARCHAR(150) NOT NULL, 
	PRIMARY KEY (competency_id, skill_id), 
	FOREIGN KEY(competency_id) REFERENCES competency (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id)
);
CREATE TABLE job_profile (
	id VARCHAR(150) NOT NULL, 
	job_title VARCHAR(255) NOT NULL, 
	job_level_id VARCHAR(150), 
	role_group_id VARCHAR(150), 
	job_family VARCHAR(150), 
	description TEXT, 
	education TEXT, 
	language_requirements TEXT, 
	reports_to VARCHAR(150), 
	work_model VARCHAR(50), 
	job_type VARCHAR(50), 
	union_affiliation BOOLEAN, 
	job_code VARCHAR(50), 
	work_location VARCHAR(150), 
	travel_required BOOLEAN, 
	compliance_requirements TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(job_level_id) REFERENCES job_level (id), 
	FOREIGN KEY(role_group_id) REFERENCES role_group (id)
);
CREATE TABLE learning_resource (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	description TEXT, 
	url TEXT, 
	resource_type VARCHAR(100) NOT NULL, 
	skill_id VARCHAR(150) NOT NULL, 
	author VARCHAR(150), 
	estimated_time_minutes INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id)
);
CREATE TABLE proficiency (
	id INTEGER NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	description TEXT, 
	level INTEGER NOT NULL, 
	skill_id VARCHAR(150) NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id)
);
CREATE TABLE skill_gap (
	id VARCHAR(150) NOT NULL, 
	user_id VARCHAR(150) NOT NULL, 
	skill_id VARCHAR(150) NOT NULL, 
	required_proficiency INTEGER NOT NULL, 
	current_proficiency INTEGER NOT NULL, 
	gap_score INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id), 
	FOREIGN KEY(user_id) REFERENCES user (id)
);
CREATE TABLE skill_relationship (
	id INTEGER NOT NULL, 
	source_skill_id VARCHAR(150) NOT NULL, 
	target_skill_id VARCHAR(150) NOT NULL, 
	relationship_type_id VARCHAR(50) NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(relationship_type_id) REFERENCES relationship_type (id), 
	FOREIGN KEY(source_skill_id) REFERENCES skill (id), 
	FOREIGN KEY(target_skill_id) REFERENCES skill (id)
);
CREATE TABLE skill_tag_map (
	skill_id VARCHAR(150) NOT NULL, 
	tag_id VARCHAR(150) NOT NULL, 
	PRIMARY KEY (skill_id, tag_id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id), 
	FOREIGN KEY(tag_id) REFERENCES skill_tag (id)
);
CREATE TABLE department (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(150) NOT NULL, 
	business_unit_id VARCHAR(150) NOT NULL, 
	manager VARCHAR(150), 
	email VARCHAR(150), 
	headcount_budget INTEGER, 
	function_type VARCHAR(100), 
	location VARCHAR(150), 
	shift_coverage BOOLEAN, 
	time_zone VARCHAR(50), 
	department_code VARCHAR(50), 
	PRIMARY KEY (id), 
	FOREIGN KEY(business_unit_id) REFERENCES business_unit (id), 
	UNIQUE (name)
);
CREATE TABLE job_profile_required_skills (
	job_profile_id VARCHAR(150) NOT NULL, 
	skill_id VARCHAR(150) NOT NULL, 
	PRIMARY KEY (job_profile_id, skill_id), 
	FOREIGN KEY(job_profile_id) REFERENCES job_profile (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id)
);
CREATE TABLE user_skill (
	id INTEGER NOT NULL, 
	user_id VARCHAR(150) NOT NULL, 
	skill_id VARCHAR(150) NOT NULL, 
	proficiency_level_id INTEGER NOT NULL, 
	acquired_date DATE NOT NULL, 
	last_validated_date DATE, 
	validation_status VARCHAR(50), 
	PRIMARY KEY (id), 
	FOREIGN KEY(proficiency_level_id) REFERENCES proficiency (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id), 
	FOREIGN KEY(user_id) REFERENCES user (id)
);
CREATE TABLE business_unit_departments (
	business_unit_id VARCHAR(150) NOT NULL, 
	department_id VARCHAR(150) NOT NULL, 
	PRIMARY KEY (business_unit_id, department_id), 
	FOREIGN KEY(business_unit_id) REFERENCES business_unit (id), 
	FOREIGN KEY(department_id) REFERENCES department (id)
);
CREATE TABLE role (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(150) NOT NULL, 
	description TEXT, 
	department_id VARCHAR(150) NOT NULL, 
	job_level_id VARCHAR(150) NOT NULL, 
	created_at DATETIME, 
	updated_at DATETIME, 
	custom_fields JSON, 
	is_active BOOLEAN, 
	PRIMARY KEY (id), 
	FOREIGN KEY(department_id) REFERENCES department (id), 
	FOREIGN KEY(job_level_id) REFERENCES job_level (id), 
	UNIQUE (name)
);
CREATE TABLE career_path (
	id VARCHAR(150) NOT NULL, 
	source_role_id VARCHAR(150) NOT NULL, 
	target_role_id VARCHAR(150) NOT NULL, 
	transition_type VARCHAR(100) NOT NULL, 
	notes TEXT, 
	is_default BOOLEAN, 
	PRIMARY KEY (id), 
	FOREIGN KEY(source_role_id) REFERENCES role (id), 
	FOREIGN KEY(target_role_id) REFERENCES role (id)
);
CREATE TABLE feedback (
	id VARCHAR(150) NOT NULL, 
	giver_id VARCHAR(150) NOT NULL, 
	receiver_id VARCHAR(150) NOT NULL, 
	feedback_text TEXT NOT NULL, 
	feedback_date DATE NOT NULL, 
	feedback_type VARCHAR(100) NOT NULL, 
	rating INTEGER, 
	associated_role_id VARCHAR(150), 
	skill_id VARCHAR(150), 
	competency_id VARCHAR(150), 
	private_notes TEXT, 
	action_items TEXT, 
	created_at DATETIME, 
	updated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(associated_role_id) REFERENCES role (id), 
	FOREIGN KEY(competency_id) REFERENCES competency (id), 
	FOREIGN KEY(giver_id) REFERENCES user (id), 
	FOREIGN KEY(receiver_id) REFERENCES user (id), 
	FOREIGN KEY(skill_id) REFERENCES skill (id)
);
CREATE TABLE learning_path (
	id VARCHAR(150) NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	description TEXT, 
	role_id VARCHAR(150), 
	created_by VARCHAR(150), 
	estimated_duration INTEGER, 
	created_at DATETIME, 
	updated_at DATETIME, 
	is_active BOOLEAN, 
	PRIMARY KEY (id), 
	FOREIGN KEY(role_id) REFERENCES role (id)
);
CREATE TABLE project_or_assignment (
	id VARCHAR(150) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	description TEXT, 
	start_date DATE NOT NULL, 
	end_date DATE, 
	status VARCHAR(50) NOT NULL, 
	project_type VARCHAR(100) NOT NULL, 
	budget INTEGER, 
	manager_id VARCHAR(150) NOT NULL, 
	organization_id VARCHAR(150) NOT NULL, 
	associated_role_id VARCHAR(150), 
	created_at DATETIME, 
	updated_at DATETIME, 
	is_active BOOLEAN, 
	PRIMARY KEY (id), 
	FOREIGN KEY(associated_role_id) REFERENCES role (id), 
	FOREIGN KEY(manager_id) REFERENCES user (id), 
	FOREIGN KEY(organization_id) REFERENCES organization (id)
);
CREATE TABLE role_competencies (
	role_id VARCHAR(150) NOT NULL, 
	competency_id VARCHAR(150) NOT NULL, 
	PRIMARY KEY (role_id, competency_id), 
	FOREIGN KEY(competency_id) REFERENCES competency (id), 
	FOREIGN KEY(role_id) REFERENCES role (id)
);
CREATE TABLE user_career_history (
	id INTEGER NOT NULL, 
	user_id VARCHAR(150) NOT NULL, 
	role_id VARCHAR(150) NOT NULL, 
	start_date DATE NOT NULL, 
	end_date DATE, 
	notes TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(role_id) REFERENCES role (id), 
	FOREIGN KEY(user_id) REFERENCES user (id)
);
CREATE TABLE learning_path_resources (
	learning_path_id VARCHAR(150) NOT NULL, 
	learning_resource_id INTEGER NOT NULL, 
	sequence_order INTEGER NOT NULL, 
	PRIMARY KEY (learning_path_id, learning_resource_id), 
	FOREIGN KEY(learning_path_id) REFERENCES learning_path (id), 
	FOREIGN KEY(learning_resource_id) REFERENCES learning_resource (id)
);
