import os
import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract the <head> block
head_match = re.search(r'<head>.*?</head>', index_content, re.DOTALL)
head_content = head_match.group(0) if head_match else ""

# Extract the header/navbar block
nav_match = re.search(r'<header id="navbar".*?</header>', index_content, re.DOTALL)
nav_content = nav_match.group(0) if nav_match else ""

# Extract the footer block
footer_match = re.search(r'<footer class="footer">.*?</footer>', index_content, re.DOTALL)
footer_content = footer_match.group(0) if footer_match else ""

# Extract AI Chat Widget and WhatsApp floating button and script tag
# (Basically everything after footer up to </body>)
bottom_match = re.search(r'</footer>\s*(<!-- WhatsApp floating button -->.*</body>)', index_content, re.DOTALL)
bottom_content = bottom_match.group(1) if bottom_match else ""

# Construct the service-detail.html content
service_detail_html = f"""<!doctype html>
<html lang="en">
{head_content}
<body>
  <!-- Preloader -->
  <div id="preloader" aria-hidden="true">
    <img src="assets/jay-murlidhar-group-logo.png" alt="Jay Murlidhar Group" class="preloader-logo" />
    <div class="preloader-spinner"></div>
  </div>
  
  {nav_content}

  <main>
    <section class="hero" style="min-height: 50vh; padding-top: 150px; display: flex; align-items: center; justify-content: center; text-align: center;">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-inner" style="max-width: 800px;">
        <span class="eyebrow reveal" id="service-category">Service Details</span>
        <h1 class="hero-title reveal reveal-delay-1" id="service-title" style="margin-bottom: 1.5rem;">
          Professional Service
        </h1>
        <p class="hero-sub reveal reveal-delay-2" id="service-desc" style="font-size: 1.1rem;">
          Loading service details...
        </p>
        <div class="hero-cta reveal reveal-delay-3" style="justify-content: center;">
          <a href="#" id="service-cta-btn" class="btn btn-gold">Get a Quote on WhatsApp</a>
        </div>
      </div>
    </section>

    <!-- Additional Detail Section -->
    <section class="section">
      <div class="container grid grid-2" style="align-items: center; gap: 4rem;">
        <div class="reveal">
          <span class="eyebrow">Why Choose Us</span>
          <h2>Expert Assistance for Your Needs</h2>
          <p>
            Jay Murlidhar Group is dedicated to providing hassle-free, fast, and transparent services. We handle the complex paperwork, documentation, and processing so you can focus on what matters most.
          </p>
          <ul class="check-list">
            <li>Transparent pricing & quick turnaround</li>
            <li>Secure handling of your documents</li>
            <li>Dedicated support over WhatsApp & email</li>
            <li>Pan-India remote service delivery</li>
          </ul>
        </div>
        <div class="about-card reveal">
           <img src="assets/jay-murlidhar-computer-logo-jpg.jpg" alt="Service Excellence" style="width: 100%; border-radius: var(--radius); margin-bottom: 1.5rem;" />
           <h3>100% Satisfaction Guaranteed</h3>
           <p>Our team of professionals ensures that every service is delivered with the highest quality standards and utmost care for your specific requirements.</p>
        </div>
      </div>
    </section>
  </main>

  {footer_content}

  {bottom_content}

  <script>
    // Dynamic Service Detail Script
    document.addEventListener("DOMContentLoaded", () => {{
      const params = new URLSearchParams(window.location.search);
      const serviceName = params.get('service');
      
      if (serviceName) {{
        // Update Title & Text
        document.title = serviceName + " — Jay Murlidhar Group";
        document.getElementById('service-title').textContent = serviceName;
        document.getElementById('service-desc').textContent = "We provide comprehensive and professional " + serviceName + " solutions tailored exactly to your needs. Reach out to us for specialized support and fast processing.";
        
        // Update CTA WhatsApp Link
        const ctaBtn = document.getElementById('service-cta-btn');
        const waMessage = encodeURIComponent("Hello! I am interested in " + serviceName + " and would like to get a quote/more details.");
        ctaBtn.href = "https://wa.me/919909461768?text=" + waMessage;
        ctaBtn.target = "_blank";
      }}
    }});
  </script>
</html>
"""

# Replace the title tag in head_content inside the new HTML string using regex to set a generic title before JS loads
service_detail_html = re.sub(r'<title>.*?</title>', '<title>Service Details — Jay Murlidhar Group</title>', service_detail_html)

with open('service-detail.html', 'w', encoding='utf-8') as f:
    f.write(service_detail_html)

print("Created service-detail.html")
