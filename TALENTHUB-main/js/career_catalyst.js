document.addEventListener('DOMContentLoaded', () => {
    // Floating Particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const numParticles = 50;
        for (let i = 0; i < numParticles; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${10 + Math.random() * 10}s`; // Vary duration
            particle.style.width = `${2 + Math.random() * 3}px`; // Vary size
            particle.style.height = particle.style.width;
            particle.style.opacity = `${0.2 + Math.random() * 0.5}`; // Vary opacity
            particlesContainer.appendChild(particle);
        }
    }

    // Notification Logic
    const jobNotification = document.getElementById('jobNotification');
    const notificationTitleEl = document.getElementById('notificationTitle');
    const notificationText = document.getElementById('notificationText');
    const notificationIcon = jobNotification ? jobNotification.querySelector('.notification-icon') : null;

    // Default modal data
    let stagedModalData = {
        title: "Senior Project Manager",
        company: "TechCorp Solutions • Remote",
        tags: ["Project Management", "Agile/Scrum", "Team Leadership", "$95K-$125K"],
        matchPercent: "94%",
        matchText: "Your Project Management certification directly aligns with this role. AI analysis shows you exceed 8/10 requirements.",
        matchIcon: "🎯",
        responsibilities: [
            "Lead complex tech projects",
            "Manage cross-functional teams",
            "Stakeholder communication",
            "Risk management & mitigation"
        ],
        strengths: [
            "Proven PM track record",
            "Agile methodology expert",
            "Strong analytical skills",
            "Excellent communicator"
        ],
        type: 'default' // Default type
    };

    function stageModalContent(data) {
        stagedModalData = { ...stagedModalData, ...data }; // Merge with default, then override with new data
    }

    function showNotification(message, type = 'default', title = "New Opportunity!") {
        if (jobNotification && notificationText && notificationTitleEl) {
            notificationTitleEl.textContent = title;
            notificationText.textContent = message;
            
            // Remove previous type classes
            jobNotification.className = 'notification'; // Reset to base class
            jobNotification.classList.add(`notification-type-${type}`);
            
            if (notificationIcon) {
                if (type === 'complete') notificationIcon.textContent = '🎉';
                else if (type === 'skill-gap') notificationIcon.textContent = '💡';
                else if (type === 'profile-match') notificationIcon.textContent = '🌟';
                else if (type === 'application-submitted') notificationIcon.textContent = '✅';
                else notificationIcon.textContent = 'ℹ️'; // Default icon
            }

            jobNotification.classList.add('show');
            setTimeout(() => {
                jobNotification.classList.remove('show');
            }, 5000); // Hide after 5 seconds
        }
    }

    if (jobNotification) {
        jobNotification.addEventListener('click', () => {
            // jobNotification.classList.remove('show'); // Notification hides on timeout or new notification
            openModal(); // Open the job modal with currently staged data
        });
    }
    
    // Example: Show a notification after a delay (can be triggered by other events)
    // setTimeout(() => {
    //     stageModalContent({ title: "Welcome Bonus Task", company: "Internal System", type: 'welcome' });
    //     showNotification("Welcome to your Career Catalyst dashboard!", 'welcome');
    // }, 2000);


    // Job Modal Logic
    const jobModal = document.getElementById('jobModal');
    const jobModalContent = jobModal ? jobModal.querySelector('.job-content') : null;
    const jobTitleEl = jobModal ? jobModal.querySelector('.job-title') : null;
    const companyBadgeEl = jobModal ? jobModal.querySelector('.company-badge') : null;
    const jobTagsContainerEl = jobModal ? jobModal.querySelector('.job-tags') : null;
    const matchIndicatorEl = jobModal ? jobModal.querySelector('.match-indicator') : null;
    const matchIndicatorIconEl = matchIndicatorEl ? matchIndicatorEl.querySelector('span:first-child') : null;
    const matchIndicatorStrongEl = matchIndicatorEl ? matchIndicatorEl.querySelector('strong') : null;
    const matchIndicatorPEl = matchIndicatorEl ? matchIndicatorEl.querySelector('p') : null;
    const responsibilitiesListEl = jobModal ? document.getElementById('jobModalResponsibilities') : null;
    const strengthsListEl = jobModal ? document.getElementById('jobModalStrengths') : null;

    function updateJobModal(data) {
        if (!jobModal || !jobModalContent) return;

        if (jobTitleEl) jobTitleEl.textContent = data.title;
        if (companyBadgeEl) companyBadgeEl.textContent = data.company;
        
        if (jobTagsContainerEl) {
            jobTagsContainerEl.innerHTML = ''; // Clear existing tags
            data.tags.forEach(tagText => {
                const span = document.createElement('span');
                span.classList.add('tag');
                span.textContent = tagText;
                jobTagsContainerEl.appendChild(span);
            });
        }

        if (matchIndicatorEl) {
            // Remove previous type classes
            matchIndicatorEl.className = 'match-indicator'; // Reset to base class
            matchIndicatorEl.classList.add(`modal-type-${data.type}`);
            
            if (matchIndicatorIconEl) matchIndicatorIconEl.textContent = data.matchIcon || '🎯';
            if (matchIndicatorStrongEl) matchIndicatorStrongEl.textContent = `${data.matchPercent} Match!`;
            if (matchIndicatorPEl) matchIndicatorPEl.textContent = data.matchText;
        }
        
        function populateList(ulElement, items) {
            if (ulElement) {
                ulElement.innerHTML = ''; // Clear existing items
                items.forEach(itemText => {
                    const li = document.createElement('li');
                    li.textContent = itemText;
                    ulElement.appendChild(li);
                });
            }
        }
        // Need to select these more reliably if the HTML structure is complex
        // For now, using the IDs:
        // const responsibilitiesUl = document.getElementById('jobModalResponsibilities'); // Already selected as responsibilitiesListEl
        // const strengthsUl = document.getElementById('jobModalStrengths'); // Already selected as strengthsListEl

        populateList(responsibilitiesListEl, data.responsibilities);
        populateList(strengthsListEl, data.strengths);
    }
    
    function openModal() { // This is the correct openModal function
        updateJobModal(stagedModalData); // Update content before showing
        if (jobModal) {
            jobModal.classList.add('show');
        }
    }
    const courseCards = document.querySelectorAll('.course-card'); // Example trigger

    // Global function to close modal, as it's used in inline HTML onclick
    window.closeModal = function() {
        if (jobModal) {
            jobModal.classList.remove('show');
        }
    }

    // Explainer Modal Logic
    const explainerModal = document.getElementById('explainerModal');
    // const openExplainerModalBtn = document.getElementById('openExplainerModalBtn'); // Button will be created dynamically
    const closeExplainerModalBtn = document.getElementById('closeExplainerModalBtn');

    function openExplainerModal() {
        if (explainerModal) {
            explainerModal.classList.add('show');
        }
    }

    function closeExplainerModal() {
        if (explainerModal) {
            explainerModal.classList.remove('show');
        }
    }

    // if (openExplainerModalBtn) { // Button will be created dynamically
    //     openExplainerModalBtn.addEventListener('click', openExplainerModal);
    // }

    if (closeExplainerModalBtn) {
        closeExplainerModalBtn.addEventListener('click', closeExplainerModal);
    }

    if (explainerModal) {
        explainerModal.addEventListener('click', (event) => {
            if (event.target === explainerModal) {
                closeExplainerModal();
            }
        });
    }

    if (jobModal) {
        // Close modal if backdrop is clicked
        jobModal.addEventListener('click', (event) => {
            if (event.target === jobModal) {
                closeModal();
            }
        });

        // Apply button logic
        const applyBtn = jobModal.querySelector('.apply-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                closeModal(); // Close the modal
                showNotification('Application submitted! Simulating iCIMS integration.', 'application-submitted');
            });
        }
    }

    // Example: Attach modal opening to course card clicks
    courseCards.forEach(card => {
        card.addEventListener('click', () => {
            // Potentially customize modal content based on card
            // For now, just open the generic modal
            // showNotification(`Details for ${card.querySelector('h3').textContent} clicked.`);
            // openModal(); // Let's not open modal on every course click, could be annoying.
                           // This is just an example of how to trigger it.
        });
    });


    // Demo Controls (Example Functionality)
    const demoControls = document.querySelector('.demo-controls');
    if (demoControls) {
        const pmProgress = document.getElementById('pmProgress');
        const daProgress = document.getElementById('daProgress');
        const leadProgress = document.getElementById('leadProgress');

        const demoBtnCompletePM = document.createElement('button');
        demoBtnCompletePM.classList.add('demo-btn');
        demoBtnCompletePM.textContent = 'Simulate PM Course Complete';
        demoBtnCompletePM.onclick = () => {
            if (pmProgress) pmProgress.style.width = '100%';
            const modalData = {
                title: "Senior Project Manager (Course Complete)",
                company: "TechSolutions Inc. • On-site/Hybrid",
                tags: ["PMP Certified", "Agile", "Risk Management", "$110K-$140K"],
                matchPercent: "95%",
                matchText: "Congratulations on completing Advanced Project Management! This role is an excellent fit.",
                matchIcon: "🏆",
                responsibilities: ["Lead enterprise-level projects", "Mentor junior PMs", "Budget oversight", "Client relationship management"],
                strengths: ["PMP Certification", "Agile & Waterfall", "Strong leadership", "Excellent presentation skills"],
                type: 'complete'
            };
            stageModalContent(modalData);
            showNotification('Project Management course completed! New job matches found.', 'complete', 'Breakthrough Achievement!');
        };
        
        // const demoBtnShowJob = document.createElement('button'); // Removed as per feedback
        // demoBtnShowJob.classList.add('demo-btn');
        // demoBtnShowJob.textContent = 'Show Default Job Modal';
        // demoBtnShowJob.onclick = () => {
        //     // Reset to default data or a generic example if preferred
        //     stageModalContent({ // Re-stage with default or a generic example
        //         title: "Example Job: Cloud Engineer",
        //         company: "FutureCloud Co. • Remote",
        //         tags: ["AWS", "Kubernetes", "DevOps", "$90K-$120K"],
        //         matchPercent: "75%",
        //         matchText: "This is a sample job posting. Your skills in cloud technologies are a good starting point.",
        //         matchIcon: "☁️",
        //         responsibilities: ["Design cloud infrastructure", "Automate deployments", "Monitor system performance"],
        //         strengths: ["Problem-solving", "Scripting (Python/Bash)", "Familiarity with CI/CD"],
        //         type: 'default'
        //     });
        //     openModal();
        // };

        const demoBtnResetProgress = document.createElement('button');
        demoBtnResetProgress.classList.add('demo-btn');
        demoBtnResetProgress.textContent = 'Reset Progress';
        demoBtnResetProgress.onclick = () => {
            if (pmProgress) pmProgress.style.width = '85%';
            if (daProgress) daProgress.style.width = '60%';
            if (leadProgress) leadProgress.style.width = '30%';
            showNotification('Progress has been reset to demo values.', 'default');
        };

        const demoBtnShowExplainer = document.createElement('button');
        demoBtnShowExplainer.classList.add('demo-btn', 'explainer-btn');
        demoBtnShowExplainer.textContent = 'Explainer';
        demoBtnShowExplainer.onclick = () => {
            openExplainerModal();
        };

        const demoBtnSkillGap = document.createElement('button');
        demoBtnSkillGap.classList.add('demo-btn');
        demoBtnSkillGap.textContent = 'Simulate Skill Gap Hook';
        demoBtnSkillGap.onclick = () => {
            const modalData = {
                title: "Project Coordinator (Skill Gap)",
                company: "Internal Mobility Program • HQ",
                tags: ["Agile Basics", "Communication", "Organization", "Entry-Level Growth"],
                matchPercent: "85%",
                matchText: "You're developing 'Agile' skills! This internal role is a great step to apply them.",
                matchIcon: "🌱",
                responsibilities: ["Assist senior PMs", "Track project timelines", "Prepare status reports", "Coordinate team meetings"],
                strengths: ["Eagerness to learn Agile", "Good organizational skills", "Team player"],
                type: 'skill-gap'
            };
            stageModalContent(modalData);
            showNotification("Developing 'Agile'! An internal Project Coordinator role just opened.", 'skill-gap', 'Skill Growth Opportunity!');
        };

        const demoBtnProfileHook = document.createElement('button');
        demoBtnProfileHook.classList.add('demo-btn');
        demoBtnProfileHook.textContent = 'Simulate Profile-Based Hook';
        demoBtnProfileHook.onclick = () => {
            const modalData = {
                title: "Senior PM (Profile Match)",
                company: "Innovatech Solutions • Global Remote",
                tags: ["Strategic Planning", "Global Teams", "SaaS Products", "$120K-$150K"],
                matchPercent: "92%",
                matchText: "Matches your 'Senior Project Manager' goal! This role at Innovatech aligns with your aspirations.",
                matchIcon: "🎯",
                responsibilities: ["Define project roadmaps", "Lead international project teams", "Drive SaaS product delivery", "Manage executive stakeholders"],
                strengths: ["Aspiration for Sr. PM", "Tech Industry Focus (assumed)", "Strong communication (assumed)"],
                type: 'profile-match'
            };
            stageModalContent(modalData);
            showNotification("Goal: 'Senior PM'. New external Sr. PM role at 'Innovatech' matches!", 'profile-match', 'Career Goal Match!');
        };

        demoControls.appendChild(demoBtnCompletePM);
        demoControls.appendChild(demoBtnSkillGap);
        demoControls.appendChild(demoBtnProfileHook);
        // demoControls.appendChild(demoBtnShowJob); // Removed
        demoControls.appendChild(demoBtnShowExplainer); 
        demoControls.appendChild(demoBtnResetProgress); // Reset is last
    }

    // Update 'lastUpdate' for Skill Radar
    const lastUpdateSpan = document.getElementById('lastUpdate');
    if (lastUpdateSpan) {
        const now = new Date();
        lastUpdateSpan.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    // Active navigation link
    // This is a simple version. For a real SPA or multi-page site, this would be more complex.
    const navLinks = document.querySelectorAll('.main-navigation a');
    const currentPath = window.location.pathname.split("/").pop(); // Gets the current file name e.g., index.html

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split("/").pop();
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) { // Handle root path
            link.classList.add('active');
        }
        link.addEventListener('click', function() {
            navLinks.forEach(node => node.classList.remove('active'));
            this.classList.add('active');
        });
    });

});
