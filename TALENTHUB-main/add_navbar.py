import os
from bs4 import BeautifulSoup

# --- CONFIGURATION ---
PROJECT_DIRECTORY = '.'
STYLESHEET_PATH = 'css/styles.css'
NAVBAR_PARTIAL_PATH = '_shared_navbar.html'
# Placeholders are no longer strictly required for injection, but kept for clarity
# if a user wishes to use them for specific placement. The script will now directly
# insert if not found.
NAVBAR_CSS_PLACEHOLDER = '<!-- NAVBAR_CSS_PLACEHOLDER -->'
NAVBAR_BODY_PLACEHOLDER = '<!-- NAVBAR_BODY_PLACEHOLDER -->'

# Define the specific list of HTML files to process
TARGET_HTML_FILES = [
    "akara-careers.html",
    "akara-job-detail.html",
    "ats_dashboard.html",
    "career_catalyst.html",
    "career-pathing.html",
    "certifications.html",
    "create_with_ai.html",
    "development-plans.html",
    "employee-skills-dashboard.html",
    "employer-skills-dashboard.html",
    "evolution.html",
    "feature_ai_summary.html",
    "goals.html",
    "index.html",
    "internal-opportunities.html",
    "job_scraper.html",
    "learning-platform.html",
    "lms-ats-integration.html",
    "pathfinder.html",
    "performance-reviews.html",
    "proctored_assessment.html",
    "profile.html",
    "project_timeline.html",
    "requisitions.html",
    "resume-skills.html",
    "role-architecture.html",
    "screen-candidates.html",
    "skill_identifier.html",
    "skill-gap-analysis.html",
    "skill-history.html",
    "skills-graph-details.html",
    "skills-hiring.html",
    "skills-intelligence.html",
    "skills-overview.html",
    "skills-passport.html",
    "skills-planning.html",
    "skills.html",
    "succession-planning.html",
    "talent-intelligence.html",
    "talent-profile.html",
    "evolution/architecture_image_view.html",
    "evolution/current_capability.html",
    "evolution/future_roadmap.html",
    "evolution/talent_intelligence_architecture.html",
    "html/modules/employee-skill-graph.html",
    "html/modules/skills-interaction-graph.html",
    "personalized-learning-path/index.html",
    "recommendations/recommendations.html"
]
# --- END CONFIGURATION ---

