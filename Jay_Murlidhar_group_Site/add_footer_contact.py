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

contact_column = """      <div>
        <h4>Contact Us</h4>
        <ul class="footer-list">
          <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem;">
            <span style="background: rgba(111, 78, 152, 0.1); padding: 8px; border-radius: 8px; font-size: 1.1rem; line-height: 1;">📞</span>
            <div>
              <div style="font-weight: 600; color: var(--primary); font-size: 0.85rem;">Phone</div>
              <a href="tel:+919909461768" style="font-size: 0.85rem;">+91 99094 61768</a>
            </div>
          </li>
          <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem;">
            <span style="background: rgba(37, 211, 102, 0.1); padding: 8px; border-radius: 8px; line-height: 1;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                <path d="M12.01 2.01c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.83 3.08 1.26 4.76 1.26 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm5.71 14.18c-.28.78-1.58 1.48-2.18 1.54-.53.05-1.2-.1-3.41-1.02-2.65-1.11-4.38-3.8-4.52-3.99-.13-.18-1.09-1.45-1.09-2.77 0-1.32.69-1.97.94-2.24.23-.26.51-.33.68-.33.17 0 .34 0 .49.02.16.01.37-.06.56.41.2.49.68 1.66.75 1.79.06.13.11.28.02.46-.08.18-.13.29-.26.43-.13.14-.28.31-.38.42-.12.13-.25.28-.11.53.14.25.64 1.07 1.38 1.73.95.85 1.74 1.12 1.99 1.25.25.13.4.11.54-.05.15-.16.63-.73.8-1.01.17-.28.34-.23.57-.15.23.08 1.48.7 1.73.83.25.13.42.2.48.3.06.11.06.67-.22 1.45z"/>
              </svg>
            </span>
            <div>
              <div style="font-weight: 600; color: #25D366; font-size: 0.85rem;">WhatsApp</div>
              <a href="https://wa.me/919909461768" style="font-size: 0.85rem;">+91 99094 61768</a>
            </div>
          </li>
          <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem;">
            <span style="background: rgba(234, 67, 53, 0.1); padding: 8px; border-radius: 8px; line-height: 1;">
               <svg viewBox="0 0 24 24" width="18" height="18" fill="#EA4335">
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
               </svg>
            </span>
            <div>
              <div style="font-weight: 600; color: #EA4335; font-size: 0.85rem;">Email</div>
              <a href="mailto:info.jaymurlidhargroup@gmail.com" style="font-size: 0.75rem; word-break: break-all;">info.jaymurlidhargroup@gmail.com</a>
            </div>
          </li>
          <li style="display: flex; align-items: flex-start; gap: 10px;">
            <span style="background: rgba(111, 78, 152, 0.1); padding: 8px; border-radius: 8px; font-size: 1.1rem; line-height: 1;">📍</span>
            <div>
              <div style="font-weight: 600; color: var(--primary); font-size: 0.85rem;">Address</div>
              <div style="font-size: 0.75rem; line-height: 1.4; color: var(--text-muted);">Head Office: Junagadh, Gujarat | Virtual Office | Remote Services</div>
            </div>
          </li>
        </ul>
      </div>
"""

# We look for the Business section and insert after it.
business_marker = """      <div>
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
        
        if business_marker in content:
            new_content = content.replace(business_marker, business_marker + "\n" + contact_column)
            with open(page, 'w') as f:
                f.write(new_content)
            print(f"Added contact column to {page}")
        else:
            print(f"Could not find business marker in {page}")
