import { checkAuth, getProducts, saveProducts } from "./_lib/store.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!checkAuth(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id, catalog } = req.query;
  if (!id || !catalog || !["tiles", "bathware"].includes(catalog)) {
    return res.status(400).json({ error: "Missing id or catalog" });
  }

  const data = await getProducts();
  const list = data[catalog] || [];
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  if (req.method === "DELETE") {
    list.splice(index, 1);
    data[catalog] = list;
    await saveProducts(data);
    return res.status(200).json({ ok: true });
  }

  if (req.method === "PUT") {
    const product = req.body || {};
    product.id = id;
    list[index] = { ...list[index], ...product };
    data[catalog] = list;
    await saveProducts(data);
    return res.status(200).json({ ok: true, product: list[index] });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
