document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButtons = document.querySelectorAll(".theme-toggle");
  const THEME_STORAGE_KEY = "dreamhome-theme";

  const applyTheme = (theme) => {
    const useLight = theme === "light";
    document.body.classList.toggle("light-theme", useLight);

    themeToggleButtons.forEach((button) => {
      button.textContent = useLight ? "Dark Mode" : "Light Mode";
      button.setAttribute(
        "aria-label",
        useLight ? "Switch to dark mode" : "Switch to light mode"
      );
    });
  };

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  themeToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("light-theme")
        ? "dark"
        : "light";
      applyTheme(nextTheme);
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    });
  });

  // Update these URLs whenever you want to change hero carousel images.
  const heroCarouselImages = [
    "/Carousel/antique_ciana.png",
    "/Carousel/cascade.png",
    "/Carousel/colonial_black.png",
    "/Carousel/markino_black.png",
    "/Carousel/plaster_grey.png"
  ];

  const initHeroCarousel = () => {
    const heroCarousel = document.querySelector("#hero-carousel");
    if (!heroCarousel || heroCarouselImages.length === 0) return;

    heroCarouselImages.forEach((imageSrc, index) => {
      const img = document.createElement("img");
      img.className = `hero-slide${index === 0 ? " active" : ""}`;
      img.src = imageSrc;
      img.alt = "Premium tile showcase";
      img.loading = index === 0 ? "eager" : "lazy";
      heroCarousel.appendChild(img);
    });

    const slides = heroCarousel.querySelectorAll(".hero-slide");
    if (slides.length < 2) return;

    let activeSlideIndex = 0;
    setInterval(() => {
      slides[activeSlideIndex].classList.remove("active");
      activeSlideIndex = (activeSlideIndex + 1) % slides.length;
      slides[activeSlideIndex].classList.add("active");
    }, 3500);
  };

  initHeroCarousel();

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

  const productCardImages = document.querySelectorAll(".product-card img");
  if (productCardImages.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.setAttribute("aria-hidden", "true");

    const lightboxImg = document.createElement("img");
    lightboxImg.className = "lightbox-image";
    lightboxImg.alt = "";

    const closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close image preview");
    closeBtn.textContent = "×";

    lightbox.append(lightboxImg, closeBtn);
    document.body.appendChild(lightbox);

    const closeLightbox = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
    };

    productCardImages.forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt || "Tile image";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
      }
    });
  }

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

  const expandableCards = document.querySelectorAll(".expandable-card");
  if (expandableCards.length > 0) {
    const collapseAllCards = () => {
      expandableCards.forEach((card) => {
        card.classList.remove("is-expanded");
        card.setAttribute("aria-expanded", "false");
      });
    };

    expandableCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("a, button")) return;

        const isOpen = card.classList.contains("is-expanded");
        collapseAllCards();
        if (!isOpen) {
          card.classList.add("is-expanded");
          card.setAttribute("aria-expanded", "true");
        }
      });

      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        card.click();
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".expandable-card")) {
        collapseAllCards();
      }
    });
  }

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
