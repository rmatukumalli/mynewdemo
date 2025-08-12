## Functional Specification Document: Aviation Job Architecture Wizard

**1. Introduction**

The Aviation Job Architecture Wizard is a web-based application designed to help HR professionals, department heads, and organizational planners define, manage, and analyze job roles within an organization, specifically tailored for (or adaptable to) the aviation industry. The wizard guides users through a multi-step process to create a structured job architecture, including defining role groups, job levels, specific job details, and mapping skills with defined proficiency levels. The system incorporates AI assistance for content generation and insights.

**2. Goals**

*   To provide a centralized platform for creating and managing a comprehensive job architecture.
*   To standardize job roles, levels, and skill requirements across the organization.
*   To facilitate efficient job description creation and updates with AI assistance.
*   To enable structured skill mapping to jobs using a defined ontology.
*   To lay the foundation for future talent management processes like skill gap analysis, career pathing, and strategic workforce planning.
*   To allow for data import/export for interoperability and backup.

**3. Target Users**

*   HR Business Partners
*   Compensation & Benefits Specialists
*   Organizational Development Managers
*   Hiring Managers
*   Department Heads

**4. Overall Feature Breakdown (Wizard Steps & Core Functionalities)**

The wizard is structured into several steps, each focusing on a specific aspect of job architecture.

**4.1. Core Application Shell & Navigation**
    *   **Description:** The main application interface that hosts the wizard. Includes a header with branding, navigation links (Import/Export, Guide, Home), a stepper component to show progress and allow navigation between steps, a content area for the current step, and navigation buttons (Back, Next, Finish & Save).
    *   **User Goal:** To easily navigate the wizard, understand their progress, and access related resources.
    *   **UI/UX:**
        *   Clear visual hierarchy.
        *   Stepper indicates active, completed, and pending steps. Stepper items are clickable for direct navigation.
        *   "Back" button disabled on the first step. "Next" button changes to "Finish & Save" on the last step.
    *   **Business Logic:** Manages current step state, enables/disables navigation based on context.

**4.2. Step 1: Define Role Groups**
    *   **Description:** Allows users to create and manage logical groupings of jobs (e.g., "Flight Operations," "Aircraft Maintenance," "Ground Services").
    *   **User Goal:** To categorize jobs into functional areas or families.
    *   **Functionality:**
        *   View a list of existing role groups.
        *   Add a new role group via a modal, specifying:
            *   Name (Required)
            *   Description
            *   Status (e.g., Active, Draft)
            *   Job Family (Text input)
            *   Tags (Multi-select or comma-separated input)
            *   Benchmark Data (Source, Reference - optional)
        *   Edit an existing role group's details via a modal.
        *   Delete a role group (with confirmation).
        *   Display if a group was "AI Suggested."
    *   **UI/UX:** List view for groups, "Add Group" button, Edit/Delete icons per group. Modal for add/edit.
    *   **Business Logic:** CRUD operations for role groups. Validation for required fields.
    *   **Edge Cases:** Deleting a group with jobs (requires confirmation, may orphan jobs or require job reassignment - current behavior seems to allow deletion without explicit job handling).

**4.3. Step 2: Define Job Levels**
    *   **Description:** Allows users to establish standardized career levels within the organization (e.g., L1, L2, L3, L4, L5).
    *   **User Goal:** To create a consistent framework for job hierarchy, compensation, and career progression.
    *   **Functionality:**
        *   View a list of existing job levels.
        *   Add a new job level via a modal, specifying:
            *   Name (e.g., "L1", "L2") (Required)
            *   Description (e.g., "Trainee / Apprentice," "Senior Staff / Officer")
            *   Level Type (e.g., "Global," "Local" - currently hardcoded as 'global')
            *   Core Competencies (Link to competencies from ontology with expected proficiency - current UI shows count)
            *   Salary Band ID (Text input)
            *   Progression To (Link to other job levels)
        *   Edit an existing job level's details via a modal.
        *   Delete a job level (with confirmation).
    *   **UI/UX:** List view for levels, "Add Level" button, Edit/Delete icons per level. Modal for add/edit.
    *   **Business Logic:** CRUD operations for job levels. Validation for required fields.
    *   **Edge Cases:** Deleting a level used by jobs (requires confirmation, impact analysis).

