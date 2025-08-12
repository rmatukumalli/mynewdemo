// aviation-wizard/components/step3/skillModalRenderer.js
import { getIcon, state as globalState } from '../../state.js';
import { localState } from './state.js';

// --- RENDER FUNCTIONS FOR MODAL STEPS ---
const renderSelectCapabilityStep = () => {
    const { capabilities } = globalState;
    let content = '<h3 class="text-lg font-semibold mb-4 text-gray-700">Step 1: Select a Capability</h3>';
    content += '<div class="space-y-2">';
    capabilities.forEach(cap => {
        content += `
            <button data-capability-id="${cap.id}" class="modal-select-capability-btn w-full text-left p-3 rounded-lg border hover:bg-blue-50 transition-colors ${localState.skillModalSelectedCapabilityId === cap.id ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-500' : 'border-gray-300'}">
                ${cap.name}
            </button>
        `;
    });
    content += '</div>';
    return content;
};

const renderSelectCompetencyStep = () => {
    const selectedCapability = globalState.capabilities.find(c => c.id === localState.skillModalSelectedCapabilityId);
    if (!selectedCapability) return '<p class="text-red-500">Error: Capability not selected or found.</p>';

    const filteredCompetencies = globalState.competencies.filter(comp => comp.capabilityId === localState.skillModalSelectedCapabilityId);
    let content = `<h3 class="text-lg font-semibold mb-4 text-gray-700">Step 2: Select a Competency (under ${selectedCapability.name})</h3>`;
    if (filteredCompetencies.length === 0) {
        content += '<p class="text-gray-500">No competencies found for this capability.</p>';
    } else {
        content += '<div class="space-y-2">';
        filteredCompetencies.forEach(comp => {
            content += `
                <button data-competency-id="${comp.id}" class="modal-select-competency-btn w-full text-left p-3 rounded-lg border hover:bg-blue-50 transition-colors ${localState.skillModalSelectedCompetencyId === comp.id ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-500' : 'border-gray-300'}">
                    ${comp.name}
                </button>
            `;
        });
        content += '</div>';
    }
    return content;
};

