// All required DOM elements
const capabilitySelect = document.getElementById('capability-select');
const competencySelect = document.getElementById('competency-select');
const skillsListContainer = document.getElementById('skills-list');
const behaviorsListContainer = document.getElementById('behaviors-list');
const skillSearchInput = document.getElementById('skill-search-input');

// Admin Modal Elements
const modal = document.getElementById('skill-modal');
const addSkillBtn = document.getElementById('add-skill-btn');
const closeButton = document.querySelector('.close-button');
const skillForm = document.getElementById('skill-form');
const modalTitle = document.getElementById('modal-title');
const skillIdInput = document.getElementById('skill-id');
const skillNameInput = document.getElementById('skill-name');
const skillDescriptionInput = document.getElementById('skill-description');
const skillCompetencySelect = document.getElementById('skill-competency');

// State variables
let allCapabilities = [];
let allCompetencies = [];
let allSkills = [];
let currentSelectedSkillId = null;
let currentSelectedCapability = null;
let currentSelectedCompetency = null;

/**
 * Fetches data from a given URL.
 * @param {string} url - The API endpoint to fetch.
 * @returns {Promise<any>} The JSON response or null on error.
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

/**
 * Loads and populates the capabilities dropdown.
 */
async function loadCapabilities() {
    capabilitySelect.innerHTML = '<option value="">Loading Domains...</option>';
    const data = await fetchData('/api/v1/ontology/capabilities');
    if (data) {
        allCapabilities = data;
        capabilitySelect.innerHTML = ''; // Clear loading message
        
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = '-- Select a Domain --';
        capabilitySelect.appendChild(placeholderOption);

        allCapabilities.forEach(cap => {
            const option = document.createElement('option');
            option.value = cap.id;
            option.textContent = cap.name;
            capabilitySelect.appendChild(option);
        });
    } else {
        capabilitySelect.innerHTML = '<option value="">Error loading</option>';
    }
}

/**
 * Loads and populates competencies based on the selected capability.
 * @param {string} capabilityId - The ID of the selected capability.
 */
async function loadCompetencies(capabilityId) {
    skillsListContainer.innerHTML = '<button class="skill-tag">Loading Skills...</button>';
    behaviorsListContainer.innerHTML = '<button class="skill-tag behavior-tag">Loading Behaviors...</button>';

    competencySelect.innerHTML = '<option value="">Loading...</option>';
    competencySelect.disabled = true;
    currentSelectedSkillId = null;
    currentSelectedCompetency = null;

    currentSelectedCapability = allCapabilities.find(cap => cap.id == capabilityId);

    const data = await fetchData('/api/v1/ontology/competencies');
    if (data) {
        allCompetencies = data;
        competencySelect.innerHTML = '<option value="">-- Select an Area of Expertise --</option>';
        const filteredCompetencies = allCompetencies.filter(comp =>
            comp.capabilities && comp.capabilities.some(cap => cap.id == capabilityId)
        );
        filteredCompetencies.forEach(comp => {
            const option = document.createElement('option');
            option.value = comp.id;
            option.textContent = comp.name;
            competencySelect.appendChild(option);
        });
        competencySelect.disabled = false;
    } else {
        competencySelect.innerHTML = '<option value="">Error loading</option>';
    }
}

/**
 * Loads and displays skills as tags for the selected competency.
 * @param {string} competencyId - The ID of the selected competency.
 */
