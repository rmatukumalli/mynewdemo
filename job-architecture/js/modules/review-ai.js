const reviewAIModule = {
    init: function(appData, openModal, closeModal, updateWizardState, getFormHTML, callAPI, contentWrapper, navigation) {
        this.navigation = navigation;
        this.renderWizardProgress();
        this.renderDataValidationIssues();
        this.renderAIPoweredInsights();
    },

    renderWizardProgress: function() {
        const checklistContainer = document.getElementById('wizard-progress-checklist');
        if (!checklistContainer) return;
        const checklistData = [
            { name: 'Organization Setup', description: 'Organization details including industry defined.', status: 'Complete', step: 1 },
            { name: 'Business Units', description: 'Business units with organizational links and details defined.', status: 'Complete', step: 2 },
            { name: 'Departments', description: 'Departments with job functions defined.', status: 'Complete', step: 3 },
            { name: 'Role Groups', description: 'Role groups with job families and categories defined.', status: 'Complete', step: 4 },
            { name: 'Job Levels', description: 'Standardized job levels with role and skill levels defined.', status: 'Complete', step: 5 },
            { name: 'Add Jobs & Skills', description: 'Job roles with behavioral anchors, associated skills, and proficiency levels defined.', status: 'Complete', step: 7 }, // Note: Step 6 is AI Wizard, Step 7 is Add Jobs & Skills
            { name: 'Skill Gaps', description: 'Initial skill gap analysis performed.', status: 'Not Started', step: 8 }, // Assuming this is still 'Not Started'
            { name: 'Career Paths', description: 'Define career progression paths.', status: 'Not Started', step: 9 } // Assuming this is still 'Not Started'
        ];

        const getStatusChip = (status) => {
            switch (status) {
                case 'Complete': return `<span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Complete</span>`;
                case 'In Progress': return `<span class="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">In Progress</span>`;
                case 'Not Started': return `<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Not Started</span>`;
                default: return '';
            }
        };

        const checklistHTML = checklistData.map(item => `
            <div class="flex items-center justify-between p-3 border-b">
                <div>
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-sm text-gray-600">${item.description}</p>
                </div>
                <div class="flex items-center">
                    ${getStatusChip(item.status)}
                    <button class="text-sm text-blue-600 hover:underline" data-step="${item.step}">Edit/Review</button>
                </div>
            </div>
        `).join('');

        checklistContainer.innerHTML = checklistHTML;
        this.addNavigationEventListeners(checklistContainer);
    },

    renderDataValidationIssues: function() {
        const issuesContainer = document.getElementById('data-validation-issues');
        if (!issuesContainer) return;
        const issuesData = [
            { priority: 'High', text: "Role 'Lead Pilot' in 'Flight Operations' has no defined job level. Please assign a level in Step 5.", step: 5 },
            { priority: 'Medium', text: "Department 'Ground Crew Support' has no jobs assigned. Add jobs in Step 6.", step: 6 },
            { priority: 'Low', text: "Skill 'Basic First Aid' suggested for 'Cabin Crew' is not yet mapped to the skill ontology. Review in Step 7.", step: 7 },
            { priority: 'High', text: "Job 'Maintenance Trainee' does not have a career path defined. Create paths in Step 8.", step: 8 }
        ];

        const getPriorityClass = (priority) => {
            switch (priority) {
                case 'High': return 'border-red-500 bg-red-50';
                case 'Medium': return 'border-yellow-500 bg-yellow-50';
                case 'Low': return 'border-blue-500 bg-blue-50';
                default: return 'border-gray-300';
            }
        };

        const issuesHTML = issuesData.map(issue => `
            <div class="p-3 border-l-4 ${getPriorityClass(issue.priority)} mb-3">
                <p class="text-sm">
                    <span class="font-bold">${issue.priority} Priority:</span>
                    ${issue.text}
                    <a href="#" class="text-blue-600 hover:underline ml-2" data-step="${issue.step}">Fix Issue (Step ${issue.step})</a>
                </p>
            </div>
        `).join('');

        issuesContainer.innerHTML = issuesHTML;
        this.addNavigationEventListeners(issuesContainer);
    },

    renderAIPoweredInsights: function() {
        const insightsContainer = document.getElementById('ai-powered-insights');
        if (!insightsContainer) return;
        const insightsData = [
            { title: 'Strategic Alignment', text: "The current job architecture shows a strong focus on <strong>Flight Operations</strong> and <strong>Maintenance</strong>. Consider expanding roles in <strong>Data Analytics & AI</strong> to support future strategic initiatives like predictive maintenance and personalized passenger experiences.", icon: 'strategic' },
            { title: 'Skill Gap Concentration', text: "A significant number of 'AI Suggested Skills' are appearing in newly created engineering roles. This indicates a potential gap between current ontology and emerging technology needs. Prioritize review and integration of these skills.", icon: 'gap' },
            { title: 'Career Path Bottleneck', text: "Analysis of job levels suggests a potential bottleneck for progression from <strong>L3 (Senior Staff)</strong> to <strong>L4 (Lead/Supervisor)</strong> roles in technical job families. Review requirements for L4 roles or create more L4 opportunities.", icon: 'bottleneck' },
            { title: 'Inconsistent Job Titling', text: "Found instances where similar roles across different departments (e.g., 'Project Coordinator' in 'Engineering' vs. 'Project Support Officer' in 'IT') have varying levels or skill requirements. Recommend standardizing titles and core competencies for similar functions.", icon: 'titling' },
            { title: 'High-Value Role Development', text: "The 'A350 Type-Rated Captain' role has a high density of critical and advanced skills. Consider developing a specialized leadership and technical upskilling program for First Officers aspiring to this role.", icon: 'high-value' },
            { title: 'Redundant Skills', text: "Multiple jobs list both 'Agile Project Management' and 'Scrum Methodology' as separate skills. These could be consolidated or clarified to avoid redundancy in skill mapping.", icon: 'redundant' }
        ];

        const getIcon = (icon) => {
            // In a real app, you might use an icon library or SVG sprites
            const iconMap = {
                strategic: 'M13 10V3L4 14h7v7l9-11h-7z',
                gap: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5',
                bottleneck: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
                titling: 'M20.947 13.053a9 9 0 11-1.893-1.893',
                'high-value': 'M5 13l4 4L19 7',
                redundant: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            };
            return `<svg class="w-6 h-6 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconMap[icon] || ''}"></path></svg>`;
        };

        const insightsHTML = insightsData.map(insight => `
            <div class="bg-white p-4 rounded-lg shadow mb-4">
                <div class="flex items-start">
                    ${getIcon(insight.icon)}
                    <div>
                        <h4 class="font-semibold text-md mb-1">${insight.title}</h4>
                        <p class="text-sm text-gray-600">${insight.text}</p>
                    </div>
                </div>
            </div>
        `).join('');

        insightsContainer.innerHTML = insightsHTML;
    },

    addNavigationEventListeners: function(container) {
        container.addEventListener('click', (e) => {
            const target = e.target.closest('button[data-step], a[data-step]');
            if (target && this.navigation) {
                e.preventDefault();
                const step = target.dataset.step;
                this.navigation.navigateToStep(step);
            }
        });
    }
};

window.reviewAIModule = reviewAIModule;
