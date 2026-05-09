<?php
# generate_sitemap.py
import os
import datetime

BASE_URL = "https://www.jaymurlidhargroup.com/"
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def get_html_files():
    html_files = []
    for root, _, files in os.walk(ROOT_DIR):
        for f in files:
            if f.lower().endswith('.html'):
                rel_path = os.path.relpath(os.path.join(root, f), ROOT_DIR)
                html_files.append(rel_path.replace(os.sep, '/'))
    return html_files

def generate_sitemap():
    urls = []
    today = datetime.date.today().isoformat()
    for path in get_html_files():
        url = BASE_URL + path
        urls.append(f"  <url>\n    <loc>{url}</loc>\n    <lastmod>{today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>")
    sitemap_content = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + "\n".join(urls) + "\n</urlset>"
    with open(os.path.join(ROOT_DIR, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    print("sitemap.xml generated with", len(urls), "entries.")

if __name__ == "__main__":
    generate_sitemap()
?>
