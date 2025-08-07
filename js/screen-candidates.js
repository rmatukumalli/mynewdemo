function initializeScreenCandidatesModule(parentElementSelector) {
    const parentElement = document.querySelector(parentElementSelector);
    if (!parentElement) {
        console.error(`Screen Candidates Module: Parent element "${parentElementSelector}" not found.`);
        return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    // Function to safely get CSS variable or return a fallback
    const getCssVar = (varName, fallback) => {
        const val = rootStyles.getPropertyValue(varName).trim();
        return val || fallback;
    };

    // Define chart colors using CSS variables with fallbacks
    const chartColors = [
        getCssVar('--chart-color-1', '#007bff'), // Blue
        getCssVar('--chart-color-2', '#28a745'), // Green
        getCssVar('--chart-color-3', '#ffc107'), // Yellow/Gold
        getCssVar('--chart-color-4', '#dc3545'), // Red
        getCssVar('--chart-color-5', '#6f42c1'), // Purple
        getCssVar('--chart-color-6', '#fd7e14'), // Orange
        getCssVar('--chart-color-7', '#17a2b8')  // Teal
    ];
    const deltaBlueRgb = getCssVar('--delta-blue-rgb', '0, 51, 102');


    const jobSelector = parentElement.querySelector('#job-selector');
    const subNavLinks = parentElement.querySelectorAll('.sub-nav-link');
    const mainContentSections = parentElement.querySelectorAll('.main-content-section');
    const mainContentTitle = parentElement.querySelector('#main-content-title');
    const jobTitlePlaceholders = parentElement.querySelectorAll('.job-title-placeholder');
    const jobContextMessage = parentElement.querySelector('#job-context-message');
    const selectedJobNameSpan = parentElement.querySelector('#selected-job-name');
    const initialMessageSection = parentElement.querySelector('#initial-message');
    const applicantsPerPage = 10;
    let currentPage = 1;
    let currentJobId = null;
    let currentSortColumn = null;
    let currentSortDirection = 'asc';
    let currentFilters = { name: '', status: '' };

    const applyJobApplicantsFiltersBtn = parentElement.querySelector('#apply-job-applicants-filters-btn');
    const filterBasicKeywordInput = parentElement.querySelector('#filter-basic-keyword');
    const filterApplicantStatusMainSelect = parentElement.querySelector('#filter-applicant-status-main');
    const toggleAdvancedFiltersBtn = parentElement.querySelector('#toggle-advanced-filters-btn');
    const advancedFiltersContainer = parentElement.querySelector('#advanced-filters-container');

    if (toggleAdvancedFiltersBtn && advancedFiltersContainer) {
        toggleAdvancedFiltersBtn.addEventListener('click', () => {
            const isHidden = advancedFiltersContainer.classList.toggle('hidden');
            const arrowSpan = toggleAdvancedFiltersBtn.querySelector('span'); // More robust
            if (isHidden) {
                toggleAdvancedFiltersBtn.childNodes[0].nodeValue = 'Show Advanced Filters '; // Update text node
                if(arrowSpan) arrowSpan.innerHTML = '&#9662;';
            } else {
                toggleAdvancedFiltersBtn.childNodes[0].nodeValue = 'Hide Advanced Filters '; // Update text node
                if(arrowSpan) arrowSpan.innerHTML = '&#9652;';
            }
        });
    }

    let applicantFunnelChart, jobDiversityChart;

    const jobSpecificData = {
        "sr-software-engineer": {
            applicants: [
                { id: "app001", name: "John Smith", applicationDate: "2025-05-15", match: "94%", skills: "Java, Spring, Hibernate, REST APIs, Jenkins", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '94%', skills: { relevance: 'Very High', stars: 5, notes: 'Expert in Java & Spring ecosystem.' }, title: { relevance: 'High', stars: 4, notes: 'Sr. Developer for 5 years.' }, work: { relevance: 'Very High', stars: 5, notes: 'Led multiple critical projects.' }, experience: { relevance: 'Very High', stars: 5, notes: '10 years in backend development.' }} },
                { id: "app002", name: "Emily Johnson", applicationDate: "2025-05-10", match: "91%", skills: "Python, Django, Flask, AWS, Docker", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '91%', skills: { relevance: 'High', stars: 4, notes: 'Strong Python & AWS skills.' }, title: { relevance: 'High', stars: 4, notes: 'Cloud Engineer background.' }, work: { relevance: 'High', stars: 4, notes: 'Developed scalable cloud solutions.' }, experience: { relevance: 'High', stars: 4, notes: '7 years with Python and cloud.' }} },
                { id: "app003", name: "Michael Brown", applicationDate: "2025-05-01", match: "88%", skills: "C#, .NET Core, Azure, Microservices", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '88%', skills: { relevance: 'High', stars: 4, notes: '.NET Core and Azure proficiency.' }, title: { relevance: 'Medium', stars: 3, notes: 'Software Engineer.' }, work: { relevance: 'High', stars: 4, notes: 'Experience with microservice architecture.' }, experience: { relevance: 'High', stars: 4, notes: '6 years in .NET stack.' }} },
                { id: "app004", name: "Jessica Davis", applicationDate: "2025-05-05", match: "85%", skills: "JavaScript, React, Node.js, GraphQL", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '85%', skills: { relevance: 'Medium', stars: 3, notes: 'Full-stack JS, good React knowledge.' }, title: { relevance: 'Medium', stars: 3, notes: 'Full Stack Developer.' }, work: { relevance: 'Medium', stars: 3, notes: 'Contributed to several web apps.' }, experience: { relevance: 'High', stars: 4, notes: '5 years in JavaScript development.' }} },
                { id: "app005", name: "David Wilson", applicationDate: "2025-05-20", match: "82%", skills: "Go, Kubernetes, Docker, gRPC", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '82%', skills: { relevance: 'High', stars: 4, notes: 'Proficient in Go and Kubernetes.' }, title: { relevance: 'Medium', stars: 3, notes: 'DevOps Engineer.' }, work: { relevance: 'High', stars: 4, notes: 'Managed containerized applications.' }, experience: { relevance: 'Medium', stars: 3, notes: '4 years with Go and K8s.' }} },
                { id: "app006", name: "Sarah Miller", applicationDate: "2025-06-01", match: "79%", skills: "Ruby on Rails, PostgreSQL, Heroku", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '79%', skills: { relevance: 'Medium', stars: 3, notes: 'Solid RoR experience.' }, title: { relevance: 'Medium', stars: 3, notes: 'Web Developer.' }, work: { relevance: 'Medium', stars: 3, notes: 'Built and maintained Rails apps.' }, experience: { relevance: 'Medium', stars: 3, notes: '5 years with Ruby on Rails.' }} },
                { id: "app007", name: "Chris Garcia", applicationDate: "2025-05-15", match: "76%", skills: "PHP, Laravel, MySQL, Vue.js", status: "Interview Scheduled", statusColor: "blue", shortlisted: true, assessmentStatus: "Sent", questionnaireStatus: "Pending", matchDetails: { overallMatch: '76%', skills: { relevance: 'Medium', stars: 3, notes: 'Good PHP/Laravel, some Vue.' }, title: { relevance: 'Low', stars: 2, notes: 'PHP Developer.' }, work: { relevance: 'Medium', stars: 3, notes: 'E-commerce project experience.' }, experience: { relevance: 'Medium', stars: 3, notes: '6 years in PHP development.' }} },
                { id: "app008", name: "Linda Rodriguez", applicationDate: "2025-06-03", match: "73%", skills: "Scala, Akka, Kafka, Spark", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '73%', skills: { relevance: 'High', stars: 4, notes: 'Strong Scala and distributed systems knowledge.' }, title: { relevance: 'Medium', stars: 3, notes: 'Backend Engineer.' }, work: { relevance: 'High', stars: 4, notes: 'Worked on high-throughput systems.' }, experience: { relevance: 'Medium', stars: 3, notes: '4 years with Scala and Kafka.' }} },
                { id: "app009", name: "Kevin Martinez", applicationDate: "2025-05-25", match: "70%", skills: "Swift, iOS Development, Objective-C", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '70%', skills: { relevance: 'Low', stars: 2, notes: 'Primarily iOS. Less backend focus.' }, title: { relevance: 'Low', stars: 2, notes: 'Mobile Developer.' }, work: { relevance: 'Low', stars: 2, notes: 'Developed several iOS apps.' }, experience: { relevance: 'Medium', stars: 3, notes: '5 years in mobile development.' }} },
                { id: "app010", name: "Ashley Hernandez", applicationDate: "2025-06-05", match: "68%", skills: "Kotlin, Android Development, Java", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '68%', skills: { relevance: 'Low', stars: 2, notes: 'Android focused. Some Java.' }, title: { relevance: 'Low', stars: 2, notes: 'Android Developer.' }, work: { relevance: 'Low', stars: 2, notes: 'Built Android applications.' }, experience: { relevance: 'Medium', stars: 3, notes: '4 years in Android.' }} },
                { id: "app011", name: "Brian Lopez", applicationDate: "2025-05-12", match: "93%", skills: "Java, Microservices, Kafka, Cassandra", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '93%', skills: { relevance: 'Very High', stars: 5, notes: 'Excellent with Java, Kafka, NoSQL.' }, title: { relevance: 'High', stars: 4, notes: 'Lead Software Engineer.' }, work: { relevance: 'Very High', stars: 5, notes: 'Architected event-driven systems.' }, experience: { relevance: 'Very High', stars: 5, notes: '9 years in distributed systems.' }} },
                { id: "app012", name: "Amanda Gonzalez", applicationDate: "2025-05-02", match: "90%", skills: "Python, FastAPI, PostgreSQL, Kubernetes", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '90%', skills: { relevance: 'High', stars: 4, notes: 'Strong Python/FastAPI, K8s experience.' }, title: { relevance: 'High', stars: 4, notes: 'Senior Backend Developer.' }, work: { relevance: 'High', stars: 4, notes: 'Built high-performance APIs.' }, experience: { relevance: 'High', stars: 4, notes: '7 years backend.' }} },
                { id: "app013", name: "Jason Perez", applicationDate: "2025-06-04", match: "87%", skills: "Node.js, Express, MongoDB, React", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '87%', skills: { relevance: 'Medium', stars: 3, notes: 'Full-stack MERN. Good Node.js.' }, title: { relevance: 'Medium', stars: 3, notes: 'JavaScript Developer.' }, work: { relevance: 'Medium', stars: 3, notes: 'Developed web portals.' }, experience: { relevance: 'High', stars: 4, notes: '6 years with Node.js and React.' }} },
                { id: "app014", name: "Nicole Sanchez", applicationDate: "2025-05-03", match: "84%", skills: "Java, Spring MVC, JSP, Oracle DB", status: "Interview Scheduled", statusColor: "blue", shortlisted: true, assessmentStatus: "Completed", questionnaireStatus: "Sent", matchDetails: { overallMatch: '84%', skills: { relevance: 'High', stars: 4, notes: 'Traditional Java stack, solid DB skills.' }, title: { relevance: 'Medium', stars: 3, notes: 'Java Developer.' }, work: { relevance: 'Medium', stars: 3, notes: 'Maintained legacy enterprise apps.' }, experience: { relevance: 'High', stars: 4, notes: '8 years with Java EE.' }} },
                { id: "app015", name: "Ryan Rivera", applicationDate: "2025-05-22", match: "81%", skills: "C++, Boost, Qt, Linux", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '81%', skills: { relevance: 'Medium', stars: 3, notes: 'Strong C++, systems programming.' }, title: { relevance: 'Medium', stars: 3, notes: 'Systems Engineer.' }, work: { relevance: 'Medium', stars: 3, notes: 'Developed low-level components.' }, experience: { relevance: 'Medium', stars: 3, notes: '5 years in C++.' }} },
                { id: "app016", name: "Kimberly Torres", applicationDate: "2025-06-02", match: "78%", skills: "Angular, TypeScript, RxJS, Ngrx", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '78%', skills: { relevance: 'Low', stars: 2, notes: 'Frontend Angular specialist.' }, title: { relevance: 'Low', stars: 2, notes: 'Frontend Engineer.' }, work: { relevance: 'Low', stars: 2, notes: 'Focused on UI development.' }, experience: { relevance: 'Medium', stars: 3, notes: '4 years with Angular.' }} },
                { id: "app017", name: "Gary Ramirez", applicationDate: "2025-05-04", match: "75%", skills: "Perl, CGI, Apache, MySQL", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '75%', skills: { relevance: 'Low', stars: 2, notes: 'Legacy Perl skills.' }, title: { relevance: 'Low', stars: 2, notes: 'Webmaster.' }, work: { relevance: 'Low', stars: 2, notes: 'Maintained older web systems.' }, experience: { relevance: 'Medium', stars: 3, notes: '7 years with Perl.' }} },
                { id: "app018", name: "Michelle Flores", applicationDate: "2025-05-28", match: "72%", skills: "Elixir, Phoenix, PostgreSQL", status: "Interview Scheduled", statusColor: "blue", shortlisted: true, assessmentStatus: "Pending", questionnaireStatus: "Completed", matchDetails: { overallMatch: '72%', skills: { relevance: 'Medium', stars: 3, notes: 'Good Elixir/Phoenix knowledge.' }, title: { relevance: 'Medium', stars: 3, notes: 'Functional Programmer.' }, work: { relevance: 'Medium', stars: 3, notes: 'Built real-time applications.' }, experience: { relevance: 'Medium', stars: 3, notes: '3 years with Elixir.' }} },
                { id: "app019", name: "Eric Morris", applicationDate: "2025-05-18", match: "69%", skills: "Rust, Actix, Tokio, WebAssembly", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '69%', skills: { relevance: 'Medium', stars: 3, notes: 'Emerging Rust skills, performance focus.' }, title: { relevance: 'Low', stars: 2, notes: 'Systems Programmer.' }, work: { relevance: 'Low', stars: 2, notes: 'Personal projects in Rust.' }, experience: { relevance: 'Low', stars: 2, notes: '2 years learning Rust.' }} },
                { id: "app020", name: "Donna Cook", applicationDate: "2025-05-08", match: "67%", skills: "Clojure, Datomic, Pedestal", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '67%', skills: { relevance: 'Medium', stars: 3, notes: 'Clojure and functional programming.' }, title: { relevance: 'Low', stars: 2, notes: 'Software Developer.' }, work: { relevance: 'Low', stars: 2, notes: 'Niche Clojure projects.' }, experience: { relevance: 'Low', stars: 2, notes: '3 years with Clojure.' }} },
                { id: "app021", name: "Justin Rogers", applicationDate: "2025-05-13", match: "95%", skills: "Java, Spring Boot, Kafka, AWS, Terraform", status: "Offer Extended", statusColor: "purple", shortlisted: true, assessmentStatus: "Completed", questionnaireStatus: "Completed", matchDetails: { overallMatch: '95%', skills: { relevance: 'Very High', stars: 5, notes: 'Top-tier Java, Kafka, AWS, IaC.' }, title: { relevance: 'Very High', stars: 5, notes: 'Principal Software Engineer.' }, work: { relevance: 'Very High', stars: 5, notes: 'Led design of complex distributed systems.' }, experience: { relevance: 'Very High', stars: 5, notes: '12 years experience.' }} },
                { id: "app022", name: "Laura Reed", applicationDate: "2025-05-09", match: "92%", skills: "Python, Machine Learning, TensorFlow, Scikit-learn", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '92%', skills: { relevance: 'High', stars: 4, notes: 'Strong ML background, Python expert.' }, title: { relevance: 'High', stars: 4, notes: 'Machine Learning Engineer.' }, work: { relevance: 'High', stars: 4, notes: 'Developed and deployed ML models.' }, experience: { relevance: 'High', stars: 4, notes: '6 years in ML.' }} },
                { id: "app023", name: "Brandon Bell", applicationDate: "2025-05-23", match: "89%", skills: ".NET Core, C#, Angular, SQL Server", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '89%', skills: { relevance: 'High', stars: 4, notes: 'Full-stack .NET and Angular.' }, title: { relevance: 'High', stars: 4, notes: 'Senior .NET Developer.' }, work: { relevance: 'High', stars: 4, notes: 'Built enterprise web applications.' }, experience: { relevance: 'High', stars: 4, notes: '7 years with .NET.' }} },
                { id: "app024", name: "Stephanie Murphy", applicationDate: "2025-05-19", match: "86%", skills: "JavaScript, Vue.js, Nuxt.js, Firebase", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '86%', skills: { relevance: 'Medium', stars: 3, notes: 'Vue.js expert, Firebase experience.' }, title: { relevance: 'Medium', stars: 3, notes: 'Frontend Developer.' }, work: { relevance: 'Medium', stars: 3, notes: 'Developed modern SPAs.' }, experience: { relevance: 'High', stars: 4, notes: '5 years with Vue.js.' }} },
                { id: "app025", name: "Patrick Bailey", applicationDate: "2025-05-06", match: "83%", skills: "Go, Gin, Docker, Prometheus, Grafana", status: "Interview Scheduled", statusColor: "blue", shortlisted: true, assessmentStatus: "Sent", questionnaireStatus: "Sent", matchDetails: { overallMatch: '83%', skills: { relevance: 'High', stars: 4, notes: 'Proficient in Go, good monitoring stack knowledge.' }, title: { relevance: 'Medium', stars: 3, notes: 'Backend Engineer.' }, work: { relevance: 'High', stars: 4, notes: 'Built and monitored microservices.' }, experience: { relevance: 'Medium', stars: 3, notes: '4 years with Go.' }} },
                { id: "app026", name: "Melissa Cooper", applicationDate: "2025-05-29", match: "80%", skills: "Ruby, Sinatra, Sidekiq, Redis", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '80%', skills: { relevance: 'Medium', stars: 3, notes: 'Good Ruby, background job processing.' }, title: { relevance: 'Medium', stars: 3, notes: 'Ruby Developer.' }, work: { relevance: 'Medium', stars: 3, notes: 'Worked on API services.' }, experience: { relevance: 'Medium', stars: 3, notes: '5 years with Ruby.' }} },
                { id: "app027", name: "Dennis Howard", applicationDate: "2025-05-11", match: "77%", skills: "PHP, Symfony, Doctrine, RabbitMQ", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '77%', skills: { relevance: 'Medium', stars: 3, notes: 'Symfony and message queue experience.' }, title: { relevance: 'Low', stars: 2, notes: 'Backend Developer (PHP).' }, work: { relevance: 'Medium', stars: 3, notes: 'Developed complex PHP applications.' }, experience: { relevance: 'Medium', stars: 3, notes: '6 years in PHP.' }} },
                { id: "app028", name: "Christina Ward", applicationDate: "2025-05-21", match: "74%", skills: "Scala, Play Framework, Akka HTTP", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '74%', skills: { relevance: 'High', stars: 4, notes: 'Solid Scala and Play framework.' }, title: { relevance: 'Medium', stars: 3, notes: 'Scala Developer.' }, work: { relevance: 'High', stars: 4, notes: 'Contributed to reactive systems.' }, experience: { relevance: 'Medium', stars: 3, notes: '4 years with Scala.' }} },
                { id: "app029", name: "Samuel Cox", applicationDate: "2025-05-07", match: "71%", skills: "Objective-C, Swift, Core Data", status: "Screening", statusColor: "yellow", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '71%', skills: { relevance: 'Low', stars: 2, notes: 'iOS specialist.' }, title: { relevance: 'Low', stars: 2, notes: 'Senior iOS Developer.' }, work: { relevance: 'Low', stars: 2, notes: 'Led iOS app projects.' }, experience: { relevance: 'Medium', stars: 3, notes: '6 years in iOS.' }} },
                { id: "app030", name: "Rebecca Gray", applicationDate: "2025-06-04", match: "68%", skills: "Java, Android SDK, Firebase ML Kit", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '68%', skills: { relevance: 'Low', stars: 2, notes: 'Android dev with some ML Kit.' }, title: { relevance: 'Low', stars: 2, notes: 'Mobile Application Developer.' }, work: { relevance: 'Low', stars: 2, notes: 'Integrated ML features in Android apps.' }, experience: { relevance: 'Medium', stars: 3, notes: '5 years Android, 1 year ML Kit.' }} }
            ],
            metrics: { total: 30, avgMatch: "81%", shortlisted: 5, interviews: 2, offers: 1, timeToFill: "N/A", topSource: "N/A" },
            skills: {
                mustHave: ["Java", "Spring Boot", "API Design", "SQL", "Microservices"],
                niceToHave: ["AWS", "Docker", "Kubernetes", "Kafka"]
            },
            funnel: [125, 80, 35, 15, 3],
            diversity: [45, 40, 15]
        },
        "product-manager": {
            applicants: [
                { id: "pm001", name: "David Lee", applicationDate: "2025-05-18", match: "90%", skills: "Product Strategy, Agile, Market Research, JIRA", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '90%', skills: { relevance: 'Very High', stars: 5, notes: 'Strong product strategy & agile exp.' }, title: { relevance: 'Very High', stars: 5, notes: 'Previous: Senior Product Manager.' }, work: { relevance: 'High', stars: 4, notes: 'Launched 3 successful products.' }, experience: { relevance: 'Very High', stars: 5, notes: '7 years in product management.' }} },
                { id: "pm002", name: "Sophia Miller", applicationDate: "2025-05-12", match: "88%", skills: "Roadmapping, User Stories, A/B Testing, Analytics", status: "Applied", statusColor: "green", shortlisted: false, assessmentStatus: "Pending", questionnaireStatus: "Pending", matchDetails: { overallMatch: '88%', skills: { relevance: 'High', stars: 4, notes: 'Excellent with roadmapping & analytics.' }, title: { relevance: 'High', stars: 4, notes: 'Product Owner for 3 years.' }, work: { relevance: 'Very High', stars: 5, notes: 'Managed SaaS product lifecycle.' }, experience: { relevance: 'High', stars: 4, notes: '5 years relevant experience.' }} }
            ],
            metrics: { total: 2, avgMatch: "89%", shortlisted: 0, interviews: 0, offers: 0, timeToFill: "N/A", topSource: "N/A" },
            skills: {
                mustHave: ["Product Strategy", "Agile Methodologies", "Market Analysis", "Roadmapping"],
                niceToHave: ["UX/UI Principles", "Data Analysis", "JIRA/Confluence"]
            },
            funnel: [75, 50, 20, 10, 2], // Example data
            diversity: [50, 30, 20] // Example data
        },
        "data-scientist": {
            applicants: [
                { id: "ds001", name: "Omar Ahmed", applicationDate: "2025-05-20", match: "95%", skills: "Machine Learning, Python, R, TensorFlow, SQL", status: "Offer Extended", statusColor: "purple", shortlisted: true, assessmentStatus: "Completed", questionnaireStatus: "Completed", matchDetails: { overallMatch: '95%', skills: { relevance: 'Very High', stars: 5, notes: 'Expert in ML, Python, TensorFlow.' }, title: { relevance: 'High', stars: 4, notes: 'Lead Data Scientist at previous firm.' }, work: { relevance: 'Very High', stars: 5, notes: 'Developed predictive models for finance.' }, experience: { relevance: 'Very High', stars: 5, notes: '6 years in data science.' }} }
            ],
            metrics: { total: 1, avgMatch: "95%", shortlisted: 1, interviews: 1, offers: 1, timeToFill: "50 days", topSource: "Company Website" },
            skills: {
                mustHave: ["Machine Learning", "Python", "Statistical Modeling", "Big Data Technologies (Spark/Hadoop)"],
                niceToHave: ["Deep Learning (TensorFlow/PyTorch)", "NLP", "Cloud (AWS/Azure/GCP)"]
            },
            funnel: [90, 60, 25, 12, 1], // Example data
            diversity: [40, 35, 25] // Example data
        }
    };

    const jobDisplayNames = {
        "sr-software-engineer": "Sr. Software Engineer (REQ-101)",
        "product-manager": "Product Manager (REQ-102)",
        "data-scientist": "Data Scientist (REQ-103)"
    };

    if (jobSelector) {
        const firstOption = jobSelector.options[0]; 
        jobSelector.innerHTML = ''; 
        if (firstOption) jobSelector.appendChild(firstOption); 

        Object.keys(jobSpecificData).forEach(jobId => {
            const option = document.createElement('option');
            option.value = jobId;
            option.textContent = jobDisplayNames[jobId] || jobId;
            jobSelector.appendChild(option);
        });
    }


    function updateJobContext(selectedJobText) {
        jobTitlePlaceholders.forEach(el => el.textContent = selectedJobText || "[Job Not Selected]");
        if (selectedJobText && selectedJobNameSpan && jobContextMessage) {
            selectedJobNameSpan.textContent = selectedJobText;
            jobContextMessage.style.display = 'block';
        } else if (jobContextMessage) {
            jobContextMessage.style.display = 'none';
        }
    }

    function showMainContent(sectionIdToShow = "job-applicants") {
        if(initialMessageSection) initialMessageSection.classList.remove('active');

        mainContentSections.forEach(section => section.classList.remove('active'));
        const targetSection = parentElement.querySelector(`#${sectionIdToShow}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        subNavLinks.forEach(s_link => {
            s_link.classList.remove('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
            s_link.classList.add('text-[var(--delta-gray-text-medium)]');
            if (s_link.getAttribute('data-section') === sectionIdToShow) {
                s_link.classList.add('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
                s_link.classList.remove('text-[var(--delta-gray-text-medium)]');
            }
        });
    }

    if (jobSelector) {
        jobSelector.addEventListener('change', function() {
            const selectedJobValue = this.value;
            currentJobId = selectedJobValue;
            currentPage = 1;
            if (filterBasicKeywordInput) filterBasicKeywordInput.value = '';
            if (filterApplicantStatusMainSelect) filterApplicantStatusMainSelect.value = '';
            currentFilters = { name: '', status: '' };

            const selectedJobText = jobDisplayNames[selectedJobValue] || selectedJobValue;


            if (selectedJobValue) {
                if(initialMessageSection) initialMessageSection.classList.remove('active');
                updateJobContext(selectedJobText.replace(/ \(REQ-\d+\)/, ''));
                showMainContent("job-applicants");
                loadJobSpecificContent(selectedJobValue, currentPage, currentFilters);
                showCustomAlert(`Switched to job: ${selectedJobText.replace(/ \(REQ-\d+\)/, '')}`);
            } else {
                currentJobId = null;
                updateJobContext('[Job Not Selected]');
                clearAllJobSpecificContent();
                mainContentSections.forEach(section => section.classList.remove('active'));
                if(initialMessageSection) initialMessageSection.classList.add('active');
                if(mainContentTitle) mainContentTitle.textContent = "Welcome, Recruiter!";

                subNavLinks.forEach(s_link => {
                    s_link.classList.remove('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
                    s_link.classList.add('text-[var(--delta-gray-text-medium)]');
                });
                 const jobAppTabLink = parentElement.querySelector('.sub-nav-link[data-section="job-applicants"]');
                 if (jobAppTabLink) {
                    jobAppTabLink.classList.add('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
                    jobAppTabLink.classList.remove('text-[var(--delta-gray-text-medium)]');
                 }

                if(jobContextMessage) jobContextMessage.style.display = 'none';
            }
        });
    }

    subNavLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const sectionId = this.dataset.section;
            const selectedJobValue = jobSelector ? jobSelector.value : "";

            if (!selectedJobValue && sectionId !== 'initial-message') {
                showCustomAlert("Please select a job requisition first.", 3000);
                return;
            }

            showMainContent(sectionId);

            if (sectionId === 'job-analytics' && selectedJobValue) {
                if (applicantFunnelChart && typeof applicantFunnelChart.resize === 'function') applicantFunnelChart.resize();
                if (jobDiversityChart && typeof jobDiversityChart.resize === 'function') jobDiversityChart.resize();
            }
        });
    });

    if (jobSelector) {
        const hasActualJobOptions = Object.keys(jobSpecificData).length > 0;
        const currentSelectedValue = jobSelector.value;

        if (currentSelectedValue === "" && hasActualJobOptions) {
            const firstJobId = Object.keys(jobSpecificData)[0];
            jobSelector.value = firstJobId;
            jobSelector.dispatchEvent(new Event('change'));
        } else if (currentSelectedValue !== "" && jobSpecificData[currentSelectedValue]) {
            jobSelector.dispatchEvent(new Event('change'));
        } else {
            if(initialMessageSection) initialMessageSection.classList.add('active');
            if(mainContentTitle) mainContentTitle.textContent = "Welcome, Recruiter!";
            clearAllJobSpecificContent();
            const jobAppTabLink = parentElement.querySelector('.sub-nav-link[data-section="job-applicants"]');
            if (jobAppTabLink) { 
                subNavLinks.forEach(sl => {
                    sl.classList.remove('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
                    sl.classList.add('text-[var(--delta-gray-text-medium)]');
                });
                jobAppTabLink.classList.add('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
                jobAppTabLink.classList.remove('text-[var(--delta-gray-text-medium)]');
            }
        }
    }


    function renderPaginationControls(jobId, totalApplicants, pageToRender) {
        const paginationContainer = parentElement.querySelector('#job-applicants-pagination');
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(totalApplicants / applicantsPerPage);
        if (totalPages <= 1) return;

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.className = 'px-4 py-2 bg-[var(--delta-gray-bg)] text-[var(--delta-text-secondary)] rounded-md hover:bg-[var(--delta-gray-border)] disabled:opacity-50 disabled:cursor-not-allowed';
        prevButton.disabled = pageToRender === 1;
        prevButton.addEventListener('click', () => {
            if (pageToRender > 1) {
                loadJobSpecificContent(jobId, pageToRender - 1, currentFilters);
            }
        });
        paginationContainer.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Page ${pageToRender} of ${totalPages}`;
        pageInfo.className = 'px-4 py-2 text-sm text-[var(--delta-gray-text-medium)]';
        paginationContainer.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.className = 'px-4 py-2 bg-[var(--delta-gray-bg)] text-[var(--delta-text-secondary)] rounded-md hover:bg-[var(--delta-gray-border)] disabled:opacity-50 disabled:cursor-not-allowed';
        nextButton.disabled = pageToRender === totalPages;
        nextButton.addEventListener('click', () => {
            if (pageToRender < totalPages) {
                loadJobSpecificContent(jobId, pageToRender + 1, currentFilters);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    function handleApplicantAction(jobId, applicantId, actionType) {
        const jobData = jobSpecificData[jobId];
        if (!jobData || !jobData.applicants) return;

        const applicantIndex = jobData.applicants.findIndex(app => app.id === applicantId);
        if (applicantIndex === -1) return;

        const applicant = jobData.applicants[applicantIndex];

        switch (actionType) {
            case 'shortlist':
                applicant.shortlisted = !applicant.shortlisted;
                showCustomAlert(`${applicant.name} ${applicant.shortlisted ? 'shortlisted' : 'removed from shortlist'}.`);
                break;
            case 'sendAssessment':
                applicant.assessmentStatus = 'Sent';
                showCustomAlert(`Assessment sent to ${applicant.name}.`);
                break;
            case 'sendQuestionnaire':
                applicant.questionnaireStatus = 'Sent';
                showCustomAlert(`Questionnaire sent to ${applicant.name}.`);
                break;
        }
        loadJobSpecificContent(jobId, currentPage, currentFilters);
    }

    function populateStatusFilterOptions(jobIdForData) {
        if (!filterApplicantStatusMainSelect) return;

        const currentVal = filterApplicantStatusMainSelect.value;
        filterApplicantStatusMainSelect.innerHTML = '<option value="">All Statuses</option>';

        const jobData = jobSpecificData[jobIdForData];
        let statuses;

        if (!jobData || !jobData.applicants || jobData.applicants.length === 0) {
            statuses = ["Applied", "Screening", "Assessment Pending", "Assessment Cleared", "Interview Scheduled", "Offer Extended", "Hired", "Rejected", "On Hold", "Withdrawn"];
        } else {
            statuses = [...new Set(jobData.applicants.map(app => app.status))].sort();
        }

        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            filterApplicantStatusMainSelect.appendChild(option);
        });

        if (statuses.includes(currentVal)) {
            filterApplicantStatusMainSelect.value = currentVal;
        } else {
             filterApplicantStatusMainSelect.value = "";
        }
    }

    function applyFiltersAndReload() {
        currentFilters.name = filterBasicKeywordInput ? filterBasicKeywordInput.value.trim().toLowerCase() : '';
        currentFilters.status = filterApplicantStatusMainSelect ? filterApplicantStatusMainSelect.value : '';

        if (advancedFiltersContainer && !advancedFiltersContainer.classList.contains('hidden')) {
            console.log("Advanced filters would be applied here if implemented.");
        }
        currentPage = 1;
        loadJobSpecificContent(currentJobId, currentPage, currentFilters);
    }

    if (applyJobApplicantsFiltersBtn) {
        applyJobApplicantsFiltersBtn.addEventListener('click', applyFiltersAndReload);
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const debouncedApplyFilters = debounce(applyFiltersAndReload, 300);

    if (filterBasicKeywordInput) {
        filterBasicKeywordInput.addEventListener('input', debouncedApplyFilters);
    }
    if (filterApplicantStatusMainSelect) {
        filterApplicantStatusMainSelect.addEventListener('change', applyFiltersAndReload);
    }

    function sortApplicants(applicants, column, direction) {
        if (!column) return applicants;

        return applicants.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            if (column === 'match') {
                valA = parseFloat(valA?.replace('%', '')) || 0;
                valB = parseFloat(valB?.replace('%', '')) || 0;
            } else if (column === 'applicationDate') {
                valA = a.applicationDate ? new Date(a.applicationDate).getTime() : 0;
                valB = b.applicationDate ? new Date(b.applicationDate).getTime() : 0;
            } else if (typeof valA === 'string' && typeof valB === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    function updateSortIndicators() {
        const headers = parentElement.querySelectorAll('#job-applicants-table th[data-sort]');
        headers.forEach(th => {
            const indicator = th.querySelector('.sort-indicator');
            if (indicator) {
                if (th.dataset.sort === currentSortColumn) {
                    indicator.textContent = currentSortDirection === 'asc' ? ' ▲' : ' ▼';
                } else {
                    indicator.textContent = '';
                }
            }
        });
    }

    function loadJobSpecificContent(jobId, page = 1, filters = { name: '', status: '' }) {
        currentJobId = jobId;
        currentPage = page; 
        currentFilters = filters;

        const data = jobSpecificData[jobId];
        if (!data) {
            console.warn(`No data found for job ID: ${jobId}`);
            clearAllJobSpecificContent();
            return;
        }

        const applicantsTableBody = parentElement.querySelector('#job-applicants-list');
        const noApplicantsMsg = parentElement.querySelector('#no-applicants-message');
        if (applicantsTableBody) applicantsTableBody.innerHTML = '';

        let allApplicantsForJob = data.applicants || [];
        populateStatusFilterOptions(jobId);

        let filteredApplicants = allApplicantsForJob;
        if (filters.name) {
            const keyword = filters.name.toLowerCase();
            filteredApplicants = filteredApplicants.filter(app =>
                app.name.toLowerCase().includes(keyword) ||
                (app.skills && app.skills.toLowerCase().includes(keyword))
            );
        }
        if (filters.status) {
            filteredApplicants = filteredApplicants.filter(app => app.status === filters.status);
        }

        if (currentSortColumn) {
            filteredApplicants = sortApplicants([...filteredApplicants], currentSortColumn, currentSortDirection);
        }

        if (filteredApplicants.length > 0) {
            if(noApplicantsMsg) noApplicantsMsg.style.display = 'none';
            const startIndex = (currentPage - 1) * applicantsPerPage; 
            const endIndex = startIndex + applicantsPerPage;
            const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

            paginatedApplicants.forEach(app => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-[var(--delta-gray-bg-extralight)] transition-colors duration-150';
                const tdName = document.createElement('td');
                tdName.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--delta-text-primary)]';
                tdName.innerHTML = `${app.name} ${app.shortlisted ? '<span class="text-xs text-[var(--delta-accent-gold)] ml-1">(Shortlisted)</span>' : ''}`;
                tr.appendChild(tdName);
                const tdDate = document.createElement('td');
                tdDate.className = 'px-6 py-4 whitespace-nowrap text-sm text-[var(--delta-gray-text-light)]';
                tdDate.textContent = app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A';
                tr.appendChild(tdDate);
                const tdMatch = document.createElement('td');
                tdMatch.className = 'px-6 py-4 whitespace-nowrap text-sm text-[var(--delta-red)] font-semibold';
                tdMatch.textContent = app.match;
                tr.appendChild(tdMatch);
                const tdStatus = document.createElement('td');
                tdStatus.className = 'px-6 py-4 whitespace-nowrap text-sm';
                let statusColorClass = 'bg-gray-100 text-gray-700';
                if (app.statusColor === 'green') statusColorClass = 'bg-green-100 text-green-800';
                else if (app.statusColor === 'yellow') statusColorClass = 'bg-yellow-100 text-yellow-800';
                else if (app.statusColor === 'blue') statusColorClass = 'bg-blue-100 text-blue-800';
                else if (app.statusColor === 'purple') statusColorClass = 'bg-purple-100 text-purple-800';
                tdStatus.innerHTML = `<span class="${statusColorClass} px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full">${app.status}</span>`;
                tr.appendChild(tdStatus);
                const tdActions = document.createElement('td');
                tdActions.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium';
                const actionsWrapper = document.createElement('div');
                actionsWrapper.className = 'flex items-center space-x-2';
                const viewMatchSummaryButton = document.createElement('button');
                viewMatchSummaryButton.className = 'view-match-summary-btn text-[var(--delta-blue)] hover:text-[var(--delta-blue-light)] p-1.5 rounded-md hover:bg-[var(--delta-gray-bg)]';
                viewMatchSummaryButton.title = 'View Match Summary';
                viewMatchSummaryButton.innerHTML = '<i class="fas fa-search-plus fa-fw"></i>';
                viewMatchSummaryButton.onclick = () => openMatchBreakdownPanel(app.matchDetails || sampleCandidateData, app.name);
                actionsWrapper.appendChild(viewMatchSummaryButton);
                const actionDropdownContainer = document.createElement('div');
                actionDropdownContainer.className = 'relative inline-block text-left';
                const takeActionButton = document.createElement('button');
                takeActionButton.type = 'button';
                takeActionButton.className = 'take-action-btn inline-flex justify-center w-full rounded-md border border-[var(--delta-gray-border)] shadow-sm px-3 py-1.5 bg-white text-sm font-medium text-[var(--delta-gray-text-medium)] hover:bg-[var(--delta-gray-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--delta-gray-bg)] focus:ring-[var(--delta-blue)]';
                takeActionButton.innerHTML = 'Actions <i class="fas fa-chevron-down ml-2 -mr-1 h-5 w-5"></i>';
                takeActionButton.setAttribute('aria-haspopup', 'true');
                takeActionButton.setAttribute('aria-expanded', 'false');
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden z-20';
                dropdownMenu.setAttribute('role', 'menu');
                dropdownMenu.setAttribute('aria-orientation', 'vertical');
                dropdownMenu.setAttribute('aria-labelledby', `actions-menu-${app.id}`);
                takeActionButton.id = `actions-menu-${app.id}`;
                const actionsList = [
                    { label: "Assign Assessment", action: "assign-assessment", category: "Assessment & Evaluation" },
                    { label: "Send Questionnaire", action: "send-questionnaire", category: "Assessment & Evaluation" },
                    { label: "Request Documents", action: "request-documents", category: "Assessment & Evaluation" },
                    { label: "Send Email", action: "send-email", category: "Communication & Engagement" },
                    { label: "Log Activity/Add Note", action: "log-activity", category: "Communication & Engagement" },
                    { label: "Schedule Interview", action: "schedule-interview", category: "Interviewing" },
                    { label: "Request Interview Availability", action: "request-interview-availability", category: "Interviewing" },
                    { label: "Shortlist Candidate", action: "shortlist-candidate", category: "Candidate Progression" },
                    { label: "Move to Stage...", action: "move-to-stage", category: "Candidate Progression" },
                    { label: "Share Candidate Profile", action: "share-candidate-profile", category: "Candidate Progression" },
                    { label: "Prepare Offer", action: "prepare-offer", category: "Offer & Hiring" },
                    { label: "Mark as Hired", action: "mark-as-hired", category: "Offer & Hiring" },
                    { label: "Reject Candidate", action: "reject-candidate", category: "Dispositioning / Archiving" },
                    { label: "Archive for Future Consideration", action: "archive-for-future", category: "Dispositioning / Archiving" },
                    { label: "Place on Hold", action: "place-on-hold", category: "Dispositioning / Archiving" },
                    { label: "View Full Candidate Profile", action: "view-full-profile", category: "Administrative" },
                    { label: "Edit Basic Information", action: "edit-basic-info", category: "Administrative" }
                ];
                let currentCategory = "";
                const menuItemsWrapper = document.createElement('div');
                menuItemsWrapper.className = 'py-1 max-h-72 overflow-y-auto';
                actionsList.forEach(item => {
                    if (item.category && item.category !== currentCategory) {
                        if (currentCategory !== "") {
                            const divider = document.createElement('div');
                            divider.className = "border-t border-[var(--delta-gray-border)] my-1";
                            menuItemsWrapper.appendChild(divider);
                        }
                        const categoryHeader = document.createElement('div');
                        categoryHeader.className = "px-4 py-2 text-xs font-semibold text-[var(--delta-gray-text-light)] uppercase tracking-wider";
                        categoryHeader.textContent = item.category;
                        menuItemsWrapper.appendChild(categoryHeader);
                        currentCategory = item.category;
                    }
                    const actionLink = document.createElement('a');
                    actionLink.href = '#';
                    actionLink.className = 'block px-4 py-2 text-sm text-[var(--delta-text-secondary)] hover:bg-[var(--delta-gray-bg)] hover:text-[var(--delta-text-primary)]';
                    actionLink.setAttribute('role', 'menuitem');
                    actionLink.dataset.action = item.action;
                    actionLink.dataset.applicantId = app.id;
                    actionLink.textContent = item.label;
                    actionLink.onclick = (e) => {
                        e.preventDefault();
                        handleDropdownAction(jobId, app.id, app.name, item.action);
                        dropdownMenu.classList.add('hidden');
                    };
                    menuItemsWrapper.appendChild(actionLink);
                });
                dropdownMenu.appendChild(menuItemsWrapper);
                takeActionButton.onclick = (event) => {
                    event.stopPropagation();
                    document.querySelectorAll('.take-action-btn + div:not(.hidden)').forEach(openDropdown => {
                        if (openDropdown !== dropdownMenu) {
                            openDropdown.classList.add('hidden');
                            openDropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
                        }
                    });
                    dropdownMenu.classList.toggle('hidden');
                    takeActionButton.setAttribute('aria-expanded', dropdownMenu.classList.contains('hidden') ? 'false' : 'true');
                };
                actionDropdownContainer.appendChild(takeActionButton);
                actionDropdownContainer.appendChild(dropdownMenu);
                actionsWrapper.appendChild(actionDropdownContainer);
                tdActions.appendChild(actionsWrapper);
                tr.appendChild(tdActions);
                if (applicantsTableBody) applicantsTableBody.appendChild(tr);
            });
            renderPaginationControls(jobId, filteredApplicants.length, currentPage); 
        } else {
            if(noApplicantsMsg) noApplicantsMsg.style.display = 'block';
            const paginationContainer = parentElement.querySelector('#job-applicants-pagination');
            if (paginationContainer) paginationContainer.innerHTML = '';
        }

        const jobTypeSuffix = jobId.startsWith('sr-software') ? 'swe' : (jobId.startsWith('product-manager') ? 'pm' : 'ds');
        const mustHaveListContainerId = `must-have-skills-list-${jobTypeSuffix}`;
        const niceToHaveListContainerId = `nice-to-have-skills-list-${jobTypeSuffix}`;

        parentElement.querySelectorAll('[id^="must-have-skills-list-"]').forEach(ul => { if(ul.parentElement) ul.parentElement.style.display = 'none';});
        parentElement.querySelectorAll('[id^="nice-to-have-skills-list-"]').forEach(ul => { if(ul.parentElement) ul.parentElement.style.display = 'none';});

        const mustHaveUl = parentElement.querySelector(`#${mustHaveListContainerId}`);
        const niceToHaveUl = parentElement.querySelector(`#${niceToHaveListContainerId}`);

        if (mustHaveUl && mustHaveUl.parentElement && data.skills.mustHave) {
            mustHaveUl.parentElement.style.display = 'block';
            mustHaveUl.innerHTML = data.skills.mustHave.map(skill => `<li class="flex justify-between items-center text-sm text-[var(--delta-gray-text-light)]">${skill} <button class="add-skill-to-filter-btn text-xs bg-[rgba(${deltaBlueRgb},0.1)] text-[var(--delta-blue)] hover:bg-[rgba(${deltaBlueRgb},0.2)] px-2 py-1 rounded-full" data-skill="${skill}">Add</button></li>`).join('');
        }
        if (niceToHaveUl && niceToHaveUl.parentElement && data.skills.niceToHave) {
            niceToHaveUl.parentElement.style.display = 'block';
            niceToHaveUl.innerHTML = data.skills.niceToHave.map(skill => `<li class="flex justify-between items-center text-sm text-[var(--delta-gray-text-light)]">${skill} <button class="add-skill-to-filter-btn text-xs bg-[rgba(${deltaBlueRgb},0.1)] text-[var(--delta-blue)] hover:bg-[rgba(${deltaBlueRgb},0.2)] px-2 py-1 rounded-full" data-skill="${skill}">Add</button></li>`).join('');
        }

        const searchSkillsInputScoped = parentElement.querySelector('#search-skills');
        parentElement.querySelectorAll('.add-skill-to-filter-btn').forEach(button => {
            button.onclick = () => {
                const skill = button.dataset.skill;
                if(searchSkillsInputScoped){
                    if (searchSkillsInputScoped.value.trim() === '') {
                        searchSkillsInputScoped.value = skill;
                    } else {
                        const existingSkills = searchSkillsInputScoped.value.split(',').map(s => s.trim().toLowerCase());
                        if (!existingSkills.includes(skill.toLowerCase())) searchSkillsInputScoped.value += `, ${skill}`;
                    }
                    showCustomAlert(`"${skill}" added to search filters.`);
                }
            };
        });

        parentElement.querySelector('#metric-job-total-applicants').textContent = data.metrics.total || 'N/A';
        parentElement.querySelector('#metric-job-avg-match').textContent = data.metrics.avgMatch || 'N/A';
        parentElement.querySelector('#metric-job-shortlisted').textContent = data.metrics.shortlisted || 'N/A';
        parentElement.querySelector('#metric-job-interviews').textContent = data.metrics.interviews || 'N/A';
        parentElement.querySelector('#metric-job-offers').textContent = data.metrics.offers || 'N/A';
        parentElement.querySelector('#metric-job-time-to-fill').textContent = data.metrics.timeToFill || 'N/A';
        parentElement.querySelector('#metric-job-source').textContent = data.metrics.topSource || 'N/A';

        initializeOrUpdateJobAnalyticsCharts(jobId, data.funnel, data.diversity);
        updateSortIndicators();
    }

    function clearAllJobSpecificContent() {
        if (filterBasicKeywordInput) filterBasicKeywordInput.value = '';
        if (filterApplicantStatusMainSelect) {
            filterApplicantStatusMainSelect.innerHTML = '<option value="">All Statuses</option>';
            const defaultStatuses = ["Applied", "Screening", "Assessment Pending", "Assessment Cleared", "Interview Scheduled", "Offer Extended", "Hired", "Rejected", "On Hold", "Withdrawn"];
            defaultStatuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                filterApplicantStatusMainSelect.appendChild(option);
            });
            filterApplicantStatusMainSelect.value = '';
        }
        currentFilters = { name: '', status: '' };

        const applicantsList = parentElement.querySelector('#job-applicants-list');
        const noApplicantsMsg = parentElement.querySelector('#no-applicants-message');
        if(applicantsList) applicantsList.innerHTML = '';
        if(noApplicantsMsg) noApplicantsMsg.style.display = 'block';

        parentElement.querySelectorAll('[id^="must-have-skills-list-"]').forEach(ul => {ul.innerHTML = ''; if(ul.parentElement) ul.parentElement.style.display = 'none'});
        parentElement.querySelectorAll('[id^="nice-to-have-skills-list-"]').forEach(ul => {ul.innerHTML = ''; if(ul.parentElement) ul.parentElement.style.display = 'none'});

        const metricIds = ['metric-job-total-applicants', 'metric-job-avg-match', 'metric-job-shortlisted', 'metric-job-interviews', 'metric-job-offers', 'metric-job-time-to-fill', 'metric-job-source'];
        metricIds.forEach(id => { const el = parentElement.querySelector(`#${id}`); if(el) el.textContent = 'N/A'; });

        if (applicantFunnelChart && typeof applicantFunnelChart.destroy === 'function') applicantFunnelChart.destroy();
        if (jobDiversityChart && typeof jobDiversityChart.destroy === 'function') jobDiversityChart.destroy();
        initializeOrUpdateJobAnalyticsCharts(null, [0,0,0,0,0], [0,0,0]);
    }


    function initializeOrUpdateJobAnalyticsCharts(jobId, funnelValues, diversityValues) {
        const currentFunnelData = funnelValues || (jobId && jobSpecificData[jobId] ? (jobSpecificData[jobId].funnel || [0,0,0,0,0]) : [0,0,0,0,0]);
        const currentDiversityData = diversityValues || (jobId && jobSpecificData[jobId] ? (jobSpecificData[jobId].diversity || [0,0,0]) : [0,0,0]);
        
        const funnelCtx = parentElement.querySelector('#applicantFunnelChart')?.getContext('2d');
        if (funnelCtx) {
            if (applicantFunnelChart && typeof applicantFunnelChart.destroy === 'function') applicantFunnelChart.destroy(); 
            applicantFunnelChart = new Chart(funnelCtx, {
                type: 'bar',
                data: { 
                    labels: ['Applied', 'Screened', 'Shortlisted', 'Interviewed', 'Offered'], 
                    datasets: [{ 
                        label: 'Applicant Funnel', 
                        data: currentFunnelData, 
                        backgroundColor: chartColors.slice(0, 5) // Use a slice of the colorful palette
                    }] 
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: {y:{beginAtZero:true}} }
            });
        }

        const diversityCtx = parentElement.querySelector('#jobDiversityChart')?.getContext('2d');
        if (diversityCtx) {
            if (jobDiversityChart && typeof jobDiversityChart.destroy === 'function') jobDiversityChart.destroy();
            jobDiversityChart = new Chart(diversityCtx, {
                type: 'pie',
                data: { 
                    labels: ['Group Alpha', 'Group Beta', 'Group Gamma', 'Group Delta', 'Group Epsilon'], 
                    datasets: [{ 
                        label: 'Applicant Demographics', 
                        data: currentDiversityData.concat(Array(Math.max(0, 5 - currentDiversityData.length)).fill(10)), 
                        backgroundColor: chartColors.slice(0, 5) 
                    }] 
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { 
                        legend: { position: 'right' },
                        title: { // Added title configuration
                            display: true,
                            text: 'Applicant Demographics Overview',
                            padding: {
                                top: 10,
                                bottom: 10
                            },
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    } 
                }
            });
            // Update the h5 title above the chart as well
            const diversityChartTitleElement = parentElement.querySelector('#jobDiversityChart')?.closest('div.bg-\\[var\\(--delta-gray-bg\\)\\]')?.querySelector('h5');
            if (diversityChartTitleElement) {
                diversityChartTitleElement.innerHTML = 'Applicant Demographics Overview';
            }
        }
    }

    function showCustomAlert(message, duration = 3000) {
        const alertBox = parentElement.querySelector('#custom-alert-box');
        const alertMessage = parentElement.querySelector('#custom-alert-message');
        if(!alertBox || !alertMessage) return;
        alertMessage.textContent = message;
        alertBox.style.display = 'block';
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, duration);
    }

    const engageModal = parentElement.querySelector('#engage-candidates-modal');
    const openEngageModalBtn = parentElement.querySelector('#engage-candidates-btn');
    const closeEngageModalBtn = parentElement.querySelector('#close-engage-modal-btn');
    const cancelEngageActionBtn = parentElement.querySelector('#cancel-engage-action-btn');
    const proceedEngageActionBtn = parentElement.querySelector('#proceed-engage-action-btn');


    if (openEngageModalBtn && engageModal) openEngageModalBtn.addEventListener('click', () => {
        if (jobSelector && !jobSelector.value) { showCustomAlert("Please select a job first to engage candidates.", 3000); return; }
        engageModal.style.display = 'flex';
    });
    if (closeEngageModalBtn && engageModal) closeEngageModalBtn.addEventListener('click', () => engageModal.style.display = 'none');
    if (cancelEngageActionBtn && engageModal) cancelEngageActionBtn.addEventListener('click', () => engageModal.style.display = 'none');
    if (proceedEngageActionBtn && engageModal) proceedEngageActionBtn.addEventListener('click', () => { showCustomAlert('Proceeding with selected campaign objective!'); engageModal.style.display = 'none'; });

    if (engageModal) {
        const campaignObjectiveItems = engageModal.querySelectorAll('.modal-body ul li');
        campaignObjectiveItems.forEach(item => {
            item.addEventListener('click', () => {
                campaignObjectiveItems.forEach(i => i.classList.remove('bg-[rgba(${deltaBlueRgb},0.1)]', 'font-semibold', 'text-[var(--delta-blue)]'));
                item.classList.add('bg-[rgba(${deltaBlueRgb},0.1)]', 'font-semibold', 'text-[var(--delta-blue)]');
            });
        });
    }

    document.addEventListener('click', function(event) {
        const target = event.target;
        const currentMatchPanelModal = document.querySelector('#match-breakdown-panel'); 

        if (currentMatchPanelModal) {
            if (target.matches('#close-match-panel-btn') || target.closest('#close-match-panel-btn') ||
                target.matches('#close-match-panel-btn-secondary') || target.closest('#close-match-panel-btn-secondary')) {
                if (currentMatchPanelModal.contains(target)) { 
                    currentMatchPanelModal.style.display = 'none';
                }
            }
        }

        const openDropdown = document.querySelector('.take-action-btn + div:not(.hidden)'); 
        if (openDropdown && !target.closest('.relative.inline-block')) {
            openDropdown.classList.add('hidden');
            if (openDropdown.previousElementSibling) {
                 openDropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
            }
        }
    });

    window.addEventListener('click', (event) => {
        const currentMatchPanelModal = document.querySelector('#match-breakdown-panel'); 
        if (engageModal && event.target === engageModal) engageModal.style.display = 'none';
        if (currentMatchPanelModal && event.target === currentMatchPanelModal) {
            currentMatchPanelModal.style.display = 'none';
        }
    });

    function handleDropdownAction(jobId, applicantId, applicantName, action) {
        const applicant = jobSpecificData[jobId]?.applicants.find(app => app.id === applicantId);
        switch (action) {
            case 'shortlist-candidate':
                if (applicant) {
                    applicant.shortlisted = !applicant.shortlisted;
                    showCustomAlert(`${applicantName} ${applicant.shortlisted ? 'shortlisted' : 'removed from shortlist'}.`);
                    loadJobSpecificContent(jobId, currentPage, currentFilters);
                }
                break;
            case 'assign-assessment':
                if (applicant) {
                    applicant.status = 'Assessment Sent';
                    applicant.assessmentStatus = 'Sent';
                    showCustomAlert(`Assessment assigned to ${applicantName}.`);
                    loadJobSpecificContent(jobId, currentPage, currentFilters);
                }
                break;
            case 'send-questionnaire':
                 if (applicant) {
                    applicant.status = 'Questionnaire Sent';
                    applicant.questionnaireStatus = 'Sent';
                    showCustomAlert(`Questionnaire sent to ${applicantName}.`);
                    loadJobSpecificContent(jobId, currentPage, currentFilters);
                }
                break;
            case 'reject-candidate':
                if (applicant) {
                    applicant.status = 'Rejected';
                    showCustomAlert(`${applicantName} has been rejected (placeholder).`);
                    loadJobSpecificContent(jobId, currentPage, currentFilters);
                }
                break;
            default:
                showCustomAlert(`Action "${action.replace(/-/g, ' ')}" selected for ${applicantName}. (Placeholder)`);
        }
        console.log(`Action: ${action}, Applicant ID: ${applicantId}, Job ID: ${jobId}`);
    }

    const poolTabs = parentElement.querySelectorAll('#my-lists .screening-main-tab-btn');
    const poolTabContents = parentElement.querySelectorAll('#my-lists .screening-main-tab-content');
    poolTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            poolTabs.forEach(t => t.classList.remove('active', 'text-[var(--delta-blue)]', 'border-[var(--delta-blue)]'));
            poolTabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active', 'text-[var(--delta-blue)]', 'border-[var(--delta-blue)]');
            const targetContentId = tab.dataset.tab + '-content';
            const targetElement = parentElement.querySelector(`#${targetContentId}`);
            if (targetElement) targetElement.classList.add('active');
        });
    });
    if (poolTabs.length > 0 && !parentElement.querySelector('#my-lists .screening-main-tab-btn.active')) {
        poolTabs[0].click();
    }

    const searchSkillsInput = parentElement.querySelector('#search-skills');
    const copySkillsButtons = [
        { id: 'copy-must-have-skills-swe', listSelector: '#must-have-skills-list-swe', type: "SWE Must-have skills" },
        { id: 'copy-nice-to-have-skills-swe', listSelector: '#nice-to-have-skills-list-swe', type: "SWE Nice-to-have skills" },
        { id: 'copy-must-have-skills-pm', listSelector: '#must-have-skills-list-pm', type: "PM Must-have skills" },
        { id: 'copy-nice-to-have-skills-pm', listSelector: '#nice-to-have-skills-list-pm', type: "PM Nice-to-have skills" },
        { id: 'copy-must-have-skills-ds', listSelector: '#must-have-skills-list-ds', type: "DS Must-have skills" },
        { id: 'copy-nice-to-have-skills-ds', listSelector: '#nice-to-have-skills-list-ds', type: "DS Nice-to-have skills" }
    ];
    copySkillsButtons.forEach(config => {
        const btn = parentElement.querySelector(`#${config.id}`);
        if (btn) btn.addEventListener('click', () => copySkillsFromList(config.listSelector, config.type));
    });

    function copySkillsFromList(listSelector, type) {
        const listElement = parentElement.querySelector(listSelector);
        if (!listElement) {
            console.warn(`Element with selector ${listSelector} not found for copying skills.`);
            return;
        }
        const skills = Array.from(listElement.querySelectorAll('li')).map(li => li.firstChild.textContent.trim()).join(', ');
        if (skills) {
            copyToClipboard(skills, type);
        } else {
            showCustomAlert(`No skills to copy from ${type}.`, 2000);
        }
    }
    function copyToClipboard(text, type) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => showCustomAlert(`${type} copied!`)).catch(err => fallbackCopyToClipboard(text, type));
        } else {
            fallbackCopyToClipboard(text, type);
        }
    }
    function fallbackCopyToClipboard(text, type) {
        const ta = document.createElement('textarea');
        ta.value=text;
        Object.assign(ta.style,{position:'fixed',left:'-9999px',top:'-9999px'});
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try {document.execCommand('copy')?showCustomAlert(`${type} copied (fallback)!`):showCustomAlert(`Failed to copy ${type}.`);}
        catch(err){showCustomAlert(`Failed to copy ${type}.`);}
        document.body.removeChild(ta);
    }

    const tableHeaders = parentElement.querySelectorAll('#job-applicants-table th[data-sort]');
    tableHeaders.forEach(th => {
        th.addEventListener('click', () => {
            const sortColumn = th.dataset.sort;
            if (currentSortColumn === sortColumn) {
                currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortColumn = sortColumn;
                currentSortDirection = 'asc';
            }
            currentPage = 1;
            loadJobSpecificContent(currentJobId, currentPage, currentFilters);
        });
    });

} 

