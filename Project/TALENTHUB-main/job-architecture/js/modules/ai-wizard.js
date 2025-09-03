const aiWizardModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper, navigation) {
        const aiWizardBtn = contentWrapper.querySelector('#ai-wizard-btn');
        const manualAddBtn = contentWrapper.querySelector('#manual-add-btn');

        if (aiWizardBtn) {
            aiWizardBtn.addEventListener('click', () => {
                const aiWizardStep = 7; // This should match the step ID in main.js
                navigation.navigateToStep(aiWizardStep);
            });
        }

        if (manualAddBtn) {
            manualAddBtn.addEventListener('click', () => {
                const mockJobData = {
                    job_title: 'Senior Frontend Engineer',
                    job_summary: 'We are looking for a skilled Senior Frontend Engineer to build high-quality user interfaces for our web applications.',
                    job_code: 'ENG-FE-004',
                    department: 'dept_eng',
                    job_level: 'level_4',
                    reports_to: 'Engineering Manager',
                    responsibilities: 'Develop new user-facing features.\nBuild reusable code and libraries for future use.\nEnsure the technical feasibility of UI/UX designs.\nOptimize application for maximum speed and scalability.',
                    qualifications: '5+ years of experience in frontend development.\nProficient in React, Vue, or Angular.\nStrong understanding of HTML, CSS, and JavaScript.\nExperience with RESTful APIs.',
                    skills: 'React, JavaScript, HTML, CSS, UI/UX, RESTful APIs, Git',
                    salary_min: '120000',
                    salary_max: '160000',
                    currency: 'USD',
                    location: 'San Francisco, CA',
                    remote_policy: 'hybrid',
                };

                const populateFormWithMockData = () => {
                    for (const [key, value] of Object.entries(mockJobData)) {
                        const input = document.getElementById(`form-${key}`);
                        if (input) {
                            input.value = Array.isArray(value) ? value.join(', ') : value;
                        }
                    }
                };

                const jobDetailsSection = {
                    job_details: [
                        { id: 'job_title', label: 'Job Title' },
                        { id: 'job_summary', label: 'Job Summary', type: 'textarea', rows: 4 },
                    ]
                };

                const internalDetailsSection = {
                    internal_details: [
                        { id: 'job_code', label: 'Job Code' },
                        { id: 'department', label: 'Department', type: 'select', options: appData.departments.map(d => ({ value: d.id, label: d.name })) },
                        { id: 'job_level', label: 'Job Level', type: 'select', options: appData.job_levels.map(l => ({ value: l.id, label: l.name })) },
                        { id: 'reports_to', label: 'Reports To' },
                    ]
                };

                const responsibilitiesSection = {
                    responsibilities_and_qualifications: [
                        { id: 'responsibilities', label: 'Key Responsibilities', type: 'textarea', rows: 5 },
                        { id: 'qualifications', label: 'Required Qualifications', type: 'textarea', rows: 5 },
                        { id: 'skills', label: 'Required Skills (comma-separated)', type: 'textarea', rows: 3 },
                    ]
                };

                const compensationSection = {
                    compensation_and_location: [
                        { id: 'salary_min', label: 'Minimum Salary' },
                        { id: 'salary_max', label: 'Maximum Salary' },
                        { id: 'currency', label: 'Currency' },
                        { id: 'location', label: 'Location' },
                        { id: 'remote_policy', label: 'Remote Policy', type: 'select', options: [
                            { value: 'on-site', label: 'On-site' },
                            { value: 'hybrid', label: 'Hybrid' },
                            { value: 'remote', label: 'Remote' },
                        ]},
                    ]
                };

                openModal({
                    title: 'Add Job Manually',
                    tabs: [
                        {
                            title: 'Job Details',
                            content: getFormHTML(jobDetailsSection)
                        },
                        {
                            title: 'Internal Details',
                            content: getFormHTML(internalDetailsSection)
                        },
                        {
                            title: 'Responsibilities & Qualifications',
                            content: getFormHTML(responsibilitiesSection)
                        },
                        {
                            title: 'Compensation & Location',
                            content: getFormHTML(compensationSection)
                        }
                    ],
                    extraButtons: [
                        {
                            id: 'load-mock-data-btn',
                            text: 'Load Mock Data',
                            classes: 'bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors',
                            onClick: populateFormWithMockData
                        }
                    ],
                    onConfirm: () => {
                        const newJob = {
                            job_title: document.getElementById('form-job_title').value,
                            job_summary: document.getElementById('form-job_summary').value,
                            job_code: document.getElementById('form-job_code').value,
                            department: document.getElementById('form-department').value,
                            job_level: document.getElementById('form-job_level').value,
                            reports_to: document.getElementById('form-reports_to').value,
                            responsibilities: document.getElementById('form-responsibilities').value,
                            qualifications: document.getElementById('form-qualifications').value,
                            skills: document.getElementById('form-skills').value.split(',').map(s => s.trim()),
                            salary_min: document.getElementById('form-salary_min').value,
                            salary_max: document.getElementById('form-salary_max').value,
                            currency: document.getElementById('form-currency').value,
                            location: document.getElementById('form-location').value,
                            remote_policy: document.getElementById('form-remote_policy').value,
                        };
                        console.log('New job added:', newJob);
                        // Here you would typically call an API to save the data
                        // and then update the appData object.
                        return true; // Return true to close the modal
                    }
                });
            });
        }
    }
};

window.aiWizardModule = aiWizardModule;
