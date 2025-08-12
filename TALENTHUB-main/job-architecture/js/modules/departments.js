const departmentsModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        // Data is now loaded from appData, no need for mockBusinessUnits or mockDepartments here
        // const mockBusinessUnits = [ ... ];
        // const mockDepartments = [ ... ];

        // appData.business_units = mockBusinessUnits; // No longer needed
        // appData.departments = mockDepartments; // No longer needed

        actionButtonContainer.innerHTML = `<button data-action="add-dept" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700">Add Department</button>`;
        
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-slate-200 bg-slate-50">
                        <tr class="text-xs">
                            <th class="p-2 font-semibold">Department Name</th>
                            <th class="p-2 font-semibold">Business Unit</th>
                            <th class="p-2 font-semibold">Department Head</th>
                            <th class="p-2 font-semibold">Job Function</th>
                            <th class="p-2 font-semibold">Cost Center</th>
                            <th class="p-2 font-semibold">Employee Count</th>
                            <th class="p-2 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.departments.map(dept => {
                            const businessUnit = appData.business_units.find(bu => bu.id === dept.unit);
                            return `
                                <tr class="border-b border-slate-200">
                                    <td class="p-2 font-medium text-slate-800">${dept.department_name}</td>
                                    <td class="p-2">${businessUnit ? businessUnit.unit_name : 'N/A'}</td>
                                    <td class="p-2">${dept.department_head}</td>
                                    <td class="p-2">${dept.job_function}</td>
                                    <td class="p-2">${dept.cost_center}</td>
                                    <td class="p-2">${dept.employee_count}</td>
                                    <td class="p-2 flex gap-3 justify-end">
                                        <button data-action="edit-dept" data-id="${dept.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                                        <button data-action="delete-dept" data-id="${dept.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                                    </td>
                                </tr>
                            `;
                        }).join('') || `<tr><td colspan="7" class="text-center p-4 text-slate-400">No departments defined.</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;

        panelsContainer.innerHTML = tableHTML;

        // Event listeners for this step
        actionButtonContainer.querySelector('[data-action="add-dept"]').addEventListener('click', () => {
            openModal({
                title: 'Add Department',
                tabs: [
                    {
                        title: 'General',
                        content: getFormHTML({
                            'general': [
                                { label: 'Department Name', id: 'department_name' },
                                { label: 'Business Unit', id: 'unit', type: 'select', options: appData.business_units.map(bu => ({ value: bu.id, label: bu.unit_name })) },
                                { label: 'Department Head', id: 'department_head' },
                                { label: 'Job Function', id: 'job_function' },
                                { label: 'Cost Center', id: 'cost_center' },
                                { label: 'Employee Count', id: 'employee_count' },
                            ]
                        })
                    }
                ],
                onConfirm: async () => {
                const department_name = document.getElementById('form-department_name').value;
                const unit = document.getElementById('form-unit').value;
                const department_head = document.getElementById('form-department_head').value;
                const job_function = document.getElementById('form-job_function').value;
                const cost_center = document.getElementById('form-cost_center').value;
                const employee_count = document.getElementById('form-employee_count').value;
                if(!department_name || !unit) return false;
                
                // Mock API call
                console.log('Adding department:', { department_name, unit, department_head, job_function, cost_center, employee_count });
                appData.departments.push({
                    id: `dept_${Date.now()}`, // Simple unique ID
                    department_name, unit, department_head, job_function, cost_center, employee_count
                });
                updateWizardState();
                return true;
            }});
        });

        panelsContainer.querySelectorAll('[data-action="edit-dept"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                let item = appData.departments.find(dept => dept.id === id);
                openModal({
                    title: 'Edit Department',
                    tabs: [
                        {
                            title: 'General',
                            content: getFormHTML({
                                'general': [
                                    { label: 'Department Name', id: 'department_name', value: item.department_name },
                                    { label: 'Business Unit', id: 'unit', type: 'select', value: item.unit, options: appData.business_units.map(bu => ({ value: bu.id, label: bu.unit_name })) },
                                    { label: 'Department Head', id: 'department_head', value: item.department_head },
                                    { label: 'Job Function', id: 'job_function', value: item.job_function },
                                    { label: 'Cost Center', id: 'cost_center', value: item.cost_center },
                                    { label: 'Employee Count', id: 'employee_count', value: item.employee_count },
                                ]
                            }, item)
                        }
                    ],
                    onConfirm: async () => {
                    item.department_name = document.getElementById('form-department_name').value;
                    item.unit = document.getElementById('form-unit').value;
                    item.department_head = document.getElementById('form-department_head').value;
                    item.job_function = document.getElementById('form-job_function').value;
                    item.cost_center = document.getElementById('form-cost_center').value;
                    item.employee_count = document.getElementById('form-employee_count').value;
                    
                    // Mock API call
                    console.log('Updating department:', item);
                    updateWizardState();
                    return true;
                }});
            });
        });

        panelsContainer.querySelectorAll('[data-action="delete-dept"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                openModal({
                    title: 'Confirm Delete',
                    tabs: [
                        {
                            title: 'Confirmation',
                            content: '<p>Are you sure you want to delete this department?</p>'
                        }
                    ],
                    onConfirm: async () => {
                        // Mock API call
                        console.log('Deleting department with id:', id);
                        appData.departments = appData.departments.filter(dept => dept.id !== id);
                        updateWizardState();
                        return true;
                    }
                });
            });
        });
    }
};

window.departmentsModule = departmentsModule;
