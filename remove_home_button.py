import os

def remove_home_button_from_html(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Define the exact block to remove, being mindful of whitespace and newlines
        block_to_remove = """<div class="home-button-container">
   <a aria-label="Go to Home Page" class="home-button" href="index.html">
    <i class="fas fa-home">
    </i>
    Home
   </a>
  </div>"""

        # Variant with class_ (as seen in skills-passport.html)
        block_to_remove_with_class_underscore = """<div class_="home-button-container">
   <a aria-label="Go to Home Page" class_="home-button" href="index.html">
    <i class_="fas fa-home">
    </i>
    Home
   </a>
  </div>"""

        # Standalone anchor tag (as seen in index.html)
        standalone_anchor_block = """<a aria-label="Go to Home Page" class="home-button" href="index.html">
    <i class="fas fa-home">
    </i>
    Home
  </a>"""
        # Standalone anchor tag with slightly different i tag spacing
        standalone_anchor_block_variant1 = """<a aria-label="Go to Home Page" class="home-button" href="index.html">
    <i class="fas fa-home"></i>
    Home
  </a>"""
        # Standalone anchor tag with i tag and text on same line
        standalone_anchor_block_variant2 = """<a aria-label="Go to Home Page" class="home-button" href="index.html">
    <i class="fas fa-home"></i> Home
  </a>"""


        # More flexible variations to catch potential inconsistencies for the container
        block_to_remove_variant1 = """<div class="home-button-container">
  <a aria-label="Go to Home Page" class="home-button" href="index.html">
    <i class="fas fa-home"></i>
    Home
  </a>
</div>"""

        block_to_remove_variant2 = """<div class="home-button-container">
    <a aria-label="Go to Home Page" class="home-button" href="index.html">
        <i class="fas fa-home"></i>
        Home
    </a>
</div>"""
        
        block_to_remove_variant3 = """<div class="home-button-container">
   <a aria-label="Go to Home Page" class="home-button" href="index.html">
    <i class="fas fa-home"></i> Home
   </a>
  </div>"""

        # Check if the block exists and remove it
        new_content = content
        removed = False
        if block_to_remove in new_content:
            new_content = new_content.replace(block_to_remove, "")
            print(f"Removed home button (with container) from: {file_path}")
            removed = True
        elif block_to_remove_variant1 in new_content:
            new_content = new_content.replace(block_to_remove_variant1, "")
            print(f"Removed home button (with container, variant 1) from: {file_path}")
            removed = True
        elif block_to_remove_variant2 in new_content:
            new_content = new_content.replace(block_to_remove_variant2, "")
            print(f"Removed home button (with container, variant 2) from: {file_path}")
            removed = True
        elif block_to_remove_variant3 in new_content:
            new_content = new_content.replace(block_to_remove_variant3, "")
            print(f"Removed home button (with container, variant 3) from: {file_path}")
            removed = True
        elif standalone_anchor_block in new_content: # Check for standalone anchor after container versions
            new_content = new_content.replace(standalone_anchor_block, "")
            print(f"Removed home button (standalone anchor) from: {file_path}")
            removed = True
        elif standalone_anchor_block_variant1 in new_content:
            new_content = new_content.replace(standalone_anchor_block_variant1, "")
            print(f"Removed home button (standalone anchor, variant 1) from: {file_path}")
            removed = True
        elif standalone_anchor_block_variant2 in new_content:
            new_content = new_content.replace(standalone_anchor_block_variant2, "")
            print(f"Removed home button (standalone anchor, variant 2) from: {file_path}")
            removed = True
        elif block_to_remove_with_class_underscore in new_content: # Check for class_ variant
            new_content = new_content.replace(block_to_remove_with_class_underscore, "")
            print(f"Removed home button (with class_ attributes) from: {file_path}")
            removed = True
        
        if not removed:
            # print(f"Home button not found in: {file_path}") # Optional: for debugging
            return False # Indicate no changes were made

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            return True # Indicate changes were made
        return False

    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        return False

def main():
    current_directory = '.'  # Start from the current directory
    files_changed_count = 0
    html_files_processed = 0

    for root, _, files in os.walk(current_directory):
        # Skip the 'Backup' directory
        if 'Backup' in root.split(os.sep):
            continue
        for file_name in files:
            if file_name.endswith(".html"):
                html_files_processed += 1
                file_path = os.path.join(root, file_name)
                if remove_home_button_from_html(file_path):
                    files_changed_count += 1
    
    print(f"\nProcessed {html_files_processed} HTML files.")
    print(f"Removed home button from {files_changed_count} files.")

if __name__ == "__main__":
    main()
