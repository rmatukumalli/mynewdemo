document.addEventListener('DOMContentLoaded', () => {
    const EMPLOYEE_DATA = {
        name: "John Doe",
        currentRoleId: "JR_AV_CADET",
        grade: "G1",
        department: "Aviation Operations",
        location: "New York Flight Center",
        manager: "Captain Eva Rostova",
        possessedSkills: ["SK_AV_CPL", "SK_AV_FLT_PLAN", "SK_AV_AERO", "SK029"] 
    };

    const SKILLS_DATA = {
        SK029: { name: "Communication", category: "Soft Skill" },
        SK030: { name: "Problem Solving", category: "Soft Skill" },
        SK_AV_CPL: { name: "Commercial Pilot License (CPL)", category: "License" },
        SK_AV_PPL: { name: "Private Pilot License (PPL)", category: "License" },
        SK_AV_IR: { name: "Instrument Rating (IR)", category: "Rating", prerequisites: ["SK_AV_CPL"] },
        SK_AV_MER: { name: "Multi-Engine Rating (MER)", category: "Rating", prerequisites: ["SK_AV_CPL"] },
        SK_AV_ATPL: { name: "Airline Transport Pilot License (ATPL)", category: "License", prerequisites: ["SK_AV_CPL", "SK_AV_IR", "SK_AV_MER"] },
        SK_AV_FLT_PLAN: { name: "Flight Planning & Navigation", category: "Operational Skill" },
        SK_AV_ATC_COMM: { name: "Air Traffic Control Communication", category: "Operational Skill" },
        SK_AV_AERO: { name: "Aerodynamics Knowledge", category: "Technical Knowledge" },
        SK_AV_SYS: { name: "Aircraft Systems Knowledge", category: "Technical Knowledge" },
        SK_AV_WX: { name: "Aviation Weather Interpretation", category: "Technical Knowledge" },
        SK_AV_CRM: { name: "Crew Resource Management (CRM)", category: "Soft Skill" },
        SK_AV_SAFETY: { name: "Aviation Safety Procedures", category: "Safety" },
        SK_AV_EMER: { name: "Emergency Procedures Handling", category: "Safety" },
        SK_AV_TYPE_RATING_B737: { name: "Type Rating - Boeing 737", category: "Type Rating", prerequisites: ["SK_AV_ATPL"] },
        SK_AV_TYPE_RATING_A320: { name: "Type Rating - Airbus A320", category: "Type Rating", prerequisites: ["SK_AV_ATPL"] },
        SK_AV_TYPE_RATING_CESSNA: { name: "Type Rating - Cessna 172/152", category: "Type Rating", prerequisites: ["SK_AV_PPL"] },
        SK_AV_FI: { name: "Flight Instructor Rating (CFI/CFII)", category: "Rating", prerequisites: ["SK_AV_CPL", "SK_AV_IR"] },
        SK_AV_CHECK_PILOT: { name: "Check Pilot Authorization", category: "Authorization", prerequisites: ["SK_AV_ATPL", "SK_AV_FI"] },
        SK_AV_FLT_OPS_MGT: { name: "Flight Operations Management", category: "Management" },
        SK_AV_REGULATIONS: { name: "Aviation Regulations (FAA/EASA)", category: "Knowledge" }
    };
    
    const JOB_ROLES_DATA = {
        JR_AV_CADET: { 
            name: "Cadet Pilot", 
            requiredSkills: ["SK_AV_CPL", "SK_AV_FLT_PLAN", "SK_AV_AERO", "SK_AV_ATC_COMM", "SK_AV_REGULATIONS"], 
            grade: "G1", 
            domain: "Aviation", 
            iconClass: "fa-user-graduate", 
            openPositions: 5, 
            description: "Entry-level pilot, typically undergoing type rating training and initial line operating experience under supervision.", 
            pathCategory: "current"
        },
        JR_AV_FO_REGIONAL: { 
            name: "First Officer (Regional)", 
            requiredSkills: ["JR_AV_CADET", "SK_AV_IR", "SK_AV_MER", "SK_AV_CRM", "SK_AV_TYPE_RATING_CESSNA"],
            grade: "G2", 
            domain: "Aviation", 
            iconClass: "fa-plane-departure", 
            openPositions: 3, 
            description: "Second-in-command on regional airline flights, assists the Captain in all flight duties.", 
            pathCategory: "airlinePath"
        },
        JR_AV_FO_MAINLINE: { 
            name: "First Officer (Mainline)", 
            requiredSkills: ["JR_AV_FO_REGIONAL", "SK_AV_ATPL", "SK_AV_SYS", "SK_AV_WX", "SK_AV_TYPE_RATING_B737"], 
            grade: "G3", 
            domain: "Aviation", 
            iconClass: "fa-plane-up", 
            openPositions: 4, 
            description: "Second-in-command on mainline/international flights, operating larger and more complex aircraft.", 
            pathCategory: "airlinePath"
        },
        JR_AV_CAPTAIN_REGIONAL: { 
            name: "Captain (Regional)", 
            requiredSkills: ["JR_AV_FO_MAINLINE", "SK_AV_SAFETY", "SK_AV_EMER"], 
            grade: "G4", 
            domain: "Aviation", 
            iconClass: "fa-user-tie", 
            openPositions: 2, 
            description: "Commander of regional airline flights, responsible for the safety and operation of the aircraft and well-being of passengers and crew.", 
            pathCategory: "airlinePath"
        },
        JR_AV_CAPTAIN_MAINLINE: { 
            name: "Captain (Mainline)", 
            requiredSkills: ["JR_AV_CAPTAIN_REGIONAL", "SK_AV_TYPE_RATING_A320"], 
            grade: "G5", 
            domain: "Aviation", 
            iconClass: "fa-user-astronaut", 
            openPositions: 1, 
            description: "Commander of mainline/international flights, highest authority on board, responsible for complex operations.", 
            pathCategory: "airlinePath"
        },
        JR_AV_FLIGHT_INSTRUCTOR: { 
            name: "Flight Instructor (CFI)", 
            requiredSkills: ["SK_AV_CPL", "SK_AV_IR", "SK_AV_FI", "SK029"], 
            grade: "G2", 
            domain: "Aviation Training", 
            iconClass: "fa-chalkboard-teacher", 
            openPositions: 3, 
            description: "Trains student pilots for various licenses (PPL, CPL) and ratings (Instrument).", 
            pathCategory: "trainingPath"
        },
        JR_AV_SENIOR_FLIGHT_INSTRUCTOR: { 
            name: "Senior Flight Instructor (Chief CFI)", 
            requiredSkills: ["JR_AV_FLIGHT_INSTRUCTOR", "SK_AV_CHECK_PILOT", "SK_AV_FLT_OPS_MGT"], 
            grade: "G3", 
            domain: "Aviation Training", 
            iconClass: "fa-award", 
            openPositions: 1, 
            description: "Oversees training programs, curriculum development, and mentors other flight instructors. May hold Chief Instructor responsibilities.", 
            pathCategory: "trainingPath"
        },
        JR_AV_FLIGHT_OPS_MANAGER: {
            name: "Flight Operations Manager",
            requiredSkills: ["JR_AV_CAPTAIN_REGIONAL", "SK_AV_FLT_OPS_MGT", "SK_AV_REGULATIONS", "SK030"],
            grade: "G5",
            domain: "Aviation Management",
            iconClass: "fa-tasks",
            openPositions: 1,
            description: "Manages day-to-day flight operations, ensuring safety, efficiency, and regulatory compliance.",
            pathCategory: "managementPath"
        }
    };
    
    const CAREER_SWIMLANES = [
        { id: "airlinePath", title: "✈️ Commercial Airline Pilot Path", roles: ["JR_AV_FO_REGIONAL", "JR_AV_FO_MAINLINE", "JR_AV_CAPTAIN_REGIONAL", "JR_AV_CAPTAIN_MAINLINE"] },
        { id: "trainingPath", title: "🧑‍🏫 Flight Instruction & Training Path", roles: ["JR_AV_FLIGHT_INSTRUCTOR", "JR_AV_SENIOR_FLIGHT_INSTRUCTOR"] },
        { id: "managementPath", title: "📊 Aviation Management Path", roles: ["JR_AV_FO_MAINLINE", "JR_AV_CAPTAIN_REGIONAL", "JR_AV_FLIGHT_OPS_MANAGER"] }
    ];

    let userSkills = new Set(EMPLOYEE_DATA.possessedSkills);
    let currentGlobalTargetRoleId = null; 

    let summaryEls = { name: null, role: null, grade: null, department: null, location: null, manager: null };
    let currentRoleDisplayAreaEl, suggestionsGridContainerEl, analysisSectionEl, analysisRoleNameEl, analysisRoleDescriptionEl, possessedSkillsListEl, missingSkillsListEl, closeAnalysisBtn, devPlanButtonContainerEl;

    const getSkillName = (skillId) => SKILLS_DATA[skillId]?.name || 'Unknown Skill';
    const getRoleDetails = (roleId) => JOB_ROLES_DATA[roleId];

    function calculateRoleMatch(roleId) {
        const role = getRoleDetails(roleId);
        if (!role || !role.requiredSkills) return { matchPercentage: 0, missingSkillsList: [], totalRequired: 0, hasAll: true };
        let allRequiredSkills = new Set();
        function gatherSkills(currentSkillArray) {
            currentSkillArray.forEach(skillOrRoleId => {
                if (SKILLS_DATA[skillOrRoleId]) {
                    allRequiredSkills.add(skillOrRoleId);
                    const skillDetails = SKILLS_DATA[skillOrRoleId];
                    if (skillDetails.prerequisites) gatherSkills(skillDetails.prerequisites);
                } else if (JOB_ROLES_DATA[skillOrRoleId]) {
                    const prevRole = JOB_ROLES_DATA[skillOrRoleId];
                    if (prevRole.requiredSkills) gatherSkills(prevRole.requiredSkills);
                }
            });
        }
        gatherSkills(role.requiredSkills);
        let matchCount = 0;
        const missingSkillsList = [];
        allRequiredSkills.forEach(skillId => {
            if (userSkills.has(skillId)) matchCount++;
            else missingSkillsList.push(skillId);
        });
        const matchPercentage = allRequiredSkills.size > 0 ? (matchCount / allRequiredSkills.size) * 100 : 100;
        return { matchPercentage, missingSkillsList, totalRequired: allRequiredSkills.size, hasAll: matchCount === allRequiredSkills.size };
    }
    
    function createWrappedPathCardHtml(roleId, isCurrent = false, isHighlighted = false) {
        const role = getRoleDetails(roleId);
        if (!role) return '';
        const { matchPercentage } = calculateRoleMatch(roleId);
        const proficiencyCategory = matchPercentage >= 75 ? "High" : matchPercentage >= 50 ? "Medium" : "Low";
        const avatarHtml = `<div class="path-card-avatars flex items-center mb-1"> <img src="https://placehold.co/24x24/E2E8F0/4A5568?text=U1" alt="User 1" onerror="this.style.display='none'"><img src="https://placehold.co/24x24/CBD5E0/4A5568?text=U2" alt="User 2" onerror="this.style.display='none'"> ${role.openPositions > 0 ? `<span class="others-text text-delta-dark-gray">+${Math.floor(Math.random()*2 + 1)}</span>` : ''}</div>`;
        let cardClass = "path-card";
        if (isCurrent) cardClass += " current-role-card";
        if (isHighlighted) cardClass += " highlighted-path-node";

        const cardContentHtml = `
            <div class="${cardClass}">
                <div>
                    <h3 class="path-card-title"><i class="fas ${role.iconClass || 'fa-briefcase'} fa-fw"></i>${role.name}</h3>
                    <p class="path-card-grade">Grade: ${role.grade || 'N/A'}</p>
                    <div class="skill-proficiency mb-1">
                        <div class="skill-proficiency-label flex justify-between">
                            <span>Skill Match</span>
                            <span class="skill-proficiency-text ${proficiencyCategory === 'High' ? 'text-green-600' : proficiencyCategory === 'Medium' ? 'text-yellow-600' : 'text-red-600'}">${proficiencyCategory} (${matchPercentage.toFixed(0)}%)</span>
                        </div>
                        <div class="skill-proficiency-bar-bg"><div class="skill-proficiency-bar" style="width: ${matchPercentage.toFixed(0)}%;"></div></div>
                    </div>
                    ${avatarHtml}
                    <p class="path-card-details">Domain: ${role.domain || 'N/A'}</p>
                    <p class="path-card-details">Open Positions: ${role.openPositions !== undefined ? role.openPositions : 'N/A'}</p>
                </div>
                <button class="view-details-btn self-start" data-role-id="${roleId}">View Details <i class="fas fa-arrow-right"></i></button>
            </div>`;
        return cardContentHtml;
    }
    
    function renderEmployeeSummary() {
        if (summaryEls.name) summaryEls.name.textContent = EMPLOYEE_DATA.name;
        const currentRoleDetails = getRoleDetails(EMPLOYEE_DATA.currentRoleId);
        if (summaryEls.role) summaryEls.role.textContent = currentRoleDetails ? currentRoleDetails.name : 'N/A';
        if (summaryEls.grade) summaryEls.grade.textContent = EMPLOYEE_DATA.grade;
        if (summaryEls.department) summaryEls.department.textContent = EMPLOYEE_DATA.department;
        if (summaryEls.location) summaryEls.location.textContent = EMPLOYEE_DATA.location;
        if (summaryEls.manager) summaryEls.manager.textContent = EMPLOYEE_DATA.manager;
    }

    function renderCareerPaths() {
        const targetRoleDetails = currentGlobalTargetRoleId ? getRoleDetails(currentGlobalTargetRoleId) : null;
        const highlightedPathId = targetRoleDetails ? targetRoleDetails.pathCategory : null;

        const isRoleInHighlightedSequence = (roleId) => {
            if (!currentGlobalTargetRoleId) return false; 
            if (roleId === EMPLOYEE_DATA.currentRoleId) return true; 
            const roleDetails = getRoleDetails(roleId);
            if (!roleDetails) return false;
            if (roleId === currentGlobalTargetRoleId) return true;
            if (roleDetails.pathCategory === highlightedPathId) {
                const swimlane = CAREER_SWIMLANES.find(p => p.id === highlightedPathId);
                const roleIndexInItsPath = swimlane?.roles.indexOf(roleId);
                const targetIndexInItsPath = swimlane?.roles.indexOf(currentGlobalTargetRoleId);
                if (roleIndexInItsPath !== -1 && targetIndexInItsPath !== -1 && roleIndexInItsPath <= targetIndexInItsPath) {
                    return true;
                }
            }
            return false;
        };

        if(currentRoleDisplayAreaEl) currentRoleDisplayAreaEl.innerHTML = createWrappedPathCardHtml(EMPLOYEE_DATA.currentRoleId, true, true);
        if(currentRoleDisplayAreaEl) currentRoleDisplayAreaEl.className = 'current-role-container';
        if (highlightedPathId && currentRoleDisplayAreaEl) {
            currentRoleDisplayAreaEl.classList.add('highlighted-path-segment');
        }

        const branchContainerEl = document.getElementById('branchContainer');
        if (!branchContainerEl) {
            console.error("branchContainerEl not found in renderCareerPaths");
            return;
        }

        branchContainerEl.innerHTML = ''; 
        branchContainerEl.className = 'career-paths-grid-container';
        if (highlightedPathId) {
            branchContainerEl.classList.add('highlighted-main-bus');
        }

        CAREER_SWIMLANES.forEach(swimlane => {
            const isPathHighlighted = swimlane.id === highlightedPathId;
            const titleCell = document.createElement('div');
            titleCell.className = 'swimlane-title-cell';
            if(isPathHighlighted) titleCell.classList.add('highlighted-branch-connector');
            titleCell.innerHTML = `<h3 class="swimlane-title">${swimlane.title}</h3>`;
            branchContainerEl.appendChild(titleCell);

            const rolesOuterCell = document.createElement('div');
            rolesOuterCell.className = 'swimlane-roles-cell';
            const rolesScrollContainer = document.createElement('div');
            rolesScrollContainer.className = 'swimlane-roles-scroll-container overflow-x-auto whitespace-nowrap scroll-smooth'; /* Added responsive classes */

            swimlane.roles.forEach((roleId, index) => {
                const isHighlighted = isRoleInHighlightedSequence(roleId);
                const nodeItem = document.createElement('div');
                nodeItem.className = 'career-path-node-item flex-shrink-0'; /* Added flex-shrink-0 */
                if (isHighlighted) nodeItem.classList.add('highlighted-path-segment');
                let nodeContent = createWrappedPathCardHtml(roleId, false, isHighlighted);
                if (index < swimlane.roles.length - 1) {
                    const nextRoleIsHighlighted = isRoleInHighlightedSequence(swimlane.roles[index + 1]);
                    const connectorClass = `connector horizontal-connector ${isHighlighted && nextRoleIsHighlighted ? 'highlighted-path-connector' : ''}`;
                    nodeContent += `<div class="${connectorClass}"></div>`;
                }
                nodeItem.innerHTML = nodeContent;
                rolesScrollContainer.appendChild(nodeItem);
            });
            rolesOuterCell.appendChild(rolesScrollContainer);
            branchContainerEl.appendChild(rolesOuterCell);
        });

        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const roleId = e.currentTarget.dataset.roleId;
                showPathAnalysis(roleId);
                if(analysisSectionEl) analysisSectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }
    
    function createSuggestionCard(roleId, categoryTitle, categoryIcon, categoryColorClass = 'text-delta-blue') {
        const role = getRoleDetails(roleId);
        if (!role) return '';
        const { matchPercentage, missingSkillsList } = calculateRoleMatch(roleId);
        const skillGapText = missingSkillsList.length > 0 ? `Requires ${missingSkillsList.length} more skill${missingSkillsList.length > 1 ? 's' : ''}.` : "Skills match well!";
        const skillGapIcon = missingSkillsList.length > 0 ? "fa-exclamation-circle" : "fa-check-circle";
        const skillGapColor = missingSkillsList.length > 0 ? "text-delta-red" : "text-green-600";
        const isCurrentTarget = currentGlobalTargetRoleId === roleId;
        const buttonText = isCurrentTarget ? "✓ Target Set" : "Set as Target";
        const buttonClasses = `btn suggestion-set-target-btn ${isCurrentTarget ? 'target-set-style' : 'default-style'}`;

        return `
            <div class="suggestion-card flex flex-col justify-between">
                <div>
                    <h3 class="suggestion-card-category-title ${categoryColorClass}"><i class="fas ${categoryIcon} fa-fw"></i>${categoryTitle}</h3>
                    <h4 class="suggestion-card-role-title">${role.name}</h4>
                    <p class="suggestion-card-description">${role.description || "No detailed description available."}</p>
                    <div class="suggestion-match-badge">${matchPercentage.toFixed(0)}% Match</div>
                    <p class="suggestion-skill-gap ${skillGapColor}"><i class="fas ${skillGapIcon}"></i>${skillGapText}</p>
                </div>
                <button class="${buttonClasses}" data-role-id="${roleId}" ${isCurrentTarget ? 'disabled' : ''}>
                    <i class="fas ${isCurrentTarget ? 'fa-check-circle' : 'fa-bullseye'}"></i>${buttonText}
                </button>
            </div>`;
    }

    function renderRoleSuggestions() {
        if (!suggestionsGridContainerEl) {
            console.error("suggestionsGridContainerEl not found in renderRoleSuggestions");
            return;
        }
        suggestionsGridContainerEl.innerHTML = '';
        const suggestions = [
            { roleId: "JR_AV_FO_MAINLINE", title: "Top Opportunity: Next Step", icon: "fa-plane-up", color: "text-yellow-500" }, 
            { roleId: "JR_AV_FLIGHT_INSTRUCTOR", title: "Consider Adjacent: Build Hours & Skills", icon: "fa-chalkboard-teacher", color: "text-blue-500" }, 
            { roleId: "JR_AV_CAPTAIN_MAINLINE", title: "Aim for Aspirational: Command Role", icon: "fa-user-astronaut", color: "text-purple-500" } 
        ];
        suggestions.forEach(suggestion => {
            if (JOB_ROLES_DATA[suggestion.roleId]) {
                suggestionsGridContainerEl.innerHTML += createSuggestionCard(suggestion.roleId, suggestion.title, suggestion.icon, suggestion.color);
            }
        });
        document.querySelectorAll('#suggestionsGridContainer .suggestion-set-target-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clickedRoleId = e.currentTarget.dataset.roleId;
                currentGlobalTargetRoleId = clickedRoleId; 
                showPathAnalysis(clickedRoleId); 
                if(analysisSectionEl) analysisSectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                renderCareerPaths(); 
                renderRoleSuggestions(); 
            });
        });
    }

    function showPathAnalysis(roleId) {
        const roleData = getRoleDetails(roleId);
        if (!roleData || !analysisRoleNameEl || !analysisRoleDescriptionEl || !possessedSkillsListEl || !missingSkillsListEl || !devPlanButtonContainerEl) {
            console.error("One or more analysis DOM elements not found in showPathAnalysis.");
            return;
        }
        
        currentGlobalTargetRoleId = roleId; 
        renderCareerPaths(); 
        
        analysisRoleNameEl.textContent = roleData.name;
        analysisRoleDescriptionEl.textContent = roleData.description || "No detailed description available for this role.";
        possessedSkillsListEl.innerHTML = '';
        missingSkillsListEl.innerHTML = '';
        const { missingSkillsList: roleMissingSkills, totalRequired, matchPercentage } = calculateRoleMatch(roleId);
        let allRequiredSkillsForDisplay = new Set();
        function gatherSkillsForDisplay(currentSkillArray) {
            currentSkillArray.forEach(skillOrRoleId => {
                if (SKILLS_DATA[skillOrRoleId]) { 
                    allRequiredSkillsForDisplay.add(skillOrRoleId);
                    if (SKILLS_DATA[skillOrRoleId].prerequisites) gatherSkillsForDisplay(SKILLS_DATA[skillOrRoleId].prerequisites);
                } else if (JOB_ROLES_DATA[skillOrRoleId]) { 
                    if (JOB_ROLES_DATA[skillOrRoleId].requiredSkills) gatherSkillsForDisplay(JOB_ROLES_DATA[skillOrRoleId].requiredSkills);
                }
            });
        }
        if(roleData.requiredSkills) gatherSkillsForDisplay(roleData.requiredSkills);
        let possessedCount = 0;
        if (allRequiredSkillsForDisplay.size > 0) {
            allRequiredSkillsForDisplay.forEach(skillId => {
                if (userSkills.has(skillId)) {
                    possessedSkillsListEl.innerHTML += `<li>${getSkillName(skillId)}</li>`;
                    possessedCount++;
                }
            });
        }
        if (possessedCount === 0 && totalRequired > 0) possessedSkillsListEl.innerHTML = '<li class="text-delta-dark-gray italic">No direct skill matches for this role yet.</li>';
        else if (totalRequired === 0 || allRequiredSkillsForDisplay.size === 0) possessedSkillsListEl.innerHTML = '<li class="text-delta-dark-gray italic">Focus on role responsibilities and soft skills.</li>';
        
        devPlanButtonContainerEl.innerHTML = ''; 
        const devPlanButton = document.createElement('button'); // Create button regardless of missing skills for consistency
        devPlanButton.className = 'add-to-dev-plan-btn';
        devPlanButton.innerHTML = '<i class="fas fa-route"></i> Add to Personalized Learning Plan';
        devPlanButton.addEventListener('click', () => {
            // roleId is available in this scope
            // roleData is available (aspirational role details)
            // roleMissingSkills is available (array of skill IDs for the aspirational role)
            // EMPLOYEE_DATA is global in this script
            // JOB_ROLES_DATA is global in this script

            localStorage.setItem('devPlanTargetRoleId', roleId);
            localStorage.setItem('devPlanTargetRoleName', roleData.name); // roleData is from showPathAnalysis(roleId)
            localStorage.setItem('devPlanMissingSkillIds', JSON.stringify(roleMissingSkills)); // roleMissingSkills is from calculateRoleMatch
            localStorage.setItem('devPlanEmployeeName', EMPLOYEE_DATA.name);
            const currentRoleDetails = getRoleDetails(EMPLOYEE_DATA.currentRoleId);
            localStorage.setItem('devPlanCurrentRoleName', currentRoleDetails ? currentRoleDetails.name : "Current Role");

            const targetUrl = `personalized-learning-path/index.html?roleId=${encodeURIComponent(roleId)}`;
            // Add a small delay to help ensure localStorage operations complete before navigation
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 50); // 50 milliseconds delay
        });
        devPlanButtonContainerEl.appendChild(devPlanButton);

        if (roleMissingSkills.length > 0) {
            roleMissingSkills.forEach(skillId => missingSkillsListEl.innerHTML += `<li class="compact-missing-skill-item"><span class="cp-skill-name-text font-semibold block">${getSkillName(skillId)}</span></li>`);
        } else if (totalRequired > 0 && matchPercentage === 100) {
            missingSkillsListEl.innerHTML = `<li class="text-delta-blue italic text-md"><i class="fas fa-check-circle"></i> You have all the required skills!</li>`;
        } else if (totalRequired === 0 || allRequiredSkillsForDisplay.size === 0) {
            missingSkillsListEl.innerHTML = `<li class="text-delta-dark-gray italic">Skill requirements met or not specified.</li>`;
        }
        if(analysisSectionEl) analysisSectionEl.classList.remove('hidden');
    }
    
    function showCustomNotification(message, type = 'info') {
        const notificationBar = document.getElementById('cpNotificationBar');
        if (!notificationBar) {
            console.error("Notification bar element not found.");
            return;
        }
        notificationBar.className = 'cp-notification-base'; 
        const typeClass = `cp-notification-${type}`;
        notificationBar.classList.add(typeClass, 'show');
        notificationBar.textContent = message;
        requestAnimationFrame(() => { 
            notificationBar.style.opacity = '1'; 
            notificationBar.style.transform = 'translate(-50%, 0)'; 
        });
        setTimeout(() => { 
             notificationBar.style.opacity = '0';
             notificationBar.style.transform = 'translate(-50%, -150%)';
             setTimeout(() => { 
                 if (!notificationBar.classList.contains('show')) {
                    notificationBar.className = 'cp-notification-base'; 
                 }
            }, 400); 
        }, 3000); 
    }

    function applyContextualUIChanges(isJobArchitectureContext) {
        const welcomeMessage = document.getElementById('career-path-welcome-message');
        if (isJobArchitectureContext && welcomeMessage) {
            welcomeMessage.innerHTML = '<h1 class="text-3xl font-bold text-delta-blue mb-4">Visualize Career Progressions and Pathways</h1>';
        }
    }

    function initLogic(isPathfinderContext = false, isJobArchitectureContext = false) {
        console.log("Initializing Career Pathing Logic. Pathfinder context:", isPathfinderContext, "Job Architecture context:", isJobArchitectureContext);

        // Initialize DOM element references
        summaryEls.name = document.getElementById('summaryEmployeeName');
        summaryEls.role = document.getElementById('summaryCurrentRole');
        summaryEls.grade = document.getElementById('summaryGrade');
        summaryEls.department = document.getElementById('summaryDepartment');
        summaryEls.location = document.getElementById('summaryLocation');
        summaryEls.manager = document.getElementById('summaryManager');
        
        currentRoleDisplayAreaEl = document.getElementById('currentRoleDisplayArea');
        suggestionsGridContainerEl = document.getElementById('suggestionsGridContainer');
        analysisSectionEl = document.getElementById('cpAnalysisSection');
        closeAnalysisBtn = document.getElementById('closeAnalysisBtn');
        devPlanButtonContainerEl = document.getElementById('devPlanButtonContainer');
        analysisRoleNameEl = document.getElementById('analysisRoleName');
        analysisRoleDescriptionEl = document.getElementById('analysisRoleDescription');
        possessedSkillsListEl = document.getElementById('possessedSkillsList');
        missingSkillsListEl = document.getElementById('missingSkillsList');

        // Perform DOM context detection and graceful exit
        const essentialElements = {
            'Employee Summary Name': summaryEls.name,
            'Current Role Display Area': currentRoleDisplayAreaEl,
            'Suggestions Grid Container': suggestionsGridContainerEl,
            'Analysis Section': analysisSectionEl,
            'Close Analysis Button': closeAnalysisBtn,
            'Development Plan Button Container': devPlanButtonContainerEl,
            'Analysis Role Name': analysisRoleNameEl,
            'Analysis Role Description': analysisRoleDescriptionEl,
            'Possessed Skills List': possessedSkillsListEl,
            'Missing Skills List': missingSkillsListEl
        };

        for (const [name, element] of Object.entries(essentialElements)) {
            if (!element) {
                console.warn(`Career Pathing: Missing essential DOM element: ${name}. Aborting initialization for this context.`);
                return; 
            }
        }

        // Apply contextual UI changes
        applyContextualUIChanges(isJobArchitectureContext);
        
        if (closeAnalysisBtn && !closeAnalysisBtn.hasAttachedListener) {
             closeAnalysisBtn.addEventListener('click', () => {
                if(analysisSectionEl) analysisSectionEl.classList.add('hidden');
                if (devPlanButtonContainerEl) devPlanButtonContainerEl.innerHTML = '';
                currentGlobalTargetRoleId = null; 
                renderCareerPaths(); 
                renderRoleSuggestions();
            });
            closeAnalysisBtn.hasAttachedListener = true;
        }

        if (isPathfinderContext) {
            const preSelectedRole = localStorage.getItem('selectedAspirationalRoleFromScreen3');
            if (preSelectedRole) {
                currentGlobalTargetRoleId = preSelectedRole;
                localStorage.removeItem('selectedAspirationalRoleFromScreen3');
            } else {
                currentGlobalTargetRoleId = null; 
            }
        } else {
            currentGlobalTargetRoleId = null;
        }
        
        renderEmployeeSummary();
        renderCareerPaths(); 
        renderRoleSuggestions(); 

        if (isPathfinderContext && currentGlobalTargetRoleId && JOB_ROLES_DATA[currentGlobalTargetRoleId]) {
            showPathAnalysis(currentGlobalTargetRoleId);
            if (analysisSectionEl && !analysisSectionEl.classList.contains('hidden')) {
                analysisSectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            if(analysisSectionEl) analysisSectionEl.classList.add('hidden');
        }

        setTimeout(() => {
            const employeeNameEl = document.getElementById('summaryEmployeeName');
            if (employeeNameEl && employeeNameEl.textContent && employeeNameEl.textContent.trim() !== "") {
                 showCustomNotification(`Welcome, ${EMPLOYEE_DATA.name}! Explore your career paths.`, 'info');
            }
        }, 250);
    }

    window.initializeCareerNavigator = function(isJobArchitectureContext = false) {
        initLogic(true, isJobArchitectureContext); 
    };

    window.initializeJobArchitectureCareerPaths = function() {
        initLogic(false, true);
    };

    function initCareerPathingStandalone() {
        initLogic(false, new URLSearchParams(window.location.search).get('context') === 'job-architecture');
    }

    initCareerPathingStandalone();

});
