// JavaScript specific to learning-platform.html

document.addEventListener('DOMContentLoaded', function() {
    // Ensure the main page area is visible and active
    const pageArea = document.getElementById('learning-platform-page-area');
    if (pageArea) {
        pageArea.style.display = 'block';
        pageArea.classList.add('active');
    }

    // Tab switching logic for the Learning Platform page
    // but scoped to this page.

    const talentHubNavLinks = document.querySelectorAll('#sidebar-learning-platform .my-talent-hub-nav-link');
    const talentHubTabContents = document.querySelectorAll('.my-talent-hub-main-content .my-talent-hub-tab-content');
    const contentTabBtns = document.querySelectorAll('.my-talent-hub-content-tabs .content-tab-btn');
    const contentPanes = document.querySelectorAll('.my-talent-hub-content-display .content-pane');

    function activateTab(tabLinks, tabContents, activeLink, dataAttribute) {
        tabLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');

        const targetTabId = activeLink.dataset[dataAttribute];
        
        tabContents.forEach(content => {
            if (content.id === targetTabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    talentHubNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            activateTab(talentHubNavLinks, talentHubTabContents, this, 'talenthubTab');
            // If the 'Home' tab is clicked, also ensure its default sub-tab is active
            if (this.dataset.talenthubTab === 'th-home') {
                const defaultHomeSubTab = document.querySelector('.my-talent-hub-content-tabs .content-tab-btn[data-th-content-tab="role"]');
                if (defaultHomeSubTab) {
                     activateTab(contentTabBtns, contentPanes, defaultHomeSubTab, 'thContentTab');
                }
            }
        });
    });

    contentTabBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            activateTab(contentTabBtns, contentPanes, this, 'thContentTab');
        });
    });

    // Ensure the "Home" tab and its "Role" sub-tab are active by default on page load
    const initialActiveSidebarLink = document.querySelector('#sidebar-learning-platform .my-talent-hub-nav-link[data-talenthub-tab="th-home"]');
    if (initialActiveSidebarLink) {
        activateTab(talentHubNavLinks, talentHubTabContents, initialActiveSidebarLink, 'talenthubTab');
        const initialActiveContentTab = document.querySelector('.my-talent-hub-content-tabs .content-tab-btn[data-th-content-tab="role"]');
        if (initialActiveContentTab) {
            activateTab(contentTabBtns, contentPanes, initialActiveContentTab, 'thContentTab');
        }
    }
    
    // Initialize Learning Hub Filters if the learning-hub content is part of this page
    // and if the filter script is loaded and function is available.
    if (typeof initializeLearningHubFilters === 'function' && document.getElementById('learning-hub')) {
        initializeLearningHubFilters();
    }

});
