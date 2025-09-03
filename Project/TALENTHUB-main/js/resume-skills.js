// --- DOM Elements ---
const modal = document.getElementById('skill-modal');
const modalTitle = document.getElementById('modal-title');
const skillForm = document.getElementById('skill-form');
const skillNameInput = document.getElementById('skill-name');
const skillLevelSelect = document.getElementById('skill-level');
const editSkillNameInput = document.getElementById('edit-skill-name'); // Hidden input for original name during edit
const confirmedSkillsContainer = document.getElementById('resume-skills-container');
const inferredSkillsContainer = document.getElementById('inferred-skills-container');
const relatedSkillsSection = document.getElementById('related-skills-section');
const relatedSkillsContainer = document.getElementById('related-skills-container');
const resumeFilenameEl = document.getElementById('resume-filename');
const noInferredSkillsMsg = document.getElementById('no-inferred-skills');
const noConfirmedSkillsMsg = document.querySelector('.skills-overview .no-skills-message');

// --- Initial Data & State ---
const initialResumeName = "John_Doe_Resume_2024.pdf";
const initialInferredSkills = [
    { name: "Regulatory Compliance", snippet: "Inferred from: \"Ensured full regulatory compliance with FAA standards...\"" },
    { name: "Logistics Management", snippet: "Inferred from: \"Oversaw logistics management for cargo operations...\"" }
];
const initialConfirmedSkillsData = [ // Renamed to avoid conflict
    { name: "Aviation Operations", level: "Expert" },
    { name: "Flight Planning", level: "Advanced" },
    { name: "Safety Management Systems", level: "Expert" },
    { name: "Crew Resource Management", level: "Advanced" },
    { name: "Aircraft Maintenance", level: "Intermediate" },
    { name: "International Regulations", level: "Advanced" },
    { name: "Air Traffic Control", level: "Intermediate" },
    { name: "Avionics Systems", level: "Advanced" },
    { name: "Aerodynamics", level: "Advanced" },
    { name: "Meteorology", level: "Intermediate" },
    { name: "Aviation Security", level: "Expert" },
    { name: "Fuel Management", level: "Advanced" },
    { name: "Ground Operations", level: "Expert" }
];

let liveConfirmedSkills = []; // Source of truth for confirmed skills

const proficiencyOrder = ['Expert', 'Advanced', 'Intermediate', 'Beginner'];

const relatedSkillsDb = {
    'Python': ['Pandas', 'NumPy', 'Flask', 'Data Analysis'],
    'Machine Learning': ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning'],
    'Aviation Operations': ['Airspace Management', 'Airline Operations Control', 'Ground Handling Standards'],
    'Flight Planning': ['Route Optimization', 'Fuel Calculation', 'NOTAM Analysis', 'Weather Briefing'],
    'Safety Management Systems': ['Risk Assessment', 'Safety Auditing', 'Incident Investigation', 'Emergency Response Planning'],
    'Crew Resource Management': ['Team Coordination', 'Decision Making Models', 'Communication Protocols'],
    'Aircraft Maintenance': ['Scheduled Maintenance', 'Unscheduled Repairs', 'Aircraft Systems Troubleshooting', 'Maintenance Logging'],
    'International Regulations': ['ICAO Standards', 'EASA Regulations', 'FAA Regulations (International)'],
    'Air Traffic Control': ['Radar Operations', 'Non-Radar Procedures', 'Airspace Classification'],
    'Avionics Systems': ['Navigation Systems', 'Communication Systems', 'Autopilot Systems', 'Glass Cockpit Technology'],
    'Aerodynamics': ['Flight Dynamics', 'Aircraft Performance', 'Stability and Control'],
    'Meteorology': ['Aviation Weather Reports (METAR/TAF)', 'Weather Radar Interpretation', 'Atmospheric Science'],
    'Aviation Security': ['Threat Assessment', 'Screening Procedures', 'Airport Security Protocols'],
    'Fuel Management': ['Fuel Conservation Techniques', 'Refueling Procedures', 'Fuel Tankering Strategy'],
    'Ground Operations': ['Ramp Safety', 'Aircraft Marshalling', 'Baggage Handling Systems', 'Turnaround Management'],
    'Cloud Computing': ['AWS', 'Azure', 'GCP', 'Docker'],
    'Regulatory Compliance': ['FAA Regulations', 'Safety Audits', 'Compliance Training', 'DOT Regulations'],
    'Logistics Management': ['Supply Chain Optimization', 'Inventory Control', 'Warehouse Management', 'Cargo Operations']
};

// --- Resume Update Logic ---
function handleResumeUpdate(event) {
    const file = event.target.files[0];
    if (file) {
        if (resumeFilenameEl) resumeFilenameEl.textContent = file.name;
        inferredSkillsContainer.innerHTML = `
            <div class="text-center w-full p-4 text-indigo-600">
                <i class="fas fa-spinner fa-spin mr-2"></i> Re-analyzing your new resume...
            </div>
        `;
        if (noInferredSkillsMsg) noInferredSkillsMsg.classList.add('hidden');
        setTimeout(() => {
            const newInferred = [
                { name: "Cloud Computing", snippet: `Inferred from: "${file.name}" content related to cloud services.` },
                { name: "Data Visualization", snippet: `Inferred from: "${file.name}" mentions of creating dashboards.` }
            ];
            renderInferredSkills(newInferred);
        }, 2000);
    }
}

