// --- MOCK DATA ---
const MOCK_GLOBAL_IMPACT_TRENDS = [
    "Sustainable Aviation Fuels (SAF)", "AI in Flight Path Optimization", "Next-Gen Air Traffic Management",
    "Advanced Air Mobility (AAM)", "Pilot & Technician Shortages", "Enhanced Passenger Experience Tech"
];
const MOCK_INDUSTRIES = ["Airline", "Aerospace Manufacturing", "Logistics & Cargo", "Technology", "Healthcare"];
const MOCK_ROLES_BY_INDUSTRY = {
  Airline: [
    { id: "al_pilot", name: "Commercial Pilot", trend: "stable", presence: 0.15, futureReadiness: 80, calibration: 90, skills: ["Flight Operations", "Aircraft Systems", "Navigation", "Crew Resource Management", "FAA Regulations"], department: "Flight Operations", jobFamily: "Flight Crew", version: "2.5" },
    { id: "al_fa", name: "Flight Attendant", trend: "rising", presence: 0.20, futureReadiness: 75, calibration: 85, skills: ["Passenger Safety", "Customer Service (Airline)", "Emergency Procedures", "In-Flight Service"], department: "In-Flight Services", jobFamily: "Cabin Crew", version: "1.8" },
    { id: "al_am", name: "Aircraft Mechanic", trend: "rising", presence: 0.10, futureReadiness: 85, calibration: 92, skills: ["Aircraft Maintenance", "Avionics", "Hydraulic Systems", "Engine Repair", "FAA Part 145"], department: "Maintenance & Engineering", jobFamily: "Technician", version: "3.0" },
    { id: "al_atc", name: "Air Traffic Controller", trend: "stable", presence: 0.05, futureReadiness: 88, calibration: 95, skills: ["Air Traffic Control Systems", "Radar Operations", "Communication Protocols", "Decision Making"], department: "Air Traffic Services", jobFamily: "Operations Control", version: "2.2" },
    { id: "al_gom", name: "Ground Operations Manager", trend: "rising", presence: 0.08, futureReadiness: 78, calibration: 80, skills: ["Ground Handling", "Ramp Safety", "Baggage Systems", "Turnaround Management", "Logistics"], department: "Ground Operations", jobFamily: "Manager", version: "1.9" },
  ],
  AerospaceManufacturing: [
    { id: "am_ae", name: "Aerospace Engineer", trend: "rising", presence: 0.12, futureReadiness: 90, calibration: 93, skills: ["Aerodynamics", "Structural Analysis", "Propulsion Systems", "CAD Software (CATIA/SolidWorks)"], department: "Engineering", jobFamily: "Engineer", version: "2.8" },
  ],
  Technology: [
    { id: "tech_se", name: "Software Engineer (Aviation Systems)", trend: "rising", presence: 0.07, futureReadiness: 92, calibration: 95, skills: ["Python", "C++", "Real-Time Operating Systems (RTOS)", "Avionics Software Development", "DO-178C"], department: "R&D", jobFamily: "Developer", version: "3.2" },
  ],
};
const MOCK_SKILLS_CATALOG = {
  "Flight Operations": { trend: "stable", proficiencyLevels: 5, adjacent: ["Instrument Flight Rules (IFR)", "Multi-Crew Coordination"], description: "Managing and conducting aircraft flight operations safely and efficiently." },
  "Aircraft Systems": { trend: "stable", proficiencyLevels: 5, adjacent: ["Flight Control Systems", "Navigation Systems"], description: "In-depth knowledge of various aircraft mechanical and electronic systems." },
  "Navigation": { trend: "rising", proficiencyLevels: 5, adjacent: ["GPS Technology", "Inertial Navigation Systems"], description: "Planning and executing flight paths using various navigational aids and systems." },
  "Crew Resource Management": { trend: "rising", proficiencyLevels: 5, adjacent: ["Team Communication", "Situational Awareness"], description: "Effective use of all available resources to ensure safe and efficient flight operations." },
  "FAA Regulations": { trend: "stable", proficiencyLevels: 5, adjacent: ["Airworthiness Directives", "Safety Management Systems (SMS)"], description: "Comprehensive understanding and adherence to Federal Aviation Administration rules." },
  "Passenger Safety": { trend: "stable", proficiencyLevels: 5, adjacent: ["First Aid/CPR", "Evacuation Procedures"], description: "Ensuring the safety and well-being of passengers during flight." },
  "Customer Service (Airline)": { trend: "rising", proficiencyLevels: 5, adjacent: ["Conflict Resolution", "Passenger Assistance"], description: "Providing high-quality service to airline passengers before, during, and after flights." },
  "Aircraft Maintenance": { trend: "rising", proficiencyLevels: 5, adjacent: ["Non-Destructive Testing (NDT)", "Component Overhaul"], description: "Performing scheduled and unscheduled maintenance on aircraft." },
  "Avionics": { trend: "rising", proficiencyLevels: 5, adjacent: ["Autopilot Systems", "Communication Systems Repair"], description: "Maintenance and repair of aircraft electronic systems." },
  "Ground Handling": { trend: "stable", proficiencyLevels: 5, adjacent: ["Aircraft Marshalling", "Cargo Loading"], description: "Managing aircraft services and operations on the ground." },
  "Sustainable Aviation Fuels (SAF)": { trend: "emerging", proficiencyLevels: 5, adjacent: ["Biofuel Technology", "Emissions Reduction Strategies"], description: "Knowledge of alternative, sustainable fuels for aviation." },
  "AI in Flight Path Optimization": { trend: "emerging", proficiencyLevels: 5, adjacent: ["Machine Learning Algorithms", "Big Data Analytics"], description: "Using AI to optimize flight routes for fuel efficiency and time." },
  "FAA Part 145": { trend: "stable", proficiencyLevels: 5, adjacent: ["Quality Control Systems", "Repair Station Manuals"], description: "Knowledge of FAA regulations governing repair stations." },
  "Flight Planning": { trend: "stable", proficiencyLevels: 5, adjacent: ["Meteorology", "Performance Calculations"], description: "Creating safe and efficient flight plans." },
  "Meteorology": { trend: "stable", proficiencyLevels: 5, adjacent: ["Weather Radar Interpretation", "Atmospheric Science"], description: "Understanding weather patterns and their impact on aviation." },
};

// New Mock Data for Role Groups and Job Levels
const MOCK_ROLE_GROUPS = [
    { id: "rg_flight_crew", name: "Flight Crew", description: "Pilots and other flight personnel responsible for aircraft operation." },
    { id: "rg_cabin_crew", name: "Cabin Crew", description: "Flight attendants and in-flight service personnel." },
    { id: "rg_maintenance", name: "Maintenance & Engineering", description: "Technicians and engineers responsible for aircraft airworthiness." },
    { id: "rg_ground_ops", name: "Ground Operations", description: "Personnel managing airport ground services and logistics." },
    { id: "rg_ops_control", name: "Operations Control", description: "Dispatchers and controllers managing flight logistics and safety." },
    { id: "rg_management", name: "Management & Administration", description: "Managerial and administrative roles supporting airline operations." }
];

const MOCK_JOB_LEVELS = ["Entry", "Junior", "Mid-Level", "Senior", "Lead", "Principal", "Manager", "Director"];

const MOCK_COMPANY_ROLES_DB = [
    { id: "crole_al_001", title: "Captain B777", version: "3.0", roleGroupId: "rg_flight_crew", jobLevel: "Senior", jobFamily: "Flight Crew", department: "Flight Operations", calibrationCompleteness: 98, futureReadiness: 82, status: "Active", lastUpdated: "2024-05-28", skills: [{name: "Flight Operations", current: 5, target: 5}, {name: "Aircraft Systems", current: 4, target: 5}, {name: "Crew Resource Management", current: 5, target: 5}] },
    { id: "crole_al_002", title: "Senior Aircraft Mechanic (Avionics)", version: "2.5", roleGroupId: "rg_maintenance", jobLevel: "Senior", jobFamily: "Technician", department: "Maintenance & Engineering", calibrationCompleteness: 92, futureReadiness: 88, status: "Active", lastUpdated: "2024-06-01", skills: [{name: "Avionics", current: 4, target: 5}, {name: "Aircraft Maintenance", current: 4, target: 4}, {name: "FAA Part 145", current: 4, target: 5}] },
    { id: "crole_al_003", title: "Cabin Manager", version: "1.5", roleGroupId: "rg_cabin_crew", jobLevel: "Lead", jobFamily: "Cabin Crew", department: "In-Flight Services", calibrationCompleteness: 80, futureReadiness: 75, status: "Active", lastUpdated: "2024-05-15", skills: [{name: "Passenger Safety", current: 4, target: 5}, {name: "Customer Service (Airline)", current: 4, target: 5}] },
    { id: "crole_al_004", title: "Dispatcher", version: "2.0", roleGroupId: "rg_ops_control", jobLevel: "Mid-Level", jobFamily: "Operations Control", department: "Flight Dispatch", calibrationCompleteness: 85, futureReadiness: 80, status: "Needs Review", lastUpdated: "2024-05-22", skills: [{name: "Flight Planning", current: 4, target: 4}, {name: "Meteorology", current: 3, target: 4}] },
    { id: "crole_al_005", title: "Junior First Officer A320", version: "1.0", roleGroupId: "rg_flight_crew", jobLevel: "Junior", jobFamily: "Flight Crew", department: "Flight Operations", calibrationCompleteness: 70, futureReadiness: 65, status: "Draft", lastUpdated: "2024-06-05", skills: [{name: "Flight Operations", current: 2, target: 3}, {name: "Aircraft Systems", current: 1, target: 3}] },
];

const ROLE_RELATIONSHIPS = {
    "crole_al_005": { // Junior First Officer A320
        feederRoles: [],
        nextRoles: ["crole_al_001"] // Captain B777 (as a general progression)
    },
    "crole_al_001": { // Captain B777
        feederRoles: ["crole_al_005"], // Junior First Officer A320
        nextRoles: []
    },
    "crole_al_002": { // Senior Aircraft Mechanic (Avionics)
        feederRoles: [],
        nextRoles: ["rg_management_lead_maintenance"] // Hypothetical lead role
    },
    // Add more relationships as needed based on MOCK_COMPANY_ROLES_DB
};

const MOCK_CAREER_PATHS = [
    { id: "cp_001", fromRoleId: "crole_al_005", toRoleId: "crole_al_001", type: "Vertical", description: "Progression from Junior First Officer to Captain.", bridgeSkills: ["Advanced Aircraft Systems", "Leadership"] },
    { id: "cp_002", fromRoleId: "crole_al_002", toRoleId: "rg_management_lead_maintenance", type: "Horizontal", description: "Transition from Senior Mechanic to a Lead role in Maintenance Management.", bridgeSkills: ["Team Management", "Budgeting"] } // Assuming rg_management_lead_maintenance is a hypothetical role ID
];

const MOCK_REGIONAL_PRESENCE = {
    "Commercial Pilot": [
        { region: "North America", trend: "stable", presence: 0.35, topCountries: ["USA", "Canada"], salaryRange: "$120k - $250k+" },
        { region: "EMEA", trend: "rising", presence: 0.30, topCountries: ["UK", "Germany", "UAE"], salaryRange: "€80k - €180k" },
        { region: "APAC", trend: "rising", presence: 0.25, topCountries: ["China", "Singapore", "Australia"], salaryRange: "$90k - $200k (PPP Adjusted)" },
    ],
    "Aircraft Mechanic": [
        { region: "North America", trend: "rising", presence: 0.40, topCountries: ["USA", "Canada"], salaryRange: "$60k - $95k" },
        { region: "EMEA", trend: "stable", presence: 0.30, topCountries: ["Germany", "France", "UK"], salaryRange: "€45k - €75k" },
    ]
};

// --- Global State ---
let appState = {
    activeTab: 'talentIntelligence', // Default to Talent Intelligence
    globalNotification: { message: "", type: "info", key: 0 },
    talentIntelligence: {
        searchTerm: "",
        selectedIndustry: MOCK_INDUSTRIES[0],
        selectedRole: null,
    },
    roleArchitecture: {
        roles: JSON.parse(JSON.stringify(MOCK_COMPANY_ROLES_DB)), // Deep copy for editing
        roleGroups: JSON.parse(JSON.stringify(MOCK_ROLE_GROUPS)),
        jobLevels: [...MOCK_JOB_LEVELS],
        careerPaths: JSON.parse(JSON.stringify(MOCK_CAREER_PATHS)),
        editingRole: null,
        editingRoleGroup: null, // For managing role groups
        editingCareerPath: null, // For managing career paths
        activeSubTab: 'roles', // 'roles', 'groups', 'levels', 'paths'
        step: 1, // For role creation/editing wizard
        skillSearch: '',
    },
    skillsPlanning: {
        planGenerated: false,
        teamForPlan: "Flight Operations",
        planningFocus: "Next-Gen Aircraft Transition",
    },
    skillsIntelligence: { 
        searchTerm: "",
        selectedDataView: "overview", // For the main dashboard part, if still used
        analyzerView: 'form', // Can be 'form' or 'results'
        analysisResultsHTML: '', // To store generated results HTML for the full results view - DEPRECATED by analysisCardData
        analysisCardData: [], // To store structured card data for the results dashboard
    },
    coPilot: {
        activeCoPilot: 'jobSeeker',
        jobSeekerChatRefId: 'jobSeekerChatBody', 
        employeeChatRefId: 'employeeChatBody',
        recruiterChatRefId: 'recruiterChatBody',
        hrChatRefId: 'hrChatBody',
        jobSeekerMessages: [{ sender: 'bot', text: "Welcome! Aspiring to join the airline industry? I can help you build a resume or find roles. What's your zip code?" }],
        employeeMessages: [{ sender: 'bot', text: "Hi there! How can I assist with your airline career development today? Ask about type ratings, recurrent training, or career progression." }],
        recruiterMessages: [{ sender: 'bot', text: "Hello! Need help sourcing pilots, cabin crew, or mechanics? I can assist with JDs, candidate screening, and interview scheduling." }],
        hrMessages: [{ sender: 'bot', text: "Welcome! I'm here to help with HR tasks for our airline. Ask about crew scheduling systems, FAA compliance tracking, or union agreement lookups." }],
    }
};

