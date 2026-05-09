import os
import glob

# The old chunk of the 'RTO & Tech' section in Services dropdown
old_tech_chunk = """              <span class="dropdown-header">RTO & Tech</span>
              <a href="index.html?service=RTO#contact" class="dropdown-item">Vehicle RTO Services</a>
              <a href="index.html?service=RTO#contact" class="dropdown-item">License Assistance</a>
              <a href="index.html?service=Tech#contact" class="dropdown-item">Website & App Dev</a>
              <a href="index.html?service=Tech#contact" class="dropdown-item">Social Media Marketing</a>
              <a href="index.html?service=Tech#contact" class="dropdown-item">Website Design</a>"""

# The replacement chunk for RTO section (without tech)
new_rto_chunk = """              <span class="dropdown-header">RTO</span>
              <a href="index.html?service=RTO#contact" class="dropdown-item">Vehicle RTO Services</a>
              <a href="index.html?service=RTO#contact" class="dropdown-item">License Assistance</a>"""

# The new dropdown to be inserted after the 'Services' dropdown
# We will match the end of the Services dropdown.
# Services dropdown ends with:
#             </div>
#           </div>
#         </div>
#         <a href="#team" class="nav-link">Team</a>
# We'll replace the `<a href="#team" class="nav-link">Team</a>` with the new tech dropdown + team link.

services_end_chunk = """          </div>
        </div>
        <a href="#team" class="nav-link">Team</a>"""

new_tech_dropdown_and_team = """          </div>
        </div>

        <div class="dropdown">
          <a href="#tech" class="nav-link">Tech Service <span
              style="font-size: 0.7em; vertical-align: middle;">▼</span></a>
          <div class="dropdown-menu">
            <div class="dropdown-column">
              <span class="dropdown-header">IT & Digital Services</span>
              <a href="index.html?service=Tech#contact" class="dropdown-item">Website & App Dev</a>
              <a href="index.html?service=Tech#contact" class="dropdown-item">Website Design</a>
              <a href="index.html?service=Tech#contact" class="dropdown-item">Social Media Marketing</a>
              <a href="index.html?service=Tech#contact" class="dropdown-item">SEO & Digital Marketing</a>
              <a href="index.html?service=Tech#contact" class="dropdown-item">Graphic Design</a>
            </div>
          </div>
        </div>
        <a href="#team" class="nav-link">Team</a>"""

html_files = glob.glob('*.html')

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    if old_tech_chunk in content:
        content = content.replace(old_tech_chunk, new_rto_chunk)
        modified = True
        
    if services_end_chunk in content:
        content = content.replace(services_end_chunk, new_tech_dropdown_and_team)
        modified = True
        
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes needed for {file_path}")
