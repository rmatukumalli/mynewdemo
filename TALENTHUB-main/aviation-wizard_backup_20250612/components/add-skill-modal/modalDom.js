// DOM Element References
export let modalElement, formElement, skillNameInput, skillDescriptionInput,
    capabilitySelect, competencySelect, tagsInput, proficiencyCheckboxes,
    closeButton, cancelButton, messageDiv, aiSuggestedProficiencyLevelInput,
    addNewCapabilityBtn, addNewCapabilitySection, newCapabilityNameInput,
    saveNewCapabilityBtn, cancelNewCapabilityBtn, newCapabilityMessageDiv,
    addNewCompetencyBtn, addNewCompetencySection, newCompetencyNameInput,
    saveNewCompetencyBtn, cancelNewCompetencyBtn, newCompetencyMessageDiv,
    skillNameAlertDiv;

export function initializeModalDomElements() {
    modalElement = document.getElementById('addSkillModal');
    formElement = document.getElementById('addSkillForm');
    skillNameInput = document.getElementById('skillName');
    skillDescriptionInput = document.getElementById('skillDescription');
    capabilitySelect = document.getElementById('skillCapability');
    competencySelect = document.getElementById('skillCompetency');
    tagsInput = document.getElementById('skillTags');
    skillNameAlertDiv = document.getElementById('skillNameAlert'); // Ensure this ID exists in HTML

    // New Capability Elements
    addNewCapabilityBtn = document.getElementById('addNewCapabilityBtn');
    addNewCapabilitySection = document.getElementById('addNewCapabilitySection');
    newCapabilityNameInput = document.getElementById('newCapabilityName');
    saveNewCapabilityBtn = document.getElementById('saveNewCapabilityBtn');
    cancelNewCapabilityBtn = document.getElementById('cancelNewCapabilityBtn');
    newCapabilityMessageDiv = document.getElementById('newCapabilityMessage');

    // New Competency Elements
    addNewCompetencyBtn = document.getElementById('addNewCompetencyBtn');
    addNewCompetencySection = document.getElementById('addNewCompetencySection');
    newCompetencyNameInput = document.getElementById('newCompetencyName');
    saveNewCompetencyBtn = document.getElementById('saveNewCompetencyBtn');
    cancelNewCompetencyBtn = document.getElementById('cancelNewCompetencyBtn');
    newCompetencyMessageDiv = document.getElementById('newCompetencyMessage');

    proficiencyCheckboxes = {
        foundational: document.getElementById('profFoundational'),
        intermediate: document.getElementById('profIntermediate'),
        advanced: document.getElementById('profAdvanced')
    };
    aiSuggestedProficiencyLevelInput = document.getElementById('aiSuggestedProficiencyLevel');
    
    closeButton = modalElement.querySelector('.add-skill-modal-close');
    cancelButton = modalElement.querySelector('.add-skill-modal-cancel');
    messageDiv = document.getElementById('addSkillMessage');

    return {
        modalElement, formElement, skillNameInput, skillDescriptionInput,
        capabilitySelect, competencySelect, tagsInput, proficiencyCheckboxes,
        closeButton, cancelButton, messageDiv, aiSuggestedProficiencyLevelInput,
        addNewCapabilityBtn, addNewCapabilitySection, newCapabilityNameInput,
        saveNewCapabilityBtn, cancelNewCapabilityBtn, newCapabilityMessageDiv,
        addNewCompetencyBtn, addNewCompetencySection, newCompetencyNameInput,
        saveNewCompetencyBtn, cancelNewCompetencyBtn, newCompetencyMessageDiv,
        skillNameAlertDiv
    };
}

export function showMessage(element, message, type = 'info') {
    if (!element) return;
    element.textContent = message;
    element.className = `add-skill-message ${type}`; // Assumes a base class 'add-skill-message'
    element.style.display = 'block';
}

export function hideMessage(element) {
    if (!element) return;
    element.style.display = 'none';
    element.textContent = '';
}

export function toggleSection(sectionElement, show) {
    if (!sectionElement) return;
    sectionElement.style.display = show ? 'block' : 'none';
}

export function resetForm(form) {
    if (form) form.reset();
}

export function setElementDisabled(element, disabled) {
    if (element) element.disabled = disabled;
}

export function clearSelectOptions(selectElement) {
    if (selectElement) selectElement.innerHTML = '';
}

export function addOptionToSelect(selectElement, value, text) {
    if (!selectElement) return;
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    selectElement.appendChild(option);
}
