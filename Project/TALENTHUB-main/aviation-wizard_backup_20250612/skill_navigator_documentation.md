# Skill Navigator Feature Documentation (Aviation Wizard)

This document outlines the file hierarchy and functionality of the "Skill Navigator" feature, with a specific focus on its "Step 1: Capability" selection, as used within the "Add Jobs & Map Skills" (Step 6) view of the Aviation Job Architecture Wizard (`aviation-wizard/index.html?step=6`).

## Overview

The Skill Navigator is a multi-step modal that allows users to browse, select, and add capabilities, competencies, behaviors, and skills (with proficiency levels) to a specific job. It is designed as a self-contained module to enhance modularity and user experience.

## File Hierarchy and Roles

The primary files involved in launching and operating the Skill Navigator, particularly for its "Step 1: Capability" functionality, are:

```
aviation-wizard/
├── skill-navigator/
│   ├── skillNavigator.js       # CORE: Main logic for the Skill Navigator modal.
│   └── skillNavigator.css      # Styles specific to the Skill Navigator modal.
│
├── components/
│   └── step3/                  # Components related to "Step 6: Add Jobs & Map Skills"
│       ├── jobDetailsRenderer.js # Renders the UI for the selected job, including the "Add Skill" button.
│       ├── eventListeners.js     # Attaches event listener to the "Add Skill" button.
│       └── eventHandlers.js      # Handles the "Add Skill" button click, invoking the Skill Navigator.
│
├── state.js                    # Global application state, provides data like capabilities, competencies, skills.
│
└── index.html                  # Main HTML page for the wizard. Includes the container for the
                                  Skill Navigator modal and links its CSS.
```

## Detailed File Descriptions

### 1. `aviation-wizard/skill-navigator/skillNavigator.js`

This is the **core module** for the Skill Navigator feature.

*   **Role**: Manages the entire lifecycle of the Skill Navigator modal. This includes:
    *   Creating and managing the modal's DOM structure.
    *   Handling its internal multi-step navigation (Capability -> Competency -> Behavior -> Skills -> Review).
    *   Managing its own internal state (`navigatorState`) for user selections at each step, current job ID, search terms, etc.
    *   Rendering the content for each internal step.
        *   **`renderStep1Capabilities()`**: This function is specifically responsible for rendering "Step 1: Capability". It displays a searchable list of capabilities (sourced from `globalMainState.capabilities`) and allows users to select one or more.
    *   Handling user interactions within the modal (selections, search, navigation).
    *   Saving the final selected skills and behaviors to the global application state for the relevant job.
*   **Key Functions for "Step 1: Capability"**:
    *   `renderStep1Capabilities()`: Renders the list of capabilities.
    *   `handleCapabilitySearch()`: Handles search input for capabilities.
    *   `handleCapabilitySelect()`: Manages the selection/deselection of capabilities.
*   **Public API**:
    *   `openSkillNavigator(jobId, ...)`: Called to open and initialize the modal for a specific job.
    *   `closeSkillNavigator()`: Closes the modal and resets its state.
*   **Data Consumption**: Uses `globalMainState.capabilities`, `globalMainState.competencies`, `globalMainState.ontologySkills` from `../state.js`.

### 2. `aviation-wizard/components/step3/eventHandlers.js`

*   **Role**: Acts as an intermediary, connecting UI events from the "Add Jobs & Map Skills" step (Step 6 of the main wizard) to specific actions, including launching the Skill Navigator.
*   **Key Function**:
    *   `handleOpenSkillModal()`: This function is triggered when the "Add Skill" button is clicked. It calls `openSkillNavigator()` (imported from `../../skill-navigator/skillNavigator.js`) to display the Skill Navigator modal, passing the `currentJobId`.

### 3. `aviation-wizard/components/step3/eventListeners.js`

*   **Role**: Attaches event listeners to DOM elements within the "Add Jobs & Map Skills" step.
*   **Key Action**:
    *   Attaches a click event listener to the "Add Skill" buttons (e.g., `#open-skill-modal-btn`, `#open-skill-modal-btn-empty`). When clicked, this listener calls `handlers.handleOpenSkillModal` (from `eventHandlers.js`).

### 4. `aviation-wizard/components/step3/jobDetailsRenderer.js`

*   **Role**: Renders the detailed view for a selected job within the "Add Jobs & Map Skills" step. This view includes various tabs, one of which is "Skills Mapping".
*   **Key Contribution**:
    *   The "Skills Mapping" tab rendered by this file contains the "Add Skill" button (e.g., `#open-skill-modal-btn`) that users click to launch the Skill Navigator.

### 5. `aviation-wizard/state.js`

*   **Role**: Manages the global state for the entire Aviation Job Architecture Wizard.
*   **Key Contribution to Skill Navigator**:
    *   Provides the master lists of `capabilities`, `competencies`, and `ontologySkills`. The `skillNavigator.js` module reads from this global state to populate its selection lists.
    *   The `updateState` function is used by `skillNavigator.js` (indirectly via `updateGlobalMainState`) to save the selected skills and behaviors back to the job's data in the global state.

### 6. `aviation-wizard/index.html`

*   **Role**: The main HTML file for the wizard.
*   **Key Elements for Skill Navigator**:
    *   Includes a placeholder `div` (e.g., `<div id="skill-navigator-modal-container"></div>`) where `skillNavigator.js` dynamically injects the modal's HTML.
    *   Links the `skill-navigator/skillNavigator.css` stylesheet for the modal's appearance.

## Modularization Assessment

The "Skill Navigator" feature, primarily encapsulated within `aviation-wizard/skill-navigator/skillNavigator.js`, demonstrates a good level of modularity. It has consolidated logic that might have previously been spread across multiple files related to the older skill modal implementation (as hinted by comments in `eventHandlers.js`).

*   **Strengths**:
    *   **Encapsulation**: `skillNavigator.js` manages its own DOM, state, rendering, and event handling for its internal steps.
    *   **Clear API**: `openSkillNavigator` and `closeSkillNavigator` provide a clean interface for other parts of the application to interact with it.
    *   **Reusability**: While currently used in Step 6, this modular design makes it potentially reusable in other contexts if needed.

*   **Potential Further Micro-Modularization (within `skillNavigator.js`)**:
    *   If the rendering logic for each internal step (`renderStep1Capabilities`, `renderStep2Competencies`, etc.) or their associated event handlers become significantly more complex, they could be extracted into smaller, focused helper modules (e.g., `skillNavigatorStep1.js`, `skillNavigatorStep2.js`).
    *   However, for its current scope, the internal organization of `skillNavigator.js` is reasonably clear and manageable. The functions are generally well-defined and serve distinct purposes.

The current structure effectively modularizes the skill navigation and selection process, making the codebase easier to understand and maintain for this specific feature.
