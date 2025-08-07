import os
import sys

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import db
from app.models import Capability, Competency, Skill, Behavior, Proficiency, RelationshipType, SkillRelationship, competency_skills

def populate_ontology_data():
    db.create_all()
    ontology_data = [
        {
            "capability_id": "CAP001",
            "capability_name": "Strategic Planning",
            "capability_description": "The ability to define long-term goals, develop strategies, and allocate resources to achieve organizational objectives, considering market trends and competitive landscapes.",
            "competencies": [
                {
                    "competency_id": "COMP001",
                    "competency_name": "Vision & Goal Setting",
                    "competency_description": "The ability to articulate a clear future state and translate it into actionable, measurable objectives.",
                    "skills": [
                        {"skill_name": "Strategic Visioning", "skill_description": "Developing a long-term perspective and direction for an organization or project."},
                        {"skill_name": "OKR Development", "skill_description": "Setting Objectives and Key Results to align and measure progress towards strategic goals."},
                        {"skill_name": "Long-term Planning", "skill_description": "Creating detailed plans for future activities, typically spanning several years, to achieve strategic objectives."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH001", "behavior_name": "Articulates a clear, compelling vision for the future.", "behavior_description": "Clearly communicates an inspiring future state that motivates others."},
                        {"behavior_id": "BEH002", "behavior_name": "Translates strategic vision into actionable, measurable goals.", "behavior_description": "Converts high-level vision into specific, quantifiable targets."},
                        {"behavior_id": "BEH003", "behavior_name": "Inspires and aligns teams around shared objectives.", "behavior_description": "Motivates and guides groups to work cohesively towards common goals."}
                    ]
                },
                {
                    "competency_id": "COMP002",
                    "competency_name": "Market Analysis",
                    "competency_description": "The capacity to research, interpret, and apply insights from market data to inform strategic decisions.",
                    "skills": [
                        {"skill_name": "Competitive Analysis", "skill_description": "Evaluating competitors' strengths and weaknesses to identify market opportunities and threats."},
                        {"skill_name": "SWOT Analysis", "skill_description": "Assessing Strengths, Weaknesses, Opportunities, and Threats to understand an organization's strategic position."},
                        {"skill_name": "Market Research", "skill_description": "Systematically gathering and interpreting information about a market, including customer needs and industry trends."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH004", "behavior_name": "Gathers and interprets market data effectively.", "behavior_description": "Collects relevant market information and understands its implications."},
                        {"behavior_id": "BEH005", "behavior_name": "Identifies emerging trends and competitive threats.", "behavior_description": "Recognizes new patterns in the market and potential risks from competitors."},
                        {"behavior_id": "BEH006", "behavior_name": "Uses insights to inform strategic decisions.", "behavior_description": "Applies market understanding to make sound strategic choices."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP002",
            "capability_name": "Financial Management",
            "capability_description": "Proficiency in managing financial resources, including budgeting, forecasting, financial analysis, risk management, and ensuring fiscal responsibility within an organization.",
            "competencies": [
                {
                    "competency_id": "COMP003",
                    "competency_name": "Budgeting & Forecasting",
                    "competency_description": "The ability to plan and predict financial outcomes, ensuring resources are allocated efficiently.",
                    "skills": [
                        {"skill_name": "Financial Modeling", "skill_description": "Creating mathematical models to represent financial performance and make predictions."},
                        {"skill_name": "Variance Analysis", "skill_description": "Comparing actual financial results to planned or budgeted figures to identify differences."},
                        {"skill_name": "Budget Preparation", "skill_description": "Developing detailed financial plans that outline expected revenues and expenses."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH007", "behavior_name": "Develops accurate and realistic financial budgets.", "behavior_description": "Creates financial plans that are precise and achievable."},
                        {"behavior_id": "BEH008", "behavior_name": "Forecasts financial performance based on various scenarios.", "behavior_description": "Predicts future financial results by considering different possibilities."},
                        {"behavior_id": "BEH009", "behavior_name": "Monitors budget adherence and identifies deviations.", "behavior_description": "Tracks spending against the budget and notes any significant differences."}
                    ]
                },
                {
                    "competency_id": "COMP004",
                    "competency_name": "Financial Reporting",
                    "competency_description": "The skill to accurately present an organization's financial health and performance to stakeholders.",
                    "skills": [
                        {"skill_name": "GAAP Compliance", "skill_description": "Adhering to Generally Accepted Accounting Principles for financial reporting."},
                        {"skill_name": "IFRS Reporting", "skill_description": "Preparing financial statements according to International Financial Reporting Standards."},
                        {"skill_name": "Financial Statement Analysis", "skill_description": "Interpreting financial statements to assess a company's performance and financial health."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH010", "behavior_name": "Prepares clear and compliant financial statements.", "behavior_description": "Produces financial reports that are easy to understand and meet regulatory requirements."},
                        {"behavior_id": "BEH011", "behavior_name": "Explains complex financial data to non-financial stakeholders.", "behavior_description": "Simplifies intricate financial information for those without a financial background."},
                        {"behavior_id": "BEH012", "behavior_name": "Ensures accuracy and integrity of financial records.", "behavior_description": "Verifies that financial data is correct and reliable."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP003",
            "capability_name": "Product Development",
            "capability_description": "The end-to-end process of creating new products or improving existing ones, encompassing ideation, design, prototyping, testing, and launch, often involving cross-functional teams.",
            "competencies": [
                {
                    "competency_id": "COMP005",
                    "competency_name": "Ideation & Concept Generation",
                    "competency_description": "The ability to generate, evaluate, and refine new product ideas and concepts.",
                    "skills": [
                        {"skill_name": "Brainstorming", "skill_description": "Generating a large number of ideas in a short period, often in a group setting."},
                        {"skill_name": "User Story Mapping", "skill_description": "Visually organizing user stories to understand the user's journey and product backlog."},
                        {"skill_name": "Concept Validation", "skill_description": "Testing new product ideas with target users to assess their viability and desirability."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH013", "behavior_name": "Facilitates creative brainstorming sessions.", "behavior_description": "Leads sessions to encourage the generation of innovative ideas."},
                        {"behavior_id": "BEH014", "behavior_name": "Generates novel and viable product concepts.", "behavior_description": "Comes up with new and practical ideas for products."},
                        {"behavior_id": "BEH015", "behavior_name": "Validates ideas through user research and feedback.", "behavior_description": "Confirms the potential of ideas by gathering input from users."}
                    ]
                },
                {
                    "competency_id": "COMP006",
                    "competency_name": "Design Thinking",
                    "competency_description": "A human-centered approach to innovation that integrates the needs of people, the possibilities of technology, and the requirements for business success.",
                    "skills": [
                        {"skill_name": "User Experience (UX) Design", "skill_description": "Designing products to provide meaningful and relevant experiences to users."},
                        {"skill_name": "Prototyping", "skill_description": "Creating preliminary versions of products to test concepts and designs."},
                        {"skill_name": "Usability Testing", "skill_description": "Evaluating a product by testing it with representative users to identify usability problems."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH016", "behavior_name": "Applies user-centered design principles.", "behavior_description": "Focuses on the user's needs and experiences throughout the design process."},
                        {"behavior_id": "BEH017", "behavior_name": "Creates intuitive and aesthetically pleasing product designs.", "behavior_description": "Develops designs that are easy to use and visually appealing."},
                        {"behavior_id": "BEH018", "behavior_name": "Iterates on designs based on user testing and feedback.", "behavior_description": "Refines designs continuously using insights from user interactions."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP004",
            "capability_name": "Customer Relationship Management",
            "capability_description": "Strategies and technologies used to manage and analyze customer interactions and data throughout the customer lifecycle, with the goal of improving business relationships and assisting in customer retention and sales growth.",
            "competencies": [
                {
                    "competency_id": "COMP007",
                    "competency_name": "Customer Service Excellence",
                    "competency_description": "Delivering high-quality service that meets and exceeds customer expectations.",
                    "skills": [
                        {"skill_name": "Active Listening", "skill_description": "Fully concentrating on what is being said, rather than just passively 'hearing' the message."},
                        {"skill_name": "Conflict Resolution", "skill_description": "Mediating and resolving disputes or disagreements between parties."},
                        {"skill_name": "Empathy", "skill_description": "Understanding and sharing the feelings of another."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH019", "behavior_name": "Listens attentively to customer concerns.", "behavior_description": "Pays close attention to understand customer issues fully."},
                        {"behavior_id": "BEH020", "behavior_name": "Resolves customer issues efficiently and empathetically.", "behavior_description": "Addresses customer problems quickly and with understanding."},
                        {"behavior_id": "BEH021", "behavior_name": "Maintains a positive and professional demeanor in all interactions.", "behavior_description": "Acts courteously and professionally in every customer contact."}
                    ]
                },
                {
                    "competency_id": "COMP008",
                    "competency_name": "Customer Data Analysis",
                    "competency_description": "The ability to collect, analyze, and interpret customer data to gain insights and improve customer strategies.",
                    "skills": [
                        {"skill_name": "Data Visualization", "skill_description": "Presenting data in a graphical or pictorial format to make it easier to understand."},
                        {"skill_name": "Predictive Analytics", "skill_description": "Using historical data to forecast future outcomes and trends."},
                        {"skill_name": "Segmentation", "skill_description": "Dividing a broad consumer or business market into sub-groups of consumers based on shared characteristics."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH022", "behavior_name": "Collects and organizes customer data systematically.", "behavior_description": "Gathers and structures customer information in an orderly way."},
                        {"behavior_id": "BEH023", "behavior_name": "Identifies patterns and insights from customer data.", "behavior_description": "Discovers meaningful trends and understandings within customer information."},
                        {"behavior_id": "BEH024", "behavior_name": "Uses data to personalize customer experiences and improve strategies.", "behavior_description": "Applies data insights to tailor customer interactions and enhance business plans."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP005",
            "capability_name": "Human Resources Management",
            "capability_description": "The comprehensive management of an organization's workforce, including recruitment, training, performance management, compensation, employee relations, and compliance with labor laws.",
            "competencies": [
                {
                    "competency_id": "COMP009",
                    "competency_name": "Talent Acquisition",
                    "competency_description": "The process of finding, attracting, interviewing, hiring, and onboarding employees.",
                    "skills": [
                        {"skill_name": "Interviewing", "skill_description": "Conducting structured conversations to assess candidates' qualifications and fit."},
                        {"skill_name": "Candidate Sourcing", "skill_description": "Identifying and attracting potential job candidates through various channels."},
                        {"skill_name": "Onboarding", "skill_description": "Integrating new employees into an organization and its culture."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH025", "behavior_name": "Identifies and attracts top talent.", "behavior_description": "Finds and recruits highly skilled individuals."},
                        {"behavior_id": "BEH026", "behavior_name": "Conducts effective interviews and assessments.", "behavior_description": "Performs thorough evaluations of job candidates."},
                        {"behavior_id": "BEH027", "behavior_name": "Manages the onboarding process smoothly.", "behavior_description": "Ensures a seamless integration for new hires."}
                    ]
                },
                {
                    "competency_id": "COMP010",
                    "competency_name": "Performance Management",
                    "competency_description": "The process of ensuring that employees are working effectively to achieve organizational goals.",
                    "skills": [
                        {"skill_name": "Goal Setting", "skill_description": "Establishing clear, measurable, achievable, relevant, and time-bound objectives."},
                        {"skill_name": "Feedback Delivery", "skill_description": "Providing constructive and timely information about performance."},
                        {"skill_name": "Performance Reviews", "skill_description": "Formal evaluations of an employee's job performance."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH028", "behavior_name": "Sets clear performance expectations and goals.", "behavior_description": "Defines what is expected from employees in terms of performance."},
                        {"behavior_id": "BEH029", "behavior_name": "Provides constructive and timely feedback.", "behavior_description": "Offers helpful and prompt input on performance."},
                        {"behavior_id": "BEH030", "behavior_name": "Conducts fair and objective performance reviews.", "behavior_description": "Evaluates employee performance impartially and based on facts."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP006",
            "capability_name": "Marketing and Sales",
            "capability_description": "The integrated activities involved in promoting and selling products or services, including market research, branding, advertising, lead generation, and sales execution to drive revenue.",
            "competencies": [
                {
                    "competency_id": "COMP011",
                    "competency_name": "Brand Management",
                    "competency_description": "The process of maintaining, improving, and upholding a brand so that the name is always held in high regard.",
                    "skills": [
                        {"skill_name": "Brand Strategy", "skill_description": "Developing a long-term plan for the development of a successful brand in order to achieve specific goals."},
                        {"skill_name": "Brand Identity", "skill_description": "Creating the visible elements of a brand, such as color, design, and logo, that identify and distinguish the brand."},
                        {"skill_name": "Public Relations", "skill_description": "Managing the spread of information between an individual or an organization and the public."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH031", "behavior_name": "Develops and executes comprehensive brand strategies.", "behavior_description": "Creates and implements plans to build and maintain a strong brand."},
                        {"behavior_id": "BEH032", "behavior_name": "Ensures consistent brand messaging across all channels.", "behavior_description": "Maintains uniform brand communication through various media."},
                        {"behavior_id": "BEH033", "behavior_name": "Monitors brand perception and reputation.", "behavior_description": "Tracks and manages how the public views the brand."}
                    ]
                },
                {
                    "competency_id": "COMP012",
                    "competency_name": "Sales Strategy & Execution",
                    "competency_description": "Developing and implementing plans to achieve sales targets and drive revenue growth.",
                    "skills": [
                        {"skill_name": "Lead Generation", "skill_description": "Identifying and cultivating potential customers for a business's products or services."},
                        {"skill_name": "Negotiation", "skill_description": "Discussing to reach an agreement, especially in business or politics."},
                        {"skill_name": "Sales Forecasting", "skill_description": "Predicting future sales revenue by analyzing past sales data and market trends."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH034", "behavior_name": "Develops effective sales strategies to meet targets.", "behavior_description": "Creates successful plans to achieve sales goals."},
                        {"behavior_id": "BEH035", "behavior_name": "Executes sales plans with precision and drive.", "behavior_description": "Implements sales strategies accurately and with determination."},
                        {"behavior_id": "BEH036", "behavior_name": "Builds strong relationships with clients and prospects.", "behavior_description": "Establishes solid connections with customers and potential clients."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP007",
            "capability_name": "Operations Management",
            "capability_description": "The administration of business practices to create the highest level of efficiency possible within an organization, converting materials and labor into goods and services as efficiently as possible to maximize the profit of an organization.",
            "competencies": [
                {
                    "competency_id": "COMP013",
                    "competency_name": "Process Optimization",
                    "competency_description": "Analyzing and improving existing business processes to enhance efficiency, reduce costs, and improve quality.",
                    "skills": [
                        {"skill_name": "Lean Principles", "skill_description": "Applying principles to minimize waste and maximize value in processes."},
                        {"skill_name": "Six Sigma", "skill_description": "A set of techniques and tools for process improvement."},
                        {"skill_name": "Workflow Automation", "skill_description": "Automating sequences of tasks to streamline business processes."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH037", "behavior_name": "Identifies inefficiencies and bottlenecks in processes.", "behavior_description": "Pinpoints areas where processes are slow or wasteful."},
                        {"behavior_id": "BEH038", "behavior_name": "Designs and implements improved operational workflows.", "behavior_description": "Creates and puts into practice better ways of doing work."},
                        {"behavior_id": "BEH039", "behavior_name": "Monitors process performance and makes continuous adjustments.", "behavior_description": "Tracks how well processes are working and makes ongoing improvements."}
                    ]
                },
                {
                    "competency_id": "COMP014",
                    "competency_name": "Quality Assurance",
                    "competency_description": "Ensuring that products, services, and processes meet specified standards and customer requirements.",
                    "skills": [
                        {"skill_name": "Quality Control", "skill_description": "Inspecting products or services to ensure they meet quality standards."},
                        {"skill_name": "Root Cause Analysis", "skill_description": "Identifying the fundamental reasons for problems or defects."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH040", "behavior_name": "Establishes and enforces quality standards.", "behavior_description": "Sets and maintains benchmarks for product or service excellence."},
                        {"behavior_id": "BEH041", "behavior_name": "Conducts thorough quality inspections and audits.", "behavior_description": "Performs detailed checks to ensure quality compliance."},
                        {"behavior_id": "BEH042", "behavior_name": "Implements corrective actions to address quality issues.", "behavior_description": "Takes steps to fix problems that affect quality."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP008",
            "capability_name": "Information Technology Management",
            "capability_description": "Overseeing the technological resources of an organization, including hardware, software, networks, and data, to ensure they support business objectives and maintain security and efficiency.",
            "competencies": [
                {
                    "competency_id": "COMP015",
                    "competency_name": "IT Infrastructure Management",
                    "competency_description": "Managing the hardware, software, network, and facilities that support an organization's IT operations.",
                    "skills": [
                        {"skill_name": "Network Administration", "skill_description": "Managing and maintaining computer networks, including hardware and software."},
                        {"skill_name": "Cloud Computing", "skill_description": "Utilizing remote servers hosted on the internet to store, manage, and process data."},
                        {"skill_name": "Cybersecurity", "skill_description": "Protecting computer systems and networks from information disclosure, theft, or damage to their hardware, software, or electronic data, as well as from the disruption or misdirection of the services they provide."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH043", "behavior_name": "Ensures the reliability and security of IT infrastructure.", "behavior_description": "Guarantees that IT systems are dependable and protected from threats."},
                        {"behavior_id": "BEH044", "behavior_name": "Manages IT assets and resources efficiently.", "behavior_description": "Handles IT equipment and tools in a cost-effective way."},
                        {"behavior_id": "BEH045", "behavior_name": "Implements robust cybersecurity measures.", "behavior_description": "Puts strong security protocols in place to protect against cyber threats."}
                    ]
                },
                {
                    "competency_id": "COMP016",
                    "competency_name": "Software Development Lifecycle (SDLC)",
                    "competency_description": "Managing the entire process of developing, deploying, and maintaining software systems.",
                    "skills": [
                        {"skill_name": "Agile Methodologies", "skill_description": "Applying iterative and incremental development approaches, such as Scrum or Kanban."},
                        {"skill_name": "DevOps", "skill_description": "Integrating software development and IT operations to shorten the systems development life cycle and provide continuous delivery with high software quality."},
                        {"skill_name": "Quality Assurance (Software)", "skill_description": "Ensuring software products meet specified requirements and quality standards through testing and validation."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH046", "behavior_name": "Oversees software development projects from conception to deployment.", "behavior_description": "Manages software projects through all stages, from idea to release."},
                        {"behavior_id": "BEH047", "behavior_name": "Ensures adherence to coding standards and best practices.", "behavior_description": "Makes sure software development follows established rules and optimal methods."},
                        {"behavior_id": "BEH048", "behavior_name": "Facilitates continuous integration and continuous delivery (CI/CD).", "behavior_description": "Supports automated processes for building, testing, and deploying software."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP009",
            "capability_name": "Research and Development",
            "capability_description": "Systematic investigative and creative work undertaken to increase the stock of knowledge and to devise new applications of available knowledge, often leading to new products, processes, or services.",
            "competencies": [
                {
                    "competency_id": "COMP017",
                    "competency_name": "Scientific Research",
                    "competency_description": "Conducting systematic investigations to establish facts and reach new conclusions.",
                    "skills": [
                        {"skill_name": "Experimental Design", "skill_description": "Planning experiments to test hypotheses and gather reliable data."},
                        {"skill_name": "Data Analysis (Scientific)", "skill_description": "Interpreting scientific data using statistical and analytical methods."},
                        {"skill_name": "Technical Writing", "skill_description": "Producing clear and concise documentation for scientific or technical subjects."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH049", "behavior_name": "Designs and executes rigorous scientific experiments.", "behavior_description": "Plans and carries out precise scientific tests."},
                        {"behavior_id": "BEH050", "behavior_name": "Analyzes complex data to draw valid conclusions.", "behavior_description": "Examines intricate information to form accurate judgments."},
                        {"behavior_id": "BEH051", "behavior_name": "Publishes research findings in peer-reviewed journals.", "behavior_description": "Shares scientific discoveries in academic publications."}
                    ]
                },
                {
                    "competency_id": "COMP018",
                    "competency_name": "Innovation Management",
                    "competency_description": "The process of managing innovation procedures within an organization, from idea generation to commercialization.",
                    "skills": [
                        {"skill_name": "Intellectual Property Management", "skill_description": "Protecting and leveraging patents, trademarks, and copyrights."},
                        {"skill_name": "Technology Scouting", "skill_description": "Identifying new technologies and trends that could benefit the organization."},
                        {"skill_name": "Commercialization Strategy", "skill_description": "Developing plans to bring new products or services to market successfully."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH052", "behavior_name": "Fosters a culture of innovation and experimentation.", "behavior_description": "Encourages new ideas and trying out different approaches."},
                        {"behavior_id": "BEH053", "behavior_name": "Identifies and evaluates emerging technologies.", "behavior_description": "Recognizes and assesses new advancements in technology."},
                        {"behavior_id": "BEH054", "behavior_name": "Translates research into viable commercial products.", "behavior_description": "Converts scientific findings into marketable goods or services."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP010",
            "capability_name": "Supply Chain Management",
            "capability_description": "The management of the flow of goods and services, involves the movement and storage of raw materials, of work-in-process inventory, and of finished goods from point of origin to point of consumption.",
            "competencies": [
                {
                    "competency_id": "COMP019",
                    "competency_name": "Logistics & Distribution",
                    "competency_description": "Managing the efficient flow and storage of goods from point of origin to point of consumption.",
                    "skills": [
                        {"skill_name": "Inventory Management", "skill_description": "Overseeing the flow of goods from manufacturers to warehouses and from these facilities to point of sale."},
                        {"skill_name": "Transportation Management", "skill_description": "Planning, optimizing, and executing the movement of goods."},
                        {"skill_name": "Warehouse Operations", "skill_description": "Managing the processes within a warehouse, including storage, picking, and packing."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH055", "behavior_name": "Optimizes inventory levels to meet demand and minimize costs.", "behavior_description": "Adjusts stock to balance customer needs with storage expenses."},
                        {"behavior_id": "BEH056", "behavior_name": "Ensures timely and cost-effective delivery of goods.", "behavior_description": "Guarantees products arrive on schedule and within budget."},
                        {"behavior_id": "BEH057", "behavior_name": "Manages warehouse operations for maximum efficiency.", "behavior_description": "Runs storage facilities to achieve the highest level of productivity."}
                    ]
                },
                {
                    "competency_id": "COMP020",
                    "competency_name": "Supplier Relationship Management",
                    "competency_description": "Developing and maintaining strong relationships with suppliers to ensure reliable and high-quality supply.",
                    "skills": [
                        {"skill_name": "Vendor Selection", "skill_description": "Choosing the best suppliers based on criteria like cost, quality, and reliability."},
                        {"skill_name": "Contract Negotiation", "skill_description": "Bargaining terms and conditions with suppliers to secure favorable agreements."},
                        {"skill_name": "Supplier Performance Monitoring", "skill_description": "Tracking and evaluating suppliers' adherence to agreements and quality standards."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH058", "behavior_name": "Establishes and nurtures strong supplier relationships.", "behavior_description": "Builds and maintains good connections with vendors."},
                        {"behavior_id": "BEH059", "behavior_name": "Negotiates favorable terms and contracts with suppliers.", "behavior_description": "Secures beneficial agreements and deals with vendors."},
                        {"behavior_id": "BEH060", "behavior_name": "Monitors supplier performance and addresses issues proactively.", "behavior_description": "Tracks how well suppliers are doing and resolves problems before they escalate."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP011",
            "capability_name": "Software Engineering",
            "capability_description": "The application of engineering principles to the design, development, maintenance, testing, and evaluation of software and systems that enable computers to perform their intended function.",
            "competencies": [
                {
                    "competency_id": "COMP021",
                    "competency_name": "Software Design & Architecture",
                    "competency_description": "The ability to design and architect software systems that are scalable, reliable, and maintainable.",
                    "skills": [
                        {"skill_name": "System Design", "skill_description": "The process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements."},
                        {"skill_name": "Design Patterns", "skill_description": "General reusable solutions to commonly occurring problems within a given context in software design."},
                        {"skill_name": "Microservices Architecture", "skill_description": "An architectural style that structures an application as a collection of loosely coupled services."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH061", "behavior_name": "Creates well-architected software systems.", "behavior_description": "Designs software systems that are scalable, reliable, and maintainable."},
                        {"behavior_id": "BEH062", "behavior_name": "Applies appropriate design patterns.", "behavior_description": "Uses design patterns to solve common software design problems."},
                        {"behavior_id": "BEH063", "behavior_name": "Documents system architecture and design.", "behavior_description": "Creates clear and concise documentation for system architecture and design."}
                    ]
                },
                {
                    "competency_id": "COMP022",
                    "competency_name": "Frontend Development",
                    "competency_description": "The practice of producing HTML, CSS, and JavaScript for a website or web application so that a user can see and interact with them directly.",
                    "skills": [
                        {"skill_name": "HTML", "skill_description": "The standard markup language for documents designed to be displayed in a web browser."},
                        {"skill_name": "CSS", "skill_description": "A style sheet language used for describing the presentation of a document written in a markup language like HTML."},
                        {"skill_name": "JavaScript", "skill_description": "A programming language that conforms to the ECMAScript specification."},
                        {"skill_name": "React", "skill_description": "A JavaScript library for building user interfaces."},
                        {"skill_name": "Angular", "skill_description": "A TypeScript-based open-source web application framework led by the Angular Team at Google."},
                        {"skill_name": "Vue.js", "skill_description": "An open-source model–view–viewmodel front end JavaScript framework for building user interfaces and single-page applications."},
                        {"skill_name": "TypeScript", "skill_description": "A strict syntactical superset of JavaScript that adds optional static typing to the language."},
                        {"skill_name": "Dart", "skill_description": "A client-optimized programming language for apps on multiple platforms, developed by Google."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH064", "behavior_name": "Builds responsive and accessible user interfaces.", "behavior_description": "Creates user interfaces that work well on all devices and are accessible to people with disabilities."},
                        {"behavior_id": "BEH065", "behavior_name": "Writes clean, maintainable, and reusable code.", "behavior_description": "Writes code that is easy to read, understand, and modify."},
                        {"behavior_id": "BEH066", "behavior_name": "Collaborates effectively with designers and backend developers.", "behavior_description": "Works well with other members of the development team."}
                    ]
                },
                {
                    "competency_id": "COMP023",
                    "competency_name": "Backend Development",
                    "competency_description": "The server-side of development where you are primarily focused on how the site works.",
                    "skills": [
                        {"skill_name": "Python", "skill_description": "An interpreted, high-level and general-purpose programming language."},
                        {"skill_name": "Java", "skill_description": "A class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible."},
                        {"skill_name": "Node.js", "skill_description": "An open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser."},
                        {"skill_name": "Databases (SQL & NoSQL)", "skill_description": "Knowledge of both relational (SQL) and non-relational (NoSQL) databases."},
                        {"skill_name": "Go", "skill_description": "A statically typed, compiled programming language designed at Google with syntax loosely based on C."},
                        {"skill_name": "Kotlin", "skill_description": "A cross-platform, statically typed, general-purpose programming language with type inference."},
                        {"skill_name": "Swift", "skill_description": "A general-purpose, multi-paradigm, compiled programming language developed by Apple Inc."},
                        {"skill_name": "PHP", "skill_description": "A general-purpose scripting language especially suited to web development."},
                        {"skill_name": "Ruby", "skill_description": "An interpreted, high-level, general-purpose programming language."},
                        {"skill_name": "Scala", "skill_description": "A general-purpose programming language providing support for both object-oriented and functional programming."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH067", "behavior_name": "Develops robust and scalable APIs.", "behavior_description": "Creates APIs that are reliable and can handle a large number of requests."},
                        {"behavior_id": "BEH068", "behavior_name": "Works with databases to store and retrieve data.", "behavior_description": "Uses databases to manage application data."},
                        {"behavior_id": "BEH069", "behavior_name": "Ensures the security of the application.", "behavior_description": "Implements security best practices to protect the application from attacks."}
                    ]
                },
                {
                    "competency_id": "COMP024",
                    "competency_name": "DevOps & Infrastructure",
                    "competency_description": "A set of practices that combines software development (Dev) and IT operations (Ops).",
                    "skills": [
                        {"skill_name": "CI/CD", "skill_description": "Continuous Integration and Continuous Delivery is a method to frequently deliver apps to customers by introducing automation into the stages of app development."},
                        {"skill_name": "Docker", "skill_description": "A set of platform as a service products that use OS-level virtualization to deliver software in packages called containers."},
                        {"skill_name": "Kubernetes", "skill_description": "An open-source container-orchestration system for automating computer application deployment, scaling, and management."},
                        {"skill_name": "Cloud Computing (AWS, Azure, GCP)", "skill_description": "The on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH070", "behavior_name": "Automates the build, test, and deployment process.", "behavior_description": "Uses automation to improve the speed and reliability of the development process."},
                        {"behavior_id": "BEH071", "behavior_name": "Manages and monitors application infrastructure.", "behavior_description": "Ensures that the application infrastructure is reliable and performant."},
                        {"behavior_id": "BEH072", "behavior_name": "Implements infrastructure as code.", "behavior_description": "Manages infrastructure using code and automation."}
                    ]
                },
                {
                    "competency_id": "COMP025",
                    "competency_name": "Software Testing & Quality Assurance",
                    "competency_description": "The process of evaluating and verifying that a software product or application does what it is supposed to do.",
                    "skills": [
                        {"skill_name": "Unit Testing", "skill_description": "A level of software testing where individual units/ components of a software are tested."},
                        {"skill_name": "Integration Testing", "skill_description": "A level of software testing where individual units are combined and tested as a group."},
                        {"skill_name": "End-to-End Testing", "skill_description": "A methodology used to test whether the flow of an application is performing as designed from start to finish."},
                        {"skill_name": "Test Automation", "skill_description": "The use of special software (separate from the software being tested) to control the execution of tests and the comparison of actual outcomes with predicted outcomes."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH073", "behavior_name": "Writes effective unit, integration, and end-to-end tests.", "behavior_description": "Creates tests that effectively verify the functionality of the application."},
                        {"behavior_id": "BEH074", "behavior_name": "Identifies and reports bugs and issues.", "behavior_description": "Finds and documents defects in the software."},
                        {"behavior_id": "BEH075", "behavior_name": "Contributes to a culture of quality.", "behavior_description": "Promotes quality throughout the development process."}
                    ]
                },
                {
                    "competency_id": "COMP027",
                    "competency_name": "Embedded Systems Development",
                    "competency_description": "The design and development of software for embedded systems, which are computer systems with a dedicated function within a larger mechanical or electrical system.",
                    "skills": [
                        {"skill_name": "C", "skill_description": "A general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion, with a static type system."},
                        {"skill_name": "C++", "skill_description": "A general-purpose programming language created as an extension of the C programming language, or 'C with Classes'."},
                        {"skill_name": "Rust", "skill_description": "A multi-paradigm, high-level, general-purpose programming language that emphasizes performance, type safety, and concurrency."},
                        {"skill_name": "Haskell", "skill_description": "A general-purpose, statically typed, purely functional programming language with type inference and lazy evaluation."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH079", "behavior_name": "Writes efficient and reliable code for resource-constrained systems.", "behavior_description": "Develops code that performs well on hardware with limited memory and processing power."},
                        {"behavior_id": "BEH080", "behavior_name": "Interfaces with hardware components and peripherals.", "behavior_description": "Writes software that communicates with and controls hardware devices."},
                        {"behavior_id": "BEH081", "behavior_name": "Debugs and tests embedded systems.", "behavior_description": "Identifies and resolves issues in embedded software and hardware."}
                    ]
                }
            ]
        },
        {
            "capability_id": "CAP012",
            "capability_name": "Flight Operations",
            "capability_description": "The management and execution of all activities related to the safe and efficient operation of aircraft.",
            "competencies": [
                {
                    "competency_id": "COMP026",
                    "competency_name": "Cabin Operations",
                    "competency_description": "The management of the aircraft cabin and the safety, security, and comfort of passengers.",
                    "skills": [
                        {"skill_name": "Passenger Safety Procedures", "skill_description": "Knowledge and application of safety procedures to ensure passenger well-being during flights."},
                        {"skill_name": "In-Flight Service", "skill_description": "Providing high-quality service to passengers during a flight."},
                        {"skill_name": "Emergency Response", "skill_description": "The ability to respond effectively to in-flight emergencies."}
                    ],
                    "behaviors": [
                        {"behavior_id": "BEH076", "behavior_name": "Conducts pre-flight safety checks.", "behavior_description": "Ensures all safety equipment is in place and functional before takeoff."},
                        {"behavior_id": "BEH077", "behavior_name": "Demonstrates safety procedures to passengers.", "behavior_description": "Clearly communicates safety information to passengers."},
                        {"behavior_id": "BEH078", "behavior_name": "Responds calmly and effectively to passenger needs.", "behavior_description": "Addresses passenger requests and concerns in a professional manner."}
                    ]
                }
            ]
        }
    ]

    proficiency_levels_data = [
        {"name": "Beginner", "description": "Has basic understanding and can perform simple tasks with guidance.", "level": 1},
        {"name": "Intermediate", "description": "Can perform tasks independently and solve common problems.", "level": 2},
        {"name": "Advanced", "description": "Proficient in complex tasks, can troubleshoot and guide others.", "level": 3},
        {"name": "Expert", "description": "Master of the skill, can innovate, set standards, and lead initiatives.", "level": 4}
    ]

    skill_relationships_data = [
        # Strategic Planning
        {"source_skill_name": "Strategic Visioning", "target_skill_name": "OKR Development", "relationship_type_id": "parent_of"},
        {"source_skill_name": "Strategic Visioning", "target_skill_name": "Long-term Planning", "relationship_type_id": "parent_of"},
        {"source_skill_name": "Competitive Analysis", "target_skill_name": "SWOT Analysis", "relationship_type_id": "parent_of"},
        {"source_skill_name": "Competitive Analysis", "target_skill_name": "Market Research", "relationship_type_id": "parent_of"},

        # Financial Management
        {"source_skill_name": "Financial Modeling", "target_skill_name": "Variance Analysis", "relationship_type_id": "parent_of"},
        {"source_skill_name": "Financial Modeling", "target_skill_name": "Budget Preparation", "relationship_type_id": "parent_of"},
        {"source_skill_name": "GAAP Compliance", "target_skill_name": "IFRS Reporting", "relationship_type_id": "parent_of"},
        {"source_skill_name": "GAAP Compliance", "target_skill_name": "Financial Statement Analysis", "relationship_type_id": "parent_of"},

        # Product Development
        {"source_skill_name": "User Experience (UX) Design", "target_skill_name": "Prototyping", "relationship_type_id": "parent_of"},
        {"source_skill_name": "User Experience (UX) Design", "target_skill_name": "Usability Testing", "relationship_type_id": "parent_of"},

        # Customer Relationship Management
        {"source_skill_name": "Active Listening", "target_skill_name": "Empathy", "relationship_type_id": "parent_of"},

        # Information Technology Management
        {"source_skill_name": "Network Administration", "target_skill_name": "Cloud Computing", "relationship_type_id": "parent_of"},
        {"source_skill_name": "Network Administration", "target_skill_name": "Cybersecurity", "relationship_type_id": "parent_of"},
    ]

    print("Populating ontology data (Capabilities, Competencies, Skills, Behaviors, Proficiencies, Relationships)...")

    # Add or update 'parent_of' relationship type
    parent_of_rel_type = RelationshipType.query.get("parent_of")
    if not parent_of_rel_type:
        parent_of_rel_type = RelationshipType(
            id="parent_of",
            name="Parent Of",
            description="Indicates that the source skill is a broader category or prerequisite for the target skill."
        )
        db.session.add(parent_of_rel_type)
        print("Added RelationshipType: Parent Of")
    else:
        if parent_of_rel_type.name != "Parent Of" or parent_of_rel_type.description != "Indicates that the source skill is a broader category or prerequisite for the target skill.":
            parent_of_rel_type.name = "Parent Of"
            parent_of_rel_type.description = "Indicates that the source skill is a broader category or prerequisite for the target skill."
            db.session.add(parent_of_rel_type)
            print("Updated RelationshipType: Parent Of")
        else:
            print("RelationshipType 'Parent Of' already up-to-date.")


    for cap_data in ontology_data:
        # Handle Capability
        capability = Capability.query.get(cap_data["capability_id"])
        if not capability:
            capability = Capability(
                id=cap_data["capability_id"],
                name=cap_data["capability_name"],
                description=cap_data["capability_description"]
            )
            db.session.add(capability)
            print(f"Added Capability: {capability.name}")
        else:
            if capability.name != cap_data["capability_name"] or capability.description != cap_data["capability_description"]:
                capability.name = cap_data["capability_name"]
                capability.description = cap_data["capability_description"]
                db.session.add(capability)
                print(f"Updated Capability: {capability.name}")
            else:
                print(f"Capability already up-to-date: {capability.name}")

        # Handle Competencies
        for comp_data in cap_data["competencies"]:
            competency = Competency.query.get(comp_data["competency_id"])
            if not competency:
                competency = Competency(
                    id=comp_data["competency_id"],
                    name=comp_data["competency_name"],
                    description=comp_data["competency_description"]
                )
                db.session.add(competency)
                print(f"Added Competency: {competency.name}")
            else:
                if competency.name != comp_data["competency_name"] or competency.description != comp_data["competency_description"]:
                    competency.name = comp_data["competency_name"]
                    competency.description = comp_data["competency_description"]
                    db.session.add(competency)
                    print(f"Updated Competency: {competency.name}")
                else:
                    print(f"Competency already up-to-date: {competency.name}")

            # Establish Capability-Competency relationship
            if competency not in capability.competencies:
                capability.competencies.append(competency)
                print(f"Linked Capability '{capability.name}' to Competency '{competency.name}'")

            # Handle Skills
            for skill_data in comp_data.get("skills", []):
                skill = Skill.query.filter_by(name=skill_data["skill_name"]).first()
                if not skill:
                    skill = Skill(
                        name=skill_data["skill_name"],
                        description=skill_data["skill_description"]
                    )
                    db.session.add(skill)
                    print(f"Added Skill: {skill.name}")
                else:
                    if skill.description != skill_data["skill_description"]:
                        skill.description = skill_data["skill_description"]
                        db.session.add(skill)
                        print(f"Updated Skill: {skill.name}")
                    else:
                        print(f"Skill already up-to-date: {skill.name}")
                
                db.session.flush()

                # Establish Competency-Skill relationship
                if skill not in competency.skills:
                    competency.skills.append(skill)
                    print(f"Linked Competency '{competency.name}' to Skill '{skill.name}'")

                # Handle Proficiencies for each skill
                for prof_data in proficiency_levels_data:
                    # Check if proficiency for this skill and level already exists
                    proficiency = Proficiency.query.filter_by(skill_id=skill.id, level=prof_data["level"]).first()
                    if not proficiency:
                        new_proficiency = Proficiency(
                            name=prof_data["name"],
                            description=prof_data["description"],
                            level=prof_data["level"],
                            skill_id=skill.id
                        )
                        db.session.add(new_proficiency)
                        print(f"Added Proficiency '{new_proficiency.name}' (Level {new_proficiency.level}) for Skill: {skill.name}")
                    else:
                        if proficiency.name != prof_data["name"] or proficiency.description != prof_data["description"]:
                            proficiency.name = prof_data["name"]
                            proficiency.description = prof_data["description"]
                            db.session.add(proficiency)
                            print(f"Updated Proficiency '{proficiency.name}' (Level {proficiency.level}) for Skill: {skill.name}")
                        else:
                            print(f"Proficiency '{proficiency.name}' (Level {proficiency.level}) for Skill '{skill.name}' already up-to-date.")


            # Handle Behaviors
            for beh_data in comp_data.get("behaviors", []):
                behavior = Behavior.query.get(beh_data["behavior_id"])
                if not behavior:
                    behavior = Behavior(
                        id=beh_data["behavior_id"],
                        name=beh_data["behavior_name"],
                        description=beh_data["behavior_description"],
                        competency_id=competency.id
                    )
                    db.session.add(behavior)
                    print(f"Added Behavior: {behavior.name} for Competency: {competency.name}")
                else:
                    if behavior.name != beh_data["behavior_name"] or behavior.description != beh_data["behavior_description"] or behavior.competency_id != competency.id:
                        behavior.name = beh_data["behavior_name"]
                        behavior.description = beh_data["behavior_description"]
                        behavior.competency_id = competency.id
                        db.session.add(behavior)
                        print(f"Updated Behavior: {behavior.name} for Competency: {competency.name}")
                    else:
                        print(f"Behavior already up-to-date: {behavior.name} for Competency: {competency.name}")
    
    # Handle Skill Relationships
    for rel_data in skill_relationships_data:
        source_skill = Skill.query.filter_by(name=rel_data["source_skill_name"]).first()
        target_skill = Skill.query.filter_by(name=rel_data["target_skill_name"]).first()
        rel_type = RelationshipType.query.get(rel_data["relationship_type_id"])

        if not source_skill:
            print(f"Warning: Source skill '{rel_data['source_skill_name']}' not found for relationship. Skipping.")
            continue
        if not target_skill:
            print(f"Warning: Target skill '{rel_data['target_skill_name']}' not found for relationship. Skipping.")
            continue
        if not rel_type:
            print(f"Warning: Relationship type '{rel_data['relationship_type_id']}' not found. Skipping relationship.")
            continue

        # Check if relationship already exists to avoid duplicates
        existing_rel = SkillRelationship.query.filter_by(
            source_skill_id=source_skill.id,
            target_skill_id=target_skill.id,
            relationship_type_id=rel_data["relationship_type_id"]
        ).first()

        if not existing_rel:
            new_rel = SkillRelationship(
                source_skill_id=source_skill.id,
                target_skill_id=target_skill.id,
                relationship_type_id=rel_data["relationship_type_id"]
            )
            db.session.add(new_rel)
            print(f"Added SkillRelationship: {source_skill.name} {rel_data['relationship_type_id']} {target_skill.name}")
        else:
            print(f"SkillRelationship already exists: {source_skill.name} {rel_data['relationship_type_id']} {target_skill.name}")


    try:
        db.session.commit()
        print("Ontology data population complete.")
    except Exception as e:
        db.session.rollback()
        print(f"Error populating ontology data: {e}")

if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        populate_ontology_data()
