from app.sanityclient import fetch_all_pages

async def validate_batch(pages, project_id, dataset, token):
    # Fetch data ONLY for this specific project
    existing_pages = await fetch_all_pages(project_id, dataset, token)
    
    results = []
    for page in pages:
        current_slug = page.slug.get("current")
        
        # Logic to compare against other documents in the SAME project
        other_slugs = {p["slug"] for p in existing_pages if p["_id"] != page.id}
        other_titles = {p["title"] for p in existing_pages if p["_id"] != page.id}

        if current_slug in other_slugs:
            results.append({"status": "error", "reason": "Duplicate slug"})
            continue

        if page.title in other_titles:
            results.append({"status": "error", "reason": "Duplicate title"})
            continue

        seo = page.seo_description or ""
        if len(seo) < 50 or len(seo) > 160:
            results.append({"status": "error", "reason": f"SEO length ({len(seo)}) invalid"})
            continue

        results.append({"status": "success"})

    return results