import os
import sys

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import db
from app.models import Capability, Competency

def populate_base_ontology():
    """Populates the database with the initial set of capabilities and competencies."""
    ontology_data = [
        {
            "capability_id": "CAP001",
            "capability_name": "Strategic Planning",
            "capability_description": "The ability to define long-term goals, develop strategies, and allocate resources to achieve organizational objectives, considering market trends and competitive landscapes.",
            "competencies": [
                {
                    "competency_id": "COMP001",
                    "competency_name": "Vision & Goal Setting",
                    "competency_description": "The ability to articulate a clear future state and translate it into actionable, measurable objectives."
                },
                {
                    "competency_id": "COMP002",
                    "competency_name": "Market Analysis",
                    "competency_description": "The capacity to research, interpret, and apply insights from market data to inform strategic decisions."
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
                    "competency_description": "The ability to plan and predict financial outcomes, ensuring resources are allocated efficiently."
                },
                {
                    "competency_id": "COMP004",
                    "competency_name": "Financial Reporting",
                    "competency_description": "The skill to accurately present an organization's financial health and performance to stakeholders."
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
                    "competency_description": "The ability to generate, evaluate, and refine new product ideas and concepts."
                },
                {
                    "competency_id": "COMP006",
                    "competency_name": "Design Thinking",
                    "competency_description": "A human-centered approach to innovation that integrates the needs of people, the possibilities of technology, and the requirements for business success."
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
                    "competency_description": "Delivering high-quality service that meets and exceeds customer expectations."
                },
                {
                    "competency_id": "COMP008",
                    "competency_name": "Customer Data Analysis",
                    "competency_description": "The ability to collect, analyze, and interpret customer data to gain insights and improve customer strategies."
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
                    "competency_description": "The process of finding, attracting, interviewing, hiring, and onboarding employees."
                },
                {
                    "competency_id": "COMP010",
                    "competency_name": "Performance Management",
                    "competency_description": "The process of ensuring that employees are working effectively to achieve organizational goals."
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
                    "competency_description": "The process of maintaining, improving, and upholding a brand so that the name is always held in high regard."
                },
                {
                    "competency_id": "COMP012",
                    "competency_name": "Sales Strategy & Execution",
                    "competency_description": "Developing and implementing plans to achieve sales targets and drive revenue growth."
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
                    "competency_description": "Analyzing and improving existing business processes to enhance efficiency, reduce costs, and improve quality."
                },
                {
                    "competency_id": "COMP014",
                    "competency_name": "Quality Assurance",
                    "competency_description": "Ensuring that products, services, and processes meet specified standards and customer requirements."
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
                    "competency_description": "Managing the hardware, software, network, and facilities that support an organization's IT operations."
                },
                {
                    "competency_id": "COMP016",
                    "competency_name": "Software Development Lifecycle (SDLC)",
                    "competency_description": "Managing the entire process of developing, deploying, and maintaining software systems."
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
                    "competency_description": "Conducting systematic investigations to establish facts and reach new conclusions."
                },
                {
                    "competency_id": "COMP018",
                    "competency_name": "Innovation Management",
                    "competency_description": "The process of managing innovation procedures within an organization, from idea generation to commercialization."
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
                    "competency_description": "Managing the efficient flow and storage of goods from point of origin to point of consumption."
                },
                {
                    "competency_id": "COMP020",
                    "competency_name": "Supplier Relationship Management",
                    "competency_description": "Developing and maintaining strong relationships with suppliers to ensure reliable and high-quality supply."
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
                    "competency_description": "The ability to design and architect software systems that are scalable, reliable, and maintainable."
                },
                {
                    "competency_id": "COMP022",
                    "competency_name": "Frontend Development",
                    "competency_description": "The practice of producing HTML, CSS, and JavaScript for a website or web application so that a user can see and interact with them directly."
                },
                {
                    "competency_id": "COMP023",
                    "competency_name": "Backend Development",
                    "competency_description": "The server-side of development where you are primarily focused on how the site works."
                },
                {
                    "competency_id": "COMP024",
                    "competency_name": "DevOps & Infrastructure",
                    "competency_description": "A set of practices that combines software development (Dev) and IT operations (Ops)."
                },
                {
                    "competency_id": "COMP025",
                    "competency_name": "Software Testing & Quality Assurance",
                    "competency_description": "The process of evaluating and verifying that a software product or application does what it is supposed to do."
                },
                {
                    "competency_id": "COMP027",
                    "competency_name": "Embedded Systems Development",
                    "competency_description": "The design and development of software for embedded systems, which are computer systems with a dedicated function within a larger mechanical or electrical system."
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
                    "competency_description": "The management of the aircraft cabin and the safety, security, and comfort of passengers."
                }
            ]
        }
    ]

    for cap_data in ontology_data:
        capability = Capability.query.get(cap_data["capability_id"])
        if not capability:
            capability = Capability(
                id=cap_data["capability_id"],
                name=cap_data["capability_name"],
                description=cap_data["capability_description"]
            )
            db.session.add(capability)
            print(f"Added Capability: {capability.name}")

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

            if competency not in capability.competencies:
                capability.competencies.append(competency)
                print(f"Linked Capability '{capability.name}' to Competency '{competency.name}'")

    try:
        db.session.commit()
        print("Base ontology data population complete.")
    except Exception as e:
        db.session.rollback()
        print(f"Error populating base ontology data: {e}")

if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        populate_base_ontology()
