Akara Airlines Job Architecture: User Training Guide (Complete)
This document provides a comprehensive training guide for users interacting with Akara Airlines' Job Architecture Wizard. It explains the purpose of each step, the user flows, and the system's AI-powered functionalities, referencing the visual layout of the tool.

1. Introduction
Akara Airlines leverages a robust Job Architecture framework to strategically define, organize, and manage its talent. This framework is supported by the Job Architecture Wizard, an interactive, multi-step tool designed to guide users through the process of defining the organizational structure, roles, skills, and career paths from the ground up.

2. Navigating the Job Architecture Wizard
The wizard is structured into nine sequential steps, accessible via a navigation bar at the top of the page. Each step must be logically completed to build a coherent and integrated architecture.

Step 1: Define Organization
Purpose: This initial step establishes the highest level of the hierarchy: the organization itself. It serves as the root container for all subsequent structures.

Functionality:

Click the "+ Add Organization" button to create a new entry.

The main screen displays a table of existing organizations with columns for ID, NAME, and DESCRIPTION.

You can edit or delete existing entries using the icons on the right side of the table.

Outcome: A successfully defined organization (e.g., "Akara Airlines") that acts as the foundation for the entire job architecture.

Step 2: Define Business Units
Purpose: After defining the organization, this step breaks it down into its major operational or strategic divisions, known as Business Units.

Functionality:

Click the "+ Add Business Unit" button to create a new division.

The main screen displays a table of existing business units with columns for ID, NAME, DESCRIPTION, and PARENT ORGANIZATION.

This ensures each business unit is clearly linked to the main organization in Step 1.

Examples of Business Units:

Passenger Operations

Cargo Operations

Outcome: A complete map of all primary business units, each linked back to the parent Akara Airlines organization.

Step 3: Define Departments
Purpose: This step involves further subdividing the Business Units into more specific operational Departments.

Functionality:

First, select the parent Business Unit you wish to add a department to.

Click the "+ Add Department" button.

The main screen displays a table of departments within the selected business unit, with columns for ID, DEPARTMENT NAME, and DESCRIPTION.

Example of Department Structure:

Within the Passenger Operations Business Unit, you might create departments like:

Flight Operations Command

Aircraft Engineering

Outcome: A detailed organizational chart showing how departments are nested within business units.

Step 4: Define Role Groups (Job Families)
Purpose: This step focuses on creating logical groupings of similar roles, often referred to as Role Groups or Job Families, which are based on the nature of the work performed.

Functionality:

Click the "+ Add Group" button to create a new Role Group.

The main screen displays a list of the groups you've created (e.g., Flight Operations, Aircraft Maintenance), each with its description, status, and associated family, along with icons to edit or delete it.

Examples of Role Groups:

Pilots

Cabin Crew

Aircraft Maintenance Engineers

Outcome: A well-defined set of Role Groups that will be used to categorize jobs in Step 6.

Step 5: Define Job Levels
Purpose: This critical step establishes the standardized vertical hierarchy for the entire organization, ensuring consistency in seniority and responsibility.

Functionality:

Click the "+ Add Level" button to define a new step in your career ladder.

The main screen displays a list of defined levels (e.g., L1, L2, L3) with their corresponding titles (e.g., Trainee / Apprentice, Junior Staff, Senior Staff).

Each level has icons to allow for editing or deletion.

Outcome: A clear, standardized framework of job levels that underpins career progression. The "Data Validation Issues" in Step 9 will flag any job that is later created without being assigned one of these defined levels.

Step 6: Add Jobs & Map Skills
Purpose: This step is a central hub for defining all aspects of a specific job, consolidating job creation, description, and skill mapping. It features a powerful AI workflow to streamline the creation of job descriptions and ensure alignment with the organization's skill taxonomy.

Core Functionality:

First, select a Role Group (e.g., "Flight Operations") and either select an existing job or click "+ Add Job".

The main content area presents three tabs:

[Tab 1] Basic Information: Define the job's core details (Job Title, Job Level, Department, etc.).

