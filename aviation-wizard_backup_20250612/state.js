// import { capabilitiesData, competenciesData, skillsData as ontologySkillsData } from './data/skillsOntology.js'; // Removed static import

// --- API Endpoints ---
const API_BASE_URL = '/api/v1'; // Assuming a base URL for the APIs

// --- STATE MANAGEMENT & INITIAL DATA ---
export let state = {
    currentStep: 1,
    // New Hierarchical Data
    organizations: [
        {
            id: 'org1',
            name: 'Akara Airlines',
            description: 'A leading international airline carrier.'
        }
    ],
    businessUnits: [
        {
            id: 'bu1',
            name: 'Passenger Operations',
            description: 'Handles all passenger flight related activities.',
            organizationId: 'org1'
        },
        {
            id: 'bu2',
            name: 'Cargo Operations',
            description: 'Handles all cargo and freight operations.',
            organizationId: 'org1'
        },
        {
            id: 'bu3',
            name: 'Maintenance, Repair, and Overhaul (MRO)',
            description: 'Provides MRO services for Akara Airlines and third-party customers.',
            organizationId: 'org1'
        },
        {
            id: 'bu4',
            name: 'Training & Simulation',
            description: 'Manages pilot and crew training programs.',
            organizationId: 'org1'
        }
    ],
    departments: [
        {
            id: 'dept1',
            name: 'Flight Operations Command',
            description: 'Manages pilots and flight crew.',
            businessUnitId: 'bu1'
        },
        {
            id: 'dept2',
            name: 'Aircraft Engineering',
            description: 'Oversees maintenance and airworthiness.',
            businessUnitId: 'bu1' // Assuming same BU for now
        },
        {
            id: 'dept3',
            name: 'Airport Customer Services',
            description: 'Manages ground staff and passenger experience at airports.',
            businessUnitId: 'bu1' // Assuming same BU for now
        },
        {
            id: 'dept4',
            name: 'Cargo Sales & Logistics',
            description: 'Manages cargo bookings and ground logistics.',
            businessUnitId: 'bu2'
        },
        {
            id: 'dept5',
            name: 'Specialized Cargo Handling',
            description: 'Handles temperature-sensitive and high-value cargo.',
            businessUnitId: 'bu2'
        },
        {
            id: 'dept6',
            name: 'Airframe Maintenance',
            description: 'Conducts heavy checks and structural repairs.',
            businessUnitId: 'bu3'
        },
        {
            id: 'dept7',
            name: 'Engine Services',
            description: 'Performs engine overhaul and testing.',
            businessUnitId: 'bu3'
        },
        {
            id: 'dept8',
            name: 'Pilot Training Academy',
            description: 'Delivers type-rating and recurrent training for pilots.',
            businessUnitId: 'bu4'
        },
        {
            id: 'dept9',
            name: 'Cabin Crew Training Institute',
            description: 'Provides safety and service training for cabin crew.',
            businessUnitId: 'bu4'
        }
    ],
    // Skill Ontology Data - will be populated from API
    capabilities: [],
    competencies: [],
    ontologySkills: [], // Renamed from skillsData for clarity if needed, or keep as skillsData
    // Job Architecture Data
    roleGroups: [
        { 
            id: 'rg1', 
            name: 'Flight Operations', 
            description: 'Pilots, cabin crew, and flight planning staff.', 
            status: 'active', 
            jobFamily: 'Aviation Operations',
            tags: ['flight_crew', 'operations', 'safety_critical'],
            aiSuggested: false,
            benchmarkData: { source: 'IndustryReport2024', reference: 'FO-Grp-101' },
            departmentId: 'dept1', // Link to the sample department
            jobs: [
            // Skills will now be an array of objects: { skillId: 'sXXX', proficiency: 1-3 }
            { 
                id: 'j1', 
                title: 'Captain (A320 Type Rated)', 
                level: 'L5', 
                jobFamily: 'Pilots', // This jobFamily is specific to the job, the one above is for the Role Group
                department: 'Flight Operations',
                workLocation: 'Various Airports',
                roleGroup: 'Flight Crew', 
                roleLevelName: 'Captain - A320',
                roleSummary: 'Commands and operates Airbus A320 aircraft safely and efficiently.',
                responsibilities: 'Overall responsibility for the safety and operation of the aircraft and crew. Ensures compliance with all aviation regulations. Manages flight planning and execution.',
                yearsOfExperience: '10+ years',
                skills: [],
                requisitionId: '',
                businessUnit: '',
                employmentType: '', 
                salaryMin: null,
                salaryMax: null,
                hiringManager: '',
                recruiter: '',
                additionalQualifications: '', 
                benefits: ''
            },
            { 
                id: 'j2', 
                title: 'First Officer', 
                level: 'L3', 
                jobFamily: 'Pilots',
                department: 'Flight Operations',
                workLocation: 'Various Airports',
                roleGroup: 'Flight Crew',
                roleLevelName: 'First Officer - General',
                roleSummary: 'Assists the Captain in the operation of the aircraft.',
                responsibilities: 'Monitors flight instruments, communicates with air traffic control, performs pre-flight and post-flight checks.',
                yearsOfExperience: '3-5 years',
                skills: [],
                requisitionId: '',
                businessUnit: '',
                employmentType: '',
                salaryMin: null,
                salaryMax: null,
                hiringManager: '',
                recruiter: '',
                additionalQualifications: '',
                benefits: ''
            },
            { 
                id: 'j3', 
                title: 'Lead Cabin Crew', 
                level: 'L4', 
                jobFamily: 'Cabin Services',
                department: 'In-Flight Services',
                workLocation: 'Various Aircraft',
                roleGroup: 'Cabin Management',
                roleLevelName: 'Senior Flight Attendant',
                roleSummary: 'Manages the cabin crew and ensures passenger safety and comfort.',
                responsibilities: 'Supervises cabin crew, conducts safety briefings, handles in-flight passenger service and emergency situations.',
                yearsOfExperience: '5-7 years',
                skills: [],
                requisitionId: '',
                businessUnit: '',
                employmentType: '',
                salaryMin: null,
                salaryMax: null,
                hiringManager: '',
                recruiter: '',
                additionalQualifications: '',
                benefits: ''
            }
        ]},
        { 
            id: 'rg2', 
            name: 'Aircraft Maintenance', 
            description: 'Technicians and engineers responsible for aircraft airworthiness.', 
            status: 'active',
            jobFamily: 'Engineering & Maintenance',
            tags: ['maintenance', 'technical', 'safety_critical'],
            aiSuggested: true,
            benchmarkData: { source: 'TechStandardsQ3', reference: 'AM-Grp-05' },
            departmentId: 'dept2', // Link to a sample department
            jobs: [] 
        },
        { 
            id: 'rg3', 
            name: 'Ground Operations', 
            description: 'Ramp agents, baggage handlers, and customer service staff.', 
            status: 'draft',
            jobFamily: 'Customer & Ground Services',
            tags: ['ground_staff', 'customer_service', 'logistics'],
            aiSuggested: false,
            benchmarkData: null,
            departmentId: 'dept3', // Link to a sample department
            jobs: [] 
        }
    ],
    jobLevels: [
        { 
            id: 'l1', 
            name: 'L1', 
            description: 'Trainee / Apprentice', 
            levelType: 'global', 
            coreCompetencies: [ { competencyId: 'c1', expectedProficiency: 1 }, { competencyId: 'c2', expectedProficiency: 1 } ], // Example competency IDs
            salaryBandId: 'SB-Entry',
            progressionTo: ['l2']
        },
        { 
            id: 'l2', 
            name: 'L2', 
            description: 'Junior Staff / Technician', 
            levelType: 'global',
            coreCompetencies: [ { competencyId: 'c1', expectedProficiency: 2 }, { competencyId: 'c3', expectedProficiency: 1 } ],
            salaryBandId: 'SB-Junior',
            progressionTo: ['l3']
        },
        { 
            id: 'l3', 
            name: 'L3', 
            description: 'Senior Staff / Officer', 
            levelType: 'global',
            coreCompetencies: [ { competencyId: 'c2', expectedProficiency: 2 }, { competencyId: 'c3', expectedProficiency: 2 }, { competencyId: 'c4', expectedProficiency: 1 } ],
            salaryBandId: 'SB-Senior',
            progressionTo: ['l4']
        },
        { 
            id: 'l4', 
            name: 'L4', 
            description: 'Lead / Supervisor', 
            levelType: 'global',
            coreCompetencies: [ { competencyId: 'c4', expectedProficiency: 2 }, { competencyId: 'c5', expectedProficiency: 2 } ],
            salaryBandId: 'SB-Lead',
            progressionTo: ['l5']
        },
        { 
            id: 'l5', 
            name: 'L5', 
            description: 'Manager / Captain', 
            levelType: 'global',
            coreCompetencies: [ { competencyId: 'c5', expectedProficiency: 3 }, { competencyId: 'c6', expectedProficiency: 2 } ],
            salaryBandId: 'SB-Manager',
            progressionTo: [] // Top level in this example
        },
    ],
    editingTarget: null // holds { type: 'group'/'level'/'job', id: '...' }
};

