(function () {
  var cfg = window.DHE_SEO_CONFIG;
  if (!cfg) return;

  var pageEl = document.getElementById("seo-page-data");
  var page = {};
  if (pageEl && pageEl.textContent) {
    try {
      page = JSON.parse(pageEl.textContent);
    } catch (e) {
      page = {};
    }
  }

  var origin = cfg.siteUrl.replace(/\/$/, "");
  var path = page.path || window.location.pathname.split("/").pop() || "index.html";
  var canonical =
    path === "index.html" ? origin + "/" : origin + "/" + path.replace(/^\//, "");
  var title = page.title || document.title || cfg.businessName;
  var description = page.description || cfg.description;
  var image = origin + "/" + (page.image || cfg.logoPath).replace(/^\//, "");

  function upsertMeta(selector, attrs) {
    var el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement(attrs.tag || "meta");
      document.head.appendChild(el);
    }
    Object.keys(attrs).forEach(function (key) {
      if (key !== "tag") el.setAttribute(key, attrs[key]);
    });
  }

  document.title = title;

  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[name="keywords"]', {
    name: "keywords",
    content: (page.keywords || cfg.keywords).join(", "),
  });
  upsertMeta('meta[name="robots"]', {
    name: "robots",
    content: "index, follow, max-image-preview:large",
  });
  upsertMeta('meta[name="geo.region"]', { name: "geo.region", content: "IN-AP" });
  upsertMeta('meta[name="geo.placename"]', {
    name: "geo.placename",
    content: cfg.locality + ", " + cfg.region,
  });
  upsertMeta('meta[name="geo.position"]', {
    name: "geo.position",
    content: cfg.latitude + ";" + cfg.longitude,
  });
  upsertMeta('meta[name="ICBM"]', {
    name: "ICBM",
    content: cfg.latitude + ", " + cfg.longitude,
  });
  upsertMeta('link[rel="canonical"]', { tag: "link", rel: "canonical", href: canonical });

  [
    ["og:type", page.ogType || "website"],
    ["og:site_name", cfg.siteName || cfg.businessName],
    ["og:title", title],
    ["og:description", description],
    ["og:url", canonical],
    ["og:image", image],
    ["og:locale", "en_IN"],
  ].forEach(function (pair) {
    upsertMeta('meta[property="' + pair[0] + '"]', {
      property: pair[0],
      content: pair[1],
    });
  });

  [
    ["twitter:card", "summary_large_image"],
    ["twitter:title", title],
    ["twitter:description", description],
    ["twitter:image", image],
  ].forEach(function (pair) {
    upsertMeta('meta[name="' + pair[0] + '"]', { name: pair[0], content: pair[1] });
  });

  var graph = [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": origin + "/#business",
      name: cfg.businessName,
      description: cfg.description,
      url: origin + "/",
      image: image,
      logo: {
        "@type": "ImageObject",
        url: origin + "/logow.png",
        width: 798,
        height: 792,
      },
      telephone: cfg.phone,
      email: cfg.email,
      priceRange: cfg.priceRange,
      address: {
        "@type": "PostalAddress",
        streetAddress: cfg.streetAddress,
        addressLocality: cfg.locality,
        addressRegion: cfg.region,
        postalCode: cfg.postalCode,
        addressCountry: cfg.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: cfg.latitude,
        longitude: cfg.longitude,
      },
      hasMap: cfg.mapsUrl,
      sameAs: [cfg.instagram, cfg.mapsUrl, origin + "/"],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "20:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "10:00",
          closes: "18:00",
        },
      ],
      areaServed: cfg.areaServed.map(function (name) {
        return { "@type": "City", name: name };
      }),
    },
    {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin + "/",
      name: cfg.siteName || cfg.businessName,
      alternateName: [cfg.businessName, "Dream Home Tiles & Bathware"],
      description: cfg.description,
      publisher: { "@id": origin + "/#business" },
      inLanguage: "en-IN",
    },
    {
      "@type": "WebPage",
      "@id": canonical + "#webpage",
      url: canonical,
      name: title,
      description: description,
      isPartOf: { "@id": origin + "/#website" },
      about: { "@id": origin + "/#business" },
      inLanguage: "en-IN",
    },
  ];

  if (page.breadcrumb) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumb.map(function (item, index) {
        var itemUrl =
          item.path === "index.html" ? origin + "/" : origin + "/" + item.path;
        return {
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: itemUrl,
        };
      }),
    });
  }

  if (page.faq && page.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: page.faq.map(function (item) {
        return {
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        };
      }),
    });
  }

  var script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  document.head.appendChild(script);
})();
