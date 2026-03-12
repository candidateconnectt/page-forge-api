from app.sanityclient import fetch_all_pages
from app.models import Page # Fixed: was Post

async def validate_batch(pages, project_id, dataset, token):
    existing_pages = await fetch_all_pages()
    
    results = []
    duplicates_found = False

    for page in pages:
        # Extract slug string safely
        current_slug = page.slug.get("current")
        
        # Filter existing data to avoid comparing a document against itself
        other_slugs = {p["slug"] for p in existing_pages if p["_id"] != page.id}
        other_titles = {p["title"] for p in existing_pages if p["_id"] != page.id}

        if current_slug in other_slugs:
            duplicates_found = True
            results.append({"status": "error", "reason": "Duplicate slug"})
            continue

        if page.title in other_titles:
            duplicates_found = True
            results.append({"status": "error", "reason": "Duplicate title"})
            continue

        seo = page.seo_description or ""
        if len(seo) < 50 or len(seo) > 160:
            results.append({"status": "error", "reason": f"SEO length ({len(seo)}) invalid"})
            continue

        results.append({"status": "success"})

    return results, duplicates_found