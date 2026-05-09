import os
import glob
import shutil

# Move all contents of crm/ to src/crm/
src_crm = 'src/crm'
os.makedirs(src_crm, exist_ok=True)

if os.path.exists('crm'):
    for item in os.listdir('crm'):
        src_path = os.path.join('crm', item)
        dst_path = os.path.join(src_crm, item)
        shutil.move(src_path, dst_path)
    try: os.rmdir('crm')
    except: pass

print("Moved CRM files.")
