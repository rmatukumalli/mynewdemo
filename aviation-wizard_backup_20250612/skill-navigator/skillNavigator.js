// aviation-wizard/skill-navigator/skillNavigator.js
import { state as globalMainState, updateState as updateGlobalMainState } from '../state.js';
import { handlers as globalMainHandlers } from '../handlers.js';
import { getIcon } from '../state.js'; // Assuming getIcon is accessible globally

// --- SKILL NAVIGATOR STATE ---
let navigatorState = {
    isOpen: false,
    currentStep: 1, // 1: Capability, 2: Competency, 3: Behavior, 4: Skills, 5: Review
    currentJobId: null, // To store the job ID for which skills/behaviours are being added
    selectedCapabilities: [], // Array of capability IDs
    selectedCompetencies: [], // Array of competency IDs
    selectedBehaviors: [],    // Array of objects { competencyId, behaviorString }
    selectedSkills: [],       // Array of objects { skillId, proficiency (1-5) }
    // AI Skill Mapping Context
    isMappingAiSkillContext: false,
    mappingAiSkillName: null, // The original name of the AI skill being mapped
    mappingAiSkillProficiencyName: null, // The original proficiency name from AI
    // Store details for review step
    reviewData: {
        capabilities: [], // { id, name, description }
        competencies: [], // { id, name, description, capabilityId }
        behaviors: [],    // { competencyId, behaviorString }
        skills: []        // { id, name, definition, proficiency, proficiencyName }
    },
    searchTerm: '' // For search functionality
};

// Mapping from AI proficiency names to wizard proficiency levels (1-5)
// Note: The skill ontology uses 1-5, but the AI writer might use descriptive names.
// The AI writer currently sends 'basic', 'intermediate', 'advanced', 'expert'.
// The ontology proficiency levels are:
// 1: Foundational, 2: Basic, 3: Intermediate, 4: Advanced, 5: Expert
// We need a map from AI writer's terms to the ontology's 1-5 scale.
// Let's assume a mapping:
const aiProficiencyNameToOntologyLevel = {
    'basic': 2, // Maps to Basic (Level 2)
    'foundational': 1, // Maps to Foundational (Level 1) - if AI writer uses this
    'intermediate': 3, // Maps to Intermediate (Level 3)
    'advanced': 4, // Maps to Advanced (Level 4)
    'expert': 5    // Maps to Expert (Level 5)
};


const NAVIGATOR_STEPS = [
    { id: 1, name: 'Capability' },
    { id: 2, name: 'Competency' },
    { id: 3, name: 'Behavior' },
    { id: 4, name: 'Skills' },
    { id: 5, name: 'Review & Save' }
];

// --- DOM Elements (will be queried when modal is open) ---
let modalElement = null;
let modalHeaderTitle = null;
let progressBarContainer = null;
let modalBody = null;
let modalFooter = null;

// --- DATA ---
// Assuming globalMainState.capabilities, globalMainState.competencies, 
// globalMainState.ontologySkills are available and populated.

// --- UTILITY FUNCTIONS ---
function clearSelectionsForStep(step) {
    if (step === 1) { // Reset everything if going back to step 1 or starting over
        navigatorState.selectedCapabilities = [];
        navigatorState.selectedCompetencies = [];
        navigatorState.selectedBehaviors = [];
        navigatorState.selectedSkills = [];
    } else if (step === 2) {
        navigatorState.selectedCompetencies = [];
        navigatorState.selectedBehaviors = [];
        navigatorState.selectedSkills = [];
    } else if (step === 3) {
        navigatorState.selectedBehaviors = [];
        navigatorState.selectedSkills = []; 
    } else if (step === 4) {
        navigatorState.selectedSkills = [];
    }
}


// --- RENDER FUNCTIONS ---

function renderProgressBar() {
    if (!progressBarContainer) return;
    let progressHTML = '<ul class="progress-bar">';
    NAVIGATOR_STEPS.forEach(step => {
        const isActive = navigatorState.currentStep === step.id;
        const isCompleted = navigatorState.currentStep > step.id;
        progressHTML += `
            <li class="progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
                <div class="step-circle">${isCompleted ? getIcon('Check') : step.id}</div>
                ${step.name}
            </li>
        `;
    });
    progressHTML += '</ul>';
    progressBarContainer.innerHTML = progressHTML;
}

