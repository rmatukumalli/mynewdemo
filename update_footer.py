import os

def update_footer_text(directory):
    old_text = "Demo Experience by Raj Matukumalli &ndash; For Illustrative Purposes Only"
    new_text = "Demo Experience by Raj Matukumalli &ndash; For Illustrative Purposes Only - Optimized for Desktop"

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if old_text in content:
                        new_content = content.replace(old_text, new_text)
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated footer in: {filepath}")
                    else:
                        print(f"Footer text not found in: {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    current_directory = "."
    update_footer_text(current_directory)
