import os
from bs4 import BeautifulSoup
import re # Import the regular expressions library

# --- CONFIGURATION ---
FILES_TO_INSPECT = [
    "akara-careers.html", "akara-job-detail.html", "ats_dashboard.html",
    "career_catalyst.html", "career-pathing.html", "certifications.html",
    "create_with_ai.html", "development-plans.html", "employee-skills-dashboard.html",
    "employer-skills-dashboard.html", "evolution.html", "feature_ai_summary.html",
    "goals.html", "index.html", "internal-opportunities.html", "job_scraper.html",
    "learning-platform.html", "lms-ats-integration.html", "pathfinder.html",
    "performance-reviews.html", "proctored_assessment.html", "profile.html",
    "project_timeline.html", "requisitions.html", "resume-skills.html",
    "role-architecture.html", "screen-candidates.html", "skill_identifier.html",
    "skill-gap-analysis.html", "skill-history.html", "skills-graph-details.html",
    "skills-hiring.html", "skills-intelligence.html", "skills-overview.html",
    "skills-passport.html", "skills-planning.html", "skills.html",
    "succession-planning.html", "talent-intelligence.html", "talent-profile.html",
    "evolution/architecture_image_view.html", "evolution/current_capability.html",
    "evolution/future_roadmap.html", "evolution/talent_intelligence_architecture.html",
    "html/modules/employee-skill-graph.html", "html/modules/skills-interaction-graph.html",
    "personalized-learning-path/index.html", "recommendations/recommendations.html"
]

NAVBAR_CSS_PLACEHOLDER = ''
NAVBAR_BODY_PLACEHOLDER = ''
# --- END CONFIGURATION ---

def refactor_all_navbar_types():
    """
    A one-time script to find and replace ALL legacy navbar methods
    (hard-coded and JS-injected) with the new placeholder system.
    This version uses a more flexible method to find the JS loader script.
    """
    print("--- Starting Unified Navbar Refactoring Script (v4 - Final) ---")
    print("!!! DANGER: This script will modify files in place. !!!")
    print("!!! Please ensure you have a backup before proceeding. !!!\n")

    success_count = 0
    fail_count = 0

    for file_path in FILES_TO_INSPECT:
        print(f"--- Processing: {file_path}")

        if not os.path.exists(file_path):
            print(f"  -> ERROR: File not found at '{file_path}'. Skipping.")
            fail_count += 1
            continue

        try:
            content = ''
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            soup = BeautifulSoup(content, 'html.parser')
            made_changes = False

            head_tag = soup.head
            if not head_tag:
                print("  -> ERROR: No <head> tag found. Skipping.")
                fail_count += 1
                continue

            # --- DETECTION AND REPLACEMENT LOGIC ---

            # Case 1: Detect hard-coded navbar
            navbar_to_replace = soup.find('nav', class_='navbar')
            if navbar_to_replace:
                print("  -> Found a hard-coded <nav class='navbar'>.")
                body_placeholder_soup = BeautifulSoup(NAVBAR_BODY_PLACEHOLDER, 'html.parser')
                navbar_to_replace.replace_with(body_placeholder_soup)
                print("     - Replaced <nav> with body placeholder.")
                made_changes = True

            # Case 2: Detect JS-injected navbar (more robustly)
            js_placeholder_div = soup.find('div', id='navbar-placeholder')
            # NEW: Use a function with a regular expression to find the script tag
            # This works even if the tag is malformed (e.g., missing a closing tag)
            js_loader_script = soup.find('script', src=re.compile(r'global-nav-loader\.js'))

            if js_placeholder_div and js_loader_script:
                print("  -> Found a JS-injected navbar.")
                body_placeholder_soup = BeautifulSoup(NAVBAR_BODY_PLACEHOLDER, 'html.parser')
                js_placeholder_div.replace_with(body_placeholder_soup)
                print("     - Replaced <div id='navbar-placeholder'> with body placeholder.")
                js_loader_script.decompose()
                print("     - Removed 'global-nav-loader.js' script tag.")
                made_changes = True

            # If any changes were made above, ensure the CSS placeholder is in the head
            if made_changes:
                if NAVBAR_CSS_PLACEHOLDER not in str(head_tag):
                    css_placeholder_soup = BeautifulSoup(NAVBAR_CSS_PLACEHOLDER, 'html.parser')
                    head_tag.append(css_placeholder_soup)
                    print("     - Added CSS placeholder to <head>.")
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(str(soup.prettify()))
                print("  -> SUCCESS: File has been updated.")
                success_count += 1
            else:
                print("  -> INFO: No legacy navbar found. Assuming already refactored.")
                success_count += 1

        except Exception as e:
            print(f"  -> FATAL ERROR: An unexpected error occurred: {e}")
            fail_count += 1

    print("\n--- Refactoring Complete ---")
    print(f"Successfully processed: {success_count} files.")
    print(f"Failed or skipped: {fail_count} files.")


if __name__ == '__main__':
    refactor_all_navbar_types()