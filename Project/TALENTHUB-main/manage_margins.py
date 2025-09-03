import os
from bs4 import BeautifulSoup

# --- List of all HTML files to be updated ---
# Add or remove files from this list as needed.
HTML_FILE_PATHS = [
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

# --- Configuration for the shared CSS file ---
SHARED_CSS_FOLDER = "css"
SHARED_CSS_FILENAME = "main-layout.css"
SHARED_CSS_FILE_PATH = os.path.join(SHARED_CSS_FOLDER, SHARED_CSS_FILENAME)

CSS_CONTENT = """
/*
 * ===============================================
 * Main Layout Styles for Consistent Margins
 * ===============================================
 * This file provides a shared layout for all pages.
 */

.container {
    max-width: 95%;
    margin-left: auto;
    margin-right: auto;
}

.main-content-container {
    margin-top: 2rem;
}
"""

def create_shared_css_file():
    """Creates the shared CSS file and its directory if they don't exist."""
    print(f"Checking for shared CSS file at '{SHARED_CSS_FILE_PATH}'...")
    os.makedirs(SHARED_CSS_FOLDER, exist_ok=True)
    with open(SHARED_CSS_FILE_PATH, "w") as f:
        f.write(CSS_CONTENT)
    print("✅ Shared CSS file created/updated successfully.")

def update_html_file(file_path):
    """Parses an HTML file and adds a link to the shared stylesheet."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")

        head = soup.find("head")
        if not head:
            print(f"⚠️  Warning: No <head> tag found in {file_path}. Skipping.")
            return

        # Calculate the correct relative path to the CSS file
        depth = file_path.count('/')
        relative_css_path = ('../' * depth) + SHARED_CSS_FILE_PATH

        # Check if a link to this specific file already exists
        link_exists = head.find("link", {"rel": "stylesheet", "href": relative_css_path})
        
        if link_exists:
            print(f"ℹ️  Link already exists in {file_path}. No changes needed.")
            return

        # Add the new link tag to the end of the head
        new_link_tag = soup.new_tag("link", rel="stylesheet", href=relative_css_path)
        head.append(new_link_tag)
        
        # Write the modified HTML back to the file
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(str(soup.prettify()))
        print(f"✅ Successfully updated {file_path}")

    except FileNotFoundError:
        print(f"❌ Error: File not found at '{file_path}'. Skipping.")
    except Exception as e:
        print(f"❌ An error occurred with {file_path}: {e}")


if __name__ == "__main__":
    print("--- Starting Style and Margin Update Process ---")
    create_shared_css_file()
    print("\n--- Processing HTML Files ---")
    for html_file in HTML_FILE_PATHS:
        update_html_file(html_file)
    print("\n--- Update process complete. ---")
    print("\nIMPORTANT: For the styles to apply, ensure the main content wrapper in each HTML file has the class='container'.")