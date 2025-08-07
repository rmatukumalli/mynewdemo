// This file previously contained logic for the "Screen Candidates" tab,
// which has now been moved to js/screen-candidates.js and screen-candidates.html.

// If there was any other general logic for skills-hiring.html (not related to the moved tab),
// it would remain here. For now, it's cleared as per the refactoring of the "Screen Candidates" feature.

document.addEventListener('DOMContentLoaded', () => {
    console.log("skills-hiring.js loaded. Screen Candidates logic has been moved.");

    const screenCandidatesButtons = document.querySelectorAll('.screen-candidates-btn'); // These are on skills-hiring.html
    const screenCandidatesTabInIndex = document.querySelector('.admin-tabs .tab-btn[data-tab="skill-intelligence-view"]'); // Tab in index.html

    if (screenCandidatesButtons.length > 0 && screenCandidatesTabInIndex) {
        screenCandidatesButtons.forEach(button => {
            button.addEventListener('click', function() {
                const jobId = this.dataset.jobId;
                const jobTitle = this.closest('.requisition-card')?.querySelector('h4')?.textContent || "Selected Requisition";
                
                // Store the jobId and title where the index.html script can access it
                // (e.g., on a data attribute of the target content div or a global variable)
                const skillIntelligenceViewContent = document.getElementById('skill-intelligence-view');
                if (skillIntelligenceViewContent) {
                    skillIntelligenceViewContent.dataset.selectedJobId = jobId;
                    skillIntelligenceViewContent.dataset.selectedJobTitle = jobTitle.replace('Job Title: ', '');
                } else {
                    // Fallback if the main page structure isn't as expected, use global
                    window.selectedJobIdForScreening = jobId;
                    window.selectedJobTitleForScreening = jobTitle.replace('Job Title: ', '');
                }
                
                // Programmatically click the "Screen Candidates" tab in index.html
                // This relies on the main script to handle the tab switch and the dynamic loader in index.html to pick up the data.
                screenCandidatesTabInIndex.click(); 
            });
        });
    } else {
        if(screenCandidatesButtons.length === 0) console.warn('[skills-hiring.js] No .screen-candidates-btn found on skills-hiring.html page.');
        if(!screenCandidatesTabInIndex) console.warn('[skills-hiring.js] Screen Candidates tab button not found in index.html.');
    }
    
    // Placeholder for any other JS specific to the *remaining* content of skills-hiring.html (if any)
    // For example, if the "Approved Job Requisitions" section itself had other interactive elements not related to screening.
});
