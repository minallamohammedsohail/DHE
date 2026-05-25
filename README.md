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

### Option 3: Vercel

1. Import this folder/repository into [Vercel](https://vercel.com/new).
2. Click deploy with default settings.

## SEO & Domain

Live site: **https://dreamhomeenterprises.in**

- `seo-config.js` — `siteUrl` and business data (update here if domain changes)
- `seo.js` — meta tags, Open Graph, JSON-LD
- `sitemap.xml` / `robots.txt` — submit sitemap in [Google Search Console](https://search.google.com/search-console)

Point your domain DNS to your host (Netlify/Vercel/GitHub Pages), enable HTTPS, and redirect `www` → non-www (or the reverse) so only one canonical URL is used.

## Notes

- No backend is needed.
- Works as a static site on any host.
- Replace placeholder phone/email/WhatsApp details before going live.
