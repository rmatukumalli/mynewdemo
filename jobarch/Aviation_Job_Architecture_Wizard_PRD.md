# Product Requirements Document: Aviation Job Architecture Wizard

## 1.0 Introduction and Vision

**1.1 Introduction**

The Aviation Job Architecture Wizard is a comprehensive digital tool designed to streamline and standardize the process of creating, defining, and managing job roles within the aviation industry. It guides users through a structured, step-by-step process to build a robust job architecture, from defining organizational structures to mapping specific skills and competencies to individual roles.

**1.2 Vision**

To become the leading solution for aviation organizations to meticulously design, analyze, and evolve their job architectures, ensuring clear role definitions, consistent leveling, transparent career pathways, and alignment with industry best practices and skill demands. The wizard aims to empower HR professionals, department heads, and compensation analysts to build a future-ready workforce.

**1.3 Problem Statement**

Defining job roles and architectures in the complex and highly regulated aviation industry is often a manual, time-consuming, and inconsistent process. This can lead to:

*   Ambiguous role definitions and responsibilities.
*   Inconsistent job leveling and compensation structures.
*   Difficulty in identifying skill gaps and planning for future talent needs.
*   Lack of clear career progression paths for employees.
*   Challenges in aligning job roles with evolving industry standards and technological advancements.
*   Inefficient use of HR resources in managing job data.

The Aviation Job Architecture Wizard aims to solve these problems by providing a centralized, intuitive, and data-driven platform.

## 2.0 Goals and Objectives

**2.1 Goals**

*   **Standardization:** Establish a consistent and standardized approach to defining job roles and architectures across the organization.
*   **Efficiency:** Significantly reduce the time and effort required to create, update, and manage job descriptions and architectures.
*   **Clarity:** Provide clear, detailed, and easily accessible information about each job role, including responsibilities, skills, and competencies.
*   **Alignment:** Ensure job roles are aligned with organizational structure, business unit objectives, and industry skill requirements.
*   **Data-Driven Decisions:** Enable data-informed decisions related to talent management, compensation, skill development, and workforce planning.

**2.2 Objectives (Measurable)**

*   Reduce the average time to create a new job profile by 50% within 6 months of full adoption.
*   Achieve 90% consistency in job leveling across similar roles within 12 months.
*   Improve user satisfaction scores for job architecture processes by 30% (measured via internal surveys) within 12 months.
*   Enable the mapping of critical skills for 80% of defined job roles within 9 months.
*   Successfully integrate with at least one major HRIS platform within 18 months.

## 3.0 Target Audience

**3.1 Primary User Personas**

*   **HR Business Partners (HRBPs):**
    *   **Needs:** Efficiently create and update job descriptions, ensure consistency in roles within their business units, advise managers on job design and leveling, facilitate career path discussions.
    *   **Pain Points:** Time-consuming manual processes, lack of standardized templates, difficulty comparing roles across departments.
*   **Compensation Analysts:**
    *   **Needs:** Access to accurate job leveling information, consistent skill and competency data for market pricing, ability to analyze internal equity.
    *   **Pain Points:** Inconsistent job data, difficulty in matching internal roles to external benchmarks, manual data collection for compensation surveys.
*   **Department Heads / Hiring Managers:**
    *   **Needs:** Clearly define roles for their teams, articulate required skills and experience for new hires, understand how roles fit into the broader organization, identify skill gaps.
    *   **Pain Points:** Writing job descriptions from scratch, uncertainty about appropriate job levels, lack of visibility into skills required for future projects.

**3.2 Secondary User Personas**

*   **Recruiters:**
    *   **Needs:** Access to well-defined job descriptions and skill requirements to source and attract qualified candidates.
    *   **Pain Points:** Vague or inconsistent job descriptions leading to poor candidate fit.
*   **Learning & Development Specialists:**
    *   **Needs:** Understand skill requirements for roles to design targeted training programs, identify common skill gaps.
    *   **Pain Points:** Lack of clear data on required skills across the organization.
