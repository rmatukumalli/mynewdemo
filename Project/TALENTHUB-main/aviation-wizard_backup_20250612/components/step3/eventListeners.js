// aviation-wizard/components/step3/eventListeners.js
import { state as globalState } from '../../state.js'; // For ontologySkills
import { localState } from './state.js';
import * as handlers from './eventHandlers.js';

// This function needs to be exported so it can be called by eventHandlers.js for targeted modal re-renders.
export const addSkillModalEventListeners = () => {
    // Listeners for inside the modal
    document.getElementById('close-skill-modal-btn-header')?.addEventListener('click', handlers.handleCloseSkillModal);
    document.getElementById('close-skill-modal-btn-footer')?.addEventListener('click', handlers.handleCloseSkillModal);
    
    // Navigation buttons
    document.getElementById('modal-next-btn')?.addEventListener('click', handlers.handleModalNext);
    document.getElementById('modal-back-btn')?.addEventListener('click', handlers.handleModalBack);
    
    // Action button (Add Skills)
    document.getElementById('add-selected-skills-btn')?.addEventListener('click', handlers.handleAddSelectedSkillsToJob);

    // --- Listeners for specific steps ---
    if (localState.skillModalCurrentStep === 'selectCapability') {
        document.querySelectorAll('.modal-select-capability-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handlers.handleSelectCapability(e.currentTarget.dataset.capabilityId));
        });
    } else if (localState.skillModalCurrentStep === 'selectCompetency') {
        document.querySelectorAll('.modal-select-competency-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handlers.handleSelectCompetency(e.currentTarget.dataset.competencyId));
        });
    } else if (localState.skillModalCurrentStep === 'selectSkillsAndProficiency') {
        document.querySelectorAll('.modal-stage-skill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skillId = e.currentTarget.dataset.skillIdToStage;
                const isStaged = localState.skillModalStagedSkills.some(s => s.skillId === skillId);
                if (isStaged) {
                    handlers.handleRemoveStagedSkill(skillId);
                } else {
                    const skillData = globalState.ontologySkills.find(s => s.id === skillId);
                    if (skillData) {
                        const defaultProficiency = skillData.proficiencyLevels[0]?.level || 1;
                        handlers.handleStageSkill(skillId, defaultProficiency, skillData);
                    }
                }
            });
        });
        document.querySelectorAll('.modal-skill-proficiency-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skillId = e.currentTarget.dataset.skillIdForProficiencyModal;
                const proficiency = parseInt(e.currentTarget.dataset.proficiencyLevelModal, 10);
                const skillData = globalState.ontologySkills.find(s => s.id === skillId);
                let stagedSkill = localState.skillModalStagedSkills.find(s => s.skillId === skillId);
                if (!stagedSkill && skillData) {
                    handlers.handleStageSkill(skillId, proficiency, skillData);
                } else if (stagedSkill) {
                    handlers.handleUpdateStagedSkillProficiency(skillId, proficiency);
                }
            });
        });

        // Event listeners for staging/unstaging behaviours
        document.querySelectorAll('.modal-stage-behaviour-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const competencyId = e.currentTarget.dataset.competencyIdForBehaviour;
                const behaviourString = decodeURIComponent(e.currentTarget.dataset.behaviourToStage);
                const isStaged = localState.skillModalStagedBehaviours.some(
                    b => b.competencyId === competencyId && b.behaviour === behaviourString
                );

                if (isStaged) {
                    handlers.handleRemoveStagedBehaviour(competencyId, behaviourString);
                } else {
                    handlers.handleStageBehaviour(competencyId, behaviourString);
                }
            });
        });
    }
};

export const addStep3EventListeners = (container, openModalForItemFn) => {
    // Job selection
    container.querySelectorAll('.select-job-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handlers.handleSelectJobForSkillMapping(e.currentTarget.dataset.jobId));
    });

    // "Add Job to Group" buttons
    container.querySelectorAll('.add-job-to-group-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const groupId = e.currentTarget.dataset.groupId;
            openModalForItemFn('job', groupId); // This uses the main modal system from parent
        });
    });
    
    // Open "Add Skill" modal
    container.querySelector('#open-skill-modal-btn')?.addEventListener('click', handlers.handleOpenSkillModal);
    container.querySelector('#open-skill-modal-btn-empty')?.addEventListener('click', handlers.handleOpenSkillModal);

    // Remove skill from job
    container.querySelectorAll('.remove-skill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handlers.handleRemoveSkillFromJob(e.currentTarget.dataset.skillIdToRemove));
    });

    // Update proficiency for a job skill
    container.querySelectorAll('.update-proficiency-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const skillId = e.currentTarget.dataset.skillIdForProficiency;
            const newProficiency = e.currentTarget.dataset.proficiencyLevel;
            handlers.handleUpdateProficiencyForJobSkill(skillId, newProficiency);
        });
    });
    
    // If modal is open, attach its internal listeners
    if (localState.isSkillModalOpen) {
        addSkillModalEventListeners();
    }

    // Job detail input fields
    const jobDetailFields = [
        'jobFamily', 'department', 'workLocation', 'businessUnit',
        'roleGroup', 'roleLevelName', 
        'roleSummary', 'responsibilities', 'yearsOfExperience',
        // 'additionalQualifications', 'benefits' // These were readonly in original
    ];
    jobDetailFields.forEach(fieldName => {
        const inputElement = container.querySelector(`#${fieldName}`);
        inputElement?.addEventListener('change', handlers.handleJobDetailChange);
    });

    // Tab navigation
    container.querySelectorAll('.job-detail-tab').forEach(tabButton => {
        tabButton.addEventListener('click', (e) => {
            const tabId = e.currentTarget.dataset.tabId;
            if (tabId) {
                handlers.handleJobDetailTabClick(tabId);
            }
        });
    });

    // "Populate with AI" buttons
    container.querySelectorAll('.populate-with-ai-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const fieldName = e.currentTarget.dataset.fieldName;
            if (fieldName) {
                handlers.handlePopulateWithAI(fieldName);
            }
        });
    });

    // "Generate/Update with AI" button for the entire job description
    const generateWithAIButton = container.querySelector('#generate-with-ai-btn');
    if (generateWithAIButton) {
        generateWithAIButton.addEventListener('click', handlers.handleGenerateJobWithAI);
    }

    // "Map to Ontology" buttons for raw AI skills
    container.querySelectorAll('.map-ai-skill-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const rawSkillName = decodeURIComponent(e.currentTarget.dataset.rawSkillName);
            const rawSkillProficiency = decodeURIComponent(e.currentTarget.dataset.rawSkillProficiency);
            handlers.handleMapAiSkillToOntology(rawSkillName, rawSkillProficiency);
        });
    });
};
