import { capabilitiesData, competenciesData, skillsData as ontologySkillsData } from './data/skillsOntology.js';

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
    // Skill Ontology Data
    capabilities: capabilitiesData,
    competencies: competenciesData,
    ontologySkills: ontologySkillsData,
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
}
