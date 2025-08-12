const organizationModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        // Data is now loaded from appData, no need for mockOrganizations here
        // const mockOrganizations = [ ... ];

        // appData.organizations = mockOrganizations; // This line is no longer needed

        actionButtonContainer.innerHTML = `<button data-action="add-org" class="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md text-sm hover:bg-blue-700">Add Organization</button>`;
        
        let tableHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-slate-200 bg-slate-50">
                        <tr class="text-xs">
                            <th class="p-2 font-semibold">Company Name</th>
                            <th class="p-2 font-semibold">Industry</th>
                            <th class="p-2 font-semibold">Company Size</th>
                            <th class="p-2 font-semibold">Country</th>
                            <th class="p-2 font-semibold">CEO</th>
                            <th class="p-2 font-semibold">Founded Year</th>
                            <th class="p-2 font-semibold">Revenue</th>
                            <th class="p-2 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${appData.organizations.map(org => `
                            <tr class="border-b border-slate-200">
                                <td class="p-2 font-medium text-slate-800">${org.company_name}</td>
                                <td class="p-2">${org.industry}</td>
                                <td class="p-2">${org.company_size}</td>
                                <td class="p-2">${org.country}</td>
                                <td class="p-2">${org.ceo}</td>
                                <td class="p-2">${org.founded_year}</td>
                                <td class="p-2">${org.revenue}</td>
                                <td class="p-2 flex gap-3 justify-end">
                                    <button data-action="edit-org" data-id="${org.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                                    <button data-action="delete-org" data-id="${org.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                                </td>
                            </tr>
                        `).join('') || `<tr><td colspan="8" class="text-center p-4 text-slate-400">No organization defined.</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;

        panelsContainer.innerHTML = tableHTML;

        // Event listeners for this step
        actionButtonContainer.querySelector('[data-action="add-org"]').addEventListener('click', () => {
            openModal({
                title: 'Add Organization',
                tabs: [
                    {
                        title: 'General',
                        content: getFormHTML({
                            'general': [
                                { label: 'Company Name', id: 'company_name' },
                                { label: 'Industry', id: 'industry' },
                                { label: 'Company Size', id: 'company_size' },
                                { label: 'Country', id: 'country' },
                                { label: 'CEO', id: 'ceo' },
                                { label: 'Founded Year', id: 'founded_year' },
                                { label: 'Revenue', id: 'revenue' },
                            ]
                        })
                    }
                ],
                onConfirm: async () => {
                const company_name = document.getElementById('form-company_name').value;
                const industry = document.getElementById('form-industry').value;
                const company_size = document.getElementById('form-company_size').value;
                const country = document.getElementById('form-country').value;
                const ceo = document.getElementById('form-ceo').value;
                const founded_year = document.getElementById('form-founded_year').value;
                const revenue = document.getElementById('form-revenue').value;

                if(!company_name || !industry) return false;
                
                try {
                    // Mock API call
                    console.log('Adding organization:', { company_name, industry, company_size, country, ceo, founded_year, revenue });
                    appData.organizations.push({
                        id: `org_${Date.now()}`, // Simple unique ID
                        company_name, industry, company_size, country, ceo, founded_year, revenue
                    });
                    updateWizardState();
                    return true;
                } catch (error) {
                    console.error('Error adding organization:', error);
                    alert('Failed to add organization. Please try again.');
                    return false;
                }
            }});
        });

        panelsContainer.querySelectorAll('[data-action="edit-org"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                let item = appData.organizations.find(org => org.id === id);
                openModal({
                    title: 'Edit Organization',
                    tabs: [
                        {
                            title: 'General',
                            content: getFormHTML({
                                'general': [
                                    { label: 'Company Name', id: 'company_name', value: item.company_name },
                                    { label: 'Industry', id: 'industry', value: item.industry },
                                    { label: 'Company Size', id: 'company_size', value: item.company_size },
                                    { label: 'Country', id: 'country', value: item.country },
                                ]
                            }, item)
                        },
                        {
                            title: 'Additional Details',
                            content: getFormHTML({
                                'additional_details': [
                                    { label: 'CEO', id: 'ceo', value: item.ceo },
                                    { label: 'Founded Year', id: 'founded_year', value: item.founded_year },
                                    { label: 'Revenue', id: 'revenue', value: item.revenue },
                                ]
                            }, item)
                        }
                    ],
                    onConfirm: async () => {
                    item.company_name = document.getElementById('form-company_name').value;
                    item.industry = document.getElementById('form-industry').value;
                    item.company_size = document.getElementById('form-company_size').value;
                    item.country = document.getElementById('form-country').value;
                    item.ceo = document.getElementById('form-ceo').value;
                    item.founded_year = document.getElementById('form-founded_year').value;
                    item.revenue = document.getElementById('form-revenue').value;
                    
                    try {
                        // Mock API call
                        console.log('Updating organization:', item);
                        updateWizardState();
                        return true;
                    } catch (error) {
                        console.error('Error updating organization:', error);
                        alert('Failed to update organization. Please try again.');
                        return false;
                    }
                }});
            });
        });

        panelsContainer.querySelectorAll('[data-action="delete-org"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                openModal({
                    title: 'Confirm Delete',
                    tabs: [
                        {
                            title: 'Confirmation',
                            content: '<p>Are you sure you want to delete this organization?</p>'
                        }
                    ],
                    onConfirm: async () => {
                        try {
                            // Mock API call
                            console.log('Deleting organization with id:', id);
                            appData.organizations = appData.organizations.filter(org => org.id !== id);
                            updateWizardState();
                            return true;
                        } catch (error) {
                            console.error('Error deleting organization:', error);
                            alert('Failed to delete organization. Please try again.');
                            return false;
                        }
                    }
                });
            });
        });
    }
};

window.organizationModule = organizationModule;
