import os
import shutil
import glob

def move_files(src, dest):
    if not os.path.exists(src): return
    if not os.path.exists(dest): os.makedirs(dest)
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dest, item)
        if os.path.isfile(s):
            shutil.move(s, d)
        elif os.path.isdir(s):
            if not os.path.exists(d): os.makedirs(d)
            move_files(s, d)

# 1. Move website files to root
if os.path.exists('src/website'):
    for f in glob.glob('src/website/*.html'):
        shutil.move(f, './')
    move_files('src/website/styles', 'css')
    move_files('src/website/scripts', 'js')

# 2. Move CRM files to /crm
os.makedirs('crm', exist_ok=True)
if os.path.exists('src/crm'):
    if os.path.exists('src/crm/index.html'):
        shutil.move('src/crm/index.html', 'crm/')
    if os.path.exists('src/crm/pages'):
        for f in glob.glob('src/crm/pages/*.html'):
            shutil.move(f, 'crm/')
    move_files('src/crm/styles', 'crm/styles')
    move_files('src/crm/modules', 'crm/modules')

# 3. Move public/assets to /assets
move_files('public/assets', 'assets')

# 4. Move shared, firebase, backend
move_files('src/shared', 'shared')
move_files('src/firebase', 'firebase')
move_files('src/backend', 'backend')

# 5. Clean up old dirs
shutil.rmtree('src', ignore_errors=True)
shutil.rmtree('public', ignore_errors=True)

# 6. Replace paths in all HTML files in root
for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('styles/', 'css/')
    content = content.replace('scripts/', 'js/')
    content = content.replace('../../public/assets/', 'assets/')
    content = content.replace('../public/assets/', 'assets/')
    content = content.replace('../shared/', 'shared/')
    content = content.replace('../crm/', 'crm/')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# 7. Replace paths in CRM HTML files
for f in glob.glob('crm/*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # In CRM pages (formerly src/crm/pages/*):
    # ../../public/assets/ -> ../assets/
    # ../styles/ -> styles/
    # ../scripts/ -> scripts/
    # ../../shared/ -> ../shared/
    # ../../firebase/ -> ../firebase/
    # ../index.html -> index.html
    # pages/something.html -> something.html

    content = content.replace('../../public/assets/', '../assets/')
    content = content.replace('../public/assets/', '../assets/')
    
    content = content.replace('../styles/', 'styles/')
    content = content.replace('../scripts/', 'scripts/')
    content = content.replace('../../shared/', '../shared/')
    content = content.replace('../../firebase/', '../firebase/')
    content = content.replace('../firebase/', '../firebase/') # For index.html
    
    content = content.replace('../index.html', 'index.html')
    content = content.replace('pages/', '')

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Restructuring complete.")
