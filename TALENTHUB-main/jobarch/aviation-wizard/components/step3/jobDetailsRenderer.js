// aviation-wizard/components/step3/jobDetailsRenderer.js
import { getIcon, state as globalState } from '../../state.js';
import { localState } from './state.js';
import { SkillPill } from './uiHelpers.js';

// Render skills and details for the selected job
export const renderSelectedJobSkills = (selectedJob) => {
    if (!selectedJob) {
        return `
            <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                <p class="text-center text-gray-500 py-10">Select a job to view and map skills.</p>
            </div>
        `;
    }

    const skillMap = new Map();
    globalState.ontologySkills.forEach(skill => {
        const competency = globalState.competencies.find(c => c.id === skill.competencyId);
        const capability = globalState.capabilities.find(c => c.id === competency?.capabilityId);
        skillMap.set(skill.id, { ...skill, competency, capability });
    });
    
    console.log('[jobDetailsRenderer] selectedJob.skills (input to processing):', JSON.parse(JSON.stringify(selectedJob.skills || [])));
    console.log('[jobDetailsRenderer] skillMap size:', skillMap.size);

    // Step 1: Map selectedJob.skills to include full details from skillMap
    const detailedJobSkills = (selectedJob.skills || []).map(jobSkill => {
        console.log('[jobDetailsRenderer] Processing jobSkill.skillId:', jobSkill.skillId);
        const skillDetails = skillMap.get(jobSkill.skillId);
        if (!skillDetails) {
            console.warn('[jobDetailsRenderer] Skill ID from job (' + jobSkill.skillId + ') not found in skillMap.');
        } else {
            // console.log('[jobDetailsRenderer] Found skillDetails in skillMap for ID', jobSkill.skillId, skillDetails);
        }
        // Combine details from ontology with the job-specific proficiency
        return skillDetails ? { ...skillDetails, proficiency: jobSkill.proficiency } : null;
    });
    console.log('[jobDetailsRenderer] detailedJobSkills (after mapping, before filter):', JSON.parse(JSON.stringify(detailedJobSkills)));

    // Step 2: Filter out any nulls (skills not found in skillMap)
    const mappedSkills = detailedJobSkills.filter(Boolean); 
    console.log('[jobDetailsRenderer] mappedSkills (final, after filter):', JSON.parse(JSON.stringify(mappedSkills)));

    const { activeJobDetailTab } = localState;

    let html = `
        <div class="lg:col-span-2">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold text-gray-800 mb-1">Job Details for: <span class="text-blue-600">${selectedJob.title}</span></h2>
                <p class="text-sm text-gray-500 mb-6">(Level: ${selectedJob.level})</p>

                <!-- Tab Navigation -->
                <div class="mb-6 border-b border-gray-200">
                    <nav class="-mb-px flex space-x-6" aria-label="Tabs">
                        <button data-tab-id="basicInfo" class="job-detail-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm 
                            ${activeJobDetailTab === 'basicInfo' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                            Basic Information
                        </button>
                        <button data-tab-id="roleGroupLevel" class="job-detail-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
                            ${activeJobDetailTab === 'roleGroupLevel' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                            Role Group & Level
                        </button>
                        <button data-tab-id="description" class="job-detail-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
                            ${activeJobDetailTab === 'description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                            Job Description
                        </button>
                        <button data-tab-id="skills" class="job-detail-tab whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
                            ${activeJobDetailTab === 'skills' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}">
                            Skills Mapping
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div>
                    <!-- 1. Basic Information Tab -->
                    <div id="tab-basicInfo" class="job-detail-tab-content ${activeJobDetailTab === 'basicInfo' ? '' : 'hidden'}">
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Basic Information</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="jobTitle" class="block text-sm font-medium text-gray-700">Job Title <span class="text-red-500">*</span></label>
                                <input type="text" id="jobTitle" name="jobTitle" value="${selectedJob.title || ''}" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" readonly>
                            </div>
                            <div>
                                <label for="jobFamily" class="block text-sm font-medium text-gray-700">Job Family <span class="text-red-500">*</span></label>
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <input type="text" id="jobFamily" name="jobFamily" value="${selectedJob.jobFamily || ''}" class="flex-1 block w-full min-w-0 rounded-none rounded-l-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Engineering, Marketing">
                                    <button type="button" data-field-name="jobFamily" class="populate-with-ai-btn inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        ${getIcon('Edit')} <span class="ml-1.5">AI Assist</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label for="suggestedJobLevel" class="block text-sm font-medium text-gray-700">Suggested Job Level <span class="text-red-500">*</span></label>
                                <input type="text" id="suggestedJobLevel" name="suggestedJobLevel" value="${selectedJob.level || ''}" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" readonly>
                            </div>
                            <div>
                                <label for="department" class="block text-sm font-medium text-gray-700">Department <span class="text-red-500">*</span></label>
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <input type="text" id="department" name="department" value="${selectedJob.department || ''}" class="flex-1 block w-full min-w-0 rounded-none rounded-l-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Product Development">
                                    <button type="button" data-field-name="department" class="populate-with-ai-btn inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        ${getIcon('Edit')} <span class="ml-1.5">AI Assist</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label for="workLocation" class="block text-sm font-medium text-gray-700">Work Location <span class="text-gray-500">(optional)</span></label>
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <input type="text" id="workLocation" name="workLocation" value="${selectedJob.workLocation || ''}" class="flex-1 block w-full min-w-0 rounded-none rounded-l-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Remote, New York Office">
                                    <button type="button" data-field-name="workLocation" class="populate-with-ai-btn inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        ${getIcon('Edit')} <span class="ml-1.5">AI Assist</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label for="requisitionId" class="block text-sm font-medium text-gray-700">Requisition ID</label>
                                <input type="text" id="requisitionId" name="requisitionId" value="${selectedJob.requisitionId || ''}" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" readonly>
                            </div>
                             <div>
                                <label for="employmentType" class="block text-sm font-medium text-gray-700">Employment Type</label>
                                <input type="text" id="employmentType" name="employmentType" value="${selectedJob.employmentType || ''}" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" readonly>
                            </div>
                            <div>
                                <label for="businessUnit" class="block text-sm font-medium text-gray-700">Business Unit</label>
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <input type="text" id="businessUnit" name="businessUnit" value="${selectedJob.businessUnit || ''}" class="flex-1 block w-full min-w-0 rounded-none rounded-l-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Consumer Products">
                                     <button type="button" data-field-name="businessUnit" class="populate-with-ai-btn inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        ${getIcon('Edit')} <span class="ml-1.5">AI Assist</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Role Group & Level Name Tab -->
                    <div id="tab-roleGroupLevel" class="job-detail-tab-content ${activeJobDetailTab === 'roleGroupLevel' ? '' : 'hidden'}">
                        <h3 class="text-lg font-semibold text-gray-700 mb-3">Role Group & Level Name</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="roleGroup" class="block text-sm font-medium text-gray-700">Role Group <span class="text-gray-500">(optional)</span></label>
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <input type="text" id="roleGroup" name="roleGroup" value="${selectedJob.roleGroup || ''}" class="flex-1 block w-full min-w-0 rounded-none rounded-l-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Software Engineering, Product Management">
                                    <button type="button" data-field-name="roleGroup" class="populate-with-ai-btn inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        ${getIcon('Edit')} <span class="ml-1.5">AI Assist</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label for="roleLevelName" class="block text-sm font-medium text-gray-700">Role Level Name <span class="text-gray-500">(optional)</span></label>
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <input type="text" id="roleLevelName" name="roleLevelName" value="${selectedJob.roleLevelName || ''}" class="flex-1 block w-full min-w-0 rounded-none rounded-l-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Sr. Frontend Developer – IC3">
                                    <button type="button" data-field-name="roleLevelName" class="populate-with-ai-btn inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        ${getIcon('Edit')} <span class="ml-1.5">AI Assist</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Job Description Content Tab -->
                    <div id="tab-description" class="job-detail-tab-content ${activeJobDetailTab === 'description' ? '' : 'hidden'}">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-700">Job Description Content</h3>
                            <button id="generate-with-ai-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center space-x-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 13.5h.75a.75.75 0 000-1.5h-.75a.75.75 0 000 1.5z" />
                                </svg>
                                <span>Generate/Update with AI</span>
                            </button>
                        </div>
                        <div>
                            <label for="roleSummary" class="block text-sm font-medium text-gray-700">Role Summary <span class="text-red-500">*</span></label>
                            <textarea id="roleSummary" name="roleSummary" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Brief overview of the role's purpose and contribution.">${selectedJob.roleSummary || ''}</textarea>
                        </div>
                        <div class="mt-4">
                            <label for="responsibilities" class="block text-sm font-medium text-gray-700">Responsibilities <span class="text-red-500">*</span></label>
                            <textarea id="responsibilities" name="responsibilities" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Key duties and tasks associated with the role.">${selectedJob.responsibilities || ''}</textarea>
                        </div>
                        <div class="mt-4">
                            <label for="yearsOfExperience" class="block text-sm font-medium text-gray-700">Years of Experience <span class="text-gray-500">(optional but helpful)</span></label>
                            <input type="text" id="yearsOfExperience" name="yearsOfExperience" value="${selectedJob.yearsOfExperience || ''}" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 5-7 years">
                        </div>
                        <div class="mt-4">
                            <label for="additionalQualifications" class="block text-sm font-medium text-gray-700">Additional Qualifications / Experience</label>
                            <textarea id="additionalQualifications" name="additionalQualifications" rows="3" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" readonly>${selectedJob.additionalQualifications || ''}</textarea>
                        </div>
                        <div class="mt-4">
                            <label for="benefits" class="block text-sm font-medium text-gray-700">Benefits & Perks</label>
                            <textarea id="benefits" name="benefits" rows="3" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" readonly>${selectedJob.benefits || ''}</textarea>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label for="salaryMin" class="block text-sm font-medium text-gray-700">Salary Range Min ($)</label>
                                <input type="number" id="salaryMin" name="salaryMin" value="${selectedJob.salaryMin || ''}" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 70000" readonly>
                            </div>
                            <div>
                                <label for="salaryMax" class="block text-sm font-medium text-gray-700">Salary Range Max ($)</label>
                                <input type="number" id="salaryMax" name="salaryMax" value="${selectedJob.salaryMax || ''}" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., 90000" readonly>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label for="hiringManager" class="block text-sm font-medium text-gray-700">Hiring Manager</label>
                                <input type="text" id="hiringManager" name="hiringManager" value="${selectedJob.hiringManager || ''}" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Name or Title" readonly>
                            </div>
                            <div>
                                <label for="recruiter" class="block text-sm font-medium text-gray-700">Assigned Recruiter</label>
                                <input type="text" id="recruiter" name="recruiter" value="${selectedJob.recruiter || ''}" class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Name or Team" readonly>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 4. Skills Mapping Tab -->
                    <div id="tab-skills" class="job-detail-tab-content ${activeJobDetailTab === 'skills' ? '' : 'hidden'}">
                         <div class="bg-white border-l-4 border-blue-500 p-4 rounded-md shadow-sm my-4">
                            <h3 class="text-md font-semibold text-gray-700">Dynamic Skill Ontology</h3>
                            <p class="mt-1 text-sm text-gray-600">Tap into a comprehensive framework of skills, developed by AI and refined by I/O Psychology experts. Our ontology provides rich, behavior-anchored proficiency levels.</p>
                        </div>
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-700">Skills Mapping</h3>
                                <p class="text-sm text-gray-500 mt-1">Total skills mapped: ${mappedSkills.length}</p>
                            </div>
                            <div class="flex space-x-3">
                                <button id="open-skill-modal-btn" class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow">
                                    <span class="mr-2">${getIcon('Plus')}</span> Add Skill
                                </button>
                            </div>
                        </div>
                        <div class="space-y-4">
    `;

    // Skills mapping content (moved inside the 'skills' tab)
    if (activeJobDetailTab === 'skills') {
        if (mappedSkills.length > 0) {
            mappedSkills.forEach(skill => {
                // Ensure skill.proficiencyLevels exists and is an array before calling find
                const selectedProficiencyDetails = Array.isArray(skill.proficiencyLevels) ? skill.proficiencyLevels.find(p => p.level === skill.proficiency) : null;
                html += `
                    <div class="bg-gray-50 p-4 rounded-lg border">
                        <div class="flex justify-between items-start">
                            <div class="flex-grow">
                                <div class="mb-1">
                                    <span class="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full mr-2 align-middle">Capability</span>
                                    <span class="text-sm text-gray-700 align-middle">${skill.capability?.name || 'N/A'}</span>
                                </div>
                                <div class="mb-2">
                                    <span class="text-xs bg-teal-100 text-teal-700 font-semibold px-2 py-0.5 rounded-full mr-2 align-middle">Competency</span>
                                    <span class="text-sm text-gray-700 align-middle">${skill.competency?.name || 'N/A'}</span>
                                </div>
                                ${selectedJob?.selectedBehaviours && selectedJob.selectedBehaviours.filter(b => b.competencyId === skill.competencyId).length > 0 ? `
                                <div class="mb-2 pl-4">
                                    <p class="text-xs font-semibold text-gray-600 mb-1">Selected Behaviours:</p>
                                    <ul class="list-none space-y-1">
                                        ${selectedJob.selectedBehaviours.filter(b => b.competencyId === skill.competencyId).map(bObj => `
                                            <li class="text-xs text-gray-600 flex items-start">
                                                <span class="w-3 h-3 mr-1.5 mt-0.5 text-gray-400">${getIcon('ChevronRight')}</span> 
                                                <span>${bObj.behaviour}</span>
                                            </li>`).join('')}
                                    </ul>
                                </div>
                                ` : ''}
                                <h4 class="font-bold text-xl text-gray-900 mt-1 flex items-center">
                                    <span class="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full mr-2">Skill</span>
                                    <span class="mr-2 w-5 h-5 text-blue-500">${getIcon('Target')}</span>
                                    ${skill.name}
                                </h4>
                                <p class="text-gray-600 text-sm mt-1">${skill.definition}</p>
                            </div>
                            <button data-skill-id-to-remove="${skill.id}" class="remove-skill-btn p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 ml-4 flex-shrink-0">
                                ${getIcon('X')}
                            </button>
                        </div>
                        <div class="mt-3 pt-3 border-t">
                            <div class="flex items-center justify-between mb-2">
                                <h5 class="text-sm font-bold text-gray-700">Required Proficiency</h5>
                                ${SkillPill(skill.type)}
                            </div>
                            <div class="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                                ${ Array.isArray(skill.proficiencyLevels) ? skill.proficiencyLevels.map(p => `
                                    <button data-skill-id-for-proficiency="${skill.id}" data-proficiency-level="${p.level}" 
                                            class="update-proficiency-btn w-full text-center px-3 py-1 text-sm rounded-md transition-colors 
                                            ${skill.proficiency === p.level ? 'bg-white text-blue-600 font-bold shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300 border border-gray-300'}"
                                            title="${p.name}: ${p.descriptor}">
                                        ${p.name}
                                    </button>
                                `).join('') : '<p class="text-xs text-gray-500">Proficiency levels not defined.</p>'}
                            </div>
                            ${selectedProficiencyDetails ? `<p class="text-sm text-gray-600 mt-2 p-2 bg-white rounded">${selectedProficiencyDetails.descriptor}</p>` : ''}
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="text-center py-10 border-2 border-dashed rounded-lg">
                    <p class="text-gray-500">No skills mapped to this job yet.</p>
                    <button id="open-skill-modal-btn-empty" class="mt-4 text-blue-600 font-semibold hover:underline">Start by adding a skill.</button>
                </div>
            `;
        }

        // Display Raw AI Skills if they exist, styled like mapped skills
        if (selectedJob.rawAiSkills && selectedJob.rawAiSkills.length > 0) {
            if (mappedSkills.length > 0) { // Add a separator if there were mapped skills
                html += `<div class="my-6 border-t border-dashed border-gray-300"></div>`;
            }
            html += `<h3 class="text-lg font-semibold text-gray-700 mb-3 ${mappedSkills.length > 0 ? 'mt-6' : ''}">AI Generated Skills (from AI Writer)</h3>`;
            
            const proficiencyMap = {
                'expert': { level: 3, name: 'Advanced' },
                'advanced': { level: 3, name: 'Advanced' },
                'intermediate': { level: 2, name: 'Intermediate' },
                'foundational': { level: 1, name: 'Foundational' }, // Assuming 'foundational' might exist
                'basic': { level: 1, name: 'Foundational' } // Assuming 'basic' might exist
            };

            selectedJob.rawAiSkills.forEach((aiSkill, index) => {
                const skillName = aiSkill.name;
                const proficiencyNameFromAI = aiSkill.proficiencyName || 'intermediate'; // Default to intermediate
                
                const wizardProficiency = proficiencyMap[proficiencyNameFromAI] || proficiencyMap['intermediate'];
                const currentProficiencyLevel = wizardProficiency.level;

                const displayProficiencyLevels = [
                    { level: 1, name: 'Foundational', descriptor: 'Basic understanding and application.' },
                    { level: 2, name: 'Intermediate', descriptor: 'Works independently, can troubleshoot.' },
                    { level: 3, name: 'Advanced', descriptor: 'Can lead, innovate, and teach others.' }
                ];
                const selectedProficiencyDetails = displayProficiencyLevels.find(p => p.level === currentProficiencyLevel);

                html += `
                    <div class="bg-gray-50 p-4 rounded-lg border mb-4">
                        <div class="flex justify-between items-start">
                            <div class="flex-grow">
                                <div class="mb-2">
                                    <span class="text-sm font-semibold text-purple-600">AI SUGGESTED SKILL</span> 
                                    <span class="text-xs text-gray-500">(Not yet mapped to ontology)</span>
                                </div>
                                <h4 class="font-bold text-xl text-gray-900 mt-1 flex items-center">
                                    <span class="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full mr-2">Skill</span>
                                    <span class="mr-2 w-5 h-5 text-purple-500">${getIcon('Zap')}</span>
                                    ${skillName}
                                </h4>
                                <p class="text-gray-600 text-sm mt-1">Skill identified by the AI Job Description Writer. Not yet formally mapped to the ontology.</p>
                            </div>
                            <button 
                                class="map-ai-skill-btn ml-4 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md shadow-sm flex items-center flex-shrink-0"
                                data-raw-skill-name="${encodeURIComponent(skillName)}"
                                data-raw-skill-proficiency="${encodeURIComponent(proficiencyNameFromAI)}"
                                title="Map this AI-suggested skill to the official skill ontology">
                                ${getIcon('GitBranch')} <span class="ml-1.5">Map to Ontology</span>
                            </button>
                        </div>
                        <div class="mt-3 pt-3 border-t">
                            <div class="flex items-center justify-between mb-2">
                                <h5 class="text-sm font-bold text-gray-700">Required Proficiency</h5>
                                ${SkillPill('AI Suggested')}
                            </div>
                            <div class="flex space-x-1 bg-gray-200 p-1 rounded-lg">
                                ${displayProficiencyLevels.map(p => `
                                    <button data-ai-skill-name="${skillName}" data-proficiency-level="${p.level}" 
                                            class="ai-skill-proficiency-btn w-full text-center px-3 py-1 text-sm rounded-md transition-colors 
                                            ${currentProficiencyLevel === p.level ? 'bg-white text-purple-600 font-bold shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-300 border border-gray-300 cursor-not-allowed'}"
                                            title="${p.name}: ${p.descriptor}"
                                            disabled>
                                        ${p.name}
                                    </button>
                                `).join('')}
                            </div>
                            ${selectedProficiencyDetails ? `<p class="text-sm text-gray-600 mt-2 p-2 bg-white rounded">${selectedProficiencyDetails.descriptor}</p>` : ''}
                        </div>
                    </div>
                `;
            });
        }

        html += `</div>`; // Closes the inner space-y-4 for skills
    }
    html += `
                    </div> <!-- Closes the skills tab content -->
                </div> <!-- Closes Tab Content div -->
            </div> <!-- Closes bg-white p-6 rounded-lg shadow-md (main container for tabs) -->
        </div> <!-- Closes lg:col-span-2 -->
    `;

    // Add event listener for the new "Generate with AI" button after HTML is constructed
    // We need to defer this until the element is in the DOM, so this is more of a conceptual placement.
    // The actual event listener attachment should happen in eventListeners.js or after DOM insertion.
    // For now, this illustrates where the logic would conceptually connect.
    // This will be handled by addStep3EventListeners in practice.

    return html;
};
