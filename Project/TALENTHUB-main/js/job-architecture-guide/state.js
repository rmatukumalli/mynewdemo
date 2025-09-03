// --- Data Definitions ---
export const GUIDE_STEPS = [
    {
        id: 1,
        title: "Welcome to the Akara Airlines Job Architecture Wizard!",
        shortTitle: "Introduction", // More formal for enterprise
        subtitle: "Empowering you to strategically design Akara Airlines' job framework.",
        content: {
            explanation: "Welcome to the Akara Airlines Job Architecture Wizard! This intelligent tool is designed to help you build a strong and adaptable job framework for our organization. You'll define our structure, from business units to specific roles, essential skills, and clear career paths. Our goal is to create a world-class framework that supports our talent strategy and drives operational excellence.",
            keyPoints: [
                "Use the intuitive stepper navigation at the top to easily track your progress through each phase of the architecture design.",
                "This interactive guide offers clear explanations and best practices for every section of the Job Architecture Wizard.",
                "Navigate through this tutorial using the 'Next' and 'Back' buttons to understand each feature and its strategic importance.",
                "The live Job Architecture Wizard is your workspace for entering, validating, and managing Akara Airlines' comprehensive job data."
            ],
            yourRole: "As a key contributor to Akara Airlines' talent framework, your role is to use this wizard to accurately capture and structure all job-related information. Your precision ensures the resulting architecture is a powerful asset for strategic decision-making, talent development, and organizational agility."
        }
    },
    {
        id: 2,
        title: "Wizard Foundation: Defining Your Organization", // More engaging title
        shortTitle: "Organization Setup", // Clearer action
        subtitle: "Establish the core identity of Akara Airlines within the wizard.",
        content: {
            explanation: "The 'Organization' module is where you establish the foundation of your job architecture. Here, you will formally define Akara Airlines as the primary entity. In a live environment, you would carefully enter these details, though they might be pre-filled in a demonstration.",
            keyPoints: [
                "Navigate to the 'Organization' section within the wizard's interface.",
                "Accurately enter 'Akara Airlines' into the 'Organization Name' field.",
                "Provide a concise yet comprehensive overview of Akara Airlines' mission, vision, or market positioning in the 'Description' field.",
                "This foundational data ensures all subsequent components (Business Units, Departments, etc.) are correctly linked under the Akara Airlines umbrella.",
                "After completing this step, use the 'Next' or 'Save & Proceed' function to move to the Business Unit definition stage."
            ],
            yourRole: "Your goal is to precisely capture Akara Airlines' foundational identity in the wizard, including its official name and a strategic description. This forms the top-level structure of your job architecture."
        }
    },
    {
        id: 3,
        title: "Structuring Akara Airlines: Defining Business Units",
        shortTitle: "Business Unit Definition",
        subtitle: "Segment Akara Airlines into core operational and strategic divisions within the wizard.",
        content: {
            explanation: "The 'Business Unit' module allows you to divide Akara Airlines into its main operational or strategic divisions. These are high-level segments that represent distinct areas of our business, such as 'Passenger Aviation Services,' 'Cargo & Logistics,' or 'Maintenance, Repair & Overhaul (MRO).'",
            keyPoints: [
                "Navigate to the 'Business Unit' creation or management area within the wizard.",
                "For each division, enter a clear 'Business Unit Name' (e.g., 'Akara Passenger Services', 'Akara Cargo Solutions').",
                "Provide a 'Description' that outlines the Business Unit's core mission and objectives.",
                "The wizard automatically links each Business Unit under the 'Akara Airlines' organization.",
                "This segmentation is essential for effective resource allocation, performance management, and operational oversight."
            ],
            yourRole: "Your task is to strategically define Akara Airlines' major operational segments as Business Units in the wizard. Ensure accurate naming and clear descriptions of their contributions to the overall enterprise, creating a logical top-tier structure."
        }
    },
    {
        id: 4,
        title: "Detailing Operational Units: Defining Departments",
        shortTitle: "Department Structuring",
        subtitle: "Further refine Business Units into functional departments within the wizard.",
        content: {
            explanation: "The 'Department' module allows you to break down your Business Units into more specialized functional areas. For instance, within 'Akara Passenger Services,' you might define departments such as 'Flight Operations Command,' 'In-Flight Services,' or 'Airport Customer Experience.'",
            keyPoints: [
                "Access the 'Department' management interface, which is typically linked to a selected Business Unit.",
                "Use the 'Add Department' function to create new departmental entries.",
                "Enter a precise 'Department Name' (e.g., 'Flight Operations Command') and a 'Description' detailing its specific responsibilities.",
                "Ensure each Department is correctly linked to its parent 'Business Unit' using the wizard's selection tools to maintain hierarchical integrity.",
                "Clearly defining departments is crucial for assigning accountability, managing resources, and streamlining operational workflows."
            ],
            yourRole: "Your responsibility is to accurately map Akara Airlines' functional subdivisions as Departments within the wizard. Ensure each is clearly defined and correctly aligned under its respective Business Unit for operational clarity."
        }
    },
    {
        id: 5,
        title: "Organizing Talent: Establishing Role Groups",
        shortTitle: "Role Group Creation",
        subtitle: "Categorize jobs into logical families for streamlined management and development.",
        content: {
            explanation: "The 'Role Groups' module (often called Job Families) is crucial for organizing similar roles based on shared functions, skills, and career paths. For Akara Airlines, examples include 'Flight Crew Operations,' 'Aircraft Engineering & Maintenance,' and 'Airport Customer Services.'",
            keyPoints: [
                "In the wizard, find the 'Role Groups' or 'Job Families' section.",
                "Use the 'Add Role Group' function to create new entries.",
                "Enter a clear and standardized 'Role Group Name' (e.g., 'Flight Crew Operations').",
                "Provide a 'Description' that outlines the purpose and scope of roles within this group.",
                "The wizard may allow you to associate the Role Group with a primary 'Department' (though it can span multiple departments), define its 'Status' (e.g., 'Active', 'In Design'), and add relevant 'Tags' (e.g., 'safety-critical', 'customer-facing') for better searchability and reporting. The wizard might even suggest tags.",
                "Well-defined Role Groups are essential for consistent job leveling, targeted learning and development programs, and effective workforce analytics."
            ],
            yourRole: "Your goal is to create a comprehensive set of Role Groups that accurately reflect the diverse professional disciplines within Akara Airlines. This involves clear naming, descriptive summaries, and proper categorization to build a logical foundation for your job architecture."
        }
    },
    {
        id: 6,
        title: "Standardizing Progression: Defining Job Levels",
        shortTitle: "Job Level Framework",
        subtitle: "Establish a clear, consistent hierarchy of seniority and responsibility across Akara Airlines.",
        content: {
            explanation: "The 'Job Levels' module is where you define Akara Airlines' standardized framework for career progression and seniority. These levels (e.g., L1: Associate, L2: Analyst/Specialist, L3: Senior Analyst/Lead Specialist, L4: Manager/Principal, L5: Senior Manager/Director) apply globally across different Role Groups to ensure consistency in titling, compensation, and expectations.",
            keyPoints: [
                "Navigate to the 'Job Levels' or 'Grading Structure' section of the wizard.",
                "For each level, use the 'Add Job Level' function to define its parameters:",
                "   - <u>Level Name/Code:</u> A standardized identifier (e.g., 'L1', 'L2', 'P1', 'M3').",
                "   - <u>Level Title/Descriptor:</u> A clear title (e.g., 'Associate Level', 'Senior Professional', 'Manager I', 'Executive Lead').",
                "   - <u>Description:</u> Detail the general expectations, scope of responsibility, typical years of experience, and degree of autonomy associated with this level.",
                "   - <u>Core Competencies (Optional):</u> Some advanced wizards allow linking core leadership or functional competencies expected at each level, along with target proficiency.",
                "   - <u>Salary Band Link (Optional):</u> If integrated, you might link each level to a predefined salary band in your compensation system.",
                "This framework is crucial for transparent career pathing, equitable compensation, and consistent performance management across Akara Airlines."
            ],
            yourRole: "Your role is to meticulously define each job level within the wizard. Ensure that the descriptions and distinctions are clear, meaningful, and consistently applicable across Akara Airlines. This framework underpins fair talent management and clear employee growth trajectories."
        }
    },
    {
        id: 7,
        title: "Wizard Core: Defining Jobs & Mapping Critical Skills",
        shortTitle: "Job Definition & Skills",
        subtitle: "Meticulously craft individual job profiles and link essential skills using the wizard's dedicated modules.",
        content: {
            explanation: "This module is central to the Job Architecture Wizard, where you define the specifics of each job role at Akara Airlines. The process is organized into clear tabs or sections to ensure comprehensive data capture for positions like 'Captain (A320 Type Rated)' or 'Senior Aircraft Maintenance Engineer'.",
            keyPoints: [
                "Start by selecting a parent Role Group (e.g., 'Flight Operations') and then use the 'Add New Job' action within the wizard.",
                "The wizard will guide you through several tabs or sections to build the complete job profile:",
                
                "<strong>1. Basic Information Tab:</strong>",
                "   - <u>Job Title:</u> Enter the official, standardized title (e.g., 'Captain - A320'). Ensure consistency with Akara Airlines' naming conventions.",
                "   - <u>Requisition ID (Optional):</u> If linked to an active recruitment process, enter the Applicant Tracking System (ATS) Requisition ID for seamless integration.",
                "   - <u>Employment Type:</u> Select the appropriate status from the wizard's dropdown (e.g., 'Full-Time Permanent', 'Part-Time Contract').",
                "   - <u>Work Location:</u> Specify the primary operational base or typical work environment (e.g., 'DXB - Akara Airlines Main Hub').",
                "   - <u>Hiring Manager & Recruiter (Optional):</u> Assign the responsible Hiring Manager and Talent Acquisition Partner from your HRIS data, if integrated.",
                "   - <u>Salary Range (Optional):</u> Input the approved minimum and maximum salary figures, aligning with Akara Airlines' compensation bands.",
                
                "<strong>2. Role Group & Level Tab:</strong>",
                "   - <u>Role Group Assignment:</u> This field confirms the job's placement within the broader job family structure (e.g., 'Flight Crew', 'Aircraft Engineering'). It might be pre-filled.",
                "   - <u>Job Level:</u> Select the predefined Job Level (e.g., 'L5' for Captain, 'L3' for First Officer) from Akara Airlines' global leveling framework. This ensures hierarchical consistency.",
                "   - <u>Department & Business Unit:</u> Link the job to its specific Department (e.g., 'A320 Fleet Operations') and parent Business Unit (e.g., 'Akara Passenger Services'). The wizard may auto-populate the Business Unit.",

                "<strong>3. Job Description Tab:</strong>",
                "   - <u>Role Summary:</u> Craft a compelling and concise (2-3 sentences) overview of the job’s core purpose and primary contribution.",
                "   - <u>Key Responsibilities:</u> Enumerate 5-7 primary duties and accountabilities using clear, action-oriented language (e.g., 'Ensures safe and efficient operation of A320 aircraft').",
                "   - <u>Qualifications & Experience:</u> Detail mandatory and preferred qualifications, including certifications (e.g., 'Valid ATPL with A320 Type Rating'), education (e.g., 'Bachelor’s Degree in Aviation Management'), and experience (e.g., 'Minimum 5,000 total flight hours').",
                "   - <u>Additional Information/Benefits (Optional):</u> A space for other pertinent details, such as travel requirements or standardized benefits.",

                "<strong>4. Skills Mapping Tab:</strong>",
                "   - <u>Skill Identification:</u> Use the wizard's integrated 'Skill Navigator' (search bar, category tree, or AI-powered suggestions) to select skills from Akara Airlines’ central Skills Ontology.",
                "   - <u>Skill Types:</u> The Skills Ontology categorizes skills (e.g., 'Technical Aviation Skills', 'Operational Skills'). The wizard allows filtering by type.",
                "   - <u>Proficiency Level Assignment:</u> For each selected skill (e.g., 'A320 Flight Systems Management'), assign the target proficiency level (e.g., 1-Foundational, 2-Intermediate, 3-Advanced, 4-Expert).",
                "   - <u>Criticality (Optional):</u> Flag certain skills as 'Mission Critical' or 'Essential vs. Desirable' for prioritization.",
                "   - <u>AI Skill Suggestions:</u> Pay attention to AI-driven recommendations that analyze the job title/description to suggest relevant or emerging skills.",

                "<strong>5. AI-Powered Job Description Generation Flow:</strong>",
                "   This workflow helps you generate and integrate job descriptions using AI, dynamically routing users and overwriting data in the wizard.",
                "   <u>Overview: Flow Summary:</u>",
                "   - Generating job description data",
                "   - Dynamically routing users",
                "   - Overwriting data back in the wizard",
                "   - Suggesting and mapping skills",
                "   - Linking skills and behaviors to competencies and capabilities",
                "   <u>Step-by-Step Guide:</u>",
                "   - <strong>Start from Job Architecture:</strong> From `/job-architecture/index.html`, Step 6 – Add Jobs → Job Description tab, click “Generate/Update with AI”.",
                "   - <strong>Redirect to AI Page:</strong> You are taken to `/create_with_ai.html`. The URL includes a context query parameter (e.g., `?source=job-architecture`).",
                "   - <strong>Conditional Button Handling:</strong> If `source=job-architecture` is present, the button text changes to “Save & Return to Job Architecture” and returns you to the Job Architecture tab. Otherwise, it defaults to “Save & Return to Requisitions”.",
                "   - <strong>AI Job Content Generation:</strong> You can view and edit fields like Job Title, Requisition ID, Department, Business Unit, Job Level, Employment Type, Primary Location, Work Arrangement, Salary Range, Hiring Manager, Assigned Recruiter, and Job Summary. Other content (Responsibilities, Qualifications, Benefits) is auto-populated.",
                "   - <strong>Return and Overwrite in Job Architecture:</strong> Upon clicking Save, the system automatically updates the Job Description section in `/job-architecture/index.html` with values from AI, including Role Summary, Salary Min/Max, Hiring Manager, Recruiter, and other content.",
                "   <u>AI Suggested Skills Section:</u>",
                "   - <strong>Display Behavior:</strong> Skills are split into 'Skills in system (taxonomy-mapped)' (appearing in the standard 'Skills' list) and 'AI Suggested Skills (not in system)' (appearing in a distinct section with a note: “These skills are not currently in the taxonomy. Please review and consider adding them to the system.”).",
                "   - <strong>Skill Cards Include:</strong> Name of skill (e.g., “Digital Marketing”), suggested proficiency level (Foundational → Intermediate → Advanced), description from AI, and a “Map to Ontology” button.",
                "   <u>Mapping Skills to Ontology:</u>",
                "   - <strong>Feature:</strong> Each AI-suggested skill has a “Map to Ontology” button. Clicking it opens a modal or side panel allowing you to map the skill to an existing ontology skill or create a new taxonomy entry. Mapping includes matching skill name, adjusting proficiency levels, and providing description alignment.",
                "   <u>Linking Skills & Behaviors to Competencies & Capabilities:</u>",
                "   - <strong>Feature Support:</strong> Within the “Map to Ontology” modal, you have the option to associate each skill or behavior with one or more competencies and capabilities (e.g., Skill: “Digital Marketing” mapped to Capability → “Marketing Execution” and Competency → “Strategic Thinking”). This ensures alignment with internal frameworks."
            ],
            yourRole: "Your critical responsibility in this module is to meticulously and accurately populate all relevant fields across these tabs for every job defined at Akara Airlines. The precision of your 'Skills Mapping'—linking the right skills at the correct proficiency levels—is paramount, as this data directly fuels talent acquisition, learning and development initiatives, performance management, and strategic workforce planning."
        }
    },
    {
        id: 8,
        title: "Charting Growth: Visualizing Career Paths",
        shortTitle: "Career Path Design",
        subtitle: "Map out and illustrate potential employee progression routes across Akara Airlines.",
        content: {
            explanation: "The 'Career Paths' module helps you visualize and map potential employee progression routes within Akara Airlines. This section allows you to connect jobs, showing both vertical promotions (e.g., First Officer to Captain) and horizontal/cross-functional movements (e.g., Maintenance Technician to Technical Trainer).",
            keyPoints: [
                "Access the 'Career Paths' or 'Talent Mobility' section of the wizard. You'll see a visual interface of your existing job architecture.",
                "Use the wizard's tools to establish links between jobs. This might involve drag-and-drop or selection menus to define 'from job' and 'to job' relationships.",
                "For each path, you can specify:",
                "   - <u>Path Type:</u> (e.g., 'Promotion', 'Lateral Move', 'Developmental Assignment').",
                "   - <u>Typical Tenure:</u> Estimated time in the source role before being ready for the next.",
                "   - <u>Bridge Skills/Competencies:</u> Key skills or development areas needed for a successful transition (the wizard might suggest these based on skill gap analysis).",
                "   - <u>Success Indicators:</u> Performance metrics or milestones that indicate readiness for the next role.",
                "The wizard supports multiple pathways from and to a single job, reflecting diverse career possibilities.",
                "This visualization is invaluable for employee career discussions, succession planning, and identifying skill development priorities to enable mobility."
            ],
            yourRole: "Your strategic role is to map out clear, logical, and motivating career progression pathways in the wizard. Consider the skills, experience, and development required for successful transitions to foster talent retention and growth within Akara Airlines."
        }
    },
    {
        id: 9,
        title: "Finalizing Your Architecture: Review & AI-Powered Insights",
        shortTitle: "Validation & AI Review",
        subtitle: "Conduct a comprehensive review of your job architecture and leverage intelligent analytics for optimization.",
        content: {
            explanation: "The 'Review & AI Insights' module is the final checkpoint in the Job Architecture Wizard. It offers a consolidated view of your entire architecture, allowing for thorough validation. This section also integrates AI-driven analytics to highlight inconsistencies, suggest optimizations, and identify strategic talent insights.",
            keyPoints: [
                "Access the 'Review & AI Insights' dashboard or summary view within the wizard.",
                "Systematically verify all defined elements: Organization details, Business Unit structures, Departmental alignments, Role Group definitions, Job Level consistency, individual Job Profile completeness (including descriptions and skills), and mapped Career Paths.",
                "Pay close attention to AI-Generated Insights, which might include:",
                "   - <u>Skill Gap Alerts:</u> Highlighting roles with critical skill deficiencies or skills that are underrepresented across related jobs.",
                "   - <u>Leveling Consistency Checks:</u> Identifying jobs that may be over or under-leveled compared to similar roles or industry standards.",
                "   - <u>Redundancy Flags:</u> Pointing out potentially overlapping job roles or skill sets that could be consolidated.",
                "   - <u>Career Path Optimization:</u> Suggesting new potential career pathways or identifying bottlenecks in existing ones.",
                "   - <u>Benchmarking Comparisons (if available):</u> Showing how Akara Airlines' roles/skills stack up against industry data.",
                "The wizard provides tools to easily navigate to and edit any sections requiring adjustments based on your review or AI feedback.",
                "Look for export functionalities to extract your completed job architecture data for use in HRIS, talent management systems, or for reporting."
            ],
            yourRole: "Your crucial role here is to act as the final quality assurance gatekeeper. Review the entire architecture, evaluate AI-driven suggestions, make necessary refinements, and ensure the final output is accurate, consistent, and strategically aligned with Akara Airlines' objectives before formally adopting or exporting it."
        }
    },
    {
        id: 10,
        title: "Congratulations & Strategic Next Steps",
        shortTitle: "Conclusion",
        subtitle: "You've successfully navigated the Akara Airlines Job Architecture Wizard guide!",
        content: {
            summary: `
                <div class="text-center mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award text-green-500 mx-auto mb-4"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                    <h2 class="text-2xl font-bold text-gray-900 mb-3">Mission Accomplished: You're Ready to Architect!</h2>
                    <p class="text-lg text-gray-700 mb-6">You have successfully completed this comprehensive guide to the Akara Airlines Job Architecture Wizard. You are now equipped with the foundational knowledge to effectively utilize this powerful enterprise tool and build a world-class job framework that will serve as a strategic asset for Akara Airlines.</p>
                </div>

                <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Key Wizard Modules Recap:</h3>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-gray-700 mb-6">
                    <li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2 mr-2 mt-1 text-blue-500 shrink-0"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg><span><strong>Organization & Structure:</strong> Defining Akara Airlines, Business Units, and Departments.</span></li>
                    <li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-round mr-2 mt-1 text-blue-500 shrink-0"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg><span><strong>Role Definition:</strong> Establishing Role Groups and consistent Job Levels.</span></li>
                    <li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-check mr-2 mt-1 text-blue-500 shrink-0"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg><span><strong>Job Profiling:</strong> Detailing individual Jobs, descriptions, and qualifications.</span></li>
                    <li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-puzzle mr-2 mt-1 text-blue-500 shrink-0"><path d="M19.439 7.852c-.043-.27-.088-.513-.135-.729a2.064 2.064 0 0 0-1.443-1.443c-.216-.047-.459-.092-.729-.135A2.064 2.064 0 0 0 14.561 4c-1.02.005-1.957.17-2.764.44A2.064 2.064 0 0 0 10.203 6c-.216.52-.33 1.109-.356 1.742a2.064 2.064 0 0 0 .021.43c.043.27.088.513.135.729a2.064 2.064 0 0 0 1.443 1.443c.216.047.459.092.729.135A2.064 2.064 0 0 0 14.561 12c1.02-.005 1.957-.17 2.764-.44A2.064 2.064 0 0 0 18.917 10c.216-.52.33-1.109.356-1.742a2.064 2.064 0 0 0-.021-.43Z"/><path d="m9.561 12.001-.001-.001L9.526 12a2.064 2.064 0 0 1-1.443-1.443c-.047-.216-.092-.459-.135-.729A2.064 2.064 0 0 1 6.356 8c-.52-.216-1.109-.33-1.742-.356a2.064 2.064 0 0 1-.43-.021c-.27-.043-.513-.088-.729-.135A2.064 2.064 0 0 1 2 6.044c-.005-1.02.17-1.957.44-2.764A2.064 2.064 0 0 1 4.033 1.7c.52-.216 1.109-.33 1.742-.356a2.064 2.064 0 0 1 .43-.021c.27-.043.513-.088.729-.135A2.064 2.064 0 0 1 8.439 0c1.02.005 1.957.17 2.764.44A2.064 2.064 0 0 1 12.797 2c.216.52.33 1.109.356 1.742a2.064 2.064 0 0 1-.021.43c-.043.27-.088.513-.135-.729a2.064 2.064 0 0 1-1.443 1.443c-.216-.047-.459-.092-.729-.135A2.064 2.064 0 0 1 8.439 8c-1.02.005-1.957-.17-2.764-.44A2.064 2.064 0 0 1 4.083 6c-.216-.52-.33-1.109-.356-1.742a2.064 2.064 0 0 0 .021-.43Z"/><path d="M8.439 16c-1.02.005-1.957.17-2.764.44a2.064 2.064 0 0 0-1.594 1.594c-.216.52-.33 1.109-.356 1.742a2.064 2.064 0 0 0 .021.43c.043.27.088.513.135.729a2.064 2.064 0 0 0 1.443 1.443c.216.047.459.092.729.135A2.064 2.064 0 0 0 8.439 24c1.02-.005 1.957-.17 2.764-.44a2.064 2.064 0 0 0 1.594-1.594c.216-.52.33-1.109.356-1.742a2.064 2.064 0 0 0-.021-.43c-.043-.27-.088-.513-.135-.729a2.064 2.064 0 0 0-1.443-1.443c-.216-.047-.459-.092-.729-.135A2.064 2.064 0 0 0 8.439 16Z"/></svg><span><strong>Skills Mapping:</strong> Linking critical skills and proficiencies to each job.</span></li>
                    <li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network mr-2 mt-1 text-blue-500 shrink-0"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg><span><strong>Career Pathing:</strong> Visualizing talent mobility and progression routes.</span></li>
                    <li class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-circuit mr-2 mt-1 text-blue-500 shrink-0"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A3 3 0 1 0 12 17Z"/><path d="M12 17a3 3 0 1 0 5.997-.125 4 4 0 0 0 2.526-5.77 4 4 0 0 0-.556-6.588A3 3 0 1 0 12 5Z"/><path d="M14.5 7.5a4.5 4.5 0 0 0 0 9"/><path d="M9.5 7.5a4.5 4.5 0 0 1 0 9"/><path d="M12 12h.01"/></svg><span><strong>Validation & AI Insights:</strong> Reviewing the architecture and leveraging intelligent analytics.</span></li>
                </ul>

                <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Leveraging Your New Job Architecture:</h3>
                <p class="text-gray-700 mb-4">The meticulously structured job architecture you build using the wizard will be instrumental in enhancing a multitude of strategic HR functions at Akara Airlines:</p>
                <ul class="list-disc list-inside space-y-3 text-gray-700 ml-4 mb-6">
                    <li><strong>Strategic Talent Acquisition:</strong> Attract and hire the right talent with precise job definitions and skill requirements.</li>
                    <li><strong>Targeted Learning & Development:</strong> Identify skill gaps and design impactful training programs that align with career progression.</li>
                    <li><strong>Effective Performance Management:</strong> Set clear expectations and evaluate performance against well-defined role responsibilities and competencies.</li>
                    <li><strong>Proactive Succession Planning:</strong> Identify and develop high-potential employees for future leadership and critical roles.</li>
                    <li><strong>Equitable Compensation & Rewards:</strong> Ensure fair and consistent compensation practices based on standardized job levels and market data.</li>
                    <li><strong>Enhanced Workforce Analytics:</strong> Gain deeper insights into your talent pool, skill distribution, and organizational capabilities to inform strategic decisions.</li>
                </ul>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p class="text-blue-700 font-medium">You are now well-prepared to embark on building Akara Airlines' job architecture using the live <a href="job-architecture/index.html" class="text-blue-600 hover:text-blue-800 font-semibold underline">Job Architecture Wizard</a>.</p>
                    <p class="text-blue-700 mt-2">Remember, this guide remains available as your trusted reference. Good luck, and fly high!</p>
                </div>
            `
        }
    }
];

// --- State Management ---
export let state = {
    currentStep: 1, // Corresponds to the ID of the first step in this guide
    completedSteps: new Set(), // Stores IDs of completed guide steps
};

// Function to update the state and trigger a re-render
export function updateGuideState(newState) {
    state = { ...state, ...newState };
    console.log("Guide state updated:", state);
    localStorage.setItem('jobArchitectureGuideState', JSON.stringify({
        ...state,
        completedSteps: Array.from(state.completedSteps) // Convert Set to Array for JSON
    }));
}

// Function to load state from localStorage
export function loadGuideState() {
    const savedState = localStorage.getItem('jobArchitectureGuideState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        state = { 
            ...state, 
            ...parsedState,
            // Ensure parsedState.completedSteps is iterable (an array) before creating a Set
            completedSteps: new Set(Array.isArray(parsedState.completedSteps) ? parsedState.completedSteps : [])
        };
        console.log("Guide state loaded from localStorage:", state);
    }
}
