"""Convert extracted WordPress data into clean JSON + image assets for the Next.js app."""
import html, json, os, re, shutil, subprocess, sys

products_json, uploads, project = sys.argv[1], sys.argv[2], sys.argv[3]
src = json.load(open(products_json))

pub = os.path.join(project, "public", "images")
for sub in ("products", "gallery", "site"):
    os.makedirs(os.path.join(pub, sub), exist_ok=True)


def copy_img(rel, dest_dir, name):
    """Copy an upload into public/, downscaling very large files. Returns public path or None."""
    path = os.path.join(uploads, rel)
    if not os.path.exists(path):
        alt = re.sub(r"-scaled(\.\w+)$", r"\1", path)
        if os.path.exists(alt):
            path = alt
        else:
            return None
    ext = os.path.splitext(path)[1].lower()
    if ext == ".jpeg":
        ext = ".jpg"
    out = os.path.join(pub, dest_dir, name + ext)
    shutil.copyfile(path, out)
    # keep the repo lean: cap the long edge at 1800px
    dims = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", out], capture_output=True, text=True).stdout
    if max(int(x) for x in re.findall(r"pixel\w+: (\d+)", dims)) > 1800:
        subprocess.run(["sips", "-Z", "1800", out], capture_output=True)
    w = h = None
    info = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", out], capture_output=True, text=True).stdout
    m1, m2 = re.search(r"pixelWidth: (\d+)", info), re.search(r"pixelHeight: (\d+)", info)
    if m1 and m2:
        w, h = int(m1.group(1)), int(m2.group(1))
    return {"src": f"/images/{dest_dir}/{name}{ext}", "width": w, "height": h}


def clean_html(s):
    s = s.replace("\r", "")
    s = re.sub(r"\s(data-[\w-]+|class|tabindex|style)=\"[^\"]*\"", "", s)
    s = re.sub(r"</?div[^>]*>", "", s)
    s = re.sub(r"<li>\s*<p>(.*?)</p>\s*</li>", r"<li>\1</li>", s, flags=re.S)
    s = re.sub(r"<br\s*/?>", "<br>", s)
    s = s.replace("&nbsp;", " ")
    s = re.sub(r"<p>\s*(<br>)?\s*</p>", "", s)
    s = re.sub(r"<p>\s*<br>", "<p>", s)
    # bare text blocks (WP autop) -> paragraphs
    blocks = re.split(r"\n{2,}", s.strip())
    out = []
    for b in blocks:
        b = b.strip()
        if not b:
            continue
        if not re.match(r"<(p|ul|ol|h\d|table|thead|tbody|tr|blockquote)", b):
            b = "<p>" + b.replace("\n", "<br>") + "</p>"
        out.append(b)
    s = "\n".join(out)
    s = re.sub(r"\n\s+", "\n", s)
    return s


def excerpt(h, n=170):
    t = re.sub(r"<[^>]+>", " ", h)
    t = html.unescape(re.sub(r"\s+", " ", t)).strip()
    if len(t) <= n:
        return t
    return t[: t.rfind(" ", 0, n)].rstrip(",.;:") + "…"


# attachments uploaded to each product (WP post_parent), in upload order
db = json.load(open(sys.argv[4]))
attached = {}
for a in db["wpfy_posts"]:
    if a["post_type"] == "attachment":
        rel = a["guid"].split("/wp-content/uploads/")[-1]
        attached.setdefault(a["post_parent"], []).append(rel)

products, missing, used_extra = [], [], set()
for p in src["products"]:
    body = clean_html(p["content"])
    img = copy_img(p["image"], "products", p["slug"]) if p["image"] else None
    candidates = [r for r in attached.get(p["id"], []) if r != p["image"]]
    if not img:
        for r in candidates:
            img = copy_img(r, "products", p["slug"])
            if img:
                used_extra.add(r); candidates.remove(r); break
    extra = []
    for i, r in enumerate(candidates):
        g = copy_img(r, "products", f"{p['slug']}-{len(extra) + 2}")
        if not g:
            continue
        used_extra.add(r)
        seen = [img] + extra
        g_bytes = open(os.path.join(project, "public", g["src"].lstrip("/")), "rb").read()
        if any(x and open(os.path.join(project, "public", x["src"].lstrip("/")), "rb").read() == g_bytes for x in seen):
            os.remove(os.path.join(project, "public", g["src"].lstrip("/")))
            continue
        extra.append(g)
    if not img:
        missing.append((p["slug"], p["image"]))
    products.append({
        "slug": p["slug"],
        "title": html.unescape(p["title"]),
        "category": p["categories"][0],
        "date": p["date"][:10],
        "excerpt": excerpt(body),
        "html": body,
        "image": img,
        "gallery": extra,
    })

products.sort(key=lambda x: x["date"], reverse=True)

# every remaining original image in the archive goes into the gallery / site folders
site_map = {
    "2024/06/large-steel-factory-warehouse.jpg": "warehouse",
    "2024/06/man-protective-gloves-cutting-metal-using-angle-grinder-making-sparks.jpg": "grinder-sparks",
    "2024/06/variety-tools-including-helmet-gloves-other-tools.jpg": "safety-flatlay",
    "2016/06/s1.jpg": "banner-tools",
    "2016/06/s2.jpg": "banner-welding",
    "2016/06/s3.jpg": "banner-workbench",
    "2016/06/bg_breadcrumb_v1.jpg": "banner-helmet",
    "2016/06/bg_breadcrumb_v1-1.jpg": "banner-flatlay",
    "2016/06/logofix.png": "logo",
    "2016/06/logo.png": "logo-alt",
    "2016/06/favicon.png": "mark",
}
site = {}
for rel, name in site_map.items():
    site[name] = copy_img(rel, "site", name)

used = {p["image"] for p in src["products"]} | set(site_map) | used_extra
gallery_names = {
    "10.jpg": "plat-bordes", "11.jpg": "pipa-stainless", "13-1.jpg": "as-drat-galvanis",
    "13.jpg": "dokumentasi-1", "15.jpg": "dokumentasi-2", "2-3.jpg": "pipa-besi-hitam",
    "2-4.jpg": "stok-pipa", "2-5.jpg": "besi-cnp-kanal", "2.jpg": "pipa-conduit",
    "3-3.jpg": "hollow-kotak", "4-4.jpg": "dinamo-gearbox", "6-2.jpg": "selang-gulungan",
    "6-3.jpg": "wire-mesh-ram", "9-1.jpg": "molen-beton", "9-2.jpg": "kawat-las-winz",
    "9.jpg": "bondek-wiremesh", "q.jpg": "dinamo-listrik",
}
gallery = []
for f in sorted(os.listdir(os.path.join(uploads, "2016/06"))):
    rel = "2016/06/" + f
    if re.search(r"-\d+x\d+\.\w+$", f) or rel in used or f not in gallery_names:
        continue
    g = copy_img(rel, "gallery", gallery_names[f])
    if g:
        gallery.append({**g, "name": gallery_names[f]})

data_dir = os.path.join(project, "src", "data")
os.makedirs(data_dir, exist_ok=True)
json.dump({"products": products}, open(os.path.join(data_dir, "products.json"), "w"), ensure_ascii=False, indent=1)
json.dump({"site": site, "gallery": gallery}, open(os.path.join(data_dir, "media.json"), "w"), ensure_ascii=False, indent=1)
print("products", len(products), "gallery", len(gallery), "site", sum(1 for v in site.values() if v))
print("missing images:", missing)
