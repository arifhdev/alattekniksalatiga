import json, sys, re

db, out = sys.argv[1], sys.argv[2]
d = json.load(open(db))
pm = {}
for m in d["wpfy_postmeta"]:
    pm.setdefault(m["post_id"], {})[m["meta_key"]] = m["meta_value"]
posts = {p["ID"]: p for p in d["wpfy_posts"]}
terms = {t["term_id"]: t for t in d["wpfy_terms"]}
tt = {t["term_taxonomy_id"]: t for t in d["wpfy_term_taxonomy"]}
rel = {}
for r in d["wpfy_term_relationships"]:
    rel.setdefault(r["object_id"], []).append(tt[r["term_taxonomy_id"]])

def att(aid):
    if not aid or aid not in pm:
        return None
    return pm[aid].get("_wp_attached_file")

cats = []
for t in tt.values():
    if t["taxonomy"] == "product_cat":
        tm = [m for m in d["wpfy_termmeta"] if m["term_id"] == t["term_id"]]
        thumb = next((m["meta_value"] for m in tm if m["meta_key"] == "thumbnail_id"), None)
        cats.append({"id": t["term_id"], "name": terms[t["term_id"]]["name"],
                     "slug": terms[t["term_id"]]["slug"], "parent": t["parent"],
                     "count": t["count"], "description": t["description"], "image": att(thumb)})

products = []
for p in d["wpfy_posts"]:
    if p["post_type"] != "product" or p["post_status"] != "publish":
        continue
    m = pm.get(p["ID"], {})
    tx = rel.get(p["ID"], [])
    gallery = [att(g) for g in (m.get("_product_image_gallery") or "").split(",") if g]
    products.append({
        "id": p["ID"], "slug": p["post_name"], "title": p["post_title"],
        "date": p["post_date"],
        "content": p["post_content"], "excerpt": p["post_excerpt"],
        "price": m.get("_price"), "regular": m.get("_regular_price"), "sale": m.get("_sale_price"),
        "sku": m.get("_sku"),
        "image": att(m.get("_thumbnail_id")), "gallery": [g for g in gallery if g],
        "categories": [terms[t["term_id"]]["slug"] for t in tx if t["taxonomy"] == "product_cat"],
        "tags": [terms[t["term_id"]]["name"] for t in tx if t["taxonomy"] == "product_tag"],
        "brands": [terms[t["term_id"]]["name"] for t in tx if t["taxonomy"] not in ("product_cat", "product_tag", "product_type", "product_visibility")],
    })

json.dump({"categories": cats, "products": products}, open(out, "w"), ensure_ascii=False, indent=1)
for c in cats:
    print("CAT", c)
for p in products:
    print(p["id"], p["slug"], "|", p["title"], "|", p["price"], "|", p["categories"], p["brands"], "|", p["image"], len(p["gallery"]), "| content", len(p["content"]), "excerpt", len(p["excerpt"]))
