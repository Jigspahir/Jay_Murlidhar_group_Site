import os
import glob
import re

html_files = glob.glob('*.html')

for file_path in html_files:
    if file_path == 'index.html':
        continue # Don't update index.html, it works fine with local anchors

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the anchors
    new_content = content.replace('href="#home"', 'href="index.html#home"')
    new_content = new_content.replace('href="#about"', 'href="index.html#about"')
    new_content = new_content.replace('href="#team"', 'href="index.html#team"')
    new_content = new_content.replace('href="#contact"', 'href="index.html#contact"')
    new_content = new_content.replace('href="#services"', 'href="index.html#services"')

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated anchors in {file_path}")
    else:
        print(f"No changes needed in {file_path}")