const sampleCandidateData = { overallMatch: "85%", skills: { relevance: "High", stars: 4, notes: "Excellent match for Java, Spring Boot." }, title: { relevance: "Medium", stars: 3, notes: "Aligns with 'Senior Developer'." }, work: { relevance: "High", stars: 4, notes: "SaaS project experience." }, experience: { relevance: "Very High", stars: 5, notes: "7 years relevant." }};

function renderStarRating(c) {
    return ('★'.repeat(c)+'☆'.repeat(5-c));
}

function openMatchBreakdownPanel(data, candidateName) {
    const modalToOpen = document.querySelector('#match-breakdown-panel'); 

    if(!modalToOpen) {
        console.error("Screen Candidates Module: #match-breakdown-panel not found. Cannot display modal.");
        return;
    }

    const modalTitle = modalToOpen.querySelector('.modal-title');
    if (modalTitle && candidateName) {
        modalTitle.textContent = `Candidate Match Summary: ${candidateName}`;
    } else if (modalTitle) {
        modalTitle.textContent = 'Candidate Match Summary';
    }

    const S=(id,val)=>{
        const el=modalToOpen.querySelector(`#${id}`);
        if(el) {
            el.textContent=val||'N/A';
        }
    };

    S('overall-match-score', data.overallMatch);
    S('skills-match-relevance', data.skills.relevance); S('skills-match-stars', renderStarRating(data.skills.stars)); S('skills-match-notes', data.skills.notes);
    S('title-relevance-relevance', data.title.relevance); S('title-relevance-stars', renderStarRating(data.title.stars)); S('title-relevance-notes', data.title.notes);
    S('work-relevance-relevance', data.work.relevance); S('work-relevance-stars', renderStarRating(data.work.stars)); S('work-relevance-notes', data.work.notes);
    S('experience-relevance-relevance', data.experience.relevance); S('experience-relevance-stars', renderStarRating(data.experience.stars)); S('experience-relevance-notes', data.experience.notes);

    modalToOpen.style.display='flex';
}