// --- SVG Icon Functions ---
const IconBriefcase = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
const IconTrendingUp = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`;
const IconSettings = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 .25 1l-.43.18V7.5a2 2 0 0 1-1-1.73l-.43-.25a2 2 0 0 1-2 0l-.15.08a2 2 0 0 0-2.73-.73l-.22-.38a2 2 0 0 0 .73-2.73l.15-.1a2 2 0 0 1 .25-1l.43-.18V2a2 2 0 0 0-2-2h.44a2 2 0 0 0 2 2v.18a2 2 0 0 1 1 1.73l.43.25a2 2 0 0 1 2 0l.15-.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-.25-1l-.43-.18V2a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const IconSearch = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const IconLightbulb = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 3.03 1.09 5.21 2.53 6.83L12 22l4.47-6.17C17.91 14.21 19 12.03 19 9a7 7 0 0 0-7-7z"></path></svg>`;
const IconCheckCircle = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
const IconXCircle = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
const IconUserPlus = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line><line x1="20" y1="8" x2="20" y2="14"></line></svg>`;
const IconBarChart3 = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`;
const IconMapPin = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
const IconLayers = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polygon points="2 17 12 22 22 17"></polygon><polygon points="2 12 12 17 22 12"></polygon></svg>`;
const IconClipboardList = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>`;
const IconBrain = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7M14.5 2A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 7M4 14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3Z"/><path d="M12 7v3M9.5 12A2.5 2.5 0 0 1 12 9.5v0A2.5 2.5 0 0 1 9.5 7M14.5 12A2.5 2.5 0 0 0 12 9.5v0A2.5 2.5 0 0 0 14.5 7M4.5 10.5A2.5 2.5 0 0 1 7 13v0a2.5 2.5 0 0 1-2.5 2.5M19.5 10.5A2.5 2.5 0 0 0 17 13v0a2.5 2.5 0 0 0 2.5 2.5"/></svg>`;
const IconInfo = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
const IconArrowUpRight = (size=16, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;
const IconArrowRight = (size=16, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const IconArrowDownRight = (size=16, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline></svg>`;
const IconPlusCircle = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
const IconEdit3 = (size=14, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
const IconFilter = (size=14, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`;
const IconUploadCloud = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>`;
const IconMap = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`;
const IconTarget = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`;
const IconSlidersHorizontal = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>`;
const IconThumbsUp = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"></path><path d="M15 5.45a2.5 2.5 0 0 1 5 0V10h-2.5a2.5 2.5 0 0 0-5 0V5.45z"></path><path d="M7 10h2.5a2.5 2.5 0 0 0 5 0V5.45A2.5 2.5 0 0 1 12 3a2.5 2.5 0 0 1 2.5 2.45V10"></path><path d="M15 10h5.5a2 2 0 0 1 1.5 3.5L18 22h-5.5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2z"></path></svg>`;
const IconAlertTriangle = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
const IconArrowLeft = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`;
const IconThumbsDown = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14V2"></path><path d="M15 18.55a2.5 2.5 0 0 1-5 0V14h2.5a2.5 2.5 0 0 0 5 0v4.55z"></path><path d="M7 14H4.5a2.5 2.5 0 0 0-5 0v4.55A2.5 2.5 0 0 1 0 21a2.5 2.5 0 0 1-2.5-2.45V14"></path><path d="M15 14h-5.5a2 2 0 0 1-1.5-3.5L12 2h5.5a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2z"></path></svg>`;
const IconExternalLink = (size=14, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
const IconPlane = (size=28, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 5.2 5.2c.4.4 1 .5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>`;
const IconWrench = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
const IconUserRoundCheck = (size=20, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 11.873-7.746M16 9A4 4 0 1 1 8 9a4 4 0 0 1 8 0Z"/><path d="m16 19 2 2 4-4"/></svg>`;
const IconBolt = (size=18, cl = "") => `<svg class="${cl}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;


// --- UI Helper Functions ---
function renderModal(title, contentHtml, size = "md", onCloseCallback) {
    const existingModal = document.getElementById('appModal');
    if (existingModal) existingModal.remove();
    const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl", "2xl": "max-w-2xl" };
    const modalHtml = `
        <div id="appModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]">
            <div class="bg-white rounded-lg shadow-xl p-0 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalShow">
                <div class="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-delta-blue">${title}</h3>
                    <button id="modalCloseButton" class="text-gray-400 hover:text-delta-red transition-colors">
                        ${IconXCircle(24)}
                    </button>
                </div>
                <div class="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">${contentHtml}</div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('modalCloseButton').addEventListener('click', () => {
        document.getElementById('appModal').remove();
        if (onCloseCallback) onCloseCallback();
    });
    setTimeout(() => {
        const modalDialog = document.querySelector('#appModal > div');
        if (modalDialog) {
            modalDialog.classList.remove('scale-95', 'opacity-0');
            modalDialog.classList.add('scale-100', 'opacity-100');
        }
    }, 10);
}

function renderCard(title, contentHtml, options = {}) {
    const { iconSvg = '', className = '', headerActionsHtml = '', noPadding = false } = options;
    const headerBg = 'custom-card-header';
    const titleColor = 'text-delta-blue';
    return `
        <div class="custom-card overflow-hidden ${className}">
            ${(title || headerActionsHtml) ? `
            <div class="flex justify-between items-center p-4 ${headerBg}">
                <div class="flex items-center ${titleColor}">
                    ${iconSvg ? `<span class="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3">${iconSvg}</span>` : ''}
                    <h3 class="text-md sm:text-lg font-semibold">${title || ''}</h3>
                </div>
                ${headerActionsHtml ? `<div class="flex items-center space-x-1 sm:space-x-2">${headerActionsHtml}</div>` : ''}
            </div>` : ''}
            <div class="${noPadding ? "" : "p-4"}">${contentHtml}</div>
        </div>`;
}

function renderButton({ onClickId, children, iconSvg = '', variant = "primary", size = "md", className = "", disabled = false, type = "button", dataset = {} }) {
    const baseStyle = `flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`;
    const variants = {
        primary: "bg-delta-blue hover:bg-delta-blue-dark text-white focus:ring-delta-blue",
        secondary: "bg-delta-silver hover:bg-delta-dark-grey text-white focus:ring-delta-silver",
        success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
        danger: "bg-delta-red hover:bg-delta-red-dark text-white focus:ring-delta-red",
        outline: "bg-transparent hover:bg-blue-50 border border-delta-blue text-delta-blue focus:ring-delta-blue",
        ghost: "bg-transparent hover:bg-gray-100 text-delta-dark-grey focus:ring-gray-300",
    };
    const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" };
    let datasetAttributes = '';
    for (const key in dataset) { datasetAttributes += ` data-${key}="${dataset[key]}"`; }
    return `
        <button ${onClickId ? `id="${onClickId}"` : ''} type="${type}" class="${baseStyle} ${variants[variant]} ${sizes[size]} ${className}" ${disabled ? 'disabled' : ''} ${datasetAttributes}>
            ${iconSvg ? `<span class="mr-1.5 h-4 w-4 ${size === 'sm' ? 'h-3.5 w-3.5' : ''}">${iconSvg}</span>` : ''}
            ${children}
        </button>`;
}

function renderPill({ children, color = "blue", className = "", iconSvg = '' }) {
    const colors = {
        blue: "bg-blue-100 text-delta-blue border border-blue-200",
        green: "bg-green-100 text-green-700 border border-green-200",
        yellow: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        red: "bg-red-100 text-delta-red border border-red-200",
        gray: "bg-gray-100 text-delta-dark-grey border border-gray-200",
        purple: "bg-purple-100 text-purple-700 border border-purple-200",
        indigo: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        sky: "bg-sky-100 text-delta-sky-blue border border-sky-200",
    };
    return `<span class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${colors[color]} ${className}">
        ${iconSvg ? `<span class="mr-1 h-3 w-3">${iconSvg}</span>` : ''}
        ${children}
    </span>`;
}

function renderTrendIcon(trend) {
    if (trend === "rising") return IconArrowUpRight(16, "text-green-500 ml-1");
    if (trend === "stable") return IconArrowRight(16, "text-yellow-500 ml-1");
    if (trend === "declining") return IconArrowDownRight(16, "text-red-500 ml-1");
    if (trend === "emerging") return IconTrendingUp(16, "text-purple-500 ml-1");
    return '';
}

function renderGauge({ value, maxValue = 100, label, size="sm", color="blue" }) {
    const percentage = (value / maxValue) * 100;
    const sizeClasses = { sm: { height: "h-2", text: "text-xs" }, md: { height: "h-3", text: "text-sm" } };
    const colorClasses = {
        blue: "bg-delta-blue", green: "bg-green-500", yellow: "bg-yellow-500",
        red: "bg-delta-red", sky: "bg-delta-sky-blue",
    };
    return `
        <div class="w-full">
            ${label ? `<div class="text-gray-600 mb-1 ${sizeClasses[size].text} flex justify-between items-center"><span>${label}</span> <span class="font-semibold">${value}%</span></div>` : ''}
            <div class="w-full bg-gray-200 rounded-full ${sizeClasses[size].height} overflow-hidden">
                <div class="${colorClasses[color]} ${sizeClasses[size].height} rounded-full transition-all duration-500 ease-out" style="width: ${percentage}%;"></div>
            </div>
        </div>`;
}

function renderProficiencySlider({ skill, currentProficiency, targetProficiency, maxProficiency = 5, readOnly = false, onChangeCurrentId, onChangeTargetId, skillIdentifier }) {
    const currentAccent = 'accent-delta-sky-blue';
    const targetAccent = 'accent-green-500';
    return `
        <div class="py-3 border-b border-gray-100 last:border-b-0">
            <p class="text-sm font-medium text-gray-700 mb-1.5">${skill}</p>
            <div class="space-y-2">
                <div>
                    <label class="text-xs text-gray-500 block mb-0.5">Current Proficiency: <span class="font-semibold text-delta-sky-blue">${currentProficiency}</span></label>
                    <input type="range" min="0" max="${maxProficiency}" value="${currentProficiency}"
                        ${onChangeCurrentId ? `id="${onChangeCurrentId}"` : ''} data-skill="${skillIdentifier}" data-type="current"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${currentAccent} disabled:opacity-70 disabled:cursor-not-allowed"
                        ${readOnly ? 'disabled' : ''} />
                </div>
                <div>
                    <label class="text-xs text-gray-500 block mb-0.5">Target Proficiency: <span class="font-semibold text-green-600">${targetProficiency}</span></label>
                    <input type="range" min="0" max="${maxProficiency}" value="${targetProficiency}"
                        ${onChangeTargetId ? `id="${onChangeTargetId}"` : ''} data-skill="${skillIdentifier}" data-type="target"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${targetAccent} disabled:opacity-70 disabled:cursor-not-allowed"
                        ${readOnly ? 'disabled' : ''} />
                </div>
            </div>
        </div>`;
}

function renderAlertBox({ message, type = "info", onDismissId }) {
    if (!message) return '';
    const baseClasses = "p-3 rounded-md text-sm mb-4 flex items-start shadow";
    const typeClasses = {
        info: "bg-blue-50 text-delta-blue border border-blue-200",
        success: "bg-green-50 text-green-700 border border-green-200",
        warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        error: "bg-red-50 text-delta-red border border-red-200",
    };
    const Icons = { info: IconInfo, success: IconCheckCircle, warning: IconAlertTriangle, error: IconXCircle };
    const IconComponent = Icons[type];
    return `
        <div class="${baseClasses} ${typeClasses[type]} animate-fadeIn">
            <span class="mr-2 flex-shrink-0 mt-0.5">${IconComponent(18)}</span>
            <span class="flex-grow">${message}</span>
            ${onDismissId ? `<button id="${onDismissId}" class="ml-2 text-current opacity-70 hover:opacity-100">${IconXCircle(18)}</button>` : ''}
        </div>`;
}

// --- Main Application Structure ---
function renderApp() {
    // Determine the container: #app-container for standalone pages,
    // or #skills-module-content if this script is loaded into index.html (legacy/fallback).
    let container = document.getElementById('app-container');
    if (!container) {
        container = document.getElementById('skills-module-content');
    }

    if (!container) { 
        // console.error("Target container (#app-container or #skills-module-content) not found!");
        return; 
    }
    container.innerHTML = `
        ${'' /* Header removed for integrated view */}
        ${appState.globalNotification.message ? `
            <div class="fixed top-[70px] sm:top-[80px] left-1/2 -translate-x-1/2 w-11/12 max-w-md z-50">
                ${renderAlertBox({ message: appState.globalNotification.message, type: appState.globalNotification.type, onDismissId: 'globalNotificationDismiss' })}
            </div>` : ''}
        <main class="container mx-auto px-0 sm:px-2 py-2 sm:py-4 flex-grow">
            <div id="main-content-area">${renderMainContent()}</div>
        </main>
        ${'' /* Footer removed for integrated view */}`;
    addEventListeners();
    if (appState.globalNotification.message && document.getElementById('globalNotificationDismiss')) {
        document.getElementById('globalNotificationDismiss').addEventListener('click', () => {
            appState.globalNotification.message = "";
            renderApp();
        });
    }
}

function renderHeader() {
    const navItems = [
        { id: 'talentIntelligence', label: 'Talent Intelligence', icon: IconBrain(18) },
        { id: 'skillsIntelligence', label: 'Skills Intelligence', icon: IconBolt(18) }, // New Tab
        { id: 'roleArchitecture', label: 'Role Architecture', icon: IconLayers(18) },
        { id: 'skillsPlanning', label: 'Skills Planning', icon: IconBarChart3(18) },
    ];
    return `
        <header class="bg-delta-blue text-white shadow-md sticky top-0 z-40">
            <div class="container mx-auto px-2 sm:px-4">
                <div class="flex flex-col sm:flex-row justify-between items-center py-2.5 sm:py-3">
                    <div class="flex items-center text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
                        ${IconPlane(28, "mr-2")}
                        <span>Airline<span class="text-delta-red">Talent</span> Pro</span>
                    </div>
                    <nav class="flex flex-wrap justify-center gap-1">
                        ${navItems.map(item => `
                            <button data-tab-id="${item.id}" class="nav-button flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap
                                ${appState.activeTab === item.id ? 'bg-delta-red text-white shadow-md' : 'text-gray-300 hover:bg-delta-sky-blue hover:text-white'}">
                                <span class="hidden sm:inline mr-1 sm:mr-1.5 h-4 w-4">${item.icon}</span>
                                ${item.label}
                            </button>`).join('')}
                    </nav>
                </div>
            </div>
        </header>`;
}

function renderFooter() {
    return `
        <footer class="bg-delta-dark-grey text-slate-300 text-center p-3 sm:p-4 mt-auto text-xs sm:text-sm">
            <p>&copy; ${new Date().getFullYear()} AirlineTalent Pro Inc. (Delta Theme Demo). For demonstration purposes only.</p>
        </footer>`;
}

function renderMainContent() {
    switch (appState.activeTab) {
        case 'talentIntelligence': return renderTalentIntelligence();
        case 'skillsIntelligence': return renderSkillsIntelligencePage(); // New function for the new tab
        case 'roleArchitecture': return renderRoleArchitecture();
        case 'skillsPlanning': return renderSkillsPlanning();
        default: return renderTalentIntelligence(); // Fallback to Talent Intelligence
    }
}

// --- SkillsIntelligence Section (New) ---

// Data for the Skills Analyzer
const SI_TARGET_SKILLS = {
  data_analyst: ['Excel', 'SQL', 'Python', 'Data Visualization', 'Statistics'],
  product_manager: ['Roadmapping', 'Stakeholder Management', 'Market Research', 'SQL', 'Wireframing'],
  software_engineer: ['JavaScript', 'Git', 'React', 'APIs', 'Unit Testing']
};

const SI_ROLE_SUGGESTIONS = {
  data_analyst: ['Business Analyst', 'BI Developer'],
  product_manager: ['Program Manager', 'Product Owner'],
  software_engineer: ['Frontend Developer', 'Technical Lead']
};

const SI_LEARNING_RESOURCES = {
  'SQL': 'https://www.codecademy.com/learn/learn-sql',
  'Python': 'https://www.learnpython.org/',
  'Excel': 'https://exceljet.net/',
  'Market Research': 'https://www.coursera.org/learn/market-research',
  'Stakeholder Management': 'https://www.udemy.com/course/stakeholder-management/',
  'Roadmapping': 'https://www.productplan.com/roadmaps/',
  'Wireframing': 'https://www.figma.com/learn/wireframing/',
  'Data Visualization': 'https://www.tableau.com/learn/training',
  'React': 'https://reactjs.org/docs/getting-started.html',
  'JavaScript': 'https://javascript.info/',
  'Git': 'https://www.atlassian.com/git/tutorials',
  'Unit Testing': 'https://jestjs.io/docs/getting-started',
  'Statistics': 'https://www.khanacademy.org/math/statistics-probability'
};

const DEFAULT_DATA_ANALYST_RESUME = `Data Analyst Resume

Summary:
Highly analytical and results-oriented Data Analyst with 3+ years of experience in interpreting complex datasets, generating actionable insights, and driving data-informed decision-making. Proficient in SQL, Python, Excel, and data visualization tools like Tableau. Proven ability to clean, transform, and analyze data to identify trends and patterns.

Experience:
Data Analyst | Tech Solutions Inc. | Jan 2022 - Present
- Developed and maintained dashboards to track key performance indicators (KPIs).
- Performed ad-hoc analysis to support business requests.
- Collaborated with cross-functional teams to understand data needs.

Skills:
- Data Analysis: SQL, Python (Pandas, NumPy), Excel (Advanced), R
- Data Visualization: Tableau, Power BI, Matplotlib
- Databases: MySQL, PostgreSQL, SQL Server
- Statistical Analysis
- Problem Solving
- Communication`;

function analyzeSkillsProfile() {
  const profileInputEl = document.getElementById('siProfileInput');
  const jobRoleEl = document.getElementById('siJobRole');

  if (!profileInputEl || !jobRoleEl) {
    console.error("Input elements for skill analysis are missing.");
    setGlobalNotification({ message: "Error: Input fields not found.", type: "error" });
    return;
  }

  const input = profileInputEl.value.toLowerCase();
  const role = jobRoleEl.value;
  const requiredSkills = SI_TARGET_SKILLS[role];

  if (!requiredSkills) {
    console.error(`No skills defined for role: ${role}`);
    setGlobalNotification({ message: `Error: No skills defined for role "${role}".`, type: "error" });
    return;
  }

  const matchedSkills = requiredSkills.filter(skill => input.includes(skill.toLowerCase()));
  const missingSkills = requiredSkills.filter(skill => !matchedSkills.includes(skill));

  appState.skillsIntelligence.analysisCardData = [];

  // Card 1: Detected Skills
  appState.skillsIntelligence.analysisCardData.push({
    title: "Detected Skills",
    content: `<p class="text-sm">${matchedSkills.join(', ') || 'None detected'}</p>`,
    icon: IconCheckCircle(20, "text-green-500")
  });

  // Card 2: Skill Gaps
  appState.skillsIntelligence.analysisCardData.push({
    title: "Skill Gaps",
    content: `<p class="text-sm">${missingSkills.join(', ') || 'None (All target skills detected!)'}</p>`,
    icon: missingSkills.length > 0 ? IconXCircle(20, "text-red-500") : IconThumbsUp(20, "text-green-500")
  });

  // Card 3: Recommended Learning
  let learningContent = '';
  const talentHubLearningLink = "#my-talent-hub"; // Use a relative link
  if (missingSkills.length > 0) {
    learningContent = missingSkills.map(skill => {
      return `<p class="text-sm"><strong>${skill}</strong>: <a href="${talentHubLearningLink}" target="_blank" rel="noopener noreferrer" class="text-delta-sky-blue hover:underline">Access Learning in Talent Hub ${IconExternalLink(12, "inline ml-1")}</a></p>`;
    }).join('');
  } else {
    learningContent = '<p class="text-sm">No specific learning recommendations as no skill gaps were identified.</p>';
  }
  appState.skillsIntelligence.analysisCardData.push({
    title: "Recommended Learning",
    content: learningContent,
    icon: IconLightbulb(20, "text-yellow-500")
  });
  
  // Card 4: Quantum Labor Insight (Mock)
  appState.skillsIntelligence.analysisCardData.push({
    title: "Quantum Labor Insight",
    content: `<p class="text-sm">Demand for <strong>${role.replace('_', ' ')}</strong> roles with skills in ${missingSkills[0] || matchedSkills[0] || 'relevant areas'} has grown by <strong class="text-delta-blue">${Math.floor(Math.random() * 15 + 5)}% YoY</strong> based on global job postings (mock data).</p>`,
    icon: IconTrendingUp(20, "text-purple-500")
  });
  
  // Card 5: Skills-First Career Paths (Mock)
  const suggestedPaths = SI_ROLE_SUGGESTIONS[role] || [];
  if (suggestedPaths.length > 0) {
    appState.skillsIntelligence.analysisCardData.push({
      title: "Skills-First Career Paths",
      content: `<ul class="list-disc list-inside text-sm space-y-1">` +
        suggestedPaths.map(r => `<li>${r} (skill match: ${Math.floor(Math.random() * 30 + 70)}%)</li>`).join('') + '</ul>',
      icon: IconBriefcase(20, "text-indigo-500")
    });
  }

  // Card 6: Real-Time Labor Market Trends (Mock)
  appState.skillsIntelligence.analysisCardData.push({
    title: "Real-Time Labor Market Trends",
    content: `<p class="text-sm">📈 Top trending skills: Python (+${Math.floor(Math.random() * 10 + 10)}%), SQL (+${Math.floor(Math.random() * 8 + 8)}%)</p><p class="text-sm">📉 Declining skills: Excel (-${Math.floor(Math.random() * 5 + 1)}%)</p>`,
    icon: IconBarChart3(20, "text-teal-500")
  });

  // Card 7: Bias Check (Ethical AI - Mock)
  const biasTerms = ['energetic', 'rockstar', 'digital native', 'ninja', 'guru'];
  const foundBias = biasTerms.filter(term => input.includes(term));
  let biasCheckIcon = IconCheckCircle(20, "text-green-500");
  let biasCheckContent = `<p class="text-sm flex items-center"><span class="mr-2">${IconCheckCircle(16, "inline text-green-600")}</span> No biased language detected.</p>`;
  if (foundBias.length) {
    biasCheckIcon = IconAlertTriangle(20, "text-yellow-600");
    biasCheckContent = `<p class="text-sm flex items-center"><span class="mr-2">${IconAlertTriangle(16, "inline text-yellow-600")}</span> Biased terms detected: ${foundBias.join(', ')}</p>`;
  }
  appState.skillsIntelligence.analysisCardData.push({
    title: "Bias Check (Ethical AI)",
    content: biasCheckContent,
    icon: biasCheckIcon
  });

    // Card 8: System Integration
    appState.skillsIntelligence.analysisCardData.push({
        title: "System Integration",
        content: `<div class="flex flex-col sm:flex-row gap-2 mt-1">
            ${renderButton({children: "Connect to Workday (Coming Soon)", variant: "primary", size: "sm", className: "w-full sm:w-auto", disabled: true, iconSvg: IconExternalLink(14)})}
            ${renderButton({children: "Connect to SAP SuccessFactors (Planned)", variant: "primary", size: "sm", className: "w-full sm:w-auto", disabled: true, iconSvg: IconExternalLink(14)})}
        </div>`,
        icon: IconSettings(20, "text-gray-500")
    });
    
  appState.skillsIntelligence.analyzerView = 'results'; // Switch to results view
  renderApp(); // Re-render the app to show the full results page
}


function renderSkillsIntelligencePage() {
    const siState = appState.skillsIntelligence;

    if (siState.analyzerView === 'results') {
        const cardsHtml = siState.analysisCardData.map(cardInfo => {
            // Determine card span based on title or content length, for example
            let cardClassName = "animate-fadeIn"; // Add base animation
            if (cardInfo.title === "Recommended Learning" && cardInfo.content.includes("<li>")) { // Example: make learning list wider
                 // cardClassName += " md:col-span-2"; // This would require grid-cols-2 or 3
            }
            return renderCard(cardInfo.title, cardInfo.content, { iconSvg: cardInfo.icon, className: cardClassName });
        }).join('');

        return `
            <div class="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                <div class="flex justify-between items-center mb-4">
                    <h1 class="text-xl sm:text-2xl font-bold text-delta-blue flex items-center">
                        ${IconBolt(24, "mr-2 text-delta-sky-blue")} Skill Profile Analysis Dashboard
                    </h1>
                    ${renderButton({ onClickId: 'siBackToAnalyzerForm', children: "Back to Analyzer", iconSvg: IconArrowLeft(18), variant: "primary", size: "sm"})}
                </div>
                <div id="siFullResultsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    ${cardsHtml}
                </div>
            </div>
        `;
    }

    // Default to rendering the form view (analyzer input + sidebar)
    const analyzerFormHtml = `
        <div class="skills-analyzer-container mt-0"> 
            <h1>Analyze Individual Skill Profile</h1>
            <h2>1. Input Resume or Employee Profile</h2>
            <textarea id="siProfileInput" class="skills-analyzer-textarea" rows="6" placeholder="Paste resume or employee profile here...">${DEFAULT_DATA_ANALYST_RESUME}</textarea>
            <h2>2. Target Job Role</h2>
            <select id="siJobRole" class="skills-analyzer-select">
              <option value="data_analyst" selected>Data Analyst</option>
              <option value="product_manager">Product Manager</option>
              <option value="software_engineer">Software Engineer</option>
            </select>
            ${renderButton({ onClickId: 'siAnalyzeProfileButton', children: "Analyze Skills & View Results", iconSvg: IconBolt(18), className: "w-full skills-analyzer-button", size: "lg"})}
        </div>
    `;

    return `
        <div class="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 animate-fadeIn">
            <div class="flex flex-col lg:flex-row gap-6">
                <div class="lg:w-2/3"> 
                    ${renderCard('Individual Skill Profile Analyzer', `
                        <p class="text-sm text-gray-600 mb-4">Input a resume or profile text and select a target job role to identify skill matches, gaps, and receive development suggestions. Results will be shown on a new page.</p>
                        ${analyzerFormHtml}
                    `, {iconSvg: IconBolt(24), noPadding: true })} 
                </div>

                <div class="lg:w-1/3 space-y-6"> 
                    ${renderCard('Top In-Demand Skills (Org-Wide)', `
                        <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
                            <li class="skill-item skill-emerging">AI & Machine Learning ${renderTrendIcon('emerging')}</li>
                            <li class="skill-item skill-rising">Sustainable Aviation Practices ${renderTrendIcon('rising')}</li>
                            <li class="skill-item skill-rising">Advanced Data Analytics ${renderTrendIcon('rising')}</li>
                            <li class="skill-item skill-stable">Cybersecurity for Aviation Systems ${renderTrendIcon('stable')}</li>
                        </ul>
                    `, {iconSvg: IconTrendingUp(20)})}
                    
                    ${renderCard('Overall Skill Gap Analysis (Example)', `
                        ${renderGauge({value: 65, label: "Overall Skill Coverage", color: "sky"})}
                        <p class="text-xs text-gray-500 mt-2">Identified gaps in 'Next-Gen Avionics Maintenance'.</p>
                    `, {iconSvg: IconTarget(20)})}

                    ${renderCard('Quick Actions', `
                        ${renderButton({onClickId: 'siExploreMoreMatrix', children: "Explore Full Skills Matrix", iconSvg: IconBrain(18), variant: "primary", className: "w-full"})}
                    `, {iconSvg: IconSettings(20)})}
                </div>
            </div>
        </div>
    `;
}


// --- TalentIntelligence Section ---
function renderTalentIntelligence() {
    const tiState = appState.talentIntelligence;

    if (tiState.selectedRole) { // Role Deep Dive View
        const role = tiState.selectedRole;
        const roleSkills = (Array.isArray(role.skills) ? role.skills : []).map(s => {
            if (typeof s === 'string') {
                const catalogEntry = MOCK_SKILLS_CATALOG[s];
                return {
                    name: s,
                    current: Math.floor(Math.random()*2)+2,
                    target: Math.floor(Math.random()*2)+3,
                    maxProficiency: catalogEntry ? catalogEntry.proficiencyLevels : 5
                };
            }
            return {...s, maxProficiency: (MOCK_SKILLS_CATALOG[s.name] ? MOCK_SKILLS_CATALOG[s.name].proficiencyLevels : 5)};
        });

        const regionalPresenceData = MOCK_REGIONAL_PRESENCE[role.name] || [];
        const RoleIcon = role.jobFamily === "Flight Crew" ? IconPlane : role.jobFamily === "Technician" ? IconWrench : IconUserRoundCheck;

        let skillsProfileCardContent = `
            <div class="p-4 max-h-80 overflow-y-auto custom-scrollbar">
                ${roleSkills.map((skillDetail, index) => renderProficiencySlider({
                    skill: skillDetail.name,
                    currentProficiency: skillDetail.current,
                    targetProficiency: skillDetail.target,
                    maxProficiency: skillDetail.maxProficiency,
                    onChangeCurrentId: `tiRoleSkillCurrent-${index}`,
                    onChangeTargetId: `tiRoleSkillTarget-${index}`,
                    skillIdentifier: skillDetail.name
                })).join('')}
                ${roleSkills.length === 0 ? `<p class="text-sm text-gray-500 text-center py-4">No specific skills defined for this mock role.</p>` : ''}
            </div>
            ${roleSkills.length > 0 ? `
            <div class="p-4 border-t">
                ${renderButton({ onClickId: 'tiAddRecommendedSkills', children: "View & Add Recommended Skills", iconSvg: IconPlusCircle(18), variant: "primary", className: "w-full"})}
            </div>` : ''}
            <div class="p-4 border-t">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Add New Skill to Catalog & All Roles</h4>
                <div class="flex gap-2">
                    <input type="text" id="tiAddNewSkillInput" placeholder="Enter new skill name..." class="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-delta-blue focus:border-delta-blue text-sm">
                    ${renderButton({ onClickId: 'tiHandleAddNewSkill', children: "Add Skill", iconSvg: IconPlusCircle(18), variant: "primary", size: "sm"})}
                </div>
            </div>`;

        return `
            <div class="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between">
                ${renderButton({ onClickId: 'tiBackToIndustry', children: `Back to ${tiState.selectedIndustry || "Search"}`, iconSvg: IconArrowLeft(18), variant: "primary", size: "sm"})}
                <h2 class="text-xl sm:text-2xl font-bold text-delta-blue text-right flex items-center">
                    ${RoleIcon(28, "mr-2 text-delta-sky-blue")}
                        ${role.name} ${renderPill({children: `v${role.version || "1.0"}`, color: "gray", className: "ml-2"})}
                    </h2>
                </div>
                <div class="grid md:grid-cols-3 gap-4 sm:gap-6">
                    ${renderCard(`Future Readiness`, `
                        ${renderGauge({value: role.futureReadiness || 70, label: "Readiness Score", color: role.futureReadiness > 80 ? "green" : role.futureReadiness > 60 ? "sky" : "yellow"})}
                        <p class="text-xs text-gray-500 mt-2">Based on evolving skill demands and current skill profile for this role.</p>
                    `, { iconSvg: IconTarget(20), className: "md:col-span-1"})}

                    ${renderCard(`Skills Profile`, skillsProfileCardContent, { iconSvg: IconSlidersHorizontal(20), className: "md:col-span-2", noPadding: true})}
                </div>
                ${renderCard(`Market Insights: Top Skills Being Hired`, `
                    <div class="flex flex-wrap gap-2">
                        ${roleSkills.slice(0,5).map(skill => renderPill({ key: skill.name, children: skill.name, color: "sky"})).join('')}
                        ${(MOCK_SKILLS_CATALOG[roleSkills[0]?.name]?.adjacent || ["Communication", "Problem Solving"]).slice(0,2).map(adjSkill => renderPill({ key: adjSkill, children: `${adjSkill} (Adjacent)`, color: "green"})).join('')}
                        ${roleSkills.length === 0 ? `<p class="text-sm text-gray-500">No skills data to show market insights.</p>` : ''}
                    </div>
                `, { iconSvg: IconTrendingUp(20)})}

                ${renderCard(`Global Talent Presence & Compensation`, `
                    ${regionalPresenceData.length > 0 ? `
                        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${regionalPresenceData.map(region => `
                                <div class="p-3 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition-shadow">
                                    <div class="flex justify-between items-center mb-1">
                                        <h4 class="font-semibold text-gray-700">${region.region}</h4>
                                        ${renderTrendIcon(region.trend)}
                                    </div>
                                    <p class="text-sm text-gray-600">Presence: <span class="font-bold">${region.presence * 100}%</span></p>
                                    <p class="text-xs text-gray-500 mt-1">Top Countries: ${region.topCountries.join(', ')}</p>
                                    <p class="text-xs text-gray-500 mt-1">Salary Range (Est.): <span class="font-semibold">${region.salaryRange}</span></p>
                                </div>`).join('')}
                        </div>` : `<p class="text-gray-500">No regional presence data available for this role.</p>`}
                `, { iconSvg: IconMap(20)})}
            </div>`;
    }

    const industryData = (() => {
        if (!tiState.selectedIndustry) return null;
        const rolesInIndustry = MOCK_ROLES_BY_INDUSTRY[tiState.selectedIndustry] || [];
        const allSkillsInIndustry = new Set();
        rolesInIndustry.forEach(role => role.skills.forEach(skill => allSkillsInIndustry.add(typeof skill === 'string' ? skill : skill.name)));
        return {
            name: tiState.selectedIndustry,
            commonRoles: rolesInIndustry.sort((a,b) => b.presence - a.presence).slice(0, 4).map(r => ({ ...r, keySkills: r.skills.slice(0,2).map(s => typeof s === 'string' ? s : s.name) })),
            risingRoles: rolesInIndustry.filter(r => r.trend === 'rising').slice(0, 4),
            commonSkills: Array.from(allSkillsInIndustry).slice(0, 6).map(s => ({ name: s, trend: MOCK_SKILLS_CATALOG[s]?.trend || 'stable' })),
        };
    })();

    return `
        <div class="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 animate-fadeIn">
            ${renderCard('', `
                <h2 class="text-xl sm:text-2xl font-bold text-delta-blue mb-1">Explore Insights and Trends</h2>
                <p class="text-sm text-gray-600 mb-4">Evaluate skill and role trends across your company, industry, and the global workforce.</p>
                <div class="flex flex-col sm:flex-row gap-2">
                    <select id="tiIndustrySelect" class="flex-grow p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-delta-blue focus:border-delta-blue text-sm">
                        <option value="">-- Select Industry --</option>
                        ${MOCK_INDUSTRIES.map(ind => `<option value="${ind}" ${tiState.selectedIndustry === ind ? 'selected' : ''}>${ind}</option>`).join('')}
                    </select>
                    <input id="tiSearchTermInput" type="text" placeholder="Or search for role/skill (e.g., Pilot)" value="${tiState.searchTerm}"
                        class="flex-grow p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-delta-blue focus:border-delta-blue text-sm"/>
                    ${renderButton({ onClickId: 'tiSearchButton', children: "Search", iconSvg: IconSearch(18), className: "px-6 w-full sm:w-auto"})}
                </div>`)}
            ${tiState.selectedIndustry && industryData ? `
                <div class="grid lg:grid-cols-3 gap-4 sm:gap-6">
                    <div class="lg:col-span-2 space-y-4 sm:space-y-6">
                        ${renderCard(`Key Roles in ${industryData.name}`, `
                            <div class="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                                ${industryData.commonRoles.map(role => `
                                    <div data-role-id="${role.id}" class="ti-role-item p-3 border rounded-md hover:shadow-lg transition-shadow cursor-pointer bg-white">
                                        <div class="flex justify-between items-start">
                                            <h4 class="font-semibold text-delta-sky-blue hover:underline">${role.name}</h4>
                                            <div class="flex items-center space-x-1 text-xs text-gray-500 whitespace-nowrap">
                                                ${renderTrendIcon(role.trend)} <span class="capitalize">${role.trend}</span>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-500">Presence: ${role.presence * 100}%</p>
                                        <div class="mt-1.5 flex flex-wrap gap-1">
                                            ${role.keySkills.map(skillName => renderPill({ children: skillName, color: "gray", className: "text-xs"})).join('')}
                                            ${role.skills.length > 2 ? renderPill({ children: `+${role.skills.length - 2} more`, color: "gray", className: "text-xs"}) : ''}
                                        </div></div>`).join('')}
                                ${industryData.commonRoles.length === 0 ? `<p class="text-sm text-gray-500 text-center py-4">No specific roles defined for this industry.</p>` : ''}
                            </div>`, { iconSvg: industryData.name === "Airline" ? IconPlane(20) : IconBriefcase(20), noPadding: true })}
                        ${renderCard(`Most Common Skills in ${industryData.name}`, `
                            <div class="flex flex-wrap gap-2">
                                ${industryData.commonSkills.map(skill => `
                                    <div class="flex items-center p-1.5 bg-gray-50 rounded-md border">
                                        ${renderPill({ children: skill.name, color: "indigo"})} ${renderTrendIcon(skill.trend)}
                                    </div>`).join('')}
                                ${industryData.commonSkills.length === 0 ? `<p class="text-sm text-gray-500">No common skills data.</p>` : ''}
                            </div>`, { iconSvg: IconClipboardList(20) })}
                    </div>
                    <div class="lg:col-span-1 space-y-4 sm:space-y-6">
                        ${renderCard(`Global Impact Trends`, `<ul class="space-y-2">
                                ${MOCK_GLOBAL_IMPACT_TRENDS.slice(0,4).map(trend => `
                                    <li class="p-2 bg-purple-50 text-purple-700 text-sm rounded-md border border-purple-100 flex items-center">
                                        ${IconTrendingUp(16, "mr-2 text-purple-500")} ${trend}</li>`).join('')}</ul>`,
                        { iconSvg: IconLightbulb(20) })}
                        ${renderCard(`Build Your Talent Strategy`, `
                        ${renderButton({ onClickId: 'tiCreateRoleManually', children: "Create Role Manually", iconSvg: IconPlusCircle(18), variant: "primary", className: "w-full mb-2"})}
                        ${renderButton({ onClickId: 'tiUploadCompanyData', children: "Upload Company Data", iconSvg: IconUploadCloud(18), variant: "primary", className: "w-full"})}`,
                        { iconSvg: IconSettings(20) })}
                    </div></div>` :
                `<div class="text-center py-10 bg-white rounded-lg shadow-md mt-6">
                    ${IconSearch(48, "mx-auto text-gray-300 mb-4")}
                    <p class="text-xl text-gray-500">Select an industry or search to explore insights.</p>
                    <p class="text-sm text-gray-400 mt-1">Try "Airline" or "Pilot".</p>
                </div>`}
        </div>`;
}

// --- RoleArchitecture Section ---
function renderRoleArchitecture() {
    const raState = appState.roleArchitecture;

    if (raState.editingRole) {
        const role = raState.editingRole;
        const steps = ["Define Details", "Assign Skills", "Calibrate & Approve"];
        const filteredSkillsCatalog = Object.keys(MOCK_SKILLS_CATALOG)
            .filter(skill => skill.toLowerCase().includes(raState.skillSearch.toLowerCase()))
            .slice(0, 5);

        return `
        <div class="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 animate-fadeIn">
            <div class="flex items-center justify-between">
                <h2 class="text-xl sm:text-2xl font-bold text-delta-blue">${role.id.startsWith("new_") ? "Create New Role" : `Edit Role: ${role.title}`}</h2>
                ${renderButton({ onClickId: 'raCancelEdit', children: "Cancel", variant: "primary", iconSvg: IconXCircle(18), size: "sm"})}
            </div>

            <div class="flex justify-around mb-4 sm:mb-6 border-b pb-3">
                ${steps.map((s, i) => `
                    <div class="text-xs sm:text-sm font-medium px-1 sm:px-2 py-1 rounded-md ${raState.step === i + 1 ? 'bg-delta-sky-blue text-white border-b-2 border-delta-blue' : 'text-gray-500 hover:bg-gray-100'}">
                        Step ${i + 1}: ${s}
                    </div>`).join('')}
            </div>

            ${raState.step === 1 ? `
                ${renderCard("Role Details", `
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Role Title <span class="text-red-500">*</span></label>
                            <input type="text" id="raRoleTitle" value="${role.title}" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue" placeholder="e.g., Senior Pilot"/>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Version</label>
                            <input type="text" id="raRoleVersion" value="${role.version}" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue" placeholder="e.g., 1.0"/>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Role Group (Job Family) <span class="text-red-500">*</span></label>
                            <select id="raRoleGroupId" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue">
                                <option value="">-- Select Role Group --</option>
                                ${raState.roleGroups.map(group => `<option value="${group.id}" ${role.roleGroupId === group.id ? 'selected' : ''}>${group.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Job Level <span class="text-red-500">*</span></label>
                            <select id="raJobLevel" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue">
                                <option value="">-- Select Job Level --</option>
                                ${raState.jobLevels.map(level => `<option value="${level}" ${role.jobLevel === level ? 'selected' : ''}>${level}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Department (Sub-unit/Specialization)</label>
                            <input type="text" id="raRoleDepartment" value="${role.department}" placeholder="e.g., B777 Fleet, Avionics Maintenance" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue"/>
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Legacy Job Family (Optional)</label>
                            <input type="text" id="raRoleJobFamily" value="${role.jobFamily || ''}" placeholder="e.g., Pilot, Technician (for reference)" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue"/>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Role Description</label>
                            <textarea id="raRoleDescription" rows="3" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue" placeholder="Briefly describe this role...">${role.description || ''}</textarea>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end">
                        ${renderButton({ onClickId: 'raNextStep2', children: "Next: Assign Skills", iconSvg: IconArrowRight(18), disabled: !role.title.trim() || !role.roleGroupId || !role.jobLevel })}
                    </div>
                `, {iconSvg: IconEdit3(20)})}
            ` : ''}

            ${raState.step === 2 ? `
                ${renderCard("Assign Skills & Proficiency", `
                    <div class="p-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Search & Add Skill</label>
                        <div class="flex gap-2 mb-3">
                            <input type="text" id="raSkillSearchInput" value="${raState.skillSearch}" placeholder="Type to search skills..." class="flex-grow p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue"/>
                        </div>
                        ${raState.skillSearch && filteredSkillsCatalog.length > 0 ? `
                            <div class="mb-3 border rounded-md bg-white shadow-sm max-h-40 overflow-y-auto custom-scrollbar">
                                ${filteredSkillsCatalog.map(skillName => `
                                    <div data-skill-name="${skillName}" class="ra-add-skill-item p-2 hover:bg-blue-50 cursor-pointer text-sm">
                                        ${skillName} <span class="text-xs text-gray-400">- ${MOCK_SKILLS_CATALOG[skillName]?.description.substring(0,30)}...</span>
                                    </div>`).join('')}
                            </div>` : ''}
                        ${raState.skillSearch && filteredSkillsCatalog.length === 0 ? `<p class="text-xs text-gray-500 mb-3">No skills found matching "${raState.skillSearch}". Try airline specific skills.</p>` : ''}
                    </div>
                    <div class="p-4 border-t max-h-96 overflow-y-auto custom-scrollbar">
                        ${(role.skills && role.skills.length > 0) ? role.skills.map((skillDetail, index) => `
                            <div class="relative group">
                                ${renderProficiencySlider({
                                    skill: skillDetail.name,
                                    currentProficiency: skillDetail.current,
                                    targetProficiency: skillDetail.target,
                                    maxProficiency: skillDetail.maxProficiency || MOCK_SKILLS_CATALOG[skillDetail.name]?.proficiencyLevels || 5,
                                    onChangeCurrentId: `raEditSkillCurrent-${index}`,
                                    onChangeTargetId: `raEditSkillTarget-${index}`,
                                    skillIdentifier: skillDetail.name
                                })}
                                <button data-skill-name-remove="${skillDetail.name}" class="ra-remove-skill-btn absolute top-2 right-0 p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${IconXCircle(16)}
                                </button>
                            </div>`).join('') : `<p class="text-sm text-gray-500 text-center py-4">No skills assigned yet. Use the search above to add skills.</p>`}
                    </div>
                    <div class="mt-4 p-4 border-t flex justify-between">
                        ${renderButton({ onClickId: 'raPrevStep1', children: "Previous", variant: "primary", iconSvg: IconArrowLeft(18)})}
                        ${renderButton({ onClickId: 'raNextStep3', children: "Next: Calibrate", iconSvg: IconArrowRight(18)})}
                    </div>
                `, {iconSvg: IconSlidersHorizontal(20), noPadding: true })}
            ` : ''}

             ${raState.step === 3 ? `
                ${renderCard("Calibrate & Approve", `
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-semibold mb-2 text-gray-700">Calibration Completeness</h4>
                            ${renderGauge({ value: role.calibrationCompleteness || 0, label: "Completeness Score", color: (role.calibrationCompleteness || 0) > 80 ? "green" : (role.calibrationCompleteness || 0) > 50 ? "sky" : "yellow" })}
                            ${renderButton({ onClickId: 'raIncreaseCalibration', children: "Increase Calibration (Simulate)", variant: "primary", size: "sm", className: "mt-2"})}

                            <h4 class="font-semibold mb-2 mt-4 text-gray-700">Future Readiness (Est.)</h4>
                            ${renderGauge({ value: role.futureReadiness || 0, label: "Readiness Score", color: (role.futureReadiness || 0) > 75 ? "green" : (role.futureReadiness || 0) > 50 ? "sky" : "yellow" })}
                            ${renderButton({ onClickId: 'raIncreaseReadiness', children: "Increase Readiness (Simulate)", variant: "primary", size: "sm", className: "mt-2"})}
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2 text-gray-700">Calibration Assistant (Mock for Airline)</h4>
                            <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 space-y-1">
                                <p class="flex items-start">${IconAlertTriangle(18, "inline mr-1.5 flex-shrink-0 mt-0.5")} Consider adding 'Sustainable Aviation Fuels (SAF)' skill for future-proofing pilot roles.</p>
                                <p class="flex items-start">${IconCheckCircle(18, "inline mr-1.5 flex-shrink-0 mt-0.5 text-green-600")} Proficiency for 'FAA Regulations' aligns with industry standards.</p>
                                <p class="flex items-start">${IconThumbsDown(18, "inline mr-1.5 flex-shrink-0 mt-0.5 text-red-600")} 'Crew Resource Management' target proficiency is below recommended for Captain roles.</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-between">
                        ${renderButton({ onClickId: 'raPrevStep2', children: "Previous", variant: "primary", iconSvg: IconArrowLeft(18)})}
                        ${renderButton({ onClickId: 'raSaveRole', children: "Save & Approve Role", variant: "primary", iconSvg: IconCheckCircle(18)})}
                    </div>
                `, {iconSvg: IconThumbsUp(20)})}
            ` : ''}
        </div>`;
    }

    // Main Role Architecture View (Table / Sub-tabs)
    const subNavItems = [
        { id: 'roles', label: 'Manage Roles', icon: IconClipboardList(18) },
        { id: 'groups', label: 'Role Groups', icon: IconLayers(18) },
        { id: 'levels', label: 'Job Levels', icon: IconBarChart3(18) },
        { id: 'paths', label: 'Career Paths', icon: IconTrendingUp(18) }
    ];

    let currentViewHtml = '';
    if (raState.activeSubTab === 'roles') {
        currentViewHtml = `
            ${renderCard("Company Roles Directory", `
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 text-sm">
                        <thead class="bg-gray-50">
                            <tr>
                                ${["Role Title", "Role Group", "Job Level", "Dept.", "Calib. %", "Future Read.", "Ver.", "Status", "Actions"].map(header => `
                                    <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${raState.roles.map(role => {
                                const roleGroup = raState.roleGroups.find(rg => rg.id === role.roleGroupId);
                                return `
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-3 py-3 whitespace-nowrap font-medium text-gray-900">${role.title}</td>
                                    <td class="px-3 py-3 whitespace-nowrap text-gray-500">${roleGroup ? roleGroup.name : 'N/A'}</td>
                                    <td class="px-3 py-3 whitespace-nowrap text-gray-500">${role.jobLevel || 'N/A'}</td>
                                    <td class="px-3 py-3 whitespace-nowrap text-gray-500">${role.department}</td>
                                    <td class="px-3 py-3 whitespace-nowrap text-gray-500 w-28">${renderGauge({value: role.calibrationCompleteness, size: "sm", color: role.calibrationCompleteness > 80 ? "green" : role.calibrationCompleteness > 50 ? "sky" : "yellow"})}</td>
                                    <td class="px-3 py-3 whitespace-nowrap text-gray-500 w-28">${renderGauge({value: role.futureReadiness, size: "sm", color: role.futureReadiness > 75 ? "green" : role.futureReadiness > 50 ? "sky" : "yellow"})}</td>
                                    <td class="px-3 py-3 whitespace-nowrap text-gray-500">${renderPill({children: role.version, color: "gray", className: "text-xs"})}</td>
                                    <td class="px-3 py-3 whitespace-nowrap">${renderPill({children: role.status, color: role.status === "Active" ? "green" : role.status === "Draft" ? "yellow" : "red", className: "text-xs"})}</td>
                                    <td class="px-3 py-3 whitespace-nowrap">
                                        ${renderButton({ onClickId: `raEditRole-${role.id}`, children: "Edit", variant: "primary", size: "sm", iconSvg: IconEdit3(14), dataset: {'role-id': role.id} })}
                                    </td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                ${raState.roles.length === 0 ? `<p class="text-center text-gray-500 py-8">No roles defined yet. Click "Create New Role" to start.</p>` : ''}
            `, {iconSvg: IconClipboardList(20), headerActionsHtml: renderButton({ onClickId: 'raFilterRoles', children: "Filters", variant: "primary", size: "sm", iconSvg: IconFilter(14)}), noPadding: true })}
        `;
    } else if (raState.activeSubTab === 'groups') {
        currentViewHtml = renderRoleGroupsManagement();
    } else if (raState.activeSubTab === 'levels') {
        currentViewHtml = renderJobLevelsManagement();
    } else if (raState.activeSubTab === 'paths') {
        currentViewHtml = renderCareerPathsManagement();
    }


    return `
        <div class="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 animate-fadeIn">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
                <h2 class="text-xl sm:text-2xl font-bold text-delta-blue flex items-center">${IconLayers(24, "mr-2 sm:mr-3 text-delta-blue")}Enterprise Role Architecture</h2>
                ${raState.activeSubTab === 'roles' ? renderButton({ onClickId: 'raCreateNewRole', children: "Create New Role", iconSvg: IconPlusCircle(18), size: "md"}) : ''}
                ${raState.activeSubTab === 'groups' && !raState.editingRoleGroup ? renderButton({ onClickId: 'raCreateNewRoleGroup', children: "Create Role Group", iconSvg: IconPlusCircle(18), size: "md"}) : ''}
                ${raState.activeSubTab === 'paths' && !raState.editingCareerPath ? renderButton({ onClickId: 'raCreateNewCareerPath', children: "Define New Path", iconSvg: IconPlusCircle(18), size: "md"}) : ''}
            </div>

            <div class="bg-white rounded-md shadow-sm p-2 mb-4">
                <nav class="flex flex-wrap justify-center gap-1">
                    ${subNavItems.map(item => `
                        <button data-subtab-id="${item.id}" class="ra-subnav-button flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap
                            ${raState.activeSubTab === item.id ? 'bg-delta-sky-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-delta-blue'}">
                            <span class="mr-1 sm:mr-1.5 h-4 w-4">${item.icon}</span>
                            ${item.label}
                        </button>`).join('')}
                </nav>
            </div>
            ${currentViewHtml}
        </div>`;
}

function renderRoleGroupsManagement() {
    const raState = appState.roleArchitecture;

    if (raState.editingRoleGroup) {
        const group = raState.editingRoleGroup;
        const isNew = group.id.startsWith("new_rg_");
        const formHtml = `
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Group Name <span class="text-red-500">*</span></label>
                <input type="text" id="raRoleGroupName" value="${group.name}" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue" placeholder="e.g., Engineering"/>
            </div>
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="raRoleGroupDescription" rows="3" class="w-full p-2 border rounded-md focus:ring-delta-blue focus:border-delta-blue" placeholder="Briefly describe this role group...">${group.description || ''}</textarea>
            </div>
            <div class="mt-6 flex justify-end space-x-2">
                ${renderButton({ onClickId: 'raCancelEditRoleGroup', children: "Cancel", variant: "ghost", size: "sm"})}
                ${renderButton({ onClickId: 'raSaveRoleGroup', children: isNew ? "Create Group" : "Save Changes", iconSvg: IconCheckCircle(18), size: "sm"})}
            </div>
        `;
        return renderCard(isNew ? "Create New Role Group" : `Edit Role Group: ${group.name}`, formHtml, { iconSvg: IconLayers(20) });
    }

    return renderCard("Manage Role Groups (Job Families)", `
        <div class="space-y-3">
        ${raState.roleGroups.map(group => `
            <div class="p-3 border rounded-md bg-gray-50 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-center">
                    <div>
                        <h4 class="font-semibold text-delta-blue">${group.name}</h4>
                        <p class="text-xs text-gray-500">ID: ${group.id}</p>
                    </div>
                    ${renderButton({onClickId: `raEditRoleGroup-${group.id}`, children: "Edit", variant: "primary", size:"sm", iconSvg: IconEdit3(14), dataset: {'group-id': group.id}})}
                </div>
                <p class="text-sm text-gray-600 mt-1">${group.description}</p>
                <p class="text-xs text-gray-500 mt-1">Roles in this group: ${raState.roles.filter(r => r.roleGroupId === group.id).length}</p>
            </div>
        `).join('')}
        ${raState.roleGroups.length === 0 ? `<p class="text-center text-gray-500 py-6">No role groups defined. Click "Create Role Group" above to start.</p>` : ''}
        </div>
    `, {iconSvg: IconLayers(20)});
}

function renderJobLevelsManagement() {
    // For now, just list them. Later, allow defining criteria for each.
    return renderCard("Manage Job Levels", `
        <p class="text-sm text-gray-600 mb-3">These are the standard job levels used across the organization. Future enhancements will allow defining specific criteria and competencies for each level within a Role Group.</p>
        <div class="flex flex-wrap gap-2">
            ${appState.roleArchitecture.jobLevels.map(level => renderPill({children: level, color: "sky"})).join('')}
        </div>
         <div class="mt-4">
            ${renderButton({onClickId: 'raConfigureJobLevels', children: "Configure Levels (Coming Soon)", iconSvg: IconSettings(18), variant: "primary", disabled: true})}
        </div>
    `, {iconSvg: IconBarChart3(20)});
}

function renderCareerPathsManagement() {
    const raState = appState.roleArchitecture;
    // Simplified view
    return renderCard("Manage Career Paths", `
        <div class="space-y-3">
        ${raState.careerPaths.map(path => {
            const fromRole = raState.roles.find(r => r.id === path.fromRoleId);
            const toRole = raState.roles.find(r => r.id === path.toRoleId);
            return `
            <div class="p-3 border rounded-md bg-indigo-50 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-center">
                    <h4 class="font-semibold text-indigo-700">Path: ${fromRole ? fromRole.title : 'N/A'} ${IconArrowRight(16, "inline mx-1")} ${toRole ? toRole.title : 'N/A'}</h4>
                     ${renderButton({onClickId: `raEditCareerPath-${path.id}`, children: "Edit", variant: "primary", size:"sm", iconSvg: IconEdit3(14), dataset: {'path-id': path.id}})}
                </div>
                <p class="text-sm text-gray-600 mt-1">Type: ${path.type} - ${path.description}</p>
                ${path.bridgeSkills && path.bridgeSkills.length > 0 ? `<p class="text-xs text-gray-500 mt-1">Bridge Skills: ${path.bridgeSkills.join(', ')}</p>` : ''}
            </div>
        `}).join('')}
        ${raState.careerPaths.length === 0 ? `<p class="text-center text-gray-500 py-6">No career paths defined. Click "Define New Path" to start.</p>` : ''}
        </div>
    `, {iconSvg: IconTrendingUp(20)});
}


// --- SkillsPlanning Section ---
function renderSkillsPlanning() {
    const spState = appState.skillsPlanning;
    return `
    <div class="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 animate-fadeIn">
        <h2 class="text-xl sm:text-2xl font-bold text-delta-blue mb-2 sm:mb-4 flex items-center">${IconBarChart3(24, "mr-2 sm:mr-3 text-green-600")}Skills-Based Talent Planning</h2>

        ${renderCard("Transform Workforce Planning (Airline Focus)", `
            <p class="text-sm text-gray-600 mb-3">Utilize insights to define future fleet and workforce needs, aligning talent with evolving aviation technology and regulations.</p>
            <div class="bg-green-50 p-3 sm:p-4 rounded-md border border-green-100">
                <h4 class="font-semibold text-green-700 mb-1">Key Strategic Insights (Airline Example):</h4>
                <ul class="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                    <li>Projected 15% increase in demand for pilots certified on new aircraft types (e.g., A321XLR, B777X) by 2028.</li>
                    <li>Critical need for upskilling maintenance crews in composite material repair and advanced avionics.</li>
                    <li>Emerging roles: SAF Logistics Coordinator, Drone Operations Manager (Cargo), AI Ethics Officer (Flight Data).</li>
                    <li>Identified skill gap: Data analytics skills for Flight Operations Managers to optimize fuel consumption.</li>
                </ul>
            </div>
        `, {iconSvg: IconTrendingUp(20)})}

        ${renderCard("Scenario Planning & Transformation", `
            <p class="text-sm text-gray-600 mb-4">Build transformation plans for flight crews, maintenance teams, or the entire airline based on skills data and fleet changes.</p>
            <div class="grid md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div class="md:col-span-1">
                    <label for="spTeamPlanInput" class="block text-xs font-medium text-gray-700 mb-1">Team/Department:</label>
                    <input type="text" id="spTeamPlanInput" value="${spState.teamForPlan}" class="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-delta-blue focus:border-delta-blue" placeholder="e.g., A350 Flight Crew"/>
                </div>
                <div class="md:col-span-1">
                    <label for="spFocusPlanInput" class="block text-xs font-medium text-gray-700 mb-1">Planning Focus:</label>
                    <input type="text" id="spFocusPlanInput" value="${spState.planningFocus}" class="w-full p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-delta-blue focus:border-delta-blue" placeholder="e.g., SAF Implementation"/>
                </div>
                <div class="md:col-span-1 self-end">
                    ${renderButton({ onClickId: 'spGeneratePlan', children: "Generate Transformation Plan", iconSvg: IconLightbulb(18), className: "w-full"})}
                </div>
            </div>
            ${spState.planGenerated ? `
                <div class="mt-4 p-3 sm:p-4 bg-indigo-50 rounded-md border border-indigo-100 animate-fadeIn">
                    <h4 class="text-md sm:text-lg font-semibold text-indigo-700">Transformation Plan for ${spState.teamForPlan} - Focus: ${spState.planningFocus}</h4>
                    <ul class="list-disc list-inside text-xs sm:text-sm text-gray-600 mt-2 space-y-1.5">
                        <li><strong>Objective:</strong> Successfully transition ${spState.teamForPlan} to ${spState.planningFocus} capabilities and address associated skill gaps.</li>
                        <li><strong>Action 1:</strong> Type-rating training for 50 pilots on new aircraft (Timeline: Q3-Q4). Target proficiency: Full Certification.</li>
                        <li><strong>Action 2:</strong> Hire 10 Avionics Technicians with expertise in Gen-5 systems (Timeline: Next 6 months).</li>
                        <li><strong>Action 3:</strong> Implement simulator training for advanced Crew Resource Management for all flight crew (Ongoing).</li>
                        <li><strong>Action 4:</strong> Invest in SAF handling and logistics training for 20 ground staff (Budget: $15k).</li>
                        <li><strong>Metrics:</strong> Track training completion (Target: 95%), number of certifications (Target: 100% for pilots), incident reduction post-CRM training, SAF adoption rate.</li>
                    </ul>
                </div>` : ''}
        `, {iconSvg: IconSettings(20)})}
    </div>`;
}

// --- Event Handlers & Logic ---
function setActiveTab(tabId, params = {}) {
    appState.activeTab = tabId;
    if (tabId === 'roleArchitecture') {
        appState.roleArchitecture.activeSubTab = params.subTab || 'roles'; // Default to 'roles' if no subTab specified
        if (params.action === 'create' && appState.roleArchitecture.activeSubTab === 'roles') {
            handleRACreateNewRole();
        }
        // Add similar logic for creating new role groups or career paths if needed
    }
    renderApp();
}

// Expose setActiveTab to the global scope for app.js
window.setActiveTabFromSkillsIntelligenceModule = setActiveTab;

function setGlobalNotification(notif) {
    appState.globalNotification = {...notif, key: Date.now()};
    renderApp();
    if (appState.globalNotification.message) {
        setTimeout(() => {
            appState.globalNotification.message = "";
            renderApp();
        }, 5000);
    }
}

function titleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function handleAddNewSkillToRoleAndCatalog() {
    const tiState = appState.talentIntelligence;
    const newSkillInput = document.getElementById('tiAddNewSkillInput');
    if (!newSkillInput) return;

    const rawSkillName = newSkillInput.value.trim();
    if (!rawSkillName) {
        setGlobalNotification({ message: "Please enter a skill name.", type: "warning" });
        return;
    }
    const newSkillName = titleCase(rawSkillName);

    if (!MOCK_SKILLS_CATALOG.hasOwnProperty(newSkillName)) {
        MOCK_SKILLS_CATALOG[newSkillName] = { trend: "emerging", proficiencyLevels: 5, adjacent: [], description: "Newly added skill." };
    }
    const skillMaxProficiency = MOCK_SKILLS_CATALOG[newSkillName].proficiencyLevels || 5;

    if (tiState.selectedRole) {
        if (!Array.isArray(tiState.selectedRole.skills)) tiState.selectedRole.skills = [];
        const skillExistsInCurrentRole = tiState.selectedRole.skills.some(s => (typeof s === 'string' ? s : s.name) === newSkillName);
        if (!skillExistsInCurrentRole) tiState.selectedRole.skills.push({ name: newSkillName, current: 1, target: 3, maxProficiency });
    }

    for (const industry in MOCK_ROLES_BY_INDUSTRY) {
        MOCK_ROLES_BY_INDUSTRY[industry].forEach(role => {
            if (!Array.isArray(role.skills)) role.skills = [];
            const skillExists = role.skills.some(s => (typeof s === 'string' ? s : s.name) === newSkillName);
            if (!skillExists) role.skills.push({ name: newSkillName, current: 1, target: 3, maxProficiency });
        });
    }

    appState.roleArchitecture.roles.forEach(role => {
        if (!Array.isArray(role.skills)) role.skills = [];
        const skillExists = role.skills.some(s => s.name === newSkillName);
        if (!skillExists) role.skills.push({ name: newSkillName, current: 1, target: 3, maxProficiency });
    });

    newSkillInput.value = '';
    setGlobalNotification({ message: `Skill "${newSkillName}" added to catalog and all roles.`, type: "success" });
    renderApp();
}

function addTalentIntelligenceListeners() {
    const tiState = appState.talentIntelligence;
    const industrySelect = document.getElementById('tiIndustrySelect');
    if (industrySelect) {
        industrySelect.addEventListener('change', (e) => {
            tiState.selectedIndustry = e.target.value;
            tiState.selectedRole = null;
            if (e.target.value) setGlobalNotification({message: `Insights for ${e.target.value} loaded.`, type: "info"});
            renderApp();
        });
    }
    const searchInput = document.getElementById('tiSearchTermInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => { tiState.searchTerm = e.target.value; });
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleTISearch(); });
    }
    const searchButton = document.getElementById('tiSearchButton');
    if (searchButton) searchButton.addEventListener('click', handleTISearch);

    document.querySelectorAll('.ti-role-item').forEach(item => {
        item.addEventListener('click', () => {
            const roleId = item.dataset.roleId;
            const industryRoles = MOCK_ROLES_BY_INDUSTRY[tiState.selectedIndustry] || [];
            const foundRole = industryRoles.find(r => r.id === roleId);
            if (foundRole) {
                tiState.selectedRole = JSON.parse(JSON.stringify(foundRole));
                setGlobalNotification({ message: `Displaying details for role: ${foundRole.name}.`, type: "info" });
                renderApp();
            }
        });
    });

    const backButton = document.getElementById('tiBackToIndustry');
    if (backButton) backButton.addEventListener('click', () => { tiState.selectedRole = null; renderApp(); });

    const addRecommendedSkillsButton = document.getElementById('tiAddRecommendedSkills');
    if (addRecommendedSkillsButton) addRecommendedSkillsButton.addEventListener('click', () => setGlobalNotification({ message: "Recommended skills added (simulation).", type: "success" }));

    const createRoleManuallyButton = document.getElementById('tiCreateRoleManually');
    if(createRoleManuallyButton) createRoleManuallyButton.addEventListener('click', () => {
        setGlobalNotification({ message: "Navigating to Role Architecture to create a new role.", type: "info" });
        setActiveTab('roleArchitecture', { action: 'create', subTab: 'roles' });
    });

    const uploadDataButton = document.getElementById('tiUploadCompanyData');
    if(uploadDataButton) uploadDataButton.addEventListener('click', () => setGlobalNotification({ message: "File upload dialog simulation: Please select your roles and skills data (CSV/Excel).", type: "info" }));

    const addNewSkillButton = document.getElementById('tiHandleAddNewSkill');
    if (addNewSkillButton) addNewSkillButton.addEventListener('click', handleAddNewSkillToRoleAndCatalog);

    if (tiState.selectedRole) {
         const roleSkills = (Array.isArray(tiState.selectedRole.skills) ? tiState.selectedRole.skills : []).map(s => typeof s === 'string' ? {name: s, current: 3, target: 4, maxProficiency: MOCK_SKILLS_CATALOG[s]?.proficiencyLevels || 5} : {...s, maxProficiency: MOCK_SKILLS_CATALOG[s.name]?.proficiencyLevels || 5});
        roleSkills.forEach((skillDetail, index) => {
            const currentSlider = document.getElementById(`tiRoleSkillCurrent-${index}`);
            const targetSlider = document.getElementById(`tiRoleSkillTarget-${index}`);
            const updateSkillProficiency = (e, type) => {
                const skillName = e.target.dataset.skill;
                const newValue = parseInt(e.target.value);
                const currentRoleSkills = appState.talentIntelligence.selectedRole.skills;
                const skillIndexInRole = currentRoleSkills.findIndex(s => (s.name || s) === skillName);

                if (skillIndexInRole !== -1) {
                    if (typeof currentRoleSkills[skillIndexInRole] === 'string') {
                        currentRoleSkills[skillIndexInRole] = { name: skillName, current: type === 'current' ? newValue : 3, target: type === 'target' ? newValue : 4, maxProficiency: MOCK_SKILLS_CATALOG[skillName]?.proficiencyLevels || 5 };
                    } else {
                        currentRoleSkills[skillIndexInRole][type] = newValue;
                    }
                }
                renderApp();
            };
            if (currentSlider) currentSlider.addEventListener('input', (e) => updateSkillProficiency(e, 'current'));
            if (targetSlider) targetSlider.addEventListener('input', (e) => updateSkillProficiency(e, 'target'));
        });
    }
}

function handleTISearch() {
    const tiState = appState.talentIntelligence;
    if (!tiState.searchTerm.trim()) {
        setGlobalNotification({ message: "Please enter a search term.", type: "warning" });
        return;
    }
    const term = tiState.searchTerm.toLowerCase();
    const industryMatch = MOCK_INDUSTRIES.find(ind => ind.toLowerCase().includes(term));
    if (industryMatch) {
        tiState.selectedIndustry = industryMatch;
        tiState.selectedRole = null;
        setGlobalNotification({ message: `Displaying insights for ${industryMatch} industry.`, type: "info" });
        renderApp(); return;
    }
    for (const industry of MOCK_INDUSTRIES) {
        const roleMatch = MOCK_ROLES_BY_INDUSTRY[industry]?.find(r => r.name.toLowerCase().includes(term));
        if (roleMatch) {
            tiState.selectedIndustry = industry;
            tiState.selectedRole = JSON.parse(JSON.stringify(roleMatch));
            setGlobalNotification({ message: `Displaying details for role: ${roleMatch.name}.`, type: "info" });
            renderApp(); return;
        }
    }
    setGlobalNotification({ message: `No matching industry or role found for: "${tiState.searchTerm}". Try "Airline" or "Pilot".`, type: "error" });
}

function addRoleArchitectureListeners() {
    const raState = appState.roleArchitecture;

    document.querySelectorAll('.ra-subnav-button').forEach(button => {
        button.addEventListener('click', (e) => {
            raState.activeSubTab = e.currentTarget.dataset.subtabId;
            raState.editingRole = null; // Clear editing state when changing sub-tabs
            raState.editingRoleGroup = null;
            raState.editingCareerPath = null;
            renderApp();
        });
    });
    
    const createNewButton = document.getElementById('raCreateNewRole');
    if (createNewButton) createNewButton.addEventListener('click', handleRACreateNewRole);

    const createNewRoleGroupButton = document.getElementById('raCreateNewRoleGroup');
    if (createNewRoleGroupButton) createNewRoleGroupButton.addEventListener('click', handleRACreateNewRoleGroup);

    document.querySelectorAll('[id^="raEditRoleGroup-"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const groupId = e.currentTarget.dataset.groupId;
            const groupToEdit = raState.roleGroups.find(g => g.id === groupId);
            if (groupToEdit) {
                raState.editingRoleGroup = JSON.parse(JSON.stringify(groupToEdit));
                renderApp();
            }
        });
    });
    
    if (raState.editingRoleGroup) {
        const groupNameInput = document.getElementById('raRoleGroupName');
        if (groupNameInput) groupNameInput.addEventListener('input', e => raState.editingRoleGroup.name = e.target.value);
        const groupDescInput = document.getElementById('raRoleGroupDescription');
        if (groupDescInput) groupDescInput.addEventListener('input', e => raState.editingRoleGroup.description = e.target.value);

        const saveButtonGroup = document.getElementById('raSaveRoleGroup');
        if (saveButtonGroup) saveButtonGroup.addEventListener('click', handleRASaveRoleGroup);
        const cancelEditButtonGroup = document.getElementById('raCancelEditRoleGroup');
        if (cancelEditButtonGroup) cancelEditButtonGroup.addEventListener('click', () => {
            raState.editingRoleGroup = null;
            renderApp();
        });
    }

    const createNewCareerPathButton = document.getElementById('raCreateNewCareerPath');
    if (createNewCareerPathButton) createNewCareerPathButton.addEventListener('click', () => {
        setGlobalNotification({message: "Define New Career Path form would appear here.", type: "info"});
    });


    document.querySelectorAll('[id^="raEditRole-"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const roleId = e.currentTarget.dataset.roleId;
            const roleToEdit = raState.roles.find(r => r.id === roleId);
            if (roleToEdit) {
                raState.editingRole = JSON.parse(JSON.stringify(roleToEdit)); 
                raState.step = 1;
                renderApp();
            }
        });
    });

    if (raState.editingRole) {
        // Step 1
        const roleTitleInput = document.getElementById('raRoleTitle');
        if (roleTitleInput) roleTitleInput.addEventListener('input', (e) => raState.editingRole.title = e.target.value);
        const roleVersionInput = document.getElementById('raRoleVersion');
        if (roleVersionInput) roleVersionInput.addEventListener('input', (e) => raState.editingRole.version = e.target.value);
        
        const roleGroupIdSelect = document.getElementById('raRoleGroupId');
        if (roleGroupIdSelect) roleGroupIdSelect.addEventListener('change', (e) => raState.editingRole.roleGroupId = e.target.value);
        
        const jobLevelSelect = document.getElementById('raJobLevel');
        if (jobLevelSelect) jobLevelSelect.addEventListener('change', (e) => raState.editingRole.jobLevel = e.target.value);

        const roleJobFamilyInput = document.getElementById('raRoleJobFamily'); 
        if (roleJobFamilyInput) roleJobFamilyInput.addEventListener('input', (e) => raState.editingRole.jobFamily = e.target.value);
        
        const roleDepartmentInput = document.getElementById('raRoleDepartment');
        if (roleDepartmentInput) roleDepartmentInput.addEventListener('input', (e) => raState.editingRole.department = e.target.value);
        const roleDescriptionInput = document.getElementById('raRoleDescription');
        if (roleDescriptionInput) roleDescriptionInput.addEventListener('input', (e) => raState.editingRole.description = e.target.value);

        const nextStep2Button = document.getElementById('raNextStep2');
        if (nextStep2Button) nextStep2Button.addEventListener('click', () => {
            if (!raState.editingRole.title.trim() || !raState.editingRole.roleGroupId || !raState.editingRole.jobLevel){
                setGlobalNotification({ message: "Role Title, Role Group, and Job Level are required.", type: "error"});
                return;
            }
            if (!raState.editingRole.jobFamily && raState.editingRole.roleGroupId) {
                const group = raState.roleGroups.find(g => g.id === raState.editingRole.roleGroupId);
                if (group) raState.editingRole.jobFamily = group.name;
            }
            raState.step = 2; renderApp();
        });

        // Step 2
        const skillSearchInput = document.getElementById('raSkillSearchInput');
        if (skillSearchInput) skillSearchInput.addEventListener('input', (e) => { raState.skillSearch = e.target.value; renderApp(); });

        document.querySelectorAll('.ra-add-skill-item').forEach(item => {
            item.addEventListener('click', (e) => handleRAAddSkillToRole(e.currentTarget.dataset.skillName));
        });
        document.querySelectorAll('.ra-remove-skill-btn').forEach(button => {
            button.addEventListener('click', (e) => handleRARemoveSkillFromRole(e.currentTarget.dataset.skillNameRemove));
        });
         (raState.editingRole.skills || []).forEach((skillDetail, index) => {
            const currentSlider = document.getElementById(`raEditSkillCurrent-${index}`);
            const targetSlider = document.getElementById(`raEditSkillTarget-${index}`);
            const updateRASkillProficiency = (e, type) => {
                const skillName = e.target.dataset.skill;
                const newValue = parseInt(e.target.value);
                const skillToUpdate = raState.editingRole.skills.find(s => s.name === skillName);
                if (skillToUpdate) skillToUpdate[type] = newValue;
                renderApp();
            };
            if (currentSlider) currentSlider.addEventListener('input', (e) => updateRASkillProficiency(e, 'current'));
            if (targetSlider) targetSlider.addEventListener('input', (e) => updateRASkillProficiency(e, 'target'));
        });

        const prevStep1Button = document.getElementById('raPrevStep1');
        if (prevStep1Button) prevStep1Button.addEventListener('click', () => { raState.step = 1; renderApp(); });
        const nextStep3Button = document.getElementById('raNextStep3');
        if (nextStep3Button) nextStep3Button.addEventListener('click', () => { raState.step = 3; renderApp(); });

        // Step 3
        const increaseCalibrationButton = document.getElementById('raIncreaseCalibration');
        if(increaseCalibrationButton) increaseCalibrationButton.addEventListener('click', () => {
            raState.editingRole.calibrationCompleteness = Math.min(100, (raState.editingRole.calibrationCompleteness || 0) + 10);
            renderApp();
        });
        const increaseReadinessButton = document.getElementById('raIncreaseReadiness');
         if(increaseReadinessButton) increaseReadinessButton.addEventListener('click', () => {
            raState.editingRole.futureReadiness = Math.min(100, (raState.editingRole.futureReadiness || 0) + 10);
            renderApp();
        });

        const prevStep2Button = document.getElementById('raPrevStep2');
        if (prevStep2Button) prevStep2Button.addEventListener('click', () => { raState.step = 2; renderApp(); });
        const saveRoleButton = document.getElementById('raSaveRole');
        if (saveRoleButton) saveRoleButton.addEventListener('click', handleRASaveRole);

        const cancelEditButton = document.getElementById('raCancelEdit');
        if (cancelEditButton) cancelEditButton.addEventListener('click', () => { raState.editingRole = null; renderApp(); });
    }
}

function handleRACreateNewRole() {
    appState.roleArchitecture.editingRole = {
        id: `new_${Date.now()}`, title: "", version: "1.0", roleGroupId: "", jobLevel: "", jobFamily: "", department: "",
        skills: [], calibrationCompleteness: 0, futureReadiness: 0, status: "Draft", description: ""
    };
    appState.roleArchitecture.step = 1;
    appState.roleArchitecture.activeSubTab = 'roles'; 
    renderApp();
}

function handleRACreateNewRoleGroup() {
    appState.roleArchitecture.editingRoleGroup = {
        id: `new_rg_${Date.now()}`, name: "", description: ""
    };
    appState.roleArchitecture.activeSubTab = 'groups'; 
    renderApp();
}

function handleRASaveRoleGroup() {
    const raState = appState.roleArchitecture;
    const group = raState.editingRoleGroup;
    if (!group || !group.name.trim()) {
        setGlobalNotification({ message: "Role Group name is required.", type: "error" });
        return;
    }
    if (group.id.startsWith("new_rg_")) { 
        const newGroupIdBase = `rg_${group.name.toLowerCase().replace(/\s+/g, '_')}`;
        let newGroupId = newGroupIdBase;
        let counter = 1;
        while (raState.roleGroups.find(g => g.id === newGroupId)) {
            newGroupId = `${newGroupIdBase}_${counter++}`;
        }
        const newGroup = { ...group, id: newGroupId};
        raState.roleGroups.push(newGroup);
        setGlobalNotification({ message: `Role Group "${newGroup.name}" created.`, type: "success" });
    } else { 
        raState.roleGroups = raState.roleGroups.map(g => g.id === group.id ? { ...group } : g);
        setGlobalNotification({ message: `Role Group "${group.name}" updated.`, type: "success" });
    }
    raState.editingRoleGroup = null;
    renderApp();
}

function handleRAAddSkillToRole(skillName) {
    const raState = appState.roleArchitecture;
    if(!skillName || !raState.editingRole) return;
    if (!Array.isArray(raState.editingRole.skills)) raState.editingRole.skills = [];
    if (raState.editingRole.skills.find(s => s.name === skillName)) {
        setGlobalNotification({ message: `Skill "${skillName}" is already added.`, type: "warning"});
        return;
    }
    raState.editingRole.skills.push({
        name: skillName, current: 1, target: 3,
        maxProficiency: MOCK_SKILLS_CATALOG[skillName]?.proficiencyLevels || 5
    });
    raState.skillSearch = '';
    renderApp();
}
function handleRARemoveSkillFromRole(skillName) {
    const raState = appState.roleArchitecture;
    if (!raState.editingRole || !raState.editingRole.skills) return;
    raState.editingRole.skills = raState.editingRole.skills.filter(s => s.name !== skillName);
    renderApp();
}
function handleRASaveRole() {
    const raState = appState.roleArchitecture;
    if (!raState.editingRole.title.trim() || !raState.editingRole.roleGroupId || !raState.editingRole.jobLevel){
        setGlobalNotification({ message: "Role Title, Role Group, and Job Level are required.", type: "error"});
        raState.step = 1; 
        renderApp();
        return;
    }
    if (!raState.editingRole.jobFamily && raState.editingRole.roleGroupId) {
        const group = raState.roleGroups.find(g => g.id === raState.editingRole.roleGroupId);
        if (group) raState.editingRole.jobFamily = group.name;
    }

    // Ensure feederRoles and nextRoles are saved
    const roleToSave = {
        ...raState.editingRole,
        lastUpdated: new Date().toISOString().split('T')[0],
        feederRoles: raState.editingRole.feederRoles || [],
        nextRoles: raState.editingRole.nextRoles || []
    };

    if (roleToSave.id.startsWith("new_")) {
        const newRole = {...roleToSave, id: `crole_al_${raState.roles.length + 100}`};
        raState.roles.push(newRole);
        setGlobalNotification({ message: `Role "${newRole.title}" created successfully!`, type: "success"});
    } else {
        raState.roles = raState.roles.map(r => r.id === roleToSave.id ? roleToSave : r);
        setGlobalNotification({ message: `Role "${raState.editingRole.title}" updated successfully!`, type: "success"});
    }
    raState.editingRole = null;
    raState.activeSubTab = 'roles'; 
    renderApp();
}

function addSkillsPlanningListeners() {
    const spState = appState.skillsPlanning;
    const teamInput = document.getElementById('spTeamPlanInput');
    if(teamInput) teamInput.addEventListener('input', (e) => spState.teamForPlan = e.target.value);

    const focusInput = document.getElementById('spFocusPlanInput');
    if(focusInput) focusInput.addEventListener('input', (e) => spState.planningFocus = e.target.value);

    const generateButton = document.getElementById('spGeneratePlan');
    if(generateButton) generateButton.addEventListener('click', () => {
        if (!spState.teamForPlan.trim() || !spState.planningFocus.trim()) {
            setGlobalNotification({message: "Please specify Team/Unit and Planning Focus.", type: "warning"});
            return;
        }
        spState.planGenerated = true;
        setGlobalNotification({message: `Transformation plan for ${spState.teamForPlan} focusing on ${spState.planningFocus} generated.`, type: "success"});
        renderApp();
    });
}

function addSkillsIntelligenceListeners() {
    const siState = appState.skillsIntelligence;

    if (siState.analyzerView === 'form') {
        const analyzeProfileButton = document.getElementById('siAnalyzeProfileButton');
        if (analyzeProfileButton) {
            analyzeProfileButton.addEventListener('click', analyzeSkillsProfile);
        }

        const exploreMatrixButton = document.getElementById('siExploreMoreMatrix');
        if (exploreMatrixButton) {
            exploreMatrixButton.addEventListener('click', () => {
                setGlobalNotification({ message: "Exploring full skills matrix (simulation). This would typically load a more detailed data view.", type: "info" });
            });
        }
    } else if (siState.analyzerView === 'results') {
        const backToFormButton = document.getElementById('siBackToAnalyzerForm');
        if (backToFormButton) {
            backToFormButton.addEventListener('click', () => {
                siState.analyzerView = 'form';
                siState.analysisCardData = []; 
                renderApp();
            });
        }
    }
}


function addCoPilotListeners() {
    const cpState = appState.coPilot;
    const coPilotHandlers = { 
        handleJobSeekerSend: (message, currentMessages) => {
            let botResponse = "I'm sorry, I didn't understand that. Try 'Build resume for pilot 90210 skills: IFR, Multi-Engine' or 'Find Flight Attendant jobs'.";
            if (message.toLowerCase().includes('zip code') || /\b\d{5}\b/.test(message)) botResponse = "Thanks! Now, what are some of your key aviation skills or licenses? (e.g., 'ATP License, A320 Type Rating, Customer Service')";
            else if (message.toLowerCase().includes('skills') || message.toLowerCase().includes('license') || message.toLowerCase().includes('rating')) { botResponse = "Great! Based on your input, I've drafted a resume tailored for airline roles. (Simulation)"; setGlobalNotification({ message: "Airline-focused resume drafted (simulation).", type: "success"});}
            else if (message.toLowerCase().includes('apply') || message.toLowerCase().includes('find job')) { botResponse = "Okay, searching for airline jobs... Found 2 First Officer positions. Applied to 'Regional Jet First Officer @ SkyHigh Airlines' (Simulation)!"; setGlobalNotification({ message: "Application submitted for First Officer @ SkyHigh Airlines (simulation).", type: "success"});}
            cpState.jobSeekerMessages = [...currentMessages, { sender: 'bot', text: botResponse }];
        },
        handleEmployeeSend: (message, currentMessages) => {
            let botResponse = "I can help with type ratings, recurrent training, or career progression. What are you interested in?";
            if (message.toLowerCase().includes('career path') || message.toLowerCase().includes('progression')) botResponse = "For a First Officer, paths include: Captain, Simulator Instructor, or Fleet Manager. Which interests you?";
            else if (message.toLowerCase().includes('training') || message.toLowerCase().includes('rating')) { botResponse = "Recurrent training for B737 is due next month. Available slots: [Link]. Need to book a new type rating for A350? (View Requirements)"; setGlobalNotification({ message: "Training information provided.", type: "info"});}
            cpState.employeeMessages = [...currentMessages, { sender: 'bot', text: botResponse }];
        },
        handleRecruiterSend: (message, currentMessages) => {
            let botResponse = "I can help create JDs for pilots, cabin crew, mechanics, manage candidates, or schedule sim evaluations.";
            if (message.toLowerCase().includes('create jd') || message.toLowerCase().includes('requisition')) {
                botResponse = "Sure, for which role? E.g., 'A320 Captain, LAX base'.";
                if(currentMessages.some(m => m.text.toLowerCase().includes('a320 captain'))) { botResponse = "Okay, I've drafted a job description for A320 Captain. [Link to JD]. Please review."; setGlobalNotification({ message: "JD for A320 Captain drafted.", type: "success"});}
            } else if (message.toLowerCase().includes('screen candidates') || message.toLowerCase().includes('shortlist')) { botResponse = "Screening candidates for 'Aircraft Mechanic'... Shortlisted 5 candidates with FAA A&P licenses and 3+ years experience. (View List)"; setGlobalNotification({ message: "Candidates for Aircraft Mechanic shortlisted.", type: "success"});}
            cpState.recruiterMessages = [...currentMessages, { sender: 'bot', text: botResponse }];
        },
        handleHrSend: (message, currentMessages) => {
            let botResponse = "I can assist with crew scheduling queries, FAA compliance, union agreements, etc.";
            if (message.toLowerCase().includes('faa compliance') || message.toLowerCase().includes('audit')) botResponse = "Accessing compliance system... Upcoming FAA audit for Part 121 operations on July 15th. Key areas: [List].";
            else if (message.toLowerCase().includes('crew rest') || message.toLowerCase().includes('duty time')) { botResponse = "Checking pilot duty time regulations... For Capt. Smith, max flight duty period for today is 12 hours. Currently at 8 hours. (View Details)"; setGlobalNotification({ message: "Pilot duty time information retrieved.", type: "info"});}
            cpState.hrMessages = [...currentMessages, { sender: 'bot', text: botResponse }];
        }
    };

    document.querySelectorAll('[id^="cpSelect-"]').forEach(button => {
        button.addEventListener('click', (e) => {
            cpState.activeCoPilot = e.currentTarget.dataset.copilotkey;
            renderApp();
        });
    });

    document.querySelectorAll('[id^="cpSend-"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const coPilotKey = e.currentTarget.dataset.copilotkey;
            const inputField = document.getElementById(`cpInput-${coPilotKey}`);
            if (inputField && inputField.value.trim() !== '') {
                const message = inputField.value.trim();
                const messagesKey = `${coPilotKey}Messages`;
                const currentMessages = [...cpState[messagesKey], { sender: 'user', text: message }];
                cpState[messagesKey] = currentMessages;

                const handlerKey = `handle${coPilotKey.charAt(0).toUpperCase() + coPilotKey.slice(1)}Send`;
                if (coPilotHandlers[handlerKey]) {
                    coPilotHandlers[handlerKey](message, currentMessages);
                }
                inputField.value = '';
                renderApp();
                const chatBody = document.getElementById(appState.coPilot[`${coPilotKey}ChatRefId`]);
                if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
            }
        });
    });
     document.querySelectorAll('[id^="cpInput-"]').forEach(inputField => {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const coPilotKey = e.target.id.split('-')[1];
                const sendButton = document.getElementById(`cpSend-${coPilotKey}`);
                if (sendButton) sendButton.click();
            }
        });
    });

    document.querySelectorAll('[id^="cpAction-"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const command = e.currentTarget.dataset.command;
            const coPilotKey = e.currentTarget.dataset.copilotkey;
            const messagesKey = `${coPilotKey}Messages`;
            const currentMessages = [...cpState[messagesKey], { sender: 'user', text: command }];
            cpState[messagesKey] = currentMessages;

            const handlerKey = `handle${coPilotKey.charAt(0).toUpperCase() + coPilotKey.slice(1)}Send`;
            if (coPilotHandlers[handlerKey]) {
                coPilotHandlers[handlerKey](command, currentMessages);
            }
            renderApp();
             const chatBody = document.getElementById(appState.coPilot[`${coPilotKey}ChatRefId`]);
             if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
        });
    });
}

