import * as DOM from './modalDom.js';
import * as API from './modalApi.js';
import * as UI from './modalUi.js';
import * as Events from './modalEvents.js';

// Module-level state for the currently open modal instance
let currentJobId = null;
let currentAISkillName = null;
let currentAIProficiencyName = null;
let onSkillAddedCallback = null;
export let lastApiFetchedSkills = []; // Export for modalEvents.js to access

let isInitialized = false;

function initializeOnce() {
    if (isInitialized) return;
    DOM.initializeModalDomElements();
    Events.initializeModalEventListeners();
    isInitialized = true;
}

export async function openAddSkillModal(jobId, aiSkillName, aiProficiencyName, callback) {
    initializeOnce(); // Ensure DOM elements are ready and base event listeners are attached

    currentJobId = jobId;
    currentAISkillName = aiSkillName;
    currentAIProficiencyName = aiProficiencyName;
    onSkillAddedCallback = callback;

    // Pass current context to the events module
    Events.setEventContext(onSkillAddedCallback, currentJobId);

    console.log('Modal: Fetching latest ontology data...');
    lastApiFetchedSkills = []; // Reset before fetching
    try {
        // Fetch all data concurrently
        const results = await Promise.all([
            API.fetchCapabilities(),
            API.fetchCompetencies(),
            API.fetchSkills() // This now returns the skills list from the API
        ]);
        lastApiFetchedSkills = results[2] || []; // API.fetchSkills() is the third promise
        console.log('Modal: Finished fetching ontology data.');
    } catch (error) {
        console.error('Modal: Error during pre-fetch of ontology data:', error);
        DOM.showMessage(DOM.messageDiv, `Error loading initial data: ${error.message}. Please try again.`, 'error');
        // Optionally, don't open the modal or open with a clear error state
        // For now, we'll allow it to open, but UI.resetAndPrefillForm will use existing state or show empty.
    }
    
    // Reset form, populate dropdowns, prefill data
    // Pass the lastApiFetchedSkills to be used for the "skill already exists" check
    UI.resetAndPrefillForm(currentAISkillName, currentAIProficiencyName, lastApiFetchedSkills);

    // Display the modal
    if (DOM.modalElement) {
        DOM.modalElement.style.display = 'block';
    } else {
        console.error("Add Skill Modal element not found after initialization!");
    }
}

export function closeModal() {
    if (DOM.modalElement) {
        DOM.modalElement.style.display = 'none';
    }
    // Reset instance-specific state if needed, or on next open
    currentJobId = null;
    currentAISkillName = null;
    currentAIProficiencyName = null;
    onSkillAddedCallback = null;
    Events.setEventContext(null, null); // Clear context in events module
}

console.log('Add Skill Modal (Main Orchestrator) module loaded.');