*   **Employees:**
    *   **Needs (Indirect):** Clear understanding of their roles, required skills, and potential career paths within the organization.
    *   **Pain Points (Indirect):** Ambiguity about career progression, unclear expectations for skill development.

## 4.0 Feature Requirements

**4.1 Initial Setup and Configuration**

*   **FR4.1.1 Organization Definition:**
    *   Ability to define the primary organization (e.g., Airline Name).
    *   Fields: Organization ID (auto-generated), Name, Description.
    *   CRUD operations for organizations.
*   **FR4.1.2 Business Unit Definition:**
    *   Ability to define business units within an organization.
    *   Fields: BU ID (auto-generated), Name, Description, Parent Organization ID.
    *   CRUD operations for business units.
*   **FR4.1.3 Department Definition:**
    *   Ability to define departments within business units.
    *   Fields: Department ID (auto-generated), Name, Description, Parent Business Unit ID.
    *   CRUD operations for departments.
*   **FR4.1.4 Job Level Definition:**
    *   Ability to define standardized job levels (e.g., L1-L5, Trainee, Senior, Manager).
    *   Fields: Level ID (auto-generated), Name (e.g., "L1"), Description, Level Type (e.g., "global", "technical_track"), Core Competencies (link to competency IDs with expected proficiency), Salary Band ID (optional text field), Progression To (link to other Level IDs).
    *   CRUD operations for job levels.
*   **FR4.1.5 Skills Ontology Management (Admin Interface - Future Consideration, for now pre-loaded):**
    *   Pre-loaded, hierarchical skills ontology consisting of:
        *   **Capabilities:** Top-level skill areas (e.g., "Flight Operations"). Fields: ID, Name, Description.
        *   **Competencies:** Specific areas within capabilities (e.g., "Flight Planning"). Fields: ID, Name, Description, Capability ID, Behaviours (array of descriptive strings).
        *   **Skills:** Granular skills linked to competencies. Fields: ID, Name, Definition, Competency ID, Type (e.g., "Specialist Skill", "Tool & Technology"), Proficiency Levels (array of {level: number, name: string, descriptor: string}).
    *   (Future) Admin interface to manage (CRUD) capabilities, competencies, and skills.

**4.2 Step-by-Step Wizard Functionality**

*   **FR4.2.1 Stepper Navigation:**
    *   Visual stepper indicating current step, completed steps, and upcoming steps.
    *   Steps: 1. Organization, 2. Business Unit, 3. Department, 4. Role Groups, 5. Job Levels, 6. Add Jobs & Map Skills, 7. Skill Gaps (Future), 8. Career Paths (Future), 9. Review & AI.
    *   Ability to navigate to previous/next steps.
    *   Ability to click on stepper items to navigate to specific (visited/accessible) steps.
*   **FR4.2.2 Step 1: Organization:**
    *   Display existing organizations in a table.
    *   Button to "Add Organization" (opens modal as per FR4.1.1).
    *   Edit/Delete options for existing organizations.
*   **FR4.2.3 Step 2: Business Units:**
    *   Display existing business units in a table, showing parent organization.
    *   Button to "Add Business Unit" (opens modal as per FR4.1.2, requires selecting parent organization).
    *   Edit/Delete options for existing business units.
*   **FR4.2.4 Step 3: Departments:**
    *   Display existing departments, grouped by Business Unit, in tables.
    *   Button to "Add Department" (opens modal as per FR4.1.3, requires selecting parent business unit).
    *   Edit/Delete options for existing departments.
*   **FR4.2.5 Step 4: Role Groups:**
    *   Ability to define logical groupings of jobs (e.g., "Flight Crew," "Maintenance Engineers").
    *   Fields: Group ID (auto-generated), Name, Description, Department ID, Status (e.g., "active", "draft"), Job Family (text), Tags (array of strings), AI Suggested (boolean), Benchmark Data ({source: string, reference: string}).
    *   Display existing role groups as cards/list items.
    *   Button to "Add Group" (opens modal).
    *   Edit/Delete options for existing role groups.
*   **FR4.2.6 Step 5: Job Levels:**
    *   Display existing job levels as cards/list items (as per FR4.1.4).
    *   Button to "Add Level" (opens modal).
    *   Edit/Delete options for existing job levels.
