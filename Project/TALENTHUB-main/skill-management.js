document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const skillModal = document.getElementById('skill-modal');
    const addNewSkillBtn = document.getElementById('add-new-skill-btn');
    const closeBtn = document.querySelector('.modal .close-btn');
    const skillForm = document.getElementById('skill-form');
    const modalTitle = document.getElementById('modal-title');

    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextStepBtns = document.querySelectorAll('.next-step-btn');
    const prevStepBtns = document.querySelectorAll('.prev-step-btn');

    const filterCapabilitySelect = document.getElementById('filter-capability');
    const filterCompetencySelect = document.getElementById('filter-competency');
    const filterTypeSelect = document.getElementById('filter-type');
    const searchSkillsInput = document.getElementById('search-skills');
    const skillsDisplayArea = document.getElementById('skills-display-area');

    // Modal step elements
    const skillNameInput = document.getElementById('skill-name');
    const skillCapabilitySelect = document.getElementById('skill-capability');
    const addNewCapabilityBtn = document.getElementById('add-new-capability-btn');
    const newCapabilityInputContainer = document.getElementById('new-capability-input-container');
    const newCapabilityNameInput = document.getElementById('new-capability-name');
    const saveNewCapabilityBtn = document.getElementById('save-new-capability-btn');

    const skillCompetencySelect = document.getElementById('skill-competency'); // This might need to become multi-select
    const addNewCompetencyBtn = document.getElementById('add-new-competency-btn');
    const newCompetencyInputContainer = document.getElementById('new-competency-input-container');
    const newCompetencyNameInput = document.getElementById('new-competency-name');
    const saveNewCompetencyBtn = document.getElementById('save-new-competency-btn');

    const typeSkillCheckbox = document.getElementById('type-skill');
    const typeBehaviorCheckbox = document.getElementById('type-behavior');
    const reviewDetailsDiv = document.getElementById('review-details');

    let currentStep = 0;
    let editingSkillId = null;

    let capabilities = [];
    let competencies = [];
    let skillsData = []; // This will store processed skill data for frontend
    const API_BASE_URL = '/api/v1';

    // --- API Fetch Functions (no changes needed here) ---
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching from ${url}:`, error);
            skillsDisplayArea.innerHTML = `<p class="error-message">Error loading data from ${url}. ${error.message}</p>`;
            throw error;
        }
    }

    async function postData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error posting to ${url}:`, error);
            alert(`Error saving data: ${error.message}`);
            throw error;
        }
    }

    async function putData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error putting to ${url}:`, error);
            alert(`Error updating data: ${error.message}`);
            throw error;
        }
    }

    async function deleteData(url) {
        try {
            const response = await fetch(url, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error deleting from ${url}:`, error);
            alert(`Error deleting data: ${error.message}`);
            throw error;
        }
    }

    // Helper to process skill data from API response into frontend structure
    function processSkillFromAPI(apiSkill) {
        const categoryLower = apiSkill.category?.toLowerCase();
        return {
            id: apiSkill.id,
            name: apiSkill.name,
            description: apiSkill.description,
            // API skill object should have a `competencies` array: [{id, name, capabilities: [{id, name}]}]
            competencies: apiSkill.competencies || [], 
            isSkill: categoryLower === 'skill' || categoryLower === 'skill and behavior',
            isBehavior: categoryLower === 'behavior' || categoryLower === 'skill and behavior',
            type: apiSkill.category || 'N/A',
            tags: apiSkill.tags ? (Array.isArray(apiSkill.tags) ? apiSkill.tags : apiSkill.tags.split(',')) : []
        };
    }

    async function loadInitialData() {
        try {
            const [capsResponse, compsResponse, skillsResponse] = await Promise.all([
                fetchData(`${API_BASE_URL}/capabilities/all`),
                fetchData(`${API_BASE_URL}/competencies/all`),
                fetchData(`${API_BASE_URL}/skills/`)
            ]);
            
            capabilities = capsResponse; // Raw from API: [{id, name, description, competencies: [{id, name}]}]
            competencies = compsResponse; // Raw from API: [{id, name, description, capabilities: [{id, name}], ...}]
            
            skillsData = skillsResponse.map(processSkillFromAPI); // Use helper to structure

            populateCapabilitiesSelect(filterCapabilitySelect);
            populateCompetenciesSelect(filterCompetencySelect, null); // Show all competencies initially
            renderSkills();
        } catch (error) {
            console.error("Failed to load initial data for the page.", error);
        }
    }

    function openModal(skillToEdit = null) {
        skillModal.style.display = 'block';
        currentStep = 0;
        showStep(currentStep);
        skillForm.reset();
        newCapabilityInputContainer.style.display = 'none';
        newCompetencyInputContainer.style.display = 'none';
        // Ensure skillCompetencySelect is single-select for now, or update HTML to support multi-select
        skillCompetencySelect.multiple = false; 

        populateCapabilitiesSelect(skillCapabilitySelect); // Populate capabilities for the form

        if (skillToEdit) {
            editingSkillId = skillToEdit.id;
            modalTitle.textContent = 'Edit Skill';
            skillNameInput.value = skillToEdit.name;

            // Pre-selection logic for M2M:
            // A skill has multiple competencies. A competency has multiple capabilities.
            // The form has one capability dropdown to filter the competency dropdown.
            // For editing, we need to pick a "primary" context or allow complex selection.
            // Simplification: Use the first competency's first capability as the context for the dropdowns.
            if (skillToEdit.competencies && skillToEdit.competencies.length > 0) {
                const firstCompetencyOfSkill = competencies.find(c => c.id === skillToEdit.competencies[0].id);
                if (firstCompetencyOfSkill && firstCompetencyOfSkill.capabilities && firstCompetencyOfSkill.capabilities.length > 0) {
                    const firstCapabilityId = firstCompetencyOfSkill.capabilities[0].id;
                    skillCapabilitySelect.value = firstCapabilityId;
                    // Populate competencies based on this selected capability
                    populateCompetenciesSelect(skillCompetencySelect, firstCapabilityId, skillToEdit.competencies.map(c => c.id));
                     // If skillCompetencySelect is to be multi-select, this will pre-select multiple.
                     // If it's single, it will select the first one found in the list.
                } else {
                    // No specific capability context from the skill's first competency, show all competencies
                    populateCompetenciesSelect(skillCompetencySelect, null, skillToEdit.competencies.map(c => c.id));
                }
                 // If skillCompetencySelect is single, make sure only one is selected (e.g., the first one)
                if (!skillCompetencySelect.multiple && skillToEdit.competencies.length > 0) {
                    skillCompetencySelect.value = skillToEdit.competencies[0].id;
                }

            } else {
                // No competencies linked to the skill, show all competencies initially (filtered by nothing)
                populateCompetenciesSelect(skillCompetencySelect, null);
            }

            typeSkillCheckbox.checked = skillToEdit.isSkill;
            typeBehaviorCheckbox.checked = skillToEdit.isBehavior;
        } else {
            editingSkillId = null;
            modalTitle.textContent = 'Create New Skill';
            // For new skill, populate competencies based on no specific capability initially, or first capability
            populateCompetenciesSelect(skillCompetencySelect, skillCapabilitySelect.value || null);
        }
    }

    function closeModal() {
        skillModal.style.display = 'none';
        editingSkillId = null;
    }

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });
        if (stepIndex === steps.length - 1) {
            updateReviewDetails();
        }
    }

    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep === 0 && !skillNameInput.value.trim()) {
                alert('Skill name is required.'); return;
            }
            if (currentStep === 1 && !skillCapabilitySelect.value && !newCapabilityNameInput.value.trim()) {
                alert('Please select or add a capability.'); return;
            }
            // For step 2 (competency), ensure at least one competency is selected if skillCompetencySelect is multi.
            // If single, skillCompetencySelect.value is enough.
            const selectedCompetenciesInForm = Array.from(skillCompetencySelect.selectedOptions).map(opt => opt.value).filter(val => val);
            if (currentStep === 2 && selectedCompetenciesInForm.length === 0 && !newCompetencyNameInput.value.trim()) {
                 alert('Please select or add at least one competency.'); return;
            }
            if (currentStep === 3 && !typeSkillCheckbox.checked && !typeBehaviorCheckbox.checked) {
                alert('Please select at least one type (Skill or Behavior).'); return;
            }
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    function populateCapabilitiesSelect(selectElement, selectedId = null) {
        selectElement.innerHTML = '<option value="">Select Capability</option>';
        capabilities.forEach(cap => {
            const option = document.createElement('option');
            option.value = cap.id;
            option.textContent = cap.name;
            if (selectedId && parseInt(selectedId) === cap.id) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    function populateCompetenciesSelect(selectElement, capabilityId, selectedIdOrIds = null) {
        selectElement.innerHTML = '<option value="">All Competencies</option>';
        const numericCapabilityId = capabilityId ? parseInt(capabilityId, 10) : null;
        let competenciesToShow = competencies;

        if (numericCapabilityId) {
            competenciesToShow = competencies.filter(comp => 
                comp.capabilities && comp.capabilities.some(cap => cap.id === numericCapabilityId)
            );
        }
        
        const selectedIdsArray = Array.isArray(selectedIdOrIds) 
            ? selectedIdOrIds.map(id => parseInt(id)) 
            : (selectedIdOrIds ? [parseInt(selectedIdOrIds)] : []);

        competenciesToShow.forEach(comp => {
            const option = document.createElement('option');
            option.value = comp.id;
            option.textContent = comp.name;
            if (selectedIdsArray.includes(comp.id)) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });

        if (numericCapabilityId) {
            selectElement.disabled = competenciesToShow.length === 0;
        } else {
            selectElement.disabled = competencies.length === 0; 
        }
    }

    addNewCapabilityBtn.addEventListener('click', () => {
        newCapabilityInputContainer.style.display = 'block';
        newCapabilityNameInput.focus();
    });

    saveNewCapabilityBtn.addEventListener('click', async () => {
        const newName = newCapabilityNameInput.value.trim();
        if (newName) {
            try {
                // API expects competency_ids for new capability if linking, but here we just create capability
                const newCapability = await postData(`${API_BASE_URL}/capabilities/`, { name: newName, description: `User-added: ${newName}` });
                capabilities.push(newCapability);
                capabilities.sort((a, b) => a.name.localeCompare(b.name));
                
                populateCapabilitiesSelect(skillCapabilitySelect, newCapability.id);
                populateCapabilitiesSelect(filterCapabilitySelect);
                
                newCapabilityNameInput.value = '';
                newCapabilityInputContainer.style.display = 'none';
                populateCompetenciesSelect(skillCompetencySelect, newCapability.id); 
            } catch (error) {
                console.error("Failed to save new capability:", error);
            }
        }
    });

    addNewCompetencyBtn.addEventListener('click', () => {
        newCompetencyInputContainer.style.display = 'block';
        newCompetencyNameInput.focus();
    });

    saveNewCompetencyBtn.addEventListener('click', async () => {
        const newName = newCompetencyNameInput.value.trim();
        const selectedCapabilityIdInForm = skillCapabilitySelect.value; 
        
        if (!selectedCapabilityIdInForm) {
            alert('Please select a capability to associate with the new competency.');
            return;
        }
        if (newName) {
            try {
                const newCompetency = await postData(`${API_BASE_URL}/competencies/`, { 
                    name: newName, 
                    capability_ids: [parseInt(selectedCapabilityIdInForm)], // Send as a list
                    description: `User-added: ${newName}` 
                });
                competencies.push(newCompetency); 
                competencies.sort((a,b) => a.name.localeCompare(b.name));

                populateCompetenciesSelect(skillCompetencySelect, selectedCapabilityIdInForm, newCompetency.id);
                const currentFilterCapabilityId = filterCapabilitySelect.value;
                populateCompetenciesSelect(filterCompetencySelect, currentFilterCapabilityId || null);

                newCompetencyNameInput.value = '';
                newCompetencyInputContainer.style.display = 'none';
            } catch (error) {
                console.error("Failed to save new competency:", error);
            }
        }
    });

    skillCapabilitySelect.addEventListener('change', (e) => {
        const selectedCapabilityId = e.target.value;
        populateCompetenciesSelect(skillCompetencySelect, selectedCapabilityId);
        newCompetencyNameInput.value = '';
        newCompetencyInputContainer.style.display = 'none';
    });

    function updateReviewDetails() {
        const skillName = skillNameInput.value;
        const selectedCompetencyOptions = Array.from(skillCompetencySelect.selectedOptions);
        const competencyDetailsText = selectedCompetencyOptions.length > 0 
            ? selectedCompetencyOptions.map(opt => opt.textContent).join(', ') 
            : 'N/A';
        
        const capabilityIdInForm = skillCapabilitySelect.value;
        const capabilityNameInForm = capabilities.find(c => c.id == capabilityIdInForm)?.name || 'N/A';

        const isSkill = typeSkillCheckbox.checked;
        const isBehavior = typeBehaviorCheckbox.checked;
        let typeText = [];
        if (isSkill) typeText.push('Skill');
        if (isBehavior) typeText.push('Behavior');

        reviewDetailsDiv.innerHTML = `
            <p><strong>Name:</strong> ${skillName}</p>
            <p><strong>Selected Capability Context:</strong> ${capabilityNameInForm}</p> 
            <p><strong>Competencies to Link:</strong> ${competencyDetailsText}</p>
            <p><strong>Type:</strong> ${typeText.join(' and ')}</p>
        `;
    }

    skillForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const selectedCompetencyIds = Array.from(skillCompetencySelect.selectedOptions)
                                          .map(option => parseInt(option.value))
                                          .filter(id => !isNaN(id));

        if (selectedCompetencyIds.length === 0) {
            alert('Please select at least one competency for the skill.');
            return;
        }
        
        const skillPayload = {
            name: skillNameInput.value.trim(),
            description: '', 
            competencyIds: selectedCompetencyIds, 
            isSkill: typeSkillCheckbox.checked,
            isBehavior: typeBehaviorCheckbox.checked,
            tags: [] 
        };

        try {
            let savedSkillResponse;
            if (editingSkillId) {
                savedSkillResponse = await putData(`${API_BASE_URL}/skills/${editingSkillId}`, skillPayload);
                const index = skillsData.findIndex(s => s.id === editingSkillId);
                if (index !== -1) {
                    skillsData[index] = processSkillFromAPI(savedSkillResponse);
                }
            } else {
                savedSkillResponse = await postData(`${API_BASE_URL}/skills/`, skillPayload);
                skillsData.push(processSkillFromAPI(savedSkillResponse));
            }
            applyFiltersAndSearch();
            closeModal();
        } catch (error) {
            console.error("Failed to save skill:", error);
        }
    });

    function renderSkills(filteredSkills = skillsData) {
        skillsDisplayArea.innerHTML = ''; 
        if (filteredSkills.length === 0) {
            skillsDisplayArea.innerHTML = '<p>No skills found matching your criteria.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'skills-table';
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        ['Name', 'Competencies', 'Primary Capability', 'Type', 'Actions'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        filteredSkills.forEach(skill => {
            const row = tbody.insertRow();
            const competencyNames = skill.competencies.map(comp => comp.name).join(', ') || 'N/A';
            
            let primaryCapabilityName = 'N/A';
            if (skill.competencies.length > 0 && 
                skill.competencies[0].capabilities && 
                skill.competencies[0].capabilities.length > 0) {
                primaryCapabilityName = skill.competencies[0].capabilities[0].name;
            }

            row.insertCell().textContent = skill.name;
            row.insertCell().textContent = competencyNames;
            row.insertCell().textContent = primaryCapabilityName; 
            row.insertCell().textContent = skill.type.charAt(0).toUpperCase() + skill.type.slice(1);

            const actionsCell = row.insertCell();
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'btn btn-sm btn-secondary';
            editBtn.addEventListener('click', () => openModal(skill));
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.addEventListener('click', () => deleteSkill(skill.id));
            actionsCell.appendChild(deleteBtn);
        });
        skillsDisplayArea.appendChild(table);
    }

    async function deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            try {
                await deleteData(`${API_BASE_URL}/skills/${skillId}`);
                skillsData = skillsData.filter(skill => skill.id !== skillId);
                applyFiltersAndSearch();
            } catch (error) {
                 console.error("Failed to delete skill:", error);
            }
        }
    }

    function applyFiltersAndSearch() {
        const capabilityFilterId = filterCapabilitySelect.value ? parseInt(filterCapabilitySelect.value) : null;
        const competencyFilterId = filterCompetencySelect.value ? parseInt(filterCompetencySelect.value) : null;
        const typeFilter = filterTypeSelect.value;
        const searchTerm = searchSkillsInput.value.toLowerCase();

        console.log("Filtering with:", { capabilityFilterId, competencyFilterId, typeFilter, searchTerm });

        let filtered = skillsData.filter(skill => {
            console.log(`Checking skill: ${skill.name} (ID: ${skill.id})`, skill);

            const capMatch = !capabilityFilterId || (skill.competencies && skill.competencies.some(comp => {
                const compHasCap = comp.capabilities && comp.capabilities.some(cap => cap.id === capabilityFilterId);
                console.log(`Skill '${skill.name}', Comp '${comp.name}': comp.capabilities:`, comp.capabilities, `Capability filter ID: ${capabilityFilterId}. Match? ${compHasCap}`);
                return compHasCap;
            }));

            const compMatch = !competencyFilterId || (skill.competencies && skill.competencies.some(comp => {
                const compIsTarget = comp.id === competencyFilterId;
                console.log(`Skill '${skill.name}', Comp '${comp.name}': comp.id: ${comp.id}. Competency filter ID: ${competencyFilterId}. Match? ${compIsTarget}`);
                return compIsTarget;
            }));
            
            let typeMatch = true;
            if (typeFilter) {
                const tfLower = typeFilter.toLowerCase();
                if (tfLower === 'skill') typeMatch = skill.isSkill;
                else if (tfLower === 'behavior') typeMatch = skill.isBehavior;
                else if (tfLower === 'both') typeMatch = skill.isSkill && skill.isBehavior;
                else typeMatch = false; 
            }
            
            let textToSearch = skill.name.toLowerCase();
            skill.competencies.forEach(comp => {
                textToSearch += ` ${comp.name ? comp.name.toLowerCase() : ''}`; // Add null check for comp.name
                if (comp.capabilities) {
                    comp.capabilities.forEach(cap => {
                        textToSearch += ` ${cap.name ? cap.name.toLowerCase() : ''}`; // Add null check for cap.name
                    });
                }
            });
            const searchMatch = !searchTerm || textToSearch.includes(searchTerm);
            
            console.log(`Skill '${skill.name}': Overall Matches: capMatch=${capMatch}, compMatch=${compMatch}, typeMatch=${typeMatch}, searchMatch=${searchMatch}. Included in filtered: ${capMatch && compMatch && typeMatch && searchMatch}`);
            return capMatch && compMatch && typeMatch && searchMatch;
        });
        console.log("Final filtered skills count:", filtered.length);
        renderSkills(filtered);
    }

    filterCapabilitySelect.addEventListener('change', () => {
        const selectedCapId = filterCapabilitySelect.value;
        populateCompetenciesSelect(filterCompetencySelect, selectedCapId); 
        filterCompetencySelect.value = ''; 
        applyFiltersAndSearch();
    });
    filterCompetencySelect.addEventListener('change', applyFiltersAndSearch);
    filterTypeSelect.addEventListener('change', applyFiltersAndSearch);
    searchSkillsInput.addEventListener('input', applyFiltersAndSearch);

    addNewSkillBtn.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === skillModal) {
            closeModal();
        }
    });

    loadInitialData();
});
