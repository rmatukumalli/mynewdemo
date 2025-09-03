# Product Requirements Document: Job Architecture Wizard

## 1. Introduction

This document outlines the functionality and technical requirements for the Job Architecture Wizard, a web-based tool designed to guide users through defining, organizing, and managing an organization's roles, skills, and career paths. This wizard provides a structured, step-by-step approach to building a comprehensive job architecture, with features for data entry, editing, and visualization.

## 2. Goals

*   **Streamline Job Architecture Definition:** Provide a user-friendly interface to define organizational structures (organizations, business units, departments), job groupings (job families, role groups), and job levels.
*   **Centralize Skill Management:** Integrate skill definitions and proficiency levels into job profiles.
*   **Facilitate Career Pathing:** Enable the creation and visualization of potential career progression paths based on defined job levels and skills.
*   **Support Data Management:** Allow users to add, edit, and delete architectural components.
*   **Provide AI-Powered Insights (Future/Planned):** Incorporate AI capabilities for suggestions, gap analysis, and review processes.

## 3. Scope

The current scope covers the front-end functionality of the Job Architecture Wizard, including the multi-step navigation, data input/display for various architectural components, and client-side data management using mock data. Backend integration for persistent storage and actual AI processing is outside the immediate scope but will be considered for future phases.

## 4. User Stories

*   As an HR Administrator, I want to define my company's organizational structure (Business Units, Departments) so that I can accurately categorize jobs.
*   As an HR Administrator, I want to create and manage Job Families and Role Groups to organize similar jobs.
*   As an HR Administrator, I want to define Job Levels with associated responsibilities, salary ranges, and skill levels so that I can establish clear career progression.
*   As an HR Administrator, I want to view and edit existing organizational data easily to keep the job architecture up-to-date.
*   As an HR Administrator, I want to see potential career paths for a given job level to help employees plan their development.
*   As an HR Administrator, I want to search and filter job levels by various criteria (Business Unit, Department, Role Group) to quickly find relevant information.
*   As an HR Administrator, I want to add, edit, and delete skills associated with job profiles.
*   As an HR Administrator, I want to review AI-generated suggestions for job profiles, skill gaps, and career paths.

## 5. Functional Requirements

The Job Architecture Wizard will consist of a multi-step interface, guiding the user through the following stages:

### 5.1. Stepper Navigation

*   **FR1.1:** The wizard shall display a clear, horizontal stepper navigation at the top, indicating the current step, completed steps, and upcoming steps.
*   **FR1.2:** Each step in the stepper shall be clickable, allowing users to navigate directly to any previously visited or future step.
*   **FR1.3:** Steps identified as "AI-Powered" shall have a distinct visual style.
*   **FR1.4:** "Back" and "Next Step" buttons shall be available for sequential navigation.
*   **FR1.5:** The "Back" button shall be disabled on the first step.
*   **FR1.6:** A "Finish" button shall appear on the final step, replacing the "Next Step" button, to conclude the wizard.
*   **FR1.7:** The stepper navigation shall be horizontally scrollable on smaller screens, with fade effects indicating more content is available.
*   **FR1.8:** Clicking the "Job Architecture" heading shall reset the wizard to the first step.

### 5.2. Data Management (CRUD Operations)

For each architectural component (Organization, Business Unit, Department, Job Family, Job Level, Job Profile, Skill Gap, Career Path):

*   **FR2.1:** The system shall display a table-like view of existing data for the current step.
*   **FR2.2:** The system shall provide an "Add" button to create new entries.
*   **FR2.3:** The system shall provide "Edit" functionality for existing entries, opening a modal with pre-filled forms.
*   **FR2.4:** The system shall provide "Delete" functionality for existing entries, with a confirmation prompt.
*   **FR2.5:** All data modifications (add, edit, delete) shall be reflected immediately in the UI.
*   **FR2.6:** Data shall be loaded from `consolidated-mock-data.json` on initialization and managed client-side within the `appData` object.

### 5.3. Specific Step Functionality

#### 5.3.1. Organization

*   **FR3.1.1:** Users can define and manage top-level organizational details (Company Name, Industry, Size, Country, CEO, Founded Year, Revenue).

#### 5.3.2. Business Units

*   **FR3.2.1:** Users can define and manage Business Units, linking them to an existing Organization.
*   **FR3.2.2:** Each Business Unit can have a Unit Name, Unit Head, Budget, Employee Count, and Strategic Goals.

#### 5.3.3. Departments

*   **FR3.3.1:** Users can define and manage Departments, linking them to an existing Business Unit.
*   **FR3.3.2:** Each Department can have a Department Name, Department Head, Job Function, Cost Center, and Employee Count.

#### 5.3.4. Job Families (Role Groups)

*   **FR3.4.1:** Users can define and manage Job Families (referred to as Role Groups in the code), linking them to an existing Department.
*   **FR3.4.2:** Each Job Family can have a Group Name, Job Family, Job Category, Grade, Compensation Range, and associated Competencies.

#### 5.3.5. Job Levels

*   **FR3.5.1:** Users can define and manage Job Levels, linking them to an existing Role Group.
*   **FR3.5.2:** Each Job Level can have a Level Name, Level Number (e.g., IC01, M01), Role Level (Individual Contributor, Manager, Executive, Support), Skill Level (Beginner, Intermediate, Advanced, Expert), Salary Range, Bonus Potential, and Key Responsibilities.
*   **FR3.5.3:** The Job Levels table shall support searching by text, filtering by Business Unit, Department, and Role Group, and pagination.
*   **FR3.5.4:** The Job Levels table shall support sorting by all columns.
*   **FR3.5.5:** A legend shall be displayed for Job Level Number prefixes (IC, M, E, S).
*   **FR3.5.6:** A "Career Path" button shall be available for each Job Level, navigating to the "Career Paths" step and pre-selecting the chosen job level.

