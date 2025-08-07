'use strict';

const { useState, useEffect, Fragment } = React;

// Icons - In a real app, these would be imported from 'lucide-react'
// For this standalone environment, we'll assume they are globally available or use placeholders.
// Since we don't have Lucide available directly in this HTML/JS setup without a build process,
// we will use Font Awesome icons if available, or simple text placeholders.
// The HTML includes Font Awesome, so we can try to use those.
// If specific Lucide components are absolutely needed and cannot be replaced,
// this approach would need a build step (like Babel/Webpack) or SVG imports.

const Users = ({ className }) => <i className={`fas fa-users ${className || ''}`}></i>;
const UserPlus = ({ className }) => <i className={`fas fa-user-plus ${className || ''}`}></i>;
const TrendingUp = ({ className }) => <i className={`fas fa-chart-line ${className || ''}`}></i>; // For performance
const Star = ({ className }) => <i className={`fas fa-star ${className || ''}`}></i>; // For exceptional performance
const CheckCircle = ({ className }) => <i className={`fas fa-check-circle ${className || ''}`}></i>; // Meets expectations
const Edit3 = ({ className }) => <i className={`fas fa-edit ${className || ''}`}></i>; // Edit icon
const Trash2 = ({ className }) => <i className={`fas fa-trash-alt ${className || ''}`}></i>; // Delete icon
const ChevronDown = ({ className }) => <i className={`fas fa-chevron-down ${className || ''}`}></i>;
const ChevronUp = ({ className }) => <i className={`fas fa-chevron-up ${className || ''}`}></i>;
const Search = ({ className }) => <i className={`fas fa-search ${className || ''}`}></i>;
const X = ({ className }) => <i className={`fas fa-times ${className || ''}`}></i>; // Close icon
const ArrowLeft = ({ className }) => <i className={`fas fa-arrow-left ${className || ''}`}></i>; // Back icon
const UserCheck = ({ className }) => <i className={`fas fa-user-check ${className || ''}`}></i>; // Successors
const Target = ({ className }) => <i className={`fas fa-bullseye ${className || ''}`}></i>; // Header icon
const ClipboardList = ({ className }) => <i className={`fas fa-clipboard-list ${className || ''}`}></i>; // Skills/Dev Plan
const ShieldAlert = ({ className }) => <i className={`fas fa-shield-alt ${className || ''}`}></i>; // Critical Role (FA has shield-alt)
const CalendarDays = ({ className }) => <i className={`fas fa-calendar-alt ${className || ''}`}></i>; // Calendar
const MessageSquare = ({ className }) => <i className={`fas fa-comment-dots ${className || ''}`}></i>; // Notes
const GridIcon = ({ className }) => <i className={`fas fa-th-large ${className || ''}`}></i>; // 9-box grid
const XCircle = ({ className }) => <i className={`fas fa-times-circle ${className || ''}`}></i>; // Needs Improvement
const UserCog = ({ className }) => <i className={`fas fa-user-cog ${className || ''}`}></i>; // Performance/Potential
const Briefcase = ({ className }) => <i className={`fas fa-briefcase ${className || ''}`}></i>; // Contact/Role
const PlusCircle = ({ className }) => <i className={`fas fa-plus-circle ${className || ''}`}></i>;
const MinusCircle = ({ className }) => <i className={`fas fa-minus-circle ${className || ''}`}></i>;
const CalendarClock = ({ className }) => <i className={`fas fa-calendar-check ${className || ''}`}></i>; // Review/Calibration (FA has calendar-check)
const ClipboardEdit = ({ className }) => <i className={`fas fa-clipboard ${className || ''}`}></i>; // (FA has clipboard)
const UsersRound = ({ className }) => <i className={`fas fa-users-cog ${className || ''}`}></i>; // Talent Pools (FA has users-cog or users)
const Edit = ({ className }) => <i className={`fas fa-edit ${className || ''}`}></i>; // Simple Edit
const Trash = ({ className }) => <i className={`fas fa-trash ${className || ''}`}></i>; // Simple Trash
const Zap = ({ className }) => <i className={`fas fa-bolt ${className || ''}`}></i>; // (FA has bolt)
const MapPin = ({ className }) => <i className={`fas fa-map-marker-alt ${className || ''}`}></i>; // (FA has map-marker-alt)
const BriefcaseBusiness = ({ className }) => <i className={`fas fa-building ${className || ''}`}></i>; // Career Aspirations (FA has building or user-tie)
const TrendingDown = ({ className }) => <i className={`fas fa-chart-line fa-flip-vertical ${className || ''}`}></i>; // (FA has chart-line, can be flipped)
const ShieldQuestion = ({ className }) => <i className={`fas fa-shield-alt ${className || ''}`}></i>; // Risk/Impact (FA has shield-alt, maybe with a question mark overlay if complex)


// Mock initial data for employees (structure remains the same)
const initialEmployeesData = [
  {
    id: '1',
    name: 'Alice Wonderland',
    position: 'Chief Executive Officer',
    department: 'Executive',
    email: 'alice.w@example.com',
    phone: '555-0101',
    manager: null,
    performance: 'Exceptional', 
    potential: 'High', 
    readiness: 'Ready Now',
    skills: ['Leadership', 'Strategic Planning', 'Finance', 'Public Speaking'],
    developmentPlan: 'Global Leadership Summit, Advanced Negotiation Workshop, Executive Coaching on Digital Transformation.',
    successors: [
      { successorEmployeeId: '2', readiness: '1-2 Years', type: 'Primary', notes: 'Strong operational successor.' },
      { successorEmployeeId: '3', readiness: '3-5 Years', type: 'Developmental', notes: 'Needs more executive exposure.' }
    ],
    notes: 'Visionary leader with strong market understanding.',
    dateJoined: '2015-03-01',
    riskOfLoss: 'Low', 
    impactOfLoss: 'High', 
    benchStrength: 'Strong',
    isCriticalRole: true,
    reviewCycle: '2024 Q4 Review',
    lastReviewedDate: '2024-10-15',
    calibrationNotes: 'Calibrated as top talent, consistent high performer.',
    careerAspirations: 'Explore board memberships, mentor upcoming leaders.',
    mobilityPreferences: 'Global (with notice)',
  },
  {
    id: '2',
    name: 'Bob The Builder',
    position: 'Chief Operations Officer',
    department: 'Operations',
    email: 'bob.b@example.com',
    phone: '555-0102',
    manager: 'Alice Wonderland',
    performance: 'Exceeds Expectations',
    potential: 'High',
    readiness: 'Ready Now',
    skills: ['Process Optimization', 'Supply Chain Management', 'Team Leadership', 'Budgeting'],
    developmentPlan: 'Executive MBA Program, Cross-functional project lead for new market entry.',
    successors: [
        { successorEmployeeId: '4', readiness: '1-2 Years', type: 'Primary', notes: 'Solid operational skills.' }
    ],
    notes: 'Excellent at execution and team motivation.',
    dateJoined: '2017-06-15',
    riskOfLoss: 'Medium',
    impactOfLoss: 'High',
    benchStrength: 'Moderate',
    isCriticalRole: true,
    reviewCycle: '2024 Q4 Review',
    lastReviewedDate: '2024-10-15',
    calibrationNotes: 'High potential, needs some strategic development for CEO level.',
    careerAspirations: 'Aspires to CEO role in 3-5 years. Interested in international operations.',
    mobilityPreferences: 'Regional',
  },
  {
    id: '3',
    name: 'Carol Danvers',
    position: 'Chief Technology Officer',
    department: 'Technology',
    email: 'carol.d@example.com',
    phone: '555-0103',
    manager: 'Alice Wonderland',
    performance: 'Exceptional',
    potential: 'High',
    readiness: '1-2 Years',
    skills: ['Software Architecture', 'AI/ML', 'Cybersecurity', 'Cloud Computing', 'Team Building'],
    developmentPlan: 'AI Ethics Certification, Quantum Computing Seminar, Present at industry conference.',
    successors: [
        { successorEmployeeId: '5', readiness: '1-2 Years', type: 'Primary', notes: 'Excellent technical successor.' }
    ],
    notes: 'Drives innovation and technical excellence.',
    dateJoined: '2016-01-20',
    riskOfLoss: 'Low',
    impactOfLoss: 'High',
    benchStrength: 'Strong',
    isCriticalRole: true,
    reviewCycle: '2024 Q4 Review',
    lastReviewedDate: '2024-10-15',
    calibrationNotes: 'Top technical talent, ready for broader leadership.',
    careerAspirations: 'Lead large-scale technology transformations. Potential for CIO/CTO roles in larger orgs.',
    mobilityPreferences: 'Flexible',
  },
  {
    id: '4',
    name: 'David Copperfield',
    position: 'VP of Operations',
    department: 'Operations',
    email: 'david.c@example.com',
    phone: '555-0104',
    manager: 'Bob The Builder',
    performance: 'Meets Expectations',
    potential: 'Medium',
    readiness: '3-5 Years',
    skills: ['Logistics', 'Project Management', 'Quality Control'],
    developmentPlan: 'Advanced Project Management Course, Mentorship with a senior operations leader.',
    successors: [],
    notes: 'Solid performer, needs development in strategic thinking.',
    dateJoined: '2019-09-01',
    riskOfLoss: 'Low',
    impactOfLoss: 'Medium',
    benchStrength: 'Moderate',
    isCriticalRole: false,
    reviewCycle: '2024 Q4 Review',
    lastReviewedDate: '2024-10-10',
    calibrationNotes: 'Core player, consistent in role.',
    careerAspirations: 'Grow into a Sr. VP of Operations role. Interested in process improvement projects.',
    mobilityPreferences: 'Local Only',
  },
  {
    id: '5',
    name: 'Eve Polastri',
    position: 'Director of Engineering',
    department: 'Technology',
    email: 'eve.p@example.com',
    phone: '555-0105',
    manager: 'Carol Danvers',
    performance: 'Exceeds Expectations',
    potential: 'High',
    readiness: '1-2 Years',
    skills: ['Agile Development', 'Team Scaling', 'DevOps Practices', 'Cloud Native Architecture'],
    developmentPlan: 'Attend CTO Roundtable, Mentor junior engineers, Lead a major platform upgrade project.',
    successors: [],
    notes: 'Strong technical leader, growing strategic capabilities.',
    dateJoined: '2018-02-10',
    riskOfLoss: 'Low',
    impactOfLoss: 'Medium',
    benchStrength: 'Strong',
    isCriticalRole: false,
    reviewCycle: '2024 Q4 Review',
    lastReviewedDate: '2024-10-12',
    calibrationNotes: 'Rising star, track for VP Engineering roles.',
    careerAspirations: 'VP of Engineering, potentially CTO in a smaller tech-focused company.',
    mobilityPreferences: 'Flexible',
  },
  {
    id: '6',
    name: 'Frank N. Stein',
    position: 'Senior Manager',
    department: 'Research',
    email: 'frank.s@example.com',
    phone: '555-0106',
    manager: 'Carol Danvers',
    performance: 'Needs Improvement',
    potential: 'Low',
    readiness: '>5 Years',
    skills: ['Lab Management', 'Experiment Design'],
    developmentPlan: 'Performance Improvement Plan, Foundational project management skills training.',
    successors: [],
    notes: 'Struggling in current role.',
    dateJoined: '2020-01-15',
    riskOfLoss: 'High',
    impactOfLoss: 'Low',
    benchStrength: 'Weak',
    isCriticalRole: false,
    reviewCycle: '2024 Q4 Review',
    lastReviewedDate: '2024-09-30',
    calibrationNotes: 'Performance concerns noted, action plan in place.',
    careerAspirations: 'Wants to stabilize in current role or explore individual contributor research path.',
    mobilityPreferences: 'Local Only',
  },
   {
    id: '7',
    name: 'Grace Hopper',
    position: 'Lead Developer',
    department: 'Technology',
    email: 'grace.h@example.com',
    phone: '555-0107',
    manager: 'Eve Polastri',
    performance: 'Meets Expectations',
    potential: 'High',
    readiness: '1-2 Years',
    skills: ['COBOL', 'Compilers', 'Debugging', 'System Design', 'Problem Solving'],
    developmentPlan: 'Modern Cloud Architecture course, Leadership training, Shadow a Director of Engineering.',
    successors: [],
    notes: 'Highly capable, needs broader exposure and leadership opportunities.',
    dateJoined: '2021-07-21',
    riskOfLoss: 'Medium',
    impactOfLoss: 'Medium',
    benchStrength: 'Moderate',
    isCriticalRole: false,
    reviewCycle: '2024 Q4 Review',
    lastReviewedDate: '2024-10-11',
    calibrationNotes: 'Identified as high potential, focus on development for next level.',
    careerAspirations: 'Architect role, potentially Director of Engineering long-term. Passionate about new technologies.',
    mobilityPreferences: 'Regional',
  },
];

const initialTalentPoolsData = [
    {
        id: 'tp1',
        name: 'Future Leaders Program',
        description: 'High-potential individuals groomed for executive leadership roles.',
        targetRoles: ['CEO', 'COO', 'CTO', 'VP Level'],
        members: ['1', '2', '3', '5'], 
        criteria: 'High Potential, Exceeds Expectations or Exceptional Performance, Ready in 1-3 years for senior roles.',
    },
    {
        id: 'tp2',
        name: 'Technical Experts Track',
        description: 'Deep technical specialists for critical architectural and R&D roles.',
        targetRoles: ['Principal Engineer', 'Chief Architect', 'Research Scientist'],
        members: ['3', '7'],
        criteria: 'High Potential in technical domain, Strong problem-solving skills, proven innovation.',
    }
];

// Mappings for Performance/Potential 9-Box Grid
const mapPerformanceToGrid = (performance) => {
  if (performance === 'Exceptional' || performance === 'Exceeds Expectations') return 2; // High Perf (rightmost column)
  if (performance === 'Meets Expectations') return 1; // Medium Perf (middle column)
  if (performance === 'Needs Improvement') return 0; // Low Perf (leftmost column)
  return 0; 
};

const mapPotentialToGrid = (potential) => {
  if (potential === 'High') return 0; // High Pot (top row)
  if (potential === 'Medium') return 1; // Medium Pot (middle row)
  if (potential === 'Low') return 2; // Low Pot (bottom row)
  return 2; 
};

const perfPotentialGridCellLabels = [
  // Y-Axis: Potential (High, Medium, Low), X-Axis: Performance (Low, Medium, High)
  { name: "Future Leader / Develop", color: "bg-green-50" },    // High Pot / Low Perf
  { name: "High Potential / Grow", color: "bg-green-100" },   // High Pot / Med Perf
  { name: "Star / Retain & Challenge", color: "bg-green-200" },// High Pot / High Perf
  { name: "Inconsistent Player / Coach", color: "bg-yellow-50" }, // Med Pot / Low Perf
  { name: "Core Player / Value", color: "bg-yellow-100" },      // Med Pot / Med Perf
  { name: "High Performer / Leverage", color: "bg-yellow-200" },// Med Pot / High Perf
  { name: "Risk / Manage Out", color: "bg-red-50" },          // Low Pot / Low Perf
  { name: "Average Performer / Monitor", color: "bg-red-100" }, // Low Pot / Med Perf
  { name: "Solid Performer / Maintain", color: "bg-red-200" },   // Low Pot / High Perf
];
const perfPotentialXAxisLabels = ['Low Perf.', 'Medium Perf.', 'High Perf.'];
const perfPotentialYAxisLabels = ['High Potential', 'Medium Potential', 'Low Potential'];

// NEW: Mappings for Risk/Impact 9-Box Grid
const mapRiskToGrid = (riskOfLoss) => {
  if (riskOfLoss === 'High') return 2;   // High Risk (rightmost column)
  if (riskOfLoss === 'Medium') return 1; // Medium Risk (middle column)
  if (riskOfLoss === 'Low') return 0;    // Low Risk (leftmost column)
  return 0; 
};

const mapImpactToGrid = (impactOfLoss) => {
  if (impactOfLoss === 'High') return 0;   // High Impact (top row)
  if (impactOfLoss === 'Medium') return 1; // Medium Impact (middle row)
  if (impactOfLoss === 'Low') return 2;    // Low Impact (bottom row)
  return 2; 
};

const riskImpactGridCellLabels = [
  // Y-Axis: Impact (High, Medium, Low), X-Axis: Risk (Low, Medium, High)
  { name: "Valued Specialist / Retain", color: "bg-yellow-100" },      // High Impact / Low Risk
  { name: "Key Talent / Monitor & Retain", color: "bg-orange-100" },   // High Impact / Med Risk
  { name: "Critical Flight Risk / Urgent Action", color: "bg-red-200" },// High Impact / High Risk
  { name: "Solid Contributor / Develop", color: "bg-green-50" },       // Med Impact / Low Risk
  { name: "Core Employee / Engage", color: "bg-yellow-50" },          // Med Impact / Med Risk
  { name: "Potential Concern / Mitigate", color: "bg-orange-50" },     // Med Impact / High Risk
  { name: "Steady Performer / Maintain", color: "bg-blue-50" },        // Low Impact / Low Risk
  { name: "Manageable Risk / Observe", color: "bg-blue-100" },         // Low Impact / Med Risk
  { name: "Lower Concern / Contingency Plan", color: "bg-gray-100" },  // Low Impact / High Risk
];
const riskImpactXAxisLabels = ['Low Risk', 'Medium Risk', 'High Risk'];
const riskImpactYAxisLabels = ['High Impact', 'Medium Impact', 'Low Impact'];


