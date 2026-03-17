from app.sanityclient import fetch_all_pages

async def smart_validate_batch(pages, project_id, dataset, token):
    existing_pages = await fetch_all_pages(project_id, dataset, token)
    results = []

    for page in pages:
        current_slug = page.slug.get("current") if page.slug else None
        title = page.title or ""

        other_slugs = {p["slug"] for p in existing_pages if p["_id"] != page.id and p.get("slug")}
        other_titles = {p["title"] for p in existing_pages if p["_id"] != page.id and p.get("title")}

        # Broken data
        if not current_slug or not title:
            results.append({"status": "error", "reason": "Missing slug or title"})
            continue

        # Duplicate checks (skip self)
        if current_slug in other_slugs:
            results.append({"status": "error", "reason": "Duplicate slug"})
            continue

        if title in other_titles:
            results.append({"status": "error", "reason": "Duplicate title"})
            continue

        # SEO validation
        seo = page.seo_description or ""
        if len(seo) < 50 or len(seo) > 160:
            results.append({"status": "error", "reason": f"SEO length ({len(seo)}) invalid"})
            continue

        results.append({"status": "success", "reason": "Valid"})
    return results
