import { state, STEPS, updateState, generateId } from './state.js';
import { renderApp } from './render.js';
import { openModal as openModalUI, closeModal as closeModalUI } from './components/modal.js';

// --- RENDER TRIGGER ---
// This function will be called by main.js after state changes that require a re-render.
// It's also called internally by some handlers after state mutation.
function triggerRender() {
    // Pass the handler object itself to renderApp so it can wire up event listeners in components
    renderApp(state, STEPS, handlers);
}

// --- NAVIGATION HANDLERS ---
const goToStep = (step) => {
    // Allow navigation to any step via stepper click
    if (step >= 1 && step <= STEPS.length) {
        updateState({ currentStep: step });
        triggerRender();
    }
    // Optionally, track visited steps if complex navigation rules are needed later
    // const visited = state.visitedSteps || new Set();
    // visited.add(state.currentStep);
    // updateState({ visitedSteps: visited });
};

const nextStep = () => {
    if (state.currentStep < STEPS.length) {
        updateState({ currentStep: state.currentStep + 1 });
        triggerRender();
    }
};

const prevStep = () => {
    if (state.currentStep > 1) {
        updateState({ currentStep: state.currentStep - 1 });
        triggerRender();
    }
};

// --- MODAL & DATA HANDLERS ---
const handleOpenModal = (type, id1, id2) => {
    // Pass the actual handleSave function to the UI modal opener
    openModalUI(type, id1, id2, handleSave);
};

const handleCloseModal = () => {
    closeModalUI();
    // No re-render needed just for closing modal unless state changed before closing
};

const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const { type, id1, id2 } = state.editingTarget; // Get IDs from stored editingTarget
    const currentItem = state.editingTarget.currentItem; // Get currentItem from stored editingTarget

    if (type === 'organization') {
        const data = {
            name: form.name.value,
            description: form.description.value,
        };
        const newOrganizations = currentItem ?
            state.organizations.map(o => o.id === id1 ? { ...o, ...data } : o) :
            [...state.organizations, { ...data, id: generateId() }];
        updateState({ organizations: newOrganizations });
    } else if (type === 'businessUnit') {
        const data = {
            name: form.name.value,
            description: form.description.value,
            organizationId: form.organizationId.value,
        };
        const newBusinessUnits = currentItem ?
            state.businessUnits.map(bu => bu.id === id1 ? { ...bu, ...data } : bu) :
            [...state.businessUnits, { ...data, id: generateId() }];
        updateState({ businessUnits: newBusinessUnits });
    } else if (type === 'department') {
        const data = {
            name: form.name.value,
            description: form.description.value,
            businessUnitId: form.businessUnitId.value,
        };
        const newDepartments = currentItem ?
            state.departments.map(d => d.id === id1 ? { ...d, ...data } : d) :
            [...state.departments, { ...data, id: generateId() }];
        updateState({ departments: newDepartments });
    } else if (type === 'group') {
        const data = { 
            name: form.name.value, 
            description: form.description.value,
            departmentId: form.departmentId.value, // Added departmentId
            status: form.status ? form.status.value : 'draft',
            jobFamily: form.jobFamily ? form.jobFamily.value : '',
            tags: form.tags ? form.tags.value.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            aiSuggested: form.aiSuggested ? form.aiSuggested.checked : false,
            benchmarkData: form.benchmarkDataSource && form.benchmarkDataSource.value ? { 
                source: form.benchmarkDataSource.value, 
                reference: form.benchmarkDataReference ? form.benchmarkDataReference.value : '' 
            } : null
        };
        const newGroups = currentItem ?
            state.roleGroups.map(g => g.id === id1 ? { ...g, ...data } : g) :
            [...state.roleGroups, { ...data, id: generateId(), jobs: [], status: data.status || 'draft', aiSuggested: data.aiSuggested || false, tags: data.tags || [], benchmarkData: data.benchmarkData || null }];
        updateState({ roleGroups: newGroups });
    } else if (type === 'level') {
        const coreCompetenciesRaw = form.coreCompetencies ? form.coreCompetencies.value : '';
        const parsedCompetencies = coreCompetenciesRaw.split(',')
            .map(cc => {
                const parts = cc.split(':');
                if (parts.length === 2 && parts[0].trim() && !isNaN(parseInt(parts[1].trim()))) {
                    return { competencyId: parts[0].trim(), expectedProficiency: parseInt(parts[1].trim()) };
                }
                return null;
            })
            .filter(cc => cc !== null);

        const data = { 
            name: form.name.value, 
            description: form.description.value,
            levelType: form.levelType ? form.levelType.value : 'global', // Default to global
            coreCompetencies: parsedCompetencies,
            salaryBandId: form.salaryBandId ? form.salaryBandId.value : '',
            progressionTo: form.progressionTo ? form.progressionTo.value.split(',').map(id => id.trim()).filter(id => id) : []
        };
        const newLevels = currentItem ?
            state.jobLevels.map(l => l.id === id1 ? { ...l, ...data } : l) :
            [...state.jobLevels, { ...data, id: generateId(), levelType: data.levelType || 'global', coreCompetencies: data.coreCompetencies || [], progressionTo: data.progressionTo || [] }]; // Ensure defaults for new items
        updateState({ jobLevels: newLevels });
    } else if (type === 'job') {
        // Note: Job saving logic is not part of this enhancement's scope for Step 1 & 2, but kept for integrity.
        const data = { title: form.title.value, level: form.level.value, skills: form.skills.value }; // This skills field is likely a placeholder or simplified input
        const groupForJob = state.editingTarget.groupForJob; // Get group from stored editingTarget
        if (!groupForJob) {
            console.error("Group not found during save for job:", id1);
            closeModalUI();
            triggerRender(); // Re-render to reflect any partial state changes or clear modal
            return;
        }
        const newGroups = state.roleGroups.map(g => {
            if (g.id === groupForJob.id) { // Use groupForJob.id (which is id1)
                const newJobs = currentItem ?
                    g.jobs.map(j => j.id === id2 ? { ...j, ...data } : j) :
                    [...g.jobs, { ...data, id: generateId() }];
                return { ...g, jobs: newJobs };
            }
            return g;
        });
        updateState({ roleGroups: newGroups });
    }

    closeModalUI();
    triggerRender(); // Re-render the app to show changes
};

