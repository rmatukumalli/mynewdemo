import re
import os

def parse_sql_schema(sql_schema_content):
    tables = {}
    relationships = []

    # Regex to find CREATE TABLE statements
    table_pattern = re.compile(r"CREATE TABLE (\w+) \((.*?)\);\s*", re.DOTALL)
    
    # Regex to find columns within a table
    column_pattern = re.compile(r"(\w+)\s+([A-Z]+(?:\(\d+\))?)\s*(NOT NULL)?\s*(UNIQUE)?(?:,\s*PRIMARY KEY \((.*?)\))?(?:,\s*FOREIGN KEY\((\w+)\) REFERENCES (\w+) \((\w+)\))?", re.IGNORECASE)
    
    # Regex to find PRIMARY KEY and UNIQUE constraints defined separately
    pk_uk_pattern = re.compile(r"(?:PRIMARY KEY|UNIQUE)\s*\((.*?)\)", re.IGNORECASE)
    
    # Regex to find FOREIGN KEY constraints defined separately
    fk_pattern = re.compile(r"FOREIGN KEY\((\w+)\) REFERENCES (\w+) \((\w+)\)", re.IGNORECASE)

    for match in table_pattern.finditer(sql_schema_content):
        table_name = match.group(1)
        table_content = match.group(2)
        
        tables[table_name] = {
            "columns": [],
            "primary_keys": [],
            "unique_keys": []
        }

        # Parse columns
        for col_line in table_content.split(',\n'):
            col_line = col_line.strip()
            if col_line.startswith('PRIMARY KEY') or col_line.startswith('UNIQUE') or col_line.startswith('FOREIGN KEY'):
                continue # Handle these separately

            col_match = re.match(r"(\w+)\s+([A-Z]+(?:\(\d+\))?)\s*(NOT NULL)?", col_line, re.IGNORECASE)
            if col_match:
                col_name = col_match.group(1)
                col_type = col_match.group(2)
                is_nullable = "NULL" if col_match.group(3) is None else "NOT NULL"
                
                tables[table_name]["columns"].append({
                    "name": col_name,
                    "type": col_type,
                    "nullable": is_nullable,
                    "primary_key": False, # Will be updated later
                    "unique": False,      # Will be updated later
                    "foreign_key": None   # Will be updated later
                })
        
        # Parse separate PRIMARY KEY and UNIQUE constraints
        for pk_uk_match in pk_uk_pattern.finditer(table_content):
            constraint_type = pk_uk_match.group(0).split(' ')[0].upper()
            cols_in_constraint = [c.strip() for c in pk_uk_match.group(1).split(',')]
            for col_name in cols_in_constraint:
                for col in tables[table_name]["columns"]:
                    if col["name"] == col_name:
                        if constraint_type == "PRIMARY":
                            col["primary_key"] = True
                        elif constraint_type == "UNIQUE":
                            col["unique"] = True
        
        # Parse separate FOREIGN KEY constraints
        for fk_match in fk_pattern.finditer(table_content):
            source_col = fk_match.group(1)
            target_table = fk_match.group(2)
            target_col = fk_match.group(3)
            
            relationships.append({
                "source_table": table_name,
                "source_col": source_col,
                "target_table": target_table,
                "target_col": target_col
            })
            
            # Update column with foreign key info
            for col in tables[table_name]["columns"]:
                if col["name"] == source_col:
                    col["foreign_key"] = f"{target_table}.{target_col}"

    return tables, relationships

