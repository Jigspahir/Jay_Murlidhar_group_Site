# Jay Murlidhar Tech Solutions — Static Website

Production-ready, **plain HTML / CSS / JavaScript** version of the site.
No build step, no dependencies — just open or upload.

## Folder structure

```
jay-murlidhar-static/
├── index.html          # Single-page site (Navbar, Hero, Services, About, CTA, Contact, Footer)
├── css/
│   └── style.css       # All styles, design tokens, animations, responsive rules
├── js/
│   └── script.js       # Mobile menu, scroll reveal, services render, contact form
├── assets/
│   ├── logo.jpg        # Brand logo
│   └── hero.jpg        # Hero background image
└── README.md
```

## Run locally

Just double-click `index.html`, or for a local server:

```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

Upload the whole folder to **any** static host:
- Netlify (drag & drop)
- Vercel (Static project)
- GitHub Pages
- Cloudflare Pages
- Hostinger / cPanel `public_html`

## Customise

- Brand colors / fonts → `:root` block in `css/style.css`
- Services list → `services` array at the top of `js/script.js`
- Contact info → search `9909461768` and `info.jaymurlidhargroup@gmail.com` across `index.html`
- WhatsApp number → `whatsappBtn` link in `index.html`

## Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Sticky, blurred navbar with mobile hamburger
- ✅ Hero with gradient overlay & background image
- ✅ Animated service cards (scroll-reveal + hover lift)
- ✅ About section with mission & checklist
- ✅ Contact form (opens user's email client) + WhatsApp floating button
- ✅ SEO: title, meta description, Open Graph, Twitter card, JSON-LD LocalBusiness
- ✅ Accessible: semantic HTML, focus styles, `prefers-reduced-motion` support
