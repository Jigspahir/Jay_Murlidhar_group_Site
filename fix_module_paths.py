import glob
import os

files = glob.glob('src/crm/pages/*.html') + ['src/crm/index.html']

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace('scripts/customer.js', 'modules/customer/customer.js')
    content = content.replace('scripts/invoice.js', 'modules/invoice/invoice.js')
    content = content.replace('scripts/quotation.js', 'modules/quotation/quotation.js')
    content = content.replace('scripts/auth.js', 'modules/authentication/auth.js')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
print("Fixed script paths in CRM HTML files.")
