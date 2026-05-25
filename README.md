# Dream Home Enterprises Website

Static, multi-page showroom website built with plain HTML, CSS, and Vanilla JavaScript.

## Folder Structure

```text
/
|-- index.html
|-- tiles.html
|-- bathware.html
|-- about.html
|-- contact.html
|-- styles.css
|-- script.js
|-- README.md
`-- images/
    |-- hero/
    |-- tiles/
    `-- bathware/
```

## How To Update Products

- Open `tiles.html` or `bathware.html` in any text editor.
- Follow the big **HOW TO ADD A NEW PRODUCT** comment at the top.
- Duplicate one `<div class="product-card">...</div>` block and update values.
- Add your image file inside `images/tiles/` or `images/bathware/`.

## Quick Deployment (2 Steps)

### Option 1: GitHub Pages

1. Upload this folder to a GitHub repository.
2. Go to **Settings > Pages**, set source branch, and save.

### Option 2: Netlify

1. Drag and drop this folder into [Netlify Drop](https://app.netlify.com/drop).
2. Netlify instantly gives a live URL.

### Option 3: Vercel (recommended — dreamhomeenterprises.in)

1. Go to [vercel.com/new](https://vercel.com/new) and **Import** the GitHub repo `minallamohammedsohail/DHE`.
2. Framework Preset: **Other** (static site, no build step).
3. Root Directory: `.` — leave Build Command empty, Output Directory `.`
4. Deploy. Every `git push` to `main` redeploys automatically.
5. **Custom domain:** Project → **Settings** → **Domains** → add `dreamhomeenterprises.in` and `www.dreamhomeenterprises.in`.
6. At your domain registrar, add DNS records Vercel shows (usually):
   - `A` record `@` → `76.76.21.21`
   - `CNAME` record `www` → `cname.vercel-dns.com`
7. In Vercel, set **Redirect** `www` → `dreamhomeenterprises.in` (matches site canonical URLs).
8. Submit `https://dreamhomeenterprises.in/sitemap.xml` in Google Search Console.

## SEO & Domain

Live site: **https://dreamhomeenterprises.in**

- `seo-config.js` — `siteUrl` and business data (update here if domain changes)
- `seo.js` — meta tags, Open Graph, JSON-LD
- `sitemap.xml` / `robots.txt` — submit sitemap in [Google Search Console](https://search.google.com/search-console)

This project is set up for **Vercel**. Point `dreamhomeenterprises.in` DNS to Vercel and redirect `www` → apex so canonical URLs stay consistent.

## Notes

- No backend is needed.
- Works as a static site on any host.
- Replace placeholder phone/email/WhatsApp details before going live.