#### 5.3.6. AI Wizard (Placeholder)

*   **FR3.6.1:** This step is a placeholder for future AI-driven functionality.

#### 5.3.7. Job Profiles (jobs_skills)

*   **FR3.7.1:** Users can define and manage Job Profiles, which include a Job Title, Core Behavioral Anchor, Associated Skills (with proficiency levels), and Exception Overrides.
*   **FR3.7.2:** This step is marked as AI-Powered, suggesting future integration for AI-driven profile generation or enhancement.

#### 5.3.8. Skill Gaps

*   **FR3.8.1:** This step is a placeholder for future skill gap analysis functionality. It is marked as AI-Powered.

#### 5.3.9. Career Paths

*   **FR3.9.1:** The system shall generate and display potential career paths based on the defined `jobs_skills` and `job_levels` data.
*   **FR3.9.2:** Career paths shall show progression between job levels within the same role group, including competency match, development plans, and mentorship availability.
*   **FR3.9.3:** If a job level is selected from the previous step, the career paths for that specific job level should be highlighted or prioritized.
*   **FR3.9.4:** This step is marked as AI-Powered, suggesting future integration for AI-driven path recommendations.

#### 5.3.10. Review & AI

*   **FR3.10.1:** This step is a placeholder for a final review and AI-driven summary/recommendations.

### 5.4. Modals

*   **FR4.1:** A generic modal component shall be used for all add, edit, and delete operations.
*   **FR4.2:** The modal shall support multiple tabs for organizing form content.
*   **FR4.3:** The modal shall include "Cancel" and "Confirm" buttons.
*   **FR4.4:** The modal shall be responsive and accessible.

## 6. Non-Functional Requirements

### 6.1. Performance

*   **NFR6.1.1:** The application shall load quickly, with initial data fetched efficiently.
*   **NFR6.1.2:** UI updates and data manipulations (add, edit, delete) shall be responsive, with minimal perceived latency.

### 6.2. Usability

*   **NFR6.2.1:** The user interface shall be intuitive and easy to navigate for users with varying technical proficiencies.
*   **NFR6.2.2:** Clear feedback shall be provided for all user actions (e.g., confirmation messages, error alerts).
*   **NFR6.2.3:** The design shall be consistent across all steps and modal interactions.

### 6.3. Accessibility

*   **NFR6.3.1:** The application shall adhere to WCAG 2.1 AA guidelines where applicable (e.g., keyboard navigation, semantic HTML, sufficient color contrast).

### 6.4. Maintainability

*   **NFR6.4.1:** The codebase shall be modular, well-structured, and follow modern JavaScript best practices.
*   **NFR6.4.2:** Styling shall be managed using Tailwind CSS for consistency and ease of modification.
*   **NFR6.4.3:** Data handling logic shall be clearly separated from UI rendering.

### 6.5. Security

*   **NFR6.5.1:** (Future) If backend integration is implemented, appropriate authentication and authorization mechanisms shall be in place.
*   **NFR6.5.2:** (Future) Input validation shall be implemented on both client and server sides to prevent common vulnerabilities.

### 6.6. Responsiveness

*   **NFR6.6.1:** The application shall be fully responsive, adapting its layout and components for optimal viewing on various screen sizes (desktop, tablet, mobile).

## 7. Technical Architecture (High-Level)

### 7.1. Frontend

*   **HTML:** Semantic HTML5 structure.
*   **CSS:** Tailwind CSS for utility-first styling, supplemented by custom CSS for specific components (e.g., stepper fades, modal responsiveness).
*   **JavaScript:** ES6+ modules for modularity.
    *   `main.js`: Orchestrates the wizard flow, manages global state (`appData`), handles step navigation, and dynamically loads step-specific modules.
    *   `utils.js`: Provides common utility functions like modal handling (`openModal`, `closeModal`) and dynamic form generation (`getFormHTML`).
    *   `modules/*.js`: Each file represents a step in the wizard, containing logic for rendering its specific UI, handling user interactions (add, edit, delete), and updating `appData`.
*   **Libraries:**
    *   `Chart.js`: For potential data visualization (currently imported but not actively used in the provided JS).
    *   `Font Awesome`: For icons.

### 7.2. Data Management

*   **Client-Side Mock Data:** `consolidated-mock-data.json` serves as the initial data source. All modifications are currently in-memory.
*   **`appData` Object:** A global JavaScript object (`appData`) holds the current state of all organizational and job architecture data.

### 7.3. Backend (Future Consideration)

*   A RESTful API would be required for persistent storage of job architecture data.
*   Database: SQL (e.g., PostgreSQL, MySQL) or NoSQL (e.g., MongoDB) depending on data complexity and scalability needs.
*   AI Services: Integration with AI/ML models for generating suggestions, performing skill gap analysis, and recommending career paths.

## 8. Open Questions / Future Considerations

*   **Backend Integration:** How will data be persisted? What API endpoints are required for CRUD operations?
*   **AI Implementation:** What specific AI models or services will be used for the "AI Wizard," "Job Profiles," "Skill Gaps," and "Review & AI" steps? What are the input/output requirements for these AI services?
*   **User Authentication/Authorization:** How will user access and permissions be managed?
*   **Error Handling:** More robust error handling and user feedback for API failures.
*   **Data Validation:** Client-side and server-side validation for all input fields.
*   **Scalability:** How will the application handle a large volume of organizations, job levels, and skills?
*   **Internationalization (i18n):** Support for multiple languages.
*   **Testing:** Unit, integration, and end-to-end testing strategies.
