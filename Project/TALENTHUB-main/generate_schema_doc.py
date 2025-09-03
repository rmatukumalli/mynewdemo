import inspect
import re
from app import db, create_app # Import create_app from app/__init__.py
from app import models
from sqlalchemy import inspect as sa_inspect # Import SQLAlchemy's inspect

def get_schema_info():
    schema_info = {}
    for name, obj in inspect.getmembers(models):
        if inspect.isclass(obj) and issubclass(obj, db.Model) and obj != db.Model:
            table_name = obj.__tablename__
            schema_info[table_name] = {
                "model_name": name,
                "columns": [],
                "relationships": []
            }

            # Use SQLAlchemy's inspect to get mapped columns and relationships
            mapper = sa_inspect(obj)

            for col in mapper.columns:
                col_type = str(col.type)
                is_pk = col.primary_key
                is_nullable = col.nullable
                is_unique = col.unique
                fk_info = None
                if col.foreign_keys:
                    fk_info = ", ".join([fk.target_fullname for fk in col.foreign_keys])
                
                schema_info[table_name]["columns"].append({
                    "name": col.name,
                    "type": col_type,
                    "primary_key": is_pk,
                    "nullable": is_nullable,
                    "unique": is_unique,
                    "foreign_key": fk_info
                })
            
            for rel in mapper.relationships:
                related_model_name = rel.mapper.class_.__name__
                
                rel_type = ""
                if rel.uselist == True and rel.secondary is not None:
                    rel_type = "Many-to-Many"
                elif rel.uselist == True:
                    rel_type = "One-to-Many"
                elif rel.uselist == False:
                    rel_type = "One-to-One/Many-to-One" # From source to target

                schema_info[table_name]["relationships"].append({
                    "target_model": related_model_name,
                    "type": rel_type,
                    "backref": str(rel.backref) if rel.backref else None # Ensure backref is serializable
                })
    return schema_info

def generate_mermaid_er_diagram(schema_info):
    mermaid_diagram = "erDiagram\n"
    
    # Add entities (tables)
    for table_name, info in schema_info.items():
        mermaid_diagram += f"    {table_name} {{\n"
        for col in info["columns"]:
            pk_str = "PK" if col["primary_key"] else ""
            fk_str = "FK" if col["foreign_key"] else ""
            unique_str = "UNIQUE" if col["unique"] else ""
            
            # Combine PK, FK, UNIQUE strings
            constraints = []
            if pk_str: constraints.append(pk_str)
            if fk_str: constraints.append(fk_str)
            if unique_str: constraints.append(unique_str)
            constraint_str = " ".join(constraints) if constraints else "" # Use space as separator

            # Clean up type for display (e.g., VARCHAR(255) -> VARCHAR)
            col_type_display = re.sub(r'\(.*?\)', '', col["type"]).strip() # Use non-greedy match
            
            mermaid_diagram += f"        {col_type_display} {col['name']} {constraint_str}\n"
        mermaid_diagram += "    }\n"

    # Add relationships
    for table_name, info in schema_info.items():
        for rel in info["relationships"]:
            target_table_name = None
            # Find the target table name from the schema_info keys
            for t_name, t_info in schema_info.items():
                if t_info["model_name"] == rel["target_model"]:
                    target_table_name = t_name
                    break
            
            if target_table_name:
                # Mermaid relationship syntax:
                # ENTITY1 ||--|{ ENTITY2 : "Relationship Label"
                # ||--|{ : One-to-one
                # ||--o{ : One-to-many
                # }o--o{ : Many-to-many
                
                # Simplified relationship type mapping for Mermaid
                # This needs to be more robust for accurate ER diagram generation
                # For now, let's just use a generic "has" or "relates to"
                
                # Attempt to infer cardinality from SQLAlchemy relationship properties
                # This is a heuristic and might not cover all cases
                cardinality_source = "||" # Default to one
                cardinality_target = "||" # Default to one
                
                # If it's a many-to-many, both ends are "many"
                if "Many-to-Many" in rel["type"]:
                    cardinality_source = "}o"
                    cardinality_target = "o{"
                elif "One-to-Many" in rel["type"]:
                    cardinality_source = "||"
                    cardinality_target = "o{"
                # For One-to-One/Many-to-One, it's harder to tell which side is "many" without more context
                # For simplicity, we'll assume the source is "many" if it's a backref from a collection
                # or if the relationship itself implies a collection on the source side.
                # This part is tricky and often requires manual verification or more sophisticated parsing.
                
                # For now, let's use a simple approach based on the 'type' string
                if "One-to-Many" in rel["type"]:
                    mermaid_diagram += f"    {table_name} ||--o{{ {target_table_name} : \"has\"\n"
                elif "Many-to-Many" in rel["type"]:
                    mermaid_diagram += f"    {table_name} }}o--o{{ {target_table_name} : \"associates with\"\n"
                else: # One-to-One or Many-to-One (from target's perspective)
                    # This needs careful consideration. If A has a FK to B, it's A --|> B (many-to-one from A to B)
                    # If B has a relationship to A, it could be one-to-one or one-to-many.
                    # For simplicity, let's assume a generic "relates to" for now.
                    mermaid_diagram += f"    {table_name} ||--|| {target_table_name} : \"relates to\"\n"
            else:
                print(f"Warning: Could not find target table for model {rel['target_model']}")

    return mermaid_diagram