async function loadSkills(competencyId) {
    skillsListContainer.innerHTML = '<button class="skill-tag">Loading Skills...</button>';
    behaviorsListContainer.innerHTML = '<button class="skill-tag behavior-tag">Loading Behaviors...</button>';
    currentSelectedSkillId = null;

    currentSelectedCompetency = allCompetencies.find(comp => comp.id == competencyId);

    const skillsData = await fetchData('/api/v1/ontology/skills');
    if (skillsData) {
        allSkills = skillsData;
        skillsListContainer.innerHTML = '';
        behaviorsListContainer.innerHTML = '';

        const filteredSkills = allSkills.filter(skill =>
            skill.competencies && skill.competencies.some(comp => comp.id == competencyId)
        );

        if (filteredSkills.length > 0) {
            filteredSkills.forEach(skill => {
                const skillContainer = document.createElement('div');
                skillContainer.className = 'skill-tag-container';
                skillContainer.dataset.skillId = skill.id;

                const skillButton = document.createElement('button');
                skillButton.className = 'skill-tag';
                skillButton.textContent = skill.name;
                
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'skill-actions';

                const editButton = document.createElement('button');
                editButton.className = 'edit-btn';
                editButton.innerHTML = '&#9998;'; // Pencil icon
                editButton.onclick = () => {
                    showModal('Edit Skill', skill);
                };

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-btn';
                deleteButton.innerHTML = '&#128465;'; // Trash icon
                deleteButton.onclick = async () => {
                    if (confirm('Are you sure you want to delete this skill?')) {
                        try {
                            const response = await fetch(`/api/v1/skills/${skill.id}`, { method: 'DELETE' });
                            if (response.ok) {
                                loadSkills(competencyId);
                            } else {
                                console.error('Failed to delete skill');
                            }
                        } catch (error) {
                            console.error('Error deleting skill:', error);
                        }
                    }
                };

                actionsContainer.appendChild(editButton);
                actionsContainer.appendChild(deleteButton);
                skillContainer.appendChild(skillButton);
                skillContainer.appendChild(actionsContainer);
                skillsListContainer.appendChild(skillContainer);
            });
        } else {
            skillsListContainer.innerHTML = '<button class="skill-tag">No skills found for this competency.</button>';
        }
    } else {
        skillsListContainer.innerHTML = '<button class="skill-tag">Error loading skills.</button>';
    }
}

// --- Admin Modal Logic ---

async function populateCompetenciesForModal() {
    try {
        const response = await fetch('/api/v1/ontology/competencies');
        const competencies = await response.json();
        skillCompetencySelect.innerHTML = competencies.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (error) {
        console.error('Error fetching competencies for modal:', error);
    }
}

function showModal(title, skill = {}) {
    populateCompetenciesForModal();
    modalTitle.textContent = title;
    skillIdInput.value = skill.id || '';
    skillNameInput.value = skill.name || '';
    skillDescriptionInput.value = skill.description || '';
    if (skill.competencies && skill.competencies.length > 0) {
        skillCompetencySelect.value = skill.competencies[0].id;
    } else {
        skillCompetencySelect.value = '';
    }
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
    skillForm.reset();
}

addSkillBtn.addEventListener('click', () => showModal('Add New Skill'));
closeButton.addEventListener('click', hideModal);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        hideModal();
    }
});

skillForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const skillId = skillIdInput.value;
    const skillData = {
        name: skillNameInput.value,
        description: skillDescriptionInput.value,
        competency_id: skillCompetencySelect.value,
    };

    const url = skillId ? `/api/v1/skills/${skillId}` : '/api/v1/skills';
    const method = skillId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(skillData),
        });

        if (response.ok) {
            hideModal();
            loadSkills(currentSelectedCompetency.id); // Refresh skills list
        } else {
            console.error('Failed to save skill');
        }
    } catch (error) {
        console.error('Error saving skill:', error);
    }
});


async function initializeApp() {
    await loadCapabilities();

    capabilitySelect.addEventListener('change', (event) => {
        if (event.target.value) loadCompetencies(event.target.value);
    });

    competencySelect.addEventListener('change', (event) => {
        if (event.target.value) loadSkills(event.target.value);
    });
}

initializeApp();

// Placeholders for functions called from HTML to avoid errors
function toggleSidebar() { console.log('toggleSidebar called'); }
function toggleProficienciesSidebar() { console.log('toggleProficienciesSidebar called'); }