function activateScreenCandidatesSubTab(sectionId) {
    const jobSelector = document.querySelector('#screen-candidates-module-wrapper #job-selector'); 
    const parentElement = document.querySelector('#screen-candidates-module-wrapper'); 

    if (!parentElement) return;

    const initialMessageSection = parentElement.querySelector('#initial-message');
    const mainContentSections = parentElement.querySelectorAll('.main-content-section');
    const subNavLinks = parentElement.querySelectorAll('.sub-nav-link');

    if (jobSelector && jobSelector.value) { 
        if(initialMessageSection) initialMessageSection.classList.remove('active');
         mainContentSections.forEach(section => section.classList.remove('active'));
        const targetSection = parentElement.querySelector(`#${sectionId}`);
        if (targetSection) targetSection.classList.add('active');

        subNavLinks.forEach(s_link => {
            s_link.classList.remove('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
            s_link.classList.add('text-[var(--delta-gray-text-medium)]');
            if (s_link.getAttribute('data-section') === sectionId) {
                s_link.classList.add('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
                s_link.classList.remove('text-[var(--delta-gray-text-medium)]');
            }
        });

    } else if (sectionId === 'initial-message') { 
         mainContentSections.forEach(section => section.classList.remove('active'));
        if(initialMessageSection) initialMessageSection.classList.add('active');
         subNavLinks.forEach(s_link => { 
            s_link.classList.remove('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
            s_link.classList.add('text-[var(--delta-gray-text-medium)]');
         });
         const jobAppTabLink = parentElement.querySelector('.sub-nav-link[data-section="job-applicants"]');
         if (jobAppTabLink) {
            jobAppTabLink.classList.add('active', 'border-l', 'border-t', 'border-r', 'rounded-t', 'text-[var(--delta-blue)]', 'font-semibold');
            jobAppTabLink.classList.remove('text-[var(--delta-gray-text-medium)]');
         }
    } else { 
        const alertFunc = parentElement.showCustomAlert || window.showCustomAlert; 
        if(alertFunc) alertFunc("Please select a job requisition first to view this section.", 3000);
        
        mainContentSections.forEach(section => section.classList.remove('active'));
        if(initialMessageSection) initialMessageSection.classList.add('active');
    }
}