def generate_html_content(schema_info, mermaid_diagram):
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skills Ontology Database Schema Documentation</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f4f4f4; color: #333; }}
        .container {{ max-width: 1200px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
        h1, h2, h3 {{ color: #0056b3; }}
        .mermaid {{ background-color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; overflow: auto; height: 600px; }}
        .table-section {{ margin-bottom: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }}
        .table-section h3 {{ margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }}
        .table-section ul {{ list-style: none; padding: 0; }}
        .table-section ul li {{ margin-bottom: 8px; }}
        .table-section ul li strong {{ color: #007bff; }}
        .column-details {{ margin-left: 20px; }}
        .relationship-details {{ margin-left: 20px; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #e2e2e2; }}

        /* Tab styles */
        .tab-container {{
            overflow: hidden;
            border: 1px solid #ccc;
            background-color: #f1f1f1;
            border-radius: 8px;
            margin-top: 20px;
        }}

        .tabs {{
            display: flex;
            justify-content: flex-start; /* Align tabs to the left */
            border-bottom: 1px solid #ccc;
        }}

        .tab-button {{
            background-color: inherit;
            float: left;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 14px 16px;
            transition: 0.3s;
            font-size: 17px;
            border-right: 1px solid #ccc; /* Separator between tabs */
        }}

        .tab-button:hover {{
            background-color: #ddd;
        }}

        .tab-button.active {{
            background-color: #ccc;
        }}

        .tab-content {{
            display: none;
            padding: 20px;
            border-top: none;
        }}

        .tab-content.active {{
            display: block;
        }}

        /* Modal styles */
        .modal {{
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }}

        .modal-content {{
            background-color: #fefefe;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 80%; /* Could be more or less, depending on screen size */
            border-radius: 8px;
            position: relative;
        }}

        .close-button {{
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }}

        .close-button:hover,
        .close-button:focus {{
            color: black;
            text-decoration: none;
            cursor: pointer;
        }}

        .modal-data-table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }}

        .modal-data-table th, .modal-data-table td {{
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }}

        .modal-data-table th {{
            background-color: #e2e2e2;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Skills Ontology Database Schema Documentation</h1>
        <p>This document provides an overview and detailed explanation of the database schema for the Skills Ontology application, derived from <code>app/models.py</code>.</p>

        <div class="tab-container">
            <div class="tabs">
                <button class="tab-button active" onclick="openTab(event, 'schemaDetails')">Schema Details</button>
                <button class="tab-button" onclick="openTab(event, 'appLinkages')">Application Linkages</button>
            </div>

            <div id="schemaDetails" class="tab-content active">
                <h2>Database Schema ER Diagram</h2>
                <div class="mermaid">
                    {mermaid_diagram}
                </div>

                <h2>Table Details</h2>
        """

    for table_name, info in schema_info.items():
        html_content += f"""
                <div class="table-section">
                    <h3>Table: <code>{table_name}</code> (Model: <code>{info['model_name']}</code>)</h3>
                    <h4>Columns:</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Primary Key</th>
                                <th>Nullable</th>
                                <th>Unique</th>
                                <th>Foreign Key</th>
                            </tr>
                        </thead>
                        <tbody>
                """
        for col in info["columns"]:
            html_content += f"""
                            <tr>
                                <td><code>{col['name']}</code></td>
                                <td>{col['type']}</td>
                                <td>{'Yes' if col['primary_key'] else 'No'}</td>
                                <td>{'Yes' if col['unique'] else 'No'}</td>
                                <td>{col['foreign_key'] if col['foreign_key'] else 'N/A'}</td>
                            </tr>
                    """
        html_content += f"""
                        </tbody>
                    </table>
                    <h4>Relationships:</h4>
                    <ul>
                """
        if info["relationships"]:
            for rel in info["relationships"]:
                html_content += f"""
                        <li><strong>Relates to <code>{rel['target_model']}</code>:</strong> {rel['type']} (Backref: <code>{rel['backref'] if rel['backref'] else 'N/A'}</code>)</li>
                        """
        else:
            html_content += "<li>No explicit relationships defined from this model.</li>"
        
        html_content += f"""
                    </ul>
                </div>
                """

    html_content += """
            </div> <!-- End schemaDetails tab -->

            <div id="appLinkages" class="tab-content">
                <h2>Application-Table Linkages</h2>
                <p>This section explains how different functional modules of the application interact with the database tables, providing a high-level overview of data usage.</p>

                <div class="table-section">
                    <h3>Skills Management</h3>
                    <p><strong>Relevant APIs:</strong> <code>skill_api.py</code>, <code>proficiency_api.py</code>, <code>skilltag_api.py</code>, <code>skill_relationship_api.py</code>, <code>user_skill_api.py</code>, <code>skill_gap_api.py</code></p>
                    <p><strong>Primary Tables:</strong> <span class="table-link" onclick="showSampleData('skill')"><code>skill</code></span>, <span class="table-link" onclick="showSampleData('proficiency')"><code>proficiency</code></span>, <span class="table-link" onclick="showSampleData('skill_tag')"><code>skill_tag</code></span>, <span class="table-link" onclick="showSampleData('skill_relationship')"><code>skill_relationship</code></span>, <span class="table-link" onclick="showSampleData('user_skill')"><code>user_skill</code></span>, <span class="table-link" onclick="showSampleData('skill_gap')"><code>skill_gap</code></span></p>
                    <p><strong>Explanation:</strong> This module handles the creation, retrieval, updating, and deletion of skills, their proficiency levels, tags, and relationships between skills. It also manages user-specific skills and identifies skill gaps, forming the core of the skills ontology.</p>
                </div>

                <div class="table-section">
                    <h3>Job Architecture</h3>
                    <p><strong>Relevant APIs:</strong> <code>job_architecture.py</code>, <code>organization_api.py</code>, <code>business_unit_api.py</code>, <code>department_api.py</code>, <code>rolegroup_api.py</code>, <code>joblevel_api.py</code>, <code>jobprofile_api.py</code>, <code>role_api.py</code></p>
                    <p><strong>Primary Tables:</strong> <span class="table-link" onclick="showSampleData('organization')"><code>organization</code></span>, <span class="table-link" onclick="showSampleData('business_unit')"><code>business_unit</code></span>, <span class="table-link" onclick="showSampleData('department')"><code>department</code></span>, <span class="table-link" onclick="showSampleData('role_group')"><code>role_group</code></span>, <span class="table-link" onclick="showSampleData('job_level')"><code>job_level</code></span>, <span class="table-link" onclick="showSampleData('job_profile')"><code>job_profile</code></span>, <span class="table-link" onclick="showSampleData('role')"><code>role</code></span></p>
                    <p><strong>Explanation:</strong> This module defines the organizational structure, job roles, levels, and profiles. It links skills and competencies to specific roles and job requirements, providing the framework for talent management.</p>
                </div>

                <div class="table-section">
                    <h3>Competency & Capability Management</h3>
                    <p><strong>Relevant APIs:</strong> <code>capability_api.py</code>, <code>competency_api.py</code>, <code>behavior_api.py</code></p>
                    <p><strong>Primary Tables:</strong> <span class="table-link" onclick="showSampleData('capability')"><code>capability</code></span>, <span class="table-link" onclick="showSampleData('competency')"><code>competency</code></span>, <span class="table-link" onclick="showSampleData('behavior')"><code>behavior</code></span></p>
                    <p><strong>Explanation:</strong> Manages the definition and relationships of capabilities, competencies, and associated behaviors within the organization, providing a hierarchical structure for defining required attributes.</p>
                </div>

                <div class="table-section">
                    <h3>User & Career Management</h3>
                    <p><strong>Relevant APIs:</strong> <code>user_api.py</code>, <code>user_career_history_api.py</code>, <code>career_path_api.py</code></p>
                    <p><strong>Primary Tables:</strong> <span class="table-link" onclick="showSampleData('user')"><code>user</code></span>, <span class="table-link" onclick="showSampleData('user_career_history')"><code>user_career_history</code></span>, <span class="table-link" onclick="showSampleData('career_path')"><code>career_path</code></span></p>
                    <p><strong>Explanation:</strong> Handles user profiles, their career progression, and historical roles within the organization, enabling personalized career development and internal mobility.</p>
                </div>

                <div class="table-section">
                    <h3>Learning & Development</h3>
                    <p><strong>Relevant APIs:</strong> <code>learning_resource_api.py</code>, <code>learning_path_api.py</code>, <code>learning_path_resource_association_api.py</code>, <code>assessment_api.py</code>, <code>certification_api.py</code></p>
                    <p><strong>Primary Tables:</strong> <span class="table-link" onclick="showSampleData('learning_resource')"><code>learning_resource</code></span>, <span class="table-link" onclick="showSampleData('learning_path')"><code>learning_path</code></span>, <span class="table-link" onclick="showSampleData('learning_path_resources')"><code>learning_path_resources</code></span>, <span class="table-link" onclick="showSampleData('assessment')"><code>assessment</code></span>, <span class="table-link" onclick="showSampleData('certification')"><code>certification</code></span></p>
                    <p><strong>Explanation:</strong> Manages learning content, defines structured learning paths, tracks assessments for skill validation, and records user certifications, supporting continuous learning and development.</p>
                </div>

                <div class="table-section">
                    <h3>Feedback & Projects</h3>
                    <p><strong>Relevant APIs:</strong> <code>feedback_api.py</code>, <code>project_or_assignment_api.py</code></p>
                    <p><strong>Primary Tables:</strong> <span class="table-link" onclick="showSampleData('feedback')"><code>feedback</code></span>, <span class="table-link" onclick="showSampleData('project_or_assignment')"><code>project_or_assignment</code></span></p>
                    <p><strong>Explanation:</strong> Manages feedback mechanisms for performance and development, and tracks projects or assignments, linking them to users, roles, and organizations for comprehensive talent insights.</p>
                </div>

            </div> <!-- End appLinkages tab -->
        </div> <!-- End tab-container -->

        <!-- The Modal -->
        <div id="sampleDataModal" class="modal">
            <!-- Modal content -->
            <div class="modal-content">
                <span class="close-button" onclick="closeModal()">&times;</span>
                <h2 id="modalTableName"></h2>
                <div id="modalDataTableContainer"></div>
            </div>
        </div>

    </div>
    <script>
        mermaid.initialize({ 
            startOnLoad: true,
            securityLevel: 'loose', // Recommended for interactivity
            // Enable interactivity for zooming and panning
            // These options might vary slightly by Mermaid.js version,
            // but are common for enabling mouse/touch interactions.
            // For ER diagrams, often just having a large enough container
            // and not explicitly disabling features is enough.
            // Let's try adding a specific class for interactive diagrams.
            // The 'zoom' and 'pan' properties are usually for initial state,
            // not enabling the feature itself.
            // The default behavior for ER diagrams often includes pan/zoom if the diagram is larger than its container.
            // Let's ensure the container allows overflow and is not fixed size.
            // Adding a specific class for interactive diagrams might help.
            // Let's try to explicitly set the render mode to 'svg' and enable interactivity.
            flowchart: {
                use
            },
            er: {
                width: 1000, // Set a default width, can be overridden by CSS
                height: 800, // Set a default height
                layoutDirection: 'TB' // Top to Bottom
            },
            // For interactivity, Mermaid.js often relies on the SVG output.
            // The 'zoom' and 'pan' properties are not standard configuration for enabling interactivity.
            // Instead, it's often handled by the SVG itself or external libraries.
            // Let's ensure the SVG is not constrained.
            // The user might be expecting specific UI controls for zoom.
            // Mermaid.js itself doesn't typically add zoom buttons.
            // Zooming is usually done via mouse wheel/trackpad.
            // Let's ensure the diagram is large enough to warrant zoom.
            // The previous issue was "too big", so it should be overflowing.
            // Let's try to ensure the SVG itself is interactive.
            // The 'interactive' property is not a standard Mermaid.js config.
            // Let's try to add a specific class to the mermaid div to enable external zoom/pan.
            // For now, let's rely on the default Mermaid.js behavior for zoom/pan.
            // The issue might be that the diagram is not overflowing its container,
            // or the browser's default zoom/pan is not being recognized.
            // Let's ensure the mermaid div has a min-width/min-height to allow overflow.
            // The user's provided diagram is quite large, so it should overflow.
            // Let's try to add a wrapper div with overflow auto.
            // This is a common pattern for scrollable/zoomable content.
            // I will add a wrapper div around the mermaid div with overflow-x: auto.
            // This will enable horizontal scrolling if the diagram is too wide.
            // Vertical scrolling should be handled by the page itself.
            // For actual zoom/pan, it's usually browser-native or requires a library like 'svg-pan-zoom'.
            // Mermaid.js itself doesn't provide explicit zoom/pan *controls* by default.
            // The user might be expecting buttons.
            // Let's add a note about using browser's native zoom or mouse wheel.
            // I will revert the zoom/pan properties as they are not standard for enabling.
            // The 'securityLevel: loose' is good for allowing external content.
            // The core issue is likely the expectation of UI controls vs. native browser behavior.
            // I will add a note in the HTML about how to zoom.
            // I will remove the `zoom` and `pan` properties from `mermaid.initialize` as they are not standard for enabling interactivity.
            // The default behavior of Mermaid.js should allow browser-native zoom.
            // The problem might be that the diagram is not overflowing its container, preventing browser scrollbars/zoom.
            // Let's ensure the `.mermaid` div itself is scrollable if it overflows.
            // I will add `overflow: auto;` to the `.mermaid` CSS.
        });
        mermaid.initialize({ 
            startOnLoad: true,
            securityLevel: 'loose', // Recommended for interactivity
            // For zooming and panning, Mermaid.js typically relies on browser-native features
            // (e.g., Ctrl/Cmd + mouse wheel) or external libraries like 'svg-pan-zoom'.
            // The 'zoom' and 'pan' properties in initialize are not standard for enabling this.
            // The primary way to make a large diagram viewable is to ensure its container allows scrolling.
        });

        // Add a note about zooming for the user
        document.addEventListener("DOMContentLoaded", function() {
            const mermaidDiv = document.querySelector('.mermaid');
            if (mermaidDiv) {
                const zoomNote = document.createElement('p');
                zoomNote.innerHTML = '<em>Tip: Use Ctrl/Cmd + mouse wheel to zoom in/out on the diagram, and click-and-drag to pan.</em>';
                mermaidDiv.parentNode.insertBefore(zoomNote, mermaidDiv.nextSibling);
            }
        });

        function openTab(evt, tabName) {
            console.log(`openTab called for: ${tabName}`);
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].classList.remove("active"); // Remove active class
                console.log(`Removed active from ${tabcontent[i].id}`);
            }
            tablinks = document.getElementsByClassName("tab-button");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].classList.remove("active"); // Remove active class
                console.log(`Removed active from button ${tablinks[i].textContent}`);
            }
            document.getElementById(tabName).classList.add("active"); // Add active class to content
            evt.currentTarget.classList.add("active"); // Add active class to button
            console.log(`Added active to ${tabName} and button ${evt.currentTarget.textContent}`);
        }

        // Open the first tab by default
        document.addEventListener("DOMContentLoaded", function() {
            console.log("DOMContentLoaded fired. Attempting to set first tab active.");
            // Ensure the first tab content is active and others are not initially
            var firstTabButton = document.getElementsByClassName("tab-button")[0];
            var firstTabContent = document.getElementById("schemaDetails"); // Assuming 'schemaDetails' is the first tab's content ID

            if (firstTabButton && firstTabContent) {
                firstTabContent.classList.add("active");
                firstTabButton.classList.add("active");
                console.log("First tab (Schema Details) set as active on DOMContentLoaded.");
            } else {
                console.error("Could not find first tab button or content on DOMContentLoaded.");
            }
        });

        function openTab(evt, tabName) {
            console.log(`openTab called for: ${tabName}`);
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].classList.remove("active"); // Remove active class
                console.log(`Removed active from ${tabcontent[i].id}`);
            }
            tablinks = document.getElementsByClassName("tab-button");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].classList.remove("active"); // Remove active class
                console.log(`Removed active from button ${tablinks[i].textContent}`);
            }
            document.getElementById(tabName).classList.add("active"); // Add active class to content
            evt.currentTarget.classList.add("active"); // Add active class to button
            console.log(`Added active to ${tabName} and button ${evt.currentTarget.textContent}`);
        }

        // Open the first tab by default
        document.addEventListener("DOMContentLoaded", function() {
            // Manually set the first tab as active on load
            document.getElementById("schemaDetails").classList.add("active");
            document.getElementsByClassName("tab-button")[0].classList.add("active");
        });

        // Modal functions
        var modal = document.getElementById("sampleDataModal");
        var modalTableName = document.getElementById("modalTableName");
        var modalDataTableContainer = document.getElementById("modalDataTableContainer");

        function showSampleData(tableName) {
            modalTableName.textContent = `Sample Data for Table: ${tableName}`;
            modalDataTableContainer.innerHTML = 'Loading...'; // Show loading message

            fetch(`/api/sample_data/${tableName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        modalDataTableContainer.innerHTML = `<p>Error: ${data.error}</p>`;
                    } else if (data.data.length === 0) {
                        modalDataTableContainer.innerHTML = `<p>No sample data available for table '${tableName}'.</p>`;
                    } else {
                        let tableHtml = '<table class="modal-data-table"><thead><tr>';
                        // Create table headers
                        for (const key in data.data[0]) {
                            tableHtml += `<th>${key}</th>`;
                        }
                        tableHtml += '</tr></thead><tbody>';

                        // Create table rows
                        data.data.forEach(row => {
                            tableHtml += '<tr>';
                            for (const key in row) {
                                tableHtml += `<td>${row[key]}</td>`;
                            }
                            tableHtml += '</tr>';
                        });
                        tableHtml += '</tbody></table>';
                        modalDataTableContainer.innerHTML = tableHtml;
                    }
                })
                .catch(error => {
                    console.error('Error fetching sample data:', error);
                    modalDataTableContainer.innerHTML = `<p>Failed to load data: ${error.message}</p>`;
                });

            modal.style.display = "block"; // Show the modal
        }

        function closeModal() {
            modal.style.display = "none";
        }

        // Close the modal if the user clicks outside of it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    </script>
    <style>
        /* Tab styles */
        .tab-container {
            overflow: hidden;
            border: 1px solid #ccc;
            background-color: #f1f1f1;
            border-radius: 8px;
            margin-top: 20px;
        }

        .tabs {
            display: flex;
            justify-content: flex-start; /* Align tabs to the left */
            border-bottom: 1px solid #ccc;
        }

        .tab-button {
            background-color: inherit;
            float: left;
            border: none;
            outline: none;
            cursor: pointer;
            padding: 14px 16px;
            transition: 0.3s;
            font-size: 17px;
            border-right: 1px solid #ccc; /* Separator between tabs */
        }

        .tab-button:hover {
            background-color: #ddd;
        }

        .tab-button.active {
            background-color: #ccc;
        }

        .tab-content {
            display: none;
            padding: 20px;
            border-top: none;
        }
    </style>
</body>
</html>
    """
    return html_content

if __name__ == "__main__":
    # This part needs to be run within a Flask app context to access db.Model properly
    # For a standalone script, we need a dummy app context
    app = create_app() # Use the imported create_app
    with app.app_context():
        schema_data = get_schema_info()
        print("\n--- Schema Data Extracted ---")
        import json
        print(json.dumps(schema_data, indent=2))
        print("-----------------------------\n")

        # Use the Mermaid code provided by the user
        user_provided_mermaid_code = """erDiagram
    alembic_version {
        varchar(32) version_num PK
    }
    capability {
        varchar(150) id PK
        varchar(150) name
        text description
        datetime created_at
        datetime updated_at
        json custom_fields
        boolean is_active
    }
    competency {
        varchar(150) id PK
        varchar(150) name
        text description
        json custom_fields
    }
    job_level {
        varchar(150) id PK
        varchar(150) level_name
        text description
        int salary_band_min
        int salary_band_max
        int min_experience_years
        text allowed_titles
        varchar(50) level_code
        boolean is_managerial
        text promotion_criteria
    }
    organization {
        varchar(150) id PK
        varchar(255) company_name
        varchar(100) industry
        varchar(50) company_size
        text operating_regions
        int founded_year
        varchar(50) public_or_private
        varchar(10) stock_symbol
        text vision_mission
        varchar(50) org_maturity_level
        boolean hrms_integrated
        varchar(100) erp_system
        boolean org_chart_available
        text org_metadata_file
    }
    relationship_type {
        varchar(50) id PK
        varchar(100) name
        text description
    }
    role_group {
        varchar(150) id PK
        varchar(150) name
        text description
        text sample_roles
        varchar(100) strategic_importance
        boolean business_critical
        text associated_departments
        varchar(50) role_family_code
    }
    skill {
        varchar(150) id PK
        varchar(150) name
        text description
        varchar(100) category
        varchar(50) criticality
        datetime created_at
        datetime updated_at
        json custom_fields
        boolean is_active
    }
    skill_tag {
        varchar(150) id PK
        varchar(100) name
        text description
    }
    user {
        varchar(150) id PK
        varchar(100) username
        varchar(150) email
        text description
    }
    assessment {
        int id PK
        varchar(255) name
        text description
        varchar(150) skill_id FK
        varchar(100) assessment_type
        date date_created
        date last_updated
    }
    behavior {
        varchar(150) id PK
        varchar(255) name
        text description
        varchar(150) competency_id FK
        varchar(150) job_level_id FK
    }
    business_unit {
        varchar(150) id PK
        varchar(150) name
        varchar(150) head
        varchar(150) email
        varchar(150) organization_id FK
        text strategic_priority
        text kpis
        varchar(100) business_unit_type
        varchar(150) location
        int budget_allocation
    }
    capability_competencies {
        varchar(150) capability_id PK, FK
        varchar(150) competency_id PK, FK
    }
    certification {
        varchar(150) id PK
        varchar(255) name
        varchar(255) issuing_organization
        date issue_date
        date expiry_date
        varchar(255) credential_id
        text credential_url
        varchar(150) user_id FK
        varchar(150) skill_id FK
        varchar(150) organization_id FK
        varchar(100) certification_type
        varchar(50) status
        datetime created_at
        datetime updated_at
    }
    competency_skills {
        varchar(150) competency_id PK, FK
        varchar(150) skill_id PK, FK
    }
    job_profile {
        varchar(150) id PK
        varchar(255) job_title
        varchar(150) job_level_id FK
        varchar(150) role_group_id FK
        varchar(150) job_family
        text description
        text education
        text language_requirements
        varchar(150) reports_to
        varchar(50) work_model
        varchar(50) job_type
        boolean union_affiliation
        varchar(50) job_code
        varchar(150) work_location
        boolean travel_required
        text compliance_requirements
    }
    learning_resource {
        int id PK
        varchar(255) title
        text description
        text url
        varchar(100) resource_type
        varchar(150) skill_id FK
        varchar(150) author
        int estimated_time_minutes
    }
    proficiency {
        int id PK
        varchar(100) name
        text description
        int level
        varchar(150) skill_id FK
    }
    skill_gap {
        varchar(150) id PK
        varchar(150) user_id FK
        varchar(150) skill_id FK
        int required_proficiency
        int current_proficiency
        int gap_score
    }
    skill_relationship {
        int id PK
        varchar(150) source_skill_id FK
        varchar(150) target_skill_id FK
        varchar(50) relationship_type_id FK
    }
    skill_tag_map {
        varchar(150) skill_id PK, FK
        varchar(150) tag_id PK, FK
    }
    department {
        varchar(150) id PK
        varchar(150) name
        varchar(150) business_unit_id FK
        varchar(150) manager
        varchar(150) email
        int headcount_budget
        varchar(100) function_type
        varchar(150) location
        boolean shift_coverage
        varchar(50) time_zone
        varchar(50) department_code
    }
    job_profile_required_skills {
        varchar(150) job_profile_id PK, FK
        varchar(150) skill_id PK, FK
    }
    user_skill {
        int id PK
        varchar(150) user_id FK
        varchar(150) skill_id FK
        int proficiency_level_id FK
        date acquired_date
        date last_validated_date
        varchar(50) validation_status
    }
    business_unit_departments {
        varchar(150) business_unit_id PK, FK
        varchar(150) department_id PK, FK
    }
    role {
        varchar(150) id PK
        varchar(150) name
        text description
        varchar(150) department_id FK
        varchar(150) job_level_id FK
        datetime created_at
        datetime updated_at
        json custom_fields
        boolean is_active
    }
    career_path {
        varchar(150) id PK
        varchar(150) source_role_id FK
        varchar(150) target_role_id FK
        varchar(100) transition_type
        text notes
        boolean is_default
    }
    feedback {
        varchar(150) id PK
        varchar(150) giver_id FK
        varchar(150) receiver_id FK
        text feedback_text
        date feedback_date
        varchar(100) feedback_type
        int rating
        varchar(150) associated_role_id FK
        varchar(150) skill_id FK
        varchar(150) competency_id FK
        text private_notes
        text action_items
        datetime created_at
        datetime updated_at
    }
    learning_path {
        varchar(150) id PK
        varchar(255) title
        text description
        varchar(150) role_id FK
        varchar(150) created_by
        int estimated_duration
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    project_or_assignment {
        varchar(150) id PK
        varchar(255) name
        text description
        date start_date
        date end_date
        varchar(50) status
        varchar(100) project_type
        int budget
        varchar(150) manager_id FK
        varchar(150) organization_id FK
        varchar(150) associated_role_id FK
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    role_competencies {
        varchar(150) role_id PK, FK
        varchar(150) competency_id PK, FK
    }
    user_career_history {
        int id PK
        varchar(150) user_id FK
        varchar(150) role_id FK
        date start_date
        date end_date
        text notes
    }
    learning_path_resources {
        varchar(150) learning_path_id PK, FK
        int learning_resource_id PK, FK
        int sequence_order
    }

    assessment ||--|{ skill : "skill_id"
    behavior ||--|{ competency : "competency_id"
    behavior ||--|{ job_level : "job_level_id"
    business_unit ||--|{ organization : "organization_id"
    capability_competencies }|--|| capability : "capability_id"
    capability_competencies }|--|| competency : "competency_id"
    certification ||--|{ organization : "organization_id"
    certification ||--|{ skill : "skill_id"
    certification ||--|{ user : "user_id"
    competency_skills }|--|| competency : "competency_id"
    competency_skills }|--|| skill : "skill_id"
    job_profile ||--|{ job_level : "job_level_id"
    job_profile ||--|{ role_group : "role_group_id"
    learning_resource ||--|{ skill : "skill_id"
    proficiency ||--|{ skill : "skill_id"
    skill_gap ||--|{ skill : "skill_id"
    skill_gap ||--|{ user : "user_id"
    skill_relationship ||--|{ relationship_type : "relationship_type_id"
    skill_relationship ||--|{ skill : "source_skill_id"
    skill_relationship ||--|{ skill : "target_skill_id"
    skill_tag_map }|--|| skill : "skill_id"
    skill_tag_map }|--|| skill_tag : "tag_id"
    department ||--|{ business_unit : "business_unit_id"
    job_profile_required_skills }|--|| job_profile : "job_profile_id"
    job_profile_required_skills }|--|| skill : "skill_id"
    user_skill ||--|{ proficiency : "proficiency_level_id"
    user_skill ||--|{ skill : "skill_id"
    user_skill ||--|{ user : "user_id"
    business_unit_departments }|--|| business_unit : "business_unit_id"
    business_unit_departments }|--|| department : "department_id"
    role ||--|{ department : "department_id"
    role ||--|{ job_level : "job_level_id"
    career_path ||--|{ role : "source_role_id"
    career_path ||--|{ role : "target_role_id"
    feedback ||--|{ role : "associated_role_id"
    feedback ||--|{ competency : "competency_id"
    feedback ||--|{ user : "giver_id"
    feedback ||--|{ user : "receiver_id"
    feedback ||--|{ skill : "skill_id"
    learning_path ||--|{ role : "role_id"
    project_or_assignment ||--|{ role : "associated_role_id"
    project_or_assignment ||--|{ user : "manager_id"
    project_or_assignment ||--|{ organization : "organization_id"
    role_competencies }|--|| competency : "competency_id"
    role_competencies }|--|| role : "role_id"
    user_career_history ||--|{ role : "role_id"
    user_career_history ||--|{ user : "user_id"
    learning_path_resources }|--|| learning_path : "learning_path_id"
    learning_path_resources }|--|| learning_resource : "learning_resource_id"
"""
        print("\n--- Using User-Provided Mermaid Code ---")
        print(user_provided_mermaid_code)
        print("----------------------------------------\n")

        html_output = generate_html_content(schema_data, user_provided_mermaid_code)

        output_file = "ontology_schema_documentation.html"
        with open(output_file, "w") as f:
            f.write(html_output)
        print(f"Generated {output_file}")

        # Also generate the Mermaid .mmd file with the user-provided code
        mermaid_output_file = "Database Schema Details/skills_ontology_er_diagram.mmd"
        with open(mermaid_output_file, "w") as f:
            f.write(user_provided_mermaid_code)
        print(f"Generated {mermaid_output_file}")
