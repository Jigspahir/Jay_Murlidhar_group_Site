import os
import glob
import re

os.chdir('src/crm')
os.makedirs('pages', exist_ok=True)
os.makedirs('styles', exist_ok=True)
os.makedirs('scripts', exist_ok=True)

# Move css files
for f in glob.glob('css/*'):
    os.rename(f, f.replace('css/', 'styles/'))
try: os.rmdir('css')
except: pass

# Move js files
for f in glob.glob('js/*'):
    os.rename(f, f.replace('js/', 'scripts/'))
try: os.rmdir('js')
except: pass

# Move html files except index.html
html_files = glob.glob('*.html')
for f in html_files:
    if f != 'index.html':
        os.rename(f, f"pages/{f}")

# Function to fix paths in html
def fix_html_paths(file_path, is_in_pages):
    if not os.path.exists(file_path): return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    prefix = '../' if is_in_pages else ''
    
    # fix css
    content = re.sub(r'(["\'])css/', rf'\1{prefix}styles/', content)
    # fix js
    content = re.sub(r'(["\'])js/', rf'\1{prefix}scripts/', content)
    
    # fix assets (from src/crm/ to public/assets/)
    asset_prefix = '../../public/assets/' if is_in_pages else '../public/assets/'
    content = re.sub(r'(["\'])(?:../)*assets/', rf'\1{asset_prefix}', content)
    
    # fix relative HTML links among CRM pages
    if is_in_pages:
        # If in pages, index.html becomes ../index.html
        content = re.sub(r'(["\'])index\.html', r'\1../index.html', content)
        # Other html files are in the same folder, so keep them as they are
    else:
        # If not in pages, other html files become pages/xxx.html
        content = re.sub(r'(["\'])([a-zA-Z0-9_-]+\.html)', r'\1pages/\2', content)
        # But fix self index.html link
        content = content.replace('pages/index.html', 'index.html')
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix paths
if os.path.exists('index.html'):
    fix_html_paths('index.html', False)

for f in glob.glob('pages/*.html'):
    fix_html_paths(f, True)

print("CRM restructured and paths updated.")
