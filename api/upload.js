import { checkAuth, uploadImage } from "./_lib/store.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!checkAuth(req)) return res.status(401).json({ error: "Unauthorized" });

  const { filename, data } = req.body || {};
  if (!filename || !data) {
    return res.status(400).json({ error: "filename and data (base64) required" });
  }

  const base64 = data.includes(",") ? data.split(",")[1] : data;
  const url = await uploadImage(base64, filename);
  return res.status(200).json({ ok: true, url });
}
