export function init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
    const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
    const panelsContainer = contentWrapper.querySelector('.panels-container');

    if (!actionButtonContainer || !panelsContainer) {
        console.error('Required containers not found for role_groups.js');
        return;
    }

    actionButtonContainer.innerHTML = `<button data-action="add-rg" class="bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Add Role Group
    </button>`;
    
    let tableRows = appData.role_groups.map(rg => {
        const parentGroupName = rg.parent_group ? (appData.role_groups.find(prg => prg.id === rg.parent_group)?.group_name || 'N/A') : 'N/A';
        return `
        <tr class="border-b border-slate-200">
            <td class="p-2">${rg.id}</td>
            <td class="p-2 font-medium text-slate-800">${rg.group_name}</td>
            <td class="p-2">${rg.description}</td>
            <td class="p-2">${rg.job_family_code}</td>
            <td class="p-2">${parentGroupName}</td>
            <td class="p-2">${rg.job_classification_type}</td>
            <td class="p-2">${rg.union_affiliation ? 'Yes' : 'No'}</td>
            <td class="p-2 flex gap-3 justify-end">
                <button data-action="edit-rg" data-id="${rg.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                <button data-action="delete-rg" data-id="${rg.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
            </td>
        </tr>`;
    }).join('');

    panelsContainer.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-slate-200 bg-slate-50">
                    <tr class="text-xs">
                        <th class="p-2 font-semibold">ID</th>
                        <th class="p-2 font-semibold">Group Name</th>
                        <th class="p-2 font-semibold">Description</th>
                        <th class="p-2 font-semibold">Job Family Code</th>
                        <th class="p-2 font-semibold">Parent Group</th>
                        <th class="p-2 font-semibold">Classification Type</th>
                        <th class="p-2 font-semibold">Union Affiliation</th>
                        <th class="p-2 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows || `<tr><td colspan="8" class="text-center p-4 text-slate-400">No role groups defined.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;

    // Event listeners for this step
    actionButtonContainer.querySelector('[data-action="add-rg"]').addEventListener('click', () => {
        openModal({ title: 'Add Role Group', content: getFormHTML({
            'general': [
                {label: 'Group Name', id: 'group_name'},
                {label: 'Description', id: 'description', type: 'textarea', rows: 3},
                {label: 'Job Family Code', id: 'job_family_code'},
                {label: 'Parent Group', id: 'parent_group', type: 'select', options: [{value: '', label: 'None'}, ...appData.role_groups.map(rg => ({value: rg.id, label: rg.group_name}))]},
                {label: 'Job Classification Type', id: 'job_classification_type', type: 'select', options: [{value: 'Exempt', label: 'Exempt'}, {value: 'Non-Exempt', label: 'Non-Exempt'}]},
                {label: 'Union Affiliation', id: 'union_affiliation', type: 'checkbox'}
            ]
        }), onConfirm: async () => {
            const group_name = document.getElementById('form-group_name').value;
            const description = document.getElementById('form-description').value;
            const job_family_code = document.getElementById('form-job_family_code').value;
            const parent_group = document.getElementById('form-parent_group').value;
            const job_classification_type = document.getElementById('form-job_classification_type').value;
            const union_affiliation = document.getElementById('form-union_affiliation').checked;

            if(!group_name) return false;

            try {
                const response = await fetch('/api/rolegroups', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ group_name, description, job_family_code, parent_group, job_classification_type, union_affiliation })
                });
                if (!response.ok) throw new Error('Failed to add role group');
                updateWizardState();
                return true;
            } catch (error) {
                console.error('Error adding role group:', error);
                alert('Failed to add role group. Please try again.');
                return false;
            }
        }});
    });

    panelsContainer.querySelectorAll('[data-action="edit-rg"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            let item = appData.role_groups.find(rg => rg.id === id);
            openModal({ title: 'Edit Role Group', content: getFormHTML({
                'general': [
                    {label: 'Group Name', id: 'group_name', value: item.group_name},
                    {label: 'Description', id: 'description', type: 'textarea', rows: 3, value: item.description},
                    {label: 'Job Family Code', id: 'job_family_code', value: item.job_family_code},
                    {label: 'Parent Group', id: 'parent_group', type: 'select', value: item.parent_group, options: [{value: '', label: 'None'}, ...appData.role_groups.map(rg => ({value: rg.id, label: rg.group_name}))]},
                    {label: 'Job Classification Type', id: 'job_classification_type', type: 'select', value: item.job_classification_type, options: [{value: 'Exempt', label: 'Exempt'}, {value: 'Non-Exempt', label: 'Non-Exempt'}]},
                    {label: 'Union Affiliation', id: 'union_affiliation', type: 'checkbox', value: item.union_affiliation}
                ]
            }), onConfirm: async () => {
                item.group_name = document.getElementById('form-group_name').value;
                item.description = document.getElementById('form-description').value;
                item.job_family_code = document.getElementById('form-job_family_code').value;
                item.parent_group = document.getElementById('form-parent_group').value;
                item.job_classification_type = document.getElementById('form-job_classification_type').value;
                item.union_affiliation = document.getElementById('form-union_affiliation').checked;
                
                try {
                    const response = await fetch(`/api/rolegroups/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                    if (!response.ok) throw new Error('Failed to update role group');
                    updateWizardState();
                    return true;
                } catch (error) {
                    console.error('Error updating role group:', error);
                    alert('Failed to update role group. Please try again.');
                    return false;
                }
            }});
        });
    });

    panelsContainer.querySelectorAll('[data-action="delete-rg"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            openModal({
                title: 'Confirm Delete',
                content: 'Are you sure you want to delete this role group?',
                onConfirm: async () => {
                    try {
                        const response = await fetch(`/api/rolegroups/${id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) throw new Error('Failed to delete role group');
                        updateWizardState();
                        return true;
                    } catch (error) {
                        console.error('Error deleting role group:', error);
                        alert('Failed to delete role group. Please try again.');
                        return false;
                    }
                }
            });
        });
    });
}
