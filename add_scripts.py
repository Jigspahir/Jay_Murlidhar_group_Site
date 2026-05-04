import os

html_files = [
    "general-insurance.html",
    "life-insurance.html",
    "term-insurance.html",
    "investment.html",
    "health-insurance.html",
    "other-insurance.html"
]

script_tag = '  <script src="js/script.js"></script>\n</body>'

for f in html_files:
    if os.path.exists(f):
        with open(f, 'r') as file:
            content = file.read()
        
        if 'js/script.js' not in content:
            content = content.replace('</body>', script_tag)
            with open(f, 'w') as file:
                file.write(content)
            print(f"Added script to {f}")
        else:
            print(f"Script already exists in {f}")
