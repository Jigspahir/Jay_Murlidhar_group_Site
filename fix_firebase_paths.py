import glob
import os

files = glob.glob('src/crm/pages/*.html') + ['src/crm/index.html']

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # from crm/firebase to src/firebase
    content = content.replace('firebase/firebase-config.js', '../firebase/firebase-config.js')
    content = content.replace('firebase/database.js', '../firebase/database.js')
    
    # if it's index.html, it's one level shallower, so just 'firebase/' becomes '../firebase/'? 
    # wait, src/crm/index.html is in src/crm. src/firebase is in src/. So from src/crm/index.html it is ../firebase/
    # From src/crm/pages/*.html it is ../../firebase/
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# Specific fix for index.html vs pages/
with open('src/crm/index.html', 'r', encoding='utf-8') as file:
    content = file.read()
    content = content.replace('../../firebase/', '../firebase/')
with open('src/crm/index.html', 'w', encoding='utf-8') as file:
    file.write(content)

for f in glob.glob('src/crm/pages/*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        # if it was ../firebase/ due to previous replacement but it should be ../../firebase/
        content = content.replace('../firebase/', '../../firebase/')
        # if it became ../../../firebase/, fix it
        content = content.replace('../../../firebase/', '../../firebase/')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
        
print("Fixed Firebase paths in HTML files.")
