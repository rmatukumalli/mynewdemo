document.addEventListener('DOMContentLoaded', () => {
    // 1. Mock Data (Local JSON Array)
    // TODO: Replace with actual data fetching or AI recommendation logic
    const mockLearningData = [
        {
            id: 1,
            title: "Introduction to Machine Learning",
            type: "course", // course, article, video, book
            duration: "long", // short (<1hr), medium (1-5hrs), long (5+hrs)
            description: "A comprehensive introduction to the basic concepts of machine learning.",
            source: "Coursera",
            platform: "coursera",
            aspirationalRole: "Data Scientist"
        },
        {
            id: 2,
            title: "Python for Data Analysis",
            type: "book",
            duration: "long",
            description: "Learn how to use Python for manipulating, processing, cleaning, and crunching data.",
            source: "O'Reilly",
            platform: "internal", // Assuming internal library access
            aspirationalRole: "Data Scientist"
        },
        {
            id: 3,
            title: "Effective Product Roadmapping",
            type: "article",
            duration: "short",
            description: "A quick guide to creating and managing product roadmaps effectively.",
            source: "Product School Blog",
            platform: "internal", // Assuming internal portal
            aspirationalRole: "Product Manager"
        },
        {
            id: 4,
            title: "User Story Mapping Workshop",
            type: "course",
            duration: "medium",
            description: "Hands-on workshop to learn user story mapping techniques.",
            source: "Udemy",
            platform: "udemy",
            aspirationalRole: "Product Manager"
        },
        {
            id: 5,
            title: "Fundamentals of UX Design",
            type: "course",
            duration: "long",
            description: "Explore the core principles of User Experience design.",
            source: "Interaction Design Foundation",
            platform: "coursera", // Example
            aspirationalRole: "UX Designer"
        },
        {
            id: 6,
            title: "JavaScript Algorithms and Data Structures",
            type: "course",
            duration: "long",
            description: "Master common algorithms and data structures in JavaScript.",
            source: "freeCodeCamp",
            platform: "youtube", // Example
            aspirationalRole: "Software Engineer"
        },
        {
            id: 7,
            title: "Advanced CSS and Sass",
            type: "book",
            duration: "medium",
            description: "Deep dive into modern CSS techniques and Sass for scalable stylesheets.",
            source: "A Book Apart",
            platform: "internal",
            aspirationalRole: "Software Engineer"
        },
        {
            id: 8,
            title: "The Lean Startup",
            type: "book",
            duration: "medium",
            description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.",
            source: "Eric Ries",
            platform: "internal",
            aspirationalRole: "Product Manager"
        },
        {
            id: 9,
            title: "Deep Learning Specialization",
            type: "course",
            duration: "long",
            description: "Break into AI with this comprehensive specialization by Andrew Ng.",
            source: "Coursera",
            platform: "coursera",
            aspirationalRole: "Data Scientist"
        },
        {
            id: 10,
            title: "Designing User Interfaces",
            type: "article",
            duration: "short",
            description: "Best practices for designing intuitive and effective user interfaces.",
            source: "Smashing Magazine",
            platform: "internal",
            aspirationalRole: "UX Designer"
        }
    ];

    const contentDisplay = document.getElementById('learning-content-display');
    const searchBar = document.getElementById('search-bar');
    const contentTypeFilters = document.querySelectorAll('input[name="content-type"]');
    const durationFilters = document.querySelectorAll('input[name="duration"]');
    const platformFilters = document.querySelectorAll('input[name="platform"]');
    const jobRoleFilter = document.getElementById('job-role-filter');

    // Function to load items from localStorage and add to mockData
    function loadUserLearningPlanItems() {
        const storedItems = JSON.parse(localStorage.getItem('userLearningPlan')) || [];
        if (storedItems.length > 0) {
            storedItems.forEach(item => {
                // Ensure it's not already in mockLearningData by a simple check (e.g. title and role)
                // A more robust check might use a unique ID if available/generated
                const exists = mockLearningData.some(mockItem => 
                    mockItem.title === item.skillName && mockItem.aspirationalRole === item.targetRoleName
                );

                if (!exists) {
                    mockLearningData.push({
                        id: mockLearningData.length + 1 + Math.random(), // Create a somewhat unique ID
                        title: item.skillName,
                        type: item.type || "course",
                        duration: item.duration || "medium",
                        description: item.description || `User-added: ${item.skillName} for ${item.targetRoleName}`,
                        source: item.source || "User Added",
                        platform: item.platform || "internal", // Default platform
                        aspirationalRole: item.targetRoleName 
                    });
                }
            });
            localStorage.removeItem('userLearningPlan'); // Clear after processing
        }
    }


    // 2. Render Content Function
    function renderContent(dataToRender) {
        contentDisplay.innerHTML = ''; // Clear previous content

        if (dataToRender.length === 0) {
            contentDisplay.innerHTML = '<p class="no-results-message">No recommendations match your current filters.</p>';
            return;
        }

        // Group content by aspirational role
        const groupedByRole = dataToRender.reduce((acc, item) => {
            const role = item.aspirationalRole;
            if (!acc[role]) {
                acc[role] = [];
            }
            acc[role].push(item);
            return acc;
        }, {});

        for (const role in groupedByRole) {
            const section = document.createElement('section');
            section.className = 'job-role-section';
            section.innerHTML = `<h3>Aspirational Role: ${role}</h3>`;

            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'content-cards';

            groupedByRole[role].forEach(item => {
                const card = document.createElement('div');
                card.className = 'content-card';
                card.innerHTML = `
                    <h4>${item.title}</h4>
                    <p class="card-meta"><strong>Type:</strong> ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                    <p class="card-meta"><strong>Duration:</strong> ${getDurationText(item.duration)}</p>
                    <p class="card-meta"><strong>Source:</strong> ${item.source}</p>
                    <p>${item.description}</p>
                `;
                cardsContainer.appendChild(card);
            });
            section.appendChild(cardsContainer);
            contentDisplay.appendChild(section);
        }
    }

    function getDurationText(durationKey) {
        switch (durationKey) {
            case 'short': return '< 1 Hour';
            case 'medium': return '1-5 Hours';
            case 'long': return '5+ Hours';
            default: return 'N/A';
        }
    }

    // 3. Apply Filters and Search Function
    function applyFiltersAndSearch() {
        const searchTerm = searchBar.value.toLowerCase();

        const selectedContentTypes = Array.from(contentTypeFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const selectedDuration = Array.from(durationFilters).find(rb => rb.checked)?.value;

        const selectedPlatforms = Array.from(platformFilters)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const selectedJobRoles = Array.from(jobRoleFilter.selectedOptions).map(option => option.textContent); // Using textContent for role name

        let filteredData = mockLearningData.filter(item => {
            // Search term filter (title or description)
            const matchesSearch = searchTerm === '' ||
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm);

            // Content type filter
            const matchesContentType = selectedContentTypes.length === 0 ||
                selectedContentTypes.includes(item.type);

            // Duration filter
            const matchesDuration = !selectedDuration || selectedDuration === 'all' ||
                item.duration === selectedDuration;

            // Platform filter
            const matchesPlatform = selectedPlatforms.length === 0 ||
                selectedPlatforms.includes(item.platform);

            // Job role filter
            const matchesJobRole = selectedJobRoles.length === 0 ||
                selectedJobRoles.includes(item.aspirationalRole);

            return matchesSearch && matchesContentType && matchesDuration && matchesPlatform && matchesJobRole;
        });

        renderContent(filteredData);
    }

    // Initial load from localStorage and then render
    loadUserLearningPlanItems();
    renderContent(mockLearningData);

    // Event Listeners for filters
    searchBar.addEventListener('input', applyFiltersAndSearch);
    contentTypeFilters.forEach(cb => cb.addEventListener('change', applyFiltersAndSearch));
    durationFilters.forEach(rb => rb.addEventListener('change', applyFiltersAndSearch));
    platformFilters.forEach(cb => cb.addEventListener('change', applyFiltersAndSearch));
    jobRoleFilter.addEventListener('change', applyFiltersAndSearch);

    // Placeholder for future AI/data integration
    // function fetchAndRenderRecommendations() {
    //     // TODO: Implement API call or AI logic here
    //     console.log("Fetching recommendations from a dynamic source...");
    //     // Example: fetch('/api/recommendations?userId=123')
    //     //     .then(response => response.json())
    //     //     .then(data => {
    //     //         mockLearningData = data; // Update mock data or use a separate state
    //     //         renderContent(mockLearningData);
    //     //     })
    //     //     .catch(error => console.error('Error fetching recommendations:', error));
    // }
    // fetchAndRenderRecommendations(); // Call this if you want to load data dynamically on page load
});
