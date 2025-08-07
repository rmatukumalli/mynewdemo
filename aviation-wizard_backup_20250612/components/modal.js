import { state, getIcon, updateState } from '../state.js'; // Import updateState

const modalContainer = document.getElementById('modal-container');

export function openModal(type, id1, id2, handleSaveFn) {
    let title = '';
    let body = '';
    let currentItem = null;
    let currentGroupForJob = null; // For job editing/creation

    updateState({ editingTarget: { type, id1, id2 } }); // Store ids for saving

    if (type === 'organization') {
        currentItem = id1 ? state.organizations.find(o => o.id === id1) : null;
        title = currentItem ? 'Edit Organization' : 'Create Organization';
        body = `<form id="modal-form" class="p-6 space-y-4">
            <div><label for="name" class="block text-sm font-medium text-gray-700">Organization Name</label><input id="name" name="name" type="text" value="${currentItem?.name || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required /></div>
            <div><label for="description" class="block text-sm font-medium text-gray-700">Description</label><textarea id="description" name="description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>${currentItem?.description || ''}</textarea></div>
        </form>`;
        updateState({ editingTarget: { ...state.editingTarget, currentItem } });
    } else if (type === 'businessUnit') {
        currentItem = id1 ? state.businessUnits.find(bu => bu.id === id1) : null;
        title = currentItem ? 'Edit Business Unit' : 'Create Business Unit';
        const organizationOptions = state.organizations.map(o => `<option value="${o.id}" ${currentItem?.organizationId === o.id ? 'selected' : ''}>${o.name}</option>`).join('');
        body = `<form id="modal-form" class="p-6 space-y-4">
            <div><label for="name" class="block text-sm font-medium text-gray-700">Business Unit Name</label><input id="name" name="name" type="text" value="${currentItem?.name || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required /></div>
            <div><label for="description" class="block text-sm font-medium text-gray-700">Description</label><textarea id="description" name="description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>${currentItem?.description || ''}</textarea></div>
            <div><label for="organizationId" class="block text-sm font-medium text-gray-700">Parent Organization</label><select id="organizationId" name="organizationId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required><option value="">Select Organization</option>${organizationOptions}</select></div>
        </form>`;
        updateState({ editingTarget: { ...state.editingTarget, currentItem } });
    } else if (type === 'department') {
        currentItem = id1 ? state.departments.find(d => d.id === id1) : null;
        title = currentItem ? 'Edit Department' : 'Create Department';
        const businessUnitOptions = state.businessUnits.map(bu => `<option value="${bu.id}" ${currentItem?.businessUnitId === bu.id ? 'selected' : ''}>${bu.name}</option>`).join('');
        body = `<form id="modal-form" class="p-6 space-y-4">
            <div><label for="name" class="block text-sm font-medium text-gray-700">Department Name</label><input id="name" name="name" type="text" value="${currentItem?.name || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required /></div>
            <div><label for="description" class="block text-sm font-medium text-gray-700">Description</label><textarea id="description" name="description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>${currentItem?.description || ''}</textarea></div>
            <div><label for="businessUnitId" class="block text-sm font-medium text-gray-700">Parent Business Unit</label><select id="businessUnitId" name="businessUnitId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required><option value="">Select Business Unit</option>${businessUnitOptions}</select></div>
        </form>`;
        updateState({ editingTarget: { ...state.editingTarget, currentItem } });
    } else if (type === 'group') {
        currentItem = id1 ? state.roleGroups.find(g => g.id === id1) : null;
        title = currentItem ? 'Edit Role Group' : 'Create Role Group';
        const departmentOptions = state.departments.map(d => `<option value="${d.id}" ${currentItem?.departmentId === d.id ? 'selected' : ''}>${d.name}</option>`).join('');
        const statusOptions = ['draft', 'active', 'archived'].map(s => `<option value="${s}" ${currentItem?.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('');
        body = `<form id="modal-form" class="p-6 space-y-4">
            <div><label for="name" class="block text-sm font-medium text-gray-700">Group Name</label><input id="name" name="name" type="text" value="${currentItem?.name || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required /></div>
            <div><label for="description" class="block text-sm font-medium text-gray-700">Description</label><textarea id="description" name="description" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>${currentItem?.description || ''}</textarea></div>
            <div><label for="departmentId" class="block text-sm font-medium text-gray-700">Parent Department</label><select id="departmentId" name="departmentId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required><option value="">Select Department</option>${departmentOptions}</select></div>
            <div><label for="status" class="block text-sm font-medium text-gray-700">Status</label><select id="status" name="status" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">${statusOptions}</select></div>
            <div><label for="jobFamily" class="block text-sm font-medium text-gray-700">Job Family</label><input id="jobFamily" name="jobFamily" type="text" value="${currentItem?.jobFamily || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., Aviation Operations" /></div>
            <div><label for="tags" class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label><input id="tags" name="tags" type="text" value="${currentItem?.tags?.join(', ') || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., flight_crew, operations" /></div>
            <div class="flex items-center">
                <input id="aiSuggested" name="aiSuggested" type="checkbox" ${currentItem?.aiSuggested ? 'checked' : ''} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label for="aiSuggested" class="ml-2 block text-sm text-gray-900">AI Suggested</label>
            </div>
            <div class="text-xs text-gray-600 mt-1 p-2 bg-blue-50 border border-blue-200 rounded-md">Indicates if this role group was initially proposed or generated by an AI feature.</div>
            <fieldset class="border border-gray-300 p-3 rounded-md">
                <legend class="text-sm font-medium text-gray-700 px-1">Benchmark Data (Optional)</legend>
                <div class="space-y-2">
                    <div><label for="benchmarkDataSource" class="block text-xs font-medium text-gray-600">Source</label><input id="benchmarkDataSource" name="benchmarkDataSource" type="text" value="${currentItem?.benchmarkData?.source || ''}" class="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., IndustryReport2024" /></div>
                    <div><label for="benchmarkDataReference" class="block text-xs font-medium text-gray-600">Reference</label><input id="benchmarkDataReference" name="benchmarkDataReference" type="text" value="${currentItem?.benchmarkData?.reference || ''}" class="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., FO-Grp-101" /></div>
                </div>
            </fieldset>
        </form>`;
        updateState({ editingTarget: { ...state.editingTarget, currentItem } });
    } else if (type === 'level') {
        currentItem = id1 ? state.jobLevels.find(l => l.id === id1) : null;
        title = currentItem ? 'Edit Job Level' : 'Create Job Level';
        const levelTypeOptions = ['global', 'department-specific', 'role-group-specific'].map(lt => `<option value="${lt}" ${currentItem?.levelType === lt ? 'selected' : ''}>${lt.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>`).join('');
        const coreCompetenciesValue = currentItem?.coreCompetencies?.map(cc => `${cc.competencyId}:${cc.expectedProficiency}`).join(', ') || '';
        const progressionToValue = currentItem?.progressionTo?.join(', ') || '';

        body = `<form id="modal-form" class="p-6 space-y-4">
            <div><label for="name" class="block text-sm font-medium text-gray-700">Level Name (e.g., L1, L5)</label><input id="name" name="name" type="text" value="${currentItem?.name || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required /></div>
            <div><label for="description" class="block text-sm font-medium text-gray-700">Description</label><input id="description" name="description" value="${currentItem?.description || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required /></div>
            <div><label for="levelType" class="block text-sm font-medium text-gray-700">Level Type</label><select id="levelType" name="levelType" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">${levelTypeOptions}</select></div>
            <div><label for="coreCompetencies" class="block text-sm font-medium text-gray-700">Core Competencies (ID:Proficiency, comma-separated)</label><input id="coreCompetencies" name="coreCompetencies" type="text" value="${coreCompetenciesValue}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., c1:1, c2:2" /></div>
            <div><label for="salaryBandId" class="block text-sm font-medium text-gray-700">Salary Band ID</label><input id="salaryBandId" name="salaryBandId" type="text" value="${currentItem?.salaryBandId || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., SB-Entry" /></div>
            <div><label for="progressionTo" class="block text-sm font-medium text-gray-700">Progression To (Level IDs, comma-separated)</label><input id="progressionTo" name="progressionTo" type="text" value="${progressionToValue}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="e.g., l2, l3" /></div>
        </form>`;
        updateState({ editingTarget: { ...state.editingTarget, currentItem } });
    } else if (type === 'job') {
        currentGroupForJob = state.roleGroups.find(g => g.id === id1);
        if (!currentGroupForJob) {
            console.error("Group not found for job modal:", id1);
            return; // Or handle error appropriately
        }
        currentItem = id2 ? currentGroupForJob.jobs.find(j => j.id === id2) : null;
        title = currentItem ? `Edit Job in ${currentGroupForJob.name}` : `Add New Job to ${currentGroupForJob.name}`;
        const levelOptions = state.jobLevels.map(l => `<option value="${l.name}" ${currentItem?.level === l.name ? 'selected' : ''}>${l.name} - ${l.description}</option>`).join('');
        body = `<form id="modal-form" class="p-6 space-y-4">
            <div><label for="title" class="block text-sm font-medium text-gray-700">Job Title</label><input id="title" type="text" value="${currentItem?.title || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required /></div>
            <div><label for="level" class="block text-sm font-medium text-gray-700">Job Level</label><select id="level" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required><option value="">Select a level</option>${levelOptions}</select></div>
            <div><label for="skills" class="block text-sm font-medium text-gray-700">Key Skills</label><input id="skills" value="${currentItem?.skills || ''}" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Comma-separated, e.g., CRM, ATP License" required /></div>
        </form>`;
        updateState({ editingTarget: { ...state.editingTarget, currentItem, groupForJob: currentGroupForJob } });
    }
    
    modalContainer.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 modal-overlay" id="modal-backdrop">
            <div class="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="flex justify-between items-center p-4 border-b">
                    <h3 id="modal-title" class="text-lg font-bold text-gray-900">${title}</h3>
                    <button id="close-modal-btn-x" class="p-1.5 text-gray-400 hover:text-gray-800 rounded-full">${getIcon('X')}</button>
                </div>
                ${body}
                <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
                    <button type="button" id="close-modal-btn-cancel" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" form="modal-form" id="save-modal-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">${currentItem ? 'Save Changes' : 'Create'}</button>
                </div>
            </div>
        </div>`;

    document.getElementById('modal-form').addEventListener('submit', handleSaveFn);
    document.getElementById('close-modal-btn-x').addEventListener('click', closeModal);
    document.getElementById('close-modal-btn-cancel').addEventListener('click', closeModal);
    
    // Focus on the first input field
    const firstInput = modalContainer.querySelector('input, select, textarea');
    if (firstInput) {
        firstInput.focus();
    }
}

export function closeModal() {
    modalContainer.innerHTML = '';
    updateState({ editingTarget: null });
}