*   **FR4.2.7 Step 6: Add Jobs & Map Skills:**
    *   **Job Selection Pane:**
        *   Display role groups.
        *   For each role group, list existing jobs (Title, Level).
        *   Button within each role group to "Add Job to Group" (opens modal for job creation - see FR4.3.1).
        *   Ability to select a job to view/edit its details and skills.
    *   **Job Details Pane (Tabbed Interface):**
        *   **Tab 1: Basic Information:**
            *   Fields: Job Title (editable), Job Family (editable, AI Assist button), Suggested Job Level (pre-selected from Job Levels defined in Step 5, editable), Department (editable, AI Assist button), Work Location (editable, AI Assist button), Requisition ID (read-only, populated from AI tool or manual entry in modal), Employment Type (read-only, populated from AI tool or manual entry in modal), Business Unit (editable, AI Assist button).
            *   "AI Assist" button for specified fields: Triggers navigation to an external AI content generation tool (`create_with_ai.html`), pre-filling current job data.
        *   **Tab 2: Role Group & Level Name:**
            *   Fields: Role Group (text, editable, AI Assist button), Role Level Name (text, e.g., "Senior Captain - A350", editable, AI Assist button).
        *   **Tab 3: Job Description:**
            *   Fields: Role Summary (textarea, editable), Responsibilities (textarea, editable), Years of Experience (text, editable), Additional Qualifications (textarea, read-only, populated from AI tool), Benefits (textarea, read-only, populated from AI tool), Salary Range Min/Max (number, read-only, populated from AI tool), Hiring Manager (text, read-only, populated from AI tool), Recruiter (text, read-only, populated from AI tool).
            *   "Generate/Update with AI" button: Collects all current job data and navigates to `create_with_ai.html` for AI-powered generation/update of the job description content.
        *   **Tab 4: Skills Mapping:**
            *   Display currently mapped skills (Capability, Competency, Skill Name, Definition, Proficiency Level).
            *   Ability to change proficiency level for a mapped skill.
            *   Ability to remove a mapped skill from the job.
            *   "Add Skill" button: Opens the Skill Navigator modal (see FR4.2.8).
            *   Display "Raw AI Skills" (skills suggested by AI writer but not yet in ontology) with their AI-suggested proficiency.
            *   "Map to Ontology" button for each Raw AI Skill:
                *   Attempts direct name match in ontology. If found, adds to job skills with mapped proficiency and removes from raw list.
                *   If not found, opens Skill Navigator pre-filled with the raw skill name for manual mapping.
    *   **FR4.2.8 Skill Navigator Modal (for "Add Skill" and "Map to Ontology"):**
        *   Multi-step modal interface:
            *   Step 1: Select Capability (searchable list of capabilities from ontology).
            *   Step 2: Select Competency (checkbox list of competencies under selected capabilities).
            *   Step 3: Select Behaviors (checkbox list of behaviors under selected competencies).
            *   Step 4: Select Skills & Proficiency (list of skills under selected competencies; for each skill, allow selection of proficiency level 1-5). If opened for "Map to Ontology", attempt to pre-select matching skill and proficiency.
            *   Step 5: Review & Save (summary of all selected capabilities, competencies, behaviors, and skills with proficiency).
        *   Navigation: Back, Next, Save.
        *   Save action adds selected skills (with proficiency) and behaviors to the current job. If mapping a raw AI skill, successful mapping removes it from the raw list.
*   **FR4.2.9 Step 7: Skill Gaps (Future Consideration):**
    *   Placeholder UI indicating "Coming Soon: Skill Gap Analysis".
    *   (Future) Functionality to compare required job skills against employee skill profiles (requires employee data integration).
*   **FR4.2.10 Step 8: Career Paths (Future Consideration):**
    *   Placeholder UI indicating "Coming Soon: Career Path Mapping".
    *   (Future) Functionality to visually connect job roles to illustrate progression paths, based on job levels and skill overlaps.
