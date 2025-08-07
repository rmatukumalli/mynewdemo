const departmentsModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        const mockBusinessUnits = [
            { id: 'bu1', unit_name: 'Flight Operations', unit_head: 'Capt. John Smith' },
            { id: 'bu2', unit_name: 'Maintenance, Repair, and Overhaul (MRO)', unit_head: 'Jane Doe' },
            { id: 'bu3', unit_name: 'Cargo & Logistics', unit_head: 'Peter Jones' },
            { id: 'bu4', unit_name: 'Customer Experience & Services', unit_head: 'Mary Johnson' },
            { id: 'bu5', unit_name: 'Corporate Functions', unit_head: 'David Williams' },
            { id: 'bu6', unit_name: 'Technology & Innovation', unit_head: 'Dr. Susan Brown' }
        ];

        const mockDepartments = [
            { id: 'dept1', department_name: 'Flight Crew', unit: 'bu1', department_head: 'Jessica Johnson', cost_center: 'FC101', employee_count: '3500' },
            { id: 'dept2', department_name: 'Ground Staff', unit: 'bu1', department_head: 'Michael Smith', cost_center: 'GS102', employee_count: '2500' },
            { id: 'dept3', department_name: 'Airframe Maintenance', unit: 'bu2', department_head: 'Emily Williams', cost_center: 'AM201', employee_count: '1500' },
            { id: 'dept4', department_name: 'Avionics', unit: 'bu2', department_head: 'David Brown', cost_center: 'AV202', employee_count: '1000' },
            { id: 'dept5', department_name: 'Freight Forwarding', unit: 'bu3', department_head: 'Sarah Davis', cost_center: 'FF301', employee_count: '800' },
            { id: 'dept6', department_name: 'In-Flight Services', unit: 'bu4', department_head: 'Christopher Miller', cost_center: 'IS401', employee_count: '3000' },
            { id: 'dept7', department_name: 'Human Resources', unit: 'bu5', department_head: 'Amanda Wilson', cost_center: 'HR501', employee_count: '250' },
            { id: 'dept8', department_name: 'Finance', unit: 'bu5', department_head: 'James Moore', cost_center: 'FIN502', employee_count: '300' },
            { id: 'dept9', department_name: 'IT Infrastructure', unit: 'bu6', department_head: 'Jennifer Taylor', cost_center: 'IT601', employee_count: '700' },
            { id: 'dept10', department_name: 'Software Development', unit: 'bu6', department_head: 'Robert Anderson', cost_center: 'SD602', employee_count: '500' }
        ];

        appData.business_units = mockBusinessUnits;
        appData.departments = mockDepartments;

        actionButtonContainer.innerHTML = `<button data-action="add-dept" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700">Add Department</button>`;
        
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-slate-200 bg-slate-50">
                        <tr class="text-xs">
                            <th class="p-2 font-semibold">Department Name</th>
                            <th class="p-2 font-semibold">Business Unit</th>
                            <th class="p-2 font-semibold">Department Head</th>
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
                                    <td class="p-2">${dept.cost_center}</td>
                                    <td class="p-2">${dept.employee_count}</td>
                                    <td class="p-2 flex gap-3 justify-end">
                                        <button data-action="edit-dept" data-id="${dept.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                                        <button data-action="delete-dept" data-id="${dept.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                                    </td>
                                </tr>
                            `;
                        }).join('') || `<tr><td colspan="6" class="text-center p-4 text-slate-400">No departments defined.</td></tr>`}
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
                const cost_center = document.getElementById('form-cost_center').value;
                const employee_count = document.getElementById('form-employee_count').value;
                if(!department_name || !unit) return false;
                
                // Mock API call
                console.log('Adding department:', { department_name, unit, department_head, cost_center, employee_count });
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
