export const capabilitiesData = [
    { id: 'cap1', name: 'Flight Operations' },
    { id: 'cap2', name: 'Aircraft Maintenance & Engineering' },
    { id: 'cap3', name: 'Air Traffic Management' },
    { id: 'cap4', name: 'Aviation Safety & Compliance' },
    { id: 'cap5', name: 'Airport Operations & Management' },
    { id: 'cap6', name: 'Product Management' },
    { id: 'cap7', name: 'Software Engineering' },
];

export const competenciesData = [
    // Flight Operations Competencies
    {
        id: 'comp101',
        capabilityId: 'cap1',
        name: 'Flight Planning & Navigation',
        behaviours: [
            "Develops comprehensive flight plans considering weather, NOTAMs, fuel requirements, and aircraft performance.",
            "Executes flights accurately along planned routes using various navigation systems (GPS, VOR, NDB).",
            "Manages in-flight diversions and contingencies effectively.",
            "Ensures compliance with all air traffic control clearances and instructions."
        ]
    },
    {
        id: 'comp102',
        capabilityId: 'cap1',
        name: 'Crew Resource Management (CRM)',
        behaviours: [
            "Fosters open communication, mutual respect, and effective teamwork within the flight and cabin crew.",
            "Manages workload, stress, and fatigue to maintain optimal crew performance.",
            "Utilizes all available resources (human, hardware, information) to ensure safe and efficient flight operations.",
            "Assertively voices concerns and challenges decisions when safety is compromised."
        ]
    },
    {
        id: 'comp103',
        capabilityId: 'cap1',
        name: 'Aircraft Systems Operation',
        behaviours: [
            "Demonstrates thorough knowledge of all aircraft systems (e.g., powerplant, hydraulics, avionics, electrical).",
            "Operates aircraft systems according to flight manual procedures and checklists.",
            "Identifies and responds appropriately to system malfunctions and abnormalities.",
            "Manages aircraft performance within operational limits."
        ]
    },

    // Aircraft Maintenance & Engineering Competencies
    {
        id: 'comp201',
        capabilityId: 'cap2',
        name: 'Aircraft Systems Troubleshooting & Repair',
        behaviours: [
            "Diagnoses complex technical issues across various aircraft systems (avionics, hydraulics, powerplant, structures).",
            "Utilizes technical manuals, schematics, and diagnostic equipment effectively.",
            "Performs repairs and component replacements according to approved maintenance procedures.",
            "Documents all maintenance actions accurately and comprehensively."
        ]
    },
    {
        id: 'comp202',
        capabilityId: 'cap2',
        name: 'Maintenance Procedures & Airworthiness',
        behaviours: [
            "Performs scheduled and unscheduled maintenance tasks in compliance with manufacturer and regulatory standards.",
            "Ensures all work adheres to airworthiness directives (ADs) and service bulletins (SBs).",
            "Maintains meticulous records of all maintenance activities, ensuring traceability.",
            "Conducts thorough inspections to verify aircraft serviceability."
        ]
    },
    {
        id: 'comp203',
        capabilityId: 'cap2',
        name: 'Avionics & Electrical Systems Maintenance',
        behaviours: [
            "Tests, troubleshoots, and repairs aircraft communication, navigation, and flight control systems.",
            "Installs and integrates new avionics equipment.",
            "Manages aircraft electrical power generation and distribution systems.",
            "Ensures compliance with electromagnetic interference (EMI) standards."
        ]
    },

    // Air Traffic Management Competencies
    {
        id: 'comp301',
        capabilityId: 'cap3',
        name: 'Airspace Control & Separation',
        behaviours: [
            "Manages aircraft movements within designated airspace to ensure safe separation standards are maintained.",
            "Issues clear, concise, and timely control instructions to pilots.",
            "Coordinates traffic flow with adjacent ATC sectors and units.",
            "Utilizes radar and other surveillance systems effectively."
        ]
    },
    {
        id: 'comp302',
        capabilityId: 'cap3',
        name: 'Emergency & Non-Routine Situation Management',
        behaviours: [
            "Identifies and responds to in-flight emergencies (e.g., engine failure, medical, security) promptly and effectively.",
            "Coordinates with emergency services (fire, medical, police) and other relevant agencies.",
            "Follows established emergency protocols and checklists.",
            "Provides assistance to aircraft experiencing non-routine situations (e.g., communication failure, navigational difficulties)."
        ]
    },

    // Aviation Safety & Compliance Competencies
    {
        id: 'comp401',
        capabilityId: 'cap4',
        name: 'Safety Management Systems (SMS) Implementation',
        behaviours: [
            "Develops, implements, and maintains an effective Safety Management System.",
            "Conducts safety risk assessments and hazard identification.",
            "Promotes a proactive safety culture through training and communication.",
            "Investigates incidents and accidents to identify root causes and implement corrective actions."
        ]
    },
    {
        id: 'comp402',
        capabilityId: 'cap4',
        name: 'Regulatory Compliance & Auditing',
        behaviours: [
            "Ensures adherence to national and international aviation regulations (e.g., FAA, EASA, ICAO standards).",
            "Prepares for and manages internal and external regulatory audits.",
            "Develops and maintains compliance documentation and records.",
            "Stays updated on changes in aviation law, standards, and best practices."
        ]
    },

    // Airport Operations & Management Competencies
    {
        id: 'comp501',
        capabilityId: 'cap5',
        name: 'Terminal & Passenger Services Management',
        behaviours: [
            "Oversees daily operations within the airport terminal, including check-in, security, and boarding.",
            "Manages passenger flow, baggage handling systems, and gate assignments efficiently.",
            "Coordinates with airlines, ground handling agents, and concessionaires.",
            "Ensures a high level of customer service and passenger satisfaction."
        ]
    },
    {
        id: 'comp502',
        capabilityId: 'cap5',
        name: 'Airside & Ramp Operations Safety',
        behaviours: [
            "Ensures safe and efficient operations on runways, taxiways, and aprons.",
            "Conducts regular inspections of airside infrastructure and equipment.",
            "Manages aircraft parking, fueling, and ground servicing activities.",
            "Implements and monitors wildlife hazard management programs."
        ]
    },

    // Product Management Competencies
    {
        id: 'comp601',
        capabilityId: 'cap6',
        name: 'Product Strategy & Vision',
        behaviours: [
            "Defines and champions a clear, compelling product vision aligned with company objectives.",
            "Develops and maintains a strategic product roadmap based on market analysis, customer needs, and business goals.",
            "Identifies and evaluates new product opportunities and market trends.",
            "Articulates product value proposition to internal and external stakeholders."
        ]
    },
    {
        id: 'comp602',
        capabilityId: 'cap6',
        name: 'Market Research & Customer Analysis',
        behaviours: [
            "Conducts thorough market research to understand competitive landscape, industry trends, and customer segments.",
            "Gathers and analyzes customer feedback through interviews, surveys, and data analysis to identify pain points and unmet needs.",
            "Develops detailed user personas and customer journey maps.",
            "Translates customer insights into actionable product requirements and features."
        ]
    },
    {
        id: 'comp603',
        capabilityId: 'cap6',
        name: 'Product Lifecycle Management',
        behaviours: [
            "Manages the entire product lifecycle from ideation, development, launch, growth, maturity, to end-of-life.",
            "Prioritizes features and backlog items based on strategic importance, customer value, and development effort.",
            "Collaborates with engineering, design, and marketing teams to ensure successful product delivery and launch.",
            "Monitors key product metrics and KPIs to measure performance and identify areas for improvement."
        ]
    },
    {
        id: 'comp604',
        capabilityId: 'cap6',
        name: 'Stakeholder Management & Communication',
        behaviours: [
            "Effectively communicates product plans, progress, and decisions to diverse stakeholders (executives, engineering, sales, marketing, customers).",
            "Builds strong relationships and alignment with cross-functional teams.",
            "Manages stakeholder expectations and resolves conflicts constructively.",
            "Presents product updates and demos with clarity and confidence."
        ]
    },

    // Software Engineering Competencies
    {
        id: 'comp701',
        capabilityId: 'cap7',
        name: 'Software Design & Architecture',
        behaviours: [
            "Designs scalable, reliable, and maintainable software systems and components.",
            "Applies appropriate design patterns and architectural principles (e.g., SOLID, microservices, event-driven).",
            "Creates clear and comprehensive technical design documentation.",
            "Evaluates and selects appropriate technologies and frameworks for new projects."
        ]
    },
    {
        id: 'comp702',
        capabilityId: 'cap7',
        name: 'Programming & Development',
        behaviours: [
            "Writes clean, efficient, well-documented, and testable code in relevant programming languages.",
            "Follows coding standards and best practices.",
            "Effectively debugs and resolves complex technical issues.",
            "Collaborates with other developers using version control systems (e.g., Git)."
        ]
    },
    {
        id: 'comp703',
        capabilityId: 'cap7',
        name: 'Testing & Quality Assurance',
        behaviours: [
            "Develops and executes comprehensive test plans, including unit, integration, and end-to-end tests.",
            "Implements automated testing strategies to ensure code quality and reduce regressions.",
            "Identifies, documents, and tracks software defects effectively.",
            "Advocates for and contributes to a culture of quality within the development team."
        ]
    },
    {
        id: 'comp704',
        capabilityId: 'cap7',
        name: 'DevOps & CI/CD',
        behaviours: [
            "Implements and manages continuous integration and continuous delivery (CI/CD) pipelines.",
            "Utilizes containerization (e.g., Docker) and orchestration (e.g., Kubernetes) technologies.",
            "Monitors application performance and infrastructure health, responding to alerts and incidents.",
            "Automates infrastructure provisioning and configuration management (Infrastructure as Code)."
        ]
    }
];

