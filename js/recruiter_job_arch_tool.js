document.addEventListener('DOMContentLoaded', () => {
    console.log('Recruiter Job Architecture Tool JS Loaded');

    const jobSearchInput = document.getElementById('job-search-input');
    const jobSearchBtn = document.getElementById('job-search-btn');
    const searchResultsContainer = document.getElementById('search-results-container');
    const createNewProfileBtn = document.getElementById('create-new-profile-btn');
    const createNewJobProfileContent = document.getElementById('create-new-job-profile-content');
    const searchJobProfileSection = document.getElementById('search-job-profile');
    const createNewJobProfileInitiatorSection = document.getElementById('create-new-job-profile-initiator');

    // --- Mock Data for Job Profiles (replace with actual data source/API call) ---
    const existingJobProfiles = [
        { 
            id: 'jp001', 
            title: 'Senior Software Engineer', 
            family: 'Engineering', 
            level: 'IC3', 
            department: 'Technology', 
            summary: 'Designs, develops, and maintains complex software applications using Java and Spring Boot.',
            skills: ['Java', 'Spring Boot', 'Microservices', 'Agile', 'SQL', 'Docker'],
            responsibilities: 'Write clean, scalable code. Participate in code reviews. Mentor junior engineers. Troubleshoot and debug applications.'
        },
        { 
            id: 'jp002', 
            title: 'Product Manager', 
            family: 'Product Management', 
            level: 'IC4', 
            department: 'Product',
            summary: 'Defines product vision, strategy, and roadmap. Works closely with engineering, design, and marketing.',
            skills: ['Product Strategy', 'User Research', 'Agile', 'Jira', 'Roadmapping', 'Market Analysis'],
            responsibilities: 'Gather and prioritize product and customer requirements. Define the product vision. Work with cross-functional teams to deliver products.'
        },
        { 
            id: 'jp003', 
            title: 'UX Designer', 
            family: 'Design', 
            level: 'IC2', 
            department: 'Design',
            summary: 'Creates user-centered designs for web and mobile applications, focusing on usability and user experience.',
            skills: ['Figma', 'User Research', 'Prototyping', 'Usability Testing', 'Wireframing', 'UI Design'],
            responsibilities: 'Conduct user research and testing. Create wireframes, storyboards, user flows, process flows and site maps. Collaborate with product managers and engineers.'
        },
        {
            id: 'jp004',
            title: 'Data Scientist',
            family: 'Data & Analytics',
            level: 'IC3',
            department: 'Analytics',
            summary: 'Applies statistical analysis and machine learning techniques to solve complex business problems.',
            skills: ['Python', 'R', 'Machine Learning', 'Statistical Analysis', 'SQL', 'Data Visualization'],
            responsibilities: 'Develop predictive models. Analyze large datasets. Communicate findings to stakeholders.'
        },
        {
            id: 'jp005',
            title: 'Marketing Specialist',
            family: 'Marketing',
            level: 'IC2',
            department: 'Marketing',
            summary: 'Executes marketing campaigns and supports various marketing initiatives to promote products and services.',
            skills: ['Digital Marketing', 'SEO/SEM', 'Content Creation', 'Social Media Marketing', 'Email Marketing'],
            responsibilities: 'Manage social media channels. Create marketing content. Track campaign performance.'
        },
        {
            id: 'jp006',
            title: 'HR Business Partner',
            family: 'Human Resources',
            level: 'M1',
            department: 'Human Resources',
            summary: 'Partners with business units to provide HR guidance and support on talent management, employee relations, and organizational development.',
            skills: ['Employee Relations', 'Talent Management', 'HR Policies', 'Performance Management', 'Communication'],
            responsibilities: 'Consult with management on HR-related issues. Manage and resolve complex employee relations issues. Develop and implement HR strategies.'
        },
        {
            id: 'jp007',
            title: 'Sales Executive',
            family: 'Sales',
            level: 'IC3',
            department: 'Sales',
            summary: 'Drives sales revenue by identifying and closing new business opportunities.',
            skills: ['B2B Sales', 'Negotiation', 'CRM (Salesforce)', 'Lead Generation', 'Closing Skills'],
            responsibilities: 'Develop sales pipeline. Present products to prospective clients. Achieve sales targets.'
        },
        {
            id: 'jp008',
            title: 'DevOps Engineer',
            family: 'Engineering',
            level: 'IC3',
            department: 'Technology',
            summary: 'Manages and improves CI/CD pipelines, infrastructure automation, and system reliability.',
            skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Python Scripting'],
            responsibilities: 'Build and maintain CI/CD pipelines. Automate infrastructure provisioning. Monitor system performance and security.'
        },
        {
            id: 'jp009',
            title: 'Customer Support Manager',
            family: 'Customer Service',
            level: 'M2',
            department: 'Customer Experience',
            summary: 'Leads a team of customer support representatives to ensure excellent service and customer satisfaction.',
            skills: ['Team Leadership', 'Customer Service Management', 'Zendesk', 'Problem Solving', 'Conflict Resolution'],
            responsibilities: 'Manage daily operations of the support team. Develop and implement customer service policies. Handle escalated customer issues.'
        },
        {
            id: 'jp010',
            title: 'Junior Accountant',
            family: 'Finance',
            level: 'IC1',
            department: 'Finance',
            summary: 'Assists with daily accounting tasks, including accounts payable, accounts receivable, and financial reporting.',
            skills: ['Accounting Principles', 'Excel', 'QuickBooks', 'Attention to Detail', 'Data Entry'],
            responsibilities: 'Process invoices and payments. Reconcile bank statements. Assist with month-end closing procedures.'
        }
    ];

    // --- Event Listeners ---
    if (jobSearchBtn) {
        jobSearchBtn.addEventListener('click', handleJobSearch);
    }
    if (jobSearchInput) {
        jobSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleJobSearch();
            }
        });
    }

    if (createNewProfileBtn) {
        createNewProfileBtn.addEventListener('click', showCreateNewProfileForm);
    }

    // --- Functions ---
    function handleJobSearch() {
        const searchTerm = jobSearchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            searchResultsContainer.innerHTML = '<p class="text-sm text-gray-500">Please enter a job title or keyword to search.</p>';
            return;
        }

        const results = existingJobProfiles.filter(profile => 
            profile.title.toLowerCase().includes(searchTerm) ||
            profile.summary.toLowerCase().includes(searchTerm) ||
            profile.skills.some(skill => skill.toLowerCase().includes(searchTerm))
        );

        renderSearchResults(results);
    }

    function renderSearchResults(results) {
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<p class="text-sm text-gray-500">No matching job profiles found.</p>';
            return;
        }

        searchResultsContainer.innerHTML = `
            <h4 class="text-md font-semibold text-gray-700 mb-3">Search Results (${results.length}):</h4>
            <div class="space-y-3">
                ${results.map(profile => `
                    <div class="search-result-item p-4 border rounded-md shadow-sm hover:bg-gray-50">
                        <h5 class="text-lg font-semibold text-blue-600">${profile.title}</h5>
                        <p class="text-sm text-gray-600 mb-1"><strong>Level:</strong> ${profile.level} | <strong>Family:</strong> ${profile.family}</p>
                        <p class="text-sm text-gray-500 mb-2"><strong>Summary:</strong> ${profile.summary}</p>
                        <p class="text-sm text-gray-500 mb-2"><strong>Skills:</strong> ${profile.skills.join(', ')}</p>
                        <div class="mt-3">
                            <button class="view-details-btn text-sm text-blue-500 hover:underline mr-3" data-profile-id="${profile.id}">View Full Details</button>
                            <button class="select-profile-btn text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600" data-profile-id="${profile.id}">Select & Create Requisition</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add event listeners for dynamically created buttons
        searchResultsContainer.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => alert(`Viewing details for profile ID: ${e.target.dataset.profileId} (Not implemented yet)`));
        });
        searchResultsContainer.querySelectorAll('.select-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => alert(`Selected profile ID: ${e.target.dataset.profileId} to create requisition (Not implemented yet)`));
        });
    }

    function showCreateNewProfileForm() {
        // Hide search and initiator sections
        if(searchJobProfileSection) searchJobProfileSection.classList.add('hidden');
        if(createNewJobProfileInitiatorSection) createNewJobProfileInitiatorSection.classList.add('hidden');
        
        // Show the content area for new profile form
        if (createNewJobProfileContent) {
            createNewJobProfileContent.classList.remove('hidden');
            // Dynamically load or build the form for Step 2.1, 2.2, 2.3, 2.4 here
            // For now, just a placeholder. This will be expanded in next steps.
            createNewJobProfileContent.innerHTML = `
                <div class="form-section">
                    <h3 class="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Step 2: Create New Job Profile</h3>
                    
                    <!-- Step 2.1: Basic Info -->
                    <section id="step-2-1-basic-info" class="mb-6">
                        <h4 class="text-lg font-medium text-gray-700 mb-3">2.1 Basic Information</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="newJobTitle" class="block text-sm font-medium text-gray-700">Job Title *</label>
                                <input type="text" id="newJobTitle" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div>
                                <label for="newJobFamily" class="block text-sm font-medium text-gray-700">Job Family *</label>
                                <select id="newJobFamily" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                    <option value="">Select Job Family</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Product Management">Product Management</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Human Resources">Human Resources</option>
                                </select>
                            </div>
                            <div>
                                <label for="newJobLevel" class="block text-sm font-medium text-gray-700">Suggested Job Level *</label>
                                <input type="text" id="newJobLevel" placeholder="e.g., IC3, M1" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            </div>
                            <div>
                                <label for="newDepartment" class="block text-sm font-medium text-gray-700">Department *</label>
                                <input type="text" id="newDepartment" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            </div>
                             <div>
                                <label for="newWorkLocation" class="block text-sm font-medium text-gray-700">Work Location</label>
                                <input type="text" id="newWorkLocation" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            </div>
                        </div>
                    </section>

                    <!-- Step 2.2: Define Role Group and Role Level (Simplified for now) -->
                     <section id="step-2-2-role-group-level" class="mb-6">
                        <h4 class="text-lg font-medium text-gray-700 mb-3">2.2 Role Group & Level Name</h4>
                         <div>
                            <label for="newRoleLevelName" class="block text-sm font-medium text-gray-700">Role Level Name (e.g., Sr. Frontend Developer – IC3)</label>
                            <input type="text" id="newRoleLevelName" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        </div>
                    </section>


                    <!-- Step 2.3: Add Job Description Content -->
                    <section id="step-2-3-jd-content" class="mb-6">
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="text-lg font-medium text-gray-700">2.3 Job Description Content</h4>
                            <button id="generate-with-ai-btn" class="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 3.5a1.5 1.5 0 013 0V5a1.5 1.5 0 01-3 0V3.5zM10 15a1.5 1.5 0 013 0v1.5a1.5 1.5 0 01-3 0V15zM4.5 10a1.5 1.5 0 000 3h1.5a1.5 1.5 0 000-3H4.5zm10.5 0a1.5 1.5 0 000 3h1.5a1.5 1.5 0 000-3h-1.5zM10 4.5a1.5 1.5 0 01-3 0V3a1.5 1.5 0 013 0v1.5zM10 13a1.5 1.5 0 01-3 0v-1.5a1.5 1.5 0 013 0V13zM15.5 10a1.5 1.5 0 000-3h-1.5a1.5 1.5 0 000 3h1.5zM3 10a1.5 1.5 0 000-3H1.5a1.5 1.5 0 000 3H3z" />
                                </svg>
                                Generate/Update with AI
                            </button>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label for="newRoleSummary" class="block text-sm font-medium text-gray-700">Role Summary *</label>
                                <textarea id="newRoleSummary" rows="3" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                            <div>
                                <label for="newResponsibilities" class="block text-sm font-medium text-gray-700">Responsibilities *</label>
                                <textarea id="newResponsibilities" rows="5" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                            <div>
                                <label for="newYearsOfExperience" class="block text-sm font-medium text-gray-700">Years of Experience</label>
                                <input type="text" id="newYearsOfExperience" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            </div>
                        </div>
                    </section>

                    <!-- Step 2.4: Map Skills (Placeholder) -->
                    <section id="step-2-4-map-skills" class="mb-6">
                        <h4 class="text-lg font-medium text-gray-700 mb-3">2.4 Map Skills</h4>
                        <p class="text-gray-500">Skill mapping interface will be here. (e.g., select from library, proficiency)</p>
                        <!-- This will be a more complex component, potentially reusing parts of job-architecture or a new component -->
                        <div id="new-job-skill-mapping-area" class="mt-2 p-4 border rounded-md bg-gray-50">
                            Placeholder for skill selection and proficiency tagging.
                        </div>
                    </section>
                    
                    <div class="mt-8 flex justify-end">
                        <button id="cancel-create-new-btn" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-3">Cancel</button>
                        <button id="save-new-profile-btn" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save & Proceed to Approval</button>
                    </div>
                </div>
            `;
            // Add event listeners for cancel/save buttons in the new form
            document.getElementById('cancel-create-new-btn')?.addEventListener('click', cancelCreateNewProfile);
            document.getElementById('save-new-profile-btn')?.addEventListener('click', saveNewJobProfile);
            document.getElementById('generate-with-ai-btn')?.addEventListener('click', () => {
                alert('AI generation/update feature to be implemented.');
            });
        }
    }
    
    function cancelCreateNewProfile() {
        if(createNewJobProfileContent) createNewJobProfileContent.classList.add('hidden');
        if(searchJobProfileSection) searchJobProfileSection.classList.remove('hidden');
        if(createNewJobProfileInitiatorSection) createNewJobProfileInitiatorSection.classList.remove('hidden');
        createNewJobProfileContent.innerHTML = '<p class="text-center text-gray-500">Loading form to create new job profile...</p>'; // Reset placeholder
    }

    function saveNewJobProfile() {
        // Basic validation (example)
        const jobTitle = document.getElementById('newJobTitle')?.value;
        if (!jobTitle || !jobTitle.trim()) {
            alert('Job Title is required.');
            return;
        }
        // ... more validation for other required fields ...

        alert('New Job Profile "Saved" (not implemented yet). Proceeding to approval (not implemented yet).');
        // Here you would gather all form data, save it, and then show Step 3 (Approval)
        // For now, just an alert.
        // cancelCreateNewProfile(); // Optionally go back to search view or show approval status
        
        // Hide the form and show the approval/publish placeholder
        if(createNewJobProfileContent) createNewJobProfileContent.classList.add('hidden');
        const approvalPublishSteps = document.getElementById('approval-publish-steps');
        if(approvalPublishSteps) approvalPublishSteps.classList.remove('hidden');

    }

});
