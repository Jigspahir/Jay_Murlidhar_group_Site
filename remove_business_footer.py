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

# The block to remove
business_block = """      <div>
        <h4>Business</h4>
        <ul class="footer-list">
          <li>GST registration</li>
          <li>MSME registration</li>
          <li>PAN Card</li>
          <li>TAN Card</li>
          <li>GST Return</li>
        </ul>
      </div>"""

for page in pages:
    if os.path.exists(page):
        with open(page, 'r') as f:
            content = f.read()
        
        if business_block in content:
            new_content = content.replace(business_block, "")
            # Also clean up any resulting double newlines if needed, 
            # but simple replace is usually fine.
            with open(page, 'w') as f:
                f.write(new_content)
            print(f"Removed Business section from {page}")
        else:
            print(f"Could not find Business section in {page}")
