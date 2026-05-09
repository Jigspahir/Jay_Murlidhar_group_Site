import os
import glob
import re

new_mega_menu = """        <div class="dropdown">
          <a href="#services" class="nav-link">Services <span
              style="font-size: 0.7em; vertical-align: middle;">▼</span></a>
          <div class="dropdown-menu" style="grid-template-columns: repeat(4, 1fr); width: 900px;">
            
            <!-- Column 1: Insurance Services -->
            <div class="dropdown-column">
              <span class="dropdown-header">Insurance Services</span>
              <a href="service-detail.html?service=Life+Insurance" class="dropdown-item">Life Insurance</a>
              <a href="service-detail.html?service=Health+Insurance" class="dropdown-item">Health Insurance</a>
              <a href="service-detail.html?service=Motor+Insurance" class="dropdown-item">Motor Insurance</a>
              <a href="service-detail.html?service=Bike+Insurance" class="dropdown-item">Bike Insurance</a>
              <a href="service-detail.html?service=Car+Insurance" class="dropdown-item">Car Insurance</a>
              <a href="service-detail.html?service=Commercial+Vehicle+Insurance" class="dropdown-item">Commercial Vehicle Insurance</a>
              <a href="service-detail.html?service=Business+Insurance" class="dropdown-item">Business Insurance</a>
              <a href="service-detail.html?service=Shop+Insurance" class="dropdown-item">Shop Insurance</a>
              <a href="service-detail.html?service=Factory+Insurance" class="dropdown-item">Factory Insurance</a>
              <a href="service-detail.html?service=Marine+Insurance" class="dropdown-item">Marine Insurance</a>
              <a href="service-detail.html?service=Fire+Insurance" class="dropdown-item">Fire Insurance</a>
              <a href="service-detail.html?service=Travel+Insurance" class="dropdown-item">Travel Insurance</a>
              <a href="service-detail.html?service=Crop+Insurance" class="dropdown-item">Crop Insurance</a>
              <a href="service-detail.html?service=Cyber+Insurance" class="dropdown-item">Cyber Insurance</a>
              <a href="service-detail.html?service=Employee+Insurance" class="dropdown-item">Employee Insurance</a>
              <a href="service-detail.html?service=LIC+Plans" class="dropdown-item">LIC Plans</a>
              <a href="service-detail.html?service=PM+Jeevan+Jyoti+Bima" class="dropdown-item">PM Jeevan Jyoti Bima</a>
              <a href="service-detail.html?service=PM+Suraksha+Bima" class="dropdown-item">PM Suraksha Bima</a>
              <a href="service-detail.html?service=Ayushman+Bharat" class="dropdown-item">Ayushman Bharat</a>
            </div>

            <!-- Column 2: CSC & Business Services -->
            <div class="dropdown-column">
              <span class="dropdown-header">CSC & Business Services</span>
              <a href="service-detail.html?service=GST+Registration+and+Filing" class="dropdown-item">GST Registration & Filing</a>
              <a href="service-detail.html?service=MSME+Registration" class="dropdown-item">MSME Registration</a>
              <a href="service-detail.html?service=PAN+TAN+Card" class="dropdown-item">PAN / TAN Card</a>
              <a href="service-detail.html?service=Shop+Act+License" class="dropdown-item">Shop Act License</a>
              <a href="service-detail.html?service=FSSAI+Registration" class="dropdown-item">FSSAI Registration</a>
              <a href="service-detail.html?service=Income+Tax+Filing" class="dropdown-item">Income Tax Filing</a>
              <a href="service-detail.html?service=Digital+Signature" class="dropdown-item">Digital Signature (DSC)</a>
              <a href="service-detail.html?service=Udyam+Registration" class="dropdown-item">Udyam Registration</a>
              <a href="service-detail.html?service=Online+Documentation" class="dropdown-item">Online Documentation</a>
              <a href="service-detail.html?service=Government+Schemes" class="dropdown-item">Government Schemes</a>
              <a href="service-detail.html?service=Banking+Services" class="dropdown-item">Banking Services</a>
              <a href="service-detail.html?service=Bill+Payments" class="dropdown-item">Bill Payments</a>
              <a href="service-detail.html?service=Aadhaar+Services" class="dropdown-item">Aadhaar Services</a>
            </div>

            <!-- Column 3: Tech Services -->
            <div class="dropdown-column">
              <span class="dropdown-header">Tech Services</span>
              <a href="service-detail.html?service=Website+Design" class="dropdown-item">Website Design</a>
              <a href="service-detail.html?service=Website+Development" class="dropdown-item">Website Development</a>
              <a href="service-detail.html?service=App+Development" class="dropdown-item">App Development</a>
              <a href="service-detail.html?service=Software+Development" class="dropdown-item">Software Development</a>
              <a href="service-detail.html?service=Digital+Marketing" class="dropdown-item">Digital Marketing</a>
              <a href="service-detail.html?service=Social+Media+Marketing" class="dropdown-item">Social Media Marketing</a>
              <a href="service-detail.html?service=Graphic+Design" class="dropdown-item">Graphic Design</a>
              <a href="service-detail.html?service=SEO+Services" class="dropdown-item">SEO Services</a>
              <a href="service-detail.html?service=WhatsApp+API+Solutions" class="dropdown-item">WhatsApp API Solutions</a>
              <a href="service-detail.html?service=Bulk+SMS+Services" class="dropdown-item">Bulk SMS Services</a>
              <a href="service-detail.html?service=Hosting+and+Domain" class="dropdown-item">Hosting & Domain</a>
              <a href="service-detail.html?service=AI+Chatbot+Development" class="dropdown-item">AI Chatbot Development</a>
            </div>

            <!-- Column 4: Academy -->
            <div class="dropdown-column">
              <span class="dropdown-header">Academy</span>
              <a href="service-detail.html?service=Computer+Courses" class="dropdown-item">Computer Courses</a>
              <a href="service-detail.html?service=Tally+Course" class="dropdown-item">Tally Course</a>
              <a href="service-detail.html?service=Basic+IT+Training" class="dropdown-item">Basic IT Training</a>
              <a href="service-detail.html?service=Digital+Marketing+Training" class="dropdown-item">Digital Marketing Training</a>
              <a href="service-detail.html?service=Web+Development+Course" class="dropdown-item">Web Development Course</a>
              <a href="service-detail.html?service=Spoken+English" class="dropdown-item">Spoken English</a>
              <a href="service-detail.html?service=Government+Exam+Preparation" class="dropdown-item">Government Exam Preparation</a>
              <a href="service-detail.html?service=Skill+Development+Programs" class="dropdown-item">Skill Development Programs</a>
              <a href="service-detail.html?service=Internship+Programs" class="dropdown-item">Internship Programs</a>
              <a href="service-detail.html?service=Student+Guidance" class="dropdown-item">Student Guidance</a>
            </div>

          </div>
        </div>"""

html_files = glob.glob('*.html')

for file_path in html_files:
    if file_path == 'service-detail.html':
        continue # Don't replace if it's currently generated or has slightly different nav, wait, it has the same nav! We should update it too.

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    pattern = re.compile(r'(<a href="[^"]*#about"[^>]*>About</a>\s*)(.*?)(\s*<a href="[^"]*#team"[^>]*>Team</a>)', re.MULTILINE | re.DOTALL)
    
    match = pattern.search(content)
    if match:
        new_content = content[:match.start(2)] + new_mega_menu + content[match.end(2):]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes needed for {file_path}")

# also update service-detail.html since it needs the new mega menu
if 'service-detail.html' in html_files:
    with open('service-detail.html', 'r', encoding='utf-8') as f:
        content = f.read()
    match = pattern.search(content)
    if match:
        new_content = content[:match.start(2)] + new_mega_menu + content[match.end(2):]
        with open('service-detail.html', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated service-detail.html")
