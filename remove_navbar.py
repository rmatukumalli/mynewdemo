import os
from bs4 import BeautifulSoup

# --- CONFIGURATION ---
PROJECT_DIRECTORY = '.'
STYLESHEET_PATH = 'css/styles.css'
NAVBAR_PARTIAL_PATH = '_shared_navbar.html' # Still needed to know what to remove

# Define the specific list of HTML files to process (same as add_navbar.py)
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

def undo_navbar_injection():
    """
    Scans specified HTML files and removes the previously injected navbar
    CSS link, navbar HTML content, and the global stylesheet link (if added by the script).
    """
    print("--- Starting Undo Navbar Injection Script ---")

    # --- 1. Load details from the Shared Navbar File (to know what to remove) ---
    try:
        with open(NAVBAR_PARTIAL_PATH, 'r', encoding='utf-8') as f:
            navbar_full_content = f.read()
        
        navbar_soup = BeautifulSoup(navbar_full_content, 'html.parser')
        
        # Get the attributes of the navbar CSS link and nav tag to identify them for removal
        navbar_css_link_attrs = {}
        found_navbar_css_link = False
        if navbar_soup.find('link', href='css/navbar.css'):
            found_navbar_css_link = True
            navbar_css_link_attrs = {'href': 'css/navbar.css', 'rel': 'stylesheet'} # More specific

        found_navbar_body = False
        if navbar_soup.find('nav', class_='navbar'):
            found_navbar_body = True
            navbar_body_tag_name = 'nav'
            navbar_body_tag_class = 'navbar'

        if not found_navbar_css_link and not found_navbar_body:
            print("--> WARNING: Could not identify navbar CSS link or <nav> tag in _shared_navbar.html. Cannot undo properly.")
            # Continue anyway, but warn that specific undo might fail if identification is off.

        print(f"Loaded identification patterns from: {NAVBAR_PARTIAL_PATH}")

    except FileNotFoundError:
        print(f"--> ERROR: Shared navbar file not found at '{NAVBAR_PARTIAL_PATH}'. Cannot undo without it. Aborting.")
        return
    except Exception as e:
        print(f"--> ERROR: An error occurred while parsing _shared_navbar.html: {e}. Aborting.")
        return

    print(f"Reverting changes in specific HTML files defined in TARGET_HTML_FILES...\n")

    # Iterate through the specifically targeted HTML files
    for filename in TARGET_HTML_FILES:
        file_path = os.path.join(PROJECT_DIRECTORY, filename)
        
        if not os.path.exists(file_path):
            print(f"  -> WARNING: File not found at '{file_path}'. Skipping.")
            continue

        print(f"Processing: {file_path}...")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            made_changes = False
            soup = BeautifulSoup(content, 'html.parser')
            head = soup.find('head')
            body = soup.find('body')

            if not head:
                print(f"  -> WARNING: No <head> tag found in {filename}. Cannot remove CSS links.")
            if not body:
                print(f"  -> WARNING: No <body> tag found in {filename}. Cannot remove navbar HTML.")

            # --- Remove Navbar CSS from <head> ---
            if head and found_navbar_css_link:
                navbar_link_to_remove = head.find('link', navbar_css_link_attrs)
                if navbar_link_to_remove:
                    navbar_link_to_remove.extract() # Remove the tag
                    print("  -> Removed navbar CSS link from <head>.")
                    made_changes = True
                else:
                    print("  -> Navbar CSS link not found in <head>.")

            # --- Remove Navbar Body from <body> ---
            if body and found_navbar_body:
                navbar_to_remove = body.find(navbar_body_tag_name, class_=navbar_body_tag_class)
                if navbar_to_remove:
                    navbar_to_remove.extract() # Remove the tag
                    print("  -> Removed navbar HTML from <body>.")
                    made_changes = True
                else:
                    print("  -> Navbar HTML not found in <body>.")

            # --- Remove Global Stylesheet Link ---
            # IMPORTANT: This assumes 'css/styles.css' was only added by the script.
            # If it was originally present, this will remove it.
            if head:
                global_stylesheet_link_to_remove = head.find('link', href=STYLESHEET_PATH)
                if global_stylesheet_link_to_remove:
                    # Check if the content *before* this script run contained the global stylesheet.
                    # This is tricky as we don't have the original content.
                    # A simpler approach: if it's there and was likely added, remove it.
                    # For robustness, we could store original states, but that complicates the script.
                    # For now, we assume if the script added it, it's removable.
                    global_stylesheet_link_to_remove.extract()
                    print(f"  -> Removed global '{STYLESHEET_PATH}' link from <head>.")
                    made_changes = True
                else:
                    print(f"  -> Global '{STYLESHEET_PATH}' link not found in <head>.")


            # Only write back if actual changes were made to the soup object
            if made_changes:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(str(soup.prettify()))
                print(f"  -> SUCCESS: Saved changes to {filename}")
            else:
                print(f"  -> No changes needed for {filename}")

        except Exception as e:
            print(f"  -> ERROR: Could not process {filename}. Reason: {e}")

    print("\n--- Script Finished ---")

if __name__ == '__main__':
    undo_navbar_injection()
