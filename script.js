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
  const searchToggleButtons = document.querySelectorAll(".search-toggle");

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

  const searchCatalog = [
    {
      title: "Tiles Collection",
      subtitle: "Floor, wall, vitrified, ceramic, designer, and outdoor tiles",
      keywords: "tiles floor wall vitrified ceramic designer outdoor collection 360",
      url: "tiles.html"
    },
    {
      title: "Bathware Collection",
      subtitle: "Basins, faucets, sanitary ware, showers, and accessories",
      keywords: "bathware basin basins faucet faucets shower sanitary accessories bathroom",
      url: "bathware.html"
    },
    {
      title: "Terracota Collection",
      subtitle: "Earthy terracota tile finishes and natural textures",
      keywords: "terracota terracotta clay earthy rustic tiles designs",
      url: "terracota.html"
    },
    {
      title: "Mockup Designs",
      subtitle: "Vertical mockup previews for rooms and design inspiration",
      keywords: "mockup mockups room preview design visual layout",
      url: "mockups.html"
    },
    {
      title: "Calacatta Marble Effect",
      subtitle: "Floor tile in the tiles collection",
      keywords: "calacatta marble floor tile glossy 600x600",
      url: "tiles.html"
    },
    {
      title: "Soft Stone Beige",
      subtitle: "Wall tile in the tiles collection",
      keywords: "soft stone beige wall tile satin 300x600",
      url: "tiles.html"
    },
    {
      title: "Rustic Paver Grey",
      subtitle: "Outdoor tile in the tiles collection",
      keywords: "rustic paver grey outdoor anti-skid",
      url: "tiles.html"
    },
    {
      title: "Geometric Luxe Pattern",
      subtitle: "Designer tile in the tiles collection",
      keywords: "geometric luxe designer tile matt 600x1200",
      url: "tiles.html"
    },
    {
      title: "Ivory Terra Slab",
      subtitle: "Vitrified tile in the tiles collection",
      keywords: "ivory terra slab vitrified polished 800x800",
      url: "tiles.html"
    },
    {
      title: "Classic Pearl White",
      subtitle: "Ceramic tile in the tiles collection",
      keywords: "classic pearl white ceramic gloss 300x300",
      url: "tiles.html"
    },
    {
      title: "Oval Counter Basin",
      subtitle: "Wash basin in the bathware collection",
      keywords: "oval counter basin wash basin gloss white",
      url: "bathware.html"
    },
    {
      title: "Freestanding Serenity Tub",
      subtitle: "Bathtub in the bathware collection",
      keywords: "freestanding serenity tub bathtub acrylic white",
      url: "bathware.html"
    },
    {
      title: "Rain Shower Head",
      subtitle: "Shower fitting in the bathware collection",
      keywords: "rain shower head chrome bathware",
      url: "bathware.html"
    },
    {
      title: "Tall Mixer Tap",
      subtitle: "Faucet in the bathware collection",
      keywords: "tall mixer tap brushed gold faucet",
      url: "bathware.html"
    },
    {
      title: "Wall Hung WC Set",
      subtitle: "Sanitary ware in the bathware collection",
      keywords: "wall hung wc sanitary ware toilet compact",
      url: "bathware.html"
    },
    {
      title: "Towel Rack Premium",
      subtitle: "Accessory in the bathware collection",
      keywords: "towel rack premium accessory matte black",
      url: "bathware.html"
    }
  ];

  for (let i = 1; i <= 20; i += 1) {
    searchCatalog.push({
      title: `Terracota Design ${String(i).padStart(2, "0")}`,
      subtitle: "Terracota tile design in the collection",
      keywords: `terracota terracotta design ${i} rustic earthy tile`,
      url: "terracota.html"
    });
  }

  for (let i = 1; i <= 8; i += 1) {
    searchCatalog.push({
      title: `Mockup Design ${String(i).padStart(2, "0")}`,
      subtitle: "Mockup preview in the design gallery",
      keywords: `mockup design ${i} room preview layout`,
      url: "mockups.html"
    });
  }

  if (searchToggleButtons.length > 0) {
    const searchModal = document.createElement("div");
    searchModal.className = "search-modal";
    searchModal.setAttribute("aria-hidden", "true");

    const searchDialog = document.createElement("div");
    searchDialog.className = "search-dialog";

    const searchHeader = document.createElement("div");
    searchHeader.className = "search-header";

    const searchInput = document.createElement("input");
    searchInput.className = "search-input";
    searchInput.type = "search";
    searchInput.placeholder = "Search tiles, bathware, terracota, mockups...";
    searchInput.setAttribute("aria-label", "Search products");

    const searchClose = document.createElement("button");
    searchClose.className = "search-close";
    searchClose.type = "button";
    searchClose.textContent = "Close";

    const searchResults = document.createElement("div");
    searchResults.className = "search-results";

    searchHeader.append(searchInput, searchClose);
    searchDialog.append(searchHeader, searchResults);
    searchModal.appendChild(searchDialog);
    document.body.appendChild(searchModal);

    const renderSearchResults = (query = "") => {
      const normalizedQuery = query.trim().toLowerCase();
      const matches = normalizedQuery
        ? searchCatalog.filter((item) => {
            const haystack = `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase();
            return haystack.includes(normalizedQuery);
          })
        : searchCatalog.slice(0, 8);

      searchResults.innerHTML = "";

      if (matches.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "search-empty";
        emptyState.textContent = "No matching products found.";
        searchResults.appendChild(emptyState);
        return;
      }

      matches.slice(0, 12).forEach((item) => {
        const result = document.createElement("a");
        result.className = "search-result";
        result.href = item.url;
        result.innerHTML = `<strong>${item.title}</strong><span>${item.subtitle}</span>`;
        searchResults.appendChild(result);
      });
    };

    const openSearch = () => {
      searchModal.classList.add("open");
      searchModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      renderSearchResults(searchInput.value);
      window.setTimeout(() => searchInput.focus(), 30);
    };

    const closeSearch = () => {
      searchModal.classList.remove("open");
      searchModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
    };

    searchToggleButtons.forEach((button) => {
      button.addEventListener("click", openSearch);
    });

    searchInput.addEventListener("input", () => {
      renderSearchResults(searchInput.value);
    });

    searchClose.addEventListener("click", closeSearch);
    searchModal.addEventListener("click", (event) => {
      if (event.target === searchModal) {
        closeSearch();
      }
    });

    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }

      if (event.key === "Escape" && searchModal.classList.contains("open")) {
        closeSearch();
      }
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
