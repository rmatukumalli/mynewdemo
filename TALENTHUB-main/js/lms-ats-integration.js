(function() {
    // --- Post New Opportunity Form Logic ---
    const postOpportunityForm = document.getElementById('postNewOpportunityFormInAdmin');
    if (postOpportunityForm) {
        postOpportunityForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(postOpportunityForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Opportunity Posted (LMS-ATS Integration Page):', data);
            if (typeof window.showModal === 'function') {
                window.showModal('Opportunity Posted', `The gig "${data.jobTitle}" has been successfully posted.`, 'check-circle', 'text-green-600');
            } else {
                alert('Opportunity Posted: The gig "' + data.jobTitle + '" has been successfully posted.');
            }
        });

        const clearFormButton = document.getElementById('clearNewOpportunityFormInAdminButton');
        if (clearFormButton) {
            clearFormButton.addEventListener('click', () => {
                postOpportunityForm.reset();
                // Resetting default values (if any specific defaults are needed beyond simple reset)
                document.getElementById('jobTitleAdmin').value = "Senior First Officer (A320 Type Rated)";
                document.getElementById('departmentAdmin').value = "Flight Operations";
                document.getElementById('locationAdmin').value = "Dubai, UAE (Base)";
                document.getElementById('jobTypeAdmin').value = "Contract";
                document.getElementById('jobDescriptionAdmin').value = "Akara Airlines is seeking experienced and qualified Senior First Officers, type-rated on the A320 family, to join our expanding fleet operations based in Dubai. The successful candidate will be responsible for ensuring safe and efficient flight operations in accordance with company policies and regulatory requirements. This role involves flying diverse routes and requires a high degree of professionalism and commitment to safety.";
                document.getElementById('keyResponsibilitiesAdmin').value = "- Assist the Commander in the safe and efficient conduct of the flight.\n- Maintain a high standard of discipline, conduct, and appearance.\n- Perform duties as required by the Commander and company SOPs.\n- Uphold safety standards as the foremost priority.";
                document.getElementById('qualificationsAdmin').value = "- Valid ATPL issued by an ICAO recognized authority.\n- Current A320 Type Rating.\n- Minimum 3000 total flying hours, with at least 1500 hours on A320 family.\n- ELP Level 4 or above.\n- Current Class 1 Medical Certificate.";
                document.getElementById('salaryRangeAdmin').value = "8,000 - 12,000";
                document.getElementById('benefitsAdmin').value = "- Competitive salary package.\n- Accommodation allowance.\n- Medical and life insurance.\n- Annual leave and travel benefits.";
            });
        }
    }

    // --- Candidate Pool Logic ---
    function populateCandidatePoolTable(candidates) {
        const tableBody = document.getElementById('candidatePoolTableBody');
        if (!tableBody) {
            // console.error('Candidate pool table body not found.');
            return;
        }
        tableBody.innerHTML = ''; // Clear existing rows

        if (candidates.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No candidates found.</td></tr>';
            return;
        }
        candidates.forEach(candidate => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${candidate.name}</td>
                <td>${candidate.currentRole}</td>
                <td>${candidate.department}</td>
                <td>${candidate.tenure}</td>
                <td>${Array.isArray(candidate.keySkills) ? candidate.keySkills.join(', ') : ''}</td>
                <td>${candidate.overallMatch}%</td>
                <td>
                    <button class="btn-secondary btn-small" title="View Candidate"><i class="fas fa-eye"></i></button>
                    <button class="btn-primary btn-small" title="Add to List"><i class="fas fa-plus"></i></button>
                </td>
            `;
        });
    }

    function loadAndDisplayCandidatePool() {
        const sampleCandidates = [
            { name: 'Aisha Sharma', currentRole: 'Software Engineer II', department: 'Technology', tenure: '3 years', keySkills: ['Java', 'Spring Boot', 'AWS'], overallMatch: 85 },
            { name: 'Ben Carter', currentRole: 'Marketing Specialist', department: 'Marketing', tenure: '2 years', keySkills: ['SEO', 'Content Creation', 'Google Analytics'], overallMatch: 78 },
            { name: 'Chen Wei', currentRole: 'Data Analyst', department: 'Analytics', tenure: '4 years', keySkills: ['Python', 'SQL', 'Tableau'], overallMatch: 92 },
        ];
        populateCandidatePoolTable(sampleCandidates);
    }

    // --- Onboarding Tab Specific Logic ---
    let initializeOnboardingDefaults = null;
    const onboardingTabElement = document.getElementById('onboarding');

    if (onboardingTabElement) {
        const subTabButtons = onboardingTabElement.querySelectorAll('.onboarding-sub-tabs .sub-tab-btn');
        const subTabContents = onboardingTabElement.querySelectorAll('#onboarding > .sub-tab-content'); // More specific selector

        function setActiveSubTabForOnboarding(targetSubTabId) {
            subTabButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-sub-tab') === targetSubTabId) {
                    btn.classList.add('active');
                }
            });
            subTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetSubTabId) {
                    content.classList.add('active');
                }
            });
        }

        initializeOnboardingDefaults = function() {
            setActiveSubTabForOnboarding('offer-stages');
            // Collapsible sections are open by default due to 'active' class in HTML.
            // JS for toggling them is below.
        };

        subTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetSubTabId = this.getAttribute('data-sub-tab');
                setActiveSubTabForOnboarding(targetSubTabId);
            });
        });

        const collapsibleTriggers = onboardingTabElement.querySelectorAll('.collapsible-trigger');
        collapsibleTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content && content.classList.contains('collapsible-content')) {
                    content.classList.toggle('active');
                }
            });
        });
    }

    // --- Main Admin Tab Switching Logic ---
    const adminTabsContainer = document.querySelector('.admin-tabs');
    if (adminTabsContainer) {
        const mainTabButtons = adminTabsContainer.querySelectorAll('.tab-btn');
        const mainTabContentsContainer = document.getElementById('lms-ats-integration-content');

        mainTabButtons.forEach(button => {
            button.addEventListener('click', function() {
                mainTabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const targetTabId = this.getAttribute('data-tab');

                if (mainTabContentsContainer) {
                    const allMainTabContents = mainTabContentsContainer.querySelectorAll('.tab-content');
                    allMainTabContents.forEach(content => {
                        content.classList.remove('active');
                    });
                }

                const targetContent = document.getElementById(targetTabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Specific actions for certain tabs when they become active
                if (targetTabId === 'candidate-pool') {
                    loadAndDisplayCandidatePool();
                } else if (targetTabId === 'onboarding' && typeof initializeOnboardingDefaults === 'function') {
                    initializeOnboardingDefaults();
                } else if (targetTabId === 'skill-intelligence-view' && typeof window.loadAndInitScreenCandidatesModule === 'function') {
                    // Assuming loadAndInitScreenCandidatesModule is globally available from another script
                    const screenCandidatesContainer = document.getElementById('skill-intelligence-view');
                    if (screenCandidatesContainer && !screenCandidatesContainer.dataset.loaded) {
                        window.loadAndInitScreenCandidatesModule('job-applicants'); // Default sub-tab
                        screenCandidatesContainer.dataset.loaded = "true";
                    }
                }
            });
        });

        // Initial setup on page load for the default active main tab
        const initialActiveMainTabButton = adminTabsContainer.querySelector('.tab-btn.active');
        if (initialActiveMainTabButton) {
            const initialActiveMainTabId = initialActiveMainTabButton.getAttribute('data-tab');
            if (initialActiveMainTabId === 'candidate-pool') {
                loadAndDisplayCandidatePool();
            } else if (initialActiveMainTabId === 'onboarding' && typeof initializeOnboardingDefaults === 'function') {
                // If 'onboarding' is the default active main tab, initialize its defaults
                initializeOnboardingDefaults();
            }
            // Add other initializations if needed, e.g., for 'skill-intelligence-view'
            // The 'post-opportunity' tab is the default in the HTML, so no special JS init needed for it here.
        }
    }
})();
