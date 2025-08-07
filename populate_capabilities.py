from app import db
from app.models import Capability

def populate_capabilities():
    capabilities_data = [
        {
            "id": "CAP001",
            "name": "Strategic Planning",
            "description": "The ability to define long-term goals, develop strategies, and allocate resources to achieve organizational objectives, considering market trends and competitive landscapes."
        },
        {
            "id": "CAP002",
            "name": "Financial Management",
            "description": "Proficiency in managing financial resources, including budgeting, forecasting, financial analysis, risk management, and ensuring fiscal responsibility within an organization."
        },
        {
            "id": "CAP003",
            "name": "Product Development",
            "description": "The end-to-end process of creating new products or improving existing ones, encompassing ideation, design, prototyping, testing, and launch, often involving cross-functional teams."
        },
        {
            "id": "CAP004",
            "name": "Customer Relationship Management",
            "description": "Strategies and technologies used to manage and analyze customer interactions and data throughout the customer lifecycle, with the goal of improving business relationships and assisting in customer retention and sales growth."
        },
        {
            "id": "CAP005",
            "name": "Human Resources Management",
            "description": "The comprehensive management of an organization's workforce, including recruitment, training, performance management, compensation, employee relations, and compliance with labor laws."
        },
        {
            "id": "CAP006",
            "name": "Marketing and Sales",
            "description": "The integrated activities involved in promoting and selling products or services, including market research, branding, advertising, lead generation, and sales execution to drive revenue."
        },
        {
            "id": "CAP007",
            "name": "Operations Management",
            "description": "The administration of business practices to create the highest level of efficiency possible within an organization, converting materials and labor into goods and services as efficiently as possible to maximize the profit of an organization."
        },
        {
            "id": "CAP008",
            "name": "Information Technology Management",
            "description": "Overseeing the technological resources of an organization, including hardware, software, networks, and data, to ensure they support business objectives and maintain security and efficiency."
        },
        {
            "id": "CAP009",
            "name": "Research and Development",
            "description": "Systematic investigative and creative work undertaken to increase the stock of knowledge and to devise new applications of available knowledge, often leading to new products, processes, or services."
        },
        {
            "id": "CAP010",
            "name": "Supply Chain Management",
            "description": "The management of the flow of goods and services, involves the movement and storage of raw materials, of work-in-process inventory, and of finished goods from point of origin to point of consumption."
        }
    ]

    print("Populating capabilities...")
    for data in capabilities_data:
        capability = Capability.query.get(data["id"])
        if capability:
            # Update existing capability
            if capability.name != data["name"] or capability.description != data["description"]:
                capability.name = data["name"]
                capability.description = data["description"]
                db.session.add(capability)
                print(f"Updated capability: {capability.name}")
            else:
                print(f"Capability already up-to-date: {capability.name}")
        else:
            # Add new capability
            new_capability = Capability(
                id=data["id"],
                name=data["name"],
                description=data["description"]
            )
            db.session.add(new_capability)
            print(f"Added new capability: {new_capability.name}")
    
    try:
        db.session.commit()
        print("Capabilities population complete.")
    except Exception as e:
        db.session.rollback()
        print(f"Error populating capabilities: {e}")

if __name__ == "__main__":
    # This script assumes you have an Flask application context set up
    # For a simple run, you might need to manually set up the app context if not running within a Flask shell
    # Example:
    from app import create_app
    app = create_app()
    with app.app_context():
        populate_capabilities()
