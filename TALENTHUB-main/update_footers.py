from bs4 import BeautifulSoup
import os

files = [
    "akara-careers.html",
    "akara-job-detail.html",
    "assessments_app.html",
    "ats_dashboard.html",
    "career_catalyst.html",
    "career-pathing.html",
    "certifications.html",
    "create_with_ai.html",
    "development-plans.html",
    "employee-skills-dashboard.html",
    "employee-skills-proficiency.html",
    "employer-skills-dashboard.html",
    "evolution.html",
    "feature_ai_summary.html",
    "goals.html",
    "index.html",
    "internal-opportunities.html",
    "job_scraper.html",
    "job-architecture.html",
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
    "talent-profile.html"
]

footer_html = '''
<style>
  .custom-footer {
    background-color: #002D62;
    color: white;
    text-align: center;
    padding: 10px 0;
    font-family: Arial, sans-serif;
    font-size: 18px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1000; /* Ensure footer is above other content */
  }
  body {
    padding-bottom: 60px; /* Adjust to accommodate footer height, approx. 18px font + 20px padding */
  }
</style>
<div class="custom-footer">
  Demo Experience by Raj Matukumalli – For Illustrative Purposes Only
</div>
'''

for filename in files:
    if not os.path.exists(filename):
        print(f"⚠️ File not found: {filename}")
        continue

    with open(filename, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "lxml")

    # Remove existing footers (generic and specific custom ones)
    for tag in soup.find_all("footer"): # Standard HTML5 footer
        tag.decompose()
    for tag in soup.find_all(attrs={"id": "footer"}): # Common ID for footers
        tag.decompose()
    # Common class names for footers, including our own "custom-footer"
    for class_name_to_remove in ["footer", "site-footer", "custom-footer"]:
        for tag in soup.find_all(class_=class_name_to_remove):
            tag.decompose()

    # Remove existing custom-footer styles from <head> to prevent duplication
    if soup.head:
        for style_tag in soup.head.find_all("style"):
            if style_tag.string and ".custom-footer" in style_tag.string:
                style_tag.decompose()

    # Append new footer components (style to head, div to body)
    body = soup.body
    head = soup.head

    if body and head:
        # Parse the footer_html once to get the style and div elements
        parsed_footer_template = BeautifulSoup(footer_html, "lxml")
        new_style_element = parsed_footer_template.find("style")
        new_div_element = parsed_footer_template.find("div", class_="custom-footer")

        if new_style_element:
            head.append(new_style_element) # Add style to head
        
        if new_div_element:
            body.append(new_div_element) # Add div to body

        with open(filename, "w", encoding="utf-8") as file:
            file.write(str(soup.prettify(formatter="html5")))
        print(f"✅ Updated: {filename}")
    elif body and not head:
        print(f"⚠️ No <head> tag in {filename}. Footer DIV added, but STYLE NOT ADDED.")
        parsed_footer_template = BeautifulSoup(footer_html, "lxml")
        new_div_element = parsed_footer_template.find("div", class_="custom-footer")
        if new_div_element:
            body.append(new_div_element)
            with open(filename, "w", encoding="utf-8") as file:
                file.write(str(soup.prettify(formatter="html5")))
            print(f"✅ Updated (DIV only): {filename}")
        else:
            print(f"❌ Failed to add DIV to {filename}")
    else: # No body, or neither body nor head
        print(f"❌ No <body> (or <head>) tag found in {filename}. Footer not added.")

print("\nScript finished. Please ensure you have 'beautifulsoup4' and 'lxml' installed.")
print("You can install them by running: pip install beautifulsoup4 lxml")
