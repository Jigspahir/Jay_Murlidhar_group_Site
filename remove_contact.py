import os

sub_pages = [
    "general-insurance.html",
    "life-insurance.html",
    "term-insurance.html",
    "investment.html",
    "health-insurance.html",
    "other-insurance.html"
]

start_marker = '<!-- CONTACT -->'
end_marker = '</section>'

for page in sub_pages:
    if os.path.exists(page):
        with open(page, 'r') as f:
            content = f.read()
        
        start_idx = content.find(start_marker)
        if start_idx != -1:
            # Find the first </section> after the start marker
            # The contact section is a single section block.
            end_idx = content.find(end_marker, start_idx)
            if end_idx != -1:
                # Remove from start_marker to the end of that section
                new_content = content[:start_idx] + content[end_idx + len(end_marker):]
                with open(page, 'w') as f:
                    f.write(new_content)
                print(f"Removed contact section from {page}")
            else:
                print(f"Could not find end marker in {page}")
        else:
            print(f"Could not find start marker in {page}")