const handleDeleteItem = (type, id1, id2) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

    if (type === 'organization') {
        // Basic deletion: Does not yet handle orphaned business units.
        updateState({ organizations: state.organizations.filter(o => o.id !== id1) });
        // Future enhancement: Check for and handle/warn about child business units.
    } else if (type === 'businessUnit') {
        // Basic deletion: Does not yet handle orphaned departments.
        updateState({ businessUnits: state.businessUnits.filter(bu => bu.id !== id1) });
        // Future enhancement: Check for and handle/warn about child departments.
    } else if (type === 'department') {
        // Basic deletion: Does not yet handle orphaned role groups.
        updateState({ departments: state.departments.filter(d => d.id !== id1) });
        // Future enhancement: Check for and handle/warn about child role groups.
    } else if (type === 'group') {
        updateState({ roleGroups: state.roleGroups.filter(g => g.id !== id1) });
    } else if (type === 'level') {
        updateState({ jobLevels: state.jobLevels.filter(l => l.id !== id1) });
    } else if (type === 'job') {
        const newGroups = state.roleGroups.map(g => {
            if (g.id === id1) { // id1 is groupId for jobs
                return { ...g, jobs: g.jobs.filter(j => j.id !== id2) }; // id2 is jobId
            }
            return g;
        });
        updateState({ roleGroups: newGroups });
    }
    triggerRender(); // Re-render the app
};

// Export all handlers for main.js to use
export const handlers = {
    goToStep,
    nextStep,
    prevStep,
    openModal: handleOpenModal, // Use the wrapper
    closeModal: handleCloseModal, // Use the wrapper
    handleSave, // Exposed if direct call needed, though openModalUI wires it
    deleteItem: handleDeleteItem,
    triggerRender // Expose for main.js to call initially
};
