import os

# Files to update (excluding general-insurance which is already done)
sub_pages = [
    "life-insurance.html",
    "term-insurance.html",
    "investment.html",
    "health-insurance.html",
    "other-insurance.html"
]

# Extract the block from general-insurance.html
with open('general-insurance.html', 'r') as f:
    source_content = f.read()

start_marker = '<!-- CTA -->'
end_marker = '</html>'

start_idx = source_content.find(start_marker)

if start_idx != -1:
    global_footer_block = source_content[start_idx:]
    print("Extracted global footer block from general-insurance.html")
else:
    print("Could not find start marker in general-insurance.html")
    exit(1)

for page in sub_pages:
    if os.path.exists(page):
        with open(page, 'r') as f:
            page_content = f.read()
        
        main_end_marker = '</main>'
        main_end_idx = page_content.find(main_end_marker)
        
        if main_end_idx != -1:
            new_content = page_content[:main_end_idx + len(main_end_marker)]
            new_content += "\n\n  " + global_footer_block
            
            with open(page, 'w') as f:
                f.write(new_content)
            print(f"Updated {page}")
        else:
            print(f"Could not find </main> in {page}")
