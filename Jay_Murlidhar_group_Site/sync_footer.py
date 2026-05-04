import os

# Files to update
sub_pages = [
    "general-insurance.html",
    "life-insurance.html",
    "term-insurance.html",
    "investment.html",
    "health-insurance.html",
    "other-insurance.html"
]

# Extract the block from index.html
with open('index.html', 'r') as f:
    index_content = f.read()

# We want everything from the CTA section to the end
# The CTA section starts with <!-- CTA --> or <section class="cta-band">
start_marker = '<!-- CTA -->'
end_marker = '</html>'

start_idx = index_content.find(start_marker)
if start_idx == -1:
    start_idx = index_content.find('<section class="cta-band">')

if start_idx != -1:
    global_footer_block = index_content[start_idx:]
    print("Extracted global footer block.")
else:
    print("Could not find start marker in index.html")
    exit(1)

for page in sub_pages:
    if os.path.exists(page):
        with open(page, 'r') as f:
            page_content = f.read()
        
        # We find where </main> ends and replace everything after it
        main_end_marker = '</main>'
        main_end_idx = page_content.find(main_end_marker)
        
        if main_end_idx != -1:
            # Keep everything up to </main>
            new_content = page_content[:main_end_idx + len(main_end_marker)]
            # Add the global footer block
            new_content += "\n\n  " + global_footer_block
            
            with open(page, 'w') as f:
                f.write(new_content)
            print(f"Updated {page}")
        else:
            print(f"Could not find </main> in {page}")
