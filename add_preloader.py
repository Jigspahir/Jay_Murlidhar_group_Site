import os

pages = [
    "index.html",
    "general-insurance.html",
    "life-insurance.html",
    "term-insurance.html",
    "investment.html",
    "health-insurance.html",
    "other-insurance.html"
]

preloader_html = """
  <!-- Preloader -->
  <div id="preloader" aria-hidden="true">
    <img src="assets/jay-murlidhar-group-logo.png" alt="Jay Murlidhar Group" class="preloader-logo" />
    <div class="preloader-spinner"></div>
  </div>
"""

for page in pages:
    if os.path.exists(page):
        with open(page, 'r') as f:
            content = f.read()
        
        if '<body' in content and 'id="preloader"' not in content:
            # Find the index of the first > after <body
            body_idx = content.find('<body')
            end_body_tag_idx = content.find('>', body_idx)
            if end_body_tag_idx != -1:
                new_content = content[:end_body_tag_idx+1] + preloader_html + content[end_body_tag_idx+1:]
                with open(page, 'w') as f:
                    f.write(new_content)
                print(f"Added preloader to {page}")
        else:
            print(f"Skipped {page} (already has preloader or no body tag)")
