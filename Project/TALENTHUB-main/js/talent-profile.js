// JavaScript specific to talent-profile.html

document.addEventListener('DOMContentLoaded', function() {
    // Ensure the main page area is visible and active
    const pageArea = document.getElementById('talent-profile-page-area');
    if (pageArea) {
        pageArea.style.display = 'block';
        pageArea.classList.add('active');
    }

    // Tab switching logic for the Talent Profile page
    const talentHubNavLinks = document.querySelectorAll('#sidebar-talent-profile .my-talent-hub-nav-link');
    const talentHubTabContents = document.querySelectorAll('.my-talent-hub-main-content .my-talent-hub-tab-content');

    function activateTab(activeLink) {
        talentHubNavLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');

        const targetTabId = activeLink.dataset.talenthubTab;
        
        talentHubTabContents.forEach(content => {
            if (content.id === targetTabId) {
                content.classList.add('active');
                content.style.display = 'block'; // Explicitly show
            } else {
                content.classList.remove('active');
                content.style.display = 'none'; // Explicitly hide
            }
        });
    }

    talentHubNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            activateTab(this);
        });
    });

    // Ensure the "Profile Overview" tab is active by default on page load
    const initialActiveProfileLink = document.querySelector('#sidebar-talent-profile .my-talent-hub-nav-link[data-talenthub-tab="th-profile-overview"]');
    if (initialActiveProfileLink) {
        activateTab(initialActiveProfileLink);
    }

    // Potentially load skills dashboard content if #skills-dashboard-content exists
    // and a function like loadSkillsDashboard is available (e.g. from profile.js or a shared script)
    if (document.getElementById('skills-dashboard-content') && typeof loadSkillsDashboard === 'function') {
        // loadSkillsDashboard(); // This function would need to be defined and accessible
    }
});