*   **FR4.2.11 Step 9: Review & AI Insights:**
    *   Summary view of the defined job architecture (Role Groups and their Jobs with key details like level and mapped skills).
    *   Placeholder for AI-Powered Insights (e.g., succession risk, hiring priority).

**4.3 Data Input and Validation Rules**

*   **FR4.3.1 Job Creation/Editing Modal (triggered from Step 6):**
    *   Fields: Job Title (required), Level (dropdown, from defined Job Levels, required), Role Summary, Responsibilities, Years of Experience, Job Family, Department, Work Location, Business Unit, Role Group (text), Role Level Name (text), Requisition ID, Employment Type, Salary Min/Max, Hiring Manager, Recruiter, Additional Qualifications, Benefits.
    *   Skills are added/edited via the Job Details Pane (Skills Mapping tab) after initial job creation.
*   **FR4.3.2 Required Fields:** Indicated with an asterisk (*). Form submission should be blocked if required fields are empty.
*   **FR4.3.3 Data Type Validation:** Basic validation for data types (e.g., numbers for salary).
*   **FR4.3.4 URL Parameter Handling for AI Tool Interaction:**
    *   The wizard can receive job data updates via URL parameters (e.g., `action=updateJobFromAI`, `groupId`, `jobId`, and various job fields).
    *   It should parse these parameters, map AI tool field names (e.g., `jobSummary` to `roleSummary`, `skills` string to structured skill objects) and update the corresponding job in its state.
    *   Skill strings from AI (e.g., "SkillA (Intermediate); SkillB (Advanced)") should be parsed:
        *   Skill names matched against the ontology. If found, map to `job.skills` with appropriate proficiency.
        *   If not found, add to `job.rawAiSkills` with the AI-provided proficiency name.
    *   Job Level from AI (descriptive, e.g., "Senior Manager") should be mapped to the wizard's L1-L5 format.
    *   Ability to navigate to a specific step via URL parameter (e.g., `step=6`).

**4.4 Role and Permission Management (Future Consideration)**

*   **FR4.4.1 User Roles:** Define roles (e.g., Admin, HRBP, Manager).
*   **FR4.4.2 Permissions:** Assign permissions to roles for accessing/editing different parts of the wizard or data.

**4.5 Analytics and Reporting Dashboards (Future Consideration)**

*   **FR4.5.1 Job Architecture Overview:** Dashboard showing counts of roles, levels, skill distribution.
*   **FR4.5.2 Skill Gap Reports:** Reports highlighting discrepancies between required and available skills.
*   **FR4.5.3 Custom Reporting:** Ability to generate custom reports based on job architecture data.

**4.6 Integration Points with Other Systems**

*   **FR4.6.1 HRIS Integration (Future Consideration):**
    *   Ability to pull basic employee and existing job data from an HRIS.
    *   Ability to push finalized job descriptions/architectures to an HRIS.
    *   Requires API-based integration.
*   **FR4.6.2 AI Content Generation Tool (`create_with_ai.html`):**
    *   Wizard navigates to this external tool, passing current job data as URL parameters.
    *   The AI tool processes the data, allows user interaction for AI content generation, and then navigates back to the wizard with updated job data in URL parameters.
    *   The wizard must be able to parse these return parameters and update its internal state.

**4.7 Data Import/Export**

*   **FR4.7.1 Basic Import/Export Page (`import-export/index.html`):**
    *   Provides functionality to import and export job architecture data (likely in JSON format).
    *   This allows for backup, sharing, and bulk updates.

## 5.0 Dependencies

**5.1 Internal Dependencies**

*   **Skills Ontology Data (`data/skillsOntology.js`):** The wizard relies on this pre-defined data for capabilities, competencies, and skills.
*   **AI Content Generation Tool (`create_with_ai.html`):** External HTML/JS application responsible for AI-assisted content generation. The wizard depends on its availability and correct parameter handling for redirection.
*   **Web Hosting Environment:** A stable environment to host the HTML, CSS, and JavaScript files.

**5.2 External Dependencies**

