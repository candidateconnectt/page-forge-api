from fastapi import FastAPI, Query, Body, HTTPException
import httpx, os, json
from dotenv import load_dotenv
from typing import Union
from app.models import Page
from app.validator import smart_validate_batch
from app.sanityclient import fetch_all_pages, patch_sanity_document, delete_sanity_document

load_dotenv()
app = FastAPI()

# Terminal Colors
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

processed_ids = set()

def get_customer_config(pid: str):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "database.json")
    if not os.path.exists(db_path):
        return None
    with open(db_path, "r") as f:
        db = json.load(f)
        return db.get(pid)

BAD_TITLES = {"nylon bomber jacket", "untitled"}

@app.post("/v1/validate")
async def universal_webhook(
    pid: str = Query(..., description="Sanity Project ID"),
    ds: str = Query("production", description="Dataset"),
    payload: Union[dict, list] = Body(...)
):
    config = get_customer_config(pid)
    if not config:
        raise HTTPException(status_code=404, detail="Project ID not registered")

    token = config["token"]
    vhook = config.get("vhook")

    data_to_check = payload if isinstance(payload, list) else [payload]

    try:
        pages = [Page(**p) for p in data_to_check]
    except Exception as e:
        return {"status": "error", "message": f"Mapping failed: {e}"}

    results = await smart_validate_batch(pages, pid, ds, token)

    for i, res in enumerate(results):
        page_id = pages[i].id
        page_title = (pages[i].title or "").strip()
        page_title_lower = page_title.lower()

        if page_id in processed_ids:
            continue
        processed_ids.add(page_id)

        # Delete bad docs
        if page_title.startswith("=") or page_title_lower in BAD_TITLES or res["status"] == "error":
            await delete_sanity_document(page_id, pid, ds, token)
            print(f"{RED}DELETED: {page_title} ({res['reason']}){RESET}")
            continue

        # Valid docs
        msg = "✅ Validated & Live"
        await patch_sanity_document(page_id, msg, pid, ds, token)
        print(f"{GREEN}SUCCESS: {page_title} is valid!{RESET}")

        if vhook:
            async with httpx.AsyncClient() as client:
                await client.post(vhook)
            print(f"{YELLOW}🚀 Deploy Triggered for {config.get('name', pid)}{RESET}")

    return {"status": "success", "results": results}




"""@app.post("/v1/delete_bad_docs")
async def delete_bad_docs(
    pid: str = Query(..., description="Sanity Project ID"),
    ds: str = Query("production", description="Dataset")
):
    config = get_customer_config(pid)
    if not config:
        raise HTTPException(status_code=404, detail="Project ID not registered")

    token = config["token"]

    # Fetch all pages
    pages = await fetch_all_pages(pid, ds, token)

    # Filter bad docs
    bad_docs = [
        p for p in pages
        if str(p["title"]).startswith("=")
        or str(p["title"]).strip().lower() in ["nylon bomber jacket", "untitled"]
    ]

    results = []
    for doc in bad_docs:
        res = await delete_sanity_document(doc["_id"], pid, ds, token)
        results.append(res)

    return {"deleted": results, "count": len(results)} """
    
