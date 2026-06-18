"""One-time extract products from HTML into data/products.json."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def parse_cards(html_path: str, catalog: str) -> list:
    text = (ROOT / html_path).read_text(encoding="utf-8")
    pattern = r'<div class="product-card" data-category="([^"]+)">(.*?)</div>\s*(?=<div class="product-card"|</section>)'
    cards = re.findall(pattern, text, re.DOTALL)
    products = []
    for i, (cat, body) in enumerate(cards):
        imgs = re.findall(r'<img[^>]+src="([^"]+)"', body)
        badge = re.search(r'<span class="badge">([^<]+)</span>', body)
        h3 = re.search(r'<h3>([^<]+)</h3>', body)
        muted = re.search(r'<p class="muted">([^<]+)</p>', body)
        link = re.search(r'<a class="btn"[^>]+href="([^"]+)"', body)
        name = h3.group(1).strip() if h3 else f"Product {i + 1}"
        finish_text = muted.group(1).strip() if muted else ""
        size, finish = "", finish_text
        if "Finish:" in finish_text:
            finish = finish_text.split("Finish:", 1)[1].strip()
        elif "|" in finish_text:
            for part in finish_text.split("|"):
                p = part.strip()
                if p.lower().startswith("size:"):
                    size = p.split(":", 1)[1].strip()
                elif p.lower().startswith("finish:"):
                    finish = p.split(":", 1)[1].strip()
        elif finish_text.lower().startswith("size:"):
            size = finish_text.split(":", 1)[1].strip()

        link_url = link.group(1).strip() if link else ""
        is_360 = "varmora" in link_url or "360" in link_url.lower()

        products.append(
            {
                "id": f"{catalog}-{i + 1}",
                "name": name,
                "category": cat,
                "categoryLabel": badge.group(1).strip() if badge else cat,
                "size": size,
                "finish": finish,
                "description": finish_text,
                "images": imgs,
                "link360": link_url if is_360 else "",
                "enquireLink": link_url if not is_360 else "",
            }
        )
    return products


data = {
    "tiles": parse_cards("tiles.html", "tiles"),
    "bathware": parse_cards("bathware.html", "bathware"),
}
(ROOT / "data").mkdir(exist_ok=True)
(ROOT / "data" / "products.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
print(f"tiles: {len(data['tiles'])}, bathware: {len(data['bathware'])}")
