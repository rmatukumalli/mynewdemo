// aviation-wizard/components/step3/jobSelectionRenderer.js
import { getIcon } from '../../state.js';
import { localState } from './state.js';

// Render the list of jobs for selection
export const renderJobSelectionList = (roleGroups, openModalForItemFn) => {
    let html = '<div class="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit mb-6 lg:mb-0">';
    html += '<h2 class="text-xl font-bold mb-4 text-gray-800">Job Titles</h2>';
    
    roleGroups.forEach(group => {
        html += `<div class="mb-4">`;
        html += `<div class="flex justify-between items-center mb-2">
                    <h3 class="text-lg font-semibold text-gray-700">${group.name}</h3>
                    <button data-modal-type="job" data-group-id="${group.id}" class="add-job-to-group-btn inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-green-600">
                        <span class="mr-1.5">${getIcon('Plus')}</span>Add Job
                    </button>
                 </div>`;
        if (group.jobs.length > 0) {
            html += '<ul class="space-y-2">';
            group.jobs.forEach(job => {
                const isSelected = job.id === localState.selectedJobIdForSkillMapping;
                html += `
                    <li>
                        <button data-job-id="${job.id}" class="select-job-btn w-full text-left p-3 rounded-lg transition-colors flex justify-between items-center ${isSelected ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}">
                            <span>${job.title} (Level: ${job.level})</span>
                            <span class="transform transition-transform ${isSelected ? 'translate-x-1' : ''}">${getIcon('ChevronRight')}</span>
                        </button>
                    </li>`;
            });
            html += '</ul>';
        } else {
            html += '<p class="text-sm text-gray-500">No jobs in this group yet.</p>';
        }
        html += `</div>`;
    });

    html += '</div>'; // Close lg:col-span-1
    return html;
};
