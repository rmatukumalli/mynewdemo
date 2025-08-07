export function init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
    const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
    const panelsContainer = contentWrapper.querySelector('.panels-container');

    if (!actionButtonContainer || !panelsContainer) {
        console.error('Required containers not found for departments.js');
        return;
    }

    actionButtonContainer.innerHTML = `<button data-action="add-dept" class="bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Add Department
    </button>`;
    
    let tableRows = appData.departments.map(dept => {
        const parentBu = appData.business_units.find(bu => bu.id === dept.unit);
        const parentBuName = parentBu ? parentBu.unit_name : 'N/A';
        return `
        <tr class="border-b border-slate-200">
            <td class="p-2">${dept.id}</td>
            <td class="p-2 font-medium text-slate-800">${dept.department_name}</td>
            <td class="p-2">${parentBuName}</td>
            <td class="p-2">${dept.manager}</td>
            <td class="p-2">${dept.employee_count}</td>
            <td class="p-2">${dept.budget}</td>
            <td class="p-2 flex gap-3 justify-end">
                <button data-action="edit-dept" data-id="${dept.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                <button data-action="delete-dept" data-id="${dept.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
            </td>
        </tr>`;
    }).join('');

    panelsContainer.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-slate-200 bg-slate-50">
                    <tr class="text-xs">
                        <th class="p-2 font-semibold">ID</th>
                        <th class="p-2 font-semibold">Department Name</th>
                        <th class="p-2 font-semibold">Business Unit</th>
                        <th class="p-2 font-semibold">Manager</th>
                        <th class="p-2 font-semibold">Employee Count</th>
                        <th class="p-2 font-semibold">Budget</th>
                        <th class="p-2 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows || `<tr><td colspan="7" class="text-center p-4 text-slate-400">No departments defined.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;

    // Event listeners for this step
    actionButtonContainer.querySelector('[data-action="add-dept"]').addEventListener('click', () => {
        openModal({ title: 'Add Department', content: getFormHTML({
            'general': [
                {label: 'Department Name', id: 'department_name'},
                {label: 'Business Unit', id: 'unit', type: 'select', options: appData.business_units.map(bu => ({value: bu.id, label: bu.unit_name}))},
                {label: 'Manager', id: 'manager'},
                {label: 'Employee Count', id: 'employee_count', type: 'number'},
                {label: 'Timezone', id: 'timezone'},
                {label: 'Shift Coverage', id: 'shift_coverage', type: 'checkbox'},
            ],
            'financial': [
                {label: 'Budget', id: 'budget', type: 'number'},
                {label: 'Cost Center Code', id: 'cost_center_code'},
            ]
        }), onConfirm: async () => {
            const department_name = document.getElementById('form-department_name').value;
            const unit = document.getElementById('form-unit').value;
            const manager = document.getElementById('form-manager').value;
            const timezone = document.getElementById('form-timezone').value;
            const shift_coverage = document.getElementById('form-shift_coverage').checked;
            const budget = parseInt(document.getElementById('form-budget').value);
            const cost_center_code = document.getElementById('form-cost_center_code').value;
            const employee_count = parseInt(document.getElementById('form-employee_count').value);

            if(!department_name || !unit) return false;

            try {
                const response = await fetch('/api/departments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ department_name, unit, manager, timezone, shift_coverage, budget, cost_center_code, employee_count })
                });
                if (!response.ok) throw new Error('Failed to add department');
                updateWizardState();
                return true;
            } catch (error) {
                console.error('Error adding department:', error);
                alert('Failed to add department. Please try again.');
                return false;
            }
        }});
    });

    panelsContainer.querySelectorAll('[data-action="edit-dept"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            let item = appData.departments.find(d => d.id === id);
            openModal({ title: 'Edit Department', content: getFormHTML({
                'general': [
                    {label: 'Department Name', id: 'department_name', value: item.department_name},
                    {label: 'Business Unit', id: 'unit', type: 'select', value: item.unit, options: appData.business_units.map(bu => ({value: bu.id, label: bu.unit_name}))},
                    {label: 'Manager', id: 'manager', value: item.manager},
                    {label: 'Employee Count', id: 'employee_count', type: 'number', value: item.employee_count},
                    {label: 'Timezone', id: 'timezone', value: item.timezone},
                    {label: 'Shift Coverage', id: 'shift_coverage', type: 'checkbox', value: item.shift_coverage},
                ],
                'financial': [
                    {label: 'Budget', id: 'budget', type: 'number', value: item.budget},
                    {label: 'Cost Center Code', id: 'cost_center_code', value: item.cost_center_code},
                ]
            }), onConfirm: async () => {
                item.department_name = document.getElementById('form-department_name').value;
                item.unit = document.getElementById('form-unit').value;
                item.manager = document.getElementById('form-manager').value;
                item.timezone = document.getElementById('form-timezone').value;
                item.shift_coverage = document.getElementById('form-shift_coverage').checked;
                item.budget = parseInt(document.getElementById('form-budget').value);
                item.cost_center_code = document.getElementById('form-cost_center_code').value;
                item.employee_count = parseInt(document.getElementById('form-employee_count').value);
                
                try {
                    const response = await fetch(`/api/departments/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                    if (!response.ok) throw new Error('Failed to update department');
                    updateWizardState();
                    return true;
                } catch (error) {
                    console.error('Error updating department:', error);
                    alert('Failed to update department. Please try again.');
                    return false;
                }
            }});
        });
    });

    panelsContainer.querySelectorAll('[data-action="delete-dept"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            openModal({
                title: 'Confirm Delete',
                content: 'Are you sure you want to delete this department?',
                onConfirm: async () => {
                    try {
                        const response = await fetch(`/api/departments/${id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) throw new Error('Failed to delete department');
                        updateWizardState();
                        return true;
                    } catch (error) {
                        console.error('Error deleting department:', error);
                        alert('Failed to delete department. Please try again.');
                        return false;
                    }
                }
            });
        });
    });
}
