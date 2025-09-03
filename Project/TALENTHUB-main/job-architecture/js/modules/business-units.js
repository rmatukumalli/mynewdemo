const businessUnitsModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        // Data is now loaded from appData, no need for mockBusinessUnits here
        // const mockBusinessUnits = [
        //     { id: 'bu1', unit_name: 'Flight Operations', unit_head: 'Capt. John Smith', budget: '$2.5B', employees: '6000', strategic_goals: 'Achieve 95% on-time performance and expand routes to Southeast Asia.', organization_id: '1' },
        //     { id: 'bu2', unit_name: 'Maintenance, Repair, and Overhaul (MRO)', unit_head: 'Jane Doe', budget: '$1.2B', employees: '3000', strategic_goals: 'Implement predictive maintenance to reduce aircraft downtime by 15%.', organization_id: '1' },
        //     { id: 'bu3', unit_name: 'Cargo & Logistics', unit_head: 'Peter Jones', budget: '$750M', employees: '1500', strategic_goals: 'Grow cargo market share by 10% through strategic partnerships.', organization_id: '1' },
        //     { id: 'bu4', unit_name: 'Customer Experience & Services', unit_head: 'Mary Johnson', budget: '$800M', employees: '4000', strategic_goals: 'Enhance passenger satisfaction score (NPS) by 20 points.', organization_id: '1' },
        //     { id: 'bu5', unit_name: 'Corporate Functions', unit_head: 'David Williams', budget: '$300M', employees: '800', strategic_goals: 'Digitalize HR and Finance processes to improve efficiency by 25%.', organization_id: '1' },
        //     { id: 'bu6', unit_name: 'Technology & Innovation', unit_head: 'Dr. Susan Brown', budget: '$450M', employees: '1200', strategic_goals: 'Develop a new passenger mobile app with personalized services.', organization_id: '1' }
        // ];

        // appData.business_units = mockBusinessUnits; // This line is no longer needed

        actionButtonContainer.innerHTML = `<button data-action="add-bu" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700">Add Business Unit</button>`;
        
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-slate-200 bg-slate-50">
                        <tr class="text-xs">
                            <th class="p-2 font-semibold">Unit Name</th>
                            <th class="p-2 font-semibold">Unit Head</th>
                            <th class="p-2 font-semibold">Budget</th>
                            <th class="p-2 font-semibold">Employees</th>
                            <th class="p-2 font-semibold">Strategic Goals</th>
                            <th class="p-2 font-semibold">Organization</th>
                            <th class="p-2 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.business_units.map(bu => `
                            <tr class="border-b border-slate-200">
                                <td class="p-2 font-medium text-slate-800">${bu.unit_name}</td>
                                <td class="p-2">${bu.unit_head}</td>
                                <td class="p-2">${bu.budget}</td>
                                <td class="p-2">${bu.employees}</td>
                                <td class="p-2">${bu.strategic_goals}</td>
                                <td class="p-2">${appData.organizations.find(org => org.id === bu.organization_id)?.company_name || ''}</td>
                                <td class="p-2 flex gap-3 justify-end">
                                    <button data-action="edit-bu" data-id="${bu.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                                    <button data-action="delete-bu" data-id="${bu.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                                </td>
                            </tr>
                        `).join('') || `<tr><td colspan="7" class="text-center p-4 text-slate-400">No business units defined.</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;

        panelsContainer.innerHTML = tableHTML;

        // Event listeners for this step
        actionButtonContainer.querySelector('[data-action="add-bu"]').addEventListener('click', () => {
            openModal({
                title: 'Add Business Unit',
                tabs: [
                    {
                        title: 'General',
                        content: getFormHTML({
                            'general': [
                                { label: 'Organization', id: 'organization_id', type: 'select', options: appData.organizations.map(org => ({ value: org.id, label: org.company_name })) },
                                { label: 'Unit Name', id: 'unit_name' },
                                { label: 'Unit Head', id: 'unit_head' },
                                { label: 'Budget', id: 'budget' },
                                { label: 'Number of Employees', id: 'employees' },
                                { label: 'Strategic Goals', id: 'strategic_goals' },
                            ]
                        })
                    }
                ],
                onConfirm: async () => {
                const unit_name = document.getElementById('form-unit_name').value;
                const unit_head = document.getElementById('form-unit_head').value;
                const budget = document.getElementById('form-budget').value;
                const employees = document.getElementById('form-employees').value;
                const strategic_goals = document.getElementById('form-strategic_goals').value;
                const organization_id = document.getElementById('form-organization_id').value; // Get organization_id
                if(!unit_name || !organization_id) return false; // Ensure organization_id is captured
                
                // Mock API call
                console.log('Adding business unit:', { unit_name, unit_head, budget, employees, strategic_goals, organization_id });
                appData.business_units.push({
                    id: `bu_${Date.now()}`, // Simple unique ID
                    unit_name, unit_head, budget, employees, strategic_goals, organization_id
                });
                updateWizardState();
                return true;
            }});
        });

        panelsContainer.querySelectorAll('[data-action="edit-bu"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                let item = appData.business_units.find(bu => bu.id === id);
                openModal({
                    title: 'Edit Business Unit',
                    tabs: [
                        {
                            title: 'General',
                            content: getFormHTML({
                                'general': [
                                    { label: 'Organization', id: 'organization_id', type: 'select', options: appData.organizations.map(org => ({ value: org.id, label: org.company_name })), value: item.organization_id },
                                    { label: 'Unit Name', id: 'unit_name', value: item.unit_name },
                                    { label: 'Unit Head', id: 'unit_head', value: item.unit_head },
                                    { label: 'Budget', id: 'budget', value: item.budget },
                                    { label: 'Number of Employees', id: 'employees', value: item.employees },
                                    { label: 'Strategic Goals', id: 'strategic_goals', value: item.strategic_goals },
                                ]
                            }, item)
                        }
                    ],
                    onConfirm: async () => {
                    item.organization_id = document.getElementById('form-organization_id').value; // Capture organization_id
                    item.unit_name = document.getElementById('form-unit_name').value;
                    item.unit_head = document.getElementById('form-unit_head').value;
                    item.budget = document.getElementById('form-budget').value;
                    item.employees = document.getElementById('form-employees').value;
                    item.strategic_goals = document.getElementById('form-strategic_goals').value;
                    
                    // Mock API call
                    console.log('Updating business unit:', item);
                    updateWizardState();
                    return true;
                }});
            });
        });

        panelsContainer.querySelectorAll('[data-action="delete-bu"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                openModal({
                    title: 'Confirm Delete',
                    tabs: [
                        {
                            title: 'Confirmation',
                            content: '<p>Are you sure you want to delete this business unit?</p>'
                        }
                    ],
                    onConfirm: async () => {
                        // Mock API call
                        console.log('Deleting business unit with id:', id);
                        appData.business_units = appData.business_units.filter(bu => bu.id !== id);
                        updateWizardState();
                        return true;
                    }
                });
            });
        });
    }
};

window.businessUnitsModule = businessUnitsModule;
