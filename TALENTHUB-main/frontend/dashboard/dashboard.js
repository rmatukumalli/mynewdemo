document.addEventListener('DOMContentLoaded', () => {
    const dashboardContentEl = document.getElementById('dashboard-content');
    
    if (!dashboardContentEl) {
        console.error("Dashboard content element not found!");
        return;
    }

    // Function to create a loading spinner element
    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        return spinner;
    }

    // Function to create a summary card (3.3)
    function createSummaryCard(title, count, iconClass = 'fas fa-info-circle') { // Using Font Awesome class as example
        const card = document.createElement('div');
        card.className = 'summary-card';
        
        // Basic icon placeholder, replace with actual icon library if used
        const iconEl = document.createElement('div');
        iconEl.className = 'icon';
        // iconEl.innerHTML = `<i class="${iconClass}"></i>`; // Example if using Font Awesome
        iconEl.textContent = '📊'; // Simple emoji placeholder

        const titleEl = document.createElement('h3');
        titleEl.textContent = title;

        const countEl = document.createElement('p');
        countEl.className = 'count';
        countEl.textContent = count;

        card.appendChild(iconEl);
        card.appendChild(titleEl);
        card.appendChild(countEl);
        return card;
    }

    // Function to display summary counts (3.2, 3.3)
    async function displaySummaryCounts() {
        const countsContainer = document.createElement('div');
        countsContainer.id = 'summary-counts-container'; // For styling if needed
        countsContainer.style.display = 'grid'; // Use grid from dashboard.css
        countsContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        countsContainer.style.gap = '1rem';
        
        const spinner = createLoadingSpinner();
        dashboardContentEl.appendChild(spinner);

        try {
            const counts = await getSummaryCounts(); // From api.js
            spinner.remove(); // Remove spinner once data is fetched

            countsContainer.appendChild(createSummaryCard('Total Skills', counts.skills));
            countsContainer.appendChild(createSummaryCard('Total Capabilities', counts.capabilities));
            countsContainer.appendChild(createSummaryCard('Total Competencies', counts.competencies));
            countsContainer.appendChild(createSummaryCard('Total Behaviors', counts.behaviors));
            
            dashboardContentEl.appendChild(countsContainer);

        } catch (error) {
            spinner.remove();
            dashboardContentEl.innerHTML = '<p>Error loading summary counts. Please try again later.</p>';
            console.error("Failed to display summary counts:", error);
        }
    }

    // Function to display recent activity feed (3.4)
    async function displayRecentActivity() {
        const activitySection = document.createElement('div');
        activitySection.className = 'recent-activity dashboard-section'; // dashboard-section for full width

        const titleEl = document.createElement('h2');
        titleEl.textContent = 'Recent Activity';
        activitySection.appendChild(titleEl);
        
        const spinner = createLoadingSpinner();
        activitySection.appendChild(spinner);
        dashboardContentEl.appendChild(activitySection); // Add section to dashboard

        try {
            const logs = await getRecentAuditLogs(5); // From api.js
            spinner.remove();

            if (logs.length === 0) {
                activitySection.innerHTML += '<p>No recent activity found.</p>';
                return;
            }

            const ul = document.createElement('ul');
            logs.forEach(log => {
                const li = document.createElement('li');
                
                const actionText = document.createElement('span');
                actionText.textContent = `${log.action} (User: ${log.user || 'System'})`;
                li.appendChild(actionText);

                const timestampText = document.createElement('span');
                timestampText.className = 'log-timestamp';
                timestampText.textContent = new Date(log.timestamp).toLocaleString(); // Format timestamp
                li.appendChild(timestampText);
                
                ul.appendChild(li);
            });
            activitySection.appendChild(ul);

        } catch (error) {
            spinner.remove();
            activitySection.innerHTML += '<p>Error loading recent activity. Please try again later.</p>';
            console.error("Failed to display recent activity:", error);
        }
    }
    
    // Initialize dashboard
    async function initDashboard() {
        dashboardContentEl.innerHTML = ''; // Clear any existing content or placeholders
        await displaySummaryCounts();
        await displayOntologyData(); // Display detailed ontology lists
        await displayRecentActivity();
    }

    // Function to display detailed ontology data
    async function displayOntologyData() {
        const ontologyContainer = document.createElement('div');
        ontologyContainer.id = 'ontology-details-container';
        dashboardContentEl.appendChild(ontologyContainer);

        const types = [
            { name: 'Capabilities', fetchFunc: getAllCapabilities },
            { name: 'Competencies', fetchFunc: getAllCompetencies },
            { name: 'Behaviors', fetchFunc: getAllBehaviors },
            { name: 'Skills', fetchFunc: getAllSkills },
            // Proficiencies might be better viewed in context of a skill, but listing them for completeness
            { name: 'Proficiencies (Templates)', fetchFunc: getAllProficiencies } 
        ];

        for (const type of types) {
            const section = document.createElement('section');
            section.className = `ontology-section ${type.name.toLowerCase()}-section dashboard-section`;
            
            const titleEl = document.createElement('h2');
            titleEl.textContent = type.name;
            section.appendChild(titleEl);

            const spinner = createLoadingSpinner();
            section.appendChild(spinner);
            ontologyContainer.appendChild(section);

            try {
                const items = await type.fetchFunc();
                spinner.remove();

                if (items.length === 0) {
                    section.innerHTML += `<p>No ${type.name.toLowerCase()} found.</p>`;
                    continue;
                }

                const ul = document.createElement('ul');
                ul.className = 'ontology-list';
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'ontology-item';
                    
                    const nameEl = document.createElement('strong');
                    nameEl.textContent = item.name;
                    li.appendChild(nameEl);

                    if (item.description) {
                        const descEl = document.createElement('p');
                        descEl.textContent = item.description;
                        li.appendChild(descEl);
                    }
                    // Add more details as needed, e.g., item.id, relationships
                    ul.appendChild(li);
                });
                section.appendChild(ul);

            } catch (error) {
                spinner.remove();
                section.innerHTML += `<p>Error loading ${type.name.toLowerCase()}. Please try again later.</p>`;
                console.error(`Failed to display ${type.name}:`, error);
            }
        }
    }

    initDashboard();
});
