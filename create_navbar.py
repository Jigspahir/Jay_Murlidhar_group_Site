import re

def extract_navbar():
    with open('src/website/index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract header
    match = re.search(r'(<header id="navbar" class="navbar">.*?</header>)', content, re.DOTALL)
    if match:
        navbar_html = match.group(1)
        # convert quotes to literal for JS string
        js_content = f"""export const Navbar = `
{navbar_html.replace('`', '\\`')}
`;
export function initNavbar() {{
    const el = document.getElementById('navbar-container');
    if (el) el.innerHTML = Navbar;
}}
"""
        with open('src/shared/components/Navbar.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        print("Extracted Navbar.js")

extract_navbar()
