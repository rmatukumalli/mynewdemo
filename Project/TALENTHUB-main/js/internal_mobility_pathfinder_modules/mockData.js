// --- MOCK DATA ---
export const mockEmployees = [
    {
        id: 'EMP001',
        name: 'Sarah Chen',
        currentTitle: 'Data Analyst',
        department: 'Marketing Analytics',
        experience: 3.2,
        photoUrl: null,
        skills: [
            { name: 'Python', level: 4 }, { name: 'Machine Learning', level: 3 }, { name: 'Deep Learning', level: 2 },
            { name: 'SQL', level: 4 }, { name: 'Tableau', level: 3 }, { name: 'Cross-functional Leadership', level: 3}, { name: 'Domain Knowledge', level: 3}
        ],
        analytics: {
            "mainHeader": {
                "candidateName": "Sarah Chen",
                "positionTitle": "Senior Data Scientist"
            },
            "overview": { // Corresponds to "🎯 MATCH OVERVIEW"
                "metricCards": [
                    { "title": "Overall Match", "value": "87%", "subtitle": "Above threshold (85%)", "status": "good" },
                    { "title": "Priority Ranking", "value": "#2", "subtitle": "of 15 candidates", "status": "neutral" },
                    { "title": "Interview Readiness", "value": "92%", "subtitle": "Minimal prep needed", "status": "good" }
                ],
                "topStrengthsAlignment": [
                    { "strength": "Python/ML Expertise", "alignment": "98%" },
                    { "strength": "Cross-functional Leadership", "alignment": "94%" },
                    { "strength": "Domain Knowledge", "alignment": "89%" }
                ],
                "criticalGapIndicator": "Deep Learning (Needs Improvement)" // This was a specific field in old data, might need to decide how to display if not in new spec directly
            },
            "profile": { // Corresponds to "👤 CANDIDATE PROFILE"
                "metricCards": [
                    { "title": "Current Role", "value": "Data Analyst", "subtitle": "Marketing Analytics", "status": "neutral" },
                    { "title": "Tenure", "value": "3.2 years", "subtitle": "High retention risk", "status": "warning" },
                    { "title": "Performance Rating", "value": "4.2/5.0", "subtitle": "Exceeds expectations", "status": "good" },
                    { "title": "HiPo Program", "value": "Active", "subtitle": "Leadership pipeline", "status": "good" }
                ]
            },
            "skills": { // Corresponds to "🔧 SKILLS ANALYSIS"
                "technicalSkillsMatch": [
                    { "skillName": "Python", "skillLevel": "Expert", "matchPercentage": 95, "status": "good" },
                    { "skillName": "Machine Learning", "skillLevel": "Advanced", "matchPercentage": 88, "status": "good" },
                    { "skillName": "Deep Learning", "skillLevel": "Intermediate", "matchPercentage": 65, "status": "warning" },
                    { "skillName": "SQL", "skillLevel": "Expert", "matchPercentage": 90, "status": "good" }
                ],
                "skillGapsDevelopment": [
                    { "description": "Deep Learning frameworks (4-6 months)", "status": "warning" },
                    { "description": "MLOps practices (2-3 months)", "status": "warning" },
                    { "description": "Statistical modeling", "status": "good" }
                ],
                // Soft Skills Assessment & Transferable Skills from old data can be added if needed, or assumed to be part of a general text area.
                // For now, focusing on the specified new structure.
            },
            "marketIntelligence": { // Corresponds to "📊 MARKET INTELLIGENCE" - New structure not fully specified, using generic cards
                "metricCards": [
                    { "title": "Peer Comparison", "value": "Top 15%", "subtitle": "Internal Benchmark", "status": "good"},
                    { "title": "Salary Benchmark", "value": "Within Range", "subtitle": "External Market", "status": "neutral"},
                    { "title": "Time-to-Fill Est.", "value": "60-75 days", "subtitle": "Talent Scarcity", "status": "warning"}
                ]
            },
            "risk": { // Corresponds to "⚖️ RISK & READINESS"
                "metricCards": [
                    { "title": "Flight Risk Score", "value": "Medium", "subtitle": "68% retention probability", "status": "warning" },
                    { "title": "Availability Timeline", "value": "30 days", "subtitle": "Project completion", "status": "neutral" },
                    { "title": "Success Probability", "value": "85%", "subtitle": "Historical model", "status": "good" }
                ]
            },
            "fit": { // Corresponds to "🌐 ORGANIZATIONAL FIT"
                "culturalAlignment": [
                    { "trait": "Innovation Focus", "rating": "Strong" },
                    { "trait": "Collaboration", "rating": "Strong" },
                    { "trait": "Results Orientation", "rating": "Good" }
                ],
                "networkAnalysis": [
                    { "metric": "Cross-dept Connections", "value": "12 teams" },
                    { "metric": "Influence Score", "value": "7.2/10" },
                    { "metric": "Mentorship Relations", "value": "3 active" }
                ]
            },
            "developmentPathway": { // Corresponds to "📈 DEVELOPMENT PATHWAY" - New structure not fully specified, using generic cards
                 "metricCards": [
                    { "title": "Training Needs", "value": "Advanced DL, MLOps", "subtitle": "Skill Gap Closure", "status": "warning"},
                    { "title": "Next Role Readiness", "value": "6-9 Months", "subtitle": "Career Progression", "status": "neutral"},
                    { "title": "Development Cost Est.", "value": "$5,000", "subtitle": "Investment Analysis", "status": "neutral"}
                ]
            },
            "bias": { // Corresponds to "🔍 BIAS & COMPLIANCE"
                "metricCards": [
                    { "title": "Ethical AI Check", "value": "Clear", "subtitle": "No issues detected", "status": "good" },
                    { "title": "Diversity Impact", "value": "Positive", "subtitle": "Underrepresented group", "status": "good" },
                    { "title": "Compliance Status", "value": "Complete", "subtitle": "All requirements met", "status": "good" }
                ]
            },
            "actions": { // Corresponds to "📋 ACTION ITEMS"
                "immediateNextSteps": [
                    { "task": "Schedule technical interview (Priority: High)", "isChecked": false },
                    { "task": "Contact current manager for discussion", "isChecked": true },
                    { "task": "Prepare retention conversation", "isChecked": false }
                ],
                "timelineMilestones": [
                    { "milestone": "Decision Deadline", "date": "Dec 15, 2024" },
                    { "milestone": "Earliest Start Date", "date": "Jan 15, 2025" },
                    { "milestone": "Onboarding Duration", "date": "2-3 weeks" }
                ]
            },
            "insights": { // Corresponds to "📊 ANALYTICS & INSIGHTS" - New structure not fully specified, using generic cards
                "metricCards": [
                   { "title": "Success Probability Model", "value": "85%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Retention Forecast", "value": "68%", "subtitle": "Predictive Analytics", "status": "warning"},
                   { "title": "Performance Prediction", "value": "Exceeds", "subtitle": "Predictive Analytics", "status": "good"}
               ]
           }
        }
    },
    {
        id: 'EMP002',
        name: 'Ben Carter',
        currentTitle: 'Senior Engineer, CloudKit',
        department: 'Software Engineering',
        experience: 6, photoUrl: null,
        skills: [ { name: 'Swift', level: 4 }, { name: 'Python', level: 3 }, { name: 'API Design', level: 4 }, { name: 'Mentorship', level: 3 }, { name: 'AWS', level: 3 } ],
        analytics: {
            "mainHeader": {
                "candidateName": "Ben Carter",
                "positionTitle": "Staff Engineer, iOS Platform"
            },
            "overview": {
                "metricCards": [
                    { "title": "Overall Match", "value": "92%", "subtitle": "Strong candidate", "status": "good" },
                    { "title": "Priority Ranking", "value": "#1", "subtitle": "of 8 candidates", "status": "good" },
                    { "title": "Interview Readiness", "value": "95%", "subtitle": "Ready to interview", "status": "good" }
                ],
                "topStrengthsAlignment": [
                    { "strength": "Swift Expertise", "alignment": "99%" },
                    { "strength": "API Design", "alignment": "97%" },
                    { "strength": "Mentorship", "alignment": "90%" }
                ]
            },
            "profile": {
                "metricCards": [
                    { "title": "Current Role", "value": "Senior Engineer, CloudKit", "subtitle": "Software Engineering", "status": "neutral" },
                    { "title": "Tenure", "value": "6 years", "subtitle": "Loyal employee", "status": "good" },
                    { "title": "Performance Rating", "value": "4.5/5.0", "subtitle": "Consistently exceeds", "status": "good" },
                    { "title": "HiPo Program", "value": "Graduate", "subtitle": "Proven leader", "status": "good" }
                ]
            },
            "skills": {
                "technicalSkillsMatch": [
                    { "skillName": "Swift", "skillLevel": "Expert", "matchPercentage": 98, "status": "good" },
                    { "skillName": "Python", "skillLevel": "Advanced", "matchPercentage": 75, "status": "neutral" },
                    { "skillName": "API Design", "skillLevel": "Expert", "matchPercentage": 95, "status": "good" },
                    { "skillName": "AWS", "skillLevel": "Advanced", "matchPercentage": 70, "status": "neutral" }
                ],
                "skillGapsDevelopment": [
                    { "description": "Advanced AWS Architecture (3-4 months)", "status": "warning" },
                    { "description": "Team Leadership Formal Training", "status": "warning" }
                ]
            },
            "marketIntelligence": {
                "metricCards": [
                    { "title": "Peer Comparison", "value": "Top 5%", "subtitle": "Internal Benchmark", "status": "good"},
                    { "title": "Salary Benchmark", "value": "+3% vs Market", "subtitle": "External Market", "status": "neutral"},
                    { "title": "Time-to-Fill Est.", "value": "45-60 days", "subtitle": "Talent Scarcity", "status": "warning"}
                ]
            },
            "risk": {
                "metricCards": [
                    { "title": "Flight Risk Score", "value": "Low", "subtitle": "85% retention probability", "status": "good" },
                    { "title": "Availability Timeline", "value": "45 days", "subtitle": "Project handoff", "status": "neutral" },
                    { "title": "Success Probability", "value": "90%", "subtitle": "Strong indicators", "status": "good" }
                ]
            },
            "fit": {
                "culturalAlignment": [
                    { "trait": "Technical Excellence", "rating": "Strong" },
                    { "trait": "Mentorship", "rating": "Strong" },
                    { "trait": "Pragmatism", "rating": "Good" }
                ],
                "networkAnalysis": [
                    { "metric": "Cross-org Collaborations", "value": "5 major projects" },
                    { "metric": "Tech Talks Delivered", "value": "8" },
                    { "metric": "Mentees", "value": "5" }
                ]
            },
            "developmentPathway": {
                 "metricCards": [
                    { "title": "Training Needs", "value": "AWS Pro Cert, Mgmt Essentials", "subtitle": "Skill Gap Closure", "status": "warning"},
                    { "title": "Next Role Readiness", "value": "Immediate for Staff Eng.", "subtitle": "Career Progression", "status": "good"},
                    { "title": "Development Cost Est.", "value": "$7,000", "subtitle": "Investment Analysis", "status": "neutral"}
                ]
            },
            "bias": {
                "metricCards": [
                    { "title": "Ethical AI Check", "value": "N/A", "subtitle": "Role not AI focused", "status": "neutral" },
                    { "title": "Diversity Impact", "value": "Neutral", "subtitle": "", "status": "neutral" },
                    { "title": "Compliance Status", "value": "Complete", "subtitle": "All requirements met", "status": "good" }
                ]
            },
            "actions": {
                "immediateNextSteps": [
                    { "task": "Schedule interview with Director", "isChecked": false },
                    { "task": "Discuss transition with current manager", "isChecked": false }
                ],
                "timelineMilestones": [
                    { "milestone": "Decision Deadline", "date": "Jan 10, 2025" },
                    { "milestone": "Earliest Start Date", "date": "Feb 01, 2025" }
                ]
            },
            "insights": {
                "metricCards": [
                   { "title": "Success Probability Model", "value": "90%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Retention Forecast", "value": "85%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Performance Prediction", "value": "Strongly Exceeds", "subtitle": "Predictive Analytics", "status": "good"}
               ]
           }
        }
    },
    {
        id: 'EMP003',
        name: 'Aisha Khan',
        currentTitle: 'Software Engineer, Maps',
        department: 'Software Engineering',
        experience: 4, photoUrl: null,
        skills: [ { name: 'Swift', level: 3 }, { name: 'Core Location', level: 3 }, { name: 'Problem Solving', level: 4 }, { name: 'C++', level: 2 } ],
        analytics: {
            "mainHeader": {
                "candidateName": "Aisha Khan",
                "positionTitle": "Senior Software Engineer, Navigation"
            },
            "overview": {
                "metricCards": [
                    { "title": "Overall Match", "value": "78%", "subtitle": "Potential fit", "status": "neutral" },
                    { "title": "Priority Ranking", "value": "#5", "subtitle": "of 10 candidates", "status": "neutral" },
                    { "title": "Interview Readiness", "value": "80%", "subtitle": "Some prep needed", "status": "warning" }
                ],
                "topStrengthsAlignment": [
                    { "strength": "Problem Solving", "alignment": "95%" },
                    { "strength": "Swift", "alignment": "80%" },
                    { "strength": "Core Location", "alignment": "82%" }
                ]
            },
            "profile": {
                "metricCards": [
                    { "title": "Current Role", "value": "Software Engineer, Maps", "subtitle": "Software Engineering", "status": "neutral" },
                    { "title": "Tenure", "value": "4 years", "subtitle": "Stable", "status": "neutral" },
                    { "title": "Performance Rating", "value": "3.8/5.0", "subtitle": "Meets expectations", "status": "neutral" },
                    { "title": "HiPo Program", "value": "Not Enrolled", "subtitle": "", "status": "neutral" }
                ]
            },
            "skills": {
                "technicalSkillsMatch": [
                    { "skillName": "Swift", "skillLevel": "Advanced", "matchPercentage": 80, "status": "good" },
                    { "skillName": "Core Location", "skillLevel": "Advanced", "matchPercentage": 82, "status": "good" },
                    { "skillName": "C++", "skillLevel": "Intermediate", "matchPercentage": 50, "status": "warning" },
                    { "skillName": "Spatial Algorithms", "skillLevel": "Beginner", "matchPercentage": 30, "status": "critical" }
                ],
                "skillGapsDevelopment": [
                    { "description": "Advanced C++ (6-8 months)", "status": "warning" },
                    { "description": "Spatial Algorithms (4-6 months)", "status": "warning" },
                    { "description": "System Design for Scale", "status": "warning" }
                ]
            },
            "marketIntelligence": {
                "metricCards": [
                    { "title": "Peer Comparison", "value": "Top 40%", "subtitle": "Internal Benchmark", "status": "neutral"},
                    { "title": "Salary Benchmark", "value": "-2% vs Market", "subtitle": "External Market", "status": "neutral"},
                    { "title": "Time-to-Fill Est.", "value": "70-90 days", "subtitle": "Talent Scarcity", "status": "warning"}
                ]
            },
            "risk": {
                "metricCards": [
                    { "title": "Flight Risk Score", "value": "Low-Medium", "subtitle": "75% retention probability", "status": "neutral" },
                    { "title": "Availability Timeline", "value": "60 days", "subtitle": "Current project critical", "status": "warning" },
                    { "title": "Success Probability", "value": "70%", "subtitle": "With development", "status": "warning" }
                ]
            },
            "fit": {
                "culturalAlignment": [
                    { "trait": "Detail Orientation", "rating": "Strong" },
                    { "trait": "Team Player", "rating": "Good" }
                ],
                "networkAnalysis": [
                    { "metric": "Key Dependencies", "value": "Maps Routing Team" },
                    { "metric": "Project Contributions", "value": "POI Accuracy Initiative" }
                ]
            },
             "developmentPathway": {
                 "metricCards": [
                    { "title": "Training Needs", "value": "Adv C++, Spatial Algos, Sys Design", "subtitle": "Skill Gap Closure", "status": "warning"},
                    { "title": "Next Role Readiness", "value": "9-12 Months", "subtitle": "Career Progression", "status": "warning"},
                    { "title": "Development Cost Est.", "value": "$10,000", "subtitle": "Investment Analysis", "status": "warning"}
                ]
            },
            "bias": {
                "metricCards": [
                    { "title": "Ethical AI Check", "value": "N/A", "status": "neutral" },
                    { "title": "Diversity Impact", "value": "Positive", "status": "good" },
                    { "title": "Compliance Status", "value": "Complete", "status": "good" }
                ]
            },
            "actions": {
                "immediateNextSteps": [
                    { "task": "Initial screening call", "isChecked": true },
                    { "task": "Technical assessment on C++ & Algorithms", "isChecked": false }
                ],
                "timelineMilestones": [
                    { "milestone": "Feedback Deadline", "date": "Feb 20, 2025" }
                ]
            },
            "insights": {
                "metricCards": [
                   { "title": "Success Probability Model", "value": "70%", "subtitle": "Predictive Analytics", "status": "warning"},
                   { "title": "Retention Forecast", "value": "75%", "subtitle": "Predictive Analytics", "status": "neutral"},
                   { "title": "Performance Prediction", "value": "Meets to Exceeds", "subtitle": "Predictive Analytics", "status": "neutral"}
               ]
           }
        }
    },
    {
        id: 'EMP004',
        name: 'David Lee',
        currentTitle: 'Data Scientist, Analytics',
        department: 'Data Science',
        experience: 5, photoUrl: null,
        skills: [ { name: 'Python', level: 4 }, { name: 'SQL', level: 4 }, { name: 'Machine Learning', level: 3 }, { name: 'Tableau', level: 3 } ],
        analytics: {
            "mainHeader": {
                "candidateName": "David Lee",
                "positionTitle": "Lead Data Scientist, Product Insights"
            },
            "overview": {
                "metricCards": [
                    { "title": "Overall Match", "value": "82%", "subtitle": "Good potential", "status": "good" },
                    { "title": "Priority Ranking", "value": "#3", "subtitle": "of 12 candidates", "status": "neutral" },
                    { "title": "Interview Readiness", "value": "88%", "subtitle": "Minor prep", "status": "good" }
                ],
                "topStrengthsAlignment": [
                    { "strength": "Python & SQL", "alignment": "96%" },
                    { "strength": "Machine Learning", "alignment": "85%" },
                    { "strength": "Tableau Visualization", "alignment": "80%" }
                ]
            },
            "profile": {
                "metricCards": [
                    { "title": "Current Role", "value": "Data Scientist, Analytics", "subtitle": "Data Science", "status": "neutral" },
                    { "title": "Tenure", "value": "5 years", "subtitle": "Committed", "status": "good" },
                    { "title": "Performance Rating", "value": "4.0/5.0", "subtitle": "Exceeds some expectations", "status": "neutral" },
                    { "title": "HiPo Program", "value": "Nominated", "subtitle": "Under consideration", "status": "neutral" }
                ]
            },
            "skills": {
                "technicalSkillsMatch": [
                    { "skillName": "Python", "skillLevel": "Expert", "matchPercentage": 96, "status": "good" },
                    { "skillName": "SQL", "skillLevel": "Expert", "matchPercentage": 96, "status": "good" },
                    { "skillName": "Machine Learning", "skillLevel": "Advanced", "matchPercentage": 85, "status": "good" },
                    { "skillName": "Experimentation (A/B testing)", "skillLevel": "Intermediate", "matchPercentage": 60, "status": "warning" }
                ],
                "skillGapsDevelopment": [
                    { "description": "Advanced Experimentation Design (3-4 months)", "status": "warning" },
                    { "description": "Causal Inference Techniques (4-6 months)", "status": "warning" },
                    { "description": "Presenting to Executive Audiences", "status": "warning" }
                ]
            },
             "marketIntelligence": {
                "metricCards": [
                    { "title": "Peer Comparison", "value": "Top 25%", "subtitle": "Internal Benchmark", "status": "good"},
                    { "title": "Salary Benchmark", "value": "On Par", "subtitle": "External Market", "status": "neutral"},
                    { "title": "Time-to-Fill Est.", "value": "50-70 days", "subtitle": "Talent Scarcity", "status": "warning"}
                ]
            },
            "risk": {
                "metricCards": [
                    { "title": "Flight Risk Score", "value": "Medium", "subtitle": "70% retention probability", "status": "warning" },
                    { "title": "Availability Timeline", "value": "30-45 days", "subtitle": "Wrapping up analysis", "status": "neutral" },
                    { "title": "Success Probability", "value": "78%", "subtitle": "Good, with skill growth", "status": "good" }
                ]
            },
            "fit": {
                "culturalAlignment": [
                    { "trait": "Data-driven", "rating": "Strong" },
                    { "trait": "Curiosity", "rating": "Strong" }
                ],
                "networkAnalysis": [
                    { "metric": "Product Team Collaborations", "value": "Multiple" },
                    { "metric": "Analytics Guild Member", "value": "Active" }
                ]
            },
            "developmentPathway": {
                 "metricCards": [
                    { "title": "Training Needs", "value": "Experimentation, Causal Inf.", "subtitle": "Skill Gap Closure", "status": "warning"},
                    { "title": "Next Role Readiness", "value": "6-9 Months for Lead", "subtitle": "Career Progression", "status": "neutral"},
                    { "title": "Development Cost Est.", "value": "$6,000", "subtitle": "Investment Analysis", "status": "neutral"}
                ]
            },
            "bias": {
                "metricCards": [
                    { "title": "Ethical AI Check", "value": "Passed", "status": "good" },
                    { "title": "Diversity Impact", "value": "Neutral", "status": "neutral" },
                    { "title": "Compliance Status", "value": "Complete", "status": "good" }
                ]
            },
            "actions": {
                "immediateNextSteps": [
                    { "task": "Review portfolio of projects", "isChecked": false },
                    { "task": "Behavioral interview focused on leadership", "isChecked": false }
                ],
                "timelineMilestones": [
                    { "milestone": "Offer Decision", "date": "Mar 10, 2025" }
                ]
            },
            "insights": {
                "metricCards": [
                   { "title": "Success Probability Model", "value": "78%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Retention Forecast", "value": "70%", "subtitle": "Predictive Analytics", "status": "warning"},
                   { "title": "Performance Prediction", "value": "Exceeds", "subtitle": "Predictive Analytics", "status": "good"}
               ]
           }
        }
    },
    {
        id: 'EMP005',
        name: 'Sarah Miller',
        currentTitle: 'Marketing Manager, Campaigns',
        department: 'Marketing',
        experience: 7, photoUrl: null,
        skills: [ { name: 'Digital Marketing', level: 4 }, { name: 'SEO/SEM', level: 3 }, { name: 'Content Creation', level: 4 }, { name: 'Marketing Strategy', level: 4 } ],
        analytics: {
            "mainHeader": {
                "candidateName": "Sarah Miller",
                "positionTitle": "Senior Marketing Lead, Growth"
            },
            "overview": {
                "metricCards": [
                    { "title": "Overall Match", "value": "75%", "subtitle": "Potential with upskilling", "status": "warning" },
                    { "title": "Priority Ranking", "value": "#8", "subtitle": "of 15 candidates", "status": "neutral" },
                    { "title": "Interview Readiness", "value": "70%", "subtitle": "Needs role clarity", "status": "warning" }
                ],
                "topStrengthsAlignment": [
                    { "strength": "Marketing Strategy", "alignment": "92%" },
                    { "strength": "Content Creation", "alignment": "90%" },
                    { "strength": "Digital Marketing", "alignment": "85%" }
                ]
            },
            "profile": {
                "metricCards": [
                    { "title": "Current Role", "value": "Marketing Manager, Campaigns", "subtitle": "Marketing", "status": "neutral" },
                    { "title": "Tenure", "value": "7 years", "subtitle": "Very loyal", "status": "good" },
                    { "title": "Performance Rating", "value": "4.1/5.0", "subtitle": "Exceeds expectations", "status": "good" },
                    { "title": "HiPo Program", "value": "Considered", "subtitle": "Potential for future", "status": "neutral" }
                ]
            },
            "skills": {
                "technicalSkillsMatch": [
                    { "skillName": "Marketing Strategy", "skillLevel": "Expert", "matchPercentage": 92, "status": "good" },
                    { "skillName": "Digital Marketing", "skillLevel": "Expert", "matchPercentage": 85, "status": "good" },
                    { "skillName": "SEO/SEM", "skillLevel": "Advanced", "matchPercentage": 70, "status": "neutral" },
                    { "skillName": "Data Analytics for Marketing", "skillLevel": "Beginner", "matchPercentage": 40, "status": "critical" }
                ],
                "skillGapsDevelopment": [
                    { "description": "Data Analytics for Marketing (6-9 months)", "status": "critical" },
                    { "description": "Growth Hacking Techniques (4-6 months)", "status": "warning" },
                    { "description": "Advanced SEO/SEM (3-4 months)", "status": "warning" }
                ]
            },
            "marketIntelligence": {
                "metricCards": [
                    { "title": "Peer Comparison", "value": "Top 30%", "subtitle": "Internal Benchmark", "status": "neutral"},
                    { "title": "Salary Benchmark", "value": "-5% vs Market", "subtitle": "External Market", "status": "warning"},
                    { "title": "Time-to-Fill Est.", "value": "60-80 days", "subtitle": "Talent Scarcity", "status": "warning"}
                ]
            },
            "risk": {
                "metricCards": [
                    { "title": "Flight Risk Score", "value": "Low", "subtitle": "80% retention probability", "status": "good" },
                    { "title": "Availability Timeline", "value": "30 days", "subtitle": "Standard notice", "status": "neutral" },
                    { "title": "Success Probability", "value": "65%", "subtitle": "Dependent on upskilling", "status": "warning" }
                ]
            },
            "fit": {
                "culturalAlignment": [
                    { "trait": "Creativity", "rating": "Strong" },
                    { "trait": "Results-driven", "rating": "Good" }
                ],
                "networkAnalysis": [
                    { "metric": "Campaign Collaborations", "value": "Across 3 product lines" },
                    { "metric": "Agency Management", "value": "Yes" }
                ]
            },
            "developmentPathway": {
                 "metricCards": [
                    { "title": "Training Needs", "value": "Marketing Analytics, Growth Hacking", "subtitle": "Skill Gap Closure", "status": "critical"},
                    { "title": "Next Role Readiness", "value": "9-12 Months for Sr. Lead", "subtitle": "Career Progression", "status": "warning"},
                    { "title": "Development Cost Est.", "value": "$12,000", "subtitle": "Investment Analysis", "status": "warning"}
                ]
            },
            "bias": {
                "metricCards": [
                    { "title": "Ethical AI Check", "value": "N/A", "status": "neutral" },
                    { "title": "Diversity Impact", "value": "Positive", "status": "good" },
                    { "title": "Compliance Status", "value": "Complete", "status": "good" }
                ]
            },
            "actions": {
                "immediateNextSteps": [
                    { "task": "Discuss career goals and interest in analytics", "isChecked": false },
                    { "task": "Assess aptitude for data-driven roles", "isChecked": false }
                ],
                "timelineMilestones": [
                    { "milestone": "Development Plan Creation", "date": "Apr 01, 2025" }
                ]
            },
            "insights": {
                "metricCards": [
                   { "title": "Success Probability Model", "value": "65%", "subtitle": "Predictive Analytics", "status": "warning"},
                   { "title": "Retention Forecast", "value": "80%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Performance Prediction", "value": "Meets (Potential to Exceed)", "subtitle": "Predictive Analytics", "status": "neutral"}
               ]
           }
        }
    },
    {
        id: 'EMP006',
        name: 'Laura Palmer',
        currentTitle: 'Senior AI Researcher',
        department: 'Research & Development',
        experience: 8, photoUrl: null,
        skills: [
            { name: 'Python', level: 5 }, { name: 'Machine Learning', level: 5 }, { name: 'Deep Learning', level: 5 },
            { name: 'NLP', level: 4 }, { name: 'Computer Vision', level: 4 }, { name: 'Research Leadership', level: 4},
            { name: 'Kubernetes', level: 4 }, { name: 'Distributed Systems', level: 4 }, { name: 'API Design', level: 4 },
            { name: 'Problem Solving', level: 5 }, { name: 'Collaboration', level: 4 }, { name: 'Mentorship', level: 3 }
        ],
        analytics: {
            "mainHeader": {
                "candidateName": "Laura Palmer",
                "positionTitle": "Principal AI Scientist"
            },
            "overview": {
                "metricCards": [
                    { "title": "Overall Match", "value": "95%", "subtitle": "Exceptional candidate", "status": "good" },
                    { "title": "Priority Ranking", "value": "#1", "subtitle": "of 20 candidates", "status": "good" },
                    { "title": "Interview Readiness", "value": "98%", "subtitle": "Immediate interview", "status": "good" }
                ],
                "topStrengthsAlignment": [
                    { "strength": "Deep Learning Expertise", "alignment": "99%" },
                    { "strength": "Research Leadership", "alignment": "97%" },
                    { "strength": "NLP & CV", "alignment": "95%" }
                ],
                "criticalGapIndicator": null
            },
            "profile": {
                "metricCards": [
                    { "title": "Current Role", "value": "Senior AI Researcher", "subtitle": "R&D", "status": "neutral" },
                    { "title": "Tenure", "value": "8 years", "subtitle": "Highly dedicated", "status": "good" },
                    { "title": "Performance Rating", "value": "4.9/5.0", "subtitle": "Top performer", "status": "good" },
                    { "title": "HiPo Program", "value": "Alumni", "subtitle": "Proven high potential", "status": "good" }
                ]
            },
            "skills": {
                "technicalSkillsMatch": [
                    { "skillName": "Python", "skillLevel": "Expert", "matchPercentage": 99, "status": "good" },
                    { "skillName": "Machine Learning", "skillLevel": "Expert", "matchPercentage": 98, "status": "good" },
                    { "skillName": "Deep Learning", "skillLevel": "Expert", "matchPercentage": 99, "status": "good" },
                    { "skillName": "NLP", "skillLevel": "Advanced", "matchPercentage": 95, "status": "good" }
                ],
                "skillGapsDevelopment": [
                    { "description": "Quantum ML (Exploratory)", "status": "neutral" }
                ]
            },
            "marketIntelligence": {
                "metricCards": [
                    { "title": "Peer Comparison", "value": "Top 1%", "subtitle": "Internal Benchmark", "status": "good"},
                    { "title": "Salary Benchmark", "value": "+5% vs Market", "subtitle": "External Market", "status": "good"},
                    { "title": "Time-to-Fill Est.", "value": "30-45 days", "subtitle": "High demand role", "status": "warning"}
                ]
            },
            "risk": {
                "metricCards": [
                    { "title": "Flight Risk Score", "value": "Very Low", "subtitle": "95% retention probability", "status": "good" },
                    { "title": "Availability Timeline", "value": "15 days", "subtitle": "Project wrap-up", "status": "good" },
                    { "title": "Success Probability", "value": "96%", "subtitle": "Exceptional fit", "status": "good" }
                ]
            },
            "fit": {
                "culturalAlignment": [
                    { "trait": "Innovation Driver", "rating": "Exceptional" },
                    { "trait": "Mentorship & Guidance", "rating": "Strong" },
                    { "trait": "Strategic Thinking", "rating": "Strong" }
                ],
                "networkAnalysis": [
                    { "metric": "Patents Filed", "value": "5" },
                    { "metric": "Publications", "value": "12" },
                    { "metric": "Conference Speaker", "value": "Yes" }
                ]
            },
            "developmentPathway": {
                 "metricCards": [
                    { "title": "Training Needs", "value": "None critical", "subtitle": "Continuous learning", "status": "good"},
                    { "title": "Next Role Readiness", "value": "Immediate", "subtitle": "Career Progression", "status": "good"},
                    { "title": "Development Cost Est.", "value": "$2,000", "subtitle": "Conference attendance", "status": "neutral"}
                ]
            },
            "bias": {
                "metricCards": [
                    { "title": "Ethical AI Check", "value": "Exemplary", "subtitle": "Leads ethics reviews", "status": "good" },
                    { "title": "Diversity Impact", "value": "Strongly Positive", "subtitle": "Mentors URG talent", "status": "good" },
                    { "title": "Compliance Status", "value": "Complete", "subtitle": "All requirements met", "status": "good" }
                ]
            },
            "actions": {
                "immediateNextSteps": [
                    { "task": "Schedule discussion with VP of AI", "isChecked": false },
                    { "task": "Prepare offer package", "isChecked": false }
                ],
                "timelineMilestones": [
                    { "milestone": "Offer Target Date", "date": "June 30, 2025" },
                    { "milestone": "Earliest Start Date", "date": "July 15, 2025" }
                ]
            },
            "insights": {
                "metricCards": [
                   { "title": "Success Probability Model", "value": "96%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Retention Forecast", "value": "95%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Performance Prediction", "value": "Exceptional", "subtitle": "Predictive Analytics", "status": "good"}
               ]
           }
        }
    },
    {
        id: 'EMP007',
        name: 'James Hurley',
        currentTitle: 'Lead DevOps Engineer',
        department: 'Platform Engineering',
        experience: 10, photoUrl: null,
        skills: [
            { name: 'Kubernetes', level: 5 }, { name: 'AWS', level: 5 }, { name: 'Terraform', level: 4 },
            { name: 'CI/CD', level: 5 }, { name: 'Python', level: 4 }, { name: 'Site Reliability', level: 4},
            { name: 'Go', level: 3 }, { name: 'Distributed Systems', level: 5 }, { name: 'API Design', level: 5 },
            { name: 'Problem Solving', level: 4 }, { name: 'Collaboration', level: 4 }, { name: 'Mentorship', level: 4 }
        ],
        analytics: {
            "mainHeader": {
                "candidateName": "James Hurley",
                "positionTitle": "Director of Cloud Infrastructure"
            },
            "overview": {
                "metricCards": [
                    { "title": "Overall Match", "value": "93%", "subtitle": "Very strong candidate", "status": "good" },
                    { "title": "Priority Ranking", "value": "#2", "subtitle": "of 18 candidates", "status": "good" },
                    { "title": "Interview Readiness", "value": "96%", "subtitle": "Ready for final rounds", "status": "good" }
                ],
                "topStrengthsAlignment": [
                    { "strength": "Kubernetes & AWS", "alignment": "98%" },
                    { "strength": "CI/CD Automation", "alignment": "95%" },
                    { "strength": "Site Reliability", "alignment": "92%" }
                ]
            },
            "profile": {
                "metricCards": [
                    { "title": "Current Role", "value": "Lead DevOps Engineer", "subtitle": "Platform Engineering", "status": "neutral" },
                    { "title": "Tenure", "value": "10 years", "subtitle": "Deep institutional knowledge", "status": "good" },
                    { "title": "Performance Rating", "value": "4.7/5.0", "subtitle": "Consistently outstanding", "status": "good" },
                    { "title": "HiPo Program", "value": "Active", "subtitle": "Leadership track", "status": "good" }
                ]
            },
            "skills": {
                "technicalSkillsMatch": [
                    { "skillName": "Kubernetes", "skillLevel": "Expert", "matchPercentage": 99, "status": "good" },
                    { "skillName": "AWS", "skillLevel": "Expert", "matchPercentage": 98, "status": "good" },
                    { "skillName": "Terraform", "skillLevel": "Advanced", "matchPercentage": 90, "status": "good" },
                    { "skillName": "Security Best Practices", "skillLevel": "Advanced", "matchPercentage": 85, "status": "good" }
                ],
                "skillGapsDevelopment": [
                    { "description": "Azure Cloud (Familiarity)", "status": "neutral" },
                    { "description": "Budget Management (Formal Training)", "status": "warning" }
                ]
            },
            "marketIntelligence": {
                "metricCards": [
                    { "title": "Peer Comparison", "value": "Top 3%", "subtitle": "Internal Benchmark", "status": "good"},
                    { "title": "Salary Benchmark", "value": "Competitive", "subtitle": "External Market", "status": "good"},
                    { "title": "Time-to-Fill Est.", "value": "40-55 days", "subtitle": "Specialized role", "status": "warning"}
                ]
            },
            "risk": {
                "metricCards": [
                    { "title": "Flight Risk Score", "value": "Low", "subtitle": "90% retention probability", "status": "good" },
                    { "title": "Availability Timeline", "value": "30 days", "subtitle": "Knowledge transfer", "status": "neutral" },
                    { "title": "Success Probability", "value": "94%", "subtitle": "High confidence", "status": "good" }
                ]
            },
            "fit": {
                "culturalAlignment": [
                    { "trait": "Reliability Focus", "rating": "Strong" },
                    { "trait": "Process Improvement", "rating": "Strong" },
                    { "trait": "Team Leadership", "rating": "Good" }
                ],
                "networkAnalysis": [
                    { "metric": "Critical Systems Maintained", "value": "All Tier-1 services" },
                    { "metric": "Incident Response Lead", "value": "Yes" },
                    { "metric": "Mentored Jr. Engineers", "value": "7" }
                ]
            },
            "developmentPathway": {
                 "metricCards": [
                    { "title": "Training Needs", "value": "Executive Leadership Program", "subtitle": "Skill Enhancement", "status": "neutral"},
                    { "title": "Next Role Readiness", "value": "3-6 Months for Director", "subtitle": "Career Progression", "status": "good"},
                    { "title": "Development Cost Est.", "value": "$8,000", "subtitle": "Leadership Training", "status": "neutral"}
                ]
            },
            "bias": {
                "metricCards": [
                    { "title": "Ethical AI Check", "value": "N/A", "subtitle": "Role not AI focused", "status": "neutral" },
                    { "title": "Diversity Impact", "value": "Neutral", "subtitle": "", "status": "neutral" },
                    { "title": "Compliance Status", "value": "Complete", "subtitle": "All requirements met", "status": "good" }
                ]
            },
            "actions": {
                "immediateNextSteps": [
                    { "task": "Final interview with CTO", "isChecked": false },
                    { "task": "Discuss team transition plan", "isChecked": false }
                ],
                "timelineMilestones": [
                    { "milestone": "Decision Target", "date": "July 05, 2025" },
                    { "milestone": "Potential Start Date", "date": "Aug 01, 2025" }
                ]
            },
            "insights": {
                "metricCards": [
                   { "title": "Success Probability Model", "value": "94%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Retention Forecast", "value": "90%", "subtitle": "Predictive Analytics", "status": "good"},
                   { "title": "Performance Prediction", "value": "Strongly Exceeds", "subtitle": "Predictive Analytics", "status": "good"}
               ]
           }
        }
    }
];

