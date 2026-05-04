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

def get_explore_section(page):
    prefix = "" if page == "index.html" else "index.html"
    return f"""      <div>
        <h4>Explore</h4>
        <ul class="footer-list">
          <li><a href="{prefix}#home">Home</a></li>
          <li><a href="{prefix}#about">About</a></li>
          <li><a href="{prefix}#services">Services</a></li>
          <li><a href="{prefix}#contact">Contact</a></li>
          <li><a href="{prefix}#freelancing">Freelancing</a></li>
        </ul>
      </div>"""

insurance_section = """      <div>
        <h4>Insurance</h4>
        <ul class="footer-list">
          <li><a href="general-insurance.html">General Insurance</a></li>
          <li><a href="life-insurance.html">Life Insurance</a></li>
          <li><a href="term-insurance.html">Term Insurance</a></li>
          <li><a href="investment.html">Investment</a></li>
          <li><a href="health-insurance.html">Health Insurance</a></li>
          <li><a href="other-insurance.html">Other Insurance</a></li>
        </ul>
      </div>"""

business_section = """      <div>
        <h4>Business</h4>
        <ul class="footer-list">
          <li>GST registration</li>
          <li>MSME registration</li>
          <li>PAN Card</li>
          <li>TAN Card</li>
          <li>GST Return</li>
        </ul>
      </div>"""

# Marker: we insert before Contact Us
contact_marker = "<h4>Contact Us</h4>"

for page in pages:
    if os.path.exists(page):
        with open(page, 'r') as f:
            content = f.read()
        
        # Determine what's missing
        to_add = []
        if "<h4>Explore</h4>" not in content:
            to_add.append(get_explore_section(page))
        if "<h4>Insurance</h4>" not in content:
            to_add.append(insurance_section)
        if "<h4>Business</h4>" not in content:
            to_add.append(business_section)
        
        if to_add and contact_marker in content:
            idx = content.find(contact_marker)
            div_start = content.rfind("<div", 0, idx)
            if div_start != -1:
                insertion = "\n".join(to_add) + "\n      "
                new_content = content[:div_start] + insertion + content[div_start:]
                with open(page, 'w') as f:
                    f.write(new_content)
                print(f"Restored sections to {page}")
        else:
            print(f"Nothing to add or no marker in {page}")
