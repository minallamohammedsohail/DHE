(function () {
  const SESSION_KEY = "dhe_admin_token";
  const cfg = window.DHE_PRODUCT_CONFIG;

  const loginSection = document.getElementById("admin-login");
  const dashboard = document.getElementById("admin-dashboard");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("admin-logout");
  const productList = document.getElementById("product-list");
  const catalogFilter = document.getElementById("catalog-filter");
  const statusEl = document.getElementById("admin-status");
  const dialog = document.getElementById("product-dialog");
  const productForm = document.getElementById("product-form");
  const formError = document.getElementById("form-error");

  let productsData = { tiles: [], bathware: [] };
  let adminEnabled = false;

  function token() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  function setToken(value) {
    if (value) sessionStorage.setItem(SESSION_KEY, value);
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    };
  }

  function showStatus(msg) {
    statusEl.textContent = msg;
  }

  function populateCategorySelect(catalog) {
    const select = document.getElementById("product-category");
    const categories = cfg[catalog]?.categories || [];
    select.innerHTML = categories
      .map((c) => `<option value="${c.value}">${c.label}</option>`)
      .join("");
  }

  async function loadProducts() {
    const res = await fetch("/api/products");
    const json = await res.json();
    productsData = json.products || json;
    adminEnabled = json.adminEnabled ?? false;
    return productsData;
  }

  function filteredProducts() {
    const filter = catalogFilter.value;
    const rows = [];
    if (filter === "all" || filter === "tiles") {
      productsData.tiles.forEach((p) => rows.push({ ...p, catalog: "tiles" }));
    }
    if (filter === "all" || filter === "bathware") {
      productsData.bathware.forEach((p) => rows.push({ ...p, catalog: "bathware" }));
    }
    return rows;
  }

  function renderList() {
    const rows = filteredProducts();
    if (rows.length === 0) {
      productList.innerHTML = "<p class=\"muted\">No products in this catalog yet.</p>";
      return;
    }

    productList.innerHTML = rows
      .map((p) => {
        const thumb = (p.images && p.images[0]) || "logo.png";
        const sub = [p.size, p.finish].filter(Boolean).join(" · ") || p.description || "";
        return `
          <article class="admin-product-row" data-id="${p.id}" data-catalog="${p.catalog}">
            <img src="${thumb}" alt="" onerror="this.src='logo.png'" />
            <div class="admin-product-meta">
              <h3>${p.name}</h3>
              <p class="muted"><strong>${cfg[p.catalog]?.label || p.catalog}</strong> · ${p.categoryLabel || p.category}</p>
              <p class="muted">${sub}</p>
            </div>
            <div class="admin-product-actions">
              <button type="button" data-action="edit">Edit</button>
              <button type="button" class="btn-delete" data-action="delete">Delete</button>
            </div>
          </article>`;
      })
      .join("");

    productList.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest(".admin-product-row");
        const id = row.dataset.id;
        const catalog = row.dataset.catalog;
        if (btn.dataset.action === "edit") openEdit(id, catalog);
        if (btn.dataset.action === "delete") deleteProduct(id, catalog);
      });
    });
  }

  function openDialog(title) {
    document.getElementById("dialog-title").textContent = title;
    formError.hidden = true;
    dialog.showModal();
  }

  function closeDialog() {
    dialog.close();
    productForm.reset();
    document.getElementById("image-previews").innerHTML = "";
  }

  function openAdd() {
    productForm.reset();
    document.getElementById("product-id").value = "";
    const catalog = catalogFilter.value === "bathware" ? "bathware" : "tiles";
    document.getElementById("product-catalog").value = catalog;
    populateCategorySelect(catalog);
    openDialog("Add product");
  }

  function openEdit(id, catalog) {
    const product = productsData[catalog].find((p) => p.id === id);
    if (!product) return;
    document.getElementById("product-id").value = id;
    document.getElementById("product-catalog").value = catalog;
    populateCategorySelect(catalog);
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-name").value = product.name || "";
    document.getElementById("product-size").value = product.size || "";
    document.getElementById("product-finish").value = product.finish || "";
    document.getElementById("product-description").value = product.description || "";
    document.getElementById("product-link360").value = product.link360 || "";
    document.getElementById("product-enquire").value = product.enquireLink || "";
    document.getElementById("product-images").value = (product.images || []).join("\n");
    updateImagePreviews();
    openDialog("Edit product");
  }

  function updateImagePreviews() {
    const wrap = document.getElementById("image-previews");
    const urls = document
      .getElementById("product-images")
      .value.split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    wrap.innerHTML = urls
      .map((u) => `<img src="${u}" alt="" onerror="this.style.opacity=0.3" />`)
      .join("");
  }

  async function uploadFiles(files) {
    const urls = [];
    for (const file of files) {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ filename: file.name, data: dataUrl }),
      });
      if (!res.ok) throw new Error("Image upload failed");
      const json = await res.json();
      urls.push(json.url);
    }
    return urls;
  }

  async function deleteProduct(id, catalog) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    showStatus("Deleting…");
    const res = await fetch(`/api/product?id=${encodeURIComponent(id)}&catalog=${catalog}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      showStatus("Delete failed. Check password and GitHub token.");
      return;
    }
    await loadProducts();
    renderList();
    showStatus("Product deleted. Site updates in ~1 minute after deploy.");
  }

  function showDashboard() {
    loginSection.hidden = true;
    dashboard.hidden = false;
    logoutBtn.hidden = false;
  }

  function showLogin() {
    loginSection.hidden = false;
    dashboard.hidden = true;
    logoutBtn.hidden = true;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.hidden = true;
    const password = document.getElementById("admin-password").value;
    setToken(password);
    try {
      await loadProducts();
      if (!adminEnabled) {
        setToken(null);
        loginError.textContent =
          "Admin save is not configured yet. Set ADMIN_PASSWORD and GITHUB_TOKEN in Vercel.";
        loginError.hidden = false;
        return;
      }
      const test = await fetch("/api/products", { method: "POST", headers: authHeaders(), body: JSON.stringify({}) });
      if (test.status === 401) {
        setToken(null);
        loginError.textContent = "Wrong password.";
        loginError.hidden = false;
        return;
      }
      showDashboard();
      renderList();
      showStatus("Signed in. Changes save to GitHub and deploy automatically.");
    } catch (err) {
      setToken(null);
      loginError.textContent = "Could not connect to admin API.";
      loginError.hidden = false;
    }
  });

  logoutBtn.addEventListener("click", () => {
    setToken(null);
    showLogin();
  });

  document.getElementById("btn-add-product").addEventListener("click", openAdd);
  document.getElementById("dialog-cancel").addEventListener("click", closeDialog);
  document.getElementById("product-catalog").addEventListener("change", (e) => {
    populateCategorySelect(e.target.value);
  });
  document.getElementById("product-images").addEventListener("input", updateImagePreviews);

  document.getElementById("product-images-file").addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    showStatus("Uploading images…");
    try {
      const urls = await uploadFiles(files);
      const textarea = document.getElementById("product-images");
      const existing = textarea.value.trim();
      textarea.value = existing ? `${existing}\n${urls.join("\n")}` : urls.join("\n");
      updateImagePreviews();
      showStatus("Images uploaded.");
    } catch {
      showStatus("Image upload failed.");
    }
    e.target.value = "";
  });

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formError.hidden = true;
    const id = document.getElementById("product-id").value;
    const catalog = document.getElementById("product-catalog").value;
    const categorySelect = document.getElementById("product-category");
    const categoryLabel = categorySelect.options[categorySelect.selectedIndex].text;

    const product = {
      name: document.getElementById("product-name").value.trim(),
      category: categorySelect.value,
      categoryLabel,
      size: document.getElementById("product-size").value.trim(),
      finish: document.getElementById("product-finish").value.trim(),
      description: document.getElementById("product-description").value.trim(),
      link360: document.getElementById("product-link360").value.trim(),
      enquireLink: document.getElementById("product-enquire").value.trim(),
      images: document
        .getElementById("product-images")
        .value.split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    showStatus("Saving…");
    let res;
    if (id) {
      res = await fetch(
        `/api/product?id=${encodeURIComponent(id)}&catalog=${catalog}`,
        { method: "PUT", headers: authHeaders(), body: JSON.stringify(product) }
      );
    } else {
      res = await fetch("/api/products", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ catalog, product }),
      });
    }

    if (!res.ok) {
      formError.textContent = "Save failed. Check admin password and GitHub token.";
      formError.hidden = false;
      showStatus("");
      return;
    }

    closeDialog();
    await loadProducts();
    renderList();
    showStatus("Saved! Website updates in ~1 minute after Vercel redeploys.");
  });

  catalogFilter.addEventListener("change", renderList);

  document.addEventListener("DOMContentLoaded", async () => {
    if (token()) {
      try {
        await loadProducts();
        if (adminEnabled) {
          showDashboard();
          renderList();
          return;
        }
      } catch {
        setToken(null);
      }
    }
    showLogin();
    await loadProducts();
    if (!adminEnabled) {
      loginError.textContent =
        "Read-only mode: set ADMIN_PASSWORD and GITHUB_TOKEN in Vercel to enable saving.";
      loginError.hidden = false;
    }
  });
})();