[Tab 2] Job Description: House the detailed narrative of the role. This tab includes the "Generate/Update with AI" button to launch the AI workflow.

[Tab 3] Skills Mapping: View, add, or edit the skills required for the job and set their proficiency levels.

AI-Powered Job Generation Workflow:

Initiating AI Generation: From the Job Description tab, click “Generate/Update with AI”. This redirects you to the AI page (/create_with_ai.html), passing a ?source=job-architecture parameter in the URL to track your origin.

Conditional AI Page: On the AI page, the system detects the source parameter.

The main call-to-action button is dynamically labeled “Save & Return to Job Architecture”.

Clicking this button routes you back to the exact spot in the Step 6 Job Description tab.

Job Information Overwrite on Return: When you return, the wizard is automatically updated with the AI-generated content. This includes Job Title, Requisition ID, Department, Business Unit, Job Level, Salary Range, Hiring Manager, Job Summary (mapped to Role Summary), and other available content like Responsibilities and Qualifications.

Skills Categorization and Display: In the Skills Mapping tab, skills from the AI tool are automatically categorized:

Existing Skills: Skills already in the internal taxonomy appear in the standard "Skills for..." list.

AI Suggested Skills: New skills not found in the taxonomy appear in a separate “AI Suggested Skills” section, prompting you for review. Each suggested skill includes a proficiency level, a description, and a “Map to Ontology” button.

Mapping to Ontology and Competencies: Clicking “Map to Ontology” for a suggested skill opens a tool where you can:

Link the new skill to an existing one in the official ontology.

Or, create a new entry for the skill in the taxonomy.

You can also map the skill to broader competencies and capabilities to ensure alignment with talent and performance frameworks.

Step 7: Analyze Skill Gaps
Purpose: This analytics step allows you to compare the required skills for a specific job against the organization's current skill inventory to identify critical gaps.

Functionality:

Select a job title from the "Select Job for Analysis" dropdown (e.g., "Senior Marketing Manager").

The "Skill Gap Analysis Details" card will automatically populate with three key sections:

Required Skills for Job: A list of skills and proficiency levels defined for the selected role.

Identified Skill Gaps: Highlights any required skills for the job that are not currently present in the organization's talent pool.

Skills Present in Organization: Shows which skills the organization possesses that meet or exceed the job's requirements, confirming existing capabilities.

Step 8: Visualize Career Paths
Purpose: This step enables you to map and illustrate potential career progression routes for different roles, providing clarity for employees and managers.

Functionality:

Select a starting job title from the "Select Job to View Paths" dropdown (e.g., "Captain (A320 Type Rated)").

The interface dynamically displays the potential career moves for the selected role, categorized into:

Vertical Progression: Shows direct promotional paths to more senior roles (e.g., from Captain to "Chief Pilot").

Lateral Moves: Displays opportunities for cross-functional or similar-level roles that allow for skill diversification (e.g., from an A320 Captain to "Captain (A350)," "Simulator Instructor," or "Flight Safety Officer").

Step 9: Review & AI - Strategic Dashboard
Purpose: This final step provides a comprehensive overview of your entire job architecture, offering a central place for validation, strategic review, and AI-driven recommendations.

Functionality: The dashboard is split into two main sections:

Wizard Progress Checklist: On the left, this section displays the completion status (e.g., "Complete," "In Progress," "Not Started") of each of the previous eight steps, allowing you to quickly see what work remains.

AI-Powered Insights & Suggestions: On the right, the AI engine analyzes your architecture and provides strategic recommendations, such as:

Strategic Alignment: Identifying areas where more roles may be needed.

Skill Gap Concentration: Highlighting emerging skill needs based on AI suggestions.

Career Path Bottlenecks: Pointing out roles with limited growth opportunities.

Inconsistent Job Titling: Flagging similar roles with different titles across departments.

High-Value Role Development: Suggesting specialized training for critical roles.

Data Validation Issues: Located below the main dashboard, this section lists specific errors or omissions that need correction, categorized by priority. Each issue includes an actionable link to the relevant step for correction (e.g., Fix Issue (Step 5)).