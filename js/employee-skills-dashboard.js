document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const employeeNameElement = document.getElementById('employee-name');
    const employeeRoleElement = document.getElementById('employee-role');
    const employeeProfilePicElement = document.getElementById('employee-profile-pic');
    const selfRatedSkillsCountElement = document.getElementById('self-rated-skills-count');
    const teamRatedSkillsCountElement = document.getElementById('team-rated-skills-count');

    const trendingRoleElement = document.getElementById('trending-role');
    const trendingLocationElement = document.getElementById('trending-location');
    const trendingSkillsListElement = document.getElementById('trending-skills-list');
    const disappearingSkillsListElement = document.getElementById('disappearing-skills-list');
    const constantSkillsListElement = document.getElementById('constant-skills-list');
    const emergingSkillsListElement = document.getElementById('emerging-skills-list');

    // New DOM Elements for additional info sections
    const missingSkillsListElement = document.getElementById('missing-skills-list');
    const upskillPotentialTextElement = document.getElementById('upskill-potential-text');
    const learningPathCtaBtnElement = document.getElementById('learning-path-cta-btn');
    const learningPathCtaTextElement = document.getElementById('learning-path-cta-text');
    const internalSignalsInterestElement = document.getElementById('internal-signals-interest');
    const internalSignalsPastAppsElement = document.getElementById('internal-signals-past-apps');
    const recentApplicationsListElement = document.getElementById('recent-applications-list');

    // Tab navigation is removed, so these are no longer needed for that purpose
    // const tabLinks = document.querySelectorAll('.tab-link');
    // const tabContents = document.querySelectorAll('.tab-content');

    const exploreCareerPathBtn = document.getElementById('explore-career-path-btn');
    const findTrainingBtn = document.getElementById('find-training-btn');

    // Generic trending skills data (remains hardcoded as per plan)
    const genericTrendingSkillsData = [
        { name: "Advanced JavaScript", category: "technical" },
        { name: "Cloud Computing (AWS)", category: "technical" },
        { name: "Agile Methodologies", category: "functional" },
        { name: "Communication", category: "soft" },
        { name: "Problem Solving", category: "soft" },
        { name: "Python for Data Science", category: "technical" },
        { name: "Project Management", category: "functional" },
        { name: "Team Leadership", category: "soft" },
        { name: "DevOps Practices", category: "technical" },
        { name: "Cybersecurity Fundamentals", category: "technical" }
    ];

    function populateGenericTrendingSkills() {
        if (!trendingSkillsListElement) return;
        trendingSkillsListElement.innerHTML = ''; // Clear existing sample skills

        genericTrendingSkillsData.forEach(skill => {
            const listItem = document.createElement('li');
            
            const skillNameSpan = document.createElement('span');
            skillNameSpan.textContent = skill.name;
            
            const badgeSpan = document.createElement('span');
            badgeSpan.classList.add('badge', skill.category.toLowerCase().replace(/\s+/g, '-'));
            badgeSpan.textContent = skill.category;
            
            listItem.appendChild(skillNameSpan);
            listItem.appendChild(badgeSpan);
            trendingSkillsListElement.appendChild(listItem);
        });
    }

    function populateSkillTrendList(listElement, skillsArray) {
        if (!listElement) return;
        if (!skillsArray || skillsArray.length === 0) {
            listElement.innerHTML = '<li>No data available for this category.</li>';
            return;
        }
        listElement.innerHTML = ''; // Clear existing items

        skillsArray.forEach(skill => {
            const listItem = document.createElement('li');
            
            const skillNameSpan = document.createElement('span');
            skillNameSpan.textContent = skill.name;
            
            const changeSpan = document.createElement('span');
            changeSpan.classList.add('skill-trend-change');
            changeSpan.textContent = skill.change;

            if (skill.change.startsWith('+')) {
                changeSpan.classList.add('positive-trend');
            } else if (skill.change.startsWith('-')) {
                changeSpan.classList.add('negative-trend');
            } else {
                changeSpan.classList.add('neutral-trend');
            }
            
            listItem.appendChild(skillNameSpan);
            listItem.appendChild(changeSpan);

            // Add "Find learning courses" button for constant and emerging skills
            if (listElement === constantSkillsListElement || listElement === emergingSkillsListElement) {
                const findCoursesButton = document.createElement('button');
                findCoursesButton.classList.add('skill-action-button');
                findCoursesButton.innerHTML = '<i class="fas fa-search-plus"></i>'; // Using a search/detail icon
                findCoursesButton.title = `Find courses for ${skill.name}`;
                findCoursesButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent any parent li click handlers if added later
                    // Redirect to My Talent Hub, learning platform tab, with the skill
                    const baseUrl = '/index.html';
                    const params = new URLSearchParams({
                        skill: skill.name,
                        targetMthTab: 'learning-platform'
                    });
                    window.location.href = `${baseUrl}?${params.toString()}#my-talent-hub`;
                });
                listItem.appendChild(findCoursesButton);
            }
            
            listElement.appendChild(listItem);
        });
    }

    async function initializeEmployeeDashboard() {
        try {
            const response = await fetch('/data/sample-data.json'); // Changed to absolute path
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const appData = await response.json();
            const employeeIdToDisplay = 'john.doe'; // Target John Doe's data
            const employee = appData.platformCandidates.find(emp => emp.id === employeeIdToDisplay);

            if (employee) {
                // Populate Employee Summary
                if (employeeNameElement) employeeNameElement.textContent = employee.name;
                if (employeeRoleElement) employeeRoleElement.textContent = employee.role;
                if (employeeProfilePicElement) {
                    employeeProfilePicElement.src = employee.imageUrl || 'images/default-profile.png';
                    employeeProfilePicElement.alt = `${employee.name}'s Profile Picture`;
                }
                if (selfRatedSkillsCountElement) {
                    selfRatedSkillsCountElement.textContent = employee.skills ? employee.skills.length : 0;
                }
                if (teamRatedSkillsCountElement) {
                    // Assuming teamRatedSkills is not directly available for John Allen, set to 0 or placeholder
                    teamRatedSkillsCountElement.textContent = employee.teamRatedSkills || 0; 
                }

                // Update title for generic trending skills section
                if (trendingRoleElement) trendingRoleElement.textContent = employee.role;
                if (trendingLocationElement) trendingLocationElement.textContent = employee.location || "Corporate"; // Use employee location or a default

                // Populate Disappearing, Constant, Emerging skills
                if (employee.skillTrends) {
                    populateSkillTrendList(disappearingSkillsListElement, employee.skillTrends.disappearing);
                    populateSkillTrendList(constantSkillsListElement, employee.skillTrends.constant);
                    populateSkillTrendList(emergingSkillsListElement, employee.skillTrends.emerging);
                } else {
                    const noDataMsg = '<li>Skill trend data not available.</li>';
                    if (disappearingSkillsListElement) disappearingSkillsListElement.innerHTML = noDataMsg;
                    if (constantSkillsListElement) constantSkillsListElement.innerHTML = noDataMsg;
                    if (emergingSkillsListElement) emergingSkillsListElement.innerHTML = noDataMsg;
                }

                // Populate Skill Development Focus
                if (missingSkillsListElement && employee.missingSkills) {
                    missingSkillsListElement.innerHTML = '';
                    if (employee.missingSkills.length > 0) {
                        employee.missingSkills.forEach(skill => {
                            const li = document.createElement('li');
                            li.textContent = `${skill.name} (Severity: ${skill.severity})`;
                            missingSkillsListElement.appendChild(li);
                        });
                    } else {
                        missingSkillsListElement.innerHTML = '<li>No specific missing skills identified.</li>';
                    }
                }
                if (upskillPotentialTextElement) {
                    upskillPotentialTextElement.textContent = employee.upskillPotential || 'N/A';
                }
                if (learningPathCtaBtnElement && learningPathCtaTextElement && employee.learningPathCTA) {
                    learningPathCtaTextElement.textContent = employee.learningPathCTA;
                    learningPathCtaBtnElement.style.display = 'inline-flex';
                    learningPathCtaBtnElement.onclick = () => { // Simple click handler for demo
                        alert(`Action: ${employee.learningPathCTA}`);
                        // Potentially redirect to a learning platform or trigger a workflow
                        // Example: window.location.href = `/index.html#my-talent-hub&openLearningPathFor=${encodeURIComponent(employee.name)}`;
                    };
                } else if (learningPathCtaBtnElement) {
                     learningPathCtaBtnElement.style.display = 'none';
                }


                // Populate Internal Mobility Snapshot
                if (internalSignalsInterestElement && employee.internalSignals) {
                    internalSignalsInterestElement.textContent = employee.internalSignals.interest || 'Not specified';
                }
                if (internalSignalsPastAppsElement && employee.internalSignals) {
                    internalSignalsPastAppsElement.textContent = employee.internalSignals.pastApplications || 'None';
                }
                if (recentApplicationsListElement && employee.applications) {
                    recentApplicationsListElement.innerHTML = '';
                    if (employee.applications.length > 0) {
                        employee.applications.forEach(app => {
                            const li = document.createElement('li');
                            li.innerHTML = `<strong>${app.opportunityTitle}</strong> - Status: ${app.offerStage} (as of ${app.statusDate})`;
                            recentApplicationsListElement.appendChild(li);
                        });
                    } else {
                        recentApplicationsListElement.innerHTML = '<li>No recent applications.</li>';
                    }
                }

            } else {
                console.error(`Employee with ID ${employeeIdToDisplay} not found.`);
                // Update UI to show error for employee-specific data
                if (employeeNameElement) employeeNameElement.textContent = "Employee Not Found";
                const errorMsg = '<li>Could not load data.</li>';
                if (disappearingSkillsListElement) disappearingSkillsListElement.innerHTML = errorMsg;
                if (constantSkillsListElement) constantSkillsListElement.innerHTML = errorMsg;
                if (emergingSkillsListElement) emergingSkillsListElement.innerHTML = errorMsg;
            }
        } catch (error) {
            console.error("Failed to load employee dashboard data:", error);
            if (employeeNameElement) employeeNameElement.textContent = "Error Loading Data";
            const errorMsg = '<li>Error loading skills data.</li>';
            if (trendingSkillsListElement) trendingSkillsListElement.innerHTML = errorMsg;
            if (disappearingSkillsListElement) disappearingSkillsListElement.innerHTML = errorMsg;
            if (constantSkillsListElement) constantSkillsListElement.innerHTML = errorMsg;
            if (emergingSkillsListElement) emergingSkillsListElement.innerHTML = errorMsg;
        }

        // Populate the generic "Top 10 Trending Skills" list (uses hardcoded data)
        populateGenericTrendingSkills();
    }

    // --- Tab Navigation (Removed as per new layout) ---
    // tabLinks.forEach(link => {
    //     link.addEventListener('click', () => {
    //         const tabId = link.getAttribute('data-tab');
    //         tabLinks.forEach(item => item.classList.remove('active'));
    //         tabContents.forEach(content => content.classList.remove('active'));
    //         link.classList.add('active');
    //         const activeContent = document.getElementById(`${tabId}-tab`);
    //         if (activeContent) {
    //             activeContent.classList.add('active');
    //         }
    //     });
    // });

    // --- Action Button Event Listeners ---
    if (exploreCareerPathBtn) {
        exploreCareerPathBtn.addEventListener('click', () => {
            // Assuming career-pathing.html is the target
            window.location.href = 'career-pathing.html'; 
        });
    }

    if (findTrainingBtn) {
        findTrainingBtn.addEventListener('click', () => {
            // Assuming a learning recommendations page, e.g., learning.html (create if needed)
            // For now, let's link to a placeholder or an existing relevant page like skills.html
            window.location.href = 'skills.html'; // Placeholder, update to actual learning recommendations page
            // console.log("Find Training Recommendations button clicked. Implement navigation.");
        });
    }

    // --- Initial Load ---
    initializeEmployeeDashboard();

    // Ensure the default tab is shown (Removed as tabs are removed)
    // const defaultActiveTab = document.querySelector('.tab-link.active');
    // if (defaultActiveTab) {
    //     const defaultTabId = defaultActiveTab.getAttribute('data-tab');
    //     const defaultActiveContent = document.getElementById(`${defaultTabId}-tab`);
    //     if (defaultActiveContent) {
    //         defaultActiveContent.classList.add('active');
    //     }
    // }
});
