import { getIcon, state as globalState } from '../state.js'; // Added globalState import
import { renderStep3Content, initStep3State } from './step3/index.js'; // Updated path

const stepHeader = (title, subtitle) => `<div class="mb-4"><h2 class="text-2xl font-bold text-gray-800">${title}</h2><p class="text-gray-600 mt-1">${subtitle}</p></div>`; // Reduced mb-6 to mb-4
const emptyState = (text) => `<p class="text-center text-gray-500 py-6">${text}</p>`; // Reduced py-8 to py-6

const listItem = (item, type, openModalFn, deleteItemFn) => {
    let detailsHTML = '';
    if (type === 'organization') {
        detailsHTML = `<p class="text-sm text-gray-600">${item.description}</p>`;
    } else if (type === 'businessUnit') {
        const org = globalState.organizations.find(o => o.id === item.organizationId);
        detailsHTML = `
            <p class="text-sm text-gray-600">${item.description}</p>
            <div class="mt-2 text-xs text-gray-500 space-y-1">
                ${org ? `<p><strong>Organization:</strong> ${org.name}</p>` : ''}
            </div>
        `;
    } else if (type === 'department') {
        const bu = globalState.businessUnits.find(b => b.id === item.businessUnitId);
        detailsHTML = `
            <p class="text-sm text-gray-600">${item.description}</p>
            <div class="mt-2 text-xs text-gray-500 space-y-1">
                ${bu ? `<p><strong>Business Unit:</strong> ${bu.name}</p>` : ''}
            </div>
        `;
    } else if (type === 'group') {
        const dept = globalState.departments.find(d => d.id === item.departmentId);
        detailsHTML = `
            <p class="text-sm text-gray-600">${item.description}</p>
            <div class="mt-2 text-xs text-gray-500 space-y-1">
                <p><strong>Status:</strong> <span class="px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-700' : item.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}">${item.status || 'N/A'}</span> ${item.aiSuggested ? '<span class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">AI Suggested</span>' : ''}</p>
                ${dept ? `<p><strong>Department:</strong> ${dept.name}</p>` : ''}
                ${item.jobFamily ? `<p><strong>Family:</strong> ${item.jobFamily}</p>` : ''}
                ${item.tags && item.tags.length > 0 ? `<p><strong>Tags:</strong> ${item.tags.map(tag => `<span class="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 mr-1 mb-1">${tag}</span>`).join('')}</p>` : ''}
                ${item.benchmarkData ? `<p><strong>Benchmark:</strong> ${item.benchmarkData.source} (${item.benchmarkData.reference || 'N/A'})</p>` : ''}
            </div>
        `;
    } else if (type === 'level') {
        detailsHTML = `
            <p class="text-sm text-gray-600">${item.description}</p>
            <div class="mt-2 text-xs text-gray-500 space-y-1">
                ${item.levelType ? `<p><strong>Type:</strong> ${item.levelType}</p>` : ''}
                ${item.coreCompetencies && item.coreCompetencies.length > 0 ? `<p><strong>Core Competencies:</strong> ${item.coreCompetencies.length} defined</p>` : ''}
                ${item.salaryBandId ? `<p><strong>Salary Band:</strong> ${item.salaryBandId}</p>` : ''}
                ${item.progressionTo && item.progressionTo.length > 0 ? `<p><strong>Progression To:</strong> ${item.progressionTo.join(', ')}</p>` : ''}
            </div>
        `;
    } else { // Fallback for other types or if job details were to be shown here
        detailsHTML = `<p class="text-sm text-gray-600">${item.description || `Details not available for this type.`}</p>`;
    }

    return `
    <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-start border">
        <div class="flex-grow">
            <h3 class="font-bold text-lg text-gray-900">${item.name || item.title}</h3>
            ${detailsHTML}
        </div>
        <div class="flex flex-col space-y-1 ml-2 flex-shrink-0">
            <button data-modal-type="${type}" data-item-id="${item.id}" class="edit-btn p-2 text-gray-500 hover:text-blue-600 rounded-md flex items-center justify-center w-10 h-10">${getIcon('Edit')}</button>
            <button data-delete-type="${type}" data-item-id="${item.id}" class="delete-btn p-2 text-gray-500 hover:text-red-600 rounded-md flex items-center justify-center w-10 h-10">${getIcon('Trash')}</button>
        </div>
    </div>`;
};