const renderSelectSkillsAndProficiencyStep = () => {
    const selectedCompetency = globalState.competencies.find(c => c.id === localState.skillModalSelectedCompetencyId);
    if (!selectedCompetency) return '<p class="text-red-500">Error: Competency not selected or found.</p>';

    const selectedJob = globalState.roleGroups.flatMap(rg => rg.jobs).find(job => job.id === localState.selectedJobIdForSkillMapping);
    const existingSkillIdsInJob = selectedJob ? new Set(selectedJob.skills.map(s => s.skillId)) : new Set();
    // Assume selectedJob.selectedBehaviours is an array of { competencyId, behaviour }
    const existingBehavioursInJob = selectedJob && selectedJob.selectedBehaviours ? 
        new Set(selectedJob.selectedBehaviours.filter(b => b.competencyId === selectedCompetency.id).map(b => b.behaviour)) 
        : new Set();

    const filteredSkills = globalState.ontologySkills.filter(skill => skill.competencyId === localState.skillModalSelectedCompetencyId);
    let content = `<h3 class="text-lg font-semibold mb-4 text-gray-700">Step 3: Select Skills & Proficiency (under ${selectedCompetency.name})</h3>`;

    // Display Behaviours for the selected competency
    if (selectedCompetency.behaviours && selectedCompetency.behaviours.length > 0) {
        content += `
            <div class="mb-4 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <h5 class="text-sm font-semibold text-blue-700 mb-2">Associated Behaviours for ${selectedCompetency.name}:</h5>
                <div class="space-y-2">
                    ${selectedCompetency.behaviours.map(behaviourString => {
                        const isAlreadyInJob = existingBehavioursInJob.has(behaviourString);
                        const isStaged = localState.skillModalStagedBehaviours.some(stagedB => stagedB.competencyId === selectedCompetency.id && stagedB.behaviour === behaviourString);
                        
                        return `
                        <div class="p-2 border rounded-md flex justify-between items-center ${isAlreadyInJob ? 'bg-gray-100 opacity-70' : 'bg-blue-50'}">
                            <p class="text-xs text-blue-700">${behaviourString}</p>
                            ${!isAlreadyInJob ? `
                                <button data-competency-id-for-behaviour="${selectedCompetency.id}" 
                                        data-behaviour-to-stage="${encodeURIComponent(behaviourString)}"
                                        class="modal-stage-behaviour-btn p-1 rounded-md text-xs ml-2
                                               ${isStaged ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-green-100 text-green-500 hover:bg-green-200'}">
                                    ${isStaged ? getIcon('Minus') : getIcon('Plus')}
                                </button>
                            ` : '<span class="text-xs text-gray-500 ml-2">(In job)</span>'}
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    if (filteredSkills.length === 0) {
        content += '<p class="text-gray-500">No skills found for this competency.</p>';
    } else {
        content += '<div class="space-y-4">';
        filteredSkills.forEach(skill => {
            const isAlreadyInJob = existingSkillIdsInJob.has(skill.id);
            const stagedSkill = localState.skillModalStagedSkills.find(s => s.skillId === skill.id);
            const currentProficiency = stagedSkill ? stagedSkill.proficiency : (skill.proficiencyLevels[0]?.level || 1); // Default to first level or 1

            content += `
                <div class="p-3 border rounded-lg ${isAlreadyInJob ? 'bg-gray-100 opacity-70' : 'bg-white'}">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-medium text-gray-800">${skill.name} ${isAlreadyInJob ? '<span class="text-xs text-gray-500">(Already in job)</span>' : ''}</h4>
                            <p class="text-sm text-gray-500">${skill.definition}</p>
                        </div>
                        ${!isAlreadyInJob ? `
                            <button data-skill-id-to-stage="${skill.id}" 
                                    class="modal-stage-skill-btn p-1.5 rounded-md text-sm 
                                           ${stagedSkill ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}">
                                ${stagedSkill ? getIcon('Minus') + ' Remove' : getIcon('Plus') + ' Add'}
                            </button>
                        ` : ''}
                    </div>
                    ${!isAlreadyInJob ? `
                        <div class="mt-2 pt-2 border-t ${stagedSkill ? '' : 'opacity-50 pointer-events-none'}">
                            <label class="block text-xs font-medium text-gray-600 mb-1">Proficiency:</label>
                            <div class="flex space-x-1 bg-gray-100 p-0.5 rounded-md">
                                ${skill.proficiencyLevels.map(pLevel => `
                                    <button data-skill-id-for-proficiency-modal="${skill.id}" data-proficiency-level-modal="${pLevel.level}"
                                            class="modal-skill-proficiency-btn w-full text-center px-2 py-1 text-xs rounded 
                                                   ${currentProficiency === pLevel.level ? 'bg-blue-500 text-white font-semibold shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-200'}">
                                        ${pLevel.name}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        content += '</div>';
    }
    return content;
};


// Render the "Add Skill" Modal
export const renderAddSkillModal = () => {
    if (!localState.isSkillModalOpen) return '<div id="skill-modal-placeholder"></div>';

    let currentStepContent = '';
    let modalTitle = "Add Skills from Ontology";

    switch (localState.skillModalCurrentStep) {
        case 'selectCapability':
            currentStepContent = renderSelectCapabilityStep();
            modalTitle = "Add Skills - Step 1: Select Capability";
            break;
        case 'selectCompetency':
            currentStepContent = renderSelectCompetencyStep();
            const capName = globalState.capabilities.find(c => c.id === localState.skillModalSelectedCapabilityId)?.name || '';
            modalTitle = `Add Skills - Step 2: Select Competency ${capName ? `for ${capName}` : ''}`;
            break;
        case 'selectSkillsAndProficiency':
            currentStepContent = renderSelectSkillsAndProficiencyStep();
            const compName = globalState.competencies.find(c => c.id === localState.skillModalSelectedCompetencyId)?.name || '';
            modalTitle = `Add Skills - Step 3: Select Skills ${compName ? `for ${compName}` : ''}`;
            break;
        default:
            currentStepContent = '<p class="text-red-500">Error: Unknown modal step.</p>';
    }
    
    // Breadcrumbs for navigation context
    let breadcrumbs = `<nav class="text-sm text-gray-500 mb-3">`;
    breadcrumbs += `<span class="${localState.skillModalCurrentStep === 'selectCapability' ? 'font-semibold text-blue-600' : ''}">Capability</span>`;
    if (localState.skillModalSelectedCapabilityId || localState.skillModalCurrentStep !== 'selectCapability') {
        breadcrumbs += ` ${getIcon('ChevronRight')} <span class="${localState.skillModalCurrentStep === 'selectCompetency' ? 'font-semibold text-blue-600' : ''}">Competency</span>`;
    }
    if (localState.skillModalSelectedCompetencyId || localState.skillModalCurrentStep === 'selectSkillsAndProficiency') {
         breadcrumbs += ` ${getIcon('ChevronRight')} <span class="${localState.skillModalCurrentStep === 'selectSkillsAndProficiency' ? 'font-semibold text-blue-600' : ''}">Skills & Proficiency</span>`;
    }
    breadcrumbs += `</nav>`;


    let modalHtml = `
        <div id="add-skill-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-full max-h-[90vh] flex flex-col">
                <header class="p-4 border-b flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-800">${modalTitle}</h2>
                    <button id="close-skill-modal-btn-header" class="p-1 rounded-full hover:bg-gray-100">${getIcon('X')}</button>
                </header>
                <main class="flex-grow overflow-y-auto p-6">
                    ${breadcrumbs}
                    ${currentStepContent}
                </main>
                <footer class="p-4 border-t flex justify-between items-center bg-gray-50 rounded-b-lg">
                    <div> <!-- Back button container -->
                        ${localState.skillModalCurrentStep !== 'selectCapability' ? `
                            <button id="modal-back-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                ${getIcon('ChevronLeft')} Back
                            </button>
                        ` : ''}
                    </div>
                    <div class="flex space-x-3"> <!-- Right side buttons -->
                        <button id="close-skill-modal-btn-footer" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                        ${localState.skillModalCurrentStep !== 'selectSkillsAndProficiency' ? `
                            <button id="modal-next-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
                                    ${(localState.skillModalCurrentStep === 'selectCapability' && !localState.skillModalSelectedCapabilityId) || (localState.skillModalCurrentStep === 'selectCompetency' && !localState.skillModalSelectedCompetencyId) ? 'disabled' : ''}>
                                Next ${getIcon('ChevronRight')}
                            </button>
                        ` : `
                            <button id="add-selected-skills-btn" 
                                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
                                    ${localState.skillModalStagedSkills.length === 0 ? 'disabled' : ''}>
                                Add ${localState.skillModalStagedSkills.length + localState.skillModalStagedBehaviours.length > 0 ? `(${localState.skillModalStagedSkills.length + localState.skillModalStagedBehaviours.length})` : ''} Item(s)
                            </button>
                        `}
                    </div>
                </footer>
            </div>
        </div>
    `;
    return modalHtml;
};