function addEventListeners() {
    // Nav buttons are part of the standalone header, which is not rendered in integrated view.
    // document.querySelectorAll('.nav-button').forEach(button => {
    //     button.addEventListener('click', (e) => setActiveTab(e.currentTarget.dataset.tabId));
    // });

    // Only add listeners for the currently active tab's content
    switch (appState.activeTab) {
        case 'talentIntelligence':
            addTalentIntelligenceListeners();
            break;
        case 'skillsIntelligence':
            addSkillsIntelligenceListeners();
            break;
        case 'roleArchitecture':
            addRoleArchitectureListeners();
            break;
        case 'skillsPlanning':
            addSkillsPlanningListeners();
            break;
        // case 'coPilot': // CoPilot listeners removed
        //     addCoPilotListeners();
        //     break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname.split('/').pop();
    if (pathname === 'skills-intelligence.html') {
        appState.activeTab = 'skillsIntelligence';
    } else if (pathname === 'talent-intelligence.html') {
        appState.activeTab = 'talentIntelligence';
    } else if (pathname === 'role-architecture.html') {
        appState.activeTab = 'roleArchitecture';
    } else if (pathname === 'skills-planning.html') {
        appState.activeTab = 'skillsPlanning';
    }
    // Fallback for index.html or other pages where this script might be included
    // and the #skills-module-content div exists (for the previous dynamic loading approach)
    else if (document.getElementById('skills-module-content')) {
         // Default to talentIntelligence or skillsIntelligence if on index.html
        appState.activeTab = 'talentIntelligence'; // Or 'skillsIntelligence'
    }


    // However, we can still initialize it here if #skills-module-content exists.
    // The actual display of this module will be controlled by Akara's main navigation logic.
    // For standalone pages, #app-container will be used.
    if (document.getElementById('app-container') || document.getElementById('skills-module-content')) {
        if (appState.activeTab === 'talentIntelligence' && MOCK_INDUSTRIES[0] === "Airline") {
            // Pre-select "Airline" if it's the first in mock data and TI is active
            // This might need adjustment if default industry selection is handled elsewhere
            // appState.talentIntelligence.selectedIndustry = "Airline";
        }
        renderApp(); 
    }
});
