document.addEventListener('DOMContentLoaded', () => {
    // API URLs
    const ONTOLOGY_ITEMS_API_URL = '/api/v1/ontology/items'; // New unified endpoint
    const SKILLS_API_URL = '/api/v1/skills'; // For skill-specific operations (delete)
    const BEHAVIORS_API_URL_CRUD = '/api/v1/behaviors'; // For behavior-specific CRUD (delete)
    // URLs for capabilities, competencies, and form-specific behaviors are no longer needed.

    const skillsTableBody = document.querySelector('#skills-ontology-table tbody');
    const searchSkillsInput = document.getElementById('search-skills-input');
    const resetAllFiltersBtn = document.getElementById('reset-all-filters-btn'); // Added this line
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageInfoSpan = document.getElementById('page-info');

    let allSkillsData = [];
    let displayedSkills = [];
    let currentPage = 1;
    let totalPages = 1;
    let itemsPerPage = 10;
    let currentSearchTerm = '';
    let currentSort = { column: null, direction: 'asc' };
    let activeFilters = { capability: '', competency: '', type: '' }; // Changed category to type
    // isEditMode, allCapabilitiesData, allCompetenciesData are no longer needed.

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.message}`);
            }
            return response.json();
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            alert(`Failed to fetch data: ${error.message}`);
            return null;
        }
    }

    // populateSelect, loadCapabilities, loadAllCompetenciesData, loadCompetenciesForSelect are no longer needed.
    // loadBehaviors function was already removed.

    async function fetchAllSkillsFromServer() {
        const url = `${ONTOLOGY_ITEMS_API_URL}?per_page=10000`; // Use new unified endpoint
        const data = await fetchData(url);
        if (data && data.items) { // Data is now under 'items'
            allSkillsData = data.items;
        } else {
            allSkillsData = [];
            skillsTableBody.innerHTML = '<tr><td colspan="7" class="error-message">Error loading items.</td></tr>';
        }
        processAndRenderSkills();
        populateFilterDropdowns();
    }

    function processAndRenderSkills() {
        let itemsToProcess = [...allSkillsData];
        const searchTerm = currentSearchTerm.toLowerCase();

        if (searchTerm) {
            itemsToProcess = itemsToProcess.filter(item =>
                (item.name && item.name.toLowerCase().includes(searchTerm)) ||
                (item.category && item.category.toLowerCase().includes(searchTerm)) ||
                (item.behavior && item.behavior.toLowerCase().includes(searchTerm)) ||
                (item.competency && item.competency.toLowerCase().includes(searchTerm)) ||
                (item.capability && item.capability.toLowerCase().includes(searchTerm)) ||
                (item.description && item.description.toLowerCase().includes(searchTerm))
            );
        }

        // Hierarchical filtering
        if (activeFilters.capability) {
            itemsToProcess = itemsToProcess.filter(item => (item.capability || '').toLowerCase() === activeFilters.capability.toLowerCase());
        }
        if (activeFilters.competency) { // This will only be set if a capability is also set
            itemsToProcess = itemsToProcess.filter(item => (item.competency || '').toLowerCase() === activeFilters.competency.toLowerCase());
        }
        if (activeFilters.type) { // This can be set independently or after capability/competency
            itemsToProcess = itemsToProcess.filter(item => (item.type || '').toLowerCase() === activeFilters.type.toLowerCase());
        }


        if (currentSort.column) {
            itemsToProcess.sort((a, b) => {
                let valA = a[currentSort.column] || '';
                let valB = b[currentSort.column] || '';
                valA = typeof valA === 'string' ? valA.toLowerCase() : valA;
                valB = typeof valB === 'string' ? valB.toLowerCase() : valB;
                if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
                if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        totalPages = Math.ceil(itemsToProcess.length / itemsPerPage) || 1;
        currentPage = Math.min(Math.max(1, currentPage), totalPages);
        const startIndex = (currentPage - 1) * itemsPerPage;
        displayedSkills = itemsToProcess.slice(startIndex, startIndex + itemsPerPage);

        renderSkillsTable();
        updatePaginationControls();
        updateSortIndicators();
    }

    function renderSkillsTable() {
        skillsTableBody.innerHTML = '';
        if (displayedSkills.length === 0) {
            const msg = (currentSearchTerm || activeFilters.capability || activeFilters.competency || activeFilters.type) ? 'No items match your criteria.' : 'No items found.';
            skillsTableBody.innerHTML = `<tr><td colspan="7">${msg}</td></tr>`;
            return;
        }
        displayedSkills.forEach(item => {
            const row = skillsTableBody.insertRow();

            let typeCellContent = 'N/A';
            if (item.type) {
                const typeClass = item.type.toLowerCase() === 'skill' ? 'type-skill' : (item.type.toLowerCase() === 'behavior' ? 'type-behavior' : '');
                if (typeClass) {
                    typeCellContent = `<span class="type-badge ${typeClass}">${item.type}</span>`;
                } else {
                    typeCellContent = item.type; // Fallback if type is neither Skill nor Behavior
                }
            }

            row.innerHTML = `
                <td><span class="item-name">${item.name || 'N/A'}</span></td>
                <td>${item.capability || 'N/A'}</td>
                <td>${item.competency || 'N/A'}</td>
                <td>${typeCellContent}</td>
                <td>${item.description || 'N/A'}</td>
                <td class="actions-cell">
                    <button class="delete-btn" data-original-id="${item.original_id}" data-type="${item.type}" title="Delete ${item.type}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
                </td>
            `;
        });
        addTableButtonListeners();
    }

    function updatePaginationControls() {
        pageInfoSpan.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    function updateSortIndicators() {
        document.querySelectorAll('#skills-ontology-table thead th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
            if (th.dataset.columnKey === currentSort.column) {
                th.classList.add(currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
            }
        });
    }

    function addTableButtonListeners() {
        // Edit buttons and handleEditItem are removed.
        document.querySelectorAll('#skills-ontology-table .delete-btn').forEach(button => {
            button.addEventListener('click', (e) => handleDeleteItem(e.target.dataset.originalId, e.target.dataset.type));
        });
    }

    // resetForm, manageSkillForm submit listener, and handleEditItem are removed as the form is gone.
    // cancelEditBtn listener is also removed.

    async function handleDeleteItem(originalId, itemType) {
        const itemName = allSkillsData.find(item => item.original_id == originalId && item.type === itemType)?.name || 'this item';
        if (!confirm(`Are you sure you want to delete "${itemName}" (${itemType})?`)) return;

        let url;
        if (itemType === 'Skill') {
            url = `${SKILLS_API_URL}/${originalId}`;
        } else if (itemType === 'Behavior') {
            url = `${BEHAVIORS_API_URL_CRUD}/${originalId}`;
        } else {
            alert('Unknown item type for deletion.');
            return;
        }

        try {
            const response = await fetch(url, { method: 'DELETE' });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Delete failed: ${response.statusText}` }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            await fetchAllSkillsFromServer();
            alert(`${itemType} "${itemName}" deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting ${itemType}:`, error);
            alert(`Error deleting ${itemType}: ${error.message}`);
        }
    }

    // createCapabilityBtn, createCompetencyBtn, capabilitySelect, competencySelect event listeners are removed.
    // createBehaviorBtn listener was already removed.

    searchSkillsInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();
        currentPage = 1;
        processAndRenderSkills();
    });

    prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; processAndRenderSkills(); } });
    nextPageBtn.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; processAndRenderSkills(); } });

    function setupEventListeners() {
        document.querySelectorAll('#skills-ontology-table thead th[data-column-key]').forEach(th => {
            th.removeEventListener('click', th._clickHandler);
            th._clickHandler = () => {
                const columnKey = th.dataset.columnKey;
                if (!columnKey) return;
                if (currentSort.column === columnKey) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.column = columnKey;
                    currentSort.direction = 'asc';
                }
                currentPage = 1;
                processAndRenderSkills();
            };
            th.addEventListener('click', th._clickHandler);
        });

        const filterCapabilitySelect = document.getElementById('filter-capability');
        const filterCompetencySelect = document.getElementById('filter-competency');
        const filterTypeSelect = document.getElementById('filter-type'); // New Type filter
        const competencyFilterGroup = document.getElementById('competency-filter-group');
        const typeFilterGroup = document.getElementById('type-filter-group');

        if (filterCapabilitySelect) {
            filterCapabilitySelect.addEventListener('change', (e) => {
                activeFilters.capability = e.target.value;
                activeFilters.competency = ''; // Reset competency
                activeFilters.type = ''; // Optionally reset type, or keep it
                
                filterCompetencySelect.value = '';
                filterTypeSelect.value = ''; // Reset type dropdown

                if (activeFilters.capability) {
                    competencyFilterGroup.style.display = 'flex'; // Show competency filter
                    filterCompetencySelect.disabled = false;
                    typeFilterGroup.style.display = 'flex'; // Show type filter
                    filterTypeSelect.disabled = false; 
                } else {
                    competencyFilterGroup.style.display = 'none';
                    filterCompetencySelect.disabled = true;
                    typeFilterGroup.style.display = 'none';
                    filterTypeSelect.disabled = true;
                }
                currentPage = 1;
                populateFilterDropdowns();
                processAndRenderSkills();
            });
        }

        if (filterCompetencySelect) {
            filterCompetencySelect.addEventListener('change', (e) => {
                activeFilters.competency = e.target.value;
                // activeFilters.type = ''; // Optionally reset type when competency changes
                // filterTypeSelect.value = ''; 
                currentPage = 1;
                processAndRenderSkills();
            });
        }
        
        if (filterTypeSelect) {
            filterTypeSelect.addEventListener('change', (e) => {
                activeFilters.type = e.target.value;
                currentPage = 1;
                processAndRenderSkills();
            });
        }

        if (resetAllFiltersBtn) {
            resetAllFiltersBtn.addEventListener('click', () => {
                activeFilters = { capability: '', competency: '', type: '' };
                currentSearchTerm = '';
                
                if (searchSkillsInput) searchSkillsInput.value = '';
                
                if (filterCapabilitySelect) filterCapabilitySelect.value = '';
                if (filterCompetencySelect) {
                    filterCompetencySelect.value = '';
                    filterCompetencySelect.disabled = true;
                    competencyFilterGroup.style.display = 'none';
                }
                if (filterTypeSelect) {
                    filterTypeSelect.value = '';
                    filterTypeSelect.disabled = true;
                    typeFilterGroup.style.display = 'none';
                }
                
                currentPage = 1;
                populateFilterDropdowns(); 
                processAndRenderSkills();
            });
        }
    }

    function populateFilterDropdowns() {
        const filterCapabilitySelect = document.getElementById('filter-capability');
        const filterCompetencySelect = document.getElementById('filter-competency');
        // const filterTypeSelect = document.getElementById('filter-type'); // Type is static for now

        // Populate Capabilities
        if (filterCapabilitySelect && allSkillsData.length > 0) {
            // Only repopulate if it's empty or during initial load to preserve selection
            if (filterCapabilitySelect.options.length <= 1) { 
                const capabilities = [...new Set(allSkillsData.map(item => item.capability).filter(Boolean))].sort();
                filterCapabilitySelect.innerHTML = '<option value="">All Capabilities</option>'; // Keep this
                capabilities.forEach(cap => populateSelectOption(filterCapabilitySelect, cap, cap));
            }
            filterCapabilitySelect.value = activeFilters.capability;
        }

        // Populate Competencies based on selected Capability
        if (filterCompetencySelect && allSkillsData.length > 0) {
            filterCompetencySelect.innerHTML = '<option value="">All Competencies</option>'; // Start fresh
            if (activeFilters.capability) {
                const competencies = [...new Set(allSkillsData
                    .filter(item => item.capability === activeFilters.capability)
                    .map(item => item.competency)
                    .filter(Boolean))].sort();
                competencies.forEach(comp => populateSelectOption(filterCompetencySelect, comp, comp));
                filterCompetencySelect.disabled = competencies.length === 0;
            } else {
                // If no capability selected, show all competencies but keep it disabled until a capability is chosen
                 const allCompetencies = [...new Set(allSkillsData.map(item => item.competency).filter(Boolean))].sort();
                 allCompetencies.forEach(comp => populateSelectOption(filterCompetencySelect, comp, comp));
                 filterCompetencySelect.disabled = true; // Should be enabled by capability change
            }
            filterCompetencySelect.value = activeFilters.competency;
        }
        
        // Type filter is static, but ensure its disabled state is correct
        const filterTypeSelect = document.getElementById('filter-type');
        if (filterTypeSelect) {
            filterTypeSelect.disabled = !activeFilters.capability; // Enable type filter only if a capability is selected
            filterTypeSelect.value = activeFilters.type;
        }
    }

    function populateSelectOption(selectElement, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        selectElement.appendChild(option);
    }

    async function initializePage() {
        // await loadCapabilities(); // Removed
        // await loadAllCompetenciesData(); // Removed
        await fetchAllSkillsFromServer();
        // resetForm(); // Removed
        setupEventListeners();
        // Tab switching logic removed as there are no tabs.
    }

    initializePage();
});
