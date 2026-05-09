import os
import glob
import re

html_files = glob.glob('*.html')
os.makedirs('src/website', exist_ok=True)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update assets/ to ../../public/assets/
    content = re.sub(r'(["\'])assets/', r'\1../../public/assets/', content)
    # Update css/ to ../../css/ (will move later)
    content = re.sub(r'(["\'])css/', r'\1../../css/', content)
    # Update js/ to ../../js/ (will move later)
    content = re.sub(r'(["\'])js/', r'\1../../js/', content)
    # Update crm/ to ../../crm/
    content = re.sub(r'(["\'])crm/', r'\1../../crm/', content)
    
    # Other local .html links should now be relative to src/website/
    # Actually, they are in the same folder now, so no need to change links between them!
    
    with open(f'src/website/{file}', 'w', encoding='utf-8') as f:
        f.write(content)
        
    os.remove(file)
print("Moved HTML files and updated paths.")
