from bs4 import BeautifulSoup
import os

# List of HTML files to update
files = [
    "akara-careers.html", "akara-job-detail.html", "assessments_app.html", "ats_dashboard.html",
    "career_catalyst.html", "career-pathing.html", "certifications.html", "create_with_ai.html",
    "development-plans.html", "employee-skills-dashboard.html", "employee-skills-proficiency.html",
    "employer-skills-dashboard.html", "evolution.html", "feature_ai_summary.html", "goals.html",
    "index.html", "internal-opportunities.html", "job_scraper.html", "job-architecture.html",
    "learning-platform.html", "lms-ats-integration.html", "pathfinder.html", "performance-reviews.html",
    "proctored_assessment.html", "profile.html", "project_timeline.html", "requisitions.html",
    "resume-skills.html", "role-architecture.html", "screen-candidates.html", "skill_identifier.html",
    "skill-gap-analysis.html", "skill-history.html", "skills-graph-details.html", "skills-hiring.html",
    "skills-intelligence.html", "skills-overview.html", "skills-passport.html", "skills-planning.html",
    "skills.html", "succession-planning.html", "talent-intelligence.html", "talent-profile.html"
]

# Home button HTML + CSS
home_button_html = '''
<style>
  .top-nav {
    position: fixed;
    top: 0;
    right: 0;
    height: 50px;
    background-color: transparent;
    padding: 10px 20px;
    z-index: 1000;
  }

  .home-button {
    color: white;
    background-color: #002D62;
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    transition: background-color 0.3s;
  }

  .home-button:hover {
    background-color: #004080;
  }

  body {
    padding-top: 60px;
    margin: 0;
  }
</style>
<div class="top-nav">
  <a href="index.html" class="home-button">Home</a>
</div>
'''

for filename in files:
    if not os.path.exists(filename):
        print(f"⚠️ File not found: {filename}")
        continue

    with open(filename, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "lxml")

    body = soup.body
    if not body:
        print(f"❌ No <body> tag found in {filename}")
        continue

    # Check if home button already exists (avoid duplication)
    if soup.find("a", class_="home-button"):
        print(f"🔁 Skipped (already has home button): {filename}")
        continue

    # Append new home button section
    nav_soup = BeautifulSoup(home_button_html, "lxml")
    body.insert(0, nav_soup)  # Insert at the top of body

    with open(filename, "w", encoding="utf-8") as file:
        file.write(str(soup.prettify()))

    print(f"✅ Updated: {filename}")