const App = () => {
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem('successionEmployees');
    try {
        let parsed = savedEmployees ? JSON.parse(savedEmployees) : initialEmployeesData;
        // Ensure all fields from initialEmployeesData are present, and new fields are initialized
        return parsed.map(emp => {
            const initialEmpData = initialEmployeesData.find(initialEmp => initialEmp.id === emp.id) || {};
            return {
                ...initialEmpData, // Default values from initial data
                ...emp, // Overwrite with saved data
                // Ensure new fields have defaults if not present in saved data
                impactOfLoss: emp.impactOfLoss || initialEmpData.impactOfLoss || 'Medium', 
                careerAspirations: emp.careerAspirations || initialEmpData.careerAspirations || '',
                mobilityPreferences: emp.mobilityPreferences || initialEmpData.mobilityPreferences || 'Not Specified',
                successors: (emp.successors || initialEmpData.successors || []).map(s => ({
                    successorEmployeeId: s.successorEmployeeId || s.id, // Handle potential old 'id' field
                    readiness: s.readiness || '3-5 Years',
                    type: s.type || 'Primary', 
                    notes: s.notes || ''
                }))
            };
        });
    } catch (error) {
        console.error("Error parsing employees from localStorage:", error);
        return initialEmployeesData; 
    }
  });

  const [talentPools, setTalentPools] = useState(() => {
    const savedTalentPools = localStorage.getItem('successionTalentPools');
    try {
        const parsed = savedTalentPools ? JSON.parse(savedTalentPools) : initialTalentPoolsData;
        return parsed.map(pool => ({
            ...initialTalentPoolsData.find(ip => ip.id === pool.id) || {}, // Base from initial
            ...pool, // Apply saved data
            targetRoles: Array.isArray(pool.targetRoles) ? pool.targetRoles : (pool.targetRoles ? String(pool.targetRoles).split(',').map(s => s.trim()) : []),
            members: Array.isArray(pool.members) ? pool.members : []
        }));
    } catch (error) {
        console.error("Error parsing talent pools from localStorage:", error);
        return initialTalentPoolsData;
    }
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [view, setView] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTalentPoolModalOpen, setIsTalentPoolModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [talentPoolToEdit, setTalentPoolToEdit] = useState(null);

  console.log("App view:", view, "isModalOpen:", isModalOpen, "employeeToEdit:", employeeToEdit);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    localStorage.setItem('successionEmployees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('successionTalentPools', JSON.stringify(talentPools));
  }, [talentPools]);

  const departments = [...new Set(employees.map(emp => emp.department))].sort();

  const filteredEmployees = employees
    .filter(emp => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const nameMatch = emp.name.toLowerCase().includes(lowerSearchTerm);
        const positionMatch = emp.position.toLowerCase().includes(lowerSearchTerm);
        const skillsMatch = Array.isArray(emp.skills) && emp.skills.some(skill => skill.toLowerCase().includes(lowerSearchTerm));
        return (nameMatch || positionMatch || skillsMatch) && (filterDepartment ? emp.department === filterDepartment : true);
    });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const handleAddEmployee = () => { 
    console.log("handleAddEmployee called");
    setEmployeeToEdit(null); 
    setView('form'); 
    setIsModalOpen(true); 
  };
  const handleEditEmployee = (employee) => { 
    console.log("handleEditEmployee called with:", employee);
    setEmployeeToEdit(employee); 
    setView('form'); 
    setIsModalOpen(true); 
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        // Also remove this employee from any successor lists and talent pools
        setEmployees(prevEmployees => prevEmployees.map(emp => ({
            ...emp,
            successors: emp.successors ? emp.successors.filter(succ => succ.successorEmployeeId !== employeeId) : []
        })));
        setTalentPools(prevPools => prevPools.map(pool => ({
            ...pool,
            members: pool.members.filter(memberId => memberId !== employeeId)
        })));
        if (selectedEmployee && selectedEmployee.id === employeeId) { setSelectedEmployee(null); setView('list'); }
    }
  };
  
  const handleSaveEmployee = (employeeData) => {
    const isEditing = !!(employeeToEdit && employeeToEdit.id);
    let updatedEmployees;
    if (isEditing) {
      // For editing, merge existing employee data with form data
      updatedEmployees = employees.map(emp => 
        emp.id === employeeToEdit.id ? { ...emp, ...employeeData } : emp
      );
      if (selectedEmployee && selectedEmployee.id === employeeToEdit.id) {
        setSelectedEmployee({ ...selectedEmployee, ...employeeData });
      }
    } else {
      // For adding a new employee, employeeData comes from the form (which was initialized with initialFormState)
      // Skills array is already correctly formed by EmployeeFormModal's handleSubmit.
      const newEmployee = {
        ...employeeData, // employeeData already has the correct shape and defaults from the form
        id: String(Date.now()), // Assign a new ID
        // Ensure any absolutely critical fields not covered by initialFormState (if any) have defaults,
        // though initialFormState should be comprehensive.
        // Example: dateJoined and isCriticalRole are already in initialFormState.
        // Skills and successors are already in employeeData as arrays.
      };
      updatedEmployees = [...employees, newEmployee];
    }
    setEmployees(updatedEmployees);
    setIsModalOpen(false);
    if (isEditing && selectedEmployee && selectedEmployee.id === employeeToEdit.id) { setView('detail'); } 
    else { setView('list'); }
    setEmployeeToEdit(null); 
  };

  const handleSelectEmployee = (employee) => { setSelectedEmployee(employee); setView('detail'); };
  const handleBackToList = () => { setSelectedEmployee(null); setTalentPoolToEdit(null); setView('list'); };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') { direction = 'descending';}
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) { return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />; }
    return null;
  };

  const handleAddTalentPool = () => { setTalentPoolToEdit(null); setView('talentPoolForm'); setIsTalentPoolModalOpen(true); };
  const handleEditTalentPool = (pool) => { setTalentPoolToEdit(pool); setView('talentPoolForm'); setIsTalentPoolModalOpen(true); };

  const handleSaveTalentPool = (poolData) => {
    const processedPoolData = {
        ...poolData,
        targetRoles: Array.isArray(poolData.targetRoles) ? poolData.targetRoles : String(poolData.targetRoles).split(',').map(s => s.trim()).filter(s => s),
        members: Array.isArray(poolData.members) ? poolData.members : []
    };

    if (talentPoolToEdit) {
        setTalentPools(talentPools.map(p => p.id === talentPoolToEdit.id ? { ...talentPoolToEdit, ...processedPoolData } : p));
    } else {
        setTalentPools([...talentPools, { ...processedPoolData, id: `tp${Date.now()}` }]);
    }
    setIsTalentPoolModalOpen(false); setView('talentPools'); setTalentPoolToEdit(null);
  };

  const handleDeleteTalentPool = (poolId) => {
    if (window.confirm('Are you sure you want to delete this talent pool?')) {
        setTalentPools(talentPools.filter(p => p.id !== poolId));
        // If currently viewing details of this pool, go back to talent pools list
        if (view === 'talentPoolDetail' && talentPoolToEdit && talentPoolToEdit.id === poolId) { 
            setView('talentPools'); 
            setTalentPoolToEdit(null); 
        }
    }
  };

  // EmployeeFormPage
  const EmployeeFormPage = ({ onClose, onSave, employee: employeeToEditProp, allEmployees }) => {
    const [activeSection, setActiveSection] = useState('core');
    const formSections = [
        { id: 'core', title: 'Core Information', fieldsetId: 'fieldset-core' },
        { id: 'profile', title: 'Talent Profile', fieldsetId: 'fieldset-profile' },
        { id: 'career', title: 'Career & Development', fieldsetId: 'fieldset-career' },
        { id: 'succession', title: 'Succession Plan (Nominations)', fieldsetId: 'fieldset-succession' }
    ];

    // Define a comprehensive initial state based on one of the initialEmployeesData items or a generic structure
    const baseInitialFormState = initialEmployeesData.length > 0 ? { ...initialEmployeesData[0] } : {};
    // Clear out specific values that should be empty for a new form
    Object.keys(baseInitialFormState).forEach(key => {
        if (key === 'id' || key === 'name' || key === 'email' || key === 'phone' || key === 'manager' || key === 'notes' || key === 'calibrationNotes' || key === 'developmentPlan' || key === 'careerAspirations' || key === 'reviewCycle') {
            baseInitialFormState[key] = '';
        } else if (key === 'skills') {
            baseInitialFormState[key] = ''; // Store as string for input
        } else if (key === 'successors') {
            baseInitialFormState[key] = [];
        } else if (key === 'isCriticalRole') {
            baseInitialFormState[key] = false;
        } else if (key === 'dateJoined' || key === 'lastReviewedDate') {
            baseInitialFormState[key] = new Date().toISOString().split('T')[0];
        }
        // Keep defaults for selects like performance, potential, readiness, riskOfLoss, impactOfLoss, benchStrength, mobilityPreferences
    });
    // Ensure all fields from the provided data structure are in initialFormState
     const initialFormState = { // This is inside EmployeeFormModal
        name: '', position: '', department: '', email: '', phone: '', manager: '',
        performance: 'Meets Expectations', potential: 'Medium', readiness: 'Ready Now',
        skills: '', // Stored as comma-separated string in form
        developmentPlan: '', notes: '', dateJoined: new Date().toISOString().split('T')[0],
        riskOfLoss: 'Low', impactOfLoss: 'Medium', benchStrength: 'Moderate', 
        isCriticalRole: false, reviewCycle: '', lastReviewedDate: new Date().toISOString().split('T')[0], 
        calibrationNotes: '', careerAspirations: '', mobilityPreferences: 'Not Specified', 
        successors: [] // Array of successor objects
        // Removed ...baseInitialFormState as it was complex and initialFormState is now self-contained.
      };

    const [formData, setFormData] = useState(initialFormState);
    console.log("EmployeeFormPage rendering, employeeToEditProp:", employeeToEditProp);
    const [currentSuccessor, setCurrentSuccessor] = useState({ successorEmployeeId: '', readiness: 'Ready Now', type: 'Primary', notes: '' });

    useEffect(() => {
        if (employeeToEditProp) {
            setFormData({
                ...initialFormState, // Start with a clean slate of all possible fields
                ...employeeToEditProp, // Populate with employee data
                skills: Array.isArray(employeeToEditProp.skills) ? employeeToEditProp.skills.join(', ') : (employeeToEditProp.skills || ''),
                successors: employeeToEditProp.successors || [],
                isCriticalRole: employeeToEditProp.isCriticalRole || false,
                dateJoined: employeeToEditProp.dateJoined ? employeeToEditProp.dateJoined.split('T')[0] : new Date().toISOString().split('T')[0],
                lastReviewedDate: employeeToEditProp.lastReviewedDate ? employeeToEditProp.lastReviewedDate.split('T')[0] : new Date().toISOString().split('T')[0],
            });
        } else {
            setFormData(initialFormState); // For new employee
        }
    }, [employeeToEditProp]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSuccessorChange = (e) => {
        const { name, value } = e.target;
        setCurrentSuccessor(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSuccessorToList = () => {
        if (!currentSuccessor.successorEmployeeId) { alert("Please select a successor employee."); return; }
        if (formData.successors.find(s => s.successorEmployeeId === currentSuccessor.successorEmployeeId)) { alert("This employee is already a successor."); return; }
        // An employee cannot be their own successor. This check needs formData.id which is available if editing.
        // For new employees, formData.id is not yet set. This check is more relevant for edits.
        if (employeeToEditProp && employeeToEditProp.id === currentSuccessor.successorEmployeeId) { 
            alert("An employee cannot be their own successor."); return; 
        }
        setFormData(prev => ({ ...prev, successors: [...prev.successors, { ...currentSuccessor }] }));
        setCurrentSuccessor({ successorEmployeeId: '', readiness: 'Ready Now', type: 'Primary', notes: '' }); 
    };

    const handleRemoveSuccessor = (successorIdToRemove) => {
        setFormData(prev => ({ ...prev, successors: prev.successors.filter(s => s.successorEmployeeId !== successorIdToRemove) }));
    };

    const handleSubmit = (e) => { 
        e.preventDefault(); 
        const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill); 
        onSave({ ...formData, skills: skillsArray }); 
    };

    // Form is now a page, not a modal, so isOpen check is removed.
    console.log("EmployeeFormPage rendering, formData:", formData);
    
    // Available employees for successor dropdown: not the current employee being edited, and not already in their successor list
    const availableSuccessorOptions = allEmployees.filter(emp => 
        (employeeToEditProp ? emp.id !== employeeToEditProp.id : true) && 
        !formData.successors.some(s => s.successorEmployeeId === emp.id)
    );

    // Changed from modal structure to a page structure
    return (
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-lg max-w-6xl mx-auto my-8" style={{ minHeight: 'calc(100vh - 10rem)' }}> {/* Attempt to fill available height */}
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-6 border-r border-gray-200 bg-gray-50 rounded-l-lg">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">Form Sections</h3>
          <nav className="space-y-2">
            {formSections.map(section => (
              <a
                key={section.id}
                href={`#${section.fieldsetId}`} // For accessibility, though click handles it
                onClick={(e) => { e.preventDefault(); setActiveSection(section.id); }}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeSection === section.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Form Content Area */}
        <div className="w-full md:w-3/4 p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 10rem)' }}> {/* Scroll within content panel */}
          <div className="flex justify-between items-center mb-6 pb-3 border-b">
            <h2 className="text-2xl font-semibold text-gray-700">
              {employeeToEditProp ? `Edit Employee: ${formSections.find(s => s.id === activeSection)?.title}` : `Add New Employee: ${formSections.find(s => s.id === activeSection)?.title}`}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Conditionally render sections based on activeSection */}
            {activeSection === 'core' && (
            <fieldset id={formSections.find(s => s.id === 'core').fieldsetId} className="border p-4 rounded-md animate-fadeIn">
              <legend className="text-lg font-medium text-indigo-600 px-2">Core Information</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label><input type="text" name="position" id="position" value={formData.position} onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label><input type="text" name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label><input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="manager" className="block text-sm font-medium text-gray-700">Manager</label><input type="text" name="manager" id="manager" value={formData.manager || ''} onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="dateJoined" className="block text-sm font-medium text-gray-700">Date Joined</label><input type="date" name="dateJoined" id="dateJoined" value={formData.dateJoined} onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                <div className="flex items-center mt-2 md:col-span-2"><input type="checkbox" name="isCriticalRole" id="isCriticalRole" checked={formData.isCriticalRole} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /><label htmlFor="isCriticalRole" className="ml-2 block text-sm font-medium text-gray-700">This is a Critical Role</label></div>
              </div>
            </fieldset>
            )}

            {activeSection === 'profile' && (
            <fieldset id={formSections.find(s => s.id === 'profile').fieldsetId} className="border p-4 rounded-md animate-fadeIn">
              <legend className="text-lg font-medium text-indigo-600 px-2">Talent Profile</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div><label htmlFor="performance" className="block text-sm font-medium text-gray-700">Performance</label><select name="performance" id="performance" value={formData.performance} onChange={handleChange} className="mt-1 block w-full input-style"><option>Exceptional</option><option>Exceeds Expectations</option><option>Meets Expectations</option><option>Needs Improvement</option></select></div>
                <div><label htmlFor="potential" className="block text-sm font-medium text-gray-700">Potential</label><select name="potential" id="potential" value={formData.potential} onChange={handleChange} className="mt-1 block w-full input-style"><option>High</option><option>Medium</option><option>Low</option></select></div>
                <div><label htmlFor="readiness" className="block text-sm font-medium text-gray-700">Readiness for Next Role</label><select name="readiness" id="readiness" value={formData.readiness} onChange={handleChange} className="mt-1 block w-full input-style"><option>Ready Now</option><option>1-2 Years</option><option>3-5 Years</option><option>{'>5 Years'}</option></select></div>
                <div><label htmlFor="riskOfLoss" className="block text-sm font-medium text-gray-700">Risk of Loss</label><select name="riskOfLoss" id="riskOfLoss" value={formData.riskOfLoss} onChange={handleChange} className="mt-1 block w-full input-style"><option>Low</option><option>Medium</option><option>High</option></select></div>
                <div><label htmlFor="impactOfLoss" className="block text-sm font-medium text-gray-700">Impact of Loss</label><select name="impactOfLoss" id="impactOfLoss" value={formData.impactOfLoss} onChange={handleChange} className="mt-1 block w-full input-style"><option>Low</option><option>Medium</option><option>High</option></select></div>
                <div><label htmlFor="benchStrength" className="block text-sm font-medium text-gray-700">Bench Strength (for role)</label><select name="benchStrength" id="benchStrength" value={formData.benchStrength} onChange={handleChange} className="mt-1 block w-full input-style"><option>Strong</option><option>Moderate</option><option>Weak</option></select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div><label htmlFor="reviewCycle" className="block text-sm font-medium text-gray-700">Review Cycle</label><input type="text" name="reviewCycle" id="reviewCycle" value={formData.reviewCycle} onChange={handleChange} placeholder="e.g., 2025 H1 Review" className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="lastReviewedDate" className="block text-sm font-medium text-gray-700">Last Reviewed Date</label><input type="date" name="lastReviewedDate" id="lastReviewedDate" value={formData.lastReviewedDate} onChange={handleChange} className="mt-1 block w-full input-style" /></div>
              </div>
              <div className="mt-4"><label htmlFor="calibrationNotes" className="block text-sm font-medium text-gray-700">Calibration Notes</label><textarea name="calibrationNotes" id="calibrationNotes" value={formData.calibrationNotes} onChange={handleChange} rows="3" className="mt-1 block w-full input-style"></textarea></div>
            </fieldset>
            )}

            {activeSection === 'career' && (
            <fieldset id={formSections.find(s => s.id === 'career').fieldsetId} className="border p-4 rounded-md animate-fadeIn">
              <legend className="text-lg font-medium text-indigo-600 px-2">Career & Development</legend>
                <div className="mt-2"><label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label><input type="text" name="skills" id="skills" value={formData.skills} onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                <div className="mt-4"><label htmlFor="careerAspirations" className="block text-sm font-medium text-gray-700">Career Aspirations</label><textarea name="careerAspirations" id="careerAspirations" value={formData.careerAspirations} onChange={handleChange} rows="3" className="mt-1 block w-full input-style"></textarea></div>
                <div className="mt-4"><label htmlFor="mobilityPreferences" className="block text-sm font-medium text-gray-700">Mobility Preferences</label><select name="mobilityPreferences" id="mobilityPreferences" value={formData.mobilityPreferences} onChange={handleChange} className="mt-1 block w-full input-style"><option>Not Specified</option><option>Local Only</option><option>Regional</option><option>National</option><option>Global (with notice)</option><option>Flexible</option></select></div>
                <div className="mt-4"><label htmlFor="developmentPlan" className="block text-sm font-medium text-gray-700">Development Plan</label><textarea name="developmentPlan" id="developmentPlan" value={formData.developmentPlan} onChange={handleChange} rows="4" className="mt-1 block w-full input-style"></textarea></div>
                <div className="mt-4"><label htmlFor="notes" className="block text-sm font-medium text-gray-700">General Notes</label><textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows="3" className="mt-1 block w-full input-style"></textarea></div>
            </fieldset>
            )}

            {activeSection === 'succession' && (
            <fieldset id={formSections.find(s => s.id === 'succession').fieldsetId} className="border p-4 rounded-md animate-fadeIn">
              <legend className="text-lg font-medium text-indigo-600 px-2">Succession Plan (Nominations)</legend>
              <div className="space-y-3 mt-2">
                {formData.successors && formData.successors.length > 0 && (<div><h4 className="text-sm font-medium text-gray-700 mb-1">Current Successors:</h4><ul className="space-y-2">
                    {formData.successors.map((succ, index) => { const succEmp = allEmployees.find(e => e.id === succ.successorEmployeeId); return (<li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"><div><span className="font-semibold">{succEmp ? succEmp.name : 'Unknown Employee'}</span><span className="text-xs text-gray-500 ml-2">({succ.type}, {succ.readiness})</span></div><button type="button" onClick={() => handleRemoveSuccessor(succ.successorEmployeeId)} className="text-red-500 hover:text-red-700"><MinusCircle size={18} /></button></li>);})}
                </ul></div>)}
                <div className="border-t pt-3 mt-3"><h4 className="text-sm font-medium text-gray-700 mb-2">Add New Successor:</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    <div><label htmlFor="successorEmployeeId" className="block text-xs font-medium text-gray-700">Employee</label><select name="successorEmployeeId" id="successorEmployeeId" value={currentSuccessor.successorEmployeeId} onChange={handleSuccessorChange} className="mt-1 block w-full input-style"><option value="">Select Employee</option>{availableSuccessorOptions.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}</select></div>
                    <div><label htmlFor="successorReadiness" className="block text-xs font-medium text-gray-700">Readiness</label><select name="readiness" id="successorReadiness" value={currentSuccessor.readiness} onChange={handleSuccessorChange} className="mt-1 block w-full input-style"><option>Ready Now</option><option>1-2 Years</option><option>3-5 Years</option><option>{'>5 Years'}</option></select></div>
                    <div><label htmlFor="successorType" className="block text-xs font-medium text-gray-700">Type</label><select name="type" id="successorType" value={currentSuccessor.type} onChange={handleSuccessorChange} className="mt-1 block w-full input-style"><option>Primary</option><option>Emergency</option><option>Developmental</option></select></div>
                    <div className="md:col-span-2"><label htmlFor="successorNotes" className="block text-xs font-medium text-gray-700">Notes for Successor</label><input type="text" name="notes" id="successorNotes" value={currentSuccessor.notes} onChange={handleSuccessorChange} className="mt-1 block w-full input-style" /></div>
                </div><button type="button" onClick={handleAddSuccessorToList} className="mt-3 flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 btn-focus-green"><PlusCircle size={16} className="mr-1.5" /> Add to Successors List</button></div>
              </div>
            </fieldset>
            )}
            
            {/* Form Actions: Common to all sections, placed at the bottom of the form content area */}
            <div className="flex justify-end space-x-3 pt-6 border-t mt-8">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 btn-focus-gray">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 btn-focus-indigo">Save Employee</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // GENERALIZED 9-Box Grid Component
  const NineBoxGrid = ({ title, employees, onSelectEmployee, xAxisKey, yAxisKey, mapXToGridFunc, mapYToGridFunc, gridCellLabels, xAxisLabels, yAxisLabels }) => {
    const gridData = Array(3).fill(null).map(() => Array(3).fill(null).map(() => []));

    employees.forEach(emp => {
      const yIndex = mapYToGridFunc(emp[yAxisKey]); // e.g., potential or impact
      const xIndex = mapXToGridFunc(emp[xAxisKey]); // e.g., performance or risk
      if (yIndex >= 0 && yIndex < 3 && xIndex >= 0 && xIndex < 3) {
        gridData[yIndex][xIndex].push(emp);
      }
    });

    return (
      <div className="bg-white shadow-xl rounded-lg p-4 md:p-6 animate-fadeIn nine-box-grid-container">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center nine-box-title">{title}</h2>
        <div className="flex mb-2">
            <div className="md:w-[120px] w-[60px] flex-shrink-0"></div> {/* Spacer for Y-axis labels */}
            <div className="flex-grow grid grid-cols-3 gap-1 md:gap-2">
                {xAxisLabels.map(label => (
                    <div key={label} className="text-center font-medium text-gray-600 text-xs sm:text-sm md:text-base nine-box-axis-label">{label}</div>
                ))}
            </div>
        </div>

        {/* Grid Area: Iterate through rows */}
        <div className="mt-2 space-y-1 md:space-y-2">
            {gridData.map((rowCells, rowIndex) => (
                <div key={`row-${rowIndex}`} className="nine-box-row"> {/* Rely on CSS for flex behavior */}
                    {/* Y-Axis Label */}
                    <div className="nine-box-y-label">
                        {yAxisLabels[rowIndex]}
                    </div>
                    {/* Cells for this row */}
                    <div className="nine-box-row-cells"> {/* Rely on CSS for grid behavior */}
                        {rowCells.map((cellEmployees, colIndex) => {
                            const cellLabelData = gridCellLabels[rowIndex * 3 + colIndex];
                            return (
                                <div
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    className={`nine-box-cell-item ${cellLabelData.color}`} /* Base cell styles in CSS, color from JS */
                                >
                                    <h3 className="font-semibold text-xs md:text-sm text-gray-700 mb-1 nine-box-cell-title">
                                        {cellLabelData.name} ({cellEmployees.length})
                                    </h3>
                                    <div className="overflow-y-auto max-h-[60px] md:max-h-[90px] space-y-0.5">
                                        {cellEmployees.map(emp => (
                                            <div
                                                key={emp.id}
                                                onClick={() => onSelectEmployee(emp)}
                                                className="text-xs p-1 bg-white bg-opacity-75 rounded shadow-xs hover:bg-gray-100 cursor-pointer truncate nine-box-employee-item"
                                                title={emp.name}
                                            >
                                                {emp.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  };

  // TalentPoolFormModal
  const TalentPoolFormModal = ({ isOpen, onClose, onSave, poolToEdit, allEmployees }) => {
    const initialPoolFormState = { name: '', description: '', targetRoles: '', criteria: '', members: [] };
    const [poolData, setPoolData] = useState(initialPoolFormState);
    
    useEffect(() => { 
        if (poolToEdit) { 
            setPoolData({
                ...initialPoolFormState,
                ...poolToEdit, 
                targetRoles: Array.isArray(poolToEdit.targetRoles) ? poolToEdit.targetRoles.join(', ') : (poolToEdit.targetRoles || ''), 
                members: poolToEdit.members || []
            }); 
        } else { 
            setPoolData(initialPoolFormState); 
        } 
    }, [poolToEdit]);

    const handleChange = (e) => { const { name, value } = e.target; setPoolData(prev => ({ ...prev, [name]: value })); };
    
    const handleMemberToggle = (employeeId) => { 
        setPoolData(prev => { 
            const newMembers = prev.members.includes(employeeId) ? prev.members.filter(id => id !== employeeId) : [...prev.members, employeeId]; 
            return { ...prev, members: newMembers };
        }); 
    };
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        // Skills are already an array in poolData.members
        onSave(poolData); // Pass poolData directly
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-overlay">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content-sp">
            <div className="flex justify-between items-center mb-4 pb-3 border-b modal-header-sp">
                <h2 className="text-2xl font-semibold text-gray-700 modal-title-sp">{poolToEdit ? 'Edit Talent Pool' : 'Add New Talent Pool'}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><label htmlFor="poolName" className="block text-sm font-medium text-gray-700">Pool Name</label><input type="text" name="name" id="poolName" value={poolData.name} onChange={handleChange} required className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="poolDescription" className="block text-sm font-medium text-gray-700">Description</label><textarea name="description" id="poolDescription" value={poolData.description} onChange={handleChange} rows="3" className="mt-1 block w-full input-style"></textarea></div>
                <div><label htmlFor="poolTargetRoles" className="block text-sm font-medium text-gray-700">Target Roles (comma-separated)</label><input type="text" name="targetRoles" id="poolTargetRoles" value={poolData.targetRoles} onChange={handleChange} className="mt-1 block w-full input-style" /></div>
                <div><label htmlFor="poolCriteria" className="block text-sm font-medium text-gray-700">Criteria</label><textarea name="criteria" id="poolCriteria" value={poolData.criteria} onChange={handleChange} rows="2" className="mt-1 block w-full input-style"></textarea></div>
                <div><label className="block text-sm font-medium text-gray-700">Members</label><div className="mt-1 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
                    {allEmployees.map(emp => (<div key={emp.id} className="flex items-center"><input type="checkbox" id={`member-${emp.id}`} checked={poolData.members.includes(emp.id)} onChange={() => handleMemberToggle(emp.id)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /><label htmlFor={`member-${emp.id}`} className="ml-2 text-sm text-gray-700">{emp.name} ({emp.position})</label></div>))}
                </div></div>
                <div className="flex justify-end space-x-3 pt-3 border-t"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 btn-focus-gray">Cancel</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 btn-focus-indigo">Save Pool</button></div>
            </form>
        </div></div>
    );
  };

  // TalentPoolsView
  const TalentPoolsView = ({ pools, onEdit, onDelete, onSelectEmployee }) => {
    if (!pools || pools.length === 0) { return (<div className="text-center py-12 animate-fadeIn"><UsersRound size={48} className="mx-auto text-gray-400" /><p className="mt-4 text-lg text-gray-600">No talent pools created yet.</p><p className="text-sm text-gray-500">Click "Add Talent Pool" to get started.</p></div>); }
    return (<div className="space-y-6 animate-fadeIn">{pools.map(pool => (<div key={pool.id} className="bg-white shadow-lg rounded-lg p-6 info-card"><div className="flex justify-between items-start"><div><h3 className="text-xl font-semibold text-indigo-700">{pool.name}</h3><p className="text-sm text-gray-600 mt-1">{pool.description}</p><p className="text-xs text-gray-500 mt-2"><strong>Criteria:</strong> {pool.criteria}</p>{pool.targetRoles && pool.targetRoles.length > 0 && (<p className="text-xs text-gray-500 mt-1"><strong>Target Roles:</strong> {Array.isArray(pool.targetRoles) ? pool.targetRoles.join(', ') : pool.targetRoles}</p>)}</div><div className="flex space-x-2 flex-shrink-0 ml-4"><button onClick={() => onEdit(pool)} className="p-2 text-yellow-500 hover:text-yellow-700" title="Edit Pool"><Edit size={18} /></button><button onClick={() => onDelete(pool.id)} className="p-2 text-red-500 hover:text-red-700" title="Delete Pool"><Trash size={18} /></button></div></div><div className="mt-4 pt-3 border-t"><h4 className="text-sm font-medium text-gray-700 mb-2">Members ({pool.members.length}):</h4>{pool.members.length > 0 ? (<ul className="space-y-1">{pool.members.map(memberId => { const member = employees.find(e => e.id === memberId); return member ? (<li key={memberId} onClick={() => onSelectEmployee(member)} className="text-sm text-indigo-600 hover:underline cursor-pointer">{member.name} ({member.position})</li>) : <li key={memberId} className="text-sm text-gray-400 italic">Unknown Member (ID: {memberId})</li>;})}</ul>) : <p className="text-sm text-gray-500 italic">No members in this pool yet.</p>}</div></div>))}</div>);
  };

  // Main App Layout
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Global styles are in succession-planning.css and linked in the HTML */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-2xl font-semibold text-indigo-600 mb-2 sm:mb-0">
            <Target size={28} /> <h1>Succession Planning</h1>
          </div>
          {view === 'list' && (
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <input type="text" placeholder="Search name, position, skills..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full input-style" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full sm:w-auto input-style" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                <option value="">All Departments</option> {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
              <button onClick={() => setView('talentPools')} className="w-full sm:w-auto flex items-center justify-center px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-150 text-sm btn-primary" title="View Talent Pools">
                <UsersRound size={16} className="mr-1.5" /> Talent Pools
              </button>
              <button onClick={() => setView('perfPotentialNineBox')} className="w-full sm:w-auto flex items-center justify-center px-3 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-150 text-sm btn-primary" title="View Performance/Potential Grid">
                <GridIcon size={16} className="mr-1.5" /> Perf/Potential
              </button>
              <button onClick={() => setView('riskImpactNineBox')} className="w-full sm:w-auto flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-150 text-sm btn-primary" title="View Risk/Impact Grid">
                <ShieldQuestion size={16} className="mr-1.5" /> Risk/Impact
              </button>
              <button onClick={handleAddEmployee} className="w-full sm:w-auto flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 text-sm btn-primary">
                <UserPlus size={16} className="mr-1.5" /> Add Employee
              </button>
            </div>
          )}
           {(view === 'detail' || view === 'perfPotentialNineBox' || view === 'riskImpactNineBox' || view === 'talentPools' || view === 'talentPoolForm') && (
             <button onClick={handleBackToList} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-150 btn-secondary"> <ArrowLeft size={18} className="mr-2" /> Back to Employee List </button>
           )}
           {view === 'talentPools' && (
                <button onClick={handleAddTalentPool} className="ml-auto flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 btn-focus-green transition duration-150 btn-primary"> <PlusCircle size={18} className="mr-2" /> Add Talent Pool </button>
           )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        {view === 'list' && ( <div className="w-full bg-white shadow-xl rounded-lg overflow-x-auto animate-fadeIn">
            {sortedEmployees.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 styled-table">
                <thead className="bg-gray-50"><tr>
                    {['name', 'position', 'department', 'readiness', 'performance', 'riskOfLoss', 'impactOfLoss', 'isCriticalRole'].map((key) => (
                      <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort(key)}>
                        {key === 'isCriticalRole' ? 'Critical' : key === 'riskOfLoss' ? 'Risk' : key === 'impactOfLoss' ? 'Impact' : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        {getSortIndicator(key)}
                      </th>))}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">{sortedEmployees.map((emp) => ( <tr key={emp.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full text-lg font-semibold">{emp.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</div>
                          <div className="ml-4"><div className="text-sm font-medium text-gray-900">{emp.name}</div><div className="text-xs text-gray-500">{emp.email}</div></div>
                      </div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{emp.position}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{emp.department}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getReadinessColor(emp.readiness)}`}>{emp.readiness}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><div className="flex items-center space-x-1">{getPerformanceIndicator(emp.performance)}<span>{emp.performance}</span></div></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`font-semibold ${emp.riskOfLoss === 'High' ? 'risk-high' : emp.riskOfLoss === 'Medium' ? 'risk-medium' : 'risk-low'}`}>{emp.riskOfLoss}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`font-semibold ${emp.impactOfLoss === 'High' ? 'impact-high' : emp.impactOfLoss === 'Medium' ? 'impact-medium' : 'impact-low'}`}>{emp.impactOfLoss}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.isCriticalRole ? <ShieldAlert className="w-5 h-5 text-red-500" title="Critical Role"/> : <span className="text-gray-400">-</span>}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onClick={() => handleSelectEmployee(emp)} className="text-indigo-600 hover:text-indigo-900 transition duration-150" title="View Details"><Users size={18} /></button>
                        <button onClick={() => handleEditEmployee(emp)} className="text-yellow-500 hover:text-yellow-700 transition duration-150" title="Edit Employee"><Edit3 size={18} /></button>
                        <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-500 hover:text-red-700 transition duration-150" title="Delete Employee"><Trash2 size={18} /></button>
                      </td></tr>))}</tbody>
              </table>) : ( <div className="text-center py-12"><Search size={48} className="mx-auto text-gray-400" /><p className="mt-4 text-lg text-gray-600">No employees found.</p><p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p></div> )}
        </div>)}

        {/* Employee Detail Page Component */}
        {view === 'detail' && selectedEmployee && (
          <EmployeeDetailPage 
            employee={selectedEmployee} 
            onEditEmployee={handleEditEmployee}
            allEmployees={employees}
            talentPools={talentPools}
          />
        )}

        {view === 'perfPotentialNineBox' && (
          <NineBoxGrid 
            title="9-Box Grid: Performance vs Potential"
            employees={employees} 
            onSelectEmployee={handleSelectEmployee}
            xAxisKey="performance"
            yAxisKey="potential"
            mapXToGridFunc={mapPerformanceToGrid}
            mapYToGridFunc={mapPotentialToGrid}
            gridCellLabels={perfPotentialGridCellLabels}
            xAxisLabels={perfPotentialXAxisLabels}
            yAxisLabels={perfPotentialYAxisLabels}
          />
        )}
        {view === 'riskImpactNineBox' && (
          <NineBoxGrid 
            title="9-Box Grid: Risk of Loss vs Impact of Loss"
            employees={employees} 
            onSelectEmployee={handleSelectEmployee}
            xAxisKey="riskOfLoss"
            yAxisKey="impactOfLoss"
            mapXToGridFunc={mapRiskToGrid}
            mapYToGridFunc={mapImpactToGrid}
            gridCellLabels={riskImpactGridCellLabels}
            xAxisLabels={riskImpactXAxisLabels}
            yAxisLabels={riskImpactYAxisLabels}
          />
        )}

        {view === 'talentPools' && ( <TalentPoolsView pools={talentPools} onEdit={handleEditTalentPool} onDelete={handleDeleteTalentPool} onSelectEmployee={handleSelectEmployee} /> )}
      </main>

      {view === 'form' && (
        <EmployeeFormPage 
          onClose={() => { setView(employeeToEdit && selectedEmployee && selectedEmployee.id === employeeToEdit.id ? 'detail' : 'list'); setEmployeeToEdit(null); }} 
          onSave={handleSaveEmployee} 
          employee={employeeToEdit} 
          allEmployees={employees} 
        />
      )}
      <TalentPoolFormModal isOpen={isTalentPoolModalOpen && view === 'talentPoolForm'} onClose={() => { setIsTalentPoolModalOpen(false); setView('talentPools'); setTalentPoolToEdit(null);}} onSave={handleSaveTalentPool} poolToEdit={talentPoolToEdit} allEmployees={employees} />

      {/* Footer is in succession-planning.html */}
      {/* Hidden Tailwind classes for dynamic generation are in succession-planning.css */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('succession-planning-root'));