export const STEPS = ["Organization", "Business Unit", "Department", "Role Groups", "Job Levels", "Add Jobs", "Skill Gaps", "Career Paths", "Review & AI"];

// --- HELPER FUNCTIONS ---
export const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getIcon = (name) => {
    const icons = {
        Plus: `<path d="M5 12h14m-7-7v14" />`,
        Trash: `<path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 5v6m4-6v6" />`,
        Edit: `<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />`,
        Check: `<path d="M20 6L9 17l-5-5" />`,
        X: `<path d="M18 6L6 18M6 6l12 12" />`,
        Zap: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />`,
        GitBranch: `<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>`,
        ClipboardList: `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path>`,
        ChevronRight: `<polyline points="9 18 15 12 9 6"></polyline>`,
        ChevronDown: `<polyline points="6 9 12 15 18 9"></polyline>`,
        ChevronUp: `<polyline points="18 15 12 9 6 15"></polyline>`,
        Search: `<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>`,
        Info: `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>`
    };
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">${icons[name] || ''}</svg>`;
};

// --- STATE MUTATION ---
export function updateState(newState) {
    state = { ...state, ...newState };
    // console.log('Global state updated:', state); // Optional: for debugging
}

// --- DATA FETCHING FUNCTIONS ---
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            // For 404s specifically, we can assume empty data is acceptable
            if (response.status === 404) {
                console.warn(`Endpoint ${endpoint} not found (404), returning empty array.`);
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status} for ${endpoint}`);
        }
        // Check if response body is empty before trying to parse JSON
        const text = await response.text();
        if (!text) {
            console.warn(`Empty response body for ${endpoint}, returning empty array.`);
            return [];
        }
        return JSON.parse(text); // Parse text manually after checking it's not empty
    } catch (error) {
        console.error(`Error fetching or parsing JSON for ${endpoint}:`, error);
        // Potentially update state to show an error message in the UI
        return []; // Return empty array on error to prevent crashes
    }
}

export async function loadCapabilities() {
    let response = await fetchData('/capabilities?per_page=10000'); // Fetch all for navigator
    let capabilities = response && response.capabilities ? response.capabilities : [];
    if (!Array.isArray(capabilities)) capabilities = []; // Ensure it's an array
    updateState({ capabilities });
    console.log('Capabilities loaded:', capabilities.length);
}

export async function loadCompetencies() {
    // Assuming competencies API returns behaviors nested within each competency object
    // and skills are linked by competencyId.
    let response = await fetchData('/competencies?per_page=10000'); // Fetch all for navigator
    let competencies = response && response.competencies ? response.competencies : [];
    if (!Array.isArray(competencies)) competencies = []; // Ensure it's an array
    
    // --- BEGIN ADDED LOG ---
    if (competencies.length > 0) {
        console.log('[state.js] loadCompetencies: First competency object from API (raw):', JSON.parse(JSON.stringify(competencies[0])));
    } else {
        console.log('[state.js] loadCompetencies: API returned no competencies.');
    }
    // --- END ADDED LOG ---

    const processedCompetencies = competencies.map(comp => {
        const capabilityId = comp.capability_id !== undefined ? parseInt(comp.capability_id, 10) : (comp.capabilityId !== undefined ? parseInt(comp.capabilityId, 10) : undefined);
        // Assuming behaviors might come as 'behaviors' or 'behaviours'
        const behaviors = comp.behaviors || comp.behaviours || []; 
        return {
            ...comp,
            id: parseInt(comp.id, 10),
            capabilityId: capabilityId,
            // Standardize to 'behaviors' (plural, camelCase if it were an object, but it's an array of strings)
            // Or, if the API sends 'behaviours' (UK spelling), ensure skillNavigator.js uses that.
            // For now, let's assume skillNavigator.js checks for both `comp.behaviours || comp.behaviors`
            // So, we just pass through whatever the API gives, or initialize to empty array.
            // Let's ensure the property used by skillNavigator is present, defaulting to empty.
            // skillNavigator uses `competency?.behaviours || competency?.behaviors`
            // So, if API sends `behaviors`, we should ensure `behaviours` is also available or vice-versa, or standardize.
            // Let's assume API sends `behaviors` and skillNavigator will be updated to prefer that.
            // Or, if API sends `behaviours`, that's fine too.
            // The current skillNavigator code already checks both.
            behaviors: behaviors // Store as 'behaviors'
        };
    });

    if (processedCompetencies.length > 0) {
        console.log('[state.js] loadCompetencies: First competency object after processing:', JSON.parse(JSON.stringify(processedCompetencies[0])));
    }

    updateState({ competencies: processedCompetencies });
    console.log('Competencies loaded:', competencies.length);
}

export async function loadOntologySkills() {
    let response = await fetchData('/skills?per_page=10000'); // Fetch all for navigator
    let rawSkillsFromApi = response && response.skills ? response.skills : [];
    if (!Array.isArray(rawSkillsFromApi)) rawSkillsFromApi = []; 

    // --- BEGIN ADDED LOG ---
    if (rawSkillsFromApi.length > 0) {
        console.log('[state.js] loadOntologySkills: First skill object from API (raw):', JSON.parse(JSON.stringify(rawSkillsFromApi[0])));
    } else {
        console.log('[state.js] loadOntologySkills: API returned no skills.');
    }
    // --- END ADDED LOG ---

    // Process skills to ensure correct property names and types
    const processedSkills = rawSkillsFromApi.map(skill => {
        const competencyId = skill.competency_id !== undefined ? parseInt(skill.competency_id, 10) : (skill.competencyId !== undefined ? parseInt(skill.competencyId, 10) : undefined);
        return {
            ...skill,
            id: parseInt(skill.id, 10), // Ensure skill ID is a number
            competencyId: competencyId, // Ensure competencyId is a number and camelCase
            // proficiencyLevels should ideally be part of the skill object from API
            // If not, ensure it's initialized, e.g., skill.proficiencyLevels || []
            proficiencyLevels: skill.proficiencyLevels || skill.proficiencies || [] 
        };
    });
    
    if (processedSkills.length > 0) {
        console.log('[state.js] loadOntologySkills: First skill object after processing:', JSON.parse(JSON.stringify(processedSkills[0])));
    }

    updateState({ ontologySkills: processedSkills });
    console.log('Ontology Skills loaded:', processedSkills.length); // Corrected variable name
}

export async function initializeOntologyData() {
    console.log('Initializing ontology data...');
    await Promise.all([
        loadCapabilities(),
        loadCompetencies(),
        loadOntologySkills()
    ]);
    console.log('All ontology data loaded and state updated.');
    // Potentially trigger a re-render if components depend on this data being available at init
    // This might be handled by the main application logic that calls initializeOntologyData
}

// Call initializeOntologyData when the module is loaded or at an appropriate point in app lifecycle.
// For simplicity here, let's assume it will be called from main.js or similar.
// If this state module is central and loaded early, calling it here might be an option,
// but it's often better to control initialization from the main application script.
// Example: initializeOntologyData(); // This would run when state.js is imported.
// Better: Export initializeOntologyData and call it from main.js
