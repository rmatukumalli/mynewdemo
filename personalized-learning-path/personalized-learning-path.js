document.addEventListener('DOMContentLoaded', () => {
    let learningContext = null;
    const urlParams = new URLSearchParams(window.location.search);
    const roleIdFromUrl = urlParams.get('roleId'); // Still useful for logging or direct links

    // Minimal skills data for looking up names
    const SKILLS_DATA_FOR_LEARNING_PATH = {
        SK029: { name: "Communication" },
        SK030: { name: "Problem Solving" },
        SK_AV_CPL: { name: "Commercial Pilot License (CPL)" },
        SK_AV_PPL: { name: "Private Pilot License (PPL)" },
        SK_AV_IR: { name: "Instrument Rating (IR)" },
        SK_AV_MER: { name: "Multi-Engine Rating (MER)" },
        SK_AV_ATPL: { name: "Airline Transport Pilot License (ATPL)" },
        SK_AV_FLT_PLAN: { name: "Flight Planning & Navigation" },
        SK_AV_ATC_COMM: { name: "Air Traffic Control Communication" },
        SK_AV_AERO: { name: "Aerodynamics Knowledge" },
        SK_AV_SYS: { name: "Aircraft Systems Knowledge" },
        SK_AV_WX: { name: "Aviation Weather Interpretation" },
        SK_AV_CRM: { name: "Crew Resource Management (CRM)" },
        SK_AV_SAFETY: { name: "Aviation Safety Procedures" },
        SK_AV_EMER: { name: "Emergency Procedures Handling" },
        SK_AV_TYPE_RATING_B737: { name: "Type Rating - Boeing 737" },
        SK_AV_TYPE_RATING_A320: { name: "Type Rating - Airbus A320" },
        SK_AV_TYPE_RATING_CESSNA: { name: "Type Rating - Cessna 172/152" },
        SK_AV_FI: { name: "Flight Instructor Rating (CFI/CFII)" },
        SK_AV_CHECK_PILOT: { name: "Check Pilot Authorization" },
        SK_AV_FLT_OPS_MGT: { name: "Flight Operations Management" },
        SK_AV_REGULATIONS: { name: "Aviation Regulations (FAA/EASA)" }
    };

    // Attempt to load context from localStorage (set by previous page)
    const devPlanTargetRoleId = localStorage.getItem('devPlanTargetRoleId');
    const devPlanTargetRoleName = localStorage.getItem('devPlanTargetRoleName');
    const devPlanMissingSkillIdsString = localStorage.getItem('devPlanMissingSkillIds');
    const devPlanEmployeeName = localStorage.getItem('devPlanEmployeeName');
    const devPlanCurrentRoleName = localStorage.getItem('devPlanCurrentRoleName');

    if (devPlanTargetRoleId) {
        console.log(`Personalized Learning Path: roleId from localStorage is ${devPlanTargetRoleId}. URL roleId was ${roleIdFromUrl}`);
        const missingSkillIds = devPlanMissingSkillIdsString ? JSON.parse(devPlanMissingSkillIdsString) : [];
        
        const actualMissingSkills = missingSkillIds.map(skillId => ({
            id: skillId,
            name: SKILLS_DATA_FOR_LEARNING_PATH[skillId]?.name || skillId // Fallback to ID if name not found
        }));

        learningContext = {
            employeeName: devPlanEmployeeName || "Valued Employee",
            currentRoleName: devPlanCurrentRoleName || "Current Position",
            targetRoleName: devPlanTargetRoleName || devPlanTargetRoleId.replace(/_/g, ' '),
            missingSkills: actualMissingSkills
        };
        console.log("Constructed learningContext from localStorage:", learningContext);

        // Clear localStorage items after use
        localStorage.removeItem('devPlanTargetRoleId');
        localStorage.removeItem('devPlanTargetRoleName');
        localStorage.removeItem('devPlanMissingSkillIds');
        localStorage.removeItem('devPlanEmployeeName');
        localStorage.removeItem('devPlanCurrentRoleName');

    } else if (roleIdFromUrl) {
        // Fallback to using roleIdFromUrl if localStorage is empty (e.g. direct link)
        console.warn(`Personalized Learning Path: No context in localStorage. Falling back to roleId from URL: ${roleIdFromUrl}`);
        learningContext = {
            employeeName: "Valued Employee (Direct Link)",
            currentRoleName: "Current Position (Direct Link)",
            targetRoleName: roleIdFromUrl.replace(/_/g, ' '),
            missingSkills: [ // Generic placeholders for direct link scenario
                { id: "SK_AV_REGULATIONS", name: SKILLS_DATA_FOR_LEARNING_PATH["SK_AV_REGULATIONS"]?.name || "Aviation Regulations" },
                { id: "SK029", name: SKILLS_DATA_FOR_LEARNING_PATH["SK029"]?.name || "Communication" }
            ]
        };
        console.log("Constructed fallback learningContext from URL roleId:", learningContext);
    } else {
        console.error("Personalized Learning Path: No roleId from URL and no context in localStorage. Cannot determine learning path.");
        // learningContext remains null, page will show "context not found" messages
    }

    const learningGoalTextEl = document.getElementById('learningGoalText'); // Targets the span containing the full message
    const recapTargetRoleEl = document.getElementById('recapTargetRole'); // This is the <strong> inside learningGoalTextEl
    const learningFocusRecapEl = document.getElementById('learningFocusRecap');
    const learningResourcesListEl = document.getElementById('learningResourcesList');
    const employeeNameRecapEl = document.getElementById('recapEmployeeName'); 
    const currentRoleRecapEl = document.getElementById('recapCurrentRole');

    // Sample Aviation Learning Modules Data (could be fetched or more extensive)
    const AVIATION_LEARNING_MODULES = {
        SK_AV_IR: { title: "Mastering Instrument Rating (IR)", type: "Online Course + Sim", duration: "20+ Hours", description: "In-depth theory and practical simulator sessions for IFR flying.", source: "King Schools / Internal Sim Bay", icon: "fa-tachometer-alt" },
        SK_AV_MER: { title: "Multi-Engine Rating (MER) Ground School", type: "Ground School", duration: "15 Hours", description: "Covers aerodynamics, systems, and procedures for multi-engine aircraft.", source: "Internal Training Dept.", icon: "fa-cogs" },
        SK_AV_ATPL: { title: "ATPL Theory Knowledge", type: "Self-study + Workshops", duration: "100+ Hours", description: "Comprehensive study for all ATPL written exams.", source: "EASA/FAA Syllabus + Internal Workshops", icon: "fa-book-reader" },
        SK_AV_SYS: { title: "Advanced Aircraft Systems (e.g., Boeing 737)", type: "Type-Specific Course", duration: "40 Hours", description: "Detailed understanding of hydraulic, electrical, pneumatic, and avionic systems for a specific large aircraft type.", source: "Aircraft Manufacturer / Approved Training Org.", icon: "fa-network-wired" },
        SK_AV_WX: { title: "Advanced Aviation Weather & Meteorology", type: "Online Course", duration: "10 Hours", description: "Deep dive into complex weather phenomena, forecasting, and decision-making for pilots.", source: "PilotWorkshops.com", icon: "fa-cloud-sun-rain" },
        SK_AV_CRM: { title: "Crew Resource Management (CRM) Recurrent", type: "Workshop", duration: "8 Hours", description: "Refresher and advanced scenarios in communication, teamwork, and decision-making in the cockpit.", source: "Internal Safety Dept.", icon: "fa-users" },
        SK_AV_SAFETY: { title: "Aviation Safety Management Systems (SMS)", type: "Online Module", duration: "5 Hours", description: "Understanding the principles and application of SMS in airline operations.", source: "IATA Learning", icon: "fa-shield-alt" },
        SK_AV_EMER: { title: "Emergency Procedures & Drills", type: "Simulator Training", duration: "12 Hours", description: "Hands-on simulator training for various emergency scenarios.", source: "Internal Sim Bay", icon: "fa-fire-extinguisher" },
        SK_AV_TYPE_RATING_B737: { title: "Boeing 737 Type Rating Course", type: "Full Course", duration: "150+ Hours", description: "Complete ground school and simulator training to qualify for B737.", source: "Approved Training Organization", icon: "fa-plane" },
        SK_AV_TYPE_RATING_A320: { title: "Airbus A320 Type Rating Course", type: "Full Course", duration: "150+ Hours", description: "Complete ground school and simulator training to qualify for A320.", source: "Approved Training Organization", icon: "fa-plane-arrival" },
        SK_AV_FI: { title: "Flight Instructor (CFI/CFII) Course", type: "Course + Flight Training", duration: "60+ Hours", description: "Training to become a certified flight instructor.", source: "Local Flight School Partner", icon: "fa-chalkboard-teacher" },
        SK_AV_CHECK_PILOT: { title: "Check Pilot Standardization Course", type: "Workshop + OJT", duration: "25 Hours", description: "Training and standardization for conducting flight checks and evaluations.", source: "Internal Standards Dept.", icon: "fa-user-check" },
        SK_AV_FLT_OPS_MGT: { title: "Introduction to Flight Operations Management", type: "Online Course", duration: "15 Hours", description: "Overview of managing airline flight operations, scheduling, and compliance.", source: "Embry-Riddle Online", icon: "fa-tasks" },
        SK_AV_REGULATIONS: { title: "Advanced Aviation Regulations Update", type: "Webinar Series", duration: "6 Hours", description: "Updates on recent changes and interpretations of FAA/EASA regulations.", source: "Aviation Law Experts Inc.", icon: "fa-gavel" },
        SK029: { title: "Effective Cockpit Communication", type: "Workshop", duration: "4 Hours", description: "Enhancing clarity, assertiveness, and listening skills for pilots.", source: "Internal HR / Safety Dept.", icon: "fa-comments" },
        SK030: { title: "Aeronautical Decision Making (ADM)", type: "Scenario-based e-Learning", duration: "8 Hours", description: "Improving critical thinking and decision-making skills in flight scenarios.", source: "FAA Safety Team (FAASTeam)", icon: "fa-brain" }
    };

    if (learningContext) {
        // Populate Recap Section
        if (employeeNameRecapEl) employeeNameRecapEl.textContent = learningContext.employeeName || "Learner";
        if (currentRoleRecapEl) currentRoleRecapEl.textContent = learningContext.currentRoleName || "your current role";
        
        // Populate the new learning goal alert
        if (learningGoalTextEl && recapTargetRoleEl) {
            recapTargetRoleEl.textContent = learningContext.targetRoleName || "your target role";
            // The rest of the text "To achieve your goal of becoming a ... focus on these key skills:" is static in the HTML,
            // only the role name within the <strong> tag is dynamic.
        }


        if (learningFocusRecapEl) {
            learningFocusRecapEl.innerHTML = ''; // Clear placeholders
            if (learningContext.missingSkills && learningContext.missingSkills.length > 0) {
                learningContext.missingSkills.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'tag delta-skill-recap';
                    tag.textContent = skill.name;
                    learningFocusRecapEl.appendChild(tag);
                });
            } else {
                learningFocusRecapEl.innerHTML = '<p class="text-slate-500">No specific skill gaps identified for this role, or you already possess all required skills! Explore general aviation knowledge below.</p>';
            }
        }

        // Populate Learning Resources
        if (learningResourcesListEl) {
            learningResourcesListEl.innerHTML = ''; // Clear placeholders
            if (learningContext.missingSkills && learningContext.missingSkills.length > 0) {
                learningContext.missingSkills.forEach(skill => {
                    const moduleData = AVIATION_LEARNING_MODULES[skill.id];
                    if (moduleData) {
                        learningResourcesListEl.appendChild(createLearningResourceCard(skill.id, moduleData));
                    } else {
                        // Fallback for skills not in our curated list
                        learningResourcesListEl.appendChild(createLearningResourceCard(skill.id, {
                            title: `Develop: ${skill.name}`,
                            type: "Self-Study / Research",
                            duration: "Variable",
                            description: `Focus on acquiring and demonstrating proficiency in ${skill.name}. Seek out relevant industry resources, manuals, or expert guidance.`,
                            source: "Industry Best Practices",
                            icon: "fa-search"
                        }));
                    }
                });
            } else {
                // Suggest general aviation learning if no specific skills are missing
                Object.keys(AVIATION_LEARNING_MODULES).slice(0, 3).forEach(skillId => { // Show a few general ones
                     learningResourcesListEl.appendChild(createLearningResourceCard(skillId, AVIATION_LEARNING_MODULES[skillId]));
                });
                 learningResourcesListEl.innerHTML += '<p class="mt-4 text-slate-600">You seem to have all skills for the target role! Consider exploring advanced topics or related areas.</p>';
            }
        }
        
        // Clear the context from localStorage after use
        // localStorage.removeItem('personalizedLearningContext'); 
        // Decided to keep it for now for easier refresh/testing, but in prod, might remove.

    } else {
        // Handle case where context is not found (e.g., direct navigation to this page)
        if (recapTargetRoleEl) recapTargetRoleEl.textContent = "your chosen role";
        if (learningFocusRecapEl) learningFocusRecapEl.innerHTML = '<p class="text-slate-500">Please select a target role from the Career Pathing page to see personalized recommendations.</p>';
        if (learningResourcesListEl) learningResourcesListEl.innerHTML = '<p class="text-slate-500">No learning path context found. Please start from the Career Pathing page.</p>';
    }

    function createLearningResourceCard(resourceKey, resourceData) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'p-4 border border-slate-200 rounded bg-slate-50/50';
        cardDiv.innerHTML = `
            <h4 class="text-lg font-semibold text-delta-blue mb-1">
                <i class="fas ${resourceData.icon || 'fa-graduation-cap'}"></i> ${resourceData.title}
            </h4>
            <p class="text-xs text-slate-500 mb-2">
                <strong>Type:</strong> ${resourceData.type} | 
                <strong>Duration:</strong> ${resourceData.duration} | 
                <strong>Source:</strong> ${resourceData.source}
            </p>
            <p class="text-sm">${resourceData.description}</p>
            <div class="mt-3 flex justify-between items-center">
                <button class="btn btn-primary btn-extra-small" onclick="enrollCourse('${resourceData.title.replace(/'/g, "\\'")}')">
                    Enroll / View
                    <i class="fas fa-arrow-right ml-1"></i>
                </button>
                <select class="status-select form-input text-xs py-1 px-2 w-auto rounded-md border-slate-300 focus:ring-blue-500 focus:border-blue-500" data-resource-id="${resourceKey}">
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
        `;
        return cardDiv;
    }
    
    // --- Status Tracking for Learning Resources (from original HTML script) ---
    // This needs to be called AFTER dynamic content is added
    function initializeStatusTracking() {
        const statusSelects = document.querySelectorAll('#learningResourcesList .status-select');
        statusSelects.forEach(select => {
            const resourceId = select.dataset.resourceId; // Already set by createLearningResourceCard
            
            const savedStatus = localStorage.getItem(`resourceStatus-${resourceId}`);
            if (savedStatus) {
                select.value = savedStatus;
                select.className = `status-select form-input text-xs py-1 px-2 w-auto rounded-md border-slate-300 focus:ring-blue-500 focus:border-blue-500 ${getStatusColorClass(savedStatus)}`;
            } else {
                 select.className = `status-select form-input text-xs py-1 px-2 w-auto rounded-md border-slate-300 focus:ring-blue-500 focus:border-blue-500 ${getStatusColorClass(select.value)}`;
            }

            select.addEventListener('change', (e) => {
                localStorage.setItem(`resourceStatus-${resourceId}`, e.target.value);
                 e.target.className = `status-select form-input text-xs py-1 px-2 w-auto rounded-md border-slate-300 focus:ring-blue-500 focus:border-blue-500 ${getStatusColorClass(e.target.value)}`;
                showCustomNotification(`Status updated for ${AVIATION_LEARNING_MODULES[resourceId]?.title || resourceId }.`, 'success');
            });
        });
    }

    function getStatusColorClass(status) {
        if (status === 'completed') return 'status-completed';
        if (status === 'in-progress') return 'status-in-progress';
        return 'status-not-started';
    }
    
    // Placeholder functions for interactions (can be expanded)
    window.enrollCourse = function(courseName) {
        showCustomNotification(`Action for "${courseName}" triggered. (e.g., redirect to LMS)`, 'info');
    }

    // Initialize status tracking after dynamic content is rendered
    initializeStatusTracking();

    // Function to show custom notifications (from original HTML script)
    function showCustomNotification(message, type = 'info') {
        let notificationBar = document.getElementById('cpNotificationBarRec');
        if (!notificationBar) {
            notificationBar = document.createElement('div');
            notificationBar.id = 'cpNotificationBarRec';
            document.body.appendChild(notificationBar); 
        }
        
        let bgColor = 'bg-[var(--delta-blue)]'; 
        let textColor = 'text-[var(--delta-text-on-dark)]';

        if (type === 'success') bgColor = 'bg-green-500';
        else if (type === 'warning') { bgColor = 'bg-yellow-400'; textColor = 'text-black';}
        else if (type === 'error') bgColor = 'bg-[var(--delta-red)]';
        
        notificationBar.className = `p-3 text-center text-sm shadow-md fixed top-4 left-1/2 -translate-x-1/2 w-auto min-w-[300px] max-w-[90%] rounded z-[10000] transition-all duration-300 ease-out opacity-0 -translate-y-full ${bgColor} ${textColor}`;
        
        notificationBar.textContent = message;
        setTimeout(() => {
            notificationBar.style.opacity = '1';
            notificationBar.style.transform = 'translate(-50%, 0)';
        }, 10); 
        
        setTimeout(() => {
            notificationBar.style.opacity = '0';
            notificationBar.style.transform = 'translate(-50%, -150%)';
        }, 3500);
    }

    console.log("Personalized Learning Path JS Loaded. Context:", learningContext);
});
