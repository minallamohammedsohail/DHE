(function () {
  const cfg = window.DHE_PRODUCT_CONFIG;
  if (!cfg) return;

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  function buildMutedLine(product) {
    const parts = [];
    if (product.size) parts.push(`Size: ${product.size}`);
    if (product.finish) parts.push(`Finish: ${product.finish}`);
    if (product.description && parts.length === 0) return product.description;
    return parts.join(" | ");
  }

  function buildProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-category", product.category || "all");

    const images = (product.images || []).filter(Boolean);
    if (images.length === 0) images.push("logo.png");

    images.forEach((src, idx) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = product.name || "Product";
      img.loading = idx === 0 ? "lazy" : "lazy";
      card.appendChild(img);
    });

    const body = document.createElement("div");
    body.className = "card-body";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = product.categoryLabel || product.category || "Product";

    const h3 = document.createElement("h3");
    h3.textContent = product.name || "Product";

    const muted = document.createElement("p");
    muted.className = "muted";
    muted.textContent = buildMutedLine(product);

    body.appendChild(badge);
    body.appendChild(h3);
    body.appendChild(muted);

    if (product.link360) {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = product.link360.trim();
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "View 360°";
      body.appendChild(a);
    } else if (product.enquireLink) {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = product.enquireLink.trim();
      if (product.enquireLink.includes("wa.me")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      a.textContent = "Enquire";
      body.appendChild(a);
    }

    card.appendChild(body);
    return card;
  }

  function buildFilterBar(container, categories, gridId) {
    if (!container) return;
    container.innerHTML = "";
    const allBtn = document.createElement("button");
    allBtn.className = "filter-btn active";
    allBtn.setAttribute("data-filter", "all");
    allBtn.textContent = "All";
    container.appendChild(allBtn);

    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.setAttribute("data-filter", cat.value);
      btn.textContent = cat.label;
      container.appendChild(btn);
    });

    container.setAttribute("data-target", gridId);
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const json = await res.json();
        return json.products || json;
      }
    } catch (e) {
      /* fallback */
    }
    const res = await fetch("/data/products.json");
    return res.json();
  }

  async function initCatalog(catalogKey) {
    const catalogCfg = cfg[catalogKey];
    const grid = document.getElementById(`${catalogKey}-grid`);
    const filterBar = document.querySelector(`[data-catalog-filters="${catalogKey}"]`);
    if (!grid || !catalogCfg) return;

    grid.innerHTML = "<p class=\"muted catalog-loading\">Loading products…</p>";

    try {
      const data = await loadProducts();
      const products = data[catalogKey] || [];

      if (filterBar) {
        buildFilterBar(filterBar, catalogCfg.categories, `#${catalogKey}-grid`);
      }

      grid.innerHTML = "";
      if (products.length === 0) {
        grid.innerHTML = "<p class=\"muted\">No products yet. Add items from the admin panel.</p>";
      } else {
        products.forEach((product) => grid.appendChild(buildProductCard(product)));
      }

      document.dispatchEvent(
        new CustomEvent("dhe-products-rendered", { detail: { catalog: catalogKey } })
      );
    } catch (err) {
      grid.innerHTML =
        "<p class=\"muted\">Could not load products. Please refresh or contact support.</p>";
      console.error(err);
    }
  }

  const page = document.body.getAttribute("data-catalog");
  if (page) {
    document.addEventListener("DOMContentLoaded", () => initCatalog(page));
  }
})();
