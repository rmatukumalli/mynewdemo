function initializeTabs() {
    console.log('initializeTabs called.');
    const tabContainer = document.querySelector('.tabs-container'); // This is for panels
    const tabNav = document.querySelector('.tabs-nav'); // This is for buttons

    console.log('tabContainer:', tabContainer);
    console.log('tabNav:', tabNav);

    // Check if elements exist, especially for dynamic scenarios
    if (!tabContainer || !tabNav) {
        console.warn('Tabs container or tabs navigation not found. Tab functionality will not be initialized (or re-initialized).');
        return;
    }
    
    // Button cloning removed. Event delegation will be used.

    // Function to switch tabs - modified to accept current nav and container
    function switchTab(targetTabId, currentTabNav, currentTabContainer) {
        // Query for panels and buttons within the provided container and nav
        const allTabPanels = currentTabContainer.querySelectorAll('.tab-panel');
        const allTabButtons = currentTabNav.querySelectorAll('.tabs-nav-button');

        if (allTabButtons.length === 0 || allTabPanels.length === 0) {
            console.warn('No tab buttons or panels found within current context for switchTab.');
            return;
        }
        
        console.log(`switchTab called for: ${targetTabId}`);
        allTabPanels.forEach(panel => {
            if (panel.id === targetTabId) {
                panel.classList.add('active');
                panel.removeAttribute('hidden');
            } else {
                panel.classList.remove('active');
                panel.setAttribute('hidden', 'true');
            }
        });

        allTabButtons.forEach(button => {
            if (button.getAttribute('data-tab-target') === `#${targetTabId}`) {
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            }
        });
    }

    // Event delegation for click events on tab buttons
    // A guard to prevent attaching multiple listeners if initializeTabs is called more than once.
    if (!tabNav.dataset.tabListenersAttached) {
        tabNav.addEventListener('click', function(event) {
            const button = event.target.closest('.tabs-nav-button');
            if (button) {
                console.log(`Tab button clicked (delegated):`, button);
                console.log(`Targeting: ${button.getAttribute('data-tab-target')}`);
                const targetTabId = button.getAttribute('data-tab-target').substring(1); // Remove #
                // Pass tabNav (this refers to tabNav due to function context) and tabContainer (scoped from initializeTabs)
                switchTab(targetTabId, tabNav, tabContainer); 
            }
        });

        // Event delegation for keydown events on tab buttons
        tabNav.addEventListener('keydown', function(event) {
            const button = event.target.closest('.tabs-nav-button');
            if (button && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault(); // Prevent default space scroll
                console.log(`Tab button keydown (delegated): ${button.id}, targeting: ${button.getAttribute('data-tab-target')}`);
                const targetTabId = button.getAttribute('data-tab-target').substring(1);
                // Pass tabNav (this refers to tabNav due to function context) and tabContainer (scoped from initializeTabs)
                switchTab(targetTabId, tabNav, tabContainer);
            }
        });
        tabNav.dataset.tabListenersAttached = 'true'; // Mark that listeners have been attached
    }
    
    // Activate the first tab by default if none are explicitly set to active
    // and ensure its panel is visible.
    // Re-query tabButtons for initial activation logic, as they might have been replaced or are new.
    const tabButtons = tabNav.querySelectorAll('.tabs-nav-button'); 

    if (tabButtons.length > 0) { // Check if there are any buttons to activate
        const activeTabButton = tabNav.querySelector('.tabs-nav-button.active');
        if (activeTabButton) {
            const initialTabId = activeTabButton.getAttribute('data-tab-target').substring(1);
            switchTab(initialTabId, tabNav, tabContainer); // Ensure panel visibility matches button
        } else {
            // If no tab is active, activate the first one
            const firstTabId = tabButtons[0].getAttribute('data-tab-target').substring(1);
            switchTab(firstTabId, tabNav, tabContainer);
        }
    } else {
        console.warn('No tab buttons found for initial activation.');
    }
    
    console.log('Tabs initialized/re-initialized.');
}

// Expose the function to the global scope so it can be called from other scripts
window.initializeTabs = initializeTabs;

// Initialize tabs on initial DOM load as well
document.addEventListener('DOMContentLoaded', function () {
    initializeTabs();
});
