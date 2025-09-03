import os
from bs4 import BeautifulSoup

# --- CONFIGURATION ---
# The directory where your website files are located. '.' means the current directory.
PROJECT_DIRECTORY = '.' 
# The exact path to the global stylesheet as it should appear in the HTML link tag.
# Adjust this path based on your folder structure.
# For example, if styles.css is inside a 'css' folder, use 'css/styles.css'.
STYLESHEET_PATH = 'css/styles.css' 
# --- END CONFIGURATION ---

def process_html_files():
    """
    Scans for HTML files and updates them to include the global stylesheet
    and wrap the navbar in a main container.
    """
    print("--- Starting Website Update Script ---")
    print(f"Searching for HTML files in: {os.path.abspath(PROJECT_DIRECTORY)}")
    print(f"Will link to stylesheet: {STYLESHEET_PATH}")
    print("\nIMPORTANT: Please ensure you have a backup of your files before proceeding.\n")

    # Walk through all directories and files in the project folder
    for root, dirs, files in os.walk(PROJECT_DIRECTORY):
        # Exclude common non-project folders to speed things up
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for filename in files:
            if filename.endswith('.html'):
                file_path = os.path.join(root, filename)
                print(f"Processing: {file_path}...")
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    soup = BeautifulSoup(content, 'html.parser')
                    head = soup.head
                    body = soup.body
                    made_changes = False

                    if not head:
                        print(f"  -> SKIPPED: No <head> tag found.")
                        continue
                        
                    # --- 1. Add Stylesheet Link ---
                    link_exists = head.find('link', {'href': STYLESHEET_PATH})
                    if not link_exists:
                        new_link_tag = soup.new_tag('link', rel='stylesheet', href=STYLESHEET_PATH)
                        head.append(new_link_tag) # Appends the link to the end of the head
                        print("  -> Added stylesheet link.")
                        made_changes = True
                    else:
                        print("  -> Stylesheet link already exists.")

                    # --- 2. Wrap Navbar ---
                    navbar = body.find('nav', class_='navbar')
                    if navbar:
                        # Check if the navbar's parent is already the main container
                        if not (navbar.parent.name == 'div' and 'main-container' in navbar.parent.get('class', [])):
                            main_container = soup.new_tag('div', **{'class': 'main-container'})
                            navbar.wrap(main_container)
                            print("  -> Wrapped navbar in .main-container.")
                            made_changes = True
                        else:
                            print("  -> Navbar is already wrapped.")
                    else:
                        print("  -> No <nav class=\"navbar\"> found to wrap.")

                    # --- 3. Save Changes ---
                    if made_changes:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(str(soup.prettify()))
                        print(f"  -> SUCCESS: Saved changes to {filename}")

                except Exception as e:
                    print(f"  -> ERROR: Could not process {filename}. Reason: {e}")

    print("\n--- Script Finished ---")


if __name__ == '__main__':
    # This ensures the script runs when you execute it directly
    process_html_files()