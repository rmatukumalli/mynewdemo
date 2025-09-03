document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const phaseButtons = document.querySelectorAll('.timeline-nav button');
    const phaseContentArea = document.getElementById('phase-content-area');
    const mainTimelineView = document.getElementById('main-timeline-view');
    const tiArchitectureView = document.getElementById('ti-architecture-view');
    const tiArchitectureContentArea = document.getElementById('ti-architecture-view-content'); // Placeholder for architecture content
    const showTiArchitectureButton = document.getElementById('show-ti-architecture'); // This ID will be in future_roadmap.html
    const backToRoadmapButton = document.getElementById('back-to-roadmap'); // This ID will be in talent_intelligence_architecture.html

    // Delta theme colors for JS dynamic styling if needed
    const deltaBlue = '#003268';
    const deltaRed = '#E01D2C';
    const deltaActiveTabBg = '#eef2ff'; // Consistent with original inline style

    async function loadContent(filePath, targetElement) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
            }
            const html = await response.text();
            targetElement.innerHTML = html;
            // Re-attach event listeners if new elements with listeners are loaded
            if (filePath.includes('future_roadmap.html')) {
                const newShowTiButton = document.getElementById('show-ti-architecture');
                if (newShowTiButton) {
                    newShowTiButton.addEventListener('click', switchToArchitectureView);
                }
            }
            if (filePath.includes('talent_intelligence_architecture.html')) {
                 const newBackToRoadmapButton = document.getElementById('back-to-roadmap');
                 if (newBackToRoadmapButton) {
                    newBackToRoadmapButton.addEventListener('click', () => {
                        switchToTimelineView(true); // Pass true to indicate returning to roadmap
                    });
                 }
            }
        } catch (error) {
            console.error('Failed to load content:', error);
            targetElement.innerHTML = `<p class="text-red-500">Error loading content from ${filePath}. Please check the console.</p>`;
        }
    }

    function switchToTimelineView(returningToRoadmap = false) {
        if (tiArchitectureView) tiArchitectureView.classList.remove('active'); // Hide parent architecture view
        if (tiArchitectureContentArea) { // Also hide/deactivate child content area
            tiArchitectureContentArea.classList.remove('active');
            // tiArchitectureContentArea.innerHTML = ''; // Optional: Clear content if you want to ensure it's fresh on next load
        }

        if (mainTimelineView) mainTimelineView.classList.add('active');
        window.scrollTo(0, 0);

        if (returningToRoadmap) {
            // Ensure "Future Roadmap" tab and its content are active
            phaseButtons.forEach(btn => {
                if (btn.dataset.phase === 'phase2') {
                    activateTab(btn, 'evolution/future_roadmap.html');
                } else {
                    deactivateTab(btn);
                }
            });
        } else if (phaseButtons.length > 0 && !document.querySelector('.timeline-nav button.active')) {
            // If no tab is active (e.g., initial load), activate the first one
            activateTab(phaseButtons[0], 'evolution/current_capability.html');
        }
    }

    function switchToArchitectureView() {
        if (mainTimelineView) mainTimelineView.classList.remove('active');
        
        // Ensure any active tab content is deactivated
        if (phaseContentArea) {
            const activePhase = phaseContentArea.querySelector('.content-phase.active');
            if (activePhase) {
                activePhase.classList.remove('active');
            }
        }

        if (tiArchitectureView) {
            tiArchitectureView.classList.add('active'); // Show parent container
            if (tiArchitectureContentArea) { 
                 loadContent('evolution/talent_intelligence_architecture.html', tiArchitectureContentArea)
                    .then(() => {
                        tiArchitectureContentArea.classList.add('active'); // Show child content area
                    })
                    .catch(error => {
                        console.error('Error in switchToArchitectureView after loading content:', error);
                    });
            } else {
                console.error("Element with ID 'ti-architecture-view-content' not found.");
            }
        }
        window.scrollTo(0, 0);
    }

    function deactivateTab(button) {
        button.classList.remove('active');
        button.style.borderColor = 'transparent';
        button.style.backgroundColor = 'transparent';
        button.style.color = getComputedStyle(document.documentElement).getPropertyValue('--delta-gray-dark').trim();
        button.style.fontWeight = '500';
    }

    function activateTab(button, contentFile) {
        phaseButtons.forEach(deactivateTab); // Deactivate all tabs first

        button.classList.add('active');
        button.style.borderColor = deltaRed;
        button.style.backgroundColor = deltaActiveTabBg;
        button.style.color = deltaBlue;
        button.style.fontWeight = '600';

        if (phaseContentArea) {
            loadContent(contentFile, phaseContentArea)
                .then(() => {
                    // After content is loaded, ensure the correct section is active.
                    const loadedSection = phaseContentArea.querySelector('.content-phase');
                    if (loadedSection) {
                        loadedSection.classList.add('active');
                    }
                })
                .catch(error => {
                    console.error('Error in activateTab after loading content:', error);
                });
        } else {
            console.error("Element with ID 'phase-content-area' not found.");
        }
    }

    phaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPhaseId = button.dataset.phase;
            let contentFile = '';
            if (targetPhaseId === 'phase1') {
                contentFile = 'evolution/current_capability.html';
            } else if (targetPhaseId === 'phase2') {
                contentFile = 'evolution/future_roadmap.html';
            }
            
            // Ensure timeline view is active before loading tab content
            if (tiArchitectureView && tiArchitectureView.classList.contains('active')) {
                switchToTimelineView(); // This will also handle initial tab activation if needed
            }
            activateTab(button, contentFile);
        });
    });

    // Initial setup: Activate main timeline view and load the first tab
    if (mainTimelineView) {
        mainTimelineView.classList.add('active');
        if (phaseButtons.length > 0) {
            // Check if a tab is already marked active by a previous state (e.g. back button)
            const activeTab = document.querySelector('.timeline-nav button.active');
            if (activeTab) {
                const targetPhaseId = activeTab.dataset.phase;
                 let contentFile = '';
                if (targetPhaseId === 'phase1') {
                    contentFile = 'evolution/current_capability.html';
                } else if (targetPhaseId === 'phase2') {
                    contentFile = 'evolution/future_roadmap.html';
                }
                activateTab(activeTab, contentFile);
            } else {
                 // Default to first tab if none are active
                activateTab(phaseButtons[0], 'evolution/current_capability.html');
            }
        }
    } else {
        console.error("Element with ID 'main-timeline-view' not found.");
    }
    
    // Event listener for the "Back to Roadmap" button (if it's already in the static HTML part of ti-architecture-view)
    // This is a fallback, primary listener is added after content load.
    if (backToRoadmapButton) {
        backToRoadmapButton.addEventListener('click', () => {
            switchToTimelineView(true); // True indicates we want to ensure "Future Roadmap" is active
        });
    }
});
