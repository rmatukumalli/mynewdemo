const jobFamiliesModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        actionButtonContainer.innerHTML = `<button data-action="add-jf" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700">Add Job Family</button>`;
        
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-slate-200 bg-slate-50">
                        <tr class="text-xs">
                            <th class="p-2 font-semibold">Department</th>
                            <th class="p-2 font-semibold">Job Family</th>
                            <th class="p-2 font-semibold">Job Category</th>
                            <th class="p-2 font-semibold">Group Name</th>
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
                                    <td class="p-2">${department ? department.department_name : 'N/A'}</td>
                                    <td class="p-2">${rg.job_family}</td>
                                    <td class="p-2">${rg.job_category}</td>
                                    <td class="p-2 font-medium text-slate-800">${rg.group_name}</td>
                                    <td class="p-2">${rg.grade}</td>
                                    <td class="p-2">${rg.compensation_range}</td>
                                    <td class="p-2">${rg.competencies}</td>
                                    <td class="p-2 flex gap-3 justify-end">
                                        <button data-action="edit-jf" data-id="${rg.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                                        <button data-action="delete-jf" data-id="${rg.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                                    </td>
                                </tr>
                            `;
                        }).join('') || `<tr><td colspan="8" class="text-center p-4 text-slate-400">No job families defined.</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;

        panelsContainer.innerHTML = tableHTML;

        // Event listeners for this step
        actionButtonContainer.querySelector('[data-action="add-jf"]').addEventListener('click', () => {
            openModal({
                title: 'Add Job Family',
                tabs: [
                    {
                        title: 'General',
                        content: getFormHTML({
                            'general': [
                                { label: 'Department', id: 'department', type: 'select', options: appData.departments.map(dept => ({ value: dept.id, label: dept.department_name })) },
                                { label: 'Job Family', id: 'job_family' },
                                { label: 'Job Category', id: 'job_category' },
                                { label: 'Group Name', id: 'group_name' },
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
                const job_family = document.getElementById('form-job_family').value;
                const job_category = document.getElementById('form-job_category').value;
                const grade = document.getElementById('form-grade').value;
                const compensation_range = document.getElementById('form-compensation_range').value;
                const competencies = document.getElementById('form-competencies').value;
                if(!group_name || !department) return false;
                
                // Mock API call
                console.log('Adding job family:', { group_name, department, job_family, job_category, grade, compensation_range, competencies });
                appData.role_groups.push({ // Still pushing to role_groups as the data structure remains the same
                    id: `rg_${Date.now()}`, // Simple unique ID
                    group_name, department, job_family, job_category, grade, compensation_range, competencies
                });
                updateWizardState();
                return true;
            }});
        });

        panelsContainer.querySelectorAll('[data-action="edit-jf"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                let item = appData.role_groups.find(rg => rg.id === id);
                openModal({
                    title: 'Edit Job Family',
                    tabs: [
                        {
                            title: 'General',
                            content: getFormHTML({
                                'general': [
                                    { label: 'Department', id: 'department', type: 'select', value: item.department, options: appData.departments.map(dept => ({ value: dept.id, label: dept.department_name })) },
                                    { label: 'Job Family', id: 'job_family', value: item.job_family },
                                    { label: 'Job Category', id: 'job_category', value: item.job_category },
                                    { label: 'Group Name', id: 'group_name', value: item.group_name },
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
                    item.job_family = document.getElementById('form-job_family').value;
                    item.job_category = document.getElementById('form-job_category').value;
                    item.grade = document.getElementById('form-grade').value;
                    item.compensation_range = document.getElementById('form-compensation_range').value;
                    item.competencies = document.getElementById('form-competencies').value;
                    
                    // Mock API call
                    console.log('Updating job family:', item);
                    updateWizardState();
                    return true;
                }});
            });
        });

        panelsContainer.querySelectorAll('[data-action="delete-jf"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                openModal({
                    title: 'Confirm Delete',
                    tabs: [
                        {
                            title: 'Confirmation',
                            content: '<p>Are you sure you want to delete this job family?</p>'
                        }
                    ],
                    onConfirm: async () => {
                        // Mock API call
                        console.log('Deleting job family with id:', id);
                        appData.role_groups = appData.role_groups.filter(rg => rg.id !== id);
                        updateWizardState();
                        return true;
                    }
                });
            });
        });
    }
};

window.jobFamiliesModule = jobFamiliesModule;