export const skillsData = [
    // Skills for Flight Planning & Navigation (comp101)
    {
        id: 's10101', competencyId: 'comp101', name: 'Meteorological Analysis for Aviation', type: 'Specialist Skill',
        definition: 'Interpreting weather charts, forecasts (TAFs, METARs), and upper air data to make informed flight planning decisions.',
        proficiencyLevels: [
            {level: 1, name: 'Foundational', descriptor: 'Can read basic weather reports and identify significant weather phenomena.'},
            {level: 2, name: 'Intermediate', descriptor: 'Can analyze complex weather patterns and their impact on flight routes and performance.'},
            {level: 3, name: 'Advanced', descriptor: 'Can make critical go/no-go decisions based on advanced meteorological interpretation and risk assessment.'}
        ]
    },
    {
        id: 's10102', competencyId: 'comp101', name: 'Performance-Based Navigation (PBN)', type: 'Specialist Skill',
        definition: 'Utilizing RNAV and RNP procedures for en-route, terminal, and approach operations.',
        proficiencyLevels: [
            {level: 1, name: 'Foundational', descriptor: 'Understands PBN concepts and can fly basic RNAV routes under supervision.'},
            {level: 2, name: 'Intermediate', descriptor: 'Can independently plan and execute RNP approaches and complex PBN procedures.'},
            {level: 3, name: 'Advanced', descriptor: 'Can develop and validate PBN procedures and train others in their use.'}
        ]
    },
    {
        id: 's10103', competencyId: 'comp101', name: 'Jeppesen Charts Interpretation', type: 'Tool & Technology',
        definition: 'Reading and understanding Jeppesen navigation charts for flight planning and execution.',
        proficiencyLevels: [
            {level: 1, name: 'Basic', descriptor: 'Can locate key information on en-route, terminal, and approach charts.'},
            {level: 2, name: 'Proficient', descriptor: 'Can interpret all symbols and data on complex charts, including SIDs, STARs, and approach plates.'},
            {level: 3, name: 'Expert', descriptor: 'Can quickly and accurately extract critical information under high workload conditions and identify potential ambiguities.'}
        ]
    },

    // Skills for Crew Resource Management (CRM) (comp102)
    {
        id: 's10201', competencyId: 'comp102', name: 'Assertive Communication', type: 'Behavioral Skill',
        definition: 'Clearly and respectfully expressing concerns, opinions, and information to other crew members, regardless of rank.',
        proficiencyLevels: [
            {level: 1, name: 'Developing', descriptor: 'Hesitates to speak up or does so indirectly.'},
            {level: 2, name: 'Effective', descriptor: 'Communicates concerns clearly and constructively, using appropriate advocacy techniques.'},
            {level: 3, name: 'Exemplary', descriptor: 'Confidently and effectively advocates for safety and operational best practices, fostering an environment where others feel comfortable speaking up.'}
        ]
    },
    {
        id: 's10202', competencyId: 'comp102', name: 'Workload Management', type: 'Behavioral Skill',
        definition: 'Prioritizing tasks, managing time effectively, and distributing workload among crew members to prevent overload.',
        proficiencyLevels: [
            {level: 1, name: 'Reactive', descriptor: 'Often feels overwhelmed; struggles to prioritize tasks under pressure.'},
            {level: 2, name: 'Proactive', descriptor: 'Anticipates high workload periods and plans accordingly; effectively delegates tasks.'},
            {level: 3, name: 'Strategic', descriptor: 'Optimizes crew workload distribution dynamically, maintaining situational awareness and capacity for unexpected events.'}
        ]
    },

    // Skills for Aircraft Systems Troubleshooting & Repair (comp201)
    {
        id: 's20101', competencyId: 'comp201', name: 'Hydraulic Systems Diagnostics', type: 'Specialist Skill',
        definition: 'Identifying and resolving malfunctions in aircraft hydraulic systems, including pumps, actuators, and fluid lines.',
        proficiencyLevels: [
            {level: 1, name: 'Foundational', descriptor: 'Can identify major hydraulic components and perform basic leak checks.'},
            {level: 2, name: 'Intermediate', descriptor: 'Can troubleshoot common hydraulic system faults using technical manuals and test equipment.'},
            {level: 3, name: 'Advanced', descriptor: 'Can diagnose complex, intermittent hydraulic issues and perform major component overhauls.'}
        ]
    },
    {
        id: 's20102', competencyId: 'comp201', name: 'Boeing Maintenance Toolbox', type: 'Tool & Technology',
        definition: 'Utilizing the Boeing Maintenance Toolbox software for accessing technical publications and troubleshooting guides.',
        proficiencyLevels: [
            {level: 1, name: 'Basic', descriptor: 'Can navigate the interface and find basic maintenance procedures.'},
            {level: 2, name: 'Proficient', descriptor: 'Can efficiently locate specific fault isolation procedures and interpret complex diagrams.'},
            {level: 3, name: 'Expert', descriptor: 'Can customize the toolbox, contribute to knowledge bases, and train others in its advanced features.'}
        ]
    },

    // Skills for Airspace Control & Separation (comp301)
    {
        id: 's30101', competencyId: 'comp301', name: 'Radar Vectoring Techniques', type: 'Specialist Skill',
        definition: 'Providing aircraft with headings and altitudes to maintain separation and sequence traffic for arrival or departure.',
        proficiencyLevels: [
            {level: 1, name: 'Trainee', descriptor: 'Can issue basic radar vectors under direct supervision in low-density traffic.'},
            {level: 2, name: 'Controller', descriptor: 'Can independently manage complex traffic scenarios using radar vectoring in various airspace configurations.'},
            {level: 3, name: 'Instructor/Evaluator', descriptor: 'Can develop and teach advanced radar vectoring strategies and evaluate controller performance.'}
        ]
    },

    // Skills for Safety Management Systems (SMS) Implementation (comp401)
    {
        id: 's40101', competencyId: 'comp401', name: 'Aviation Risk Assessment', type: 'Specialist Skill',
        definition: 'Identifying hazards, analyzing associated risks, and evaluating risk controls within an aviation context.',
        proficiencyLevels: [
            {level: 1, name: 'Awareness', descriptor: 'Understands basic risk assessment principles and can identify common aviation hazards.'},
            {level: 2, name: 'Practitioner', descriptor: 'Can conduct formal risk assessments using established methodologies and recommend appropriate mitigation strategies.'},
            {level: 3, name: 'Lead Assessor', descriptor: 'Can lead complex risk assessment projects, develop new risk models, and integrate risk management into organizational strategy.'}
        ]
    },
    {
        id: 's40102', competencyId: 'comp401', name: 'ICAO SMS Framework', type: 'Knowledge Area',
        definition: 'Understanding and applying the components and elements of the ICAO Safety Management System framework.',
        proficiencyLevels: [
            {level: 1, name: 'Familiar', descriptor: 'Has a basic understanding of the four components of the ICAO SMS framework.'},
            {level: 2, name: 'Knowledgeable', descriptor: 'Can explain the elements within each component and their interrelationships.'},
            {level: 3, name: 'Expert', descriptor: 'Can design, implement, and audit an SMS based on the ICAO framework and adapt it to specific organizational needs.'}
        ]
    },

    // Skills for Terminal & Passenger Services Management (comp501)
    {
        id: 's50101', competencyId: 'comp501', name: 'Airport Crisis Communication', type: 'Behavioral Skill',
        definition: 'Effectively communicating with passengers, staff, and media during irregular operations or crisis situations.',
        proficiencyLevels: [
            {level: 1, name: 'Basic', descriptor: 'Can deliver pre-scripted messages and direct passengers to information sources.'},
            {level: 2, name: 'Proficient', descriptor: 'Can adapt communication style to different audiences and manage information flow during evolving situations.'},
            {level: 3, name: 'Strategic', descriptor: 'Can develop and lead crisis communication plans, act as a spokesperson, and manage reputational impact.'}
        ]
    },
    {
        id: 's50102', competencyId: 'comp501', name: 'Amadeus Altea Suite', type: 'Tool & Technology',
        definition: 'Using the Amadeus Altea passenger service system for check-in, boarding, and flight management.',
        proficiencyLevels: [
            {level: 1, name: 'User', descriptor: 'Can perform basic passenger check-in and boarding functions.'},
            {level: 2, name: 'Power User', descriptor: 'Can handle complex passenger processing scenarios, rebookings, and manage flight manifests.'},
            {level: 3, name: 'System Administrator/Trainer', descriptor: 'Can configure system parameters, troubleshoot issues, and train staff on Altea usage.'}
        ]
    },

    // Skills for Product Strategy & Vision (comp601)
    {
        id: 's60101', competencyId: 'comp601', name: 'Roadmapping & Prioritization', type: 'Specialist Skill',
        definition: 'Developing and maintaining product roadmaps, and prioritizing features based on strategic goals, customer value, and technical feasibility.',
        proficiencyLevels: [
            {level: 1, name: 'Contributor', descriptor: 'Can contribute to feature prioritization discussions and understand roadmap components.'},
            {level: 2, name: 'Owner', descriptor: 'Can own and manage a product roadmap for a specific feature set or small product, using prioritization frameworks (e.g., RICE, MoSCoW).'},
            {level: 3, name: 'Strategist', descriptor: 'Can develop and align multi-product or portfolio roadmaps with overarching business strategy, navigating complex trade-offs.'}
        ]
    },
    {
        id: 's60102', competencyId: 'comp601', name: 'Competitive Analysis', type: 'Specialist Skill',
        definition: 'Identifying and analyzing competitors, their products, strategies, strengths, and weaknesses to inform product decisions.',
        proficiencyLevels: [
            {level: 1, name: 'Basic Researcher', descriptor: 'Can gather publicly available information about competitors.'},
            {level: 2, name: 'Analyst', descriptor: 'Can synthesize competitive information to identify key differentiators and market positioning.'},
            {level: 3, name: 'Strategic Advisor', descriptor: 'Can proactively identify emerging competitive threats and opportunities, and recommend strategic responses.'}
        ]
    },
    {
        id: 's60103', competencyId: 'comp601', name: 'Vision Setting', type: 'Behavioral Skill',
        definition: 'Articulating a clear, inspiring, and long-term vision for the product that motivates the team and guides development.',
        proficiencyLevels: [
            {level: 1, name: 'Communicator', descriptor: 'Can clearly explain the existing product vision to others.'},
            {level: 2, name: 'Shaper', descriptor: 'Can contribute to shaping and refining the product vision based on insights and feedback.'},
            {level: 3, name: 'Champion', descriptor: 'Can define, evangelize, and adapt a compelling product vision that aligns stakeholders and drives innovation.'}
        ]
    },

    // Skills for Market Research & Customer Analysis (comp602)
    {
        id: 's60201', competencyId: 'comp602', name: 'User Interviewing', type: 'Specialist Skill',
        definition: 'Planning and conducting effective user interviews to uncover needs, pain points, and motivations.',
        proficiencyLevels: [
            {level: 1, name: 'Note-taker', descriptor: 'Can participate in user interviews and accurately capture notes.'},
            {level: 2, name: 'Interviewer', descriptor: 'Can independently plan, conduct, and synthesize findings from user interviews.'},
            {level: 3, name: 'Lead Researcher', descriptor: 'Can design comprehensive user research programs, train others in interviewing techniques, and extract deep strategic insights.'}
        ]
    },
    {
        id: 's60202', competencyId: 'comp602', name: 'Survey Design & Analysis', type: 'Specialist Skill',
        definition: 'Designing effective surveys, collecting data, and analyzing results to gather quantitative and qualitative customer insights.',
        proficiencyLevels: [
            {level: 1, name: 'Basic User', descriptor: 'Can assist in distributing surveys and collecting responses.'},
            {level: 2, name: 'Designer/Analyst', descriptor: 'Can design unbiased surveys, analyze data using basic statistical methods, and report findings.'},
            {level: 3, name: 'Expert', descriptor: 'Can design complex surveys for diverse populations, apply advanced analytical techniques, and derive actionable product strategies from survey data.'}
        ]
    },
    {
        id: 's60203', competencyId: 'comp602', name: 'Persona Development', type: 'Tool & Technology',
        definition: 'Creating detailed, research-backed user personas to represent key customer segments and guide product design.',
        proficiencyLevels: [
            {level: 1, name: 'Contributor', descriptor: 'Can contribute information to existing persona profiles.'},
            {level: 2, name: 'Creator', descriptor: 'Can develop user personas based on research data and validate them with stakeholders.'},
            {level: 3, name: 'Strategist', descriptor: 'Can lead persona development initiatives, ensure their integration into product processes, and evolve them over time.'}
        ]
    },

    // Skills for Product Lifecycle Management (comp603)
    {
        id: 's60301', competencyId: 'comp603', name: 'Agile Methodologies (Scrum/Kanban)', type: 'Knowledge Area',
        definition: 'Understanding and applying Agile principles and practices (e.g., Scrum ceremonies, Kanban WIP limits) for iterative product development.',
        proficiencyLevels: [
            {level: 1, name: 'Familiar', descriptor: 'Understands basic Agile concepts and terminology.'},
            {level: 2, name: 'Practitioner', descriptor: 'Can actively participate in Agile ceremonies and contribute effectively to an Agile team (e.g., as Product Owner in Scrum).'},
            {level: 3, name: 'Coach/Expert', descriptor: 'Can lead Agile transformations, coach teams on Agile best practices, and adapt methodologies to specific organizational contexts.'}
        ]
    },
    {
        id: 's60302', competencyId: 'comp603', name: 'Product Launch Planning', type: 'Specialist Skill',
        definition: 'Developing and executing comprehensive go-to-market plans for new products or features.',
        proficiencyLevels: [
            {level: 1, name: 'Assistant', descriptor: 'Can assist with tasks in a product launch plan, such as coordinating with marketing.'},
            {level: 2, name: 'Planner', descriptor: 'Can develop a detailed launch plan for a feature or small product, coordinating cross-functional activities.'},
            {level: 3, name: 'Lead', descriptor: 'Can orchestrate complex, multi-channel product launches, manage risks, and measure launch success.'}
        ]
    },
    {
        id: 's60303', competencyId: 'comp603', name: 'Jira/Confluence Proficiency', type: 'Tool & Technology',
        definition: 'Utilizing Jira for backlog management and sprint planning, and Confluence for documentation and knowledge sharing.',
        proficiencyLevels: [
            {level: 1, name: 'Basic User', descriptor: 'Can create and update Jira tickets and navigate Confluence pages.'},
            {level: 2, name: 'Proficient User', descriptor: 'Can manage backlogs, configure Jira boards, create reports, and structure Confluence spaces effectively.'},
            {level: 3, name: 'Administrator/Expert', descriptor: 'Can customize Jira workflows, integrate with other tools, and establish best practices for Jira and Confluence usage across teams.'}
        ]
    },

    // Skills for Stakeholder Management & Communication (comp604)
    {
        id: 's60401', competencyId: 'comp604', name: 'Presentation Skills', type: 'Behavioral Skill',
        definition: 'Delivering clear, engaging, and persuasive presentations to various audiences.',
        proficiencyLevels: [
            {level: 1, name: 'Developing', descriptor: 'Can present pre-prepared material to small, familiar groups.'},
            {level: 2, name: 'Effective Presenter', descriptor: 'Can structure and deliver compelling presentations to diverse stakeholders, adapting style as needed.'},
            {level: 3, name: 'Influential Speaker', descriptor: 'Can command a room, inspire action, and handle challenging questions with poise during high-stakes presentations.'}
        ]
    },
    {
        id: 's60402', competencyId: 'comp604', name: 'Negotiation & Influence', type: 'Behavioral Skill',
        definition: 'Effectively persuading and influencing others to achieve desired outcomes, and negotiating win-win solutions.',
        proficiencyLevels: [
            {level: 1, name: 'Participant', descriptor: 'Can participate in negotiations and articulate own position.'},
            {level: 2, name: 'Negotiator', descriptor: 'Can lead negotiations, identify common ground, and influence stakeholders towards agreement.'},
            {level: 3, name: 'Master Influencer', descriptor: 'Can navigate complex political landscapes, build strong alliances, and achieve strategic objectives through sophisticated influence and negotiation tactics.'}
        ]
    },
    {
        id: 's60403', competencyId: 'comp604', name: 'Cross-functional Collaboration', type: 'Behavioral Skill',
        definition: 'Working effectively with individuals and teams from different functions (e.g., engineering, design, marketing, sales) to achieve shared goals.',
        proficiencyLevels: [
            {level: 1, name: 'Team Member', descriptor: 'Participates constructively in cross-functional team activities.'},
            {level: 2, name: 'Collaborator', descriptor: 'Proactively builds relationships and facilitates communication across functions to drive alignment and results.'},
            {level: 3, name: 'Bridge Builder', descriptor: 'Champions cross-functional collaboration, resolves conflicts, and fosters a culture of shared ownership and success.'}
        ]
    },

    // Skills for Software Design & Architecture (comp701)
    {
        id: 's70101', competencyId: 'comp701', name: 'System Design Patterns', type: 'Knowledge Area',
        definition: 'Understanding and applying established solutions to common software design problems (e.g., Singleton, Factory, Observer).',
        proficiencyLevels: [
            {level: 1, name: 'Aware', descriptor: 'Is familiar with common design patterns and their purpose.'},
            {level: 2, name: 'Applicator', descriptor: 'Can select and implement appropriate design patterns in software solutions.'},
            {level: 3, name: 'Innovator/Mentor', descriptor: 'Can adapt and combine design patterns for complex scenarios, and mentor others in their effective use.'}
        ]
    },
    {
        id: 's70102', competencyId: 'comp701', name: 'Microservices Architecture', type: 'Specialist Skill',
        definition: 'Designing and developing applications as a collection of loosely coupled, independently deployable services.',
        proficiencyLevels: [
            {level: 1, name: 'Learner', descriptor: 'Understands the basic concepts and benefits of microservices.'},
            {level: 2, name: 'Developer', descriptor: 'Can design and implement individual microservices and understand inter-service communication patterns.'},
            {level: 3, name: 'Architect', descriptor: 'Can design and oversee the development of complex microservices-based systems, addressing concerns like service discovery, resilience, and data consistency.'}
        ]
    },
    {
        id: 's70103', competencyId: 'comp701', name: 'UML Diagramming', type: 'Tool & Technology',
        definition: 'Using Unified Modeling Language (UML) to visually represent software designs, structures, and behaviors (e.g., class diagrams, sequence diagrams).',
        proficiencyLevels: [
            {level: 1, name: 'Reader', descriptor: 'Can understand basic UML diagrams created by others.'},
            {level: 2, name: 'Creator', descriptor: 'Can create accurate and clear UML diagrams to communicate software designs.'},
            {level: 3, name: 'Expert Modeler', descriptor: 'Can use advanced UML features to model complex systems and guide architectural decisions.'}
        ]
    },

    // Skills for Programming & Development (comp702)
    {
        id: 's70201', competencyId: 'comp702', name: 'Python Programming', type: 'Tool & Technology',
        definition: 'Developing applications and scripts using the Python programming language and its ecosystem.',
        proficiencyLevels: [
            {level: 1, name: 'Beginner', descriptor: 'Can write simple Python scripts and understand basic syntax and data structures.'},
            {level: 2, name: 'Intermediate', descriptor: 'Can develop moderately complex applications, use common libraries (e.g., Django, Flask, Pandas), and write object-oriented code.'},
            {level: 3, name: 'Advanced/Expert', descriptor: 'Can design and implement large-scale Python applications, optimize performance, and contribute to or create libraries/frameworks.'}
        ]
    },
    {
        id: 's70202', competencyId: 'comp702', name: 'JavaScript (ES6+)', type: 'Tool & Technology',
        definition: 'Developing web applications (front-end and/or back-end with Node.js) using modern JavaScript features.',
        proficiencyLevels: [
            {level: 1, name: 'Beginner', descriptor: 'Understands basic JavaScript syntax, DOM manipulation, and asynchronous operations.'},
            {level: 2, name: 'Intermediate', descriptor: 'Can build interactive web UIs using frameworks (e.g., React, Vue, Angular) or develop server-side applications with Node.js, proficient with ES6+ features.'},
            {level: 3, name: 'Advanced/Expert', descriptor: 'Can architect complex JavaScript applications, optimize performance, and deeply understand the JavaScript runtime environment and ecosystem.'}
        ]
    },
    {
        id: 's70203', competencyId: 'comp702', name: 'API Development (REST/GraphQL)', type: 'Specialist Skill',
        definition: 'Designing, building, and maintaining robust and scalable APIs using RESTful principles or GraphQL.',
        proficiencyLevels: [
            {level: 1, name: 'Consumer', descriptor: 'Can understand API documentation and integrate with existing APIs.'},
            {level: 2, name: 'Developer', descriptor: 'Can design and implement well-structured RESTful or GraphQL APIs, including authentication and error handling.'},
            {level: 3, name: 'Architect', descriptor: 'Can design complex API ecosystems, address concerns like versioning, security, and scalability, and establish API design guidelines.'}
        ]
    },
    {
        id: 's70204', competencyId: 'comp702', name: 'Git Version Control', type: 'Tool & Technology',
        definition: 'Using Git for source code management, including branching, merging, and collaborating with teams.',
        proficiencyLevels: [
            {level: 1, name: 'Basic User', descriptor: 'Can perform basic Git operations like clone, commit, push, and pull.'},
            {level: 2, name: 'Proficient User', descriptor: 'Can effectively use branching strategies (e.g., Gitflow), resolve merge conflicts, and rebase.'},
            {level: 3, name: 'Expert/Maintainer', descriptor: 'Can manage complex repository histories, set up Git workflows for large teams, and troubleshoot advanced Git issues.'}
        ]
    },

    // Skills for Testing & Quality Assurance (comp703)
    {
        id: 's70301', competencyId: 'comp703', name: 'Unit Testing Frameworks (e.g., Jest, PyTest)', type: 'Tool & Technology',
        definition: 'Writing and maintaining unit tests using relevant frameworks to ensure code correctness at the component level.',
        proficiencyLevels: [
            {level: 1, name: 'Learner', descriptor: 'Understands the purpose of unit tests and can run existing tests.'},
            {level: 2, name: 'Writer', descriptor: 'Can write effective unit tests for new and existing code, covering various scenarios.'},
            {level: 3, name: 'Architect/Advocate', descriptor: 'Can design unit testing strategies, set up testing infrastructure, and champion TDD/BDD practices.'}
        ]
    },
    {
        id: 's70302', competencyId: 'comp703', name: 'Test Automation Strategies', type: 'Specialist Skill',
        definition: 'Designing and implementing automated tests (integration, E2E) to improve software quality and development speed.',
        proficiencyLevels: [
            {level: 1, name: 'Aware', descriptor: 'Understands the benefits of test automation and can execute automated test suites.'},
            {level: 2, name: 'Implementer', descriptor: 'Can develop and maintain automated test scripts using tools like Selenium, Cypress, or Playwright.'},
            {level: 3, name: 'Strategist', descriptor: 'Can design comprehensive test automation frameworks, integrate them into CI/CD pipelines, and measure their effectiveness.'}
        ]
    },
    {
        id: 's70303', competencyId: 'comp703', name: 'Bug Tracking & Reporting', type: 'Behavioral Skill',
        definition: 'Clearly and accurately identifying, documenting, and tracking software defects through their lifecycle.',
        proficiencyLevels: [
            {level: 1, name: 'Reporter', descriptor: 'Can identify and report bugs with basic information.'},
            {level: 2, name: 'Detailed Reporter', descriptor: 'Can provide clear, concise, and reproducible bug reports with relevant logs and steps.'},
            {level: 3, name: 'Analyst/Manager', descriptor: 'Can analyze bug trends, prioritize fixes, and manage the bug tracking process for a team or project.'}
        ]
    },

    // Skills for DevOps & CI/CD (comp704)
    {
        id: 's70401', competencyId: 'comp704', name: 'Docker & Containerization', type: 'Tool & Technology',
        definition: 'Using Docker to create, manage, and deploy applications in isolated containers.',
        proficiencyLevels: [
            {level: 1, name: 'User', descriptor: 'Can run existing Docker containers and understand basic Docker concepts.'},
            {level: 2, name: 'Developer', descriptor: 'Can write Dockerfiles, build custom images, and manage containerized applications.'},
            {level: 3, name: 'Expert', descriptor: 'Can design complex multi-container applications, optimize Docker images for performance and security, and manage container orchestration (e.g., with Kubernetes).'}
        ]
    },
    {
        id: 's70402', competencyId: 'comp704', name: 'CI/CD Tools (e.g., Jenkins, GitLab CI, GitHub Actions)', type: 'Tool & Technology',
        definition: 'Configuring and managing Continuous Integration/Continuous Delivery pipelines using tools like Jenkins, GitLab CI, or GitHub Actions.',
        proficiencyLevels: [
            {level: 1, name: 'User', descriptor: 'Can trigger and monitor existing CI/CD pipelines.'},
            {level: 2, name: 'Pipeline Developer', descriptor: 'Can create and modify CI/CD pipelines for building, testing, and deploying applications.'},
            {level: 3, name: 'DevOps Architect', descriptor: 'Can design and implement scalable and resilient CI/CD infrastructure, integrate various tools, and establish DevOps best practices.'}
        ]
    },
    {
        id: 's70403', competencyId: 'comp704', name: 'Infrastructure as Code (e.g., Terraform, Ansible)', type: 'Specialist Skill',
        definition: 'Managing and provisioning infrastructure through code, using tools like Terraform or Ansible.',
        proficiencyLevels: [
            {level: 1, name: 'Learner', descriptor: 'Understands the principles of IaC and can read basic configuration scripts.'},
            {level: 2, name: 'Practitioner', descriptor: 'Can write and maintain IaC scripts to provision and manage cloud resources or on-premise infrastructure.'},
            {level: 3, name: 'Expert', descriptor: 'Can design complex, reusable IaC modules, manage state effectively, and implement automated infrastructure management across multiple environments.'}
        ]
    }
];
