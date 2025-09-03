import { state, updateState } from '../../state.js'; // Added updateState
import { generateId } from '../../utils.js'; // Assuming utils.js is in the parent directory of 'aviation-wizard'
import * as DOM from './modalDom.js';
import * as API from './modalApi.js';
import * as UI from './modalUi.js';
// Import lastApiFetchedSkills and closeModal
import { closeModal as closeMainModal, lastApiFetchedSkills } from './addSkillModal.js'; 

// These will be set by addSkillModal.js when opening
let onSkillAddedCallbackInstance = null;
let currentJobIdInstance = null;

export function setEventContext(onSkillAddedCb, currentJobId) {
    onSkillAddedCallbackInstance = onSkillAddedCb;
    currentJobIdInstance = currentJobId;
}

async function handleSubmitSkillForm(event) {
    event.preventDefault();
    DOM.hideMessage(DOM.messageDiv);

    const skillName = DOM.skillNameInput.value.trim();
    const capabilityId = DOM.capabilitySelect.value;
    const competencyId = DOM.competencySelect.value;
    const skillDescription = DOM.skillDescriptionInput.value.trim();
    const tagsValue = DOM.tagsInput.value.trim();

    if (!skillName || !capabilityId || !competencyId) {
        DOM.showMessage(DOM.messageDiv, 'Skill Name, Capability, and Competency selections are required for association.', 'error');
        return;
    }
    
    // Determine selected proficiency levels from the form for the skill's definition in the ontology (if new)
    // or for the job-skill association.
    // The callback `handleSkillAddedToOntology` will use the skill's proficiency (newly defined or existing)
    // to set the job-skill proficiency.
    const newSkillProficiencyLevels = [];
    if (DOM.proficiencyCheckboxes.foundational.checked) newSkillProficiencyLevels.push({ level: 1, name: 'Foundational', descriptor: 'Basic understanding and application.' });
    if (DOM.proficiencyCheckboxes.intermediate.checked) newSkillProficiencyLevels.push({ level: 2, name: 'Intermediate', descriptor: 'Works independently, can guide others.' });
    if (DOM.proficiencyCheckboxes.advanced.checked) newSkillProficiencyLevels.push({ level: 3, name: 'Advanced', descriptor: 'Recognized expert, innovates and strategizes.' });

    if (newSkillProficiencyLevels.length === 0) {
        DOM.showMessage(DOM.messageDiv, 'At least one proficiency level must be defined for the skill.', 'error');
        return;
    }

    // Check if the skill (by name) already exists in the list fetched from the API
    const skillFromApiList = lastApiFetchedSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());

    if (skillFromApiList) {
        // MAP SCENARIO: Skill exists in the API's ontology. Use this existing skill.
        // Augment with current C/C selection from form, as API object might be incomplete or associations might be changing.
        const augmentedSkillFromApi = {
            ...skillFromApiList,
            // Ensure IDs are numbers for consistency, form values are strings.
            capabilityId: capabilityId ? parseInt(capabilityId) : null, 
            competencyId: competencyId ? parseInt(competencyId) : null,
            // Attempt to populate the capability/competency objects based on current selections
            // This helps if jobDetailsRenderer relies on these nested objects.
            capability: capabilityId ? state.capabilities.find(c => c.id === parseInt(capabilityId)) : null,
            competency: competencyId ? state.competencies.find(c => c.id === parseInt(competencyId)) : null
        };
        // If the original skillFromApiList had a competency object, and its capabilityId matches the form's selected capabilityId,
        // we might want to preserve more details from skillFromApiList.competency.
        // For now, this simpler override with form selections ensures the table shows what was chosen.

        // --- BEGIN FIX: Update existing skill in global state ---
        const updatedOntologySkills = state.ontologySkills.map(s =>
            s.id === augmentedSkillFromApi.id ? augmentedSkillFromApi : s
        );
        // Check if the skill was actually found and updated in globalState.ontologySkills.
        // If skillFromApiList.id was not in globalState.ontologySkills (e.g. lastApiFetchedSkills was more up-to-date),
        // then this map operation wouldn't add it. The ADD SCENARIO handles truly new skills.
        // This assumes skillFromApiList.id *should* exist in state.ontologySkills if it's an "existing" skill.
        // If it might not, we might need to add it if not found, then update.
        // For now, let's assume it exists if skillFromApiList was found.
        if (updatedOntologySkills.some(s => s.id === augmentedSkillFromApi.id && s.competencyId === augmentedSkillFromApi.competencyId)) {
            updateState({ ontologySkills: updatedOntologySkills });
            console.log(`[ModalEvents] Updated existing skill ID ${augmentedSkillFromApi.id} in globalState.ontologySkills with form selections (Capability: ${augmentedSkillFromApi.capability?.name}, Competency: ${augmentedSkillFromApi.competency?.name}).`);
        } else {
            // This case might happen if lastApiFetchedSkills has a skill that's somehow not in globalState.ontologySkills yet.
            // This would be unusual but to be safe, we could add it.
            // For now, log a warning. The ADD SCENARIO below would typically catch skills not in globalState.
            console.warn(`[ModalEvents] Skill ID ${augmentedSkillFromApi.id} from API list was not found in globalState.ontologySkills for update. This is unexpected for a MAP scenario.`);
            // Fallback: treat as new if not in global state, though this duplicates logic.
            // The robust solution is to ensure lastApiFetchedSkills and globalState.ontologySkills are consistent
            // or that the ADD_SCENARIO correctly handles this.
            // For now, the existing ADD_SCENARIO logic will run if skillFromGlobalState is not found.
        }
        // --- END FIX ---

        console.log(`[ModalEvents] Mapping to existing API ontology skill (augmented): "${augmentedSkillFromApi.name}" (ID: ${augmentedSkillFromApi.id})`);
        DOM.showMessage(DOM.messageDiv, `Using existing skill "${augmentedSkillFromApi.name}" from ontology for job association.`, 'success');
        
        if (onSkillAddedCallbackInstance) {
            onSkillAddedCallbackInstance(augmentedSkillFromApi, currentJobIdInstance);
        }
        setTimeout(closeMainModal, 1500); // Close modal after success
        return; // Successfully "mapped" the existing skill
    }

    // ADD SCENARIO: Skill does NOT exist in API list. Proceed to check global state and then add.
    // Check if the skill name exists in the current global application state's ontologySkills 
    // (excluding any that might have been the same as skillFromApiList, though that's covered above).
    const skillFromGlobalState = state.ontologySkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (skillFromGlobalState) {
        // This case should be rare if lastApiFetchedSkills is reasonably up-to-date and global state isn't ahead of API.
        // However, it's a safeguard.
        DOM.showMessage(DOM.messageDiv, `Skill "${skillName}" already exists in the current application session (but was not found in the direct API list). Please resolve or choose a different name.`, 'error');
        return;
    }
    
    // If we reach here, the skill is considered new. Prepare data for adding to ontology.
    const newSkillData = {
        // id: generateId('s'), // API should generate ID. The modal API currently sends a client-generated ID.
                              // Let's use the generateId from the main utils.js, assuming it's available.
                              // If not, this needs to be sourced correctly or API needs to not require it.
        id: `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mimicking modal's previous client-side ID
        name: skillName,
        description: skillDescription,
        capabilityId: capabilityId, // Will be parsed to int by API or already is
        competencyId: competencyId, // Will be parsed to int by API or already is
        tags: tagsValue ? tagsValue.split(',').map(tag => tag.trim()) : ['AI Suggested'],
        type: 'User Added via Modal', // To distinguish source
        definition: skillDescription || `User-added skill related to ${DOM.competencySelect.options[DOM.competencySelect.selectedIndex].text}`,
        proficiencyLevels: newSkillProficiencyLevels, // Proficiency levels for the skill definition in ontology
    };

    try {
        console.log('[ModalEvents] Adding new skill to ontology:', newSkillData);
        const addedSkill = await API.addSkillToOntology(newSkillData); // Adds to ontology & updates global state.ontologySkills
        DOM.showMessage(DOM.messageDiv, `Skill "${addedSkill.name}" added successfully to the ontology!`, 'success');
        
        if (onSkillAddedCallbackInstance) {
            onSkillAddedCallbackInstance(addedSkill, currentJobIdInstance); // Links to job
        }
        setTimeout(closeMainModal, 1500);
    } catch (error) {
        // This catch could still be hit for various reasons, including an unexpected 409 if the API state changed
        // since lastApiFetchedSkills was populated.
        console.error('[ModalEvents] Error adding skill to ontology:', error);
        DOM.showMessage(DOM.messageDiv, `Failed to add skill: ${error.message}`, 'error');
    }
}

function handleSkillNameInputChange() {
    if (DOM.skillNameInput && UI.displaySkillNameWarningIfExisting) {
        // UI.displaySkillNameWarningIfExisting expects the list of skills to check against.
        // This should be lastApiFetchedSkills for consistency with the user's expectation.
        UI.displaySkillNameWarningIfExisting(DOM.skillNameInput.value.trim(), lastApiFetchedSkills);
    }
}

async function handleSaveNewCapabilityClick() {
    const newName = DOM.newCapabilityNameInput.value.trim();
    if (!newName) {
        DOM.showMessage(DOM.newCapabilityMessageDiv, 'Capability name cannot be empty.', 'error');
        return;
    }
    // Check against global state as capabilities are updated there by API.fetchCapabilities
    if (state.capabilities.find(c => c.name.toLowerCase() === newName.toLowerCase())) {
        DOM.showMessage(DOM.newCapabilityMessageDiv, `Capability "${newName}" already exists.`, 'error');
        return;
    }
    const newCapabilityData = { name: newName, description: `User-added capability: ${newName}` };
    try {
        const addedCapability = await API.addNewCapability(newCapabilityData); // Updates global state
        UI.populateCapabilitiesDropdown(); 
        DOM.capabilitySelect.value = addedCapability.id; 
        UI.updateCompetencyDropdownOnCapabilityChange(); 
        DOM.showMessage(DOM.newCapabilityMessageDiv, `Capability "${addedCapability.name}" added successfully!`, 'success');
        DOM.newCapabilityNameInput.value = '';
        setTimeout(() => {
            DOM.toggleSection(DOM.addNewCapabilitySection, false);
            DOM.hideMessage(DOM.newCapabilityMessageDiv);
        }, 1500);
    } catch (error) {
        console.error('[ModalEvents] Error adding capability:', error);
        DOM.showMessage(DOM.newCapabilityMessageDiv, `Failed to add capability: ${error.message}`, 'error');
    }
}

async function handleSaveNewCompetencyClick() {
    const newName = DOM.newCompetencyNameInput.value.trim();
    const selectedCapabilityId = DOM.capabilitySelect.value;

    if (!newName) {
        DOM.showMessage(DOM.newCompetencyMessageDiv, 'Competency name cannot be empty.', 'error');
        return;
    }
    if (!selectedCapabilityId) {
        DOM.showMessage(DOM.newCompetencyMessageDiv, 'A capability must be selected.', 'error');
        return;
    }
    const numSelectedCapabilityId = parseInt(selectedCapabilityId, 10);
    // Check against global state as competencies are updated there by API.fetchCompetencies
    if (state.competencies.find(c => {
        const compCapId = c.capability_id !== undefined ? c.capability_id : c.capabilityId;
        return compCapId === numSelectedCapabilityId && c.name.toLowerCase() === newName.toLowerCase();
    })) {
        DOM.showMessage(DOM.newCompetencyMessageDiv, `Competency "${newName}" already exists for this capability.`, 'error');
        return;
    }
    const newCompetencyData = { 
        name: newName, 
        description: `User-added competency: ${newName}`, 
        capabilityId: selectedCapabilityId // API expects capabilityId
    };
    try {
        const addedCompetency = await API.addNewCompetency(newCompetencyData); // Updates global state
        UI.updateCompetencyDropdownOnCapabilityChange(); 
        DOM.competencySelect.value = addedCompetency.id; 
        DOM.showMessage(DOM.newCompetencyMessageDiv, `Competency "${addedCompetency.name}" added successfully!`, 'success');
        DOM.newCompetencyNameInput.value = '';
        setTimeout(() => {
            DOM.toggleSection(DOM.addNewCompetencySection, false);
            DOM.hideMessage(DOM.newCompetencyMessageDiv);
        }, 1500);
    } catch (error) {
        console.error('[ModalEvents] Error adding competency:', error);
        DOM.showMessage(DOM.newCompetencyMessageDiv, `Failed to add competency: ${error.message}`, 'error');
    }
}

export function initializeModalEventListeners() {
    if (!DOM.modalElement) {
        console.warn("[ModalEvents] DOM elements not initialized before setting event listeners.");
        return;
    }
    DOM.closeButton?.addEventListener('click', closeMainModal);
    DOM.cancelButton?.addEventListener('click', closeMainModal);
    DOM.modalElement?.addEventListener('click', (event) => {
        if (event.target === DOM.modalElement) closeMainModal();
    });
    DOM.capabilitySelect?.addEventListener('change', UI.updateCompetencyDropdownOnCapabilityChange);
    DOM.formElement?.addEventListener('submit', handleSubmitSkillForm);
    DOM.skillNameInput?.addEventListener('input', handleSkillNameInputChange);

    DOM.addNewCapabilityBtn?.addEventListener('click', () => {
        DOM.toggleSection(DOM.addNewCapabilitySection, true);
        DOM.newCapabilityNameInput?.focus();
        DOM.hideMessage(DOM.newCapabilityMessageDiv);
    });
    DOM.cancelNewCapabilityBtn?.addEventListener('click', () => {
        DOM.toggleSection(DOM.addNewCapabilitySection, false);
        if(DOM.newCapabilityNameInput) DOM.newCapabilityNameInput.value = '';
        DOM.hideMessage(DOM.newCapabilityMessageDiv);
    });
    DOM.saveNewCapabilityBtn?.addEventListener('click', handleSaveNewCapabilityClick);

    DOM.addNewCompetencyBtn?.addEventListener('click', () => {
        if (!DOM.capabilitySelect?.value) {
            alert('Please select a Capability first.');
            return;
        }
        DOM.toggleSection(DOM.addNewCompetencySection, true);
        DOM.newCompetencyNameInput?.focus();
        DOM.hideMessage(DOM.newCompetencyMessageDiv);
    });
    DOM.cancelNewCompetencyBtn?.addEventListener('click', () => {
        DOM.toggleSection(DOM.addNewCompetencySection, false);
        if(DOM.newCompetencyNameInput) DOM.newCompetencyNameInput.value = '';
        DOM.hideMessage(DOM.newCompetencyMessageDiv);
    });
    DOM.saveNewCompetencyBtn?.addEventListener('click', handleSaveNewCompetencyClick);
}