*   **Tailwind CSS CDN:** For styling.
*   **Google Fonts (Inter):** For typography.
*   **(Future) HRIS API:** For integration, specific API endpoints and authentication mechanisms will be required.
*   **(Future) Analytics Platform API:** If advanced analytics are integrated.

## 6.0 Assumptions

*   Users will have a modern web browser with JavaScript enabled.
*   The initial skills ontology is comprehensive enough for initial use cases in the aviation sector.
*   The `create_with_ai.html` tool is functional and correctly handles parameter passing to and from the wizard.
*   Users have a basic understanding of job architecture principles.
*   For AI-assisted features, users understand that AI suggestions may require review and refinement.
*   The primary focus for the initial version is the structured creation and definition of job roles and their associated skills. Advanced analytics, full HRIS integration, and complex role/permission management are future considerations.

## 7.0 Risks and Mitigations

| Risk ID | Risk Description                                                                 | Likelihood | Impact | Mitigation Plan                                                                                                                               |
| :------ | :------------------------------------------------------------------------------- | :--------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| R01     | Skill ontology is not comprehensive or becomes outdated quickly.                 | Medium     | High   | Implement a process for regular review and update of the ontology. (Future: Allow admin users to manage the ontology directly in the tool).      |
| R02     | AI content generation tool (`create_with_ai.html`) has bugs or usability issues. | Medium     | Medium | Thorough testing of the AI tool integration. Clear error handling and user guidance if the AI tool fails or returns unexpected results.         |
| R03     | Users find the multi-step wizard complex or difficult to navigate.               | Low        | Medium | User testing during development. Clear UI/UX design with intuitive navigation, progress indicators, and contextual help/tooltips.                 |
| R04     | Data integrity issues if users input incorrect or inconsistent information.        | Medium     | Medium | Implement robust input validation. Provide clear guidance and examples for data entry. (Future: Approval workflows).                          |
| R05     | Scope creep leading to delays in delivering core functionality.                  | Medium     | High   | Strictly adhere to the defined feature set for the initial release. Defer non-essential features to future iterations. Regular stakeholder reviews. |
| R06     | Difficulty in integrating with diverse HRIS systems (future).                    | High       | High   | Plan for flexible integration architecture. Start with a common standard (e.g., REST API, standard data formats). Pilot with one HRIS first.     |
| R07     | Performance issues when handling large amounts of job data.                      | Low        | Medium | Optimize data handling and rendering in JavaScript. Consider pagination or virtual scrolling for long lists if performance becomes an issue.        |

## 8.0 Out of Scope / Future Considerations

**8.1 Out of Scope (Initial Release)**

*   Advanced Role-Based Access Control (RBAC) and permission management.
*   Workflow and approval processes for job creation/modification.
*   Direct, real-time, two-way integration with HRIS systems (beyond the AI tool interaction which is one-way data passing via URL).
*   Comprehensive analytics and reporting dashboards (beyond the basic review in Step 9).
*   Employee skill inventory and direct skill gap analysis against employees.
*   Automated career path generation based on full employee data.
*   Multi-language support.
*   User-configurable skills ontology directly within the wizard (ontology is pre-loaded).

**8.2 Future Considerations**

*   **Enhanced AI Capabilities:**
    *   AI-powered suggestions for skill mapping based on job descriptions.
    *   AI-driven analysis of job architecture consistency and identification of potential overlaps or gaps.
    *   AI-suggested career paths.
*   **Full HRIS Integration:**
    *   Automated synchronization of job data with HRIS platforms.
    *   Pulling employee skill data for gap analysis.
*   **Advanced Analytics & Reporting:**
    *   Customizable dashboards and reports.
    *   Benchmarking against industry data.
*   **Workflow & Approvals:**
    *   Configurable approval workflows for new or modified job roles.
*   **User Management & Permissions:**
    *   Granular control over user access and editing rights.
*   **Ontology Management Interface:**
    *   Allowing administrators to directly manage and extend the skills ontology within the tool.
*   **Bulk Data Management:**
    *   Enhanced import/export capabilities with data validation and mapping for bulk operations.
*   **Collaboration Features:**
    *   Allowing multiple users to collaborate on defining job architectures.
