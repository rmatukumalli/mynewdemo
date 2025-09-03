import os
from bs4 import BeautifulSoup

def update_sidebar_navigation(file_path="index.html"):
    """
    Updates the sidebar navigation in the given HTML file.
    Splits content into "Ready" (Job Architecture) and "Work In Progress" (all others).
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')

        # Find the main content area where tab panels are located
        main_content_div = soup.find('main', class_='flex-1')
        if not main_content_div:
            print("Error: Main content area not found.")
            return

        # Find the existing tab panels container
        tab_panels_container = main_content_div.find('div', class_='flex-grow')
        if not tab_panels_container:
            print("Error: Tab panels container not found.")
            return

        # Extract Job Architecture content
        job_architecture_card = None
        talent_marketplace_panel = soup.find('div', id='tab-talent-marketplace')
        if talent_marketplace_panel:
            # Find the specific card for "Job Architecture"
            for card in talent_marketplace_panel.find_all('div', class_='content-card'):
                h3 = card.find('h3', class_='font-semibold')
                if h3 and "Job Architecture" in h3.get_text():
                    job_architecture_card = card
                    break
        
        if not job_architecture_card:
            print("Error: 'Job Architecture' content card not found.")
            return

        # Create new 'Ready' tab panel
        new_tab_ready_panel = soup.new_tag('div', id='tab-ready')
        new_tab_ready_panel['class'] = ['tab-panel', 'active'] # Set as active initially
        new_tab_ready_panel['role'] = 'tabpanel'
        
        # Create a grid for the 'Ready' section
        ready_grid = soup.new_tag('div')
        ready_grid['class'] = ['grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6']
        ready_grid.append(job_architecture_card.extract()) # Move Job Architecture card

        new_tab_ready_panel.append(ready_grid)

        # Create new 'Work In Progress' tab panel
        new_tab_wip_panel = soup.new_tag('div', id='tab-work-in-progress')
        new_tab_wip_panel['class'] = ['tab-panel', 'hidden'] # Set as hidden initially
        new_tab_wip_panel['role'] = 'tabpanel'

        # Create a grid for the 'Work In Progress' section
        wip_grid = soup.new_tag('div')
        wip_grid['class'] = ['grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6']
        
        # Collect all other content cards/panels
        all_other_content = []

        # Add remaining cards from tab-talent-marketplace
        if talent_marketplace_panel:
            for card in talent_marketplace_panel.find_all('div', class_='content-card'):
                all_other_content.append(card.extract()) # Extract remaining cards

        # Add content from other existing tab panels
        other_panels_ids = ['tab-careers', 'tab-acquisition', 'tab-performance', 'tab-dashboards', 'tab-admin']
        for panel_id in other_panels_ids:
            panel = soup.find('div', id=panel_id)
            if panel:
                # Extract all children of the panel (e.g., the div with h2, p, ul)
                for child in list(panel.children): # Use list() to iterate over a copy
                    if child.name: # Only process tags
                        all_other_content.append(child.extract())

        for content_block in all_other_content:
            wip_grid.append(content_block)

        new_tab_wip_panel.append(wip_grid)

        # Remove all old tab panels from the container
        for panel in tab_panels_container.find_all('div', class_='tab-panel'):
            panel.decompose()

        # Append the new tab panels
        tab_panels_container.append(new_tab_ready_panel)
        tab_panels_container.append(new_tab_wip_panel)

        # Update the sidebar navigation buttons to reflect the new structure
        # Ensure the "Ready" button is active and "Work In Progress" is not
        ready_button = soup.find('button', string='Ready')
        if ready_button:
            ready_button['class'].append('active')
            ready_button['aria-selected'] = 'true'
            ready_button['data-tab-target'] = '#tab-ready'

        wip_button = soup.find('button', string='Work In Progress')
        if wip_button:
            wip_button['class'].remove('active')
            wip_button['aria-selected'] = 'false'
            wip_button['data-tab-target'] = '#tab-work-in-progress'

        # Write the modified HTML back to the file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        
        print(f"Successfully updated sidebar navigation in {file_path}")

    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    update_sidebar_navigation()
