export function init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
    const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
    const panelsContainer = contentWrapper.querySelector('.panels-container');

    if (!actionButtonContainer || !panelsContainer) {
        console.error('Required containers not found for job_levels.js');
        return;
    }

    actionButtonContainer.innerHTML = `<button data-action="add-jl" class="bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Add Job Level
    </button>`;
    
    let tableRows = appData.job_levels.map(jl => `
        <tr class="border-b border-slate-200">
            <td class="p-2">${jl.id}</td>
            <td class="p-2 font-medium text-slate-800">${jl.level_name}</td>
            <td class="p-2">${jl.description}</td>
            <td class="p-2">${jl.seniority_rank}</td>
            <td class="p-2">${jl.pay_grade}</td>
            <td class="p-2">${jl.promotion_rules}</td>
            <td class="p-2">${jl.min_years_experience}</td>
            <td class="p-2 flex gap-3 justify-end">
                <button data-action="edit-jl" data-id="${jl.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                <button data-action="delete-jl" data-id="${jl.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
            </td>
        </tr>`).join('');

    panelsContainer.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-slate-200 bg-slate-50">
                    <tr class="text-xs">
                        <th class="p-2 font-semibold">ID</th>
                        <th class="p-2 font-semibold">Level Name</th>
                        <th class="p-2 font-semibold">Description</th>
                        <th class="p-2 font-semibold">Seniority Rank</th>
                        <th class="p-2 font-semibold">Pay Grade</th>
                        <th class="p-2 font-semibold">Promotion Rules</th>
                        <th class="p-2 font-semibold">Min Years Experience</th>
                        <th class="p-2 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows || `<tr><td colspan="8" class="text-center p-4 text-slate-400">No job levels defined.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;

    // Event listeners for this step
    actionButtonContainer.querySelector('[data-action="add-jl"]').addEventListener('click', () => {
        openModal({ title: 'Add Job Level', content: getFormHTML({
            'general': [
                {label: 'Level Name', id: 'level_name'},
                {label: 'Description', id: 'description', type: 'textarea', rows: 3},
                {label: 'Seniority Rank', id: 'seniority_rank', type: 'number'},
                {label: 'Pay Grade', id: 'pay_grade'},
                {label: 'Promotion Rules', id: 'promotion_rules', type: 'textarea', rows: 3},
                {label: 'Min Years Experience', id: 'min_years_experience', type: 'number'}
            ]
        }), onConfirm: async () => {
            const level_name = document.getElementById('form-level_name').value;
            const description = document.getElementById('form-description').value;
            const seniority_rank = parseInt(document.getElementById('form-seniority_rank').value);
            const pay_grade = document.getElementById('form-pay_grade').value;
            const promotion_rules = document.getElementById('form-promotion_rules').value;
            const min_years_experience = parseInt(document.getElementById('form-min_years_experience').value);

            if(!level_name) return false;

            try {
                const response = await fetch('/api/joblevels', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ level_name, description, seniority_rank, pay_grade, promotion_rules, min_years_experience })
                });
                if (!response.ok) throw new Error('Failed to add job level');
                updateWizardState();
                return true;
            } catch (error) {
                console.error('Error adding job level:', error);
                alert('Failed to add job level. Please try again.');
                return false;
            }
        }});
    });

    panelsContainer.querySelectorAll('[data-action="edit-jl"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            let item = appData.job_levels.find(jl => jl.id === id);
            openModal({ title: 'Edit Job Level', content: getFormHTML({
                'general': [
                    {label: 'Level Name', id: 'level_name', value: item.level_name},
                    {label: 'Description', id: 'description', type: 'textarea', rows: 3, value: item.description},
                    {label: 'Seniority Rank', id: 'seniority_rank', type: 'number', value: item.seniority_rank},
                    {label: 'Pay Grade', id: 'pay_grade', value: item.pay_grade},
                    {label: 'Promotion Rules', id: 'promotion_rules', type: 'textarea', rows: 3, value: item.promotion_rules},
                    {label: 'Min Years Experience', id: 'min_years_experience', type: 'number', value: item.min_years_experience}
                ]
            }), onConfirm: async () => {
                item.level_name = document.getElementById('form-level_name').value;
                item.description = document.getElementById('form-description').value;
                item.seniority_rank = parseInt(document.getElementById('form-seniority_rank').value);
                item.pay_grade = document.getElementById('form-pay_grade').value;
                item.promotion_rules = document.getElementById('form-promotion_rules').value;
                item.min_years_experience = parseInt(document.getElementById('form-min_years_experience').value);
                
                try {
                    const response = await fetch(`/api/joblevels/${item.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item)
                    });
                    if (!response.ok) throw new Error('Failed to update job level');
                    updateWizardState();
                    return true;
                } catch (error) {
                    console.error('Error updating job level:', error);
                    alert('Failed to update job level. Please try again.');
                    return false;
                }
            }});
        });
    });

    panelsContainer.querySelectorAll('[data-action="delete-jl"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            openModal({
                title: 'Confirm Delete',
                content: 'Are you sure you want to delete this job level?',
                onConfirm: async () => {
                    try {
                        const response = await fetch(`/api/joblevels/${id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) throw new Error('Failed to delete job level');
                        updateWizardState();
                        return true;
                    } catch (error) {
                        console.error('Error deleting job level:', error);
                        alert('Failed to delete job level. Please try again.');
                        return false;
                    }
                }
            });
        });
    });
}
