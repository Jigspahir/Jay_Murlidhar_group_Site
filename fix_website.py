import os
import glob
import re
import shutil

# move css and js
os.makedirs('src/website/styles', exist_ok=True)
os.makedirs('src/website/scripts', exist_ok=True)
os.makedirs('src/shared/styles', exist_ok=True)
os.makedirs('src/shared/scripts', exist_ok=True)

if os.path.exists('css'):
    for f in glob.glob('css/*'):
        shutil.move(f, 'src/website/styles/')
    try: os.rmdir('css')
    except: pass

if os.path.exists('js'):
    for f in glob.glob('js/*'):
        shutil.move(f, 'src/website/scripts/')
    try: os.rmdir('js')
    except: pass

# fix website HTML files
for file_path in glob.glob('src/website/*.html'):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('../../css/', 'styles/')
    content = content.replace('../../js/', 'scripts/')
    # fix the crm link in website (from src/website to src/crm/index.html)
    content = content.replace('../../crm/', '../crm/')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Website structured and paths updated.")