// --- Modal Logic ---
function openModal(mode, name = '', level = 'Advanced') {
    if (mode === 'edit') {
        modalTitle.textContent = 'Edit Skill';
        skillNameInput.value = name;
        skillLevelSelect.value = level;
        editSkillNameInput.value = name; // Store original name for editing
    } else {
        modalTitle.textContent = 'Add New Skill';
        skillForm.reset();
        skillLevelSelect.value = 'Advanced'; // Default for new skills
        editSkillNameInput.value = '';
    }
    modal.classList.remove('hidden');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('modal-leave', 'opacity-0', 'scale-95');
    modalContent.classList.add('modal-enter', 'opacity-100', 'scale-100');
}

function closeModal() {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('modal-enter', 'opacity-100', 'scale-100');
    modalContent.classList.add('modal-leave', 'opacity-0', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

// --- Skill Management (Confirmed Skills) ---
function createSkillTagElement(skill) {
    const skillTag = document.createElement('div');
    skillTag.className = 'group relative bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all hover:shadow-lg hover:bg-blue-200';
    skillTag.innerHTML = `
        <span>${skill.name}</span>
        <span class="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">${skill.level}</span>
        <div class="absolute bottom-full w-max left-1/2 -translate-x-1/2 translate-y-0.5 hidden group-hover:flex items-center bg-white border rounded-lg shadow-xl p-1 gap-1 z-10">
            <button onclick="openModal('edit', '${skill.name}', '${skill.level}')" class="tooltip p-2 rounded-md hover:bg-gray-100"><i class="fas fa-pencil-alt text-gray-600"></i><span class="tooltiptext">Edit Skill</span></button>
            <button onclick="alert('Find Learning for ${skill.name}')" class="tooltip p-2 rounded-md hover:bg-gray-100"><i class="fas fa-graduation-cap text-green-600"></i><span class="tooltiptext">Find Learning</span></button>
            <button onclick="alert('Find Projects for ${skill.name}')" class="tooltip p-2 rounded-md hover:bg-gray-100"><i class="fas fa-briefcase text-purple-600"></i><span class="tooltiptext">Find Projects</span></button>
            <button onclick="alert('Request Validation for ${skill.name}')" class="tooltip p-2 rounded-md hover:bg-gray-100"><i class="fas fa-user-check text-orange-600"></i><span class="tooltiptext">Request Validation</span></button>
            <button onclick="deleteSkill('${skill.name}')" class="tooltip p-2 rounded-md hover:bg-gray-100"><i class="fas fa-trash-alt text-red-600"></i><span class="tooltiptext">Delete Skill</span></button>
        </div>
    `;
    return skillTag;
}

function renderAllConfirmedSkills() {
    confirmedSkillsContainer.innerHTML = ''; // Clear current display
    let totalSkillsRendered = 0;

    proficiencyOrder.forEach(level => {
        const skillsInLevel = liveConfirmedSkills.filter(skill => skill.level === level);
        if (skillsInLevel.length > 0) {
            const levelHeader = document.createElement('h4');
            levelHeader.className = 'text-lg font-semibold text-gray-700 mt-6 mb-2 w-full'; // Tailwind classes for header
            levelHeader.textContent = level;
            confirmedSkillsContainer.appendChild(levelHeader);

            const levelSkillsContainer = document.createElement('div');
            levelSkillsContainer.className = 'flex flex-wrap gap-3 mb-4'; // Container for skills of this level
            skillsInLevel.forEach(skill => {
                levelSkillsContainer.appendChild(createSkillTagElement(skill));
                totalSkillsRendered++;
            });
            confirmedSkillsContainer.appendChild(levelSkillsContainer);
        }
    });
    updateNoSkillsMessage(totalSkillsRendered);
    showRelatedSkillsForConfirmed();
}

function addSkill(name, level) {
    if (liveConfirmedSkills.some(skill => skill.name.toLowerCase() === name.toLowerCase())) {
        alert(`Skill "${name}" already exists.`);
        return false;
    }
    liveConfirmedSkills.push({ name, level });
    liveConfirmedSkills.sort((a, b) => a.name.localeCompare(b.name)); // Keep it sorted for consistent display within levels
    renderAllConfirmedSkills();
    return true;
}

function editSkill(originalName, newName, newLevel) {
    const skillIndex = liveConfirmedSkills.findIndex(skill => skill.name === originalName);
    if (skillIndex > -1) {
        // Check if new name conflicts with another existing skill (excluding itself)
        if (newName.toLowerCase() !== originalName.toLowerCase() && liveConfirmedSkills.some(s => s.name.toLowerCase() === newName.toLowerCase())) {
            alert(`Another skill named "${newName}" already exists.`);
            return false;
        }
        liveConfirmedSkills[skillIndex] = { name: newName, level: newLevel };
        renderAllConfirmedSkills();
        return true;
    }
    return false;
}

function deleteSkill(name) {
    liveConfirmedSkills = liveConfirmedSkills.filter(skill => skill.name !== name);
    renderAllConfirmedSkills();
}

skillForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = skillNameInput.value.trim();
    const level = skillLevelSelect.value;
    const originalName = editSkillNameInput.value;

    if (!name) {
        alert("Skill name cannot be empty.");
        return;
    }

    let success = false;
    if (originalName) { // Editing
        success = editSkill(originalName, name, level);
    } else { // Adding
        success = addSkill(name, level);
    }

    if (success) {
        closeModal();
    }
});

