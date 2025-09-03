import { state } from '../../state.js';
import * as DOM from './modalDom.js';
import { proficiencyNameMapToLevel } from './modalConstants.js';

export function populateCapabilitiesDropdown() {
    DOM.clearSelectOptions(DOM.capabilitySelect);
    DOM.addOptionToSelect(DOM.capabilitySelect, "", "-- Select Capability --");
    state.capabilities.forEach(cap => {
        DOM.addOptionToSelect(DOM.capabilitySelect, cap.id, cap.name);
    });
}

export function updateCompetencyDropdownOnCapabilityChange() {
    const selectedCapabilityId = DOM.capabilitySelect.value;
    DOM.clearSelectOptions(DOM.competencySelect);
    DOM.addOptionToSelect(DOM.competencySelect, "", "-- Select Competency --");
    DOM.setElementDisabled(DOM.competencySelect, true);
    DOM.setElementDisabled(DOM.addNewCompetencyBtn, !selectedCapabilityId);

    if (selectedCapabilityId) {
        const numSelectedCapabilityId = parseInt(selectedCapabilityId, 10);
        const filteredCompetencies = state.competencies.filter(comp => {
            const compCapabilityId = comp.capability_id !== undefined ? comp.capability_id : comp.capabilityId;
            return compCapabilityId === numSelectedCapabilityId;
        });

        if (filteredCompetencies.length > 0) {
            filteredCompetencies.forEach(comp => {
                DOM.addOptionToSelect(DOM.competencySelect, comp.id, comp.name);
            });
            DOM.setElementDisabled(DOM.competencySelect, false);
        } else {
            DOM.clearSelectOptions(DOM.competencySelect); // Clear again to remove "-- Select --"
            DOM.addOptionToSelect(DOM.competencySelect, "", "-- No competencies for this capability --");
        }
    }
}

export function prefillProficiencyBasedOnAI(currentAIProficiencyName) {
    // Clear all checkboxes first
    if (DOM.proficiencyCheckboxes) {
        DOM.proficiencyCheckboxes.foundational.checked = false;
        DOM.proficiencyCheckboxes.intermediate.checked = false;
        DOM.proficiencyCheckboxes.advanced.checked = false;
    }
    
    if (DOM.aiSuggestedProficiencyLevelInput) {
        DOM.aiSuggestedProficiencyLevelInput.value = ''; // Clear previous value
    }

    if (currentAIProficiencyName && DOM.proficiencyCheckboxes && DOM.aiSuggestedProficiencyLevelInput) {
        const level = proficiencyNameMapToLevel[currentAIProficiencyName.toLowerCase()];
        DOM.aiSuggestedProficiencyLevelInput.value = level || '';

        if (level === 1) DOM.proficiencyCheckboxes.foundational.checked = true;
        else if (level === 2) DOM.proficiencyCheckboxes.intermediate.checked = true;
        else if (level === 3) DOM.proficiencyCheckboxes.advanced.checked = true;
    }
}

