/* =============================================
   FRIMPS DRILLING – JavaScript
   ============================================= */

(function () {
  "use strict";

  /* ---- Navbar scroll behavior ---- */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  /* ---- Mobile Hamburger ---- */
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ---- Hero Particle System ---- */
  const particleContainer = document.getElementById("particles");
  const PARTICLE_COUNT = 30;

  function createParticle() {
    const p = document.createElement("div");
    p.classList.add("particle");
    const size = Math.random() * 12 + 4;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 12 + 8;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -20px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${Math.random() * 0.4 + 0.1};
      background: rgba(96, 192, 255, ${Math.random() * 0.4 + 0.1});
    `;
    particleContainer.appendChild(p);
  }
  for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

  /* ---- Scroll Reveal ---- */
  const revealTargets = document.querySelectorAll(
    "[data-reveal], .service-card, .why-card, .step, .contact-card, .section-header, .equipment-card"
  );

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach(el => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Math.min((parseInt(entry.target.dataset.index, 10) || 0) * 80, 400);
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach((el, i) => {
      if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
      if (!el.hasAttribute("data-index")) el.setAttribute("data-index", i % 4);
      revealObserver.observe(el);
    });
  }

  /* ---- Service card stagger delays ---- */
  document.querySelectorAll(".service-card").forEach((card, i) => {
    card.setAttribute("data-index", i);
  });

  /* ---- Counter Animation ---- */
  function animateCounter(el, target, suffix = "") {
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll(".stat-num");
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const numMatch = text.match(/\d+/);
        if (numMatch) {
          const target = parseInt(numMatch[0]);
          const suffix = text.replace(/\d+/, "");
          animateCounter(el, target, suffix);
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = this.querySelector("button[type=submit]");
      const originalContent = btn.innerHTML;

      // Show success
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Request Sent!
      `;
      btn.style.background = "linear-gradient(135deg,#25D366,#128C7E)";
      btn.style.pointerEvents = "none";

      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.background = "";
        btn.style.pointerEvents = "";
        contactForm.reset();
      }, 3500);
    });
  }

  /* ---- Floating CTA visibility ---- */
  const floatingCTA = document.getElementById("floatingCTA");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      floatingCTA.style.opacity = "1";
      floatingCTA.style.pointerEvents = "all";
      floatingCTA.style.transform = "translateY(0)";
    } else {
      floatingCTA.style.opacity = "0";
      floatingCTA.style.pointerEvents = "none";
      floatingCTA.style.transform = "translateY(20px)";
    }
  });
  // Initial state
  Object.assign(floatingCTA.style, {
    opacity: "0",
    pointerEvents: "none",
    transform: "translateY(20px)",
    transition: "opacity 0.4s ease, transform 0.4s ease"
  });

  /* ---- Active nav link highlighting ---- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute("href") === `#${id}`
            ? "var(--gold)"
            : "";
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---- Smooth scroll for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ---- Typing tagline effect ---- */
  const taglines = [
    "Your Water, Our Priority",
    "Quality Services, Lasting Solutions",
    "Clean Water, Better Tomorrow",
    "Ghana Wide Service"
  ];
  let tIdx = 0, cIdx = 0, deleting = false;
  const tagEl = document.querySelector(".hero-tagline");

  if (tagEl) {
    const originalText = tagEl.textContent;
    tagEl.textContent = "";

    function typeEffect() {
      const current = taglines[tIdx];
      if (!deleting) {
        tagEl.textContent = current.slice(0, ++cIdx);
        if (cIdx === current.length) {
          deleting = true;
          setTimeout(typeEffect, 2200);
          return;
        }
      } else {
        tagEl.textContent = current.slice(0, --cIdx);
        if (cIdx === 0) {
          deleting = false;
          tIdx = (tIdx + 1) % taglines.length;
        }
      }
      setTimeout(typeEffect, deleting ? 40 : 80);
    }
    setTimeout(typeEffect, 1000);
  }

  /* ---- Equipment Category Filter ---- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const equipCards = document.querySelectorAll(".equipment-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");

      equipCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("is-hidden");
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "none";
          }, 30);
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  /* ---- Interactive Lightbox Modal ---- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxTag = document.getElementById("lightboxTag");
  const lightboxDesc = document.getElementById("lightboxDesc");
  const lightboxAction = document.getElementById("lightboxAction");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");

  function openLightbox(imgSrc, title, tag, desc) {
    if (!lightbox) return;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxTag.textContent = tag || "Equipment";
    lightboxDesc.textContent = desc || "";
    
    // Customized WhatsApp inquiry link
    const waText = encodeURIComponent(`Hello Frimps Drilling, I am inquiring about the ${title} displayed on your website.`);
    if (lightboxAction) {
      lightboxAction.href = `https://wa.me/233557590362?text=${waText}`;
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".equip-zoom-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-img");
      const title = btn.getAttribute("data-title");
      const tag = btn.getAttribute("data-tag");
      const desc = btn.getAttribute("data-desc");
      openLightbox(src, title, tag, desc);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

})();