function renderModalHeader() {
    if (!modalHeaderTitle) return;
    const currentStepDetails = NAVIGATOR_STEPS.find(s => s.id === navigatorState.currentStep);
    modalHeaderTitle.textContent = currentStepDetails ? `Skill Navigator - Step ${currentStepDetails.id}: ${currentStepDetails.name}` : 'Skill Navigator';
}

function renderModalFooter() {
    if (!modalFooter) return;
    let footerHTML = '';
    // Back Button
    if (navigatorState.currentStep > 1) {
        footerHTML += `<button id="navigator-back-btn" class="btn btn-secondary">${getIcon('ChevronLeft')} Back</button>`;
    } else {
        footerHTML += '<div></div>'; // Placeholder to keep alignment
    }

    // Next/Save Button
    let nextButtonDisabled = false;
    if (navigatorState.currentStep === 1 && navigatorState.selectedCapabilities.length === 0) {
        nextButtonDisabled = true;
    } else if (navigatorState.currentStep === 2 && navigatorState.selectedCompetencies.length === 0) {
        nextButtonDisabled = true;
    }
    // Add other conditions for disabling Next for other steps if needed
    // For now, only step 1 & 2's conditions are explicitly handled for disabling.

    // --- BEGIN ADDED LOG ---
    console.log(`[SkillNavigator] renderModalFooter: Current Step: ${navigatorState.currentStep}, Selected Capabilities: ${navigatorState.selectedCapabilities.length}, Next Button Disabled: ${nextButtonDisabled}`);
    // --- END ADDED LOG ---

    if (navigatorState.currentStep < NAVIGATOR_STEPS.length) {
        footerHTML += `<button id="navigator-next-btn" class="btn btn-primary" ${nextButtonDisabled ? 'disabled' : ''}>Next ${getIcon('ChevronRight')}</button>`;
    } else {
        // Save button logic - disable if no skills selected in step 4, for example.
        let saveButtonDisabled = false;
        if (navigatorState.selectedSkills.length === 0) {
            // saveButtonDisabled = true; // Example: disable save if no skills selected
        }
        console.log(`[SkillNavigator] renderModalFooter: Rendering Save button. Selected Skills: ${navigatorState.selectedSkills.length}, Save Button Disabled: ${saveButtonDisabled}`);
        footerHTML += `<button id="navigator-save-btn" class="btn btn-primary" ${saveButtonDisabled ? 'disabled' : ''}>${getIcon('Save')} Save Skills</button>`;
    }
    modalFooter.innerHTML = footerHTML;
    addFooterEventListeners();
}

function renderStepContent() {
    if (!modalBody) return;
    let contentHTML = '';
    switch (navigatorState.currentStep) {
        case 1:
            contentHTML = renderStep1Capabilities();
            break;
        case 2:
            contentHTML = renderStep2Competencies();
            break;
        case 3:
            contentHTML = renderStep3Behaviors();
            break;
        case 4:
            contentHTML = renderStep4Skills();
            break;
        case 5:
            contentHTML = renderStep5Review();
            break;
        default:
            contentHTML = '<p>Unknown step.</p>';
    }
    modalBody.innerHTML = contentHTML;
    addStepEventListeners();
}