**4.4. Step 3: Add Jobs & Map Skills**
    *   **Description:** The core step where users define specific job roles, populate their details (optionally with AI assistance), and map skills from the ontology.
    *   **User Goal:** To create detailed job profiles with clearly defined responsibilities and skill requirements.
    *   **Sub-Features:**
        *   **4.4.1. Job Selection & Creation:**
            *   **Description:** Users can select an existing job from a list (grouped by Role Group) or add a new job to a specific Role Group.
            *   **User Goal:** To easily find and manage individual job entries.
            *   **UI/UX:** Two-panel layout. Left panel lists jobs under their role groups. "Add Job to Group" button per group. Selected job is highlighted.
            *   **Functionality:**
                *   Adding a new job opens a modal (likely the main item modal) to input initial job details (Title, Level, associated Role Group).
        *   **4.4.2. Job Details Management (Tabbed Interface):**
            *   **Description:** Displays and allows editing of the selected job's details in a tabbed view.
            *   **User Goal:** To comprehensively define all aspects of a job role.
            *   **Tabs & Fields:**
                *   **Basic Information:** Job Title (readonly after AI update/initial creation), Job Family (editable, AI Assist), Suggested Job Level (readonly), Department (editable, AI Assist), Work Location (editable, AI Assist), Requisition ID (readonly), Employment Type (readonly), Business Unit (editable, AI Assist).
                *   **Role Group & Level Name:** Role Group (text, editable, AI Assist), Role Level Name (text, editable, AI Assist).
                *   **Job Description Content:** Role Summary (textarea, editable, AI Assist), Responsibilities (textarea, editable, AI Assist), Years of Experience (text, editable, AI Assist), Additional Qualifications (readonly textarea), Benefits (readonly textarea), Salary Min/Max (readonly numbers), Hiring Manager (readonly text), Recruiter (readonly text).
                *   **Skills Mapping:** (Described in 4.4.3)
            *   **"AI Assist" Functionality:** For designated fields, an "AI Assist" button redirects the user to an external AI writer tool (`create_with_ai.html`). The current job data is passed as URL parameters. The AI writer tool is expected to allow content generation/editing and then redirect back to the wizard, populating the fields via URL parameters (`action=updateJobFromAI`).
            *   **UI/UX:** Clear tab navigation. Input fields, textareas. "AI Assist" buttons next to relevant fields. Readonly fields are visually distinct or disabled.
            *   **Business Logic:** Updates job object in global state on field changes. Handles redirection for AI Assist.
        *   **4.4.3. Skill Mapping:**
            *   **Description:** Allows users to associate skills from the defined Skill Ontology with the selected job and set required proficiency levels. Also displays "Raw AI Skills."
            *   **User Goal:** To define the precise skill set and proficiency needed for a job.
            *   **UI/UX:**
                *   "Add Skill" button opens a multi-step modal.
                *   **Skill Modal:**
                    *   Step 1: Select Capability.
                    *   Step 2: Select Competency (filtered by selected Capability).
                    *   Step 3: Select Skills (filtered by selected Competency) & set Proficiency. Skills already in the job are marked. Users "stage" skills before adding.
                    *   Modal includes Back/Next/Cancel/Add Staged Skills buttons. Breadcrumbs show modal progress.
                *   **Mapped Skills Display:** Lists skills associated with the job, showing Capability > Competency hierarchy, skill name, definition, skill type (pill), and proficiency selectors. "Remove Skill" button per skill.
                *   **Raw AI Skills Display:** Lists skills suggested by the AI writer but not yet mapped to the ontology. Shows skill name and AI-suggested proficiency (currently readonly).
            *   **Functionality:**
                *   Add skills to job from ontology via modal.
                *   Remove skills from job.
                *   Update proficiency level for an existing skill on the job.
                *   Store and display raw AI skills.
            *   **Business Logic:** Modifies the `skills` array (and `rawAiSkills`) on the job object. Uses `localState` for modal operations.
            *   **Constraints:** Skills are drawn from the `skillsOntology.js`. Proficiency levels are defined per skill in the ontology.

**4.5. Step 4: Analyze Skill Gaps (Planned)**
    *   **Description:** Intended to compare required job skills (defined in Step 3) against employee capabilities or a talent pool.
    *   **User Goal:** To identify skill shortages or surpluses within the organization.
    *   **Current Status:** Placeholder "Coming Soon."
    *   **Potential Functionality:** Data input for employee skills, comparison algorithms, visualization of gaps.
    *   **Dependencies:** Completed job definitions with skills (Step 3), Skill Ontology, Employee skill data (external or new module).