const addEventListenersForListItems = (container, openModalFn, deleteItemFn) => {
    container.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.modalType;
            const id = e.currentTarget.dataset.itemId;
            openModalFn(type, id);
        });
    });
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.deleteType;
            const id = e.currentTarget.dataset.itemId;
            deleteItemFn(type, id);
        });
    });
};


export const renderStepContent = (container, state, STEPS, openModalFn, deleteItemFn) => {
    let contentHTML = '';
    switch (state.currentStep) {
        case 1: // Organization
            const organizationsTableRows = state.organizations.map(org => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">${org.id}</td>
                    <td class="px-6 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">${org.name}</td>
                    <td class="px-6 py-3 text-sm text-gray-600 max-w-md truncate" title="${org.description}">${org.description}</td>
                    <td class="px-6 py-3 text-right text-sm font-medium whitespace-nowrap">
                        <button data-modal-type="organization" data-item-id="${org.id}" class="edit-btn text-blue-600 hover:text-blue-800 p-1">${getIcon('Edit')}</button>
                        <button data-delete-type="organization" data-item-id="${org.id}" class="delete-btn text-red-600 hover:text-red-800 p-1 ml-2">${getIcon('Trash')}</button>
                    </td>
                </tr>
            `).join('');

            contentHTML = `
                <div class="flex justify-between items-center mb-4"> 
                    ${stepHeader('Step 1 – Define Organization', 'Set the foundation for your company’s job architecture by entering basic organizational details.')}
                    <button id="add-organization-btn" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"><span class="mr-2">${getIcon('Plus')}</span>Add Organization</button>
                </div>
                ${state.organizations.length > 0 ? `
                <div class="overflow-x-auto bg-white rounded-lg shadow border mt-4">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${organizationsTableRows}
                        </tbody>
                    </table>
                </div>` : emptyState('No organization added yet. Click ‘Add Organization’ to get started.')}
            `;
            break;
        case 2: // Business Unit
            const businessUnitsTableRows = state.businessUnits.map(bu => {
                const parentOrg = state.organizations.find(o => o.id === bu.organizationId);
                return `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">${bu.id}</td>
                    <td class="px-6 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">${bu.name}</td>
                    <td class="px-6 py-3 text-sm text-gray-600 max-w-md truncate" title="${bu.description}">${bu.description}</td>
                    <td class="px-6 py-3 text-sm text-gray-600 whitespace-nowrap">${parentOrg ? parentOrg.name : 'N/A'}</td>
                    <td class="px-6 py-3 text-right text-sm font-medium whitespace-nowrap">
                        <button data-modal-type="businessUnit" data-item-id="${bu.id}" class="edit-btn text-blue-600 hover:text-blue-800 p-1">${getIcon('Edit')}</button>
                        <button data-delete-type="businessUnit" data-item-id="${bu.id}" class="delete-btn text-red-600 hover:text-red-800 p-1 ml-2">${getIcon('Trash')}</button>
                    </td>
                </tr>
            `;}).join('');
            contentHTML = `
                <div class="flex justify-between items-center mb-4"> 
                    ${stepHeader('Step 2: Define Business Units', 'Establish primary divisions within your organization.')}
                    <button id="add-businessUnit-btn" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"><span class="mr-2">${getIcon('Plus')}</span>Add Business Unit</button>
                </div>
                ${state.businessUnits.length > 0 ? `
                <div class="overflow-x-auto bg-white rounded-lg shadow border">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Organization</th>
                                <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${businessUnitsTableRows}
                        </tbody>
                    </table>
                </div>` : emptyState('No business units added. Click "Add Business Unit" to get started.')}
            `;
            break;
        case 3: // Department
            let departmentsGroupedHTML = '';
            if (state.departments.length > 0) {
                const groupedByBU = state.businessUnits.reduce((acc, bu) => {
                    acc[bu.id] = { name: bu.name, departments: [] };
                    return acc;
                }, {});

                state.departments.forEach(dept => {
                    if (groupedByBU[dept.businessUnitId]) {
                        groupedByBU[dept.businessUnitId].departments.push(dept);
                    } else {
                        // Handle departments with no matching BU (optional, or ensure data integrity)
                        if (!groupedByBU['unassigned']) {
                            groupedByBU['unassigned'] = { name: 'Unassigned Departments', departments: [] };
                        }
                        groupedByBU['unassigned'].departments.push(dept);
                    }
                });

                departmentsGroupedHTML = Object.values(groupedByBU).map(buGroup => {
                    if (buGroup.departments.length === 0) return ''; // Don't render BU if no depts under it

                    const departmentsTableRows = buGroup.departments.map(dept => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">${dept.id}</td>
                            <td class="px-6 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">${dept.name}</td>
                            <td class="px-6 py-3 text-sm text-gray-600 max-w-md truncate" title="${dept.description}">${dept.description}</td>
                            <td class="px-6 py-3 text-right text-sm font-medium whitespace-nowrap">
                                <button data-modal-type="department" data-item-id="${dept.id}" class="edit-btn text-blue-600 hover:text-blue-800 p-1">${getIcon('Edit')}</button>
                                <button data-delete-type="department" data-item-id="${dept.id}" class="delete-btn text-red-600 hover:text-red-800 p-1 ml-2">${getIcon('Trash')}</button>
                            </td>
                        </tr>
                    `).join('');

                    return `
                        <div class="mb-4"> 
                            <h3 class="text-xl font-semibold text-gray-700 mb-2">${buGroup.name}</h3> 
                            <div class="overflow-x-auto bg-white rounded-lg shadow border">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        ${departmentsTableRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                departmentsGroupedHTML = emptyState('No departments added. Click "Add Department" to get started.');
            }

            contentHTML = `
                <div class="flex justify-between items-center mb-4"> 
                    ${stepHeader('Step 3: Define Departments', 'Create specialized functional groups within business units.')}
                    <button id="add-department-btn" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"><span class="mr-2">${getIcon('Plus')}</span>Add Department</button>
                </div>
                ${departmentsGroupedHTML}
            `;
            break;
        case 4: // Role Groups (was 1)
            contentHTML = `
                <div class="flex justify-between items-center mb-4"> 
                    ${stepHeader('Step 4: Define Role Groups', 'Create logical families for your jobs (e.g., Flight Operations).')}
                    <button id="add-group-btn" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"><span class="mr-2">${getIcon('Plus')}</span>Add Group</button>
                </div>
                <div class="space-y-3">${state.roleGroups.length > 0 ? state.roleGroups.map(g => listItem(g, 'group', openModalFn, deleteItemFn)).join('') : emptyState('No role groups added.')}</div>`; // Reduced space-y-4 to space-y-3
            break;
        case 5: // Job Levels (was 2)
            contentHTML = `
                 <div class="flex justify-between items-center mb-4"> 
                    ${stepHeader('Step 5: Define Job Levels', 'Establish the career ladder steps for your organization (e.g., L1, L5).')}
                    <button id="add-level-btn" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"><span class="mr-2">${getIcon('Plus')}</span>Add Level</button>
                </div>
                <div class="space-y-3">${state.jobLevels.length > 0 ? state.jobLevels.map(l => listItem(l, 'level', openModalFn, deleteItemFn)).join('') : emptyState('No job levels defined.')}</div>`; // Reduced space-y-4 to space-y-3
            break;
        case 6: // Add Jobs & Map Skills (was 3)
            initStep3State(); 
            renderStep3Content(container, openModalFn);
            return; 
        case 7: // Skill Gaps (was 4)
        case 8: // Career Paths (was 5)
        case 9: // Review (was 6)
            const comingSoon = (icon, title, subtitle) => `<div class="text-center bg-gray-50 p-10 rounded-lg border-2 border-dashed"><div class="w-16 h-16 text-gray-300 mx-auto">${getIcon(icon)}</div><h3 class="mt-4 text-xl font-semibold text-gray-700">${title}</h3><p class="mt-2 text-gray-500 max-w-2xl mx-auto">${subtitle}</p></div>`;
            if(state.currentStep === 7) contentHTML = `${stepHeader('Step 7: Analyze Skill Gaps', 'Compare required job skills against employee capabilities.')}${comingSoon('ClipboardList', 'Coming Soon: Skill Gap Analysis', 'This feature will highlight discrepancies between required skills and employee skill sets to guide training efforts.')}`;
            if(state.currentStep === 8) contentHTML = `${stepHeader('Step 8: Visualize Career Paths', 'Map potential career progression routes.')}${comingSoon('GitBranch', 'Coming Soon: Career Path Mapping', 'This tool will allow you to visually connect job roles to illustrate clear vertical and horizontal career paths for employees.')}`;
            if(state.currentStep === 9) contentHTML = `
                ${stepHeader('Step 9: Review & AI-Powered Insights', 'Final overview of your architecture and AI-driven recommendations.')}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-2 space-y-6">${state.roleGroups.map(group => `<div class="bg-white rounded-lg shadow-md border"><div class="p-4 bg-gray-50 border-b"><h3 class="text-xl font-bold text-gray-800">${group.name}</h3><p class="text-sm text-gray-600">${group.description}</p></div><div class="p-4"><ul class="divide-y divide-gray-200">${group.jobs.length > 0 ? group.jobs.map(job => `<li class="py-3"><p class="font-semibold text-gray-800">${job.title}</p><p class="text-sm text-gray-500">Level: <span class="font-medium text-gray-700">${job.level}</span> | Skills: <span class="font-medium text-gray-700">${job.skills && job.skills.length > 0 ? job.skills.map(s => globalState.ontologySkills.find(os => os.id === s.skillId)?.name || 'Unknown Skill').join(', ') : 'None'}</span></p></li>`).join('') : '<li class="text-center text-gray-500 py-4">No jobs.</li>'}</ul></div></div>`).join('')}</div>
                    <div class="md:col-span-1"><div class="bg-blue-50 border border-blue-200 rounded-lg p-5"><div class="flex items-center"><span class="text-blue-600 mr-3">${getIcon('Zap')}</span><h3 class="text-lg font-bold text-blue-800">AI-Powered Insights</h3></div><ul class="mt-4 space-y-3 text-sm text-blue-700"><li class="flex items-start"><span class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500">${getIcon('Check')}</span><span><strong>Succession Risk:</strong> High risk for Lead Cabin Crew role. Recommend cross-training senior crew.</span></li><li class="flex items-start"><span class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500">${getIcon('Check')}</span><span><strong>Hiring Priority:</strong> High demand for A320 Type Rated captains based on fleet expansion plans.</span></li></ul></div></div>
                </div>`;
            break;
        default:
            contentHTML = emptyState('Step content not found.');
    }

    // If we didn't return early for Step 6 (new Step 6, was Step 3), set the contentHTML for other steps.
    if (state.currentStep !== 6) {
        container.innerHTML = contentHTML;
    }

    // Add event listeners after content is rendered
    if (state.currentStep === 1) { // Organization
        document.getElementById('add-organization-btn')?.addEventListener('click', () => openModalFn('organization'));
        addEventListenersForListItems(container, openModalFn, deleteItemFn);
    } else if (state.currentStep === 2) { // Business Unit
        document.getElementById('add-businessUnit-btn')?.addEventListener('click', () => openModalFn('businessUnit'));
        addEventListenersForListItems(container, openModalFn, deleteItemFn);
    } else if (state.currentStep === 3) { // Department
        document.getElementById('add-department-btn')?.addEventListener('click', () => openModalFn('department'));
        addEventListenersForListItems(container, openModalFn, deleteItemFn);
    } else if (state.currentStep === 4) { // Role Groups (was 1)
        document.getElementById('add-group-btn')?.addEventListener('click', () => openModalFn('group'));
        addEventListenersForListItems(container, openModalFn, deleteItemFn);
    } else if (state.currentStep === 5) { // Job Levels (was 2)
        document.getElementById('add-level-btn')?.addEventListener('click', () => openModalFn('level'));
        addEventListenersForListItems(container, openModalFn, deleteItemFn);
    }
    // Event listeners for Step 6 (new Step 6, was Step 3) are handled by step3/index.js (via renderStep3Content)
};
