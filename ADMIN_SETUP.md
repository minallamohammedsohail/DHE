# Product admin setup

Business owners manage tiles and bathware at **https://dreamhomeenterprises.in/admin.html** — no code editing.

## One-time Vercel setup

1. Open [Vercel](https://vercel.com) → your **DHE** project → **Settings** → **Environment Variables**.
2. Add these for **Production**:

| Variable | Value |
|----------|--------|
| `ADMIN_PASSWORD` | A strong password you choose (owners use this to sign in) |
| `GITHUB_TOKEN` | GitHub personal access token with **Contents: Read and write** on repo `minallamohammedsohail/DHE` |
| `GITHUB_OWNER` | `minallamohammedsohail` (optional, this is the default) |
| `GITHUB_REPO` | `DHE` (optional) |

3. **Redeploy** the project after adding variables.

### Create GitHub token

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. Repository access: **Only DHE**
3. Permissions: **Contents** → Read and write
4. Copy token into Vercel as `GITHUB_TOKEN`

## Using the admin panel

1. Go to **admin.html** on your site.
2. Sign in with `ADMIN_PASSWORD`.
3. **Add product** — name, category, size, finish, images (upload or paste paths), 360° link or enquire link.
4. **Edit** or **Delete** from the list.
5. Changes commit to GitHub; Vercel redeploys in about **1–2 minutes**. Refresh the tiles/bathware pages to see updates.

## Product data file

Catalog is stored in `data/products.json`. The public site loads it via `/api/products` or `/data/products.json`.

## Favicon

All pages use `fav.png` as the browser tab icon.