// Modified to accept a specific list of skills to check against
export function displaySkillNameWarningIfExisting(skillName, skillsToCheck) {
    if (!DOM.skillNameAlertDiv) return;

    if (!skillName) {
        DOM.hideMessage(DOM.skillNameAlertDiv);
        return;
    }

    // Check against the provided skillsToCheck list instead of global state.ontologySkills
    const existingSkill = skillsToCheck?.find(s => s.name.toLowerCase() === skillName.toLowerCase());

    if (existingSkill) {
        // Note: The logic below for finding competency/capability names still uses global state,
        // which is generally fine as capabilities/competencies are fetched and updated globally.
        // The primary change is which skill list is used for the existence check.
        let competencyName = 'N/A';
        let capabilityName = 'N/A';

        // More robust logic to find competency and capability names
        if (existingSkill.behavior && typeof existingSkill.behavior === 'object' && existingSkill.behavior.id && state.behaviors) {
            const behavior = state.behaviors.find(b => b.id === existingSkill.behavior.id);
            if (behavior && behavior.competency_id && state.competencies) {
                const competency = state.competencies.find(c => c.id === behavior.competency_id);
                if (competency) {
                    competencyName = competency.name;
                    if (competency.capability_id && state.capabilities) {
                        const capability = state.capabilities.find(cap => cap.id === competency.capability_id);
                        if (capability) capabilityName = capability.name;
                    }
                }
            }
        } else if (existingSkill.competency_id && state.competencies) { // Direct competency_id link
            const competency = state.competencies.find(c => c.id === existingSkill.competency_id);
            if (competency) {
                competencyName = competency.name;
                if (competency.capability_id && state.capabilities) {
                     const capability = state.capabilities.find(ca => ca.id === competency.capability_id);
                     if (capability) capabilityName = capability.name;
                }
            }
        } else if (existingSkill.competencyId && state.competencies) { // Direct competencyId (camelCase) link
            const competency = state.competencies.find(c => c.id === existingSkill.competencyId);
            if (competency) {
                competencyName = competency.name;
                // Assuming competency object uses capability_id (snake_case from backend) or capabilityId
                const capId = competency.capability_id || competency.capabilityId;
                if (capId && state.capabilities) {
                     const capability = state.capabilities.find(ca => ca.id === capId);
                     if (capability) capabilityName = capability.name;
                }
            }
        }

        let baseMessage = `Warning: Skill "${skillName}" already exists in the ontology`;
        let associationDetails = "";
        let guidance = `Consider using the Skill Navigator to map to this existing skill or manage its associations. If you intend to create a new, distinct skill, please choose a different name.`;

        if (capabilityName !== 'N/A' && competencyName !== 'N/A') {
            associationDetails = ` (associated with Capability: "${capabilityName}" and Competency: "${competencyName}")`;
        } else if (capabilityName !== 'N/A') { // Only capability known
            associationDetails = ` (associated with Capability: "${capabilityName}", but not yet mapped to a specific Competency)`;
            guidance = `Please use the Skill Navigator to complete its Competency association. If this is a new, distinct skill, please choose a different name.`;
        } else if (competencyName !== 'N/A') { // Only competency known (less common, implies potential data inconsistency)
            associationDetails = ` (associated with Competency: "${competencyName}", but its parent Capability is unclear)`;
            guidance = `Please use the Skill Navigator to review and correct its Capability association. If this is a new, distinct skill, please choose a different name.`;
        } else { // Neither capability nor competency known
            associationDetails = `, but it is not yet associated with a Capability or Competency`;
            guidance = `Please use the form below to complete the association. If you intended to add a new, distinct skill, consider using a different name.`;
        }
        
        const alertMessage = `${baseMessage}${associationDetails}. ${guidance}`;
        DOM.showMessage(DOM.skillNameAlertDiv, alertMessage, 'warning');
    } else {
        DOM.hideMessage(DOM.skillNameAlertDiv);
    }
}

// Modified to accept apiFetchedSkills for the existence check
export function resetAndPrefillForm(aiSkillName, aiProficiencyName, apiFetchedSkills) {
    DOM.resetForm(DOM.formElement);
    DOM.hideMessage(DOM.messageDiv);
    DOM.clearSelectOptions(DOM.competencySelect);
    DOM.addOptionToSelect(DOM.competencySelect, "", "-- Select Competency --");
    DOM.setElementDisabled(DOM.competencySelect, true);
    if(DOM.tagsInput) DOM.tagsInput.value = 'AI Suggested';

    if(DOM.skillNameInput) DOM.skillNameInput.value = aiSkillName || '';
    populateCapabilitiesDropdown();
    prefillProficiencyBasedOnAI(aiProficiencyName);

    // Trigger skill name check after prefilling, using the apiFetchedSkills list
    if (aiSkillName) {
        displaySkillNameWarningIfExisting(aiSkillName, apiFetchedSkills);
    } else {
        DOM.hideMessage(DOM.skillNameAlertDiv); // Ensure it's hidden if no prefilled name
    }
    
    // Hide add new capability/competency sections
    DOM.toggleSection(DOM.addNewCapabilitySection, false);
    DOM.hideMessage(DOM.newCapabilityMessageDiv);
    if(DOM.newCapabilityNameInput) DOM.newCapabilityNameInput.value = '';

    DOM.toggleSection(DOM.addNewCompetencySection, false);
    DOM.hideMessage(DOM.newCompetencyMessageDiv);
    if(DOM.newCompetencyNameInput) DOM.newCompetencyNameInput.value = '';
}
