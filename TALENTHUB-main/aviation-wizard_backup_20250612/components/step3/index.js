// aviation-wizard/components/step3/index.js
import { state as globalState } from '../../state.js'; // Global state needed for roleGroups, etc.
import { localState, initStep3State as initLocalStep3State } from './state.js';
import { renderJobSelectionList } from './jobSelectionRenderer.js';
import { renderSelectedJobSkills } from './jobDetailsRenderer.js';
import { renderAddSkillModal } from './skillModalRenderer.js';
import { addStep3EventListeners as addListeners } from './eventListeners.js';

// Main render function for Step 3 content
// The 'deleteItemFn' parameter from the original step3SkillsMapper.js is not used in the provided code for step 3.
// If it's needed for job deletion or other functionalities not shown, it should be passed through and utilized.
// For now, it's removed from renderStep3Content's signature here.
export const renderStep3Content = (container, openModalForItemFn) => {
    // Ensure local state (like selectedJobIdForSkillMapping) is initialized based on global state
    // This might have been done once globally, but calling it here ensures it's set before rendering.
    initLocalStep3State(); 

    const selectedJob = globalState.roleGroups
        .flatMap(rg => rg.jobs)
        .find(job => job.id === localState.selectedJobIdForSkillMapping);

    const jobSelectionHTML = renderJobSelectionList(globalState.roleGroups, openModalForItemFn);
    const jobSkillsHTML = renderSelectedJobSkills(selectedJob); // selectedJob can be undefined, handled by renderer
    
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            ${jobSelectionHTML}
            ${jobSkillsHTML}
        </div>
        <div id="skill-modal-render-area">
            ${renderAddSkillModal()}
        </div>
    `;
    // Pass openModalForItemFn to event listeners if any step 3 specific buttons need it.
    // Currently, add-job-to-group-btn uses it, and it's passed to renderJobSelectionList which generates the button.
    // The event listener for add-job-to-group-btn is attached in addStep3EventListeners.
    addListeners(container, openModalForItemFn);
};

// Export initStep3State to be called from the main application logic if needed (e.g., on app load)
export const initStep3State = () => {
    initLocalStep3State();
};

// Export addStep3EventListeners if it needs to be called separately, though renderStep3Content calls it.
// This might be useful if only event listeners need to be re-attached without a full re-render.
export const addStep3EventListeners = (container, openModalForItemFn) => {
    addListeners(container, openModalForItemFn);
};
