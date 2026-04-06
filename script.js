document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  const handleHeaderShadow = () => {
    if (!header) return;
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleHeaderShadow();
  window.addEventListener("scroll", handleHeaderShadow);

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  document
    .querySelectorAll(".product-card .btn")
    .forEach((button) => button.remove());

  const filterBars = document.querySelectorAll(".filter-bar");
  filterBars.forEach((bar) => {
    const buttons = bar.querySelectorAll(".filter-btn");
    const targetSelector = bar.getAttribute("data-target");
    const grid = document.querySelector(targetSelector);

    if (!grid) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const selected = btn.getAttribute("data-filter");
        const cards = grid.querySelectorAll(".product-card");
        cards.forEach((card) => {
          const category = card.getAttribute("data-category");
          const show = selected === "all" || selected === category;
          card.style.display = show ? "block" : "none";
        });
      });
    });
  });

  const enquiryForm = document.querySelector("#enquiry-form");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.querySelector("#name")?.value.trim() || "";
      const phone = document.querySelector("#phone")?.value.trim() || "";
      const message = document.querySelector("#message")?.value.trim() || "";

      const subject = encodeURIComponent("Enquiry - Dream Home Enterprises");
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`
      );
      window.location.href = `mailto:hello@dreamhomeenterprises.in?subject=${subject}&body=${body}`;
    });
  }

  const revealElements = document.querySelectorAll(
    ".reveal, .section-title, .section-subtitle, .product-card, .highlight-item, .testimonial, .stat, .card, .contact-card, .form-wrap, .map-wrap"
  );

  if ("IntersectionObserver" in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((el) => {
      if (!el.classList.contains("reveal")) {
        el.classList.add("reveal");
      }
      observer.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }
});