function renderStep1Capabilities() {
    let html = `<input type="text" id="capability-search" class="search-input" placeholder="Search capabilities..." value="${navigatorState.searchTerm}">`;
    html += '<div class="space-y-2 capabilities-list">';
    const filteredCapabilities = globalMainState.capabilities.filter(cap => 
        cap.name.toLowerCase().includes(navigatorState.searchTerm.toLowerCase())
    );

    if (filteredCapabilities.length === 0) {
        html += '<p class="text-gray-500">No capabilities match your search.</p>';
    }

    filteredCapabilities.forEach(cap => {
        const isSelected = navigatorState.selectedCapabilities.includes(cap.id);
        html += `
            <div data-capability-id="${cap.id}" class="selectable-item capability-item ${isSelected ? 'selected' : ''}">
                <h4 class="font-medium text-gray-800">${cap.name}</h4>
                ${cap.description ? `<p class="item-description">${cap.description}</p>` : ''}
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function renderStep2Competencies() {
    if (navigatorState.selectedCapabilities.length === 0) {
        return '<p class="text-center text-gray-500 py-8">Please select at least one capability in the previous step.</p>';
    }
    let html = '';
    navigatorState.selectedCapabilities.forEach(capId => { // capId is a number
        const capability = globalMainState.capabilities.find(c => c.id === capId);
        if (!capability) return;

        html += `<div class="selection-section">`;
        html += `<h4 class="selection-section-title">${capability.name}</h4>`;
        // Ensure comparison is between numbers, and check for both capabilityId and capability_id
        const competenciesForCap = globalMainState.competencies.filter(comp => {
            const compCapabilityId = comp.capabilityId !== undefined ? comp.capabilityId : comp.capability_id;
            return compCapabilityId === capId;
        });
        console.log(`[SkillNavigator] renderStep2Competencies: For Capability ID ${capId} (${capability.name}), found ${competenciesForCap.length} competencies.`);
        if (competenciesForCap.length === 0) {
            html += '<p class="text-sm text-gray-500">No competencies defined for this capability.</p>';
        } else {
            competenciesForCap.forEach(comp => {
                const isSelected = navigatorState.selectedCompetencies.includes(comp.id);
                html += `
                    <label class="checkbox-label ${isSelected ? 'selected' : ''}">
                        <input type="checkbox" data-competency-id="${comp.id}" class="competency-checkbox" ${isSelected ? 'checked' : ''}>
                        <span>${comp.name}</span>
                    </label>
                    ${comp.description ? `<p class="item-description ml-6 mb-2">${comp.description}</p>` : ''}
                `;
            });
        }
        html += `</div>`;
    });
    return html;
}

function renderStep3Behaviors() {
    if (navigatorState.selectedCompetencies.length === 0) {
        return '<p class="text-center text-gray-500 py-8">Please select at least one competency in the previous step.</p>';
    }
    let html = '';
    navigatorState.selectedCompetencies.forEach(compId => { // compId is a number
        const competency = globalMainState.competencies.find(c => c.id === compId);
        
        // --- BEGIN ADDED LOG & FIX for behaviors property name ---
        console.log(`[SkillNavigator] renderStep3Behaviors: Processing Competency ID ${compId} (${competency?.name}). Competency object:`, competency ? JSON.parse(JSON.stringify(competency)) : 'Not Found');
        const behaviorsSource = competency?.behaviours || competency?.behaviors; // Check both spellings/names
        if (!competency || !behaviorsSource || behaviorsSource.length === 0) {
            console.log(`[SkillNavigator] renderStep3Behaviors: No behaviors found for Competency ID ${compId} or competency not found.`);
            // Optionally, add a message to html like "No behaviors defined for [competency name]"
            // For now, it will just skip this competency if no behaviors.
            return; 
        }
        console.log(`[SkillNavigator] renderStep3Behaviors: Found ${behaviorsSource.length} behaviors for Competency ID ${compId}.`);
        // --- END ADDED LOG & FIX ---

        html += `<div class="selection-section">`;
        html += `<h4 class="selection-section-title">Behaviors for: ${competency.name}</h4>`;
        behaviorsSource.forEach(behaviorString => {
            const isSelected = navigatorState.selectedBehaviors.some(b => b.competencyId === compId && b.behaviorString === behaviorString);
            html += `
                <label class="checkbox-label ${isSelected ? 'selected' : ''}">
                    <input type="checkbox" data-competency-id="${compId}" data-behavior-string="${encodeURIComponent(behaviorString)}" class="behavior-checkbox" ${isSelected ? 'checked' : ''}>
                    <span>${behaviorString}</span>
                </label>
            `;
        });
        html += `</div>`;
    });
     if (html === '') {
        html = '<p class="text-center text-gray-500 py-8">No behaviors defined for the selected competencies, or no competencies selected.</p>';
    }
    return html;
}

function renderStep4Skills() {
    if (navigatorState.selectedCompetencies.length === 0) {
        return '<p class="text-center text-gray-500 py-8">Please select competencies to see associated skills.</p>';
    }
    let html = '';
     navigatorState.selectedCompetencies.forEach(compId => {
        const competency = globalMainState.competencies.find(c => c.id === compId);
        if (!competency) return;

        const skillsForComp = globalMainState.ontologySkills.filter(s => s.competencyId === compId);
        if (skillsForComp.length > 0) {
            html += `<div class="selection-section">`;
            html += `<h4 class="selection-section-title">Skills for: ${competency.name}</h4>`;
            skillsForComp.forEach(skill => {
                const selectedSkillData = navigatorState.selectedSkills.find(s => s.skillId === skill.id);
                let currentProficiency = selectedSkillData ? selectedSkillData.proficiency : 0; // 0 for not rated

                // If mapping an AI skill and this skill name matches, try to pre-select proficiency
                if (navigatorState.isMappingAiSkillContext && 
                    navigatorState.mappingAiSkillName && 
                    skill.name.toLowerCase() === navigatorState.mappingAiSkillName.toLowerCase() &&
                    navigatorState.mappingAiSkillProficiencyName &&
                    !selectedSkillData // Only prefill if not already explicitly selected/changed by user in this session
                ) {
                    const targetProfLevel = aiProficiencyNameToOntologyLevel[navigatorState.mappingAiSkillProficiencyName.toLowerCase()];
                    console.log(`[SkillNavigator.renderStep4Skills] AI Mapping: Skill "${skill.name}" matches "${navigatorState.mappingAiSkillName}". AI Proficiency Name: "${navigatorState.mappingAiSkillProficiencyName}", Mapped Level: ${targetProfLevel}`);
                    if (targetProfLevel) {
                        currentProficiency = targetProfLevel;
                        // Automatically add to selectedSkills if prefilling from AI context
                        // This ensures it's part of the review and save if user doesn't change it
                        if (!navigatorState.selectedSkills.some(s => s.skillId === skill.id)) {
                            navigatorState.selectedSkills.push({ skillId: skill.id, proficiency: currentProficiency });
                        }
                    }
                }
                
                html += `
                    <div class="mb-4 p-3 border rounded-md">
                        <h5 class="font-medium text-gray-800">${skill.name}</h5>
                        <p class="item-description">${skill.definition}</p>
                        <div class="mt-2">
                            <span class="text-xs font-medium text-gray-600 mr-2">Proficiency:</span>
                            <div class="proficiency-circles">
                                ${[1, 2, 3, 4, 5].map(level => `
                                    <button data-skill-id="${skill.id}" data-proficiency-level="${level}" 
                                            class="proficiency-circle skill-proficiency-btn ${currentProficiency === level ? 'selected' : ''}">
                                        ${level}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }
    });
    if (html === '') {
        html = '<p class="text-center text-gray-500 py-8">No skills found for the selected competencies.</p>';
    }
    return html;
}

function renderStep5Review() {
    navigatorState.reviewData.capabilities = navigatorState.selectedCapabilities.map(id => globalMainState.capabilities.find(c => c.id === id)).filter(Boolean);
    navigatorState.reviewData.competencies = navigatorState.selectedCompetencies.map(id => globalMainState.competencies.find(c => c.id === id)).filter(Boolean);
    navigatorState.reviewData.behaviors = navigatorState.selectedBehaviors; 
    navigatorState.reviewData.skills = navigatorState.selectedSkills.map(s => {
        const skillDetail = globalMainState.ontologySkills.find(os => os.id === s.skillId);
        if (!skillDetail) return null;
        const profLevel = skillDetail.proficiencyLevels.find(pl => pl.level === s.proficiency);
        return { ...skillDetail, proficiency: s.proficiency, proficiencyName: profLevel ? profLevel.name : 'N/A' };
    }).filter(Boolean);

    let html = '<h3 class="text-lg font-semibold mb-4 text-gray-700">Review Your Selections</h3>';
    html += '<div class="space-y-6">';

    if (navigatorState.reviewData.capabilities.length > 0) {
        html += '<div><h4 class="font-medium text-gray-800 mb-1">Selected Capabilities:</h4><ul class="list-disc list-inside text-sm text-gray-600">';
        navigatorState.reviewData.capabilities.forEach(c => html += `<li>${c.name}</li>`);
        html += '</ul></div>';
    }

    if (navigatorState.reviewData.competencies.length > 0) {
        html += '<div><h4 class="font-medium text-gray-800 mb-1">Selected Competencies:</h4><ul class="list-disc list-inside text-sm text-gray-600">';
        navigatorState.reviewData.competencies.forEach(c => {
            const cap = navigatorState.reviewData.capabilities.find(cap => cap.id === c.capabilityId);
            html += `<li>${c.name} ${cap ? `(${cap.name})` : ''}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (navigatorState.reviewData.behaviors.length > 0) {
        html += '<div><h4 class="font-medium text-gray-800 mb-1">Selected Behaviors:</h4><ul class="list-disc list-inside text-sm text-gray-600">';
        navigatorState.reviewData.behaviors.forEach(b => {
            const comp = globalMainState.competencies.find(c => c.id === b.competencyId); // Use globalMainState for full list
            html += `<li>${b.behaviorString} ${comp ? `(Competency: ${comp.name})` : ''}</li>`;
        });
        html += '</ul></div>';
    }

    if (navigatorState.reviewData.skills.length > 0) {
        html += '<div><h4 class="font-medium text-gray-800 mb-1">Selected Skills & Proficiency:</h4><ul class="list-disc list-inside text-sm text-gray-600">';
        navigatorState.reviewData.skills.forEach(s => {
             const comp = globalMainState.competencies.find(c => c.id === s.competencyId);
            html += `<li>${s.name} - Proficiency: ${s.proficiencyName || s.proficiency} ${comp ? `(Competency: ${comp.name})` : ''}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (navigatorState.reviewData.capabilities.length === 0 && navigatorState.reviewData.competencies.length === 0 && navigatorState.reviewData.behaviors.length === 0 && navigatorState.reviewData.skills.length === 0) {
        html += '<p class="text-gray-500">No selections made.</p>';
    }

    html += '</div>';
    return html;
}


// --- EVENT HANDLERS ---
function handleNext() {
    if (navigatorState.currentStep < NAVIGATOR_STEPS.length) {
        if (navigatorState.currentStep === 1 && navigatorState.selectedCapabilities.length === 0) {
            alert("Please select at least one capability."); return;
        }
        // For AI skill mapping, we might skip directly to skills if a capability/competency can be inferred or if search is good enough.
        // For now, let's assume the user needs to select a competency.
        if (navigatorState.currentStep === 2 && navigatorState.selectedCompetencies.length === 0) {
            alert("Please select at least one competency to find related skills."); return;
        }
        if (navigatorState.currentStep === 4 && navigatorState.selectedSkills.length === 0 && navigatorState.isMappingAiSkillContext) {
            // If mapping an AI skill and no skill was selected in step 4 (e.g. user didn't find a match or didn't set proficiency)
            // we might want to allow proceeding to review, or prompt them. For now, let's allow.
        } else if (navigatorState.currentStep === 4 && navigatorState.selectedSkills.length === 0) {
             alert("Please select at least one skill and set its proficiency."); return;
        }
        navigatorState.currentStep++;
        renderAll();
    }
}

function handleBack() {
    if (navigatorState.currentStep > 1) {
        navigatorState.currentStep--;
        renderAll();
    }
}

function handleSave() {
    const selectedJobIdForSkillMapping = navigatorState.currentJobId;
    
    if (!selectedJobIdForSkillMapping) {
        alert("Error: No job selected. Cannot save.");
        console.error("SkillNavigator: currentJobId is not set in navigatorState during save.");
        return;
    }

    // If we were mapping an AI skill and no actual skill was selected/confirmed in the navigator,
    // treat it as "no mapping found" and don't save anything or remove the raw skill.
    if (navigatorState.isMappingAiSkillContext && navigatorState.selectedSkills.length === 0) {
        alert("No skill from the ontology was selected to map the AI-suggested skill. The AI skill will remain in the 'AI Generated Skills' list.");
        closeSkillNavigator(); // This will reset the mapping context
        return;
    }

    const updatedRoleGroups = globalMainState.roleGroups.map(group => ({
        ...group,
        jobs: group.jobs.map(job => {
            if (job.id === selectedJobIdForSkillMapping) {
                const newSkillsForJob = navigatorState.selectedSkills.map(s => ({ skillId: s.skillId, proficiency: s.proficiency }));
                const existingSkillIds = new Set((job.skills || []).map(js => js.skillId));
                const uniqueNewSkills = newSkillsForJob.filter(s => !existingSkillIds.has(s.skillId));
                
                const newBehaviorsForJob = navigatorState.selectedBehaviors; 
                const existingBehaviorKeys = new Set((job.selectedBehaviors || []).map(b => `${b.competencyId}-${b.behaviorString}`));
                const uniqueNewBehaviors = newBehaviorsForJob.filter(b => !existingBehaviorKeys.has(`${b.competencyId}-${b.behaviorString}`));

                let updatedRawAiSkills = job.rawAiSkills || [];
                // If this save action was part of mapping an AI skill, remove the original raw skill
                // This check ensures we only remove if a skill was actually selected and saved from the navigator.
                if (navigatorState.isMappingAiSkillContext && navigatorState.mappingAiSkillName && navigatorState.selectedSkills.length > 0) {
                    const originalRawSkillName = navigatorState.mappingAiSkillName; // Capture before potential reset by closeSkillNavigator
                    updatedRawAiSkills = updatedRawAiSkills.filter(rawSkill => rawSkill.name.toLowerCase() !== originalRawSkillName.toLowerCase());
                    console.log(`[SkillNavigator.handleSave] AI Mapping: Removed raw AI skill "${originalRawSkillName}" from job.rawAiSkills after successful mapping. New rawAiSkills count: ${updatedRawAiSkills.length}`);
                } else if (navigatorState.isMappingAiSkillContext) {
                    console.log(`[SkillNavigator.handleSave] AI Mapping: Condition for raw skill removal not fully met. isMappingAiSkillContext: ${navigatorState.isMappingAiSkillContext}, mappingAiSkillName: ${navigatorState.mappingAiSkillName}, selectedSkills.length: ${navigatorState.selectedSkills.length}`);
                }


                return {
                    ...job,
                    skills: [...(job.skills || []), ...uniqueNewSkills],
                    selectedBehaviors: [...(job.selectedBehaviors || []), ...uniqueNewBehaviors],
                    rawAiSkills: updatedRawAiSkills
                };
            }
            return job;
        })
    }));
    updateGlobalMainState({ roleGroups: updatedRoleGroups });
    closeSkillNavigator(); // This will also reset the mapping context state
    globalMainHandlers.triggerRender(); 
    console.log('Skill Navigator: Skills and Behaviors saved for job', selectedJobIdForSkillMapping, navigatorState.selectedSkills, navigatorState.selectedBehaviors);
}

function handleCapabilitySearch(event) {
    navigatorState.searchTerm = event.target.value;
    renderStepContent(); 
}

function handleCapabilitySelect(event) {
    // --- BEGIN ADDED LOGS ---
    console.log('[SkillNavigator] handleCapabilitySelect triggered. Event target:', event.target);
    const capabilityItemElement = event.target.closest('.capability-item');
    console.log('[SkillNavigator] handleCapabilitySelect: Closest .capability-item:', capabilityItemElement);
    const capIdString = capabilityItemElement?.dataset.capabilityId;
    const capId = capIdString ? parseInt(capIdString, 10) : null; // Parse to int
    console.log('[SkillNavigator] handleCapabilitySelect: Extracted capId (string):', capIdString, 'Parsed capId (number):', capId);
    // --- END ADDED LOGS ---
    if (capId === null || isNaN(capId)) return; // Check if capId is valid after parsing

    const index = navigatorState.selectedCapabilities.indexOf(capId); // capId is now a number
    if (index > -1) {
        navigatorState.selectedCapabilities.splice(index, 1);
        // --- BEGIN ADDED LOG ---
        console.log('[SkillNavigator] handleCapabilitySelect: Deselected capability. Updated selectedCapabilities:', navigatorState.selectedCapabilities);
        // --- END ADDED LOG ---
    } else {
        navigatorState.selectedCapabilities.push(capId);
        // --- BEGIN ADDED LOG ---
        console.log('[SkillNavigator] handleCapabilitySelect: Selected capability. Updated selectedCapabilities:', navigatorState.selectedCapabilities);
        // --- END ADDED LOG ---
    }
    clearSelectionsForStep(2); 
    // renderStepContent(); // Call renderAll to update footer as well
    renderAll();
}

function handleCompetencySelect(event) {
    const checkbox = event.target;
    if (!checkbox.matches('.competency-checkbox')) return;
    
    const compIdString = checkbox.dataset.competencyId;
    const compId = compIdString ? parseInt(compIdString, 10) : null;

    if (compId === null || isNaN(compId)) {
        console.warn('[SkillNavigator] handleCompetencySelect: Invalid competency ID from dataset:', compIdString);
        return;
    }
    console.log('[SkillNavigator] handleCompetencySelect: Competency checkbox changed. ID (parsed):', compId, 'Checked:', checkbox.checked);

    const index = navigatorState.selectedCompetencies.indexOf(compId);

    if (checkbox.checked) {
        if (index === -1) { // Only add if not already present
            navigatorState.selectedCompetencies.push(compId);
        }
    } else {
        if (index > -1) { // Only remove if present
            navigatorState.selectedCompetencies.splice(index, 1);
        }
    }
    console.log('[SkillNavigator] handleCompetencySelect: Updated selectedCompetencies:', navigatorState.selectedCompetencies);
    clearSelectionsForStep(3);
    // renderStepContent(); // Call renderAll to update footer as well
    renderAll();
}

function handleBehaviorSelect(event) {
    const checkbox = event.target;
    if (!checkbox.matches('.behavior-checkbox')) return;
    const compId = checkbox.dataset.competencyId;
    const behaviorString = decodeURIComponent(checkbox.dataset.behaviorString);

    const behaviorObj = { competencyId: compId, behaviorString: behaviorString };
    const index = navigatorState.selectedBehaviors.findIndex(
        b => b.competencyId === compId && b.behaviorString === behaviorString
    );

    if (checkbox.checked) {
        if (index === -1) {
            navigatorState.selectedBehaviors.push(behaviorObj);
        }
    } else {
        if (index > -1) {
            navigatorState.selectedBehaviors.splice(index, 1);
        }
    }
    clearSelectionsForStep(4); 
    // renderStepContent(); // Call renderAll to update footer as well
    renderAll();
}

function handleSkillProficiencySelect(event) {
    const button = event.target.closest('.skill-proficiency-btn');
    if (!button) return;

    const skillId = button.dataset.skillId;
    const proficiency = parseInt(button.dataset.proficiencyLevel, 10);

    const index = navigatorState.selectedSkills.findIndex(s => s.skillId === skillId);
    if (index > -1) {
        if (navigatorState.selectedSkills[index].proficiency === proficiency) {
            // Optional: toggle off if clicking the same proficiency again
            // navigatorState.selectedSkills.splice(index, 1); 
        } else {
            navigatorState.selectedSkills[index].proficiency = proficiency;
        }
    } else {
        navigatorState.selectedSkills.push({ skillId, proficiency });
    }
    // renderStepContent(); // Call renderAll to update footer as well
    renderAll();
}


// --- EVENT LISTENER ATTACHMENT ---
function addModalEventListeners() {
    modalElement?.addEventListener('click', (event) => {
        if (event.target === modalElement) { 
            closeSkillNavigator();
        }
    });
    modalElement?.querySelector('.skill-navigator-header button')?.addEventListener('click', closeSkillNavigator);
}

function addFooterEventListeners() {
    document.getElementById('navigator-next-btn')?.addEventListener('click', handleNext);
    document.getElementById('navigator-back-btn')?.addEventListener('click', handleBack);
    document.getElementById('navigator-save-btn')?.addEventListener('click', handleSave);
}

function addStepEventListeners() {
    if (navigatorState.currentStep === 1) {
        document.getElementById('capability-search')?.addEventListener('input', handleCapabilitySearch);
        const capabilityItems = document.querySelectorAll('.capability-item');
        // --- BEGIN ADDED LOG ---
        console.log('[SkillNavigator] addStepEventListeners: Found capability items to attach listeners to:', capabilityItems.length);
        // --- END ADDED LOG ---
        capabilityItems.forEach(item => item.addEventListener('click', handleCapabilitySelect));
    } else if (navigatorState.currentStep === 2) {
        document.querySelectorAll('.competency-checkbox').forEach(cb => cb.addEventListener('change', handleCompetencySelect));
    } else if (navigatorState.currentStep === 3) {
        document.querySelectorAll('.behavior-checkbox').forEach(cb => cb.addEventListener('change', handleBehaviorSelect));
    } else if (navigatorState.currentStep === 4) {
        document.querySelectorAll('.skill-proficiency-btn').forEach(btn => btn.addEventListener('click', handleSkillProficiencySelect));
    }
}

// --- MAIN MODAL RENDERING & CONTROL ---
function renderAll() {
    if (!navigatorState.isOpen || !modalElement) return;
    renderModalHeader();
    renderProgressBar();
    renderStepContent();
    renderModalFooter();
}

function createModalDOM() {
    const existingContainer = document.getElementById('skill-navigator-modal-container');
    if (existingContainer && existingContainer.innerHTML.trim() !== '') { // Avoid re-creating if already exists
        modalElement = document.getElementById('skill-navigator-modal-instance');
        modalHeaderTitle = document.getElementById('skill-navigator-title');
        progressBarContainer = document.getElementById('skill-navigator-progress');
        modalBody = document.getElementById('skill-navigator-body-content');
        modalFooter = document.getElementById('skill-navigator-footer-content');
        addModalEventListeners(); // Re-attach top-level modal listeners if needed
        return;
    }
    
    const modalContainer = existingContainer || document.createElement('div');
    if (!existingContainer) {
        modalContainer.id = 'skill-navigator-modal-container'; 
        document.body.appendChild(modalContainer);
    }

    modalContainer.innerHTML = `
        <div class="skill-navigator-modal" id="skill-navigator-modal-instance">
            <div class="skill-navigator-content">
                <header class="skill-navigator-header">
                    <h2 id="skill-navigator-title">Skill Navigator</h2>
                    <button title="Close">${getIcon('X')}</button>
                </header>
                <div class="progress-bar-container" id="skill-navigator-progress"></div>
                <main class="skill-navigator-body" id="skill-navigator-body-content"></main>
                <footer class="skill-navigator-footer" id="skill-navigator-footer-content"></footer>
            </div>
        </div>
    `;
    modalElement = document.getElementById('skill-navigator-modal-instance');
    modalHeaderTitle = document.getElementById('skill-navigator-title');
    progressBarContainer = document.getElementById('skill-navigator-progress');
    modalBody = document.getElementById('skill-navigator-body-content');
    modalFooter = document.getElementById('skill-navigator-footer-content');
    addModalEventListeners();
}

// --- PUBLIC API ---
export function openSkillNavigator(jobId, prefillSearchText = '', prefillProficiencyName = null, isMappingAiSkill = false) {
    if (!jobId) {
        console.error("SkillNavigator: openSkillNavigator called without a jobId.");
        alert("Cannot open Skill Navigator: Job ID is missing.");
        return;
    }
    if (!modalElement || !document.getElementById('skill-navigator-modal-instance')) {
        createModalDOM();
    }
    
    navigatorState.isOpen = true;
    navigatorState.currentStep = 1;
    navigatorState.currentJobId = jobId; // Store the job ID
    clearSelectionsForStep(1); 
    
    // Set AI mapping context
    navigatorState.isMappingAiSkillContext = isMappingAiSkill;
    if (isMappingAiSkill) {
        navigatorState.mappingAiSkillName = prefillSearchText; // Store the original AI skill name
        navigatorState.mappingAiSkillProficiencyName = prefillProficiencyName;
        navigatorState.searchTerm = ''; // Do NOT prefill search for capabilities with the skill name
        console.log(`[SkillNavigator.openSkillNavigator] AI Mapping Context Initiated:
        isMappingAiSkillContext: ${navigatorState.isMappingAiSkillContext},
        mappingAiSkillName: "${navigatorState.mappingAiSkillName}",
        mappingAiSkillProficiencyName: "${navigatorState.mappingAiSkillProficiencyName}",
        (Search term for capabilities is cleared to allow manual capability selection)`);
    } else {
        navigatorState.searchTerm = prefillSearchText || ''; // Standard behavior: prefill if text provided
        navigatorState.mappingAiSkillName = null;
        navigatorState.mappingAiSkillProficiencyName = null;
    }

    modalElement.classList.add('open');
    renderAll(); // This will use the updated searchTerm for initial render of step 1
}

export function closeSkillNavigator() {
    if (modalElement) {
        modalElement.classList.remove('open');
    }
    // Reset state including AI mapping context
    navigatorState.isOpen = false;
    navigatorState.isMappingAiSkillContext = false;
    navigatorState.mappingAiSkillName = null;
    navigatorState.mappingAiSkillProficiencyName = null;
    navigatorState.currentJobId = null; 
    // Consider if searchTerm should be reset here or preserved for next opening. For now, let's reset.
    navigatorState.searchTerm = '';
}

console.log('Skill Navigator module loaded.');
