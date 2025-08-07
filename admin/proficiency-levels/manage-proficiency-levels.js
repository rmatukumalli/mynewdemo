document.addEventListener('DOMContentLoaded', () => {
    const addScaleForm = document.getElementById('add-scale-form');
    const scalesTableBody = document.querySelector('#proficiency-scales-table tbody');
    const levelsContainer = document.getElementById('levels-container');
    const addLevelButton = document.getElementById('add-level-button');

    // Modal elements
    const viewLevelsModal = document.getElementById('view-levels-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const modalScaleNameEl = document.getElementById('modal-scale-name');
    const modalTabsContainer = document.getElementById('modal-tabs-container');
    const modalTabContentContainer = document.getElementById('modal-tab-content-container');


    // Dummy data - in a real application, this would come from a backend
    let currentEditScaleId = null; // To track if we are editing
    let proficiencyScales = [
        { 
            id: 1, 
            name: 'Standard 5-Level', 
            description: 'General proficiency scale for most skills.', 
            levels: [
                { name: 'Novice', description: 'Basic understanding, requires supervision.' },
                { name: 'Beginner', description: 'Can perform basic tasks with guidance.' },
                { name: 'Intermediate', description: 'Works independently on most tasks.' },
                { name: 'Advanced', description: 'Can lead projects and mentor others.' },
                { name: 'Expert', description: 'Recognized authority, innovates and strategizes.' }
            ] 
        },
        { 
            id: 2, 
            name: 'Leadership 3-Level', 
            description: 'Simplified scale for leadership competencies.', 
            levels: [
                { name: 'Developing Leader', description: 'Learning leadership fundamentals.' },
                { name: 'Effective Leader', description: 'Successfully leads teams and initiatives.' },
                { name: 'Strategic Leader', description: 'Shapes organizational direction and culture.' }
            ] 
        },
        {
            id: 3,
            name: 'Standard White-Collar 5-Level',
            description: 'A comprehensive 5-level proficiency scale for common white-collar job skills.',
            levels: [
                { name: 'Foundational', description: 'Possesses basic knowledge and understanding of fundamental concepts. Requires direct supervision and guidance for tasks.' },
                { name: 'Developing', description: 'Can apply learned skills to routine tasks with some supervision. Beginning to build practical experience.' },
                { name: 'Proficient', description: 'Works independently on most standard tasks and can solve common problems. Consistently meets performance expectations.' },
                { name: 'Advanced', description: 'Handles complex tasks and projects with minimal guidance. Can mentor others and contribute to process improvements.' },
                { name: 'Expert', description: 'Demonstrates mastery of the skill. Leads strategic initiatives, innovates, and is recognized as a go-to resource or thought leader.' }
            ]
        }
    ];

    function renderScalesTable() {
        if (!scalesTableBody) return;
        scalesTableBody.innerHTML = ''; // Clear existing rows
        proficiencyScales.forEach(scale => {
            const row = scalesTableBody.insertRow();
            row.innerHTML = `
                <td>${scale.name}</td>
                <td>${scale.description}</td>
                <td>${scale.levels.length}</td>
                <td>
                    <button class="edit-btn" data-id="${scale.id}">Edit</button>
                    <button class="delete-btn" data-id="${scale.id}">Delete</button>
                    <button class="view-levels-btn" data-id="${scale.id}">View Levels</button>
                </td>
            `;
        });
        addEventListenersToTableButtons();
    }

    function addNewLevelInput() {
        const levelCount = levelsContainer.querySelectorAll('.level-input-group').length + 1;
        const newLevelGroup = document.createElement('div');
        newLevelGroup.classList.add('level-input-group');
        newLevelGroup.innerHTML = `
            <input type="text" name="level_name[]" placeholder="Level ${levelCount} Name" required>
            <textarea name="level_description[]" placeholder="Level ${levelCount} Description" required></textarea>
            <button type="button" class="remove-level-btn">Remove Level</button>
        `;
        levelsContainer.appendChild(newLevelGroup);
        newLevelGroup.querySelector('.remove-level-btn').addEventListener('click', function() {
            this.parentElement.remove();
            // Re-number placeholders if needed, though not strictly necessary for functionality
        });
    }

    function handleAddScaleFormSubmit(event) {
        event.preventDefault();
        const scaleName = document.getElementById('scale-name').value;
        const scaleDescription = document.getElementById('scale-description').value;
        
        const levelNameInputs = document.querySelectorAll('input[name="level_name[]"]');
        const levelDescriptionInputs = document.querySelectorAll('textarea[name="level_description[]"]');
        
        if (scaleName.trim() === '') {
            alert('Scale name is required.');
            return;
        }
        if (levelNameInputs.length === 0) {
            alert('At least one proficiency level is required.');
            return;
        }

        const levels = [];
        for (let i = 0; i < levelNameInputs.length; i++) {
            const name = levelNameInputs[i].value.trim();
            const description = levelDescriptionInputs[i].value.trim();
            if (name === '' || description === '') {
                alert('All level names and descriptions are required.');
                return;
            }
            levels.push({ name, description });
        }

        if (currentEditScaleId !== null) {
            // Update existing scale
            const scaleToUpdate = proficiencyScales.find(scale => scale.id === currentEditScaleId);
            if (scaleToUpdate) {
                scaleToUpdate.name = scaleName;
                scaleToUpdate.description = scaleDescription;
                scaleToUpdate.levels = levels;
                console.log('Proficiency Scale updated:', scaleToUpdate);
            }
        } else {
            // Add new scale
            const newScale = {
                id: proficiencyScales.length > 0 ? Math.max(...proficiencyScales.map(s => s.id)) + 1 : 1,
                name: scaleName,
                description: scaleDescription,
                levels: levels
            };
            proficiencyScales.push(newScale);
            console.log('Proficiency Scale added:', newScale);
        }

        renderScalesTable();
        resetForm(); // Resets form, currentEditScaleId, and button text
        // API call to backend would happen here
    }

    function resetForm() {
        addScaleForm.reset();
        levelsContainer.innerHTML = `
            <h3>Levels (e.g., Beginner, Intermediate, Advanced)</h3>
            <div class="level-input-group">
                <input type="text" name="level_name[]" placeholder="Level 1 Name (e.g., Novice)" required>
                <textarea name="level_description[]" placeholder="Level 1 Description" required></textarea>
            </div>`;
        // Ensure the first level group does not have a remove button after reset
        const firstLevelGroup = levelsContainer.querySelector('.level-input-group');
        if (firstLevelGroup) {
            const existingRemoveBtn = firstLevelGroup.querySelector('.remove-level-btn');
            if (existingRemoveBtn) {
                existingRemoveBtn.remove();
            }
        }
        addScaleForm.querySelector('button[type="submit"]').textContent = 'Save Scale';
        currentEditScaleId = null;
    }

    function editScale(scaleId) {
        const scaleToEdit = proficiencyScales.find(scale => scale.id === scaleId);
        if (!scaleToEdit) return;

        currentEditScaleId = scaleId; // Set the ID for update logic

        document.getElementById('scale-name').value = scaleToEdit.name;
        document.getElementById('scale-description').value = scaleToEdit.description;

        levelsContainer.innerHTML = '<h3>Levels</h3>'; // Clear existing level inputs but keep heading

        scaleToEdit.levels.forEach((level, index) => {
            const levelCount = index + 1;
            const newLevelGroup = document.createElement('div');
            newLevelGroup.classList.add('level-input-group');
            newLevelGroup.innerHTML = `
                <input type="text" name="level_name[]" placeholder="Level ${levelCount} Name" value="${level.name}" required>
                <textarea name="level_description[]" placeholder="Level ${levelCount} Description" required>${level.description}</textarea>
                ${index > 0 ? '<button type="button" class="remove-level-btn">Remove Level</button>' : ''}
            `; // Only add remove button if not the first level
            levelsContainer.appendChild(newLevelGroup);
            if (index > 0) {
                 newLevelGroup.querySelector('.remove-level-btn').addEventListener('click', function() {
                    this.parentElement.remove();
                });
            }
        });
        
        // If there are no levels somehow (should not happen for valid scales), add one empty input
        if (scaleToEdit.levels.length === 0) {
             // Call addNewLevelInput to add a fresh input group, which also handles remove button logic correctly
            addNewLevelInput(); // This will add one level input group
            // Since addNewLevelInput adds a remove button by default, remove it if it's the only level
            if (levelsContainer.querySelectorAll('.level-input-group').length === 1) {
                const firstGroup = levelsContainer.querySelector('.level-input-group .remove-level-btn');
                if (firstGroup) firstGroup.remove();
            }
        }


        addScaleForm.querySelector('button[type="submit"]').textContent = 'Update Scale';
        addScaleForm.scrollIntoView({ behavior: 'smooth' });
    }

    function deleteScale(scaleId) {
        if (!confirm('Are you sure you want to delete this proficiency scale? This action cannot be undone.')) {
            return;
        }
        proficiencyScales = proficiencyScales.filter(scale => scale.id !== scaleId);
        renderScalesTable();
        console.log('Proficiency Scale deleted, ID:', scaleId);
        // API call to backend
    }

    function viewLevels(scaleId) {
        const scale = proficiencyScales.find(s => s.id === scaleId);
        if (!scale || !viewLevelsModal) return;

        modalScaleNameEl.textContent = scale.name;
        modalTabsContainer.innerHTML = ''; // Clear previous tabs
        modalTabContentContainer.innerHTML = ''; // Clear previous content

        scale.levels.forEach((level, index) => {
            // Create tab button
            const tabButton = document.createElement('button');
            tabButton.classList.add('modal-tab-button');
            tabButton.textContent = level.name;
            tabButton.dataset.tabId = `level-tab-${index}`;
            
            // Create tab content pane
            const tabContent = document.createElement('div');
            tabContent.classList.add('modal-tab-content');
            tabContent.id = `level-tab-${index}`;
            tabContent.innerHTML = `<p><strong>${level.name}:</strong> ${level.description}</p>`;

            modalTabsContainer.appendChild(tabButton);
            modalTabContentContainer.appendChild(tabContent);

            if (index === 0) { // Make first tab active by default
                tabButton.classList.add('active');
                tabContent.classList.add('active');
            }

            // Add event listener for tab switching
            tabButton.addEventListener('click', () => {
                // Deactivate all tabs and content
                modalTabsContainer.querySelectorAll('.modal-tab-button').forEach(btn => btn.classList.remove('active'));
                modalTabContentContainer.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));
                
                // Activate clicked tab and its content
                tabButton.classList.add('active');
                document.getElementById(tabButton.dataset.tabId).classList.add('active');
            });
        });

        viewLevelsModal.style.display = 'block';
    }

    // Modal close functionality
    if (closeModalBtn) {
        closeModalBtn.onclick = function() {
            if (viewLevelsModal) viewLevelsModal.style.display = "none";
        }
    }
    // Close modal if user clicks outside of it
    window.onclick = function(event) {
        if (event.target == viewLevelsModal) {
            if (viewLevelsModal) viewLevelsModal.style.display = "none";
        }
    }

    function addEventListenersToTableButtons() {
        document.querySelectorAll('#proficiency-scales-table .edit-btn').forEach(button => {
            button.addEventListener('click', (e) => editScale(parseInt(e.target.dataset.id)));
        });
        document.querySelectorAll('#proficiency-scales-table .delete-btn').forEach(button => {
            button.addEventListener('click', (e) => deleteScale(parseInt(e.target.dataset.id)));
        });
        document.querySelectorAll('#proficiency-scales-table .view-levels-btn').forEach(button => {
            button.addEventListener('click', (e) => viewLevels(parseInt(e.target.dataset.id)));
        });
    }

    // Initial setup
    if (addScaleForm) {
        addScaleForm.addEventListener('submit', handleAddScaleFormSubmit);
    }
    if (addLevelButton) {
        addLevelButton.addEventListener('click', addNewLevelInput);
    }
    if (scalesTableBody) {
        renderScalesTable();
    } else {
        console.error("Proficiency scales table body not found.");
    }

    // Logout functionality
    const logoutButton = document.getElementById('admin-logout-button');
    if (logoutButton) {
        // admin-auth.js should already handle the click event for logout
    }
});
