// JavaScript specific to internal-opportunities.html

document.addEventListener('DOMContentLoaded', function() {
    // Ensure the main page area is visible and active
    const pageArea = document.getElementById('internal-opportunities-page-area');
    if (pageArea) {
        pageArea.style.display = 'block';
        pageArea.classList.add('active');
    }

    console.log('Internal Opportunities page loaded.');

    const searchInput = document.getElementById('hubOpportunitySearchInput');
    const searchButton = document.getElementById('hubOpportunitySearchButton');
    const gridContainer = document.getElementById('hubOpportunitiesGridContainer');
    const slideOutPanel = document.getElementById('opportunityDetailSlideOut');
    // Corrected: Use this single variable for the main slide-out's close button
    const mainSlideOutCloseButton = document.getElementById('closeSlideOutButton'); 
    const slideOutContent = document.getElementById('slideOutContent');
    const slideOutTitle = document.getElementById('slideOutTitle');
    let backdrop = null;

    // New DOM Elements for Skill Recommendations & Wizard
    const openSkillWizardButton = document.getElementById('openSkillWizardButton');
    const skillWizardModal = document.getElementById('skillWizardModal');
    const skillWizardContent = document.getElementById('skillWizardContent'); 
    const wizardCloseButton = document.getElementById('closeSkillWizardButton'); // Use this for the wizard's close button
    const skillWizardTitle = document.getElementById('skillWizardTitle');
    const skillWizardStepContainer = document.getElementById('skillWizardStepContainer');
    const skillWizardBackButton = document.getElementById('skillWizardBackButton');
    const skillWizardNextButton = document.getElementById('skillWizardNextButton');
    const skillWizardConfirmButton = document.getElementById('skillWizardConfirmButton');
    const selectedSkillsDisplay = document.getElementById('selectedSkillsDisplay');

    const recommendedOpportunitiesGrid = document.getElementById('recommendedOpportunitiesGrid');
    const recommendationSubtext = document.getElementById('recommendationSubtext');
    const recommendationFiltersContainer = document.getElementById('recommendationFiltersContainer');
    const filterRecByTypeSelect = document.getElementById('filterRecByType');
    const sortRecBySelect = document.getElementById('sortRecBy');

    // Tab Elements
    const tabPersonalizedFeed = document.getElementById('tabPersonalizedFeed');
    const tabExploreAll = document.getElementById('tabExploreAll');
    const panelPersonalizedFeed = document.getElementById('panelPersonalizedFeed');
    const panelExploreAll = document.getElementById('panelExploreAll');
    
    let currentWizardStep = 1;
    let tempSelectedSkills = []; 
    let userConfirmedSkills = []; 
    const MAX_SELECTED_SKILLS = 5;
    const RECOMMENDED_OPPS_COUNT = 3; 

    const SKILL_ONTOLOGY = {
        'Technical & Engineering': [
            'Jet Engine Design', 'Thermodynamics', 'CAD Software', 'A&P License', 'Avionics Troubleshooting', 
            'Heavy Maintenance', 'Flight Control Systems', 'Navigation Systems', 'Embedded Systems', 
            'Finite Element Analysis (FEA)', 'Composite Materials', 'Fatigue Analysis', 'Network Security', 
            'Threat Detection', 'CFD Analysis', 'Wind Tunnel Testing', 'Maintenance Manuals', 'SQL', 
            'Tableau', 'Data Analysis', 'Swift', 'Kotlin', 'React Native', 'API Documentation', 'C++' 
        ],
        'Operations & Logistics': [
            'ATC Certification', 'Radar Operations', 'Ground Handling', 'Airport Security', 'Logistics', 
            'Air Freight', 'Load Planning', 'Customs Regulations', 'Fuel Quality Control', 'Flight Planning', 
            'Meteorology', 'Aircraft Marshalling', 'Baggage Handling', 'Noise Abatement', 'Waste Management'
        ],
        'Safety, Compliance & Quality': [
            'Safety Audits', 'Incident Investigation', 'FAA Regulations', 'Risk Management', 'Emergency Procedures',
            'Crew Resource Management', 'Human Performance', 'Instructional Design'
        ],
        'Management & Leadership': [
            'Project Management', 'Agile', 'Leadership', 'Team Leadership', 'Training Design', 
            'Pilot Management', 'Flight Standards', 'Stakeholder Management', 'Mentorship'
        ],
        'Design & Communication': [
            'UX Design', 'Figma', 'User Research', 'Technical Writing', 'Digital Marketing', 'Brand Management',
            'Communication', 'Customer Service', 'Service Design', 'Sketching', 'Photoshop', 'Editing'
        ],
        'Specialized Aviation Roles': [
            'UAS Pilot License', 'Photogrammetry', 'GIS Software', 'NVG Operations', 'Medical Evacuation',
            'Thermography', 'Flight Simulation', 'MATLAB', 'Microsoft Office', 'RTOS'
        ]
    };
    const ALL_PREDEFINED_SKILLS = [...new Set(Object.values(SKILL_ONTOLOGY).flat())].sort();

    const sampleOpportunities = [
        { id: 1, title: 'Airline Pilot - Boeing 787', department: 'Flight Operations', skills: ['ATP License', 'Boeing 787 Type Rating', 'Instrument Flying', 'Leadership', 'Crew Resource Management'], location: 'Dubai, UAE', type: 'Full-time', description: 'Seeking experienced Boeing 787 pilots for international routes. Competitive salary and benefits package. Join a world-class airline and soar to new heights in your career.', responsibilities: ['Operate aircraft in a safe and efficient manner', 'Adhere to all FAA and company regulations', 'Conduct pre-flight and post-flight inspections'], qualifications: ['Valid ATP License with B787 Type Rating', 'Minimum 5000 flight hours', 'Class 1 Medical Certificate'], postedDate: '2025-06-01' },
        { id: 2, title: 'Aerospace Engineer - Propulsion Systems', department: 'Engineering & Design', skills: ['Jet Engine Design', 'Thermodynamics', 'CAD Software', 'FEA', 'Composite Materials'], location: 'Seattle, WA', type: 'Full-time', description: 'Innovative aerospace firm looking for a propulsion systems engineer to contribute to next-generation engine designs. Work on cutting-edge projects with a talented team.', responsibilities: ['Design and analyze propulsion components', 'Conduct performance testing and validation', 'Collaborate with cross-functional teams'], qualifications: ['B.S. or M.S. in Aerospace or Mechanical Engineering', '5+ years of experience in jet engine design', 'Proficiency in ANSYS or similar FEA software'], postedDate: '2025-06-05' },
        { id: 3, title: 'Aircraft Maintenance Technician (AMT)', department: 'Maintenance & Repair', skills: ['A&P License', 'Avionics Troubleshooting', 'Heavy Maintenance', 'Technical Writing', 'Maintenance Manuals'], location: 'Frankfurt, Germany', type: 'Full-time', description: 'Major MRO provider requires skilled AMTs for base maintenance operations on various commercial aircraft. Excellent career development opportunities.', responsibilities: ['Perform scheduled and unscheduled maintenance', 'Troubleshoot and repair aircraft systems', 'Ensure compliance with EASA regulations'], qualifications: ['Valid EASA Part 66 B1/B2 License', 'Experience with Airbus or Boeing aircraft', 'Strong diagnostic skills'], postedDate: '2025-05-28' },
        { id: 4, title: 'Air Traffic Controller Trainee', department: 'Air Navigation Services', skills: ['Communication', 'Problem Solving', 'Spatial Awareness'], location: 'London, UK', type: 'On-the-Job Learning', description: 'Intensive training program to become a certified Air Traffic Controller. No prior ATC experience required, but strong cognitive skills are a must.', responsibilities: ['Learn ATC procedures and regulations', 'Participate in simulator training', 'Shadow experienced controllers'], qualifications: ['Bachelors degree', 'Excellent communication skills', 'Ability to work under pressure'], postedDate: '2025-06-08' },
        { id: 5, title: 'Aviation Safety Audit Project Lead', department: 'Regulatory Compliance', skills: ['Safety Audits', 'Incident Investigation', 'FAA Regulations', 'Risk Management', 'Project Management'], location: 'Washington D.C.', type: 'Project (6 Months)', description: 'Lead a 6-month project to develop and implement a new internal safety audit protocol. Requires strong project management and aviation safety expertise.', responsibilities: ['Define project scope and deliverables', 'Manage project timeline and resources', 'Conduct pilot audits and refine protocol'], qualifications: ['PMP certification preferred', '5+ years in aviation safety', 'Strong analytical and reporting skills'], postedDate: '2025-06-02' },
        { id: 6, title: 'In-Flight Service Design Gig', department: 'In-Flight Services', skills: ['Customer Service', 'UX Design', 'Service Design'], location: 'Remote', type: 'Gig (3 Weeks)', description: 'Short-term gig to redesign the pre-meal service flow for our business class cabin. Deliverables include journey maps and service blueprints.', responsibilities: ['Analyze current service flow', 'Develop new service concepts', 'Present findings to stakeholders'], qualifications: ['Experience in service design or UX', 'Understanding of airline passenger experience', 'Strong visual communication skills'], postedDate: '2025-06-09' },
        { id: 7, title: 'Avionics Software Developer (Part-Time)', department: 'Engineering & Design', skills: ['Flight Control Systems', 'Embedded Systems', 'C++', 'RTOS'], location: 'Montreal, Canada', type: 'Part-time (20hr/wk)', description: 'Seeking a part-time embedded software developer to assist with ongoing avionics system upgrades. Flexible hours.', responsibilities: ['Develop and test software modules', 'Debug existing code', 'Document software design'], qualifications: ['Experience with C++ and RTOS', 'Knowledge of avionics standards (e.g., DO-178C) a plus'], postedDate: '2025-05-20' },
        { id: 8, title: 'Airport Operations Intern', department: 'Airport Management', skills: ['Logistics', 'Communication', 'Microsoft Office'], location: 'Los Angeles, CA', type: 'Internship (Summer)', description: 'Summer internship opportunity in airport operations. Gain hands-on experience in various aspects of airport management.', responsibilities: ['Assist with daily operational tasks', 'Support ground handling coordination', 'Prepare reports and presentations'], qualifications: ['Currently enrolled in an aviation or business degree program', 'Strong organizational skills'], postedDate: '2025-04-15' },
        { id: 9, title: 'Drone Pilot - Infrastructure Inspection', department: 'Unmanned Aerial Systems', skills: ['UAS Pilot License', 'Photogrammetry', 'Thermography'], location: 'Denver, CO', type: 'Temporary Role (2 Months)', description: 'Temporary role for a licensed drone pilot to conduct infrastructure inspections using advanced sensor payloads.', responsibilities: ['Plan and execute drone flights', 'Collect and process sensor data', 'Generate inspection reports'], qualifications: ['Valid Part 107 certificate', 'Experience with industrial inspection drones'], postedDate: '2025-06-07' },
        { id: 10, title: 'Human Factors Workshop Facilitator', department: 'Safety & Training', skills: ['Crew Resource Management', 'Human Performance', 'Training Design', 'Facilitation'], location: 'Amsterdam, Netherlands', type: 'Gig (1 Week)', description: 'Facilitate a one-week workshop on Human Factors for our pilot training department.', responsibilities: ['Deliver workshop content', 'Lead group discussions and activities', 'Provide feedback to participants'], qualifications: ['Expertise in aviation human factors', 'Proven facilitation skills'], postedDate: '2025-06-03' },
        { id: 11, title: 'Cargo Operations Analyst', department: 'Logistics & Cargo', skills: ['Air Freight', 'Load Planning', 'Data Analysis', 'SQL'], location: 'Hong Kong', type: 'Full-time', postedDate: '2025-05-15' },
        { id: 12, title: 'Helicopter Maintenance Lead', department: 'Emergency Medical Services', skills: ['Commercial Helicopter License', 'A&P License', 'Heavy Maintenance'], location: 'Sydney, Australia', type: 'Full-time', postedDate: '2025-05-25' },
        { id: 13, title: 'Aircraft Structures Design Project', department: 'Engineering & Design', skills: ['Finite Element Analysis (FEA)', 'Composite Materials', 'Fatigue Analysis', 'CAD Software'], location: 'Toulouse, France', type: 'Project (9 Months)', postedDate: '2025-06-01' },
        { id: 14, title: 'Aviation Fueling Quality Auditor', department: 'Ground Operations', skills: ['Fuel Quality Control', 'Safety Audits', 'Technical Writing'], location: 'Dallas, TX', type: 'Part-time (15hr/wk)', postedDate: '2025-05-22' },
        { id: 15, title: 'Flight Dispatch System Upgrade - SME', department: 'Flight Operations', skills: ['Flight Planning', 'Meteorology', 'FAA Dispatch License', 'Project Management'], location: 'Chicago, IL', type: 'Gig (4 Weeks)', postedDate: '2025-06-10' },
        { id: 16, title: 'Aviation Digital Marketing Campaign Manager', department: 'Sales & Marketing', skills: ['Digital Marketing', 'Brand Management', 'Airline Industry Knowledge', 'Data Analysis'], location: 'New York, NY', type: 'Full-time', postedDate: '2025-06-04' },
        { id: 17, title: 'Cabin Interior Concept Sketch Artist', department: 'Design & Customization', skills: ['Luxury Design', 'Sketching', 'Photoshop'], location: 'Remote', type: 'Gig (2 Weeks)', postedDate: '2025-06-06' },
        { id: 18, title: 'Flight Simulator Software Tester', department: 'Training & Simulation', skills: ['Software Troubleshooting', 'Test Case Development', 'Flight Simulation'], location: 'Orlando, FL', type: 'Temporary Role (3 Months)', postedDate: '2025-05-18' },
        { id: 19, title: 'ATC Systems Network Engineer', department: 'Technology & Infrastructure', skills: ['Radar Systems', 'Communication Networks', 'System Integration', 'Network Security'], location: 'Ottawa, Canada', type: 'Full-time', postedDate: '2025-05-29' },
        { id: 20, title: 'Aviation Cybersecurity Policy Drafter', department: 'IT & Security', skills: ['Network Security', 'Avionics Security', 'Technical Writing', 'FAA Regulations'], location: 'Remote', type: 'Project (2 Months)', postedDate: '2025-06-01' },
        { id: 21, title: 'Ramp Safety Training Developer', department: 'Ground Handling', skills: ['Aircraft Marshalling', 'Safety Compliance', 'Training Design', 'Instructional Design'], location: 'Miami, FL', type: 'On-the-Job Learning', postedDate: '2025-06-05' },
        { id: 22, title: 'Aerodynamics Research Intern', department: 'Research & Development', skills: ['CFD Analysis', 'Wind Tunnel Testing', 'Aircraft Performance', 'MATLAB'], location: 'Bristol, UK', type: 'Internship (6 Months)', postedDate: '2025-03-20' },
        { id: 23, title: 'Aviation Maintenance Manual Editor', department: 'Documentation & Support', skills: ['Maintenance Manuals', 'Technical Writing', 'Editing', 'ATA Specifications'], location: 'Phoenix, AZ', type: 'Part-time (10hr/wk)', postedDate: '2025-05-27' },
        { id: 24, title: 'Airport Sustainability Initiative Lead', department: 'Sustainability & Compliance', skills: ['Environmental Regulations', 'Noise Abatement', 'Project Management', 'Stakeholder Management'], location: 'Vancouver, Canada', type: 'Full-time', postedDate: '2025-06-03' },
        { id: 25, title: 'Mentorship: Aspiring Chief Pilot', department: 'Flight Operations Management', skills: ['Pilot Management', 'Regulatory Compliance', 'Flight Standards', 'Leadership', 'Mentorship'], location: 'Atlanta, GA', type: 'Mentorship', postedDate: '2025-06-08' }
    ];

    function renderOpportunities(opportunities) {
        if (!gridContainer) return;
        gridContainer.innerHTML = ''; 

        if (opportunities.length === 0) {
            gridContainer.innerHTML = '<p style="text-align:center; padding: 2rem;">No opportunities found matching your criteria.</p>';
            return;
        }

        opportunities.forEach(opp => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1 flex flex-col'; 

            let typeIcon = 'fa-briefcase'; 
            if (opp.type.toLowerCase().includes('project')) typeIcon = 'fa-tasks';
            if (opp.type.toLowerCase().includes('gig')) typeIcon = 'fa-puzzle-piece';
            if (opp.type.toLowerCase().includes('part-time')) typeIcon = 'fa-clock';

            const skillsHTML = opp.skills.map(skill => 
                `<span class="inline-block bg-neutral-light text-brand-secondary text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">${skill}</span>`
            ).join('');
            
            const viewDetailsButton = document.createElement('button');
            viewDetailsButton.className = 'w-full bg-brand-primary hover:bg-opacity-90 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-50';
            viewDetailsButton.innerHTML = `<i class="fas fa-eye mr-2"></i>View Details`;
            viewDetailsButton.addEventListener('click', () => openSlideOut(opp));

            card.innerHTML = `
                <div class="p-6 flex-grow flex flex-col">
                    <h3 class="text-xl font-semibold text-brand-secondary mb-2">${opp.title}</h3>
                    <p class="text-sm text-neutral-dark mb-1">
                        <i class="fas fa-sitemap mr-2 text-brand-primary"></i>
                        <strong>Department:</strong> ${opp.department}
                    </p>
                    <p class="text-sm text-neutral-dark mb-1">
                        <i class="fas fa-map-marker-alt mr-2 text-brand-primary"></i>
                        <strong>Location:</strong> ${opp.location}
                    </p>
                    <p class="text-sm text-neutral-dark mb-1">
                        <i class="fas ${typeIcon} mr-2 text-brand-primary"></i>
                        <strong>Type:</strong> ${opp.type}
                    </p>
                    <div class="mt-3 mb-4">
                        ${skillsHTML}
                    </div>
                    <div class="mt-auto pt-4 border-t border-neutral-medium">
                    </div>
                </div>
            `;
            card.querySelector('.mt-auto').appendChild(viewDetailsButton);
            gridContainer.appendChild(card);
        });
    }

    function openSlideOut(opportunity) {
        console.log('openSlideOut called for:', opportunity.title);
        if (!slideOutPanel || !slideOutContent || !slideOutTitle) {
            console.error('Slide-out panel elements not found in openSlideOut');
            return;
        }
        console.log('slideOutPanel classes BEFORE open:', slideOutPanel.classList.toString());
        slideOutTitle.textContent = opportunity.title;
        const newSkillsDetailHTML = opportunity.skills.map(skill =>
             `<span class="inline-block bg-brand-accent text-white text-xs font-semibold mr-2 mb-2 px-3 py-1.5 rounded-full shadow-sm hover:bg-opacity-90 transition-all duration-200">${skill}</span>`
        ).join('');

        let typeIconClass = 'fa-briefcase';
        const typeLowerCase = opportunity.type.toLowerCase();
        if (typeLowerCase.includes('project')) typeIconClass = 'fa-tasks';
        else if (typeLowerCase.includes('gig')) typeIconClass = 'fa-puzzle-piece';
        else if (typeLowerCase.includes('part-time')) typeIconClass = 'fa-clock';
        else if (typeLowerCase.includes('full-time')) typeIconClass = 'fa-calendar-alt';

        slideOutContent.innerHTML = `
            <div class="mb-6 p-4 bg-neutral-light rounded-lg shadow">
                <div class="flex items-center mb-3">
                    <i class="fas fa-sitemap text-brand-primary text-xl mr-3"></i>
                    <div>
                        <span class="block text-xs text-neutral-dark uppercase tracking-wider">Department</span>
                        <p class="text-lg font-semibold text-brand-secondary">${opportunity.department}</p>
                    </div>
                </div>
                <div class="flex items-center mb-3">
                    <i class="fas fa-map-marker-alt text-brand-primary text-xl mr-3"></i>
                    <div>
                        <span class="block text-xs text-neutral-dark uppercase tracking-wider">Location</span>
                        <p class="text-lg font-semibold text-brand-secondary">${opportunity.location}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <i class="fas ${typeIconClass} text-brand-primary text-xl mr-3"></i>
                    <div>
                        <span class="block text-xs text-neutral-dark uppercase tracking-wider">Type</span>
                        <p class="text-lg font-semibold text-brand-secondary">${opportunity.type}</p>
                    </div>
                </div>
            </div>
            <div class="mb-6 detail-section">
                <h4 class="text-lg font-semibold text-brand-secondary mb-2 border-b border-neutral-medium pb-2">
                    <i class="fas fa-info-circle mr-2 text-brand-accent"></i>Job Description
                </h4>
                <p class="text-neutral-dark leading-relaxed">${opportunity.description || 'No detailed description available for this role.'}</p>
            </div>
            <div class="mb-6 detail-section">
                <h4 class="text-lg font-semibold text-brand-secondary mb-2 border-b border-neutral-medium pb-2">
                    <i class="fas fa-clipboard-list mr-2 text-brand-accent"></i>Key Responsibilities
                </h4>
                <ul class="list-none space-y-2 text-neutral-dark">
                    ${(opportunity.responsibilities && opportunity.responsibilities.length > 0 ? opportunity.responsibilities : ['Information not available']).map(r => `
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-500 mr-2 mt-1 flex-shrink-0"></i>
                            <span>${r}</span>
                        </li>`).join('')}
                </ul>
            </div>
            <div class="mb-6 detail-section">
                <h4 class="text-lg font-semibold text-brand-secondary mb-2 border-b border-neutral-medium pb-2">
                    <i class="fas fa-graduation-cap mr-2 text-brand-accent"></i>Qualifications 
                </h4>
                <ul class="list-none space-y-2 text-neutral-dark">
                     ${(opportunity.qualifications && opportunity.qualifications.length > 0 ? opportunity.qualifications : ['Information not available']).map(q => `
                        <li class="flex items-start">
                            <i class="fas fa-award text-brand-primary mr-2 mt-1 flex-shrink-0"></i>
                            <span>${q}</span>
                        </li>`).join('')}
                </ul>
            </div>
            <div class="mb-4 detail-section">
                 <h4 class="text-lg font-semibold text-brand-secondary mb-3 border-b border-neutral-medium pb-2">
                    <i class="fas fa-cogs mr-2 text-brand-accent"></i>Required Skills
                </h4>
                <div class="flex flex-wrap gap-2">
                    ${newSkillsDetailHTML || '<p class="text-neutral-dark">No specific skills listed.</p>'}
                </div>
            </div>
        `;
        slideOutPanel.classList.add('active'); // Keep active for semantics or other styles if any
        slideOutPanel.classList.remove('translate-x-full');
        slideOutPanel.classList.add('translate-x-0'); // Explicitly add translate-x-0
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'slideout-backdrop opacity-0 pointer-events-none';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', function() {
                console.log('Backdrop clicked');
                closeSlideOut();
            });
        }
        setTimeout(() => {
            backdrop.classList.remove('opacity-0', 'pointer-events-none');
            backdrop.classList.add('opacity-100', 'pointer-events-auto');
        }, 10); 
        document.body.style.overflow = 'hidden';
        console.log('slideOutPanel classes AFTER open:', slideOutPanel.classList.toString());
    }

    function closeSlideOut() {
        console.log('closeSlideOut called');
        if (!slideOutPanel) {
            console.error('Slide-out panel not found in closeSlideOut');
            return;
        }
        console.log('slideOutPanel classes BEFORE close:', slideOutPanel.classList.toString());
        slideOutPanel.classList.remove('active'); // Keep active for semantics or other styles if any
        slideOutPanel.classList.remove('translate-x-0'); // Explicitly remove translate-x-0
        slideOutPanel.classList.add('translate-x-full');
        if (backdrop) {
            console.log('Backdrop classes BEFORE close:', backdrop.classList.toString());
            backdrop.classList.remove('opacity-100', 'pointer-events-auto');
            backdrop.classList.add('opacity-0', 'pointer-events-none');
            console.log('Backdrop classes AFTER close:', backdrop.classList.toString());
        }
        document.body.style.overflow = ''; 
        console.log('slideOutPanel classes AFTER close:', slideOutPanel.classList.toString());
    }

    if (mainSlideOutCloseButton) { // Use the corrected variable name
        mainSlideOutCloseButton.addEventListener('click', function() {
            console.log('mainSlideOutCloseButton clicked');
            closeSlideOut();
        });
        console.log('Event listener attached to mainSlideOutCloseButton');
    } else {
        console.error('mainSlideOutCloseButton not found!');
    }
    
    function filterOpportunities() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const filtered = sampleOpportunities.filter(opp => {
            return (
                opp.title.toLowerCase().includes(searchTerm) ||
                opp.department.toLowerCase().includes(searchTerm) ||
                opp.location.toLowerCase().includes(searchTerm) ||
                opp.skills.some(skill => skill.toLowerCase().includes(searchTerm))
            );
        });
        renderOpportunities(filtered);
    }

    if (searchButton) {
        searchButton.addEventListener('click', filterOpportunities);
    }
    if (searchInput) {
        searchInput.addEventListener('keyup', filterOpportunities);
    }

    renderOpportunities(sampleOpportunities);
    renderRecommendedOpportunities(); 
    updateSelectedSkillsDisplay();
    setupTabs();

    function setupTabs() {
        if (!tabPersonalizedFeed || !tabExploreAll || !panelPersonalizedFeed || !panelExploreAll) return;
        tabPersonalizedFeed.addEventListener('click', () => switchTab('personalized'));
        tabExploreAll.addEventListener('click', () => switchTab('explore'));
        switchTab('personalized');
    }

    function switchTab(tabName) {
        const isActive = (el, active) => {
            if (active) {
                el.classList.add('active-tab', 'text-brand-primary', 'border-brand-primary');
                el.classList.remove('text-neutral-dark', 'border-transparent', 'hover:border-neutral-medium');
            } else {
                el.classList.remove('active-tab', 'text-brand-primary', 'border-brand-primary');
                el.classList.add('text-neutral-dark', 'border-transparent', 'hover:border-neutral-medium');
            }
        };
        panelPersonalizedFeed.classList.toggle('hidden', tabName !== 'personalized');
        panelExploreAll.classList.toggle('hidden', tabName !== 'explore');
        isActive(tabPersonalizedFeed, tabName === 'personalized');
        isActive(tabExploreAll, tabName === 'explore');
    }

    function openSkillWizard() {
        if (!skillWizardModal) {
            console.error("Skill wizard modal not found!");
            return;
        }
        tempSelectedSkills = [...userConfirmedSkills]; 
        currentWizardStep = 1;
        renderWizardStep();
        skillWizardModal.classList.remove('opacity-0', 'pointer-events-none');
        skillWizardModal.querySelector('#skillWizardContent').classList.remove('scale-95');
        skillWizardModal.querySelector('#skillWizardContent').classList.add('scale-100');
        document.body.style.overflow = 'hidden';
    }

    function closeSkillWizard() {
        if (!skillWizardModal) return;
        skillWizardModal.classList.add('opacity-0', 'pointer-events-none');
        skillWizardModal.querySelector('#skillWizardContent').classList.add('scale-95');
        skillWizardModal.querySelector('#skillWizardContent').classList.remove('scale-100');
        document.body.style.overflow = '';
    }
    
    function renderWizardStep() {
        if (!skillWizardStepContainer || !skillWizardTitle || !skillWizardBackButton || !skillWizardNextButton || !skillWizardConfirmButton) return;
        skillWizardStepContainer.innerHTML = ''; 

        if (currentWizardStep === 1) {
            skillWizardTitle.textContent = 'Step 1: Select Skill Categories';
            skillWizardBackButton.classList.add('hidden');
            skillWizardNextButton.classList.remove('hidden');
            skillWizardConfirmButton.classList.add('hidden');
            const categories = Object.keys(SKILL_ONTOLOGY);
            const list = document.createElement('div');
            list.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
            categories.forEach(category => {
                const button = document.createElement('button');
                button.textContent = category;
                const hasSelectedSkillInCategory = SKILL_ONTOLOGY[category].some(skill => tempSelectedSkills.includes(skill));
                button.className = `p-4 border rounded-lg text-left transition-all duration-200 ${hasSelectedSkillInCategory ? 'bg-brand-accent text-white shadow-lg ring-2 ring-brand-accent ring-offset-2' : 'bg-neutral-light hover:bg-neutral-medium'}`;
                button.onclick = () => { currentWizardStep = 2; renderWizardStep(); };
                list.appendChild(button);
            });
            skillWizardStepContainer.appendChild(list);
            skillWizardNextButton.onclick = () => { currentWizardStep = 2; renderWizardStep(); };
        } else if (currentWizardStep === 2) {
            skillWizardTitle.textContent = `Step 2: Select Your Skills (Up to ${MAX_SELECTED_SKILLS})`;
            skillWizardBackButton.classList.remove('hidden');
            skillWizardNextButton.classList.add('hidden'); 
            skillWizardConfirmButton.classList.remove('hidden');
            const skillGrid = document.createElement('div');
            skillGrid.className = 'flex flex-wrap gap-3';
            ALL_PREDEFINED_SKILLS.forEach(skill => {
                const checkboxId = `wiz-skill-${skill.replace(/\s+/g, '-').toLowerCase()}`;
                const label = document.createElement('label');
                label.htmlFor = checkboxId;
                const isChecked = tempSelectedSkills.includes(skill);
                label.className = `flex items-center space-x-2 p-2 border rounded-md cursor-pointer transition-colors text-sm ${isChecked ? 'bg-brand-primary bg-opacity-10 border-brand-primary text-brand-primary' : 'border-neutral-medium hover:bg-neutral-light'}`;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = checkboxId;
                checkbox.value = skill;
                checkbox.checked = isChecked;
                checkbox.className = 'form-checkbox h-4 w-4 text-brand-primary rounded focus:ring-brand-primary focus:ring-opacity-50';
                checkbox.onchange = (e) => {
                    if (e.target.checked) {
                        if (tempSelectedSkills.length < MAX_SELECTED_SKILLS) {
                            tempSelectedSkills.push(skill);
                        } else {
                            e.target.checked = false;
                            alert(`You can select a maximum of ${MAX_SELECTED_SKILLS} skills.`);
                        }
                    } else {
                        tempSelectedSkills = tempSelectedSkills.filter(s => s !== skill);
                    }
                    renderWizardStep(); 
                };
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(skill));
                skillGrid.appendChild(label);
            });
            skillWizardStepContainer.appendChild(skillGrid);
            const allCheckboxes = skillWizardStepContainer.querySelectorAll('input[type="checkbox"]');
            if (tempSelectedSkills.length >= MAX_SELECTED_SKILLS) {
                allCheckboxes.forEach(cb => {
                    if (!cb.checked) {
                        cb.disabled = true;
                        cb.parentElement.classList.add('opacity-50', 'cursor-not-allowed');
                        cb.parentElement.classList.remove('hover:bg-neutral-light');
                    }
                });
            }
            skillWizardBackButton.onclick = () => { currentWizardStep = 1; renderWizardStep(); };
        }
    }

    function confirmSkillsFromWizard() {
        userConfirmedSkills = [...tempSelectedSkills];
        closeSkillWizard();
        renderRecommendedOpportunities();
        updateSelectedSkillsDisplay();
    }

    function updateSelectedSkillsDisplay() {
        if (!selectedSkillsDisplay) return;
        if (userConfirmedSkills.length > 0) {
            selectedSkillsDisplay.innerHTML = `<strong>Your selected skills:</strong> ${userConfirmedSkills.map(s => `<span class="inline-block bg-brand-primary text-white text-xs font-medium mr-2 mb-1 px-2.5 py-1 rounded-full">${s}</span>`).join('')}`;
        } else {
            selectedSkillsDisplay.innerHTML = `<em>No skills selected yet. Click the button above to personalize!</em>`;
        }
    }
    
    if (openSkillWizardButton) {
        openSkillWizardButton.addEventListener('click', openSkillWizard);
    }
    if (wizardCloseButton) { // Use the 'wizardCloseButton' variable defined at the top for the wizard
        wizardCloseButton.addEventListener('click', closeSkillWizard);
    }

    if (skillWizardModal) { 
        skillWizardModal.addEventListener('click', (event) => {
            if (event.target === skillWizardModal) { 
                closeSkillWizard();
            }
        });
    }
    if (skillWizardConfirmButton) {
        skillWizardConfirmButton.addEventListener('click', confirmSkillsFromWizard);
    }
    if (skillWizardBackButton) { // Ensure back button listener is attached
        skillWizardBackButton.addEventListener('click', () => {
            if(currentWizardStep > 1) { // Basic guard
                currentWizardStep--;
                renderWizardStep();
            }
        });
    }


    function getDismissedRecommendations() {
        const dismissed = localStorage.getItem('dismissedRecommendations');
        return dismissed ? JSON.parse(dismissed) : [];
    }

    function addDismissedRecommendation(opportunityId) {
        const dismissed = getDismissedRecommendations();
        if (!dismissed.includes(opportunityId)) {
            dismissed.push(opportunityId);
            localStorage.setItem('dismissedRecommendations', JSON.stringify(dismissed));
        }
    }

    function renderRecommendedOpportunities() {
        if (!recommendedOpportunitiesGrid || !recommendationSubtext || !recommendationFiltersContainer || !filterRecByTypeSelect || !sortRecBySelect) return;
        
        recommendedOpportunitiesGrid.innerHTML = ''; 
        const dismissedIds = getDismissedRecommendations();

        if (userConfirmedSkills.length === 0) {
            recommendationSubtext.innerHTML = 'Use the "Personalize My Feed" button above to select skills and see tailored recommendations.';
            recommendationSubtext.classList.remove('hidden');
            recommendationFiltersContainer.classList.add('hidden'); 
            return;
        }
        
        recommendationSubtext.classList.add('hidden'); 
        recommendationFiltersContainer.classList.remove('hidden'); 

        let rawRecommendations = [];
        const addedOppIds = new Set(); // To keep track of added opportunities

        // 1. Guaranteed Variety Pass
        const opportunityTypes = [...new Set(sampleOpportunities.map(opp => opp.type))].sort();

        opportunityTypes.forEach(type => {
            let candidatesOfType = sampleOpportunities.filter(
                opp => opp.type === type && !dismissedIds.includes(opp.id) && !addedOppIds.has(opp.id)
            );

            if (candidatesOfType.length === 0) return; // No available opps of this type

            let bestCandidateForType = null;
            if (userConfirmedSkills.length > 0) {
                const candidatesWithSkillMatch = candidatesOfType
                    .map(o => ({ // Use 'o' to avoid conflict with outer 'opp' if any
                        ...o,
                        matchedSkillCount: o.skills.filter(skill => userConfirmedSkills.includes(skill)).length,
                    }))
                    .sort((a, b) => b.matchedSkillCount - a.matchedSkillCount); // Sort by match count

                if (candidatesWithSkillMatch.length > 0 && candidatesWithSkillMatch[0].matchedSkillCount > 0) {
                    bestCandidateForType = candidatesWithSkillMatch[0]; // This object contains matchedSkillCount
                } else if (candidatesWithSkillMatch.length > 0) { // No skill match, but candidates exist
                    bestCandidateForType = candidatesWithSkillMatch[0]; // Pick the first one
                }
            } else { // No user skills selected, just pick the first available
                bestCandidateForType = candidatesOfType[0];
            }

            if (bestCandidateForType) {
                // Find the original object from sampleOpportunities to push, to ensure full object details
                const originalOpp = sampleOpportunities.find(o => o.id === bestCandidateForType.id);
                if (originalOpp && !addedOppIds.has(originalOpp.id)) { // Check addedOppIds again for safety
                    rawRecommendations.push(originalOpp); 
                    addedOppIds.add(originalOpp.id);
                }
            }
        });

        // 2. Skill-Based Augmentation Pass (if user has selected skills)
        if (userConfirmedSkills.length > 0) {
            let potentialSkillMatches = sampleOpportunities
                .filter(opp => !dismissedIds.includes(opp.id) && !addedOppIds.has(opp.id))
                .filter(opp => opp.skills.some(skill => userConfirmedSkills.includes(skill))); // Ensure it has at least one match

            // Sort these potential matches by how many skills they match
            potentialSkillMatches.sort((a,b) => {
                const aMatchCount = a.skills.filter(s => userConfirmedSkills.includes(s)).length;
                const bMatchCount = b.skills.filter(s => userConfirmedSkills.includes(s)).length;
                return bMatchCount - aMatchCount;
            });
                
            potentialSkillMatches.forEach(opp => {
                if (!addedOppIds.has(opp.id)) { // Double check
                    rawRecommendations.push(opp); 
                    addedOppIds.add(opp.id);
                }
            });
        }
        
        // Deduplicate (should be mostly handled by addedOppIds, but as a safeguard)
        rawRecommendations = Array.from(new Map(rawRecommendations.map(item => [item.id, item])).values());

        // Ensure all items in rawRecommendations have matchedSkillCount and matchedSkillsList
        rawRecommendations = rawRecommendations.map(opp => {
            const matchedSkills = opp.skills.filter(skill => userConfirmedSkills.includes(skill));
            return { ...opp, matchedSkillCount: matchedSkills.length, matchedSkillsList: matchedSkills };
        });

        // Populate filter select based on the types available in the current rawRecommendations
        const availableTypesInRecs = [...new Set(rawRecommendations.map(opp => opp.type))].sort();
        const currentTypeFilterValue = filterRecByTypeSelect.value; // Preserve current filter if possible
        filterRecByTypeSelect.innerHTML = '<option value="all">All Types</option>'; 
        availableTypesInRecs.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            filterRecByTypeSelect.appendChild(option);
        });
        // Try to restore previous selection, or default to 'all'
        if (availableTypesInRecs.includes(currentTypeFilterValue)) {
            filterRecByTypeSelect.value = currentTypeFilterValue;
        } else {
            filterRecByTypeSelect.value = 'all'; 
        }

        // Apply type filter to the rawRecommendations
        let finalRecommendationsToRender = [...rawRecommendations]; 
        const selectedTypeFilter = filterRecByTypeSelect.value;
        if (selectedTypeFilter !== 'all') {
            finalRecommendationsToRender = finalRecommendationsToRender.filter(opp => opp.type === selectedTypeFilter);
        }

        // Apply sorting
        const sortBy = sortRecBySelect.value;
        if (sortBy === 'relevance') {
            finalRecommendationsToRender.sort((a, b) => b.matchedSkillCount - a.matchedSkillCount);
        } else if (sortBy === 'type') {
            finalRecommendationsToRender.sort((a, b) => a.type.localeCompare(b.type));
        } else if (sortBy === 'date_newest') {
            finalRecommendationsToRender.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        }
        
        // The line `const finalRecommendations = rawRecommendations.slice(0, RECOMMENDED_OPPS_COUNT);` is intentionally removed
        // to allow all "guaranteed variety" + skill-matched opportunities (that pass filters) to be shown.

        if (finalRecommendationsToRender.length === 0) {
            recommendedOpportunitiesGrid.innerHTML = `<p class="col-span-full text-center text-neutral-dark py-4">No current opportunities match your selected skills and filters. Try adjusting your selections or check back later!</p>`;
            return;
        }
        
        finalRecommendationsToRender.forEach(opp => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative group'; 
            
            const dismissButton = document.createElement('button');
            dismissButton.className = 'absolute top-2 right-2 text-neutral-dark hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 p-1 bg-white bg-opacity-75 rounded-full';
            dismissButton.innerHTML = '<i class="fas fa-times"></i>';
            dismissButton.title = "Dismiss recommendation";
            dismissButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                addDismissedRecommendation(opp.id);
                console.log(`Dismissed opportunity ID: ${opp.id}`);
                renderRecommendedOpportunities(); 
            });
            card.appendChild(dismissButton);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'p-4 flex-grow flex flex-col';
            
            let briefDescription = opp.description ? opp.description.substring(0, 70) + '...' : 'View details to learn more.';
            if (opp.description && opp.description.length <= 70) briefDescription = opp.description;

            let typeTagColor = 'bg-neutral-medium text-neutral-darker'; 
            const typeLower = opp.type.toLowerCase();
            if (typeLower.includes('full-time')) typeTagColor = 'bg-blue-100 text-blue-700';
            else if (typeLower.includes('part-time')) typeTagColor = 'bg-purple-100 text-purple-700';
            else if (typeLower.includes('project')) typeTagColor = 'bg-yellow-100 text-yellow-700';
            else if (typeLower.includes('gig')) typeTagColor = 'bg-pink-100 text-pink-700';
            else if (typeLower.includes('learning') || typeLower.includes('internship') || typeLower.includes('mentorship')) typeTagColor = 'bg-green-100 text-green-700';
            else if (typeLower.includes('temporary')) typeTagColor = 'bg-orange-100 text-orange-700';

            contentDiv.innerHTML = `
                <div class="flex justify-between items-start mb-1">
                    <h4 class="text-md font-semibold text-brand-secondary truncate flex-grow mr-2" title="${opp.title}">${opp.title}</h4>
                    <span class="opportunity-type-tag ${typeTagColor} text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">${opp.type}</span>
                </div>
                <p class="text-xs text-neutral-dark mb-1"><i class="fas fa-sitemap mr-1 text-brand-primary opacity-75"></i>${opp.department}</p>
                <p class="text-xs text-neutral-dark mb-2"><i class="fas fa-map-marker-alt mr-1 text-brand-primary opacity-75"></i>${opp.location}</p>
                <p class="text-xs text-neutral-dark mb-3 leading-snug">${briefDescription}</p>
                <div class="mb-3">
                    <span class="text-xs font-semibold text-brand-accent">Matched Skills: ${opp.matchedSkillsList.join(', ') || 'N/A'}</span>
                </div>
            `;
            
            const viewDetailsBtnRec = document.createElement('button');
            viewDetailsBtnRec.className = 'mt-auto w-full bg-brand-primary hover:bg-opacity-90 text-white font-semibold py-2 px-3 rounded-md text-xs transition-colors';
            viewDetailsBtnRec.innerHTML = `<i class="fas fa-eye mr-1"></i>View Details`;
            viewDetailsBtnRec.addEventListener('click', () => openSlideOut(opp));
            
            contentDiv.appendChild(viewDetailsBtnRec);
            card.appendChild(contentDiv);
            recommendedOpportunitiesGrid.appendChild(card);
        });
    }

    // Event listeners for recommendation filters
    if (filterRecByTypeSelect) {
        filterRecByTypeSelect.addEventListener('change', renderRecommendedOpportunities);
    }
    if (sortRecBySelect) {
        sortRecBySelect.addEventListener('change', renderRecommendedOpportunities);
    }
});
