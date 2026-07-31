import re
import csv
import time
import random
import requests
from urllib.parse import urljoin
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

# =========================
# CONFIG
# =========================

BASE = "https://www.dubizzle.com.eg"

CITIES = [
    "cairo",
    "giza",
    "alexandria"
]

CATEGORY_PATH = "/en/properties/apartments-duplex-for-sale/{city}/"
PAGES_PER_CITY = 40
MAX_LISTINGS = 6000

DETAIL_PATH_RE = re.compile(r"^/en/ad/.*-ID\d+\.html$")
AR_DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩", "0123456789")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    "Accept-Language": "en-US,en;q=0.9",
}

# =========================
# HELPERS
# =========================

def normalize_digits(s: str) -> str:
    return (s or "").translate(AR_DIGITS)

def to_float(s: Optional[str]) -> Optional[float]:
    if not s:
        return None
    s = normalize_digits(s).replace(",", "").strip()
    m = re.search(r"\d+(?:\.\d+)?", s)
    return float(m.group(0)) if m else None

def extract_listing_id(url: str) -> Optional[str]:
    m = re.search(r"-ID(\d+)\.html", url)
    return m.group(1) if m else None

# =========================
# STEP 1: COLLECT DETAIL URLS
# =========================

def collect_urls_for_city(city: str) -> List[str]:
    urls = []
    seen = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(locale="en-US")

        for page_num in range(1, PAGES_PER_CITY + 1):
            url = BASE + CATEGORY_PATH.format(city=city) + f"?page={page_num}"
            print(f"Loading {city.upper()} page {page_num}...")

            page.goto(url, wait_until="domcontentloaded", timeout=90_000)
            page.wait_for_timeout(1500)

            hrefs = page.eval_on_selector_all(
                "a[href]",
                "els => els.map(e => e.getAttribute('href'))"
            )

            for h in hrefs:
                if not h:
                    continue
                if DETAIL_PATH_RE.match(h):
                    full = urljoin(BASE, h)
                    if full not in seen:
                        seen.add(full)
                        urls.append(full)

        browser.close()

    return urls

# =========================
# STEP 2: SCRAPE DETAIL PAGE
# =========================

def scrape_listing(url: str) -> Dict[str, Any]:
    r = requests.get(url, headers=HEADERS, timeout=20)
    soup = BeautifulSoup(r.text, "lxml")
    body_text = soup.get_text("\n", strip=True)

    # Price extraction
    price_egp = None
    for pat in [
        r"(?:EGP|جنيه|LE|L\.E\.)\s*([\d,]+(?:\.\d+)?)",
        r"([\d,]+(?:\.\d+)?)\s*(?:EGP|جنيه|LE|L\.E\.)",
    ]:
        matches = re.findall(pat, normalize_digits(body_text), re.IGNORECASE)
        for m in matches:
            try:
                v = float(m.replace(",", ""))
                if v >= 10_000:
                    price_egp = max(price_egp or 0, v)
            except:
                pass

    # Location
    location_span = soup.select_one('span[aria-label="Location"]')
    location_text = location_span.get_text(strip=True) if location_span else None

    # Amenities
    amenities = [a.get_text(strip=True) for a in soup.select("span.c327b807")]
    amenities = list(set([a for a in amenities if a]))

    # Extract key-value pairs via text
    pairs = {}
    lines = [l.strip() for l in body_text.split("\n") if l.strip()]

    fields = [
        "Type","Ownership","Area (m²)","Area","Bedrooms",
        "Bathrooms","Furnished","Payment Option","Completion status"
    ]

    for i, line in enumerate(lines):
        if line in fields and i + 1 < len(lines):
            pairs[line] = lines[i + 1]

    area_val = None
    for k, v in pairs.items():
        if k.lower().startswith("area"):
            area_val = v
            break

    return {
        "listing_id": extract_listing_id(url),
        "url": url,
        "price_egp": price_egp,
        "location_text": location_text,
        "type": pairs.get("Type"),
        "ownership": pairs.get("Ownership"),
        "area_sqm": to_float(area_val),
        "bedrooms": to_float(pairs.get("Bedrooms")),
        "bathrooms": to_float(pairs.get("Bathrooms")),
        "furnished": pairs.get("Furnished"),
        "payment_option": pairs.get("Payment Option"),
        "completion_status": pairs.get("Completion status"),
        "amenities": "|".join(amenities),
        "amenities_count": len(amenities),
    }

# =========================
# MAIN
# =========================

def main():
    all_urls = []

    for city in CITIES:
        city_urls = collect_urls_for_city(city)
        print(f"{city.upper()} URLs collected:", len(city_urls))
        all_urls.extend(city_urls)

    # Deduplicate globally
    all_urls = list(set(all_urls))
    print("Total unique detail URLs:", len(all_urls))

    if len(all_urls) > MAX_LISTINGS:
        all_urls = all_urls[:MAX_LISTINGS]

    results = []
    start = time.time()

    for i, url in enumerate(all_urls, 1):
        try:
            row = scrape_listing(url)
            results.append(row)
            print(f"[{i}/{len(all_urls)}] OK {row['listing_id']} price={row['price_egp']}")
            time.sleep(random.uniform(0.1, 0.25))
        except Exception as e:
            print(f"[{i}] FAIL {url} -> {e}")

    elapsed = time.time() - start
    print(f"Scraped {len(results)} listings in {elapsed:.1f}s")

    import os
    os.makedirs("data/raw", exist_ok=True)

    out_path = "data/raw/dubizzle_apartments_raw.csv"

    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)

    print("Saved to:", out_path)

if __name__ == "__main__":
    main()