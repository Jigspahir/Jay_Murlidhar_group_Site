/* ==========================================================
   Jay Murlidhar Tech Solutions — Static site script
   ========================================================== */

(function () {
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 600);
    }
  });

  /* ---------- Services data ---------- */
  const services = [
    {
      icon: "🛡️",
      img: "assets/jay murlidhar insurance.svg",
      title: "Insurance Services",
      desc: "We offer a complete range of insurance services including Life, Health, Motor, Business, and Personal Insurance with expert support and hassle-free processing.",
    },
    {
      icon: "🚗",
      img: "assets/jay-murlidhar-computer-logo-jpg.jpg",
      title: "RTO Services",
      desc: "Complete RTO services including vehicle registration, ownership transfer, driving license assistance, and online documentation with fast and reliable support.",
    },
    {
      icon: "💻",
      img: "assets/jay murlidhar tech.jpg",
      title: "Freelance Services",
      desc: "Professional tech services including website development, application development, social media marketing, and modern website design — tailored to grow your business.",
    },
    {
      icon: "🏛️",
      img: "assets/jay-murlidhar-computer-logo-jpg.jpg",
      title: "Business Registration",
      desc: "End-to-end business solutions with GST registration & filing, MSME registration, Shop Act license, FSSAI certification, and expert support for smooth and hassle-free operations.",
    },

  ];

  /* ---------- Render services ---------- */
  const grid = document.getElementById("servicesGrid");
  if (grid) {
    grid.innerHTML = services
      .map(
        (s, index) => `
      <article class="service-card reveal" onclick="window.openServiceModal(${index})" style="cursor: pointer;">
        <img src="${s.img || 'assets/jay-murlidhar-computer-logo-jpg.jpg'}" alt="${s.title}" class="service-img" />
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </article>`
      )
      .join("");

    /* ---------- Service Modal Control Functions ---------- */
    window.openServiceModal = (index) => {
      const s = services[index];
      if (!s) return;
      
      const modal = document.getElementById('serviceModal');
      const icon = document.getElementById('serviceModalIcon');
      const img = document.getElementById('serviceModalImg');
      const title = document.getElementById('serviceModalTitle');
      const desc = document.getElementById('serviceModalDesc');
      
      icon.textContent = s.icon;
      img.src = s.img || 'assets/jay-murlidhar-computer-logo-jpg.jpg';
      title.textContent = s.title;
      desc.textContent = s.desc;
      
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    window.closeServiceModal = () => {
      const modal = document.getElementById('serviceModal');
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    /* ---------- Services Slider Controls ---------- */
    const btnPrev = document.getElementById("sliderPrev");
    const btnNext = document.getElementById("sliderNext");
    if (btnPrev && btnNext) {
      btnPrev.addEventListener("click", () => {
        grid.scrollBy({ left: -340, behavior: "smooth" });
      });
      btnNext.addEventListener("click", () => {
        grid.scrollBy({ left: 340, behavior: "smooth" });
      });
    }

    /* ---------- Slider Wheel Scroll ---------- */
    grid.addEventListener("wheel", (e) => {
      // Only capture vertical scroll
      if (Math.abs(e.deltaY) > 0) {
        const atLeft = grid.scrollLeft <= 0;
        const atRight = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;
        
        // Translate vertical scroll to horizontal if not at the ends
        if ((e.deltaY > 0 && !atRight) || (e.deltaY < 0 && !atLeft)) {
          e.preventDefault();
          grid.scrollBy({ left: e.deltaY, behavior: "auto" });
        }
      }
    });
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state ---------- */
  const nav = document.getElementById("navbar");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    };
    toggle.addEventListener("click", () => setOpen(menu.hidden));
    menu.addEventListener("click", (e) => {
      if (e.target.tagName === "A") setOpen(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Smooth-scroll active link highlight (optional nicety) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
      }
    });
  });

  /* ---------- Contact form (client-side; opens email client) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      if (!name || !email || !message) {
        status.textContent = "Please fill in your name, email and message.";
        status.className = "form-status error";
        return;
      }

      const subject = encodeURIComponent(`New enquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
      );
      window.location.href = `mailto:info.jaymurlidhargroup@gmail.com?subject=${subject}&body=${body}`;

      status.textContent = "Opening your email app… you can also reach us on WhatsApp.";
      status.className = "form-status success";
      form.reset();
    });
  }


  /* ---------- AI Chat Agent Logic ---------- */
  const aiChatBtn = document.getElementById("aiChatBtn");
  const aiChatWindow = document.getElementById("aiChatWindow");
  const aiChatClose = document.getElementById("aiChatClose");
  const aiChatInputArea = document.getElementById("aiChatInputArea");
  const aiChatInput = document.getElementById("aiChatInput");
  const aiChatMessages = document.getElementById("aiChatMessages");

  if (aiChatBtn && aiChatWindow) {
    const toggleChat = () => {
      const isActive = aiChatWindow.classList.contains("active");
      if (isActive) {
        aiChatWindow.classList.remove("active");
        aiChatWindow.setAttribute("aria-hidden", "true");
      } else {
        aiChatWindow.classList.add("active");
        aiChatWindow.setAttribute("aria-hidden", "false");
        setTimeout(() => aiChatInput.focus(), 300);
      }
    };

    aiChatBtn.addEventListener("click", toggleChat);
    aiChatClose.addEventListener("click", toggleChat);

    // Auto-open the chat window after a short delay
    setTimeout(() => {
      if (!aiChatWindow.classList.contains("active")) {
        toggleChat();
      }
    }, 2000);

    const addMessage = (text, isUser = false) => {
      const msgDiv = document.createElement("div");
      msgDiv.className = `ai-message ${isUser ? 'user-message' : 'bot-message'}`;
      if (isUser) {
        msgDiv.textContent = text;
      } else {
        msgDiv.innerHTML = text;
      }
      aiChatMessages.appendChild(msgDiv);
      scrollToBottom();
    };

    const scrollToBottom = () => {
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    };

    const showTypingIndicator = () => {
      const typingDiv = document.createElement("div");
      typingDiv.className = "ai-message bot-message ai-typing";
      typingDiv.id = "aiTypingIndicator";
      typingDiv.innerHTML = `
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>`;
      aiChatMessages.appendChild(typingDiv);
      scrollToBottom();
    };

    const removeTypingIndicator = () => {
      const typingDiv = document.getElementById("aiTypingIndicator");
      if (typingDiv) {
        typingDiv.remove();
      }
    };

    const makeWaLink = (message) => {
      const encodedMsg = encodeURIComponent(message);
      return `<a href="https://wa.me/919909461768?text=${encodedMsg}" target="_blank" style="color:var(--primary); font-weight:700; text-decoration:underline;">WhatsApp</a>`;
    };

    const generateAIResponse = (userText) => {
      const lower = userText.toLowerCase();
      
      // Simple keyword matching logic for the mock static AI
      if (lower.includes("insurance")) {
        return "We offer comprehensive coverage options:<br><br><ul><li>🛡️ <strong>Life Insurance</strong></li><li>🏥 <strong>Health Insurance</strong></li><li>🚗 <strong>Motor Insurance</strong></li><li>💼 <strong>Business Insurance</strong></li></ul><br>Are you looking to buy a new policy or need help with a claim? You can reach us on " + makeWaLink("Hi! I am interested in your Insurance services.");
      } else if (lower.includes("rto") || lower.includes("license") || lower.includes("vehicle") || lower.includes("car") || lower.includes("bike")) {
        return "Our <strong>RTO services</strong> make paperwork simple:<br><ul><li>📝 Vehicle Registration (RC)</li><li>🪪 License Assistance & Renewals</li><li>🤝 Ownership Transfers</li></ul><br>Feel free to contact us on " + makeWaLink("Hi! I need help with RTO and licensing services.") + " for exact pricing!";
      } else if (lower.includes("price") || lower.includes("cost") || lower.includes("fee")) {
        return "Pricing depends on the specific service and paperwork required. Please use the <strong>Get a Quote</strong> button or message us on " + makeWaLink("Hi! I would like to get a pricing estimate for a service.") + " for a fast, exact estimate.";
      } else if (lower.includes("time") || lower.includes("hour") || lower.includes("open")) {
        return "Our virtual office operates during standard business hours, but you can request remote services or drop an inquiry <strong>24/7</strong>. We usually respond within an hour.";
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return "Hello there! 👋 How can I assist you with your business or digital needs today?";
      } else {
        return "Thanks for reaching out! For detailed inquiries, the fastest way is to send us a quick <strong>" + makeWaLink("Hi! I would like to know more about your services.") + " message</strong>. Can I help you explore our services?";
      }
    };

    aiChatInputArea.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = aiChatInput.value.trim();
      if (!text) return;
      
      // User message
      addMessage(text, true);
      aiChatInput.value = "";
      
      // Bot response sequence
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessage(generateAIResponse(text));
      }, 1000 + Math.random() * 800); // 1-1.8s delay to simulate thinking
    });
  }
})();
