export function init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
    setTimeout(() => { // Defer execution to ensure DOM is ready
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        if (!actionButtonContainer || !panelsContainer) {
            console.error('Required containers not found for business_units.js');
            return;
        }

        actionButtonContainer.innerHTML = `<button data-action="add-bu" class="bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
            Add Business Unit
        </button>`;
        
        let tableRows = appData.business_units.map(bu => {
            return `
            <tr class="border-b border-slate-200">
                <td class="p-2">${bu.id}</td>
                <td class="p-2 font-medium text-slate-800">${bu.unit_name}</td>
                <td class="p-2">${bu.unit_head}</td>
                <td class="p-2">${bu.headcount}</td>
                <td class="p-2">${bu.location}</td>
                <td class="p-2">${bu.strategic_priority}</td>
                <td class="p-2">${bu.functions ? bu.functions.join(', ') : ''}</td>
                <td class="p-2 flex gap-3 justify-end">
                    <button data-action="edit-bu" data-id="${bu.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                    <button data-action="delete-bu" data-id="${bu.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                </td>
            </tr>`;
        }).join('');
        
        panelsContainer.innerHTML = `<div class="overflow-x-auto"><table class="w-full text-left text-sm">
            <thead class="border-b border-slate-200 bg-slate-50"><tr class="text-xs">
                <th class="p-2 font-semibold">ID</th>
                <th class="p-2 font-semibold">Unit Name</th>
                <th class="p-2 font-semibold">Unit Head</th>
                <th class="p-2 font-semibold">Headcount</th>
                <th class="p-2 font-semibold">Location</th>
                <th class="p-2 font-semibold">Strategic Priority</th>
                <th class="p-2 font-semibold">Functions</th>
                <th class="p-2 font-semibold text-right">Actions</th>
            </tr></thead>
            <tbody>${tableRows || `<tr><td colspan="8" class="text-center p-4 text-slate-400">No business units defined.</td></tr>`}</tbody>
        </table></div>`;

        // Event listeners for this step
        actionButtonContainer.querySelector('[data-action="add-bu"]').addEventListener('click', () => {
            openModal({ title: 'Add Business Unit', content: getFormHTML({
                'general': [
                    {label: 'Unit Name', id: 'unit_name'},
                    {label: 'Unit Head', id: 'unit_head'},
                    {label: 'Headcount', id: 'headcount', type: 'number'},
                    {label: 'Location', id: 'location'},
                    {label: 'Strategic Priority', id: 'strategic_priority', type: 'select', options: [{value: 'High', label: 'High'}, {value: 'Medium', label: 'Medium'}, {value: 'Low', label: 'Low'}]},
                    {label: 'Functions', id: 'functions', type: 'multi-select', options: []} // Use multi-select for tags
                ]
            }), onConfirm: async () => {
                const unit_name = document.getElementById('form-unit_name').value;
                const unit_head = document.getElementById('form-unit_head').value;
                const headcount = parseInt(document.getElementById('form-headcount').value);
                const location = document.getElementById('form-location').value;
                const strategic_priority = document.getElementById('form-strategic_priority').value;
                const functions = Array.from(document.getElementById('form-functions').querySelectorAll('input[type="text"]')).map(input => input.value).filter(v => v);

                if(!unit_name) return false;

                try {
                    const newBu = await callAPI('/api/business_units', 'POST', { unit_name, unit_head, headcount, location, strategic_priority, functions });
                    appData.business_units.push(newBu);
                    updateWizardState();
                    return true;
                } catch (error) {
                    console.error('Error adding business unit:', error);
                    alert('Failed to add business unit. Please try again.');
                    return false;
                }
            }});
        });

        panelsContainer.querySelectorAll('[data-action="edit-bu"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                let item = appData.business_units.find(bu => bu.id === id);
                openModal({ title: 'Edit Business Unit', content: getFormHTML({
                    'general': [
                        {label: 'Unit Name', id: 'unit_name', value: item.unit_name},
                        {label: 'Unit Head', id: 'unit_head', value: item.unit_head},
                        {label: 'Headcount', id: 'headcount', type: 'number', value: item.headcount},
                        {label: 'Location', id: 'location', value: item.location},
                        {label: 'Strategic Priority', id: 'strategic_priority', type: 'select', value: item.strategic_priority, options: [{value: 'High', label: 'High'}, {value: 'Medium', label: 'Medium'}, {value: 'Low', label: 'Low'}]},
                        {label: 'Functions', id: 'functions', type: 'multi-select', value: item.functions, options: []} // Use multi-select for tags
                    ]
                }), onConfirm: async () => {
                    item.unit_name = document.getElementById('form-unit_name').value;
                    item.unit_head = document.getElementById('form-unit_head').value;
                    item.headcount = parseInt(document.getElementById('form-headcount').value);
                    item.location = document.getElementById('form-location').value;
                    item.strategic_priority = document.getElementById('form-strategic_priority').value;
                    item.functions = Array.from(document.getElementById('form-functions').querySelectorAll('input[type="text"]')).map(input => input.value).filter(v => v);
                    
                    try {
                        const updatedBu = await callAPI(`/api/business_units/${item.id}`, 'PUT', item);
                        updateWizardState();
                        return true;
                    } catch (error) {
                        console.error('Error updating business unit:', error);
                        alert('Failed to update business unit. Please try again.');
                        return false;
                    }
                }});
            });
        });

        panelsContainer.querySelectorAll('[data-action="delete-bu"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                openModal({
                    title: 'Confirm Delete',
                    content: 'Are you sure you want to delete this business unit?',
                    onConfirm: async () => {
                        try {
                            await callAPI(`/api/business_units/${id}`, 'DELETE');
                            updateWizardState();
                            return true;
                        } catch (error) {
                            console.error('Error deleting business unit:', error);
                            alert('Failed to delete business unit. Please try again.');
                            return false;
                        }
                    }
                });
            });
        });
    }, 0); // End of setTimeout
}
