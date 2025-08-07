export function init(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper) {
    const actionButtonContainer = contentWrapper.querySelector('.action-buttons');
    const panelsContainer = contentWrapper.querySelector('.panels-container');

    if (!actionButtonContainer || !panelsContainer) {
        console.error('Required containers not found for jobs_skills.js');
        return;
    }

    actionButtonContainer.innerHTML = `<button data-action="add-job" class="bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
        Add Job
    </button>
    <button data-action="generate-job" class="bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-md text-sm hover:bg-blue-200 flex items-center gap-1.5">✨ Generate with AI</button>`;
    
    let tableRows = appData.jobs_skills.map(job => {
        const roleGroup = appData.role_groups.find(rg => rg.id === job.role_group);
        const jobLevel = appData.job_levels.find(jl => jl.id === job.job_level);
        return `
        <tr class="border-b border-slate-200">
            <td class="p-2">${job.id}</td>
            <td class="p-2 font-medium text-slate-800">${job.job_title}</td>
            <td class="p-2">${roleGroup ? roleGroup.group_name : 'N/A'}</td>
            <td class="p-2">${jobLevel ? jobLevel.level_name : 'N/A'}</td>
            <td class="p-2">${job.job_code}</td>
            <td class="p-2">${job.is_unionized ? 'Yes' : 'No'}</td>
            <td class="p-2 flex gap-3 justify-end">
                <button data-action="edit-job" data-id="${job.id}" class="text-slate-500 hover:text-blue-600 font-medium">Edit</button>
                <button data-action="delete-job" data-id="${job.id}" class="text-slate-500 hover:text-red-600 font-medium">Delete</button>
            </td>
        </tr>`;
    }).join('');

    panelsContainer.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-slate-200 bg-slate-50">
                    <tr class="text-xs">
                        <th class="p-2 font-semibold">ID</th>
                        <th class="p-2 font-semibold">Job Title</th>
                        <th class="p-2 font-semibold">Role Group</th>
                        <th class="p-2 font-semibold">Job Level</th>
                        <th class="p-2 font-semibold">Job Code</th>
                        <th class="p-2 font-semibold">Unionized</th>
                        <th class="p-2 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows || `<tr><td colspan="7" class="text-center p-4 text-slate-400">No jobs defined.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;

    // Event listeners for this step
    actionButtonContainer.querySelector('[data-action="add-job"]').addEventListener('click', () => {
        openModal({ title: 'Add Job', content: getFormHTML({
            'general': [
                {label: 'Job Title', id: 'job_title'},
                {label: 'Role Group', id: 'role_group', type: 'select', options: appData.role_groups.map(rg => ({value: rg.id, label: rg.group_name}))},
                {label: 'Job Level', id: 'job_level', type: 'select', options: appData.job_levels.map(jl => ({value: jl.id, label: jl.level_name}))},
                {label: 'Job Code', id: 'job_code'},
                {label: 'Reports To', id: 'reports_to'},
                {label: 'Is Unionized', id: 'is_unionized', type: 'checkbox'},
            ],
            'details': [
                {label: 'Job Description', id: 'job_description', type: 'textarea', rows: 5},
                {label: 'Responsibilities (comma-separated)', id: 'responsibilities', type: 'text'},
            ],
            'skills_qualifications': [
                {label: 'Core Skills (comma-separated)', id: 'core_skills', type: 'text'},
                {label: 'Soft Skills (comma-separated)', id: 'soft_skills', type: 'text'},
                {label: 'Tools & Tech (comma-separated)', id: 'tools_tech', type: 'text'},
                {label: 'Certifications Required (comma-separated)', id: 'certifications_required', type: 'text'},
                {label: 'Education Required', id: 'education_required'},
                {label: 'Experience Required', id: 'experience_required'},
            ],
            'logistics': [
                {label: 'Job Location', id: 'job_location'},
                {label: 'Travel Required', id: 'travel_required', type: 'checkbox'},
                {label: 'Remote Option', id: 'remote_option', type: 'checkbox'},
                {label: 'Languages Required (comma-separated)', id: 'languages_required', type: 'text'}
            ]
        }), onConfirm: async () => {
            const job_title = document.getElementById('form-job_title').value;
            const role_group = document.getElementById('form-role_group').value;
            const job_level = document.getElementById('form-job_level').value;
            const job_code = document.getElementById('form-job_code').value;
            const reports_to = document.getElementById('form-reports_to').value;
            const is_unionized = document.getElementById('form-is_unionized').checked;
            const job_description = document.getElementById('form-job_description').value;
            const responsibilities = document.getElementById('form-responsibilities').value.split(',').map(s => s.trim()).filter(s => s);
            const core_skills = document.getElementById('form-core_skills').value.split(',').map(s => s.trim()).filter(s => s);
            const soft_skills = document.getElementById('form-soft_skills').value.split(',').map(s => s.trim()).filter(s => s);
            const tools_tech = document.getElementById('form-tools_tech').value.split(',').map(s => s.trim()).filter(s => s);
            const certifications_required = document.getElementById('form-certifications_required').value.split(',').map(s => s.trim()).filter(s => s);
            const education_required = document.getElementById('form-education_required').value;
            const experience_required = document.getElementById('form-experience_required').value;
            const job_location = document.getElementById('form-job_location').value;
            const travel_required = document.getElementById('form-travel_required').checked;
            const remote_option = document.getElementById('form-remote_option').checked;
            const languages_required = document.getElementById('form-languages_required').value.split(',').map(s => s.trim()).filter(s => s);

            if(!job_title || !role_group || !job_level) return false;

            try {
                const newJob = await callAPI('/api/jobs_skills', 'POST', {
                    job_title, role_group, job_level, job_code, reports_to, is_unionized, job_description,
                    responsibilities, core_skills, soft_skills, tools_tech, certifications_required,
                    education_required, experience_required, job_location, travel_required, remote_option, languages_required
                });
                appData.jobs_skills.push(newJob);
                updateWizardState();
                return true;
            } catch (error) {
                console.error('Error adding job:', error);
                alert('Failed to add job. Please try again.');
                return false;
            }
        }});
    });

    actionButtonContainer.querySelector('[data-action="generate-job"]').addEventListener('click', () => {
        openModal({ title: '✨ Generate Job Description', content: `<p class="text-sm text-slate-600 mb-2">Enter a job title and our AI will generate a description, skills, etc.</p><input type="text" id="ai-job-title-input" class="w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., Senior Pilot">`, onConfirm: async () => {
            const jobTitle = document.getElementById('ai-job-title-input').value;
            if(!jobTitle) return false;
            try {
                const data = await callAPI('/api/ai/generate_job_description', 'POST', { jobTitle });
                // Pre-fill the add job form with AI generated data
                openModal({ title: 'Add Job (AI Generated)', content: getFormHTML([
                    {label: 'Job Title', id: 'job_title', value: jobTitle},
                    {label: 'Role Group', id: 'role_group', type: 'select', options: appData.role_groups.map(rg => ({value: rg.id, label: rg.group_name}))},
                    {label: 'Job Level', id: 'job_level', type: 'select', options: appData.job_levels.map(jl => ({value: jl.id, label: jl.level_name}))},
                    {label: 'Job Code', id: 'job_code'},
                    {label: 'Reports To', id: 'reports_to'},
                    {label: 'Is Unionized', id: 'is_unionized', type: 'checkbox'},
                    {label: 'Job Description', id: 'job_description', type: 'textarea', rows: 3, value: data.description},
                    {label: 'Responsibilities (comma-separated)', id: 'responsibilities', type: 'text', value: data.responsibilities ? data.responsibilities.join(', ') : ''},
                    {label: 'Core Skills (comma-separated)', id: 'core_skills', type: 'text', value: data.core_skills ? data.core_skills.join(', ') : ''},
                    {label: 'Soft Skills (comma-separated)', id: 'soft_skills', type: 'text', value: data.soft_skills ? data.soft_skills.join(', ') : ''},
                    {label: 'Tools & Tech (comma-separated)', id: 'tools_tech', type: 'text', value: data.tools_tech ? data.tools_tech.join(', ') : ''},
                    {label: 'Certifications Required (comma-separated)', id: 'certifications_required', type: 'text', value: data.certifications ? data.certifications.join(', ') : ''},
                    {label: 'Education Required', id: 'education_required'},
                    {label: 'Experience Required', id: 'experience_required'},
                    {label: 'Job Location', id: 'job_location'},
                    {label: 'Travel Required', id: 'travel_required', type: 'checkbox'},
                    {label: 'Remote Option', id: 'remote_option', type: 'checkbox'},
                    {label: 'Languages Required (comma-separated)', id: 'languages_required', type: 'text'}
                ]), onConfirm: async () => {
                    const job_title = document.getElementById('form-job_title').value;
                    const role_group = document.getElementById('form-role_group').value;
                    const job_level = document.getElementById('form-job_level').value;
                    const job_code = document.getElementById('form-job_code').value;
                    const reports_to = document.getElementById('form-reports_to').value;
                    const is_unionized = document.getElementById('form-is_unionized').checked;
                    const job_description = document.getElementById('form-job_description').value;
                    const responsibilities = document.getElementById('form-responsibilities').value.split(',').map(s => s.trim()).filter(s => s);
                    const core_skills = document.getElementById('form-core_skills').value.split(',').map(s => s.trim()).filter(s => s);
                    const soft_skills = document.getElementById('form-soft_skills').value.split(',').map(s => s.trim()).filter(s => s);
                    const tools_tech = document.getElementById('form-tools_tech').value.split(',').map(s => s.trim()).filter(s => s);
                    const certifications_required = document.getElementById('form-certifications_required').value.split(',').map(s => s.trim()).filter(s => s);
                    const education_required = document.getElementById('form-education_required').value;
                    const experience_required = document.getElementById('form-experience_required').value;
                    const job_location = document.getElementById('form-job_location').value;
                    const travel_required = document.getElementById('form-travel_required').checked;
                    const remote_option = document.getElementById('form-remote_option').checked;
                    const languages_required = document.getElementById('form-languages_required').value.split(',').map(s => s.trim()).filter(s => s);

                    if(!job_title || !role_group || !job_level) return false;

                    try {
                        const newJob = await callAPI('/api/jobs_skills', 'POST', {
                            job_title, role_group, job_level, job_code, reports_to, is_unionized, job_description,
                            responsibilities, core_skills, soft_skills, tools_tech, certifications_required,
                            education_required, experience_required, job_location, travel_required, remote_option, languages_required
                        });
                        appData.jobs_skills.push(newJob);
                        updateWizardState();
                        return true;
                    } catch (error) {
                        console.error('Error adding job:', error);
                        alert('Failed to add job. Please try again.');
                        return false;
                    }
                }});
                return true;
            } catch (error) {
                console.error('Error generating job description:', error);
                alert('Failed to generate job description. Please try again.');
                return false;
            }
        }});
    });

    panelsContainer.querySelectorAll('[data-action="edit-job"]').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            let item = appData.jobs_skills.find(job => job.id === id);
            openModal({ title: 'Edit Job', content: getFormHTML({
                'general': [
                    {label: 'Job Title', id: 'job_title', value: item.job_title},
                    {label: 'Role Group', id: 'role_group', type: 'select', value: item.role_group, options: appData.role_groups.map(rg => ({value: rg.id, label: rg.group_name}))},
                    {label: 'Job Level', id: 'job_level', type: 'select', value: item.job_level, options: appData.job_levels.map(jl => ({value: jl.id, label: jl.level_name}))},
                    {label: 'Job Code', id: 'job_code', value: item.job_code},
                    {label: 'Reports To', id: 'reports_to', value: item.reports_to},
                    {label: 'Is Unionized', id: 'is_unionized', type: 'checkbox', value: item.is_unionized},
                ],
                'details': [
                    {label: 'Job Description', id: 'job_description', type: 'textarea', rows: 5, value: item.job_description},
                    {label: 'Responsibilities (comma-separated)', id: 'responsibilities', type: 'text', value: item.responsibilities ? item.responsibilities.join(', ') : ''},
                ],
                'skills_qualifications': [
                    {label: 'Core Skills (comma-separated)', id: 'core_skills', type: 'text', value: item.core_skills ? item.core_skills.join(', ') : ''},
                    {label: 'Soft Skills (comma-separated)', id: 'soft_skills', type: 'text', value: item.soft_skills ? item.soft_skills.join(', ') : ''},
                    {label: 'Tools & Tech (comma-separated)', id: 'tools_tech', type: 'text', value: item.tools_tech ? item.tools_tech.join(', ') : ''},
                    {label: 'Certifications Required (comma-separated)', id: 'certifications_required', type: 'text', value: item.certifications_required ? item.certifications_required.join(', ') : ''},
                    {label: 'Education Required', id: 'education_required', value: item.education_required},
                    {label: 'Experience Required', id: 'experience_required', value: item.experience_required},
                ],
                'logistics': [
                    {label: 'Job Location', id: 'job_location', value: item.job_location},
                    {label: 'Travel Required', id: 'travel_required', type: 'checkbox', value: item.travel_required},
                    {label: 'Remote Option', id: 'remote_option', type: 'checkbox', value: item.remote_option},
                    {label: 'Languages Required (comma-separated)', id: 'languages_required', type: 'text', value: item.languages_required ? item.languages_required.join(', ') : ''}
                ]
            }), onConfirm: async () => {
                item.job_title = document.getElementById('form-job_title').value;
                item.role_group = document.getElementById('form-role_group').value;
                item.job_level = document.getElementById('form-job_level').value;
                item.job_code = document.getElementById('form-job_code').value;
                item.reports_to = document.getElementById('form-reports_to').value;
                item.is_unionized = document.getElementById('form-is_unionized').checked;
                item.job_description = document.getElementById('form-job_description').value;
                item.responsibilities = document.getElementById('form-responsibilities').value.split(',').map(s => s.trim()).filter(s => s);
                item.core_skills = document.getElementById('form-core_skills').value.split(',').map(s => s.trim()).filter(s => s);
                item.soft_skills = document.getElementById('form-soft_skills').value.split(',').map(s => s.trim()).filter(s => s);
                item.tools_tech = document.getElementById('form-tools_tech').value.split(',').map(s => s.trim()).filter(s => s);
                item.certifications_required = document.getElementById('form-certifications_required').value.split(',').map(s => s.trim()).filter(s => s);
                item.education_required = document.getElementById('form-education_required').value;
                item.experience_required = document.getElementById('form-experience_required').value;
                item.job_location = document.getElementById('form-job_location').value;
                item.travel_required = document.getElementById('form-travel_required').checked;
                item.remote_option = document.getElementById('form-remote_option').checked;
                item.languages_required = document.getElementById('form-languages_required').value.split(',').map(s => s.trim()).filter(s => s);
                
                try {
                    const updatedJob = await callAPI(`/api/jobs_skills/${item.id}`, 'PUT', item);
                    updateWizardState();
                    return true;
                } catch (error) {
                    console.error('Error updating job:', error);
                    alert('Failed to update job. Please try again.');
                    return false;
                }
            }});
        });
    });

    panelsContainer.querySelectorAll('[data-action="delete-job"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            openModal({
                title: 'Confirm Delete',
                content: 'Are you sure you want to delete this job?',
                onConfirm: async () => {
                    try {
                        await callAPI(`/api/jobs_skills/${id}`, 'DELETE');
                        updateWizardState();
                        return true;
                    } catch (error) {
                        console.error('Error deleting job:', error);
                        alert('Failed to delete job. Please try again.');
                        return false;
                    }
                }
            });
        });
    });
}
