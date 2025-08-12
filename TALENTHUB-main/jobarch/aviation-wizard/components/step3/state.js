// aviation-wizard/components/step3/state.js
import { state as globalState } from '../../state.js';

export let localState = {
    selectedJobIdForSkillMapping: null,
    isSkillModalOpen: false,
    skillModalCurrentStep: 'selectCapability', // 'selectCapability', 'selectCompetency', 'selectSkillsAndProficiency'
    skillModalSelectedCapabilityId: null,
    skillModalSelectedCompetencyId: null,
    // Stores skills selected in the current modal session, along with their chosen proficiency and details
    skillModalStagedSkills: [],
    // Stores behaviours selected in the current modal session
    skillModalStagedBehaviours: [], // Each item: { competencyId: 'compXX', behaviour: 'Behaviour string' }
    activeJobDetailTab: 'basicInfo', // To manage active tab for job details
};

export const initStep3State = () => {
    // Initialize selectedJobIdForSkillMapping if not set and jobs exist
    if (!localState.selectedJobIdForSkillMapping) {
        const firstJob = globalState.roleGroups.find(rg => rg.jobs.length > 0)?.jobs[0];
        if (firstJob) {
            localState.selectedJobIdForSkillMapping = firstJob.id;
        }
    }
};

// Helper function to update localState if more complex updates are needed or for explicit state changes.
export const updateLocalState = (newState) => {
    localState = { ...localState, ...newState };
};
