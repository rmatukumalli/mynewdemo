const jobProfilesModule = (function() {
    console.log("Job Profiles module initialized");

    // --- APPLICATION STATE ---
    const appState = {
        skills: [],
        currentSkillToMap: null,
        currentTab: 'details',
        ontology: {
            capabilities: [],
            competencies: [],
            skills: [],
            behaviors: []
        }
    };

    // --- DOM ELEMENTS ---
    let tabDetails, tabSkills, contentDetails, contentSkills, loadMockBtn, generateBtn,
        jobTitleInput, jobSummaryInput, summaryCharCount, responsibilitiesInput,
        qualificationsInput, skillsListContainer, mappingModal, closeModalBtn,
        cancelMappingBtn, saveMappingBtn, modalSkillName, capabilitySelect,
        competencySelect, skillSelect, behaviorSelect, newCapabilityInput,
        newCompetencyInput, newSkillInput, newBehaviorInput, proficiencySelect, nextStepBtn,
        backBtn, validationModal, goBackBtn, proceedAnywayBtn, modalStepper,
        extractedSkillsSection, existingSkillsPills, newSkillsPills,
        coreBehavioralAnchorInput, exceptionOverrideInput;

    let callAPI, navigation; // These will be passed in during init

    // --- FUNCTIONS ---

    async function fetchOntologyData() {
        try {
            const [capabilities, competencies, skills, behaviors] = await Promise.all([
                callAPI('/api/v1/ontology/capabilities', 'GET'),
                callAPI('/api/v1/ontology/competencies', 'GET'),
                callAPI('/api/v1/ontology/skills', 'GET'),
                callAPI('/api/v1/ontology/behaviors', 'GET')
            ]);
            appState.ontology.capabilities = capabilities;
            appState.ontology.competencies = competencies;
            appState.ontology.skills = skills;
            appState.ontology.behaviors = behaviors;
            console.log("Ontology data fetched:", appState.ontology);
        } catch (error) {
            console.error("Failed to fetch ontology data:", error);
            alert("Failed to load ontology data. Please try again later.");
        }
    }

    // Mock data for AI generation (can be replaced with actual AI API calls)
    // This mock data is now specific to the "Cadet Pilot" example for AI generation demo
    const mockUserInput = {
        title: "Cadet Pilot",
        summary: "Seeking motivated individuals to join our airline as Cadet Pilots. This program provides a structured path to becoming a First Officer on our modern fleet. No prior flying experience is required, but a strong passion for aviation is a must."
    };
    const mockEnhancements = {
        summary: "As a Cadet Pilot, you will undergo a comprehensive training program covering ground school, simulator training, and flight training. You will work with experienced instructors to develop the skills and knowledge required to operate a commercial aircraft safely and efficiently.",
        responsibilities: [
            "Complete all required ground school modules and examinations.",
            "Successfully pass all simulator and flight training sessions.",
            "Adhere to all company and regulatory procedures.",
            "Maintain a high standard of professionalism and discipline.",
            "Work effectively in a multi-crew environment."
        ],
        qualifications: [
            "Minimum 18 years of age.",
            "High school diploma or equivalent.",
            "Ability to pass a Class 1 Medical Examination.",
            "Excellent communication and teamwork skills.",
            "Strong problem-solving abilities and the capacity to remain calm under pressure."
        ],
        core_behavioral_anchor: "Demonstrates unwavering commitment to safety and operational excellence.",
        exception_override: "Must complete 1500 flight hours within 2 years."
    };
    const mockExtractedSkills = [
        { name: "Aerodynamics", proficiency: "Beginner" },
        { name: "Flight Theory", proficiency: "Beginner" },
        { name: "Aviation Regulations", proficiency: "Beginner" },
        { name: "Teamwork", "proficiency_level": "Intermediate" },
        { name: "Problem Solving", "proficiency_level": "Intermediate" }
    ];

    function isMobileView() {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        console.log('isMobileView:', isMobile, 'window.innerWidth:', window.innerWidth);
        return isMobile;
    }
    
    function handleLoadMockData() {
        jobTitleInput.value = mockUserInput.title;
        jobSummaryInput.value = mockUserInput.summary;
        coreBehavioralAnchorInput.value = mockEnhancements.core_behavioral_anchor;
        exceptionOverrideInput.value = mockEnhancements.exception_override;
        validateInputs();
    }

    function validateInputs() {
        const title = jobTitleInput.value.trim();
        const summary = jobSummaryInput.value.trim();
        const summaryLength = summary.length;
        
        summaryCharCount.textContent = `${summaryLength} / 50`;
        if (summaryLength >= 50) {
            summaryCharCount.classList.add('text-green-600');
            summaryCharCount.classList.remove('text-gray-500');
        } else {
            summaryCharCount.classList.remove('text-green-600');
            summaryCharCount.classList.add('text-gray-500');
        }

        if (title.length > 0 && summaryLength >= 50) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    }

    function switchTab(tabName) {
        appState.currentTab = tabName;
        if (tabName === 'details') {
            tabDetails.classList.add('tab-active');
            tabDetails.classList.remove('tab-inactive');
            tabSkills.classList.add('tab-inactive');
            tabSkills.classList.remove('tab-active');
            contentDetails.classList.remove('hidden');
            contentSkills.classList.add('hidden');
        } else if (tabName === 'skills') {
            tabSkills.classList.add('tab-active');
            tabSkills.classList.remove('tab-inactive');
            tabDetails.classList.add('tab-inactive');
            tabDetails.classList.remove('tab-active');
            contentSkills.classList.remove('hidden');
            contentDetails.classList.add('hidden');
            renderSkills();
        }
    }
    
    function extractAndDisplaySkills() {
        existingSkillsPills.innerHTML = '';
        newSkillsPills.innerHTML = '';
        appState.skills = [];

        // Add flex-wrap to the containers
        existingSkillsPills.classList.add('flex', 'flex-wrap', 'gap-2');
        newSkillsPills.classList.add('flex', 'flex-wrap', 'gap-2');

        const ontologySkillNames = appState.ontology.skills.map(s => s.name);

        mockExtractedSkills.forEach((skill, index) => {
            const isExisting = ontologySkillNames.includes(skill.name);
            appState.skills.push({
                id: index + 1, name: skill.name, proficiency: skill.proficiency, status: 'Unmapped', mapping: null, isNew: !isExisting
            });
            
            const pill = document.createElement('span');
            pill.textContent = `${skill.name} (${skill.proficiency})`;
            pill.className = 'skill-pill px-3 py-1 rounded-full text-sm whitespace-nowrap'; /* Added whitespace-nowrap */

            if (isExisting) {
                pill.classList.add('bg-blue-100', 'text-blue-800');
                existingSkillsPills.appendChild(pill);
            } else {
                pill.classList.add('bg-yellow-100', 'text-yellow-800');
                newSkillsPills.appendChild(pill);
            }
        });

        extractedSkillsSection.classList.remove('hidden');
    }

    function handleGenerateDescription() {
        jobSummaryInput.value += `\n\n(AI Enhanced) ${mockEnhancements.summary}`;
        responsibilitiesInput.value = mockEnhancements.responsibilities.join('\n\n');
        qualificationsInput.value = mockEnhancements.qualifications.join('\n\n');
        coreBehavioralAnchorInput.value = mockEnhancements.core_behavioral_anchor;
        exceptionOverrideInput.value = mockEnhancements.exception_override;
        extractAndDisplaySkills();
        tabSkills.classList.remove('tab-disabled');
        generateBtn.disabled = true;
        generateBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    function renderSkills() {
        skillsListContainer.innerHTML = '';
        if (appState.skills.length === 0) {
            skillsListContainer.innerHTML = `<p class="text-gray-500">Generate a job description on the 'Job Details' tab to see extracted skills here.</p>`;
            return;
        }

        appState.skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'bg-white p-4 rounded-lg shadow-sm flex justify-between items-center transition-all duration-300';
            let statusBadge;
            let mappingInfo = '';

            if (skill.status === 'Mapped') {
                statusBadge = `<span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">Mapped</span>`;
                const skillName = skill.mapping.skillName || 'N/A';
                const behaviorName = skill.mapping.behaviorName || 'N/A';
                const proficiency = skill.mapping.proficiency || 'N/A';
                mappingInfo = `<p class="text-sm text-gray-500 mt-1">Mapped to: <span class="font-medium">${skill.mapping.capability} > ${skill.mapping.competency} > (Skill: ${skillName}, Behavior: ${behaviorName})</span></p>
                               <p class="text-sm text-gray-500 mt-1">Proficiency: <span class="font-medium">${proficiency}</span></p>`;
            } else {
                statusBadge = `<span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">Unmapped</span>`;
            }

            skillElement.innerHTML = `
                <div>
                    <div class="flex items-center gap-3">
                        <span class="font-semibold text-gray-800">${skill.name}</span>
                        ${statusBadge}
                    </div>
                    ${mappingInfo}
                </div>
                <button data-skill-id="${skill.id}" class="map-skill-btn text-indigo-600 font-semibold py-1 px-3 rounded-lg hover:bg-indigo-50 transition-colors">
                    ${skill.status === 'Mapped' ? 
                        `<span class="button-text">Edit Mapping</span><i class="fas fa-edit button-icon"></i>` : 
                        `<span class="button-text">Map to Ontology</span><i class="fas fa-map-pin button-icon"></i>`
                    }
                </button>
            `;
            skillsListContainer.appendChild(skillElement);
        });

        document.querySelectorAll('.map-skill-btn').forEach(btn => btn.addEventListener('click', () => openMappingModal(btn.dataset.skillId)));
    }

    // No longer need resize listener here, CSS will handle visibility
    // window.addEventListener('resize', renderSkills); 
    
    function openMappingModal(skillId) {
        appState.currentSkillToMap = parseInt(skillId);
        const skill = appState.skills.find(s => s.id === appState.currentSkillToMap);

        modalSkillName.textContent = `"${skill.name}"`;
        populateCapabilities(skill.mapping?.capability_id);
        populateCompetencies(skill.mapping?.capability_id, skill.mapping?.competency_id);
        populateSkills(skill.mapping?.competency_id, skill.mapping?.skill_id);
        populateBehaviors(skill.mapping?.competency_id, skill.mapping?.behavior_id);
        populateProficiencyLevels(skill.mapping?.proficiency || skill.proficiency); // Pre-fill with existing or suggested proficiency

        newCapabilityInput.value = '';
        newCompetencyInput.value = '';
        newSkillInput.value = '';
        newBehaviorInput.value = '';

        [newCapabilityInput, newCompetencyInput, newSkillInput, newBehaviorInput].forEach(input => input.classList.remove('visible'));
        updateStepper(1);
        
        if (skill.mapping) {
             updateStepper(3);
        }

        mappingModal.classList.remove('hidden');
        mappingModal.classList.add('flex');
        setTimeout(() => {
            mappingModal.classList.remove('opacity-0');
            mappingModal.querySelector('.modal').classList.remove('scale-95');
        }, 10);
    }

    function closeModal(modalElement) {
        modalElement.querySelector('.modal').classList.add('scale-95');
        modalElement.classList.add('opacity-0');
        setTimeout(() => {
            modalElement.classList.add('hidden');
            modalElement.classList.remove('flex');
        }, 300);
    }

    function populateCapabilities(selectedValue = '') {
        capabilitySelect.innerHTML = `<option value="">-- Please Select --</option>`;
        appState.ontology.capabilities.forEach(cap => {
            capabilitySelect.innerHTML += `<option value="${cap.id}" ${selectedValue === cap.id ? 'selected' : ''}>${cap.name}</option>`;
        });
        capabilitySelect.innerHTML += `<option value="add_new" class="font-bold text-indigo-600">-- Add New Capability --</option>`;
    }
    
    function populateCompetencies(capabilityId, selectedValue = '') {
        const relevantCompetencies = appState.ontology.competencies.filter(com => com.capability_id === capabilityId);
        competencySelect.innerHTML = '<option value="">-- Please Select --</option>';
        relevantCompetencies.forEach(com => {
            competencySelect.innerHTML += `<option value="${com.id}" ${selectedValue === com.id ? 'selected' : ''}>${com.name}</option>`;
        });
        competencySelect.innerHTML += `<option value="add_new" class="font-bold text-indigo-600">-- Add New Competency --</option>`;
        competencySelect.disabled = !capabilityId;
        competencySelect.classList.toggle('bg-gray-100', !capabilityId);
    }

    function populateSkills(competencyId, selectedValue = '') {
        const relevantSkills = appState.ontology.skills.filter(sk => sk.competency_id === competencyId);
        skillSelect.innerHTML = '<option value="">-- Not Applicable --</option>';
        relevantSkills.forEach(sk => {
            skillSelect.innerHTML += `<option value="${sk.id}" ${selectedValue === sk.id ? 'selected' : ''}>${sk.name}</option>`;
        });
        skillSelect.innerHTML += `<option value="add_new" class="font-bold text-indigo-600">-- Add New Skill --</option>`;
        skillSelect.disabled = !competencyId;
        skillSelect.classList.toggle('bg-gray-100', !competencyId);
    }

    function populateBehaviors(competencyId, selectedValue = '') {
        const relevantBehaviors = appState.ontology.behaviors.filter(bh => bh.competency_id === competencyId);
        behaviorSelect.innerHTML = '<option value="">-- Not Applicable --</option>';
        relevantBehaviors.forEach(bh => {
            behaviorSelect.innerHTML += `<option value="${bh.id}" ${selectedValue === bh.id ? 'selected' : ''}>${bh.name}</option>`;
        });
        behaviorSelect.innerHTML += `<option value="add_new" class="font-bold text-indigo-600">-- Add New Behavior --</option>`;
        behaviorSelect.disabled = !competencyId;
        behaviorSelect.classList.toggle('bg-gray-100', !competencyId);
    }

    function populateProficiencyLevels(selectedValue = '') {
        const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
        proficiencySelect.innerHTML = `<option value="">-- Select Proficiency --</option>`;
        proficiencyLevels.forEach(level => {
            proficiencySelect.innerHTML += `<option value="${level}" ${selectedValue === level ? 'selected' : ''}>${level}</option>`;
        });
    }

    function updateStepper(step) {
        modalStepper.forEach((stepperItem, index) => {
            const circle = stepperItem.querySelector('.rounded-full');
            const text = stepperItem.querySelector('.uppercase');
            const line = stepperItem.previousElementSibling;
            
            if(index < step) {
                circle.classList.add('bg-indigo-600', 'border-indigo-600', 'text-white');
                text.classList.add('text-indigo-600');
                if(line) line.classList.add('border-indigo-600');
            } else {
                circle.classList.remove('bg-indigo-600', 'text-white');
                text.classList.remove('text-indigo-600');
                if(line) line.classList.remove('border-indigo-600');
            }
        });
    }

    async function handleSaveMapping() {
        let capabilityId = capabilitySelect.value;
        let competencyId = competencySelect.value;
        let skillId = skillSelect.value;
        let behaviorId = behaviorSelect.value;
        let proficiency = proficiencySelect.value;

        let capabilityName, competencyName, skillName, behaviorName;

        try {
            if (capabilityId === 'add_new') {
                const newName = newCapabilityInput.value.trim();
                if (!newName) { alert("New capability name cannot be empty."); return; }
                const newCap = await callAPI('/api/v1/ontology/capabilities', 'POST', { name: newName });
                appState.ontology.capabilities.push(newCap);
                capabilityId = newCap.id;
            }
            capabilityName = appState.ontology.capabilities.find(c => c.id === capabilityId)?.name;

            if (competencyId === 'add_new') {
                const newName = newCompetencyInput.value.trim();
                if (!newName) { alert("New competency name cannot be empty."); return; }
                const newComp = await callAPI('/api/v1/ontology/competencies', 'POST', { name: newName, capability_id: capabilityId });
                appState.ontology.competencies.push(newComp);
                competencyId = newComp.id;
            }
            competencyName = appState.ontology.competencies.find(c => c.id === competencyId)?.name;

            if (skillId === 'add_new') {
                const newName = newSkillInput.value.trim();
                if (!newName) { alert("New skill name cannot be empty."); return; }
                const newSkill = await callAPI('/api/v1/ontology/skills', 'POST', { name: newName, competency_id: competencyId });
                appState.ontology.skills.push(newSkill);
                skillId = newSkill.id;
            }
            skillName = appState.ontology.skills.find(s => s.id === skillId)?.name;

            if (behaviorId === 'add_new') {
                const newName = newBehaviorInput.value.trim();
                if (!newName) { alert("New behavior name cannot be empty."); return; }
                const newBehavior = await callAPI('/api/v1/ontology/behaviors', 'POST', { name: newName, competency_id: competencyId });
                appState.ontology.behaviors.push(newBehavior);
                behaviorId = newBehavior.id;
            }
            behaviorName = appState.ontology.behaviors.find(b => b.id === behaviorId)?.name;

            if (!capabilityId || !competencyId || (!skillId && !behaviorId)) {
                alert("Please ensure capability, competency, and at least one skill or behavior are selected or created.");
                return;
            }

            const skillToUpdate = appState.skills.find(s => s.id === appState.currentSkillToMap);
            
            // Save the mapping to the backend
            const mappingPayload = {
                suggested_skill_name: skillToUpdate.name,
                capability_id: capabilityId,
                competency_id: competencyId,
                skill_id: skillId === '-- Not Applicable --' ? null : skillId, // Handle "Not Applicable"
                behavior_id: behaviorId === '-- Not Applicable --' ? null : behaviorId, // Handle "Not Applicable"
                proficiency: proficiency
            };
            await callAPI('/api/ai/map_skill', 'POST', mappingPayload);

            skillToUpdate.status = 'Mapped';
            skillToUpdate.mapping = {
                capability_id: capabilityId, capability: capabilityName,
                competency_id: competencyId, competency: competencyName,
                skill_id: skillId, skillName,
                behavior_id: behaviorId, behaviorName,
                proficiency: proficiency
            };

            renderSkills();
            closeModal(mappingModal);
            alert("Skill mapped successfully!");
        } catch (error) {
            console.error("Error saving mapping:", error);
            alert("Failed to save mapping. Please check console for details.");
        }
    }
    
    function handleNextStep() {
        if (appState.currentTab === 'details') {
            if (tabSkills.classList.contains('tab-disabled')) {
                alert('Please generate the job description before proceeding.');
            } else {
                switchTab('skills');
            }
            return;
        }
        const hasUnmapped = appState.skills.some(s => s.status === 'Unmapped');
        if (hasUnmapped) {
            validationModal.classList.remove('hidden');
            validationModal.classList.add('flex');
             setTimeout(() => {
                validationModal.classList.remove('opacity-0');
                validationModal.querySelector('.modal').classList.remove('scale-95');
            }, 10);
        } else {
            alert("All skills mapped! Proceeding to the next step.");
            console.log("Final State:", appState.skills);
            // console.log("Updated Ontology:", appState.ontology); // Ontology is updated via API calls
            navigation.navigateToStep(8);
        }
    }
    
    // --- EVENT LISTENERS ---
    function addEventListeners() {
        loadMockBtn.addEventListener('click', handleLoadMockData);
        jobTitleInput.addEventListener('input', validateInputs);
        jobSummaryInput.addEventListener('input', validateInputs);
        tabDetails.addEventListener('click', () => switchTab('details'));
        tabSkills.addEventListener('click', () => {
            if(!tabSkills.classList.contains('tab-disabled')) switchTab('skills');
        });
        generateBtn.addEventListener('click', handleGenerateDescription);
        closeModalBtn.addEventListener('click', () => closeModal(mappingModal));
        cancelMappingBtn.addEventListener('click', () => closeModal(mappingModal));
        saveMappingBtn.addEventListener('click', handleSaveMapping);
        
        capabilitySelect.addEventListener('change', (e) => {
            const isAddNew = e.target.value === 'add_new';
            newCapabilityInput.classList.toggle('visible', isAddNew);
            const capId = isAddNew ? null : e.target.value;
            populateCompetencies(capId);
            populateSkills(null);
            populateBehaviors(null);
            updateStepper(e.target.value && !isAddNew ? 2 : 1);
        });

        competencySelect.addEventListener('change', (e) => {
            const isAddNew = e.target.value === 'add_new';
            newCompetencyInput.classList.toggle('visible', isAddNew);
            const comId = isAddNew ? null : e.target.value;
            populateSkills(comId);
            populateBehaviors(comId);
            updateStepper(e.target.value && !isAddNew ? 3 : 2);
        });

        skillSelect.addEventListener('change', (e) => {
            newSkillInput.classList.toggle('visible', e.target.value === 'add_new');
        });

        behaviorSelect.addEventListener('change', (e) => {
            newBehaviorInput.classList.toggle('visible', e.target.value === 'add_new');
        });

        nextStepBtn.addEventListener('click', handleNextStep);
        backBtn.addEventListener('click', () => {
            if (appState.currentTab === 'skills') {
                switchTab('details');
            }
        });
        goBackBtn.addEventListener('click', () => closeModal(validationModal));
        proceedAnywayBtn.addEventListener('click', () => {
            console.log("Final State (incomplete):", appState.skills);
            closeModal(validationModal);
            navigation.navigateToStep(8);
        });
    }

    return {
        init: async function(_appData, _openModal, _closeModal, _updateWizardState, _getFormHTML, _callAPI, _contentWrapper, _navigation) {
            // Assign passed-in functions to module-level variables
            callAPI = _callAPI;
            navigation = _navigation;

            // Initialize DOM elements after content is loaded
            tabDetails = document.getElementById('tab-details');
            tabSkills = document.getElementById('tab-skills');
            contentDetails = document.getElementById('tab-content-details');
            contentSkills = document.getElementById('tab-content-skills');
            loadMockBtn = document.getElementById('load-mock-btn');
            generateBtn = document.getElementById('generate-ai-btn');
            jobTitleInput = document.getElementById('job-title');
            jobSummaryInput = document.getElementById('job-summary');
            summaryCharCount = document.getElementById('summary-char-count');
            responsibilitiesInput = document.getElementById('key-responsibilities');
            qualificationsInput = document.getElementById('required-qualifications');
            skillsListContainer = document.getElementById('skills-list');
            mappingModal = document.getElementById('mapping-modal');
            closeModalBtn = document.getElementById('close-modal-btn');
            cancelMappingBtn = document.getElementById('cancel-mapping-btn');
            saveMappingBtn = document.getElementById('save-mapping-btn');
            modalSkillName = document.getElementById('modal-skill-name');
            capabilitySelect = document.getElementById('capability-select');
            competencySelect = document.getElementById('competency-select');
            skillSelect = document.getElementById('skill-select');
            behaviorSelect = document.getElementById('behavior-select');
            newCapabilityInput = document.getElementById('new-capability-input');
            newCompetencyInput = document.getElementById('new-competency-input');
            newSkillInput = document.getElementById('new-skill-input');
            newBehaviorInput = document.getElementById('new-behavior-input');
            proficiencySelect = document.getElementById('proficiency-select'); // Added this line
            nextStepBtn = document.getElementById('next-step-btn');
            backBtn = document.getElementById('back-btn');
            validationModal = document.getElementById('validation-modal');
            goBackBtn = document.getElementById('go-back-btn');
            proceedAnywayBtn = document.getElementById('proceed-anyway-btn');
            modalStepper = mappingModal.querySelectorAll('.flex.items-center.relative');
            extractedSkillsSection = document.getElementById('extracted-skills-section');
            existingSkillsPills = document.getElementById('existing-skills-pills');
            newSkillsPills = document.getElementById('new-skills-pills');
            coreBehavioralAnchorInput = document.getElementById('core-behavioral-anchor'); // Added this line
            exceptionOverrideInput = document.getElementById('exception-override'); // Added this line

            addEventListeners(); // Attach event listeners

            // Initial validation check
            validateInputs();

            // Fetch ontology data on module initialization
            await fetchOntologyData(); // Ensure data is fetched before populating

            // Populate initial dropdowns after fetching data
            populateCapabilities();

            // Render skills initially
            renderSkills();
        }
    };
})();

window.jobProfilesModule = jobProfilesModule;
