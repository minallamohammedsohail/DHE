import { Octokit } from "@octokit/rest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const OWNER = process.env.GITHUB_OWNER || "minallamohammedsohail";
const REPO = process.env.GITHUB_REPO || "DHE";
const PATH = "data/products.json";

export function checkAuth(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return token === password;
}

export function adminConfigured() {
  return Boolean(process.env.GITHUB_TOKEN && process.env.ADMIN_PASSWORD);
}

function readLocalProducts() {
  const filePath = join(process.cwd(), "data", "products.json");
  if (!existsSync(filePath)) return { tiles: [], bathware: [] };
  return JSON.parse(readFileSync(filePath, "utf8"));
}

async function readGithubProducts() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path: PATH });
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return JSON.parse(content);
}

export async function getProducts() {
  if (process.env.GITHUB_TOKEN) {
    try {
      return await readGithubProducts();
    } catch {
      return readLocalProducts();
    }
  }
  return readLocalProducts();
}

export async function saveProducts(products) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN not configured");
  }
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  let sha;
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path: PATH });
    sha = data.sha;
  } catch {
    sha = undefined;
  }
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: PATH,
    message: "Admin: update product catalog",
    content: Buffer.from(JSON.stringify(products, null, 2)).toString("base64"),
    sha,
  });
}

export async function uploadImage(base64, filename) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN not configured");
  }
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `uploads/products/${Date.now()}-${safeName}`;
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path,
    message: `Admin: upload product image ${safeName}`,
    content: base64,
  });
  return `/${path}`;
}