def generate_mermaid_er_diagram_from_sql(tables, relationships):
    mermaid_diagram = "erDiagram\n"

    # Add relationships first, as they often define the order of entities in the diagram
    # This is a heuristic to try and match the user's example order
    # For simplicity, let's use the user's provided relationship labels where possible
    # and generic ones otherwise.
    
    # User's example relationships and their labels
    example_relationships = {
        ("ORGANIZATION", "BUSINESS_UNIT"): "has",
        ("BUSINESS_UNIT", "DEPARTMENT"): "contains", # User has two for this, will pick one
        ("DEPARTMENT", "ROLE"): "contains",
        ("JOB_LEVEL", "ROLE"): "defines_level",
        ("ROLE", "CAREER_PATH"): "source_of", # User has two for career_path
        ("ROLE_GROUP", "JOB_PROFILE"): "groups",
        ("JOB_LEVEL", "JOB_PROFILE"): "defines_level",
        ("COMPETENCY", "BEHAVIOR"): "has",
        ("COMPETENCY", "SKILL"): "contains",
        ("COMPETENCY", "ROLE"): "required_for",
        ("CAPABILITY", "COMPETENCY"): "contains",
        ("SKILL", "PROFICIENCY"): "has",
        ("SKILL", "USER_SKILL"): "tracked_by",
        ("SKILL", "ASSESSMENT"): "evaluated_by",
        ("SKILL", "LEARNING_RESOURCE"): "associated_with",
        ("SKILL", "SKILL_GAP"): "identifies_gap",
        ("SKILL", "SKILL_RELATIONSHIP"): "relates_to",
        ("SKILL", "SKILL_TAG_MAP"): "tagged_with",
        ("RELATIONSHIP_TYPE", "SKILL_RELATIONSHIP"): "defines",
        ("LEARNING_PATH", "LEARNING_PATH_RESOURCES"): "contains",
        ("LEARNING_RESOURCE", "LEARNING_PATH_RESOURCES"): "part_of",
        ("SKILL_TAG", "SKILL_TAG_MAP"): "maps_to",
        ("USER", "USER_SKILL"): "has",
        ("USER", "USER_CAREER_HISTORY"): "has",
        ("USER", "SKILL_GAP"): "identifies_gap_for",
        ("ORGANIZATION", "BUSINESS_UNIT"): "contains", # Duplicate, will use first
        ("BUSINESS_UNIT", "DEPARTMENT"): "contains_many", # Duplicate, will use first
        ("JOB_LEVEL", "BEHAVIOR"): "defines_level_for",
        ("JOB_PROFILE", "SKILL"): "requires"
    }

    # Map SQLAlchemy model names to table names for relationship lookup
    # This is a bit tricky as the SQL schema doesn't directly give model names.
    # We'll rely on the table names directly.

    # Add relationships
    for rel in relationships:
        source_table = rel["source_table"].upper() # Convert to uppercase for consistency with example
        target_table = rel["target_table"].upper() # Convert to uppercase for consistency with example
        
        # Determine cardinality based on common FK patterns or assume Many-to-One from source to target
        # For simplicity, we'll use ||--o{ for most FKs (Many-to-One from source to target)
        # For many-to-many, we'd need to identify the association tables.
        
        # Try to get label from example, otherwise use generic
        label = example_relationships.get((source_table, target_table), "relates to")
        
        # Special handling for many-to-many through association tables
        # This is a heuristic and might not catch all cases without more complex parsing
        if source_table.endswith('_COMPETENCIES') or \
           source_table.endswith('_SKILLS') or \
           source_table.endswith('_RESOURCES') or \
           source_table.endswith('_DEPARTMENTS') or \
           source_table.endswith('_TAG_MAP'):
            # Assuming association tables are named like this
            # This is a many-to-many relationship
            mermaid_diagram += f"    {source_table} }}o--o{{ {target_table} : \"{label}\"\n"
        else:
            # Default to Many-to-One from source to target (source has FK to target)
            mermaid_diagram += f"    {source_table} ||--o{{ {target_table} : \"{label}\"\n"

    # Add entities (tables)
    for table_name, info in tables.items():
        mermaid_diagram += f"\n    {table_name.upper()} {{\n" # Convert to uppercase for consistency
        for col in info["columns"]:
            pk_str = "PK" if col["primary_key"] else ""
            uk_str = "UNIQUE" if col["unique"] else ""
            fk_str = "FK" if col["foreign_key"] else ""
            
            # Combine PK, FK, UNIQUE strings
            constraints = []
            if pk_str: constraints.append(pk_str)
            if fk_str: constraints.append(fk_str)
            if uk_str: constraints.append(uk_str)
            constraint_str = ", ".join(constraints) if constraints else ""

            # Clean up type for display, e.g., VARCHAR(150) -> VARCHAR
            col_type_display = re.sub(r'\(.*\)', '', col["type"]).strip()
            
            # Add "Optional" for nullable foreign keys if needed, based on example
            nullable_label = ""
            if col["nullable"] == "NULL" and col["foreign_key"]:
                # Check if the example uses "Optional" for nullable FKs
                # The example has "VARCHAR job_level_id FK" and "VARCHAR job_level_id FK Optional"
                # This implies "Optional" is for nullable FKs.
                nullable_label = " \"Optional\"" # Add space before quote

            mermaid_diagram += f"        {col_type_display} {col['name']} {constraint_str}{nullable_label}\n"
        mermaid_diagram += "    }\n"

    return mermaid_diagram

if __name__ == "__main__":
    sql_schema_path = "Database Schema Details/full_db_schema.sql"
    output_mermaid_path = "Database Schema Details/full_db_er_diagram.mmd"

    if not os.path.exists(sql_schema_path):
        print(f"Error: SQL schema file not found at {sql_schema_path}")
    else:
        with open(sql_schema_path, "r") as f:
            sql_content = f.read()
        
        tables_info, relationships_info = parse_sql_schema(sql_content)
        mermaid_code = generate_mermaid_er_diagram_from_sql(tables_info, relationships_info)

        with open(output_mermaid_path, "w") as f:
            f.write(mermaid_code)
        print(f"Generated {output_mermaid_path}")