def process_html_files():
    """
    Scans specified HTML files, intelligently splits the shared navbar file, injects
    the CSS into the <head> and the NAV into the <body>. It also ensures
    the main stylesheet link is present. This version will directly insert
    if placeholders are not found.
    """
    print("--- Starting Advanced Website Update Script ---")

    # --- 1. Load and Split the Shared Navbar File ---
    try:
        with open(NAVBAR_PARTIAL_PATH, 'r', encoding='utf-8') as f:
            navbar_full_content = f.read()
        
        # Use BeautifulSoup to parse the partial file itself
        navbar_soup = BeautifulSoup(navbar_full_content, 'html.parser')
        
        # Extract the CSS link and the Nav element
        # We assume the navbar CSS link is the first <link> in the partial
        navbar_css_tag = navbar_soup.find('link', href='css/navbar.css') # Explicitly look for navbar.css
        navbar_body_tag = navbar_soup.find('nav')

        if not navbar_css_tag or not navbar_body_tag:
            print("--> ERROR: Could not find both a <link href='css/navbar.css'> and a <nav> tag in _shared_navbar.html. Aborting.")
            return

        # Convert the extracted tags back to strings
        navbar_css_str = str(navbar_css_tag)
        navbar_body_str = str(navbar_body_tag)

        print(f"Successfully loaded and split shared navbar from: {NAVBAR_PARTIAL_PATH}")

    except FileNotFoundError:
        print(f"--> ERROR: Shared navbar file not found at '{NAVBAR_PARTIAL_PATH}'. Aborting.")
        return
    except Exception as e:
        print(f"--> ERROR: An error occurred while parsing _shared_navbar.html: {e}. Aborting.")
        return

    print(f"Processing specific HTML files defined in TARGET_HTML_FILES...\n")

    # Iterate through the specifically targeted HTML files
    for filename in TARGET_HTML_FILES:
        # Construct the full path to the file
        file_path = os.path.join(PROJECT_DIRECTORY, filename)
        
        # Check if the file actually exists before trying to process it
        if not os.path.exists(file_path):
            print(f"  -> WARNING: File not found at '{file_path}'. Skipping.")
            continue

        print(f"Processing: {file_path}...")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            made_changes = False

            # Parse the current HTML content for manipulation
            soup = BeautifulSoup(content, 'html.parser')
            head = soup.find('head')
            body = soup.find('body')

            if not head:
                print(f"  -> WARNING: No <head> tag found in {filename}. Cannot add CSS links.")
            if not body:
                print(f"  -> WARNING: No <body> tag found in {filename}. Cannot add navbar HTML.")

            # --- Inject Navbar CSS into <head> ---
            # Try to replace placeholder first
            if NAVBAR_CSS_PLACEHOLDER in content and head:
                content = content.replace(NAVBAR_CSS_PLACEHOLDER, navbar_css_str)
                print("  -> Injected navbar CSS via placeholder.")
                made_changes = True
                # Re-parse content as it's now a string
                soup = BeautifulSoup(content, 'html.parser')
                head = soup.find('head') # Re-find head after content replacement
            elif head and not head.find('link', href='css/navbar.css'):
                # If no placeholder or placeholder not used, directly append if not already linked
                new_link_tag = soup.new_tag('link', rel='stylesheet', href='css/navbar.css')
                head.append(new_link_tag)
                print("  -> Injected navbar CSS directly into <head>.")
                made_changes = True
            else:
                print("  -> Navbar CSS link already present or no <head> tag.")

            # --- Inject Navbar Body into <body> ---
            # Try to replace placeholder first
            if NAVBAR_BODY_PLACEHOLDER in content and body:
                content = content.replace(NAVBAR_BODY_PLACEHOLDER, navbar_body_str)
                print("  -> Injected navbar HTML via placeholder.")
                made_changes = True
                # Re-parse content as it's now a string
                soup = BeautifulSoup(content, 'html.parser')
                body = soup.find('body') # Re-find body after content replacement
            elif body and not body.find('nav', class_='navbar'): # Check if a nav with class 'navbar' exists
                # If no placeholder or placeholder not used, directly prepend if not already present
                # Prepending ensures it's at the top of the body
                body.insert(0, BeautifulSoup(navbar_body_str, 'html.parser'))
                print("  -> Injected navbar HTML directly into <body>.")
                made_changes = True
            else:
                print("  -> Navbar HTML already present or no <body> tag.")

            # --- Final Save and Global Stylesheet Check ---
            # Check if the main stylesheet link is missing
            if head and not head.find('link', {'href': STYLESHEET_PATH}):
                new_link_tag = soup.new_tag('link', rel='stylesheet', href=STYYLESHEET_PATH)
                head.append(new_link_tag)
                print(f"  -> Added global '{STYLESHEET_PATH}' link.")
                made_changes = True
            else:
                print(f"  -> Global '{STYLESHEET_PATH}' link already present or no <head> tag.")

            # Only write back if actual changes were made to the soup object
            if made_changes:
                # Prettify the HTML before writing to ensure consistent formatting
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(str(soup.prettify()))
                print(f"  -> SUCCESS: Saved changes to {filename}")
            else:
                print(f"  -> No changes needed for {filename}")

        except Exception as e:
            print(f"  -> ERROR: Could not process {filename}. Reason: {e}")

    print("\n--- Script Finished ---")

if __name__ == '__main__':
    # This block ensures that process_html_files() is called only when
    # the script is executed directly, not when imported as a module.
    process_html_files()