**4.6. Step 5: Visualize Career Paths (Planned)**
    *   **Description:** Intended to allow users to map potential career progression routes between different job roles and levels.
    *   **User Goal:** To create clear and transparent career ladders for employees.
    *   **Current Status:** Placeholder "Coming Soon."
    *   **Potential Functionality:** Visual tool to link jobs, define progression criteria, display path options.
    *   **Dependencies:** Completed job definitions (Step 3), Defined job levels (Step 2).

**4.7. Step 6: Review & AI-Powered Insights**
    *   **Description:** Provides a final overview of the constructed job architecture and offers AI-driven strategic recommendations.
    *   **User Goal:** To review the complete architecture and gain actionable insights.
    *   **UI/UX:**
        *   Summary display of role groups and their jobs (title, level, skills count).
        *   Dedicated section for "AI-Powered Insights" (currently placeholders like "Succession Risk," "Hiring Priority").
    *   **Functionality:** Consolidates and displays data from previous steps. AI insights are currently static.
    *   **Business Logic:** Reads data from `globalState`.
    *   **Potential Enhancements:** Dynamic AI insights based on the created architecture (e.g., identifying roles with overlapping skills, suggesting new job levels based on skill density).

**4.8. Skill Ontology Management**
    *   **Description:** The underlying data structure (`skillsOntology.js`) defining capabilities, competencies, skills, and their proficiency levels.
    *   **User Goal:** (Implicit) To have a standardized and comprehensive list of skills to use for job architecture.
    *   **Current Status:** Data is hardcoded in `skillsOntology.js`. No UI for managing the ontology itself within this wizard.
    *   **Potential Enhancements:** A separate admin interface or feature to manage (CRUD) capabilities, competencies, and skills, including their definitions and proficiency levels. Mechanism to map "Raw AI Skills" into the formal ontology.

**4.9. Data Import/Export**
    *   **Description:** A separate feature (linked from the header, `import-export/index.html`) allowing users to import or export their job architecture data.
    *   **User Goal:** To backup data, share it, or integrate with other systems.
    *   **Functionality:**
        *   Export current job architecture (role groups, levels, jobs, skills) likely as a JSON file.
        *   Import a previously exported JSON file to populate or overwrite the wizard's data.
    *   **UI/UX:** Simple interface with "Import" and "Export" buttons, file selection for import.
    *   **Business Logic:** JSON serialization/deserialization. State update on import.
    *   **Constraints:** Relies on a specific JSON structure. Error handling for malformed import files.

**4.10. AI-Assisted Job Data Population (Initial Load)**
    *   **Description:** The wizard can receive job data via URL parameters (triggered by `action=updateJobFromAI`) from an external tool (e.g., AI job description writer).
    *   **User Goal:** To quickly populate or update job details using AI-generated content without manual entry.
    *   **Functionality:**
        *   Parses URL parameters for `groupId`, `jobId`, and various job fields (title, summary, skills, etc.).
        *   Maps AI-provided job levels and skills to the wizard's internal format/ontology.
        *   Stores unmapped skills from AI as `rawAiSkills`.
        *   Updates the relevant job in `globalState`.
        *   Navigates the user to Step 3 to view the updated job.
        *   Cleans URL parameters after processing.
    *   **Business Logic:** Resides in `main.js`. Involves data transformation and state updates.
    *   **Dependencies:** External AI tool that can redirect back to the wizard with the correct URL parameters.

**5. Non-Functional Requirements**

*   **Usability:** Intuitive and easy-to-use interface, especially for non-technical HR users. Clear guidance through steps.
*   **Performance:** Application should load and respond quickly, especially when handling lists of jobs or skills. Modal operations should be smooth.
*   **Scalability:** Should be able to handle a reasonable number of role groups, job levels, jobs, and skills (e.g., hundreds of jobs, thousands of skills in ontology).
*   **Data Integrity:** Ensure data consistency, especially when linking jobs to groups/levels and skills to jobs.
*   **Browser Compatibility:** Modern web browsers (Chrome, Firefox, Edge, Safari).
*   **Accessibility:** Adherence to basic web accessibility standards.

**6. Future Considerations / Potential Enhancements**

*   Full implementation of Skill Gap Analysis (Step 4).
*   Full implementation of Career Path Visualization (Step 5).
*   Workflow for approving/publishing job descriptions.
*   Role-based access control if multiple users are involved.
*   Integration with HRIS or ATS systems.
*   Advanced AI insights and recommendations in Step 6.
*   A dedicated UI for managing the Skill Ontology (CRUD for capabilities, competencies, skills).
*   Mechanism to formally map `rawAiSkills` into the ontology or create new skills from them.
*   Versioning of job architectures.
*   Reporting and analytics on the job architecture data.
