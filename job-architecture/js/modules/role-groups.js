const roleGroupsModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        const mockDepartments = [
            { id: 'dept1', department_name: 'Flight Crew', unit: 'bu1' },
            { id: 'dept2', department_name: 'Cabin Crew', unit: 'bu1' },
            { id: 'dept3', department_name: 'Ground Staff', unit: 'bu1' },
            { id: 'dept4', department_name: 'Airframe & Powerplant', unit: 'bu2' },
            { id: 'dept5', department_name: 'Avionics', unit: 'bu2' },
            { id: 'dept6', department_name: 'Logistics', unit: 'bu3' },
            { id: 'dept7', department_name: 'Freight Handling', unit: 'bu3' }
        ];

        const mockRoleGroups = [
            { id: 'rg1', group_name: 'Pilots', department: 'dept1', grade: 'Senior', compensation_range: '$150k-$250k', competencies: 'Flight planning, aircraft operation' },
            { id: 'rg2', group_name: 'Flight Attendants', department: 'dept2', grade: 'Mid-Level', compensation_range: '$50k-$80k', competencies: 'Passenger safety, customer service' },
            { id: 'rg3', group_name: 'Baggage Handlers', department: 'dept3', grade: 'Junior', compensation_range: '$30k-$50k', competencies: 'Loading and unloading baggage' },
            { id: 'rg4', group_name: 'A&P Mechanics', department: 'dept4', grade: 'Senior', compensation_range: '$80k-$120k', competencies: 'Aircraft inspection, repair, and maintenance' },
            { id: 'rg5', group_name: 'Avionics Technicians', department: 'dept5', grade: 'Senior', compensation_range: '$90k-$130k', competencies: 'Electronic systems diagnosis and repair' },
            { id: 'rg6', group_name: 'Logistics Coordinators', department: 'dept6', grade: 'Mid-Level', compensation_range: '$60k-$90k', competencies: 'Supply chain management, inventory control' },
            { id: 'rg7', group_name: 'Cargo Agents', department: 'dept7', grade: 'Junior', compensation_range: '$40k-$60k', competencies: 'Freight documentation, cargo handling' }
        ];

        appData.departments = mockDepartments;
        appData.role_groups = mockRoleGroups;

        actionButtonContainer.innerHTML = `<button data-action="add-rg" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700">Add Role Group</button>`;
        
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-slate-200 bg-slate-50">
                        <tr class="text-xs">
                            <th class="p-2 font-semibold">Group Name</th>
                            <th class="p-2 font-semibold">Department</th>
                            <th class="p-2 font-semibold">Grade</th>
                            <th class="p-2 font-semibold">Compensation Range</th>
                            <th class="p-2 font-semibold">Competencies</th>
                            <th class="p-2 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.role_groups.map(rg => {
                            const department = appData.departments.find(dept => dept.id === rg.department);
                            return `
                                <tr class="border-b border-slate-200">
                                    <td class="p-2 font-medium text-slate-800">${rg.group_name}</td>
                                    <td class="p-2">${department ? department.department_name : 'N/A'}</td>
                                    <td class="p-2">${rg.grade}</td>
                                    <td class="p-2">${rg.compensation_range}</td>
                                    <td class="p-2">${rg.competencies}</td>
                                    <td class="p-2 flex gap-3 justify-end">
                                        <button data-action="edit-rg" data-id="${rg.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                                        <button data-action="delete-rg" data-id="${rg.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                                    </td>
                                </tr>
                            `;
                        }).join('') || `<tr><td colspan="6" class="text-center p-4 text-slate-400">No role groups defined.</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;

        panelsContainer.innerHTML = tableHTML;

        // Event listeners for this step
        actionButtonContainer.querySelector('[data-action="add-rg"]').addEventListener('click', () => {
            openModal({
                title: 'Add Role Group',
                tabs: [
                    {
                        title: 'General',
                        content: getFormHTML({
                            'general': [
                                { label: 'Group Name', id: 'group_name' },
                                { label: 'Department', id: 'department', type: 'select', options: appData.departments.map(dept => ({ value: dept.id, label: dept.department_name })) },
                                { label: 'Grade', id: 'grade' },
                                { label: 'Compensation Range', id: 'compensation_range' },
                                { label: 'Competencies', id: 'competencies' },
                            ]
                        })
                    }
                ],
                onConfirm: async () => {
                const group_name = document.getElementById('form-group_name').value;
                const department = document.getElementById('form-department').value;
                const grade = document.getElementById('form-grade').value;
                const compensation_range = document.getElementById('form-compensation_range').value;
                const competencies = document.getElementById('form-competencies').value;
                if(!group_name || !department) return false;
                
                // Mock API call
                console.log('Adding role group:', { group_name, department, grade, compensation_range, competencies });
                updateWizardState();
                return true;
            }});
        });

        panelsContainer.querySelectorAll('[data-action="edit-rg"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                let item = appData.role_groups.find(rg => rg.id === id);
                openModal({
                    title: 'Edit Role Group',
                    tabs: [
                        {
                            title: 'General',
                            content: getFormHTML({
                                'general': [
                                    { label: 'Group Name', id: 'group_name', value: item.group_name },
                                    { label: 'Department', id: 'department', type: 'select', value: item.department, options: appData.departments.map(dept => ({ value: dept.id, label: dept.department_name })) },
                                    { label: 'Grade', id: 'grade', value: item.grade },
                                    { label: 'Compensation Range', id: 'compensation_range', value: item.compensation_range },
                                    { label: 'Competencies', id: 'competencies', value: item.competencies },
                                ]
                            }, item)
                        }
                    ],
                    onConfirm: async () => {
                    item.group_name = document.getElementById('form-group_name').value;
                    item.department = document.getElementById('form-department').value;
                    item.grade = document.getElementById('form-grade').value;
                    item.compensation_range = document.getElementById('form-compensation_range').value;
                    item.competencies = document.getElementById('form-competencies').value;
                    
                    // Mock API call
                    console.log('Updating role group:', item);
                    updateWizardState();
                    return true;
                }});
            });
        });

        panelsContainer.querySelectorAll('[data-action="delete-rg"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                openModal({
                    title: 'Confirm Delete',
                    tabs: [
                        {
                            title: 'Confirmation',
                            content: '<p>Are you sure you want to delete this role group?</p>'
                        }
                    ],
                    onConfirm: async () => {
                        // Mock API call
                        console.log('Deleting role group with id:', id);
                        appData.role_groups = appData.role_groups.filter(rg => rg.id !== id);
                        updateWizardState();
                        return true;
                    }
                });
            });
        });
    }
};

window.roleGroupsModule = roleGroupsModule;