// --- Inferred Skills Logic ---
function renderInferredSkills(skillsToRender) {
    inferredSkillsContainer.innerHTML = '';
    if (!skillsToRender || skillsToRender.length === 0) {
        checkInferredSkillsEmpty();
        return;
    }
    skillsToRender.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'inferred-skill-card bg-gray-50 border border-gray-200 rounded-lg p-3 w-full sm:w-auto flex-grow flex flex-col sm:flex-row items-center justify-between gap-3';
        skillCard.innerHTML = `
            <div class="flex items-center">
                <span class="font-semibold text-gray-700">${skill.name}</span>
                <div class="tooltip ml-2">
                     <i class="fas fa-question-circle text-gray-400 cursor-pointer"></i>
                     <span class="tooltiptext">${skill.snippet}</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="rejectSkill(this)" class="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors">Reject</button>
                <button onclick="confirmSkill(this, '${skill.name}')" class="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">Confirm</button>
            </div>
        `;
        inferredSkillsContainer.appendChild(skillCard);
    });
    checkInferredSkillsEmpty();
}

function confirmSkill(button, name) {
    // Add with a default level, user can edit from modal if needed or it's already set
    if (addSkill(name, 'Advanced')) { // Defaulting to Advanced, can be changed
        const card = button.closest('.inferred-skill-card');
        card.style.transition = 'opacity 0.3s, transform 0.3s ease-out';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.remove();
            checkInferredSkillsEmpty();
        }, 300);
    }
}

function rejectSkill(button) {
    const card = button.closest('.inferred-skill-card');
    card.style.transition = 'opacity 0.3s, transform 0.3s ease-out';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
         card.remove();
         checkInferredSkillsEmpty();
    }, 300);
}

function checkInferredSkillsEmpty() {
    if (noInferredSkillsMsg) {
        noInferredSkillsMsg.classList.toggle('hidden', inferredSkillsContainer.children.length > 0);
    }
}

// --- Related Skills Logic ---
function showRelatedSkillsForConfirmed() {
    if (!relatedSkillsContainer) return;
    relatedSkillsContainer.innerHTML = ''; 
    let hasAnyRelated = false;
    const currentConfirmedSkillNames = liveConfirmedSkills.map(s => s.name);

    currentConfirmedSkillNames.forEach(confirmedSkillName => {
        const related = relatedSkillsDb[confirmedSkillName];
        if (related) {
            related.forEach(relatedSkill => {
                if (!currentConfirmedSkillNames.includes(relatedSkill) && !relatedSkillsContainer.querySelector(`button[data-skill-name="${relatedSkill}"]`)) {
                    const suggestionBtn = document.createElement('button');
                    suggestionBtn.className = 'bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full hover:bg-gray-300 transition-colors';
                    suggestionBtn.innerHTML = `<i class="fas fa-plus-circle mr-1"></i> ${relatedSkill}`;
                    suggestionBtn.dataset.skillName = relatedSkill; 
                    suggestionBtn.onclick = () => {
                        if (addSkill(relatedSkill, 'Intermediate')) { // Default to Intermediate for related
                            suggestionBtn.disabled = true;
                            suggestionBtn.classList.add('opacity-50', 'cursor-not-allowed');
                            suggestionBtn.innerHTML = `<i class="fas fa-check-circle mr-1"></i> ${relatedSkill}`;
                            // No need to call showRelatedSkillsForConfirmed() from here, renderAllConfirmedSkills will do it.
                        }
                    };
                    relatedSkillsContainer.appendChild(suggestionBtn);
                    hasAnyRelated = true;
                }
            });
        }
    });

    if (relatedSkillsSection) {
        relatedSkillsSection.classList.toggle('hidden', !hasAnyRelated);
    }
}

function updateNoSkillsMessage(skillCount) {
    if (noConfirmedSkillsMsg) {
        noConfirmedSkillsMsg.classList.toggle('hidden', skillCount > 0);
    }
}

// --- Initial Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    if (resumeFilenameEl) {
        resumeFilenameEl.textContent = initialResumeName;
    }
    
    liveConfirmedSkills = [...initialConfirmedSkillsData]; // Initialize live skills
    liveConfirmedSkills.sort((a, b) => a.name.localeCompare(b.name));


    renderInferredSkills(initialInferredSkills);
    renderAllConfirmedSkills(); // This will also call showRelatedSkills and updateNoSkillsMessage
    checkInferredSkillsEmpty();
});
