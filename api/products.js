import { checkAuth, getProducts, saveProducts, adminConfigured } from "./_lib/store.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const products = await getProducts();
    return res.status(200).json({
      products,
      adminEnabled: adminConfigured(),
    });
  }

  if (!checkAuth(req)) {
    return res.status(401).json({ error: "Unauthorized. Check admin password." });
  }

  if (req.method === "POST") {
    const { catalog, product } = req.body || {};
    if (!catalog || !product || !["tiles", "bathware"].includes(catalog)) {
      return res.status(400).json({ error: "Invalid catalog or product" });
    }
    const data = await getProducts();
    if (!data[catalog]) data[catalog] = [];
    product.id = product.id || `${catalog}-${Date.now()}`;
    data[catalog].push(product);
    await saveProducts(data);
    return res.status(200).json({ ok: true, product });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
