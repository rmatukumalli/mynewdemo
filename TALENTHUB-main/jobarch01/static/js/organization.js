export function init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
    setTimeout(() => { // Defer execution to ensure DOM is ready
        const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
        const panelsContainer = contentWrapper.querySelector('.panels-container');

        if (!actionButtonContainer || !panelsContainer) {
            console.error('Required containers not found for organization.js');
            return;
        }

        actionButtonContainer.innerHTML = `<button data-action="add-org" class="bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
            Add Organization
        </button>`;
        
        let tableRows = appData.organizations.map(org => `
            <tr class="border-b border-slate-200">
                <td class="p-2">${org.id}</td>
                <td class="p-2 font-medium text-slate-800">${org.company_name}</td>
                <td class="p-2">${org.industry}</td>
                <td class="p-2">${org.company_size}</td>
                <td class="p-2">${org.operating_regions ? org.operating_regions.join(', ') : ''}</td>
                <td class="p-2">${org.vision_mission}</td>
                <td class="p-2">${org.org_maturity_level}</td>
                <td class="p-2 flex gap-3 justify-end">
                    <button data-action="edit-org" data-id="${org.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                    <button data-action="delete-org" data-id="${org.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
                </td>
            </tr>`).join('');
        
        panelsContainer.innerHTML = `<div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-slate-200 bg-slate-50"><tr class="text-xs">
                    <th class="p-2 font-semibold">ID</th>
                    <th class="p-2 font-semibold">Company Name</th>
                    <th class="p-2 font-semibold">Industry</th>
                    <th class="p-2 font-semibold">Company Size</th>
                    <th class="p-2 font-semibold">Operating Regions</th>
                    <th class="p-2 font-semibold">Vision / Mission</th>
                    <th class="p-2 font-semibold">Maturity Level</th>
                    <th class="p-2 font-semibold text-right">Actions</th>
                </tr></thead>
                <tbody>${tableRows || `<tr><td colspan="8" class="text-center p-4 text-slate-400">No organizations defined.</td></tr>`}</tbody>
            </table>
        </div>`;

        // Handle actions for this step
        actionButtonContainer.querySelector('[data-action="add-org"]').addEventListener('click', () => {
            openModal({ title: 'Add Organization', content: getFormHTML({
                'general': [
                    {label: 'Company Name', id: 'company_name'},
                    {label: 'Industry', id: 'industry', type: 'select', options: [{value: 'IT', label: 'IT'}, {value: 'BFSI', label: 'BFSI'}, {value: 'Healthcare', label: 'Healthcare'}, {value: 'Aviation', label: 'Aviation'}]},
                    {label: 'Company Size', id: 'company_size', type: 'select', options: [{value: '1-50', label: '1-50'}, {value: '51-500', label: '51-500'}, {value: '501-5000', label: '501-5000'}, {value: '5000+', label: '5000+'}]},
                    {label: 'Country', id: 'country'},
                ],
                'details': [
                    {label: 'Operating Regions', id: 'operating_regions', type: 'multi-select', options: [{value: 'North America', label: 'North America'}, {value: 'Europe', label: 'Europe'}, {value: 'Asia', label: 'Asia'}, {value: 'South America', label: 'South America'}, {value: 'Africa', label: 'Africa'}, {value: 'Australia', label: 'Australia'}]},
                    {label: 'Vision / Mission', id: 'vision_mission', type: 'textarea', rows: 3},
                    {label: 'Organizational Maturity Level', id: 'org_maturity_level', type: 'select', options: [{value: 'Startup', label: 'Startup'}, {value: 'Growth', label: 'Growth'}, {value: 'Enterprise', label: 'Enterprise'}]},
                    {label: 'Regulatory Bodies', id: 'regulatory_bodies', type: 'multi-select', options: [{value: 'FAA', label: 'FAA'}, {value: 'EASA', label: 'EASA'}, {value: 'DGCA', label: 'DGCA'}]},
                    {label: 'Union Presence', id: 'union_presence', type: 'checkbox'}
                ]
            }), onConfirm: async () => {
                const company_name = document.getElementById('form-company_name').value;
                const country = document.getElementById('form-country').value;
                const company_size = document.getElementById('form-company_size').value;
                const operating_regions = Array.from(document.getElementById('form-operating_regions').querySelectorAll('input[type="text"]')).map(input => input.value).filter(v => v);
                const vision_mission = document.getElementById('form-vision_mission').value;
                const org_maturity_level = document.getElementById('form-org_maturity_level').value;
                const industry = document.getElementById('form-industry').value;
                const regulatory_bodies = Array.from(document.getElementById('form-regulatory_bodies').querySelectorAll('input[type="text"]')).map(input => input.value).filter(v => v);
                const union_presence = document.getElementById('form-union_presence').checked;

                if(!company_name) return false;

                try {
                    const newOrg = await callAPI('/api/organizations', 'POST', { company_name, country, company_size, operating_regions, vision_mission, org_maturity_level, industry, regulatory_bodies, union_presence });
                    appData.organizations.push(newOrg);
                    updateWizardState(); // Use updateWizardState to re-render everything
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
                let item = appData.organizations.find(o => o.id === id);
                openModal({ title: 'Edit Organization', content: getFormHTML({
                    'general': [
                        {label: 'Company Name', id: 'company_name', value: item.company_name},
                        {label: 'Industry', id: 'industry', type: 'select', value: item.industry, options: [{value: 'IT', label: 'IT'}, {value: 'BFSI', label: 'BFSI'}, {value: 'Healthcare', label: 'Healthcare'}, {value: 'Aviation', label: 'Aviation'}]},
                        {label: 'Company Size', id: 'company_size', type: 'select', value: item.company_size, options: [{value: '1-50', label: '1-50'}, {value: '51-500', label: '51-500'}, {value: '501-5000', label: '501-5000'}, {value: '5000+', label: '5000+'}]},
                        {label: 'Country', id: 'country', value: item.country},
                    ],
                    'details': [
                        {label: 'Operating Regions', id: 'operating_regions', type: 'multi-select', value: item.operating_regions, options: []}, // Options not needed for multi-select tag input
                        {label: 'Vision / Mission', id: 'vision_mission', type: 'textarea', rows: 3, value: item.vision_mission},
                        {label: 'Organizational Maturity Level', id: 'org_maturity_level', type: 'select', value: item.org_maturity_level, options: [{value: 'Startup', label: 'Startup'}, {value: 'Growth', label: 'Growth'}, {value: 'Enterprise', label: 'Enterprise'}]},
                        {label: 'Regulatory Bodies', id: 'regulatory_bodies', type: 'multi-select', value: item.regulatory_bodies, options: []}, // Options not needed for multi-select tag input
                        {label: 'Union Presence', id: 'union_presence', type: 'checkbox', value: item.union_presence}
                    ]
                }), onConfirm: async () => {
                    item.company_name = document.getElementById('form-company_name').value;
                    item.country = document.getElementById('form-country').value;
                    item.company_size = document.getElementById('form-company_size').value;
                    item.operating_regions = Array.from(document.getElementById('form-operating_regions').querySelectorAll('input[type="text"]')).map(input => input.value).filter(v => v);
                    item.vision_mission = document.getElementById('form-vision_mission').value;
                    item.org_maturity_level = document.getElementById('form-org_maturity_level').value;
                    item.industry = document.getElementById('form-industry').value;
                    item.regulatory_bodies = Array.from(document.getElementById('form-regulatory_bodies').querySelectorAll('input[type="text"]')).map(input => input.value).filter(v => v);
                    item.union_presence = document.getElementById('form-union_presence').checked;
                    
                    try {
                        const updatedOrg = await callAPI(`/api/organizations/${item.id}`, 'PUT', item);
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
                    content: 'Are you sure you want to delete this organization?',
                    onConfirm: async () => {
                        try {
                            await callAPI(`/api/organizations/${id}`, 'DELETE');
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
    }, 0); // End of setTimeout
}
