document.addEventListener('DOMContentLoaded', () => {
    // --- SHARED UTILITY FUNCTIONS & CONSTANTS ---
    const PROFICIENCY_LEVELS = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    const getProficiencyDisplay = (level) => Object.keys(PROFICIENCY_LEVELS).find(key => PROFICIENCY_LEVELS[key] === level) || 'N/A';
    const getProficiencyColor = (level) => {
        if (level === 4) return 'bg-purple-500';
        if (level === 3) return 'bg-blue-500';
        if (level === 2) return 'bg-sky-500';
        if (level === 1) return 'bg-teal-500';
        return 'bg-gray-300';
    };

    const PERSONAS = {
        LEARNER: 'Learner',
        RECRUITER: 'Recruiter',
        ADMIN: 'Admin',
    };

    // --- MOCK DATA (SHARED & SPECIFIC) ---
    const mockLearnerSkills = [
        { name: 'Aviation Safety Management', proficiency: 'Advanced', level: 3, lastAssessed: '2024-05-15', source: 'Certification' },
        { name: 'Customer Service Excellence', proficiency: 'Intermediate', level: 2, lastAssessed: '2024-04-20', source: 'Self-Assessed' },
        { name: 'Team Leadership', proficiency: 'Expert', level: 4, lastAssessed: '2024-06-01', source: 'Manager Assessment' },
        { name: 'Flight Operations Systems', proficiency: 'Beginner', level: 1, lastAssessed: '2024-03-10', source: 'Internal Training' },
        { name: 'Data Analysis (Airline Metrics)', proficiency: 'Intermediate', level: 2, lastAssessed: '2024-05-01', source: 'Project Completion' },
        { name: 'Java', proficiency: 'Advanced', level: 3, lastAssessed: '2024-05-01', source: 'Project Completion' }, 
        { name: 'Spring Boot', proficiency: 'Intermediate', level: 2, lastAssessed: '2024-05-01', source: 'Self-Assessed' }, 
        { name: 'Problem Solving', proficiency: 'Expert', level: 4, lastAssessed: '2024-06-01', source: 'Manager Assessment' },
        { name: 'Communication', proficiency: 'Advanced', level: 3, lastAssessed: '2024-06-01', source: 'Peer Review' },
        { name: 'SQL Databases', proficiency: 'Beginner', level: 1, lastAssessed: '2024-03-10', source: 'Internal Training' },
    ];

    const mockJobPostingForLearner = {
        id: 'JOB-AKARA-FOC-001',
        title: 'Senior Flight Operations Coordinator',
        company: 'Akara Airlines',
        department: 'Flight Operations Center',
        location: 'Atlanta, GA (Hub)',
        employmentType: 'Full-time',
        postedDate: '2024-05-20',
        salaryRange: '$75,000 - $95,000 USD',
        teamSize: '8-10 Coordinators',
        description: 'Akara Airlines is seeking an experienced Senior Flight Operations Coordinator...',
        requiredSkills: [
            { name: 'Aviation Safety Management', proficiency: 'Expert', level: 4, importance: 'Critical', description: 'In-depth knowledge...' },
            { name: 'Flight Operations Systems', proficiency: 'Advanced', level: 3, importance: 'Critical', description: 'Proficiency with airline software.' },
            { name: 'Problem Solving', proficiency: 'Expert', level: 4, importance: 'High', description: 'Ability to resolve issues.' },
            { name: 'Communication', proficiency: 'Advanced', level: 3, importance: 'High', description: 'Clear communication skills.' },
            { name: 'Team Leadership', proficiency: 'Advanced', level: 3, importance: 'Medium', description: 'Experience guiding staff.' },
        ],
        recommendedCourses: [
            { id: 'AKR-ADV-OPS-01', title: 'Advanced Flight Ops Management', skillGap: 'Flight Operations Systems', duration: '6 Weeks', difficulty: 'Advanced', rating: 4.7 },
            { id: 'AKR-LEAD-SAFE-01', title: 'Safety Leadership in Aviation', skillGap: 'Aviation Safety Management', duration: '4 Weeks', difficulty: 'Advanced', rating: 4.9 },
        ]
    };

    const mockJobPostingForDev = { 
        id: 'JOB-AKARA-ENG-002',
        title: 'Senior Software Engineer, Backend',
        company: 'Akara Airlines',
        department: 'Engineering',
        location: 'Atlanta, GA, US',
        employmentType: 'Full-time',
        postedDate: '2024-06-01',
        salaryRange: '$120,000 - $160,000 USD',
        teamSize: '5-8 Engineers',
        description: 'Join our dynamic engineering team to build and scale critical backend systems...',
        requiredSkills: [
            { name: 'Java', proficiency: 'Expert', level: 4, importance: 'Critical', description: 'Deep expertise in Java...' }, 
            { name: 'Spring Boot', proficiency: 'Expert', level: 4, importance: 'Critical', description: 'Extensive experience...' }, 
            { name: 'Microservices Architecture', proficiency: 'Advanced', level: 3, importance: 'High', description: 'Strong understanding...' }, 
            { name: 'Cloud Platforms (AWS/Azure)', proficiency: 'Advanced', level: 3, importance: 'High', description: 'Experience with AWS/Azure.' }, 
            { name: 'SQL Databases', proficiency: 'Intermediate', level: 2, importance: 'Medium', description: 'Proficiency in SQL...' }, 
            { name: 'NoSQL Databases', proficiency: 'Intermediate', level: 2, importance: 'Medium', description: 'Experience with NoSQL...' }, 
            { name: 'Problem Solving', proficiency: 'Expert', level: 4, importance: 'Critical', description: 'Excellent analytical skills.' },
            { name: 'Communication', proficiency: 'Advanced', level: 3, importance: 'High', description: 'Clear technical communication.' }
        ],
        recommendedCourses: [
            { id: 'AKR-JAVA-MASTER', title: 'Java Masterclass for Enterprise Systems', skillGap: 'Java', duration: '8 Weeks', difficulty: 'Expert', rating: 4.8 },
            { id: 'AKR-SPRING-EXPERT', title: 'Spring Boot Expert Development', skillGap: 'Spring Boot', duration: '6 Weeks', difficulty: 'Expert', rating: 4.7 },
            { id: 'AKR-MICROSERVICES', title: 'Designing Microservices Architectures', skillGap: 'Microservices Architecture', duration: '5 Weeks', difficulty: 'Advanced', rating: 4.6 },
            { id: 'AKR-CLOUD-ARCH', title: 'Cloud Native Architecture on AWS', skillGap: 'Cloud Platforms (AWS/Azure)', duration: '6 Weeks', difficulty: 'Advanced', rating: 4.7 },
            { id: 'AKR-NOSQL-DEEP', title: 'NoSQL Deep Dive (MongoDB & Cassandra)', skillGap: 'NoSQL Databases', duration: '4 Weeks', difficulty: 'Intermediate', rating: 4.5 },
            { id: 'AKR-SQL-ADV', title: 'Advanced SQL for Developers', skillGap: 'SQL Databases', duration: '3 Weeks', difficulty: 'Intermediate', rating: 4.4 },
        ]
    };

    const allMockJobs = [mockJobPostingForLearner, mockJobPostingForDev];
    const defaultJobForLearnerView = mockJobPostingForDev;

    // --- MOCK DATA FOR EMPLOYEE-ROLE COMPARISON ---
    const mockEmployees = [
        {
            id: 'EMP001',
            name: 'Alex Johnson',
            currentRole: 'Software Engineer II',
            skills: [
                { name: 'Java', level: 3, proficiency: 'Advanced' },
                { name: 'Spring Boot', level: 2, proficiency: 'Intermediate' },
                { name: 'SQL Databases', level: 2, proficiency: 'Intermediate' },
                { name: 'Agile Methodologies', level: 3, proficiency: 'Advanced' },
                { name: 'Problem Solving', level: 4, proficiency: 'Expert' },
            ]
        },
        {
            id: 'EMP002',
            name: 'Maria Garcia',
            currentRole: 'Flight Attendant',
            skills: [
                { name: 'Customer Service Excellence', level: 4, proficiency: 'Expert' },
                { name: 'Emergency Response Training', level: 3, proficiency: 'Advanced' },
                { name: 'Aviation Safety Procedures', level: 3, proficiency: 'Advanced' },
                { name: 'Communication', level: 4, proficiency: 'Expert' },
                { name: 'Teamwork', level: 3, proficiency: 'Advanced' },
            ]
        },
        {
            id: 'EMP003',
            name: 'David Lee',
            currentRole: 'Data Analyst',
            skills: [
                { name: 'Data Analysis (Airline Metrics)', level: 3, proficiency: 'Advanced' },
                { name: 'SQL Databases', level: 4, proficiency: 'Expert' },
                { name: 'Python', level: 2, proficiency: 'Intermediate' },
                { name: 'Tableau', level: 3, proficiency: 'Advanced' },
                { name: 'Statistical Analysis', level: 2, proficiency: 'Intermediate' },
            ]
        }
    ];

    const mockRoles = [
        {
            id: 'ROLE001',
            title: 'Senior Software Engineer, Backend',
            department: 'Engineering',
            requiredSkills: [ // Using the structure from mockJobPostingForDev
                { name: 'Java', level: 4, importance: 'Critical' },
                { name: 'Spring Boot', level: 4, importance: 'Critical' },
                { name: 'Microservices Architecture', level: 3, importance: 'High' },
                { name: 'Cloud Platforms (AWS/Azure)', level: 3, importance: 'High' },
                { name: 'SQL Databases', level: 2, importance: 'Medium' },
                { name: 'NoSQL Databases', level: 2, importance: 'Medium' },
                { name: 'Problem Solving', level: 4, importance: 'Critical' },
                { name: 'Communication', level: 3, importance: 'High' }
            ]
        },
        {
            id: 'ROLE002',
            title: 'Lead Cabin Crew Trainer',
            department: 'In-Flight Services Training',
            requiredSkills: [
                { name: 'Aviation Safety Procedures', level: 4, importance: 'Critical' },
                { name: 'Emergency Response Training', level: 4, importance: 'Critical' },
                { name: 'Instructional Design', level: 3, importance: 'High' },
                { name: 'Presentation Skills', level: 4, importance: 'High' },
                { name: 'FAA Regulations (Cabin Crew)', level: 3, importance: 'Medium' },
                { name: 'Customer Service Excellence', level: 3, importance: 'Medium' },
                { name: 'Team Leadership', level: 3, importance: 'High' }
            ]
        },
        {
            id: 'ROLE003',
            title: 'Senior Flight Operations Coordinator',
            department: 'Flight Operations Center',
            requiredSkills: [ // Using structure from mockJobPostingForLearner
                { name: 'Aviation Safety Management', level: 4, importance: 'Critical' },
                { name: 'Flight Operations Systems', level: 3, importance: 'Critical' },
                { name: 'Problem Solving', level: 4, importance: 'High' },
                { name: 'Communication', level: 3, importance: 'High' },
                { name: 'Team Leadership', level: 3, importance: 'Medium' },
            ]
        }
    ];
    // End of new mock data

    const mockJobForRecruiter = { // This might be deprecated or used differently if RecruiterView changes focus
        title: 'Lead Cabin Crew Trainer',
        department: 'In-Flight Services Training',
        location: 'Atlanta, GA (HQ)',
        description: `Akara Airlines is seeking an experienced Lead Cabin Crew Trainer...`,
        typicalSkills: [ // This structure is simpler, ensure consistency if used for comparison
            { name: 'Aviation Safety Procedures', proficiency: 4 }, { name: 'Emergency Response Training', proficiency: 4 },
            { name: 'Instructional Design', proficiency: 3 }, { name: 'Presentation Skills', proficiency: 4 },
            { name: 'FAA Regulations (Cabin Crew)', proficiency: 3 }, { name: 'Customer Service Excellence', proficiency: 3 },
            { name: 'Team Leadership', proficiency: 3 }
        ]
    };

    const lucideToFontAwesomeMap = { CheckCircle: 'fas fa-check-circle', AlertTriangle: 'fas fa-exclamation-triangle', XCircle: 'fas fa-times-circle', BookOpen: 'fas fa-book-open', Star: 'fas fa-star', Briefcase: 'fas fa-briefcase', MapPin: 'fas fa-map-marker-alt', DollarSign: 'fas fa-dollar-sign', Users: 'fas fa-users', CalendarDays: 'fas fa-calendar-alt', Building: 'fas fa-building', Clock: 'fas fa-clock', BarChart3: 'fas fa-chart-bar', TrendingUp: 'fas fa-chart-line', ChevronDown: 'fas fa-chevron-down', FileText: 'fas fa-file-alt', UploadCloud: 'fas fa-cloud-upload-alt', Brain: 'fas fa-brain', Zap: 'fas fa-bolt', ListFilter: 'fas fa-filter', PlusCircle: 'fas fa-plus-circle', Trash2: 'fas fa-trash-alt', Check: 'fas fa-check', Cloud: 'fas fa-cloud', RefreshCw: 'fas fa-sync-alt', Settings: 'fas fa-cog', };
    const createIcon = (iconName, { size = 16, className = "" } = {}) => { const NormalizedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1); const faClass = lucideToFontAwesomeMap[NormalizedIconName]; if (faClass) return `<i class="${faClass} ${className}"></i>`; return `<span class="${className} fallback-icon-text">[${iconName}]</span>`; };
    const ChevronDownIcon = (props = {}) => createIcon('ChevronDown', props);
    const LoadingSpinner = ({ message = "Loading..."}) => `<div class="flex flex-col justify-center items-center min-h-[300px] text-gray-700"><svg class="animate-spin h-10 w-10 text-sky-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p class="text-xl font-semibold">${message}</p></div>`;
    
    const CustomDropdown = ({ id, options, selected, onSelect, label }) => {
        const dropdownId = `dropdown-${id}`; const buttonId = `dropdown-button-${id}`;
        const closeAllDropdowns = () => document.querySelectorAll('.custom-dropdown-menu').forEach(menu => { if (menu.id !== `${dropdownId}-menu`) menu.classList.add('hidden'); });
        const toggleDropdown = (event) => { event.stopPropagation(); closeAllDropdowns(); document.getElementById(`${dropdownId}-menu`)?.classList.toggle('hidden'); };
        const handleSelect = (option, event) => { event.preventDefault(); onSelect(option); document.getElementById(`${dropdownId}-menu`)?.classList.add('hidden'); };
        const attachDropdownListeners = () => { const button = document.getElementById(buttonId); if (button) { button.removeEventListener('click', toggleDropdown); button.addEventListener('click', toggleDropdown); } options.forEach(option => { const optionEl = document.getElementById(`${dropdownId}-option-${option.replace(/\s+/g, '-')}`); if (optionEl) { optionEl.removeEventListener('click', (e) => handleSelect(option, e)); optionEl.addEventListener('click', (e) => handleSelect(option, e)); } }); };
        if (!window.customDropdownGlobalListenerAttached) { document.addEventListener('click', () => document.querySelectorAll('.custom-dropdown-menu').forEach(menu => menu.classList.add('hidden'))); window.customDropdownGlobalListenerAttached = true; }
        return { html: `<div class="relative inline-block text-left custom-dropdown" id="${dropdownId}"><div><button type="button" id="${buttonId}" class="persona-selector-button inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-sky-500" aria-haspopup="true" aria-expanded="true">${label}: ${selected} ${createIcon('ChevronDown', { size: 20, className: "-mr-1 ml-2 h-5 w-5" })}</button></div><div id="${dropdownId}-menu" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 hidden custom-dropdown-menu"><div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="${buttonId}">${options.map(option => `<a href="#" id="${dropdownId}-option-${option.replace(/\s+/g, '-')}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">${option}</a>`).join('')}</div></div></div>`, attachListeners: attachDropdownListeners };
    };

    const SkillProficiencyBar = ({ currentLevel, requiredLevel, maxLevel = 4 }) => { const currentPercentage = (currentLevel / maxLevel) * 100; const requiredPercentage = (requiredLevel / maxLevel) * 100; return `<div class="w-full mt-1"><div class="text-xs text-gray-500 mb-0.5 flex justify-between"><span>Your Level: ${getProficiencyDisplay(currentLevel)}</span><span>Required: ${getProficiencyDisplay(requiredLevel)}</span></div><div class="h-2.5 w-full bg-gray-200 rounded-full relative"><div class="absolute top-0 left-0 h-2.5 bg-gray-300 rounded-full" style="width: ${requiredPercentage}%;"></div><div class="absolute top-0 left-0 h-2.5 rounded-full ${getProficiencyColor(currentLevel)}" style="width: ${currentPercentage}%;"></div></div></div>`; };
    const LearnerSkillMatchCard = ({ jobSkill, learnerSkill }) => { const learnerProficiencyLevel = learnerSkill ? learnerSkill.level : 0; let statusText, statusColor, IconName; if (learnerProficiencyLevel >= jobSkill.level) { statusText = 'Proficiency Matched'; statusColor = 'text-green-600 border-green-500'; IconName = 'CheckCircle'; } else if (learnerProficiencyLevel > 0) { statusText = 'Improvement Needed'; statusColor = 'text-yellow-600 border-yellow-500'; IconName = 'AlertTriangle'; } else { statusText = 'Skill Gap'; statusColor = 'text-red-600 border-red-500'; IconName = 'XCircle'; } const importanceColors = { 'Critical': 'bg-red-100 text-red-700 border border-red-300', 'High': 'bg-orange-100 text-orange-700 border border-orange-300', 'Medium': 'bg-yellow-100 text-yellow-700 border border-yellow-300', }; return `<div class="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col justify-between"><div><div class="flex justify-between items-start mb-2"><h3 class="text-xl font-semibold text-gray-800">${jobSkill.name}</h3><span class="px-2.5 py-1 text-xs font-semibold rounded-md ${importanceColors[jobSkill.importance] || 'bg-gray-100 text-gray-700'}">${jobSkill.importance}</span></div><p class="text-xs text-gray-500 mb-3 italic">${jobSkill.description}</p>${SkillProficiencyBar({ currentLevel: learnerProficiencyLevel, requiredLevel: jobSkill.level })}${learnerSkill ? `<div class="mt-2 text-xs text-gray-500"><p>Your Last Assessment: ${learnerSkill.lastAssessed} (${learnerSkill.source})</p></div>` : ''}</div><div class="mt-4 pt-3 border-t border-gray-200 flex items-center ${statusColor}">${createIcon(IconName, { size: 18, className: "mr-2" })}<span class="font-semibold text-sm">${statusText}</span></div></div>`; };
    const LearnerRecommendedCourseCard = ({ course }) => `<div class="bg-sky-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"><div class="mb-3 sm:mb-0 sm:mr-4"><h3 class="text-md font-semibold text-sky-700">${course.title}</h3><p class="text-xs text-gray-600 mt-1">Addresses skill: <span class="font-medium">${course.skillGap}</span></p><div class="flex space-x-3 mt-1.5 text-xs text-sky-600"><span>${createIcon('Clock', { size: 12, className: "inline mr-1" })}${course.duration}</span><span>${createIcon('BarChart3', { size: 12, className: "inline mr-1" })}${course.difficulty}</span><span>${createIcon('Star', { size: 12, className: "inline mr-1 text-yellow-500" })}${course.rating}/5.0</span></div></div><button onclick="alert('Navigate to Percipio course: ${course.title.replace(/'/g, "\\'")}')" class="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center whitespace-nowrap">${createIcon('BookOpen', { size: 16, className: "mr-2" })} View Details</button></div>`;
    
    const LearnerJobView = () => {
        let state = {
            job: null, 
            learnerSkills: mockLearnerSkills, 
            hasProcessedResume: true,    
            skillMatches: [], 
            matchSummary: { matched: 0, partial: 0, gaps: 0, total: 0, percentage: 0 },
            isLoading: true, 
            resumeFile: null, 
            isProcessingResume: false,
        };

        const setState = (newState) => { state = { ...state, ...newState }; render(); };
        
        const calculateSkillAnalysis = (jobRequiredSkills, currentLearnerSkills) => {
            if (!jobRequiredSkills || !Array.isArray(jobRequiredSkills)) {
                return { skillMatches: [], matchSummary: { matched: 0, partial: 0, gaps: 0, total: 0, percentage: 0 } };
            }
            const skillsToAnalyze = currentLearnerSkills || [];
            const matches = jobRequiredSkills.map(reqSkill => {
                const learnerSkill = skillsToAnalyze.find(ls => ls && reqSkill && ls.name && reqSkill.name && ls.name.toLowerCase() === reqSkill.name.toLowerCase());
                return { jobSkill: reqSkill, learnerSkill: learnerSkill || null };
            });
            let matchedCount = 0, partialCount = 0, gapCount = 0;
            matches.forEach(match => {
                const learnerLevel = match.learnerSkill ? match.learnerSkill.level : 0;
                if (match.jobSkill && typeof match.jobSkill.level !== 'undefined') {
                    if (learnerLevel >= match.jobSkill.level) matchedCount++;
                    else if (learnerLevel > 0) partialCount++;
                    else gapCount++;
                } else {
                    gapCount++;
                }
            });
            const totalSkills = jobRequiredSkills.length;
            return {
                skillMatches: matches,
                matchSummary: {
                    matched: matchedCount, partial: partialCount, gaps: gapCount, total: totalSkills,
                    percentage: totalSkills > 0 ? Math.round(((matchedCount + partialCount * 0.5) / totalSkills) * 100) : 0,
                }
            };
        };

        const handleResumeFileChange = (event) => { if (event.target.files[0]) setState({ resumeFile: event.target.files[0] }); };
        
        const processResume = () => {
            if (!state.resumeFile) { alert("Please select a resume file to re-analyze."); return; }
            setState({ isProcessingResume: true, isLoading: true });
            setTimeout(() => {
                const newLearnerSkills = mockLearnerSkills; 
                const analysis = calculateSkillAnalysis(state.job?.requiredSkills, newLearnerSkills);
                setState({ learnerSkills: newLearnerSkills, hasProcessedResume: true, isProcessingResume: false, isLoading: false, ...analysis });
            }, 1500);
        };

        const fetchData = () => {
            setState({ isLoading: true });
            const params = new URLSearchParams(window.location.search);
            const jobTitleFromUrl = params.get('jobTitle') ? decodeURIComponent(params.get('jobTitle')) : null;
            setTimeout(() => {
                let selectedJob = allMockJobs.find(job => job.title.toLowerCase() === jobTitleFromUrl?.toLowerCase()) || defaultJobForLearnerView;
                const analysis = calculateSkillAnalysis(selectedJob.requiredSkills, state.learnerSkills);
                setState({ job: selectedJob, isLoading: false, ...analysis });
            }, 500);
        };

        const attachEventListeners = () => {
            document.querySelector('#job-description-details')?.addEventListener('toggle', function() { this.classList.toggle('open', this.open); });
            document.getElementById('resumeUploadInput')?.addEventListener('change', handleResumeFileChange);
            document.getElementById('analyzeResumeBtn')?.addEventListener('click', processResume);
        };
        
        const render = () => {
            const container = document.getElementById('view-container');
            if (!container) return;
            if (state.isLoading) { container.innerHTML = LoadingSpinner({ message: state.isProcessingResume ? "Analyzing Your Resume..." : "Loading Job Details..." }); return; }
            if (!state.job) { container.innerHTML = `<div class="p-8 text-center text-red-500">Failed to load job details.</div>`; return; }

            const resumeUpdateSectionHtml = `
                <section class="p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-200 mt-8">
                    <h2 class="text-xl font-semibold text-gray-700 mb-3">Update Skill Analysis</h2>
                    <p class="text-sm text-gray-600 mb-4">To re-analyze with a different resume, please upload it below.</p>
                    <div class="max-w-md"><input type="file" id="resumeUploadInput" accept=".pdf,.doc,.docx,.txt" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 mb-3"/><button id="analyzeResumeBtn" class="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center text-sm">${createIcon('RefreshCw', {size: 16, className: "mr-2"})} Re-analyze with New Resume</button>${state.resumeFile ? `<p class="mt-2 text-xs text-gray-500">Selected: ${state.resumeFile.name}</p>` : ''}</div></section>`;
            
            const relevantRecommendedCourses = state.job.recommendedCourses?.filter(course => 
                state.skillMatches.some(match => (match.learnerSkill ? match.learnerSkill.level : 0) < match.jobSkill.level && match.jobSkill.name === course.skillGap)
            ) || [];
            
            const summaryStats = [ { iconName: 'CheckCircle', count: state.matchSummary.matched, label: 'Skills Matched', color: 'green' }, { iconName: 'AlertTriangle', count: state.matchSummary.partial, label: 'Needs Improvement', color: 'yellow' }, { iconName: 'XCircle', count: state.matchSummary.gaps, label: 'Skill Gaps', color: 'red' }, { iconName: 'TrendingUp', count: `${state.matchSummary.percentage}%`, label: 'Overall Alignment', color: 'sky' }];

            container.innerHTML = `
                <div class="space-y-8">
                    <header class="p-6 md:p-8 bg-white rounded-xl shadow-xl border border-gray-200"><div class="flex flex-col md:flex-row justify-between items-start mb-4"><div><div class="flex items-center text-sky-600 mb-1">${createIcon('Building', {size: 18, className: "mr-2"})} <span class="text-md font-semibold">${state.job.company || 'N/A'}</span></div><h1 class="text-3xl md:text-4xl font-bold text-gray-800">${state.job.title || 'Job Title N/A'}</h1><div class="flex flex-wrap items-center text-sm text-gray-500 mt-2 gap-x-4 gap-y-1"><span class="flex items-center">${createIcon('Briefcase', {size: 14, className: "mr-1.5"})} ${state.job.department || 'N/A'}</span><span class="flex items-center">${createIcon('MapPin', {size: 14, className: "mr-1.5"})} ${state.job.location || 'N/A'}</span><span class="flex items-center">${createIcon('CalendarDays', {size: 14, className: "mr-1.5"})} Posted: ${state.job.postedDate || 'N/A'}</span></div></div><div class="mt-4 md:mt-0 text-right md:min-w-[200px]"><div class="text-xl font-semibold text-green-600 flex items-center justify-end">${createIcon('DollarSign', {size:20, className: "mr-1.5"})} ${state.job.salaryRange || 'N/A'}</div><div class="text-sm text-gray-500 flex items-center justify-end mt-1">${createIcon('Users', {size: 16, className: "mr-1.5"})} Team: ${state.job.teamSize || 'N/A'}</div></div></div><details id="job-description-details" class="mt-4 group"><summary class="text-sm font-medium text-sky-600 hover:text-sky-700 cursor-pointer list-none flex items-center"> View Full Job Description ${ChevronDownIcon({size: 16, className:"ml-1 group-open:rotate-180 transition-transform"})}</summary><div class="mt-3 pt-3 border-t border-gray-200"><p class="text-gray-700 leading-relaxed text-sm whitespace-pre-line">${state.job.description || 'No description available.'}</p></div></details></header>
                    <section class="p-6 bg-white rounded-xl shadow-xl border border-gray-200"><h2 class="text-2xl font-semibold text-gray-800 mb-1">Your Skill Alignment</h2><p class="text-sm text-gray-500 mb-5">Overview of how your skills match the job requirements.</p><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-center">${summaryStats.map(item => `<div class="p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-200 shadow-sm">${createIcon(item.iconName, {size: 28, className: `mx-auto mb-2 text-${item.color}-500`})}<p class="text-3xl font-bold text-${item.color}-600">${item.count}</p><p class="text-xs font-medium text-${item.color}-700">${item.label}</p></div>`).join('')}</div><div class="mt-6"><div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden"><div class="bg-gradient-to-r from-sky-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out" style="width: ${state.matchSummary.percentage}%;"></div></div><p class="text-center mt-2 text-xs text-gray-600">Your profile shows a ${state.matchSummary.percentage}% alignment with this role's key skill requirements.</p></div></section>
                    <section><h2 class="text-2xl font-semibold text-gray-800 mb-1 px-1">Detailed Skill Analysis</h2><p class="text-sm text-gray-500 mb-5 px-1">In-depth look at each required skill and your current proficiency.</p><div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">${(state.skillMatches && state.skillMatches.length > 0) ? state.skillMatches.map(match => LearnerSkillMatchCard(match)).join('') : '<p class="col-span-full text-center text-gray-500">No skills to display for analysis.</p>'}</div></section>
                    ${relevantRecommendedCourses.length > 0 ? `<section class="p-6 bg-white rounded-xl shadow-xl border border-gray-200"><h2 class="text-2xl font-semibold text-gray-800 mb-1">Personalized Learning Path</h2><p class="text-sm text-gray-500 mb-5">Suggested courses from Percipio to bridge your skill gaps for this role.</p><div class="space-y-4">${relevantRecommendedCourses.map(course => LearnerRecommendedCourseCard({ course })).join('')}</div></section>` : ''}
                    ${resumeUpdateSectionHtml}
                </div>`;
            attachEventListeners();
        };
        fetchData(); return { render };
    };

    // --- RECRUITER VIEW COMPONENTS (ENHANCED FOR EMPLOYEE-ROLE MATCHING) ---
    const RecruiterView = () => {
        let state = {
            // Original state for job posting (can be kept or refactored if this view solely focuses on matching)
            // jobDetails: { title: '', department: '', location: '', description: '' },
            // suggestedSkills: [],
            // acceptedSkills: [],
            // isAnalyzing: false,
            // isAddingManualSkill: false,
            // manualSkillName: "",

            // New state for employee-role matching
            selectedEmployeeId: null,
            selectedRoleId: null,
            employees: mockEmployees, // Load actual data in a real app
            roles: mockRoles,         // Load actual data in a real app
            comparisonResult: null,   // { employeeSkills: [], roleSkills: [], commonSkills: [], employeeOnlySkills: [], roleOnlySkills: [] }
            matchScore: null,         // Percentage
            gapAnalysis: null,        // { missing: [], lowerProficiency: [], exceedsProficiency: [] }
            actionableInsights: null, // { development: [], training: [], alternativeRoles: [] }
            isLoadingComparison: false
        };
        // let analysisTimeout = null; // For job description analysis, might not be needed if focus shifts

        const setState = (newState) => { state = { ...state, ...newState }; render(); };

        const populateDropdowns = () => {
            const employeeSelect = document.getElementById('employee-select');
            const roleSelect = document.getElementById('role-select');

            if (employeeSelect) {
                employeeSelect.innerHTML = '<option value="">Select an Employee</option>';
                state.employees.forEach(emp => {
                    const option = document.createElement('option');
                    option.value = emp.id;
                    option.textContent = `${emp.name} (${emp.currentRole})`;
                    employeeSelect.appendChild(option);
                });
                employeeSelect.value = state.selectedEmployeeId || "";
            }

            if (roleSelect) {
                roleSelect.innerHTML = '<option value="">Select a Job Role</option>';
                state.roles.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.id;
                    option.textContent = `${role.title} (${role.department})`;
                    roleSelect.appendChild(option);
                });
                roleSelect.value = state.selectedRoleId || "";
            }
        };
        
        const handleEmployeeSelectChange = (event) => {
            setState({ selectedEmployeeId: event.target.value, comparisonResult: null, matchScore: null, gapAnalysis: null, actionableInsights: null });
            hideComparisonSections();
        };

        const handleRoleSelectChange = (event) => {
            setState({ selectedRoleId: event.target.value, comparisonResult: null, matchScore: null, gapAnalysis: null, actionableInsights: null });
            hideComparisonSections();
        };

        const hideComparisonSections = () => {
            document.getElementById('skill-comparison-section')?.classList.add('hidden');
            document.getElementById('gap-analysis-section')?.classList.add('hidden');
            document.getElementById('actionable-insights-section')?.classList.add('hidden');
            document.getElementById('match-score').textContent = 'N/A';
        };
        
        const showComparisonSections = () => {
            document.getElementById('skill-comparison-section')?.classList.remove('hidden');
            document.getElementById('gap-analysis-section')?.classList.remove('hidden');
            document.getElementById('actionable-insights-section')?.classList.remove('hidden');
        };

        const performSkillComparison = () => {
            if (!state.selectedEmployeeId || !state.selectedRoleId) {
                alert("Please select both an employee and a job role.");
                return;
            }
            setState({ isLoadingComparison: true });
            // Simulate API call / data processing
            setTimeout(() => {
                const employee = state.employees.find(e => e.id === state.selectedEmployeeId);
                const role = state.roles.find(r => r.id === state.selectedRoleId);

                if (!employee || !role) {
                    alert("Selected employee or role data not found.");
                    setState({ isLoadingComparison: false });
                    return;
                }

                const employeeSkills = employee.skills || [];
                const roleSkills = role.requiredSkills || [];

                // 1. Interactive Skill Comparison Data
                const comparisonResult = {
                    employeeSkills: employeeSkills.map(s => ({ ...s, source: 'employee' })),
                    roleSkills: roleSkills.map(s => ({ ...s, source: 'role' })),
                };
                
                // 2. Match Scoring System
                let totalRoleSkillsValue = 0;
                let achievedValue = 0;
                const uniqueRoleSkillNames = [...new Set(roleSkills.map(rs => rs.name.toLowerCase()))];

                uniqueRoleSkillNames.forEach(roleSkillName => {
                    const roleSkill = roleSkills.find(rs => rs.name.toLowerCase() === roleSkillName);
                    if (!roleSkill) return;

                    const roleSkillLevel = roleSkill.level || 0;
                    totalRoleSkillsValue += roleSkillLevel; // Weight by proficiency level

                    const empSkill = employeeSkills.find(es => es.name.toLowerCase() === roleSkillName);
                    if (empSkill) {
                        // Employee has the skill, score based on proficiency match
                        achievedValue += Math.min(empSkill.level || 0, roleSkillLevel);
                    }
                });
                const matchScore = totalRoleSkillsValue > 0 ? Math.round((achievedValue / totalRoleSkillsValue) * 100) : 0;

                // 3. Gap Analysis Visualization Data
                const gapAnalysis = {
                    missing: [],
                    lowerProficiency: [],
                    exceedsProficiency: []
                };

                roleSkills.forEach(rs => {
                    const empSkill = employeeSkills.find(es => es.name.toLowerCase() === rs.name.toLowerCase());
                    if (!empSkill) {
                        gapAnalysis.missing.push({ name: rs.name, requiredLevel: rs.level });
                    } else {
                        if (empSkill.level < rs.level) {
                            gapAnalysis.lowerProficiency.push({ name: rs.name, employeeLevel: empSkill.level, requiredLevel: rs.level });
                        } else if (empSkill.level > rs.level) {
                            gapAnalysis.exceedsProficiency.push({ name: rs.name, employeeLevel: empSkill.level, requiredLevel: rs.level });
                        }
                    }
                });
                
                // 4. Actionable Insights Data (Simplified)
                const actionableInsights = {
                    development: [],
                    training: [],
                    alternativeRoles: [] // Could suggest roles where employee's strong skills are a good fit
                };

                gapAnalysis.missing.forEach(skill => {
                    actionableInsights.development.push(`Develop ${skill.name} (required: ${getProficiencyDisplay(skill.requiredLevel)}).`);
                    actionableInsights.training.push(`Consider training for ${skill.name}.`);
                });
                gapAnalysis.lowerProficiency.forEach(skill => {
                    actionableInsights.development.push(`Improve ${skill.name} from ${getProficiencyDisplay(skill.employeeLevel)} to ${getProficiencyDisplay(skill.requiredLevel)}.`);
                     actionableInsights.training.push(`Advanced training for ${skill.name} might be beneficial.`);
                });
                if (matchScore < 70 && matchScore > 0) {
                     actionableInsights.alternativeRoles.push(`Explore roles that better leverage existing strengths if current gap is too large.`);
                } else if (matchScore === 0 && employeeSkills.length > 0) {
                    actionableInsights.alternativeRoles.push(`This role seems to be a significant mismatch. Consider alternative career paths aligned with current skills.`);
                }


                setState({
                    comparisonResult,
                    matchScore,
                    gapAnalysis,
                    actionableInsights,
                    isLoadingComparison: false
                });
                showComparisonSections();
            }, 1000); // Simulate delay
        };

        const renderSkillItem = (skill, type) => {
            // Type can be 'employee' or 'role'
            // For gap analysis, we need to compare against the other side
            let indicator = '';
            if (type === 'comparison' && state.gapAnalysis) {
                const isMissing = state.gapAnalysis.missing.find(s => s.name === skill.name);
                const isLower = state.gapAnalysis.lowerProficiency.find(s => s.name === skill.name);
                const isExceeds = state.gapAnalysis.exceedsProficiency.find(s => s.name === skill.name);

                if (isMissing) indicator = `<span class="text-xs ml-2 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300">Missing</span>`;
                else if (isLower) indicator = `<span class="text-xs ml-2 px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">Improve</span>`;
                else if (isExceeds) indicator = `<span class="text-xs ml-2 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300">Exceeds</span>`;
                else indicator = `<span class="text-xs ml-2 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300">Matched</span>`;
            }
            
            return `<li class="p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center">
                        <span>${skill.name}</span>
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-700">${getProficiencyDisplay(skill.level)}</span>
                            ${type === 'comparison' ? indicator : ''}
                        </div>
                    </li>`;
        };
        
        const attachEventListeners = () => {
            document.getElementById('employee-select')?.addEventListener('change', handleEmployeeSelectChange);
            document.getElementById('role-select')?.addEventListener('change', handleRoleSelectChange);
            document.getElementById('compare-skills-btn')?.addEventListener('click', performSkillComparison);
        };

        const render = () => {
            const container = document.getElementById('view-container');
            if (!container) { console.error("View container not found for RecruiterView"); return; }

            // --- TEMPORARY DIAGNOSTIC ---
            // container.innerHTML = '<h1 style="color: red; font-size: 24px; text-align: center; padding: 50px;">RECRUITER VIEW RENDER FUNCTION CALLED</h1>'; 
            // If the above line works and shows the message, then the issue is with populating the existing HTML.
            // For now, let's ensure the container is NOT cleared by RecruiterView itself if it was supposed to be pre-filled.
            // The current logic correctly assumes the HTML is pre-filled.
            // --- END TEMPORARY DIAGNOSTIC ---


            // The HTML structure is now in skills_intelligence_analyst.html
            // We just need to ensure dropdowns are populated and data is rendered into the sections.
            populateDropdowns(); // Ensure dropdowns are populated on each render or once initially.

            const selectedEmployeeNameEl = document.getElementById('selected-employee-name');
            const selectedRoleNameEl = document.getElementById('selected-role-name');
            const employeeSkillsListEl = document.getElementById('employee-skills-list');
            const roleRequirementsListEl = document.getElementById('role-requirements-list');
            const matchScoreEl = document.getElementById('match-score');
            const gapAnalysisVizEl = document.getElementById('gap-analysis-visualization');
            const actionableInsightsContentEl = document.getElementById('actionable-insights-content');
            const compareBtn = document.getElementById('compare-skills-btn');

            if(compareBtn) {
                if(state.isLoadingComparison) {
                    compareBtn.disabled = true;
                    compareBtn.innerHTML = `${createIcon('RefreshCw', {className: "animate-spin mr-2"})} Comparing...`;
                } else {
                    compareBtn.disabled = false;
                    compareBtn.innerHTML = 'Compare Skills';
                }
            }


            if (state.selectedEmployeeId && selectedEmployeeNameEl) {
                const emp = state.employees.find(e => e.id === state.selectedEmployeeId);
                selectedEmployeeNameEl.textContent = emp ? emp.name : 'Employee';
            }
            if (state.selectedRoleId && selectedRoleNameEl) {
                const role = state.roles.find(r => r.id === state.selectedRoleId);
                selectedRoleNameEl.textContent = role ? role.title : 'Role';
            }

            if (state.comparisonResult && employeeSkillsListEl && roleRequirementsListEl) {
                employeeSkillsListEl.innerHTML = state.comparisonResult.employeeSkills.map(skill => renderSkillItem(skill, 'comparison')).join('');
                roleRequirementsListEl.innerHTML = state.comparisonResult.roleSkills.map(skill => renderSkillItem(skill, 'comparison')).join('');
            } else if (employeeSkillsListEl && roleRequirementsListEl) {
                 employeeSkillsListEl.innerHTML = '<li class="text-gray-500">Select an employee to see their skills.</li>';
                 roleRequirementsListEl.innerHTML = '<li class="text-gray-500">Select a role to see its requirements.</li>';
            }


            if (matchScoreEl) {
                matchScoreEl.textContent = state.matchScore !== null ? `${state.matchScore}%` : 'N/A';
            }

            if (state.gapAnalysis && gapAnalysisVizEl) {
                gapAnalysisVizEl.innerHTML = ''; // Clear previous
                if (state.gapAnalysis.missing.length === 0 && state.gapAnalysis.lowerProficiency.length === 0 && state.gapAnalysis.exceedsProficiency.length === 0 && state.matchScore === null) {
                     gapAnalysisVizEl.innerHTML = '<p class="text-gray-500">Perform a comparison to see gap analysis.</p>';
                } else {
                    state.gapAnalysis.missing.forEach(s => {
                        gapAnalysisVizEl.innerHTML += `<div class="p-3 bg-red-50 border border-red-200 rounded-md"><span class="font-semibold text-red-700">${createIcon('XCircle', {className: "mr-2"})}Missing Skill:</span> ${s.name} (Required: ${getProficiencyDisplay(s.requiredLevel)})</div>`;
                    });
                    state.gapAnalysis.lowerProficiency.forEach(s => {
                        gapAnalysisVizEl.innerHTML += `<div class="p-3 bg-yellow-50 border border-yellow-200 rounded-md"><span class="font-semibold text-yellow-700">${createIcon('AlertTriangle', {className: "mr-2"})}Lower Proficiency:</span> ${s.name} (Yours: ${getProficiencyDisplay(s.employeeLevel)}, Required: ${getProficiencyDisplay(s.requiredLevel)})</div>`;
                    });
                    state.gapAnalysis.exceedsProficiency.forEach(s => {
                        gapAnalysisVizEl.innerHTML += `<div class="p-3 bg-green-50 border border-green-200 rounded-md"><span class="font-semibold text-green-700">${createIcon('CheckCircle', {className: "mr-2"})}Exceeds Requirement:</span> ${s.name} (Yours: ${getProficiencyDisplay(s.employeeLevel)}, Required: ${getProficiencyDisplay(s.requiredLevel)})</div>`;
                    });
                     if (state.gapAnalysis.missing.length === 0 && state.gapAnalysis.lowerProficiency.length === 0 && state.gapAnalysis.exceedsProficiency.length === 0 && state.matchScore !== null) {
                        gapAnalysisVizEl.innerHTML = '<p class="text-green-600 p-3 bg-green-50 border border-green-200 rounded-md">Excellent match! No significant gaps identified.</p>';
                    }
                }
            } else if (gapAnalysisVizEl) {
                gapAnalysisVizEl.innerHTML = '<p class="text-gray-500">Perform a comparison to see gap analysis.</p>';
            }


            if (state.actionableInsights && actionableInsightsContentEl) {
                actionableInsightsContentEl.innerHTML = ''; // Clear previous
                 if (state.actionableInsights.development.length === 0 && state.actionableInsights.training.length === 0 && state.actionableInsights.alternativeRoles.length === 0 && state.matchScore === null) {
                    actionableInsightsContentEl.innerHTML = '<p class="text-gray-500">Perform a comparison to see insights.</p>';
                } else {
                    if(state.actionableInsights.development.length > 0) {
                        actionableInsightsContentEl.innerHTML += `<h4 class="font-semibold text-gray-700 mt-3 mb-1">Skill Development:</h4><ul class="list-disc list-inside space-y-1">${state.actionableInsights.development.map(item => `<li>${item}</li>`).join('')}</ul>`;
                    }
                    if(state.actionableInsights.training.length > 0) {
                        actionableInsightsContentEl.innerHTML += `<h4 class="font-semibold text-gray-700 mt-3 mb-1">Training Suggestions:</h4><ul class="list-disc list-inside space-y-1">${state.actionableInsights.training.map(item => `<li>${item}</li>`).join('')}</ul>`;
                    }
                    if(state.actionableInsights.alternativeRoles.length > 0) {
                        actionableInsightsContentEl.innerHTML += `<h4 class="font-semibold text-gray-700 mt-3 mb-1">Alternative Considerations:</h4><ul class="list-disc list-inside space-y-1">${state.actionableInsights.alternativeRoles.map(item => `<li>${item}</li>`).join('')}</ul>`;
                    }
                    if (state.actionableInsights.development.length === 0 && state.actionableInsights.training.length === 0 && state.actionableInsights.alternativeRoles.length === 0 && state.matchScore !== null) {
                         actionableInsightsContentEl.innerHTML = '<p class="text-green-600">No specific development actions needed based on this comparison. Employee is a strong fit or exceeds requirements.</p>';
                    }
                }
            } else if (actionableInsightsContentEl) {
                 actionableInsightsContentEl.innerHTML = '<p class="text-gray-500">Perform a comparison to see insights.</p>';
            }
            
            // This needs to be called after the main container's innerHTML is set,
            // if the RecruiterView was responsible for rendering the whole view.
            // Since the HTML is static now, we call it once.
            // attachEventListeners(); // Call this after initial render or if elements are re-created.
        };
        
        // Initial setup
        setTimeout(() => { // Ensure DOM is ready for querySelectors in render
            render(); // Initial render to populate dropdowns etc.
            attachEventListeners(); // Attach listeners after the first render ensures elements exist
        }, 0);

        return { render }; // Expose render if needed externally, though it's self-managing here
    };
    const AdminView = () => { 
        const container = document.getElementById('view-container');
        if (container) container.innerHTML = '<div><p>Admin View Placeholder</p></div>';
        return { render: () => {} }; 
    };

    // --- MAIN APP LOGIC ---
    let currentPersona = PERSONAS.LEARNER;
    const jobContextBanner = document.getElementById('job-context-banner');
    const jobContextPrefix = document.getElementById('job-context-prefix');
    const displayedJobTitleElement = document.getElementById('displayedJobTitle');

    const updateJobContextBanner = () => {
        if (!jobContextBanner || !jobContextPrefix || !displayedJobTitleElement) { console.warn("Job context banner elements not found"); return; }
        const params = new URLSearchParams(window.location.search);
        const jobTitleFromUrl = params.get('jobTitle');
        switch (currentPersona) {
            case PERSONAS.LEARNER:
                jobContextBanner.style.display = ''; jobContextPrefix.textContent = 'Analyzing Skills for: ';
                if (jobTitleFromUrl) displayedJobTitleElement.textContent = decodeURIComponent(jobTitleFromUrl);
                else displayedJobTitleElement.textContent = defaultJobForLearnerView.title; 
                break;
            case PERSONAS.RECRUITER:
                jobContextBanner.style.display = ''; // Keep banner visible
                jobContextPrefix.textContent = 'Recruiter View: ';
                const employeeSelect = document.getElementById('employee-select');
                const roleSelect = document.getElementById('role-select');
                if (employeeSelect && employeeSelect.value && roleSelect && roleSelect.value) {
                    const selectedEmployee = mockEmployees.find(e => e.id === employeeSelect.value);
                    const selectedRole = mockRoles.find(r => r.id === roleSelect.value);
                    displayedJobTitleElement.textContent = `Comparing ${selectedEmployee ? selectedEmployee.name : 'Employee'} to ${selectedRole ? selectedRole.title : 'Role'}`;
                } else if (employeeSelect && employeeSelect.value) {
                    const selectedEmployee = mockEmployees.find(e => e.id === employeeSelect.value);
                    displayedJobTitleElement.textContent = `Selected Employee: ${selectedEmployee ? selectedEmployee.name : 'N/A'}`;
                } else if (roleSelect && roleSelect.value) {
                    const selectedRole = mockRoles.find(r => r.id === roleSelect.value);
                     displayedJobTitleElement.textContent = `Selected Role: ${selectedRole ? selectedRole.title : 'N/A'}`;
                }
                else {
                    displayedJobTitleElement.textContent = 'Employee-Role Skill Comparison';
                }
                break;
            case PERSONAS.ADMIN: jobContextBanner.style.display = 'none'; break;
            default: jobContextBanner.style.display = 'none';
        }
    };

    const renderView = () => {
        updateJobContextBanner();
        if (currentPersona === PERSONAS.LEARNER) LearnerJobView();
        else if (currentPersona === PERSONAS.RECRUITER) RecruiterView();
        else if (currentPersona === PERSONAS.ADMIN) AdminView();
        else LearnerJobView(); 
    };

    const setCurrentPersona = (persona) => {
        currentPersona = persona;
        if (new URLSearchParams(window.location.search).get('view') !== 'iframe') renderPersonaDropdown();
        renderView();
    };
    
    const renderPersonaDropdown = () => {
        const dropdownContainer = document.getElementById('persona-dropdown-container');
        if (!dropdownContainer) return;
        if (new URLSearchParams(window.location.search).get('view') === 'iframe') {
            dropdownContainer.innerHTML = ''; currentPersona = PERSONAS.LEARNER; return;
        }
        const dropdown = CustomDropdown({ id: 'persona-selector', options: Object.values(PERSONAS), selected: currentPersona, onSelect: setCurrentPersona, label: "View As" });
        dropdownContainer.innerHTML = dropdown.html;
        dropdown.attachListeners();
    };
    
    const initialParams = new URLSearchParams(window.location.search);
    if (initialParams.get('view') === 'iframe') {
        currentPersona = PERSONAS.LEARNER;
        const dropdownContainer = document.getElementById('persona-dropdown-container');
        if(dropdownContainer) dropdownContainer.remove();
    }
    
    renderPersonaDropdown();
    renderView();
});