// --- MOCK ANALYTICS STRUCTURE (from user prompt) ---
// This structure can serve as a template for the keys if needed,
// but the actual data is now more detailed within each employee.
// It might be used by ui.js to iterate through sections if a candidate has missing analytics sections.
export const mockAnalyticsStructure = {
    "mainHeader": {}, // candidateName, positionTitle
    "overview": { // "🎯 MATCH OVERVIEW"
        "metricCards": [], // title, value, subtitle, status
        "topStrengthsAlignment": [], // strength, alignment
        // "criticalGapIndicator": "" // Optional: if you want to keep this specific field
    },
    "profile": { // "👤 CANDIDATE PROFILE"
        "metricCards": []
    },
    "skills": { // "🔧 SKILLS ANALYSIS"
        "technicalSkillsMatch": [], // skillName, skillLevel, matchPercentage, status
        "skillGapsDevelopment": [] // description, status
    },
    "marketIntelligence": { // "📊 MARKET INTELLIGENCE"
        "metricCards": []
    },
    "risk": { // "⚖️ RISK & READINESS"
        "metricCards": []
    },
    "fit": { // "🌐 ORGANIZATIONAL FIT"
        "culturalAlignment": [], // trait, rating
        "networkAnalysis": [] // metric, value
    },
    "developmentPathway": { // "📈 DEVELOPMENT PATHWAY"
        "metricCards": []
    },
    "bias": { // "🔍 BIAS & COMPLIANCE"
        "metricCards": []
    },
    "actions": { // "📋 ACTION ITEMS"
        "immediateNextSteps": [], // task, isChecked
        "timelineMilestones": [] // milestone, date
    },
    "insights": { // "📊 ANALYTICS & INSIGHTS"
        "metricCards": []
    }
};

// --- MOCK POSITION DATA FOR FORM ---
export const mockPositionFormData = {
    searchQuery: "R78910",
    title: "Senior Software Engineer, Platform",
    department: "Software Engineering",
    location: "Austin, TX",
    hardSkills: ["Go", "Kubernetes", "Distributed Systems", "API Design"],
    softSkills: ["Problem Solving", "Collaboration", "Mentorship"],
    experience: 5,
    performance: "Exceeds Expectations",
    tenure: 2
};
