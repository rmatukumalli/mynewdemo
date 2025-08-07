document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const finishBtn = document.getElementById('finish-btn');
    const addCustomFieldBtn = document.getElementById('add-custom-field-btn');
    const printPreviewBtn = document.getElementById('print-preview-btn');
    const exportExcelBtn = document.getElementById('export-excel-btn');

    let currentStep = 1;
    const totalSteps = 9;

    function getStepFromURL() {
        const hash = window.location.hash;
        const match = hash.match(/step-(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }

    async function loadAllSteps() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const pageNames = [
            'role-overview',
            'organization-position-structure',
            'classification-hierarchy',
            'skills-capabilities-requirements',
            'performance-growth-mobility',
            'administrative-compliance-details',
            'custom-fields',
            'metadata-activity-log',
            'review-edit'
        ];

        const fetchPromises = pageNames.map(async (pageName, i) => {
            const stepNumber = i + 1;
            // Use URL constructor for robust path resolution with file:// protocol
            const stepUrl = new URL(`step-${stepNumber}-${pageName}.html`, window.location.href).href;
            const response = await fetch(stepUrl);
            const content = await response.text();
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-content';
            stepDiv.id = `step-${stepNumber}-content`;
            stepDiv.innerHTML = content;
            return stepDiv;
        });

        const stepDivs = await Promise.all(fetchPromises);
        stepDivs.forEach(stepDiv => mainContent.appendChild(stepDiv));

        loadAllData();
        showStep(getStepFromURL());
    }

    function showStep(stepNumber) {
        document.querySelectorAll('.step-content').forEach(step => {
            step.style.display = 'none';
        });
        const currentStepContent = document.getElementById(`step-${stepNumber}-content`);
        if (currentStepContent) {
            currentStepContent.style.display = 'block';
        }
        currentStep = stepNumber;
        window.location.hash = `step-${stepNumber}`;
        updateButtons();
    }

    function navigateToStep(stepNumber) {
        showStep(stepNumber);
    }

    async function loadAllData() {
        console.log('Loading all data...');
        try {
            const response = await fetch('/RoleDictionary/mock-data.json');
            const data = await response.json();
            const roleData = data.role;
            console.log('Role Data:', roleData);

            for (const stepKey in roleData) {
                const stepData = roleData[stepKey];
                if (stepData) {
                    for (const key in stepData) {
                        const input = document.getElementById(key.replace(/_/g, '-'));
                        if (input) {
                            if (Array.isArray(stepData[key])) {
                                if (input.multiple) {
                                    Array.from(input.options).forEach(option => {
                                        if (stepData[key].includes(option.value)) {
                                            option.selected = true;
                                        }
                                    });
                                } else {
                                    input.value = stepData[key].join(', ');
                                }
                            } else if (typeof stepData[key] === 'object' && stepData[key] !== null) {
                                if (input.tagName === 'TEXTAREA') {
                                    input.value = Object.entries(stepData[key]).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join('\n');
                                } else {
                                    for (const subKey in stepData[key]) {
                                        const subInput = document.getElementById(subKey.replace(/_/g, '-'));
                                        if (subInput) {
                                            subInput.value = stepData[key][subKey];
                                        }
                                    }
                                }
                            } else if (input.type === 'checkbox') {
                                input.checked = stepData[key];
                            } else if (input.tagName === 'SELECT') {
                                const option = Array.from(input.options).find(opt => opt.textContent.includes(stepData[key].toString()));
                                if (option) {
                                    option.selected = true;
                                } else {
                                    input.value = stepData[key];
                                }
                            } else {
                                input.value = stepData[key];
                            }
                        } else if (key === 'skills' && Array.isArray(stepData[key])) {
                            const skillsTableBody = document.querySelector('#skills-table tbody');
                            if (skillsTableBody) {
                                skillsTableBody.innerHTML = ''; // Clear existing rows
                                stepData[key].forEach(skill => {
                                    const newRow = document.createElement('tr');
                                    newRow.innerHTML = `
                                        <td><select class="form-input" name="capability"><option value="">Select Capability</option><option value="Technical" ${skill.capability === 'Technical' ? 'selected' : ''}>Technical</option><option value="Business" ${skill.capability === 'Business' ? 'selected' : ''}>Business</option></select></td>
                                        <td><select class="form-input" name="competency"><option value="">Select Competency</option><option value="Frontend Development" ${skill.competency === 'Frontend Development' ? 'selected' : ''}>Frontend Development</option><option value="Backend Development" ${skill.competency === 'Backend Development' ? 'selected' : ''}>Backend Development</option></select></td>
                                        <td><select class="form-input" name="skill"><option value="">Select Skill</option><option value="React.js" ${skill.name === 'React.js' ? 'selected' : ''}>React.js</option><option value="Angular" ${skill.name === 'Angular' ? 'selected' : ''}>Angular</option><option value="Vue.js" ${skill.name === 'Vue.js' ? 'selected' : ''}>Vue.js</option></select></td>
                                        <td><select class="form-input" name="min-proficiency"><option value="">Select</option><option value="1" ${skill.minimum_proficiency == 1 ? 'selected' : ''}>1</option><option value="2" ${skill.minimum_proficiency == 2 ? 'selected' : ''}>2</option><option value="3" ${skill.minimum_proficiency == 3 ? 'selected' : ''}>3</option><option value="4" ${skill.minimum_proficiency == 4 ? 'selected' : ''}>4</option><option value="5" ${skill.minimum_proficiency == 5 ? 'selected' : ''}>5</option></select></td>
                                        <td><select class="form-input" name="target-proficiency"><option value="">Select</option><option value="1" ${skill.target_proficiency == 1 ? 'selected' : ''}>1</option><option value="2" ${skill.target_proficiency == 2 ? 'selected' : ''}>2</option><option value="3" ${skill.target_proficiency == 3 ? 'selected' : ''}>3</option><option value="4" ${skill.target_proficiency == 4 ? 'selected' : ''}>4</option><option value="5" ${skill.target_proficiency == 5 ? 'selected' : ''}>5</option></select></td>
                                        <td><button class="btn btn-danger btn-sm remove-skill-btn">Remove</button></td>
                                    `;
                                    skillsTableBody.appendChild(newRow);
                                });
                            }
                        } else if (key === 'soft_skills' && Array.isArray(stepData[key])) {
                            const softSkillsTableBody = document.querySelector('#soft-skills-table tbody');
                            if (softSkillsTableBody) {
                                softSkillsTableBody.innerHTML = ''; // Clear existing rows
                                stepData[key].forEach(skill => {
                                    const newRow = document.createElement('tr');
                                    newRow.innerHTML = `
                                        <td><input type="text" class="form-input" name="skill" value="${skill.name}"></td>
                                        <td><select class="form-input" name="min-proficiency"><option value="">Select</option><option value="1" ${skill.minimum_proficiency == 1 ? 'selected' : ''}>1</option><option value="2" ${skill.minimum_proficiency == 2 ? 'selected' : ''}>2</option><option value="3" ${skill.minimum_proficiency == 3 ? 'selected' : ''}>3</option><option value="4" ${skill.minimum_proficiency == 4 ? 'selected' : ''}>4</option><option value="5" ${skill.minimum_proficiency == 5 ? 'selected' : ''}>5</option></select></td>
                                        <td><select class="form-input" name="target-proficiency"><option value="">Select</option><option value="1" ${skill.target_proficiency == 1 ? 'selected' : ''}>1</option><option value="2" ${skill.target_proficiency == 2 ? 'selected' : ''}>2</option><option value="3" ${skill.target_proficiency == 3 ? 'selected' : ''}>3</option><option value="4" ${skill.target_proficiency == 4 ? 'selected' : ''}>4</option><option value="5" ${skill.target_proficiency == 5 ? 'selected' : ''}>5</option></select></td>
                                        <td><button class="btn btn-danger btn-sm remove-skill-btn">Remove</button></td>
                                    `;
                                    softSkillsTableBody.appendChild(newRow);
                                });
                            }
                        } else if (key === 'learning_resources' && Array.isArray(stepData[key])) {
                            const learningResourcesList = document.getElementById('learning-resources-list');
                            if (learningResourcesList) {
                                learningResourcesList.innerHTML = '';
                                stepData[key].forEach((url, index) => {
                                    const linkContainer = document.createElement('div');
                                    linkContainer.className = 'learning-resource-item';
                                    
                                    const numberSpan = document.createElement('span');
                                    numberSpan.className = 'learning-resource-number';
                                    numberSpan.textContent = `${index + 1}.`;
                                    
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.textContent = url;
                                    link.target = '_blank';
                                    
                                    linkContainer.appendChild(numberSpan);
                                    linkContainer.appendChild(link);
                                    learningResourcesList.appendChild(linkContainer);
                                });
                            }
                        } else if (key === 'activity_log' && Array.isArray(stepData[key])) {
                            const activityLogEntriesContainer = document.getElementById('activity-log-entries');
                            if (activityLogEntriesContainer) {
                                const logHtml = stepData[key].map(log => {
                                    const formatValue = (value) => {
                                        if (Array.isArray(value)) {
                                            return `<ul>${value.map(item => `<li>${item}</li>`).join('')}</ul>`;
                                        }
                                        return value;
                                    };

                                    const changesHtml = Object.entries(log.changes).map(([field, change]) => `
                                        <p class="change-detail"><strong>Field:</strong> ${field.replace(/_/g, ' ')}</p>
                                        <div class="change-values">
                                            <div class="value-old"><strong>Old:</strong> ${formatValue(change.oldValue)}</div>
                                            <div class="value-new"><strong>New:</strong> ${formatValue(change.newValue)}</div>
                                        </div>
                                    `).join('');
                        
                                    return `
                                        <div class="log-entry">
                                            <p><strong>Changed By:</strong> ${log.changedBy}</p>
                                            <p><strong>Changed At:</strong> ${new Date(log.changedAt).toLocaleString()}</p>
                                            <div class="changes">
                                                ${changesHtml}
                                            </div>
                                            <p><strong>Comment:</strong> ${log.comment}</p>
                                        </div>
                                    `;
                                }).join('');
                                activityLogEntriesContainer.innerHTML = logHtml;
                            }
                        }
                    }
                }
            }

            if (currentStep === 9) {
                console.log('Populating review for step:', currentStep, 'with data:', roleData);
                populateReview(roleData);
            }

        } catch (error) {
            console.error('Error loading mock data:', error);
        }
    }

    function populateReview(data) {
        console.log('Inside populateReview function.');
        const reviewContent = document.getElementById('review-content');
        if (!reviewContent) return;
        reviewContent.innerHTML = '<div class="review-column"></div><div class="review-column"></div>';
        const columns = reviewContent.querySelectorAll('.review-column');

        const sections = [
            { title: 'Role Overview', step: 1, key: 'step3_role_overview', fields: ['role_title', 'role_summary', 'job_description', 'key_responsibilities', 'decision_scope'] },
            { title: 'Organization & Position Structure', step: 2, key: 'step1_organization_and_position_structure', fields: ['business_unit', 'department', 'job_family', 'role_group', 'role_code', 'created_date', 'team_size', 'reporting_lines', 'matrix_relationships'] },
            { title: 'Classification & Hierarchy', step: 3, key: 'step2_classification_and_hierarchy', fields: ['career_track', 'level', 'grade', 'seniority_label', 'feeder_roles', 'reports_to', 'location', 'location_type', 'employment_type', 'contract_type'] },
            { title: 'Skills, Capabilities & Requirements', step: 4, key: 'step4_skills_capabilities_requirements', fields: ['experience_requirements', 'skills', 'soft_skills', 'tools_technologies', 'certifications', 'learning_resources'] },
            { title: 'Performance, Growth & Mobility', step: 5, key: 'step5_performance_growth_mobility', fields: ['kpis_outcomes', 'performance_review_cycle', 'professional_development_support', 'impact_areas', 'behavioral_competencies', 'career_path_next_roles', 'feeder_roles', 'mobility_options', 'time_allocation', 'succession_plan_ready', 'criticality_to_business', 'backup_resource_assigned'] },
            { title: 'Administrative & Compliance Details', step: 6, key: 'step6_admin_compliance', fields: ['billable', 'access_level', 'expected_onboarding_date', 'status', 'approval_status', 'security_clearance', 'background_check', 'mandatory_compliance_training', 'equipment_provisioning'] },
            { title: 'Custom Fields', step: 7, key: 'step7_custom_fields', fields: ['salary_band', 'remote_work_policy', 'travel_expectations', 'on_call_duties', 'innovation_time'] },
            { title: 'Metadata & Activity Log', step: 8, key: 'step8_metadata_activity_log', fields: ['created_by', 'last_updated', 'activity_log'] }
        ];
        console.log('Sections:', sections);

        sections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'summary-section';
            sectionDiv.innerHTML = `<h3>${section.title} <a href="#" class="edit-link" data-step="${section.step}">Edit</a></h3>`;
            const fieldsList = document.createElement('ul');
            const sectionData = data[section.key];
            console.log('Section Data for', section.title, ':', sectionData);

            if (sectionData) {
                 if (section.key === 'step7_custom_fields') {
                    if (Object.keys(sectionData).length > 0) {
                        const listItem = document.createElement('li');
                        const customFieldsHtml = Object.entries(sectionData).map(([key, val]) => `<strong>${key.replace(/_/g, ' ')}:</strong> ${val}`).join('<br>');
                        listItem.innerHTML = `${customFieldsHtml}`;
                        fieldsList.appendChild(listItem);
                    } else {
                         const listItem = document.createElement('li');
                         listItem.innerHTML = `<em>Not specified</em>`;
                         fieldsList.appendChild(listItem);
                    }
                } else {
                    section.fields.forEach(fieldKey => {
                        const listItem = document.createElement('li');
                        const label = fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        let value = sectionData[fieldKey];

                        if ((fieldKey === 'skills' || fieldKey === 'soft_skills') && Array.isArray(value)) {
                             listItem.innerHTML = `<strong>${label}:</strong><br>` + value.map(s => `${s.name} (Min: ${s.minimum_proficiency}, Target: ${s.target_proficiency})`).join('<br>');
                        } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                            const subList = Object.entries(value).map(([k, v]) => `<strong>${k.replace(/_/g, ' ')}:</strong> ${v}`).join('<br>');
                            listItem.innerHTML = `<strong>${label}:</strong><br>${subList}`;
                        } else {
                             if (Array.isArray(value)) {
                                value = value.join(', ');
                            }
                            listItem.innerHTML = `<strong>${label}:</strong> ${value || '<em>Not specified</em>'}`;
                        }
                        fieldsList.appendChild(listItem);
                    });
                }
            }

            sectionDiv.appendChild(fieldsList);
            columns[index % 2].appendChild(sectionDiv);
        });

        reviewContent.querySelectorAll('.edit-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToStep(parseInt(e.target.getAttribute('data-step')));
            });
        });
    }

    function updateButtons() {
        if (backBtn) {
            backBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
        }
        if (nextBtn) {
            nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
        }
        if (finishBtn) {
            finishBtn.style.display = currentStep === totalSteps ? 'inline-block' : 'none';
        }
    }

    function goToNextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            navigateToStep(currentStep);
        }
    }

    function goToPrevStep() {
        if (currentStep > 1) {
            currentStep--;
            navigateToStep(currentStep);
        }
    }

    function addCustomField(data = {}) {
        const container = document.getElementById('custom-fields-container');
        const newField = document.createElement('div');
        newField.className = 'custom-field form-grid';
        newField.innerHTML = `
            <div class="form-group">
                <label>Field Name</label>
                <input type="text" name="custom-field-name" class="form-input" placeholder="e.g., Preferred Interview Panel" value="${data.fieldName || ''}">
            </div>
            <div class="form-group">
                <label>Field Type</label>
                <select name="custom-field-type" class="form-input">
                    <option value="Text" ${data.fieldType === 'Text' ? 'selected' : ''}>Text</option>
                    <option value="Number" ${data.fieldType === 'Number' ? 'selected' : ''}>Number</option>
                    <option value="Date" ${data.fieldType === 'Date' ? 'selected' : ''}>Date</option>
                    <option value="Dropdown" ${data.fieldType === 'Dropdown' ? 'selected' : ''}>Dropdown</option>
                    <option value="Checkbox" ${data.fieldType === 'Checkbox' ? 'selected' : ''}>Checkbox</option>
                </select>
            </div>
            <div class="form-group">
                <label>Default Value</label>
                <input type="text" name="custom-field-default-value" class="form-input" placeholder="e.g., 'Yes'" value="${data.defaultValue || ''}">
            </div>
            <div class="form-group">
                <label>Instructions / Tooltip</label>
                <input type="text" name="custom-field-instructions" class="form-input" placeholder="Optional instructions" value="${data.instructions || ''}">
            </div>
            <button type="button" class="btn btn-danger remove-custom-field-btn">Remove</button>
        `;
        container.appendChild(newField);
        newField.querySelector('.remove-custom-field-btn').addEventListener('click', () => {
            newField.remove();
        });
    }

    function populateReview(data) {
        const reviewContent = document.getElementById('review-content');
        if (!reviewContent) return;
        reviewContent.innerHTML = '<div class="review-column"></div><div class="review-column"></div>';
        const columns = reviewContent.querySelectorAll('.review-column');

        const sections = [
            { title: 'Role Overview', step: 1, key: 'step3_role_overview', fields: ['role_title', 'role_summary', 'job_description', 'key_responsibilities', 'decision_scope'] },
            { title: 'Organization & Position Structure', step: 2, key: 'step1_organization_and_position_structure', fields: ['business_unit', 'department', 'job_family', 'role_group', 'role_code', 'created_date', 'team_size', 'reporting_lines', 'matrix_relationships'] },
            { title: 'Classification & Hierarchy', step: 3, key: 'step2_classification_and_hierarchy', fields: ['career_track', 'level', 'grade', 'seniority_label', 'feeder_roles', 'reports_to', 'location', 'location_type', 'employment_type', 'contract_type'] },
            { title: 'Skills, Capabilities & Requirements', step: 4, key: 'step4_skills_capabilities_requirements', fields: ['experience_requirements', 'skills', 'soft_skills', 'tools_technologies', 'certifications', 'learning_resources'] },
            { title: 'Performance, Growth & Mobility', step: 5, key: 'step5_performance_growth_mobility', fields: ['kpis_outcomes', 'performance_review_cycle', 'professional_development_support', 'impact_areas', 'behavioral_competencies', 'career_path_next_roles', 'feeder_roles', 'mobility_options', 'time_allocation', 'succession_plan_ready', 'criticality_to_business', 'backup_resource_assigned'] },
            { title: 'Administrative & Compliance Details', step: 6, key: 'step6_admin_compliance', fields: ['billable', 'access_level', 'expected_onboarding_date', 'status', 'approval_status', 'security_clearance', 'background_check', 'mandatory_compliance_training', 'equipment_provisioning'] },
            { title: 'Custom Fields', step: 7, key: 'step7_custom_fields', fields: ['salary_band', 'remote_work_policy', 'travel_expectations', 'on_call_duties', 'innovation_time'] },
            { title: 'Metadata & Activity Log', step: 8, key: 'step8_metadata_activity_log', fields: ['created_by', 'last_updated', 'activity_log'] }
        ];

        sections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'summary-section';
            sectionDiv.innerHTML = `<h3>${section.title} <a href="#" class="edit-link" data-step="${section.step}">Edit</a></h3>`;
            const fieldsList = document.createElement('ul');
            const sectionData = data[section.key];

            if (sectionData) {
                 if (section.key === 'step7_custom_fields') {
                    if (Object.keys(sectionData).length > 0) {
                        const listItem = document.createElement('li');
                        const customFieldsHtml = Object.entries(sectionData).map(([key, val]) => `<strong>${key.replace(/_/g, ' ')}:</strong> ${val}`).join('<br>');
                        listItem.innerHTML = `${customFieldsHtml}`;
                        fieldsList.appendChild(listItem);
                    } else {
                         const listItem = document.createElement('li');
                         listItem.innerHTML = `<em>Not specified</em>`;
                         fieldsList.appendChild(listItem);
                    }
                } else {
                    section.fields.forEach(fieldKey => {
                        const listItem = document.createElement('li');
                        const label = fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        let value = sectionData[fieldKey];

                        if ((fieldKey === 'skills' || fieldKey === 'soft_skills') && Array.isArray(value)) {
                             listItem.innerHTML = `<strong>${label}:</strong><br>` + value.map(s => `${s.name} (Min: ${s.minimum_proficiency}, Target: ${s.target_proficiency})`).join('<br>');
                        } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                            const subList = Object.entries(value).map(([k, v]) => `<strong>${k.replace(/_/g, ' ')}:</strong> ${v}`).join('<br>');
                            listItem.innerHTML = `<strong>${label}:</strong><br>${subList}`;
                        } else {
                             if (Array.isArray(value)) {
                                value = value.join(', ');
                            }
                            listItem.innerHTML = `<strong>${label}:</strong> ${value || '<em>Not specified</em>'}`;
                        }
                        fieldsList.appendChild(listItem);
                    });
                }
            }

            sectionDiv.appendChild(fieldsList);
            columns[index % 2].appendChild(sectionDiv);
        });

        reviewContent.querySelectorAll('.edit-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToStep(parseInt(e.target.getAttribute('data-step')));
            });
        });
    }

    function initializeEventListeners() {
        const generateJdBtn = document.getElementById('generate-jd-btn');
        if (generateJdBtn) {
            generateJdBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                const roleSummary = document.getElementById('role-summary')?.value;
                const keyResponsibilities = document.getElementById('key-responsibilities')?.value;

                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }

                generateJdBtn.textContent = 'Generating...';
                generateJdBtn.disabled = true;

                try {
                    const response = await fetch('/generate-jd', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            role_title: roleTitle,
                            role_summary: roleSummary,
                            key_responsibilities: keyResponsibilities,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to generate job description.');
                    }

                    const data = await response.json();
                    const jobDescriptionTextarea = document.getElementById('job-description');
                    if (jobDescriptionTextarea) {
                        jobDescriptionTextarea.value = data.job_description;
                    }

                } catch (error) {
                    console.error('Error generating job description:', error);
                    alert('Could not generate job description.');
                } finally {
                    generateJdBtn.textContent = 'Generate with AI';
                    generateJdBtn.disabled = false;
                }
            });
        }

        const generateSkillsBtn = document.getElementById('generate-skills-btn');
        if (generateSkillsBtn) {
            generateSkillsBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                const roleSummary = document.getElementById('role-summary')?.value;
                const keyResponsibilities = document.getElementById('key-responsibilities')?.value;
                const experienceRequirements = document.getElementById('experience-requirements')?.value;

                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }

                generateSkillsBtn.textContent = 'Generating...';
                generateSkillsBtn.disabled = true;

                try {
                    // Placeholder for API call to generate skills
                    // In a real application, this would call a backend API
                    // For now, we'll simulate with dummy data
                    const dummySkillsData = {
                        skills: [
                            { "name": "Problem Solving", "minimum_proficiency": 3, "target_proficiency": 4 },
                            { "name": "Critical Thinking", "minimum_proficiency": 3, "target_proficiency": 4 },
                            { "name": "Adaptability", "minimum_proficiency": 2, "target_proficiency": 3 }
                        ],
                        soft_skills: [
                            { "name": "Communication", "minimum_proficiency": 4, "target_proficiency": 5 },
                            { "name": "Teamwork", "minimum_proficiency": 3, "target_proficiency": 4 }
                        ]
                    };

                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Populate skills and soft skills tables
                    const skillsTableBody = document.querySelector('#skills-table tbody');
                    const softSkillsTableBody = document.querySelector('#soft-skills-table tbody');

                    if (skillsTableBody) {
                        skillsTableBody.innerHTML = ''; // Clear existing rows
                        dummySkillsData.skills.forEach(skill => {
                            const newRow = document.createElement('tr');
                            newRow.innerHTML = `
                                <td><select class="form-input" name="capability"><option value="">Select Capability</option><option value="Technical">Technical</option><option value="Business">Business</option></select></td>
                                <td><select class="form-input" name="competency"><option value="">Select Competency</option><option value="Frontend Development">Frontend Development</option><option value="Backend Development">Backend Development</option></select></td>
                                <td><select class="form-input" name="skill"><option value="">Select Skill</option><option value="${skill.name}">${skill.name}</option></select></td>
                                <td><select class="form-input" name="min-proficiency"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3" ${skill.minimum_proficiency == 3 ? 'selected' : ''}>3</option><option value="4" ${skill.minimum_proficiency == 4 ? 'selected' : ''}>4</option><option value="5">5</option></select></td>
                                <td><select class="form-input" name="target-proficiency"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3" ${skill.target_proficiency == 3 ? 'selected' : ''}>3</option><option value="4" ${skill.target_proficiency == 4 ? 'selected' : ''}>4</option><option value="5">5</option></select></td>
                                <td><button class="btn btn-danger btn-sm remove-skill-btn">Remove</button></td>
                            `;
                            skillsTableBody.appendChild(newRow);
                        });
                        // Re-populate capability/competency/skill dropdowns for newly added rows
                        populateCapabilityDropdown();
                    }

                    if (softSkillsTableBody) {
                        softSkillsTableBody.innerHTML = ''; // Clear existing rows
                        dummySkillsData.soft_skills.forEach(skill => {
                            const newRow = document.createElement('tr');
                            newRow.innerHTML = `
                                <td><input type="text" class="form-input" name="skill" value="${skill.name}"></td>
                                <td><select class="form-input" name="min-proficiency"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3" ${skill.minimum_proficiency == 3 ? 'selected' : ''}>3</option><option value="4" ${skill.minimum_proficiency == 4 ? 'selected' : ''}>4</option><option value="5">5</option></select></td>
                                <td><select class="form-input" name="target-proficiency"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3" ${skill.target_proficiency == 3 ? 'selected' : ''}>3</option><option value="4" ${skill.target_proficiency == 4 ? 'selected' : ''}>4</option><option value="5">5</option></select></td>
                                <td><button class="btn btn-danger btn-sm remove-skill-btn">Remove</button></td>
                            `;
                            softSkillsTableBody.appendChild(newRow);
                        });
                    }

                } catch (error) {
                    console.error('Error generating skills:', error);
                    alert('Could not generate skills.');
                } finally {
                    generateSkillsBtn.textContent = 'Generate with AI';
                    generateSkillsBtn.disabled = false;
                }
            });
        }

        const generateSummaryBtn = document.getElementById('generate-summary-btn');
        if (generateSummaryBtn) {
            generateSummaryBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateSummaryBtn.textContent = 'Generating...';
                generateSummaryBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    document.getElementById('role-summary').value = 'A concise summary generated by AI based on the role title.';
                } catch (error) {
                    console.error('Error generating summary:', error);
                    alert('Could not generate summary.');
                } finally {
                    generateSummaryBtn.textContent = 'Generate with AI';
                    generateSummaryBtn.disabled = false;
                }
            });
        }

        const generateResponsibilitiesBtn = document.getElementById('generate-responsibilities-btn');
        if (generateResponsibilitiesBtn) {
            generateResponsibilitiesBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateResponsibilitiesBtn.textContent = 'Generating...';
                generateResponsibilitiesBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    document.getElementById('key-responsibilities').value = '- AI-generated responsibility 1\n- AI-generated responsibility 2\n- AI-generated responsibility 3';
                } catch (error) {
                    console.error('Error generating responsibilities:', error);
                    alert('Could not generate responsibilities.');
                } finally {
                    generateResponsibilitiesBtn.textContent = 'Generate with AI';
                    generateResponsibilitiesBtn.disabled = false;
                }
            });
        }

        const generateDecisionScopeBtn = document.getElementById('generate-decision-scope-btn');
        if (generateDecisionScopeBtn) {
            generateDecisionScopeBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateDecisionScopeBtn.textContent = 'Generating...';
                generateDecisionScopeBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    document.getElementById('decision-scope').value = 'AI-generated decision scope based on role details.';
                } catch (error) {
                    console.error('Error generating decision scope:', error);
                    alert('Could not generate decision scope.');
                } finally {
                    generateDecisionScopeBtn.textContent = 'Generate with AI';
                    generateDecisionScopeBtn.disabled = false;
                }
            });
        }

        const generateMatrixRelationshipsBtn = document.getElementById('generate-matrix-relationships-btn');
        if (generateMatrixRelationshipsBtn) {
            generateMatrixRelationshipsBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateMatrixRelationshipsBtn.textContent = 'Generating...';
                generateMatrixRelationshipsBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    document.getElementById('matrix-relationships').value = 'AI-generated matrix relationships: Collaborates with cross-functional teams.';
                } catch (error) {
                    console.error('Error generating matrix relationships:', error);
                    alert('Could not generate matrix relationships.');
                } finally {
                    generateMatrixRelationshipsBtn.textContent = 'Generate with AI';
                    generateMatrixRelationshipsBtn.disabled = false;
                }
            });
        }

        const generateKpisBtn = document.getElementById('generate-kpis-btn');
        if (generateKpisBtn) {
            generateKpisBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateKpisBtn.textContent = 'Generating...';
                generateKpisBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    document.getElementById('kpis-outcomes').value = '- AI-generated KPI 1\n- AI-generated KPI 2';
                } catch (error) {
                    console.error('Error generating KPIs:', error);
                    alert('Could not generate KPIs.');
                } finally {
                    generateKpisBtn.textContent = 'Generate with AI';
                    generateKpisBtn.disabled = false;
                }
            });
        }

        const generateImpactAreasBtn = document.getElementById('generate-impact-areas-btn');
        if (generateImpactAreasBtn) {
            generateImpactAreasBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateImpactAreasBtn.textContent = 'Generating...';
                generateImpactAreasBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    document.getElementById('impact-areas').value = 'AI-generated impact areas: Product Innovation, Operational Efficiency.';
                } catch (error) {
                    console.error('Error generating impact areas:', error);
                    alert('Could not generate impact areas.');
                } finally {
                    generateImpactAreasBtn.textContent = 'Generate with AI';
                    generateImpactAreasBtn.disabled = false;
                }
            });
        }

        const generateBehavioralCompetenciesBtn = document.getElementById('generate-behavioral-competencies-btn');
        if (generateBehavioralCompetenciesBtn) {
            generateBehavioralCompetenciesBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateBehavioralCompetenciesBtn.textContent = 'Generating...';
                generateBehavioralCompetenciesBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    document.getElementById('behavioral-competencies').value = 'AI-generated behavioral competencies: Leadership, Adaptability, Communication.';
                } catch (error) {
                    console.error('Error generating behavioral competencies:', error);
                    alert('Could not generate behavioral competencies.');
                } finally {
                    generateBehavioralCompetenciesBtn.textContent = 'Generate with AI';
                    generateBehavioralCompetenciesBtn.disabled = false;
                }
            });
        }

        const generateCertificationsBtn = document.getElementById('generate-certifications-btn');
        if (generateCertificationsBtn) {
            generateCertificationsBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateCertificationsBtn.textContent = 'Generating...';
                generateCertificationsBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    document.getElementById('certifications').value = 'AI-generated certifications: Certified Frontend Developer, Web Security Specialist.';
                } catch (error) {
                    console.error('Error generating certifications:', error);
                    alert('Could not generate certifications.');
                } finally {
                    generateCertificationsBtn.textContent = 'Generate with AI';
                    generateCertificationsBtn.disabled = false;
                }
            });
        }

        const generateLearningResourcesBtn = document.getElementById('generate-learning-resources-btn');
        if (generateLearningResourcesBtn) {
            generateLearningResourcesBtn.addEventListener('click', async () => {
                const roleTitle = document.getElementById('role-title')?.value;
                if (!roleTitle) {
                    alert('Please enter a role title first.');
                    return;
                }
                generateLearningResourcesBtn.textContent = 'Generating...';
                generateLearningResourcesBtn.disabled = true;
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // For learning resources, we need to clear existing and add new ones
                    const learningResourcesList = document.getElementById('learning-resources-list');
                    if (learningResourcesList) {
                        learningResourcesList.innerHTML = ''; // Clear existing
                        const dummyResources = [
                            'https://www.skillsoft.com/course/advanced-react-patterns',
                            'https://www.skillsoft.com/channel/modern-javascript-development'
                        ];
                        dummyResources.forEach((url, index) => {
                            const linkContainer = document.createElement('div');
                            linkContainer.className = 'learning-resource-item';
                            const numberSpan = document.createElement('span');
                            numberSpan.className = 'learning-resource-number';
                            numberSpan.textContent = `${index + 1}.`;
                            const link = document.createElement('a');
                            link.href = url;
                            link.textContent = url;
                            link.target = '_blank';
                            linkContainer.appendChild(numberSpan);
                            linkContainer.appendChild(link);
                            learningResourcesList.appendChild(linkContainer);
                        });
                    }
                } catch (error) {
                    console.error('Error generating learning resources:', error);
                    alert('Could not generate learning resources.');
                } finally {
                    generateLearningResourcesBtn.textContent = 'Generate with AI';
                    generateLearningResourcesBtn.disabled = false;
                }
            });
        }

        const addSkillBtn = document.getElementById('add-skill-btn');
        const addSoftSkillBtn = document.getElementById('add-soft-skill-btn');
        const skillsTableBody = document.querySelector('#skills-table tbody');
        const softSkillsTableBody = document.querySelector('#soft-skills-table tbody');
        let skillsData = [];
        let competenciesData = [];

        async function fetchData() {
            try {
                const response = await fetch('/RoleDictionary/skills-ontology-data.json');
                const data = await response.json();
                skillsData = data.skills;
                competenciesData = data.competencies;
                populateCapabilityDropdown();
            } catch (error) {
                console.error('Error fetching skills data:', error);
            }
        }

        function populateCapabilityDropdown() {
            const capabilitySelects = document.querySelectorAll('select[name="capability"]');
            const capabilities = [...new Set(competenciesData.map(c => c.capability))];
            capabilitySelects.forEach(select => {
                select.innerHTML = '<option value="">Select Capability</option>';
                capabilities.forEach(capability => {
                    const option = document.createElement('option');
                    option.value = capability;
                    option.textContent = capability;
                    select.appendChild(option);
                });
            });
        }

        function populateCompetencyDropdown(capability, competencySelect) {
            const competencies = competenciesData.filter(c => c.capability === capability);
            competencySelect.innerHTML = '<option value="">Select Competency</option>';
            competencies.forEach(competency => {
                const option = document.createElement('option');
                option.value = competency.competencyId;
                option.textContent = competency.name;
                competencySelect.appendChild(option);
            });
        }

        function populateSkillDropdown(competencyId, skillSelect) {
            const skills = skillsData.filter(skill => skill.competencyId === competencyId);
            skillSelect.innerHTML = '<option value="">Select Skill</option>';
            skills.forEach(skill => {
                const option = document.createElement('option');
                option.value = skill.name;
                option.textContent = skill.name;
                skillSelect.appendChild(option);
            });
        }

        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', function() {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td><select class="form-input" name="capability"><option value="">Select Capability</option></select></td>
                    <td><select class="form-input" name="competency"><option value="">Select Competency</option></select></td>
                    <td><select class="form-input" name="skill"><option value="">Select Skill</option></select></td>
                    <td><select class="form-input" name="min-proficiency"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></td>
                    <td><select class="form-input" name="target-proficiency"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></td>
                    <td><button class="btn btn-danger btn-sm remove-skill-btn">Remove</button></td>
                `;
                skillsTableBody.appendChild(newRow);
                populateCapabilityDropdown();
            });
        }

        if (addSoftSkillBtn) {
            addSoftSkillBtn.addEventListener('click', function() {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td><input type="text" class="form-input" name="skill" placeholder="Enter soft skill"></td>
                    <td><select class="form-input" name="min-proficiency"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></td>
                    <td><select class="form-input" name="target-proficiency"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></td>
                    <td><button class="btn btn-danger btn-sm remove-skill-btn">Remove</button></td>
                `;
                softSkillsTableBody.appendChild(newRow);
            });
        }

        if (skillsTableBody) {
            skillsTableBody.addEventListener('change', function(e) {
                if (e.target.name === 'capability') {
                    const competencySelect = e.target.closest('tr').querySelector('select[name="competency"]');
                    populateCompetencyDropdown(e.target.value, competencySelect);
                }
                if (e.target.name === 'competency') {
                    const skillSelect = e.target.closest('tr').querySelector('select[name="skill"]');
                    populateSkillDropdown(e.target.value, skillSelect);
                }
            });
        }

        fetchData();

        if (skillsTableBody) {
            skillsTableBody.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-skill-btn')) {
                    e.target.closest('tr').remove();
                }
            });
        }

        if (softSkillsTableBody) {
            softSkillsTableBody.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-skill-btn')) {
                    e.target.closest('tr').remove();
                }
            });
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                alert('Form submitted successfully!');
                window.location.href = '../../../index.html';
            });
        }
        if (addCustomFieldBtn) {
            addCustomFieldBtn.addEventListener('click', () => addCustomField());
        }

        if (printPreviewBtn) {
            printPreviewBtn.addEventListener('click', async () => {
                printPreviewBtn.textContent = 'Generating...';
                printPreviewBtn.disabled = true;

                try {
                    const response = await fetch('/RoleDictionary/mock-data.json');
                    const data = await response.json();
                    const roleData = data.role;

                    let printContainer = document.getElementById('print-content');
                    if (printContainer) {
                        printContainer.remove();
                    }
                    printContainer = document.createElement('div');
                    printContainer.id = 'print-content';
                    printContainer.style.display = 'none';
                    document.body.appendChild(printContainer);

                    const sections = [
                        { title: 'Organization & Position Structure', key: 'step1_organization_and_position_structure' },
                        { title: 'Classification & Hierarchy', key: 'step2_classification_and_hierarchy' },
                        { title: 'Role Overview', key: 'step3_role_overview' },
                        { title: 'Skills, Capabilities & Requirements', key: 'step4_skills_capabilities_requirements' },
                        { title: 'Performance, Growth & Mobility', key: 'step5_performance_growth_mobility' },
                        { title: 'Administrative & Compliance Details', key: 'step6_admin_compliance' },
                        { title: 'Custom Fields', key: 'step7_custom_fields' },
                        { title: 'Metadata & Activity Log', key: 'step8_metadata_activity_log' }
                    ];

                    sections.forEach(section => {
                        const sectionData = roleData[section.key];
                        if (sectionData) {
                            const sectionDiv = document.createElement('div');
                            sectionDiv.className = 'print-section';
                            sectionDiv.innerHTML = `<h2>${section.title}</h2>`;
                            const fieldsList = document.createElement('ul');

                            Object.entries(sectionData).forEach(([key, value]) => {
                                const listItem = document.createElement('li');
                                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                
                                if (Array.isArray(value)) {
                                    if (key === 'skills') {
                                        listItem.innerHTML = `<strong>${label}:</strong><br>` + value.map(s => `${s.name} (Min: ${s.minimum_proficiency}, Target: ${s.target_proficiency})`).join('<br>');
                                    } else {
                                        listItem.innerHTML = `<strong>${label}:</strong> ${value.join(', ')}`;
                                    }
                                } else if (typeof value === 'object' && value !== null) {
                                    const subList = Object.entries(value).map(([k, v]) => `<strong>${k.replace(/_/g, ' ')}:</strong> ${v}`).join('<br>');
                                    listItem.innerHTML = `<strong>${label}:</strong><br>${subList}`;
                                } else {
                                    listItem.innerHTML = `<strong>${label}:</strong> ${value || '<em>Not specified</em>'}`;
                                }
                                fieldsList.appendChild(listItem);
                            });
                            sectionDiv.appendChild(fieldsList);
                            printContainer.appendChild(sectionDiv);
                        }
                    });

                    window.print();

                } catch (error) {
                    console.error('Error generating print preview:', error);
                    alert('Could not generate print preview.');
                } finally {
                    printPreviewBtn.textContent = 'Print Preview';
                    printPreviewBtn.disabled = false;
                    const printContainer = document.getElementById('print-content');
                    if (printContainer) {
                        printContainer.remove();
                    }
                }
            });
        }

        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', async () => {
                exportExcelBtn.textContent = 'Generating...';
                exportExcelBtn.disabled = true;

                try {
                    const response = await fetch('/RoleDictionary/mock-data.json');
                    const data = await response.json();
                    const roleData = data.role;

                    const wb = XLSX.utils.book_new();
                    const ws_name = "Role Summary";
                    
                    const excelData = [];
                    const sections = [
                        { title: 'Organization & Position Structure', key: 'step1_organization_and_position_structure' },
                        { title: 'Classification & Hierarchy', key: 'step2_classification_and_hierarchy' },
                        { title: 'Role Overview', key: 'step3_role_overview' },
                        { title: 'Skills, Capabilities & Requirements', key: 'step4_skills_capabilities_requirements' },
                        { title: 'Performance, Growth & Mobility', key: 'step5_performance_growth_mobility' },
                        { title: 'Administrative & Compliance Details', key: 'step6_admin_compliance' },
                        { title: 'Custom Fields', key: 'step7_custom_fields' },
                        { title: 'Metadata & Activity Log', key: 'step8_metadata_activity_log' }
                    ];

                    sections.forEach(section => {
                        excelData.push([section.title]);
                        const sectionData = roleData[section.key];
                        if (sectionData) {
                            Object.entries(sectionData).forEach(([key, value]) => {
                                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                
                                if (Array.isArray(value)) {
                                    if (key === 'skills') {
                                        excelData.push([label, value.map(s => `${s.name} (Min: ${s.minimum_proficiency}, Target: ${s.target_proficiency})`).join('\n')]);
                                    } else {
                                        excelData.push([label, value.join(', ')]);
                                    }
                                } else if (typeof value === 'object' && value !== null) {
                                     Object.entries(value).forEach(([k, v]) => {
                                        const subLabel = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                        excelData.push([`${label} - ${subLabel}`, v]);
                                     });
                                } else {
                                    excelData.push([label, value || '']);
                                }
                            });
                        }
                        excelData.push([]); // Add a blank row between sections
                    });

                    const ws = XLSX.utils.aoa_to_sheet(excelData);
                    XLSX.utils.book_append_sheet(wb, ws, ws_name);
                    XLSX.writeFile(wb, 'role-summary.xlsx');

                } catch (error) {
                    console.error('Error generating excel file:', error);
                    alert('Could not generate excel file.');
                } finally {
                    exportExcelBtn.textContent = 'Export to Excel';
                    exportExcelBtn.disabled = false;
                }
            });
        }

        const steps = document.querySelectorAll('.step');
        if (steps) {
            steps.forEach(step => {
                step.addEventListener('click', () => {
                    const stepNumber = parseInt(step.getAttribute('data-step'));
                    navigateToStep(stepNumber);
                });
            });
        }
    }

    // Initial load
    loadAllSteps().then(() => {
        initializeEventListeners();
        if (nextBtn) nextBtn.addEventListener('click', goToNextStep);
        if (backBtn) backBtn.addEventListener('click', goToPrevStep);
    });

}
);
