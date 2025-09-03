document.addEventListener('DOMContentLoaded', () => {
    const globalConfigForm = document.getElementById('global-config-form');
    const teamConfigsTableBody = document.querySelector('#team-configs-table tbody');
    
    const addTeamConfigButton = document.getElementById('add-team-config-button');
    const teamConfigModal = document.getElementById('team-config-modal');
    const closeModalButton = teamConfigModal.querySelector('.close-button');
    const teamConfigForm = document.getElementById('team-config-form');
    const modalTitle = document.getElementById('modal-title');
    const configIdInput = document.getElementById('config-id');

    // Dummy data - in a real application, this would come from a backend
    let globalSettings = {
        defaultProficiencyScale: "1", // ID referencing a scale
        minimumGapThreshold: 1,
        analysisFrequency: "quarterly"
    };

    let teamConfigs = [
        { id: 1, teamName: 'Engineering', proficiencyScaleId: "1", gapThreshold: 2, keySkillsFocus: 'Java, Kubernetes, AWS' },
        { id: 2, teamName: 'Marketing', proficiencyScaleId: "1", gapThreshold: 1, keySkillsFocus: 'SEO, Content Creation, Social Media Marketing' }
    ];
    
    // Dummy proficiency scales for populating select options
    // In a real app, these would be fetched or available globally
    const proficiencyScales = [
        { id: "1", name: "Standard 5-Level" },
        { id: "2", name: "Leadership 3-Level" },
        { id: "3", name: "Technical Expert Scale" } // Example
    ];

    function populateProficiencyScaleDropdowns() {
        const globalSelect = document.getElementById('default-proficiency-scale');
        const teamSelect = document.getElementById('team-proficiency-scale');

        [globalSelect, teamSelect].forEach(select => {
            if (!select) return;
            select.innerHTML = ''; // Clear existing options
            proficiencyScales.forEach(scale => {
                const option = document.createElement('option');
                option.value = scale.id;
                option.textContent = scale.name;
                select.appendChild(option);
            });
        });
    }


    function loadGlobalSettings() {
        if (!globalConfigForm) return;
        document.getElementById('default-proficiency-scale').value = globalSettings.defaultProficiencyScale;
        document.getElementById('minimum-gap-threshold').value = globalSettings.minimumGapThreshold;
        document.getElementById('analysis-frequency').value = globalSettings.analysisFrequency;
    }

    function saveGlobalSettings(event) {
        event.preventDefault();
        globalSettings.defaultProficiencyScale = document.getElementById('default-proficiency-scale').value;
        globalSettings.minimumGapThreshold = parseInt(document.getElementById('minimum-gap-threshold').value);
        globalSettings.analysisFrequency = document.getElementById('analysis-frequency').value;
        console.log('Global settings saved:', globalSettings);
        alert('Global settings saved successfully!');
        // API call to backend
    }

    function renderTeamConfigsTable() {
        if (!teamConfigsTableBody) return;
        teamConfigsTableBody.innerHTML = ''; // Clear existing rows
        teamConfigs.forEach(config => {
            const scaleName = proficiencyScales.find(s => s.id === config.proficiencyScaleId)?.name || 'N/A';
            const row = teamConfigsTableBody.insertRow();
            row.innerHTML = `
                <td>${config.teamName}</td>
                <td>${scaleName}</td>
                <td>${config.gapThreshold}</td>
                <td>${config.keySkillsFocus || 'N/A'}</td>
                <td>
                    <button class="edit-btn" data-id="${config.id}">Edit</button>
                    <button class="delete-btn" data-id="${config.id}">Delete</button>
                </td>
            `;
        });
        addEventListenersToTableButtons();
    }

    function openTeamConfigModal(config = null) {
        teamConfigForm.reset();
        if (config) {
            modalTitle.textContent = 'Edit Team Configuration';
            configIdInput.value = config.id;
            document.getElementById('team-name').value = config.teamName;
            document.getElementById('team-proficiency-scale').value = config.proficiencyScaleId;
            document.getElementById('team-gap-threshold').value = config.gapThreshold;
            document.getElementById('key-skills-focus').value = config.keySkillsFocus;
        } else {
            modalTitle.textContent = 'Add New Team Configuration';
            configIdInput.value = ''; // Clear ID for new config
        }
        teamConfigModal.style.display = 'block';
    }

    function closeTeamConfigModal() {
        teamConfigModal.style.display = 'none';
    }

    function saveTeamConfig(event) {
        event.preventDefault();
        const id = configIdInput.value ? parseInt(configIdInput.value) : null;
        const teamName = document.getElementById('team-name').value;
        const proficiencyScaleId = document.getElementById('team-proficiency-scale').value;
        const gapThreshold = parseInt(document.getElementById('team-gap-threshold').value);
        const keySkillsFocus = document.getElementById('key-skills-focus').value;

        if (teamName.trim() === '') {
            alert('Team/Department name is required.');
            return;
        }

        if (id) { // Editing existing config
            const index = teamConfigs.findIndex(c => c.id === id);
            if (index > -1) {
                teamConfigs[index] = { ...teamConfigs[index], teamName, proficiencyScaleId, gapThreshold, keySkillsFocus };
            }
        } else { // Adding new config
            const newId = teamConfigs.length > 0 ? Math.max(...teamConfigs.map(c => c.id)) + 1 : 1;
            teamConfigs.push({ id: newId, teamName, proficiencyScaleId, gapThreshold, keySkillsFocus });
        }
        
        renderTeamConfigsTable();
        closeTeamConfigModal();
        console.log('Team configuration saved:', id ? 'updated' : 'added', teamConfigs);
        // API call to backend
    }

    function editTeamConfig(configId) {
        const configToEdit = teamConfigs.find(c => c.id === configId);
        if (configToEdit) {
            openTeamConfigModal(configToEdit);
        }
    }

    function deleteTeamConfig(configId) {
        if (!confirm('Are you sure you want to delete this team configuration?')) {
            return;
        }
        teamConfigs = teamConfigs.filter(c => c.id !== configId);
        renderTeamConfigsTable();
        console.log('Team configuration deleted, ID:', configId);
        // API call to backend
    }
    
    function addEventListenersToTableButtons() {
        document.querySelectorAll('#team-configs-table .edit-btn').forEach(button => {
            button.addEventListener('click', (e) => editTeamConfig(parseInt(e.target.dataset.id)));
        });
        document.querySelectorAll('#team-configs-table .delete-btn').forEach(button => {
            button.addEventListener('click', (e) => deleteTeamConfig(parseInt(e.target.dataset.id)));
        });
    }

    // Initial setup
    populateProficiencyScaleDropdowns(); // Populate dropdowns first
    loadGlobalSettings(); // Then load settings that might use these dropdowns
    renderTeamConfigsTable();

    if (globalConfigForm) {
        globalConfigForm.addEventListener('submit', saveGlobalSettings);
    }
    if (addTeamConfigButton) {
        addTeamConfigButton.addEventListener('click', () => openTeamConfigModal());
    }
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeTeamConfigModal);
    }
    if (teamConfigForm) {
        teamConfigForm.addEventListener('submit', saveTeamConfig);
    }
    
    window.addEventListener('click', (event) => { // Close modal if clicked outside
        if (event.target === teamConfigModal) {
            closeTeamConfigModal();
        }
    });

    // Logout functionality
    const logoutButton = document.getElementById('admin-logout-button');
    if (logoutButton) {
        // admin-auth.js should already handle the click event for logout
    }
});
