import os
from collections import defaultdict
from bs4 import BeautifulSoup

# --- Config ---
SEARCH_DIR = '.'  # Root directory of your project
DUMMY_FILE = 'dummy.html'

# --- Grouping Logic ---
GROUPS = {
    'admin': 'Admin',
    'career': 'Career & Jobs',
    'job': 'Career & Jobs',
    'internal': 'Career & Jobs',
    'assessment': 'Assessments & Goals',
    'goals': 'Assessments & Goals',
    'development': 'Assessments & Goals',
    'review': 'Assessments & Goals',
    'ats': 'ATS & Hiring Tools',
    'recruiter': 'ATS & Hiring Tools',
    'screen': 'ATS & Hiring Tools',
    'requisition': 'ATS & Hiring Tools',
    'scraper': 'ATS & Hiring Tools',
    'certification': 'Learning & Development',
    'learning': 'Learning & Development',
    'lms': 'Learning & Development',
    'create_with_ai': 'Learning & Development',
    'skill': 'Skills Intelligence',
    'skills': 'Skills Intelligence',
    'gap': 'Skills Intelligence',
    'resume': 'Skills Intelligence',
    'dashboard': 'Dashboards & Analytics',
    'analytics': 'Dashboards & Analytics',
    'intelligence': 'Dashboards & Analytics',
    'architecture': 'Architecture & Strategy',
    'timeline': 'Architecture & Strategy',
    'evolution': 'Architecture & Strategy',
    'profile': 'User Profiles & Graphs',
    'graph': 'User Profiles & Graphs',
    'history': 'User Profiles & Graphs',
    'pathfinder': 'Pathfinding & Succession',
    'succession': 'Pathfinding & Succession',
    'talent-profile': 'Talent Profiles',
    'aviation': 'Aviation Wizard',
    'feature_ai': 'AI Features & Recos',
    'recommendation': 'AI Features & Recos',
    'index': 'Main Pages',
    'dummy': 'Main Pages',
}

DEFAULT_GROUP = 'Other Pages'

def is_internal_html(href):
    return href.endswith('.html') and not href.startswith(('http://', 'https://', '//'))

def classify_group(href, text):
    combined = f"{href.lower()} {text.lower()}"
    for keyword, group in GROUPS.items():
        if keyword in combined:
            return group
    return DEFAULT_GROUP

def extract_links_from_file(filepath):
    links = []
    with open(filepath, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href'].strip()
            text = a_tag.get_text(strip=True) or href
            if is_internal_html(href):
                group = classify_group(href, text)
                links.append((group, href, text))
    return links

def collect_and_group_links(search_dir):
    grouped_links = defaultdict(set)
    for root, _, files in os.walk(search_dir):
        for filename in files:
            if filename.endswith('.html') and filename != DUMMY_FILE:
                full_path = os.path.join(root, filename)
                rel_path = os.path.relpath(full_path, search_dir).replace('\\', '/')
                # Add the file itself to the sitemap
                group = classify_group(rel_path, filename)
                grouped_links[group].add((rel_path, filename.replace('.html', '').replace('-', ' ').title()))
                # Also parse its <a> tags
                links = extract_links_from_file(full_path)
                for group, href, text in links:
                    grouped_links[group].add((href, text))
    return grouped_links

def generate_dummy_html(grouped_links, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('<!DOCTYPE html>\n<html>\n<head>\n  <title>Internal Sitemap</title>\n</head>\n<body>\n')
        f.write('<h1>Internal Sitemap</h1>\n')

        for group in sorted(grouped_links.keys()):
            f.write(f'  <h2>{group}</h2>\n  <ul>\n')
            for href, text in sorted(grouped_links[group]):
                f.write(f'    <li><a href="{href}">{text}</a></li>\n')
            f.write('  </ul>\n')

        f.write('</body>\n</html>')

def main():
    print("🔍 Scanning project for .html files and links...")
    grouped_links = collect_and_group_links(SEARCH_DIR)
    if not grouped_links:
        print("⚠️  No internal links found.")
        return
    generate_dummy_html(grouped_links, os.path.join(SEARCH_DIR, DUMMY_FILE))
    print(f"✅ dummy.html generated with {sum(len(v) for v in grouped_links.values())} links across {len(grouped_links)} sections.")

if __name__ == '__main__':
    main()