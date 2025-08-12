// js/learning-hub-filters.js
document.addEventListener('DOMContentLoaded', () => {
    let localAllLearningCourses = [];

    function renderLearningCoursesForHub(coursesToRender, gridElement) {
        if (!gridElement) {
            console.error('Learning courses grid element not found for rendering.');
            return;
        }
        gridElement.innerHTML = ''; // Clear previous content

        if (!coursesToRender || coursesToRender.length === 0) {
            const searchInput = document.getElementById('hubLearningSearchInput');
            const searchTerm = searchInput ? searchInput.value.trim() : "";
            let message = '<p style="text-align: center; padding: 2rem; color: #555;">No learning courses match your current filters.';
            if (searchTerm) {
                message += ` For the search term "<strong>${searchTerm}</strong>".`;
            }
            message += ' Try adjusting your selections or clearing filters.</p>';
            gridElement.innerHTML = message;
            return;
        }

        coursesToRender.forEach(course => {
            const card = document.createElement('div');
            card.className = 'learning-item-card-redesigned'; // New class for redesigned card

            const format = course.format || course.type || '-';
            const domain = course.domain || course.learningCategory || '-';
            const level = course.level || '-';
            const duration = course.durationDisplay || course.duration || '-';
            const goal = course.goal || '-';
            const audience = course.audience || '-';
            const fullDescription = course.description || '';
            const shortDescription = fullDescription ? fullDescription.substring(0, 100) + (fullDescription.length > 100 ? '...' : '') : '';
            
            let ctaButtonHtml = `<a href="#" class="btn-primary start-learning-btn" data-course-id="${course.id}"><i class="fas fa-play-circle"></i> Start Learning</a>`;
            if (format.toLowerCase().includes('classroom') || format.toLowerCase().includes('blended')) {
                ctaButtonHtml = `<a href="#" class="btn-secondary view-schedule-btn" data-course-id="${course.id}"><i class="fas fa-calendar-alt"></i> View Schedule</a>`;
            } else if (format.toLowerCase().includes('interactive') || format.toLowerCase().includes('module')) {
                 ctaButtonHtml = `<a href="#" class="btn-primary start-module-btn" data-course-id="${course.id}"><i class="fas fa-cogs"></i> Launch Module</a>`;
            }

            card.innerHTML = `
                <div class="card-redesigned-header">
                    <i class="fas fa-book-open card-title-icon"></i>
                    <h4 title="${course.title}">${course.title}</h4>
                </div>
                <div class="card-redesigned-body">
                    <div class="card-detail-item">
                        <span class="detail-icon"><i class="fas fa-chalkboard-teacher"></i></span>
                        <span class="detail-label">Format:</span>
                        <span class="detail-value">${format}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="detail-icon"><i class="fas fa-bullseye"></i></span>
                        <span class="detail-label">Goal:</span>
                        <span class="detail-value">${goal}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="detail-icon"><i class="fas fa-users"></i></span>
                        <span class="detail-label">Audience:</span>
                        <span class="detail-value">${audience}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="detail-icon"><i class="fas fa-folder-open"></i></span>
                        <span class="detail-label">Topic/Domain:</span>
                        <span class="detail-value">${domain}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="detail-icon"><i class="fas fa-layer-group"></i></span>
                        <span class="detail-label">Level:</span>
                        <span class="detail-value">${level}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="detail-icon"><i class="fas fa-clock"></i></span>
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${duration}</span>
                    </div>
                    ${shortDescription ? `<p class="card-redesigned-description" title="${fullDescription}">${shortDescription}</p>` : ''}
                </div>
                <div class="card-redesigned-footer">
                    ${ctaButtonHtml}
                    <button class="btn-icon-only btn-tooltip" title="More Info" data-course-id="${course.id}" style="margin-left: 8px; background: #6c757d; color:white; border:none; padding: 5px 8px; border-radius:4px; cursor:pointer;"><i class="fas fa-info-circle"></i></button>
                </div>
            `;
            gridElement.appendChild(card);
        });
    }
    
    function getActiveFilters() {
        const learningHubSection = document.getElementById('learning-hub');
        if (!learningHubSection) return {};

        const activeFilters = {};
        const activeCategoryTabButton = learningHubSection.querySelector('.learning-tabs .tab-btn.active');
        activeFilters.category = activeCategoryTabButton ? activeCategoryTabButton.dataset.tab : 'hub-recommended';

        const filterGroups = learningHubSection.querySelectorAll('.filter-group-section');
        filterGroups.forEach(group => {
            const groupName = group.id.replace('filter-group-', ''); // e.g., 'format', 'goal'
            const activeButton = group.querySelector('.filter-btn.active');
            if (activeButton) {
                activeFilters[groupName] = activeButton.dataset.filterValue;
            } else {
                activeFilters[groupName] = 'all'; // Default to 'all' if no button is active in a group
            }
        });
        return activeFilters;
    }

    function displayActiveFilterChips(activeFilters) {
        const chipsContainer = document.getElementById('active-filters-display');
        const clearAllBtn = document.getElementById('clear-all-filters-btn');
        if (!chipsContainer || !clearAllBtn) return;
        
        const activeFiltersLabel = chipsContainer.querySelector('.active-filters-label') || document.createElement('span');
        activeFiltersLabel.className = 'active-filters-label'; // Ensure class is set
        activeFiltersLabel.innerHTML = '<strong>Active Filters:</strong> '; // Use innerHTML for strong tag

        chipsContainer.innerHTML = ''; // Clear all previous content
        chipsContainer.appendChild(activeFiltersLabel); // Add label first

        let chipTexts = [];
        let hasActiveNonDefaultFilters = false;

        const displayOrder = ['format', 'goal', 'audience', 'domain', 'duration', 'level'];

        displayOrder.forEach(group => {
            if (activeFilters.hasOwnProperty(group)) {
                const value = activeFilters[group];
                if (value && value !== 'all') {
                    hasActiveNonDefaultFilters = true;
                    const buttonText = document.querySelector(`.filter-btn[data-filter-group="${group}"][data-filter-value="${value}"]`)?.textContent || value;
                    let groupDisplayName = group.charAt(0).toUpperCase() + group.slice(1);
                    if (group === 'format') groupDisplayName = 'Format'; 
                    else if (group === 'goal') groupDisplayName = 'Goal';
                    else if (group === 'audience') groupDisplayName = 'Audience';
                    else if (group === 'domain') groupDisplayName = 'Domain';
                    else if (group === 'duration') groupDisplayName = 'Duration';
                    else if (group === 'level') groupDisplayName = 'Level';
                    
                    chipTexts.push(`${groupDisplayName}: ${buttonText}`);
                }
            }
        });

        if (chipTexts.length > 0) {
            const chipsString = chipTexts.join(' | ');
            const textNode = document.createTextNode(chipsString);
            chipsContainer.appendChild(textNode);
        }
        
        chipsContainer.appendChild(clearAllBtn); 
        clearAllBtn.style.display = hasActiveNonDefaultFilters ? 'inline-block' : 'none';
        activeFiltersLabel.style.display = hasActiveNonDefaultFilters ? 'inline' : 'none'; 
    }

    function loadLearningDataForHub() {
        const learningHubSection = document.getElementById('learning-hub');
        if (!learningHubSection) return;

        const displayGrid = document.getElementById('hubLearningDisplayGrid');
        if (!displayGrid) {
            console.error('hubLearningDisplayGrid not found.');
            return;
        }

        const activeFilters = getActiveFilters();
        displayActiveFilterChips(activeFilters); // Update chips display

        let coursesToDisplay = [...localAllLearningCourses]; // Start with a copy

        // 1. Filter by main category (Recommended, Trending, My Learning)
        if (activeFilters.category === 'hub-recommended') {
            coursesToDisplay = coursesToDisplay.filter(course => course.learningCategory === 'recommended' || !course.learningCategory);
        } else if (activeFilters.category === 'hub-trending') {
            coursesToDisplay = coursesToDisplay.filter(course => course.learningCategory === 'trending');
        } else if (activeFilters.category === 'hub-my-learning') {
            coursesToDisplay = coursesToDisplay.filter(course => course.learningCategory === 'my-learning');
             if (coursesToDisplay.length === 0 && Object.values(activeFilters).every(val => val === 'all' || val === 'hub-my-learning')) {
                 displayGrid.innerHTML = '<p style="text-align: center; padding: 2rem;">Your Talent Marketplace learning activities and progress will be shown here.</p>';
                 return;
            }
        }
        
        // 2. Apply advanced filters
        if (activeFilters.format && activeFilters.format !== 'all') {
            coursesToDisplay = coursesToDisplay.filter(course => course.format && course.format.toLowerCase() === activeFilters.format.toLowerCase());
        }
        if (activeFilters.goal && activeFilters.goal !== 'all') {
            coursesToDisplay = coursesToDisplay.filter(course => course.goal && course.goal.toLowerCase() === activeFilters.goal.toLowerCase());
        }
        if (activeFilters.audience && activeFilters.audience !== 'all') {
            coursesToDisplay = coursesToDisplay.filter(course => course.audience && course.audience.toLowerCase() === activeFilters.audience.toLowerCase());
        }
        if (activeFilters.domain && activeFilters.domain !== 'all') {
            coursesToDisplay = coursesToDisplay.filter(course => course.domain && course.domain.toLowerCase() === activeFilters.domain.toLowerCase());
        }
        if (activeFilters.level && activeFilters.level !== 'all') {
            coursesToDisplay = coursesToDisplay.filter(course => course.level && course.level.toLowerCase() === activeFilters.level.toLowerCase());
        }
        if (activeFilters.duration && activeFilters.duration !== 'all') {
            coursesToDisplay = coursesToDisplay.filter(course => {
                if (!course.durationValue) return false; // Assuming durationValue in minutes
                switch (activeFilters.duration) {
                    case 'short': return course.durationValue < 15;
                    case 'medium': return course.durationValue >= 15 && course.durationValue <= 60;
                    case 'long': return course.durationValue > 10080 && course.durationValue <= 20160; // 1-2 weeks (10080min = 1 week, 20160min = 2 weeks)
                    case 'extended': return course.durationValue > 40320; // >4 weeks (approx)
                    default: return true;
                }
            });
        }
        
        // 3. Apply search filter
        const searchInput = document.getElementById('hubLearningSearchInput');
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
        if (searchTerm) {
            coursesToDisplay = coursesToDisplay.filter(course => 
                (course.title && course.title.toLowerCase().includes(searchTerm)) ||
                (course.description && course.description.toLowerCase().includes(searchTerm)) ||
                (course.format && course.format.toLowerCase().includes(searchTerm)) ||
                (course.domain && course.domain.toLowerCase().includes(searchTerm))
            );
        }

        renderLearningCoursesForHub(coursesToDisplay, displayGrid);
    }

    function setupHubLearningSearch() {
        const searchButton = document.getElementById('hubLearningSearchButton');
        const searchInput = document.getElementById('hubLearningSearchInput');

        if (searchButton) {
            searchButton.addEventListener('click', loadLearningDataForHub);
        }
        if (searchInput) {
            searchInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    loadLearningDataForHub();
                }
            });
        }
    }

    function setupLearningHubSubTabs() { 
        const learningHubSection = document.getElementById('learning-hub');
        if (!learningHubSection) return;

        const categoryTabButtons = learningHubSection.querySelectorAll('.learning-tabs .tab-btn');
        categoryTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                categoryTabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                loadLearningDataForHub();
            });
        });

        const advancedFilterButtons = learningHubSection.querySelectorAll('.learning-filters-sidebar .filter-btn'); // Updated selector
        advancedFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const group = this.dataset.filterGroup;
                const groupButtons = learningHubSection.querySelectorAll(`.learning-filters-sidebar .filter-btn[data-filter-group="${group}"]`); // Updated selector
                groupButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                loadLearningDataForHub();
            });
        });

        const clearAllButton = document.getElementById('clear-all-filters-btn');
        if (clearAllButton) {
            clearAllButton.addEventListener('click', function() {
                const allFilterButtonsInGroups = learningHubSection.querySelectorAll('.learning-filters-sidebar .filter-options-container .filter-btn'); // Updated selector
                allFilterButtonsInGroups.forEach(btn => btn.classList.remove('active'));

                const filterGroups = learningHubSection.querySelectorAll('.learning-filters-sidebar .filter-group-section'); // Updated selector
                filterGroups.forEach(group => {
                    const allButtonInGroup = group.querySelector('.filter-btn[data-filter-value="all"]');
                    if (allButtonInGroup) allButtonInGroup.classList.add('active');
                });
                loadLearningDataForHub();
            });
        }

        const collapsibleToggles = learningHubSection.querySelectorAll('.learning-filters-sidebar .collapsible-toggle');
        console.log('[DEBUG] Setting up collapsible filter groups. Found toggles:', collapsibleToggles.length);

        collapsibleToggles.forEach(toggle => {
            const contentToToggle = toggle.nextElementSibling;
            const icon = toggle.querySelector('.toggle-icon');
            const filterGroupName = toggle.textContent.trim().split(':')[0];

            console.log(`[DEBUG] Initializing filter group: "${filterGroupName}"`, toggle);

            if (!contentToToggle || !contentToToggle.classList.contains('collapsible-content')) {
                console.warn(`[DEBUG] Collapsible content not found or invalid for: "${filterGroupName}"`, toggle);
                return; // Skip if structure is not as expected
            }
            console.log(`[DEBUG] Filter group "${filterGroupName}" - Content to toggle:`, contentToToggle);
            console.log(`[DEBUG] Filter group "${filterGroupName}" - Initial HTML structure of options container:`, contentToToggle.innerHTML.trim().substring(0, 200) + '...');


            // Determine intended initial state: if the H4 toggle has 'active' class, it should be open.
            if (toggle.classList.contains('active')) { // Should be OPEN (e.g., Content Format)
                console.log(`[DEBUG] Filter group "${filterGroupName}" is initially active (open).`);
                toggle.classList.add('active');
                contentToToggle.classList.remove('collapsed');
                contentToToggle.style.setProperty('display', 'flex', 'important'); // Use flex as per CSS
                contentToToggle.style.setProperty('max-height', '500px', 'important'); // Override CSS
                contentToToggle.style.setProperty('opacity', '1', 'important'); // Override CSS
                if (icon) icon.textContent = '−';
            } else { // Should be CLOSED
                console.log(`[DEBUG] Filter group "${filterGroupName}" is initially inactive (closed).`);
                toggle.classList.remove('active');
                contentToToggle.classList.add('collapsed');
                contentToToggle.style.setProperty('display', 'none', 'important');
                contentToToggle.style.setProperty('max-height', '0px', 'important');
                contentToToggle.style.setProperty('opacity', '0', 'important');
                if (icon) icon.textContent = '+';
            }

            toggle.addEventListener('click', function() {
                const clickedFilterGroupName = this.textContent.trim().split(':')[0];
                console.log(`[DEBUG] Click event triggered for filter group: "${clickedFilterGroupName}"`);

                this.classList.toggle('active'); // Toggle .active on the H4
                const content = this.nextElementSibling;
                const currentIcon = this.querySelector('.toggle-icon');

                if (content && content.classList.contains('collapsible-content')) {
                    console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - Options container BEFORE toggle:`, content);
                    console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - Options container classes BEFORE toggle: ${content.className}`);
                    console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - Options container display style BEFORE toggle: ${content.style.display}`);
                    console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - Options container HTML structure BEFORE toggle:`, content.innerHTML.trim().substring(0, 200) + '...');

                    content.classList.toggle('collapsed');
                    
                    // 3. Confirm if there is any condition that is blocking or skipping rendering (displaying)
                    // For this specific logic, the main condition is whether 'content' element exists, which is checked above.
                    // We are now proceeding to display/hide it.
                    console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - Attempting to display/hide options.`);

                    if (content.classList.contains('collapsed')) { // If it NOW has collapsed (i.e., it was just closed)
                        console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - State changed to: COLLAPSED (closing).`);
                        if (currentIcon) currentIcon.textContent = '+';
                        content.style.setProperty('display', 'none', 'important');
                        content.style.setProperty('max-height', '0px', 'important');
                        content.style.setProperty('opacity', '0', 'important');
                    } else { // If it NO LONGER has collapsed (i.e., it was just opened)
                        console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - State changed to: EXPANDED (opening).`);
                        if (currentIcon) currentIcon.textContent = '−';
                        content.style.setProperty('display', 'flex', 'important'); // Use flex as per CSS
                        content.style.setProperty('max-height', '500px', 'important');
                        content.style.setProperty('opacity', '1', 'important');
                    }
                    console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - Options container classes AFTER toggle: ${content.className}`);
                    console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - Options container display style AFTER toggle: ${content.style.display}`);
                    console.log(`[DEBUG] Filter group "${clickedFilterGroupName}" - Options container HTML structure AFTER toggle (options should be visible if expanded):`, content.innerHTML.trim().substring(0, 200) + '...');
                } else {
                    console.warn(`[DEBUG] Clicked on "${clickedFilterGroupName}", but its content container was not found or invalid.`, this);
                }
            });
        });
    }

    // Expose an initialization function
    window.initializeLearningHubFilters = function(coursesData) {
        if (coursesData) {
            localAllLearningCourses = coursesData;
        }
        // Initial load of data if the learning hub is visible
        const learningHubSection = document.getElementById('learning-hub');
        if (learningHubSection && (learningHubSection.classList.contains('active') || learningHubSection.style.display === 'block' || getComputedStyle(learningHubSection).display !== 'none' )) {
            loadLearningDataForHub();
        }
        setupHubLearningSearch();
        setupLearningHubSubTabs();
        console.log('Learning Hub Filters Initialized with Advanced Filters.');
    };
});
