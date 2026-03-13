from fastapi import FastAPI, Request, Query, Body, HTTPException
import httpx, os, json
from dotenv import load_dotenv
from typing import Union, List, Optional
from app.models import Page
from app.validator import validate_batch
from app.sanityclient import fetch_all_pages, patch_sanity_document

load_dotenv()
app = FastAPI()

# Terminal Colors
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

SANITY_PROJECT_ID = os.getenv("SANITY_PROJECT_ID")
SANITY_DATASET = os.getenv("SANITY_DATASET")
SANITY_TOKEN = os.getenv("SANITY_API_TOKEN")
VERCEL_DEPLOY_HOOK = os.getenv("VERCEL_DEPLOY_HOOK")

# We use this to track the last processed ID to prevent the "Double Trigger"
last_processed_id = None

'''@app.post("/webhook")
async def webhook_handler(request: Request):
    global last_processed_id
    payload = await request.json()
    
    doc_id = payload.get("_id")
    current_status = payload.get("validation_status", "")

    # 1. LOOP BREAKER: If the document already has a status emoji, 
    # it means FastAPI already handled it. STOP HERE.
    if any(emoji in str(current_status) for emoji in ["✅", "❌"]):
        return {"status": "ignored", "reason": "Status already set"}

    # 2. Map to Page model
    try:
        if isinstance(payload, list):
            pages = [Page(**p) for p in payload]
        else:
            pages = [Page(**payload)]
    except Exception as e:
        return {"status": "error", "message": str(e)}

    # 3. Run Validation
    results, duplicates_found = await validate_batch(pages, SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN)

    # 4. Log Results & Patch Sanity
    for i, res in enumerate(results):
        page_id = pages[i].id
        page_title = pages[i].title if pages[i].title else "Untitled"

        if res["status"] == "error":
            msg = f"❌ {res['reason']}"
            print(f"{RED}FAILED: {page_title} -> {res['reason']}{RESET}")
            await patch_sanity_document(page_id, msg)
        else:
            # ONLY trigger if the ID is different or it hasn't been validated yet
            msg = "✅ Validated & Live"
            print(f"{GREEN}SUCCESS: {page_title} passed all checks!{RESET}")
            
            # Update Sanity Status
            await patch_sanity_document(page_id, msg)

            # 5. Tri    gger Vercel ONLY once for a successful change
            if VERCEL_DEPLOY_HOOK:
                async with httpx.AsyncClient() as client:
                    await client.post(VERCEL_DEPLOY_HOOK)
                print(f"{YELLOW}🚀 Vercel Deployment Triggered{RESET}")

    return {"results": results} '''

def get_customer_config(pid: str):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, "database.json")
    
    if not os.path.exists(db_path):
        return None

    with open(db_path, "r") as f:
        db = json.load(f)
        return db.get(pid)

@app.post("/v1/validate")
async def universal_webhook(
    pid: str = Query(..., description="The Sanity Project ID"),
    ds: str = Query("production", description="The Dataset"),
    payload: Union[dict, list] = Body(...) 
):
    # 1. AUTO-LOOKUP: Finds tokens & hooks so user doesn't have to provide them
    config = get_customer_config(pid)
    if not config:
        raise HTTPException(status_code=404, detail="Project ID not registered")
    
    token = config["token"]
    vhook = config.get("vhook") # Get vhook if it exists

    # 2. DATA PREP (Fixes the 'NameError')
    data_to_check = payload if isinstance(payload, list) else [payload]
    
    # LOOP BREAKER: Don't re-process if we already added a checkmark
    first_status = data_to_check[0].get("validation_status", "")
    if any(emoji in str(first_status) for emoji in ["✅", "❌"]):
        return {"status": "ignored", "reason": "Already processed"}

    try:
        pages = [Page(**p) for p in data_to_check] # This creates the 'pages' variable!
    except Exception as e:
        return {"status": "error", "message": f"Mapping failed: {e}"}

    # 3. VALIDATE (The logic part)
    results = await validate_batch(pages, pid, ds, token)

    # 4. PATCH RESULTS BACK TO SANITY
    for i, res in enumerate(results):
        page_id = pages[i].id
        page_title = pages[i].title or "Untitled"

        if res["status"] == "error":
            msg = f"❌ {res['reason']}"
            await patch_sanity_document(page_id, msg, pid, ds, token)
            print(f"{RED}FAILED: {page_title} -> {res['reason']}{RESET}")
        else:
            msg = "✅ Validated & Live"
            await patch_sanity_document(page_id, msg, pid, ds, token)
            print(f"{GREEN}SUCCESS: {page_title} is valid!{RESET}")

            # 5. AUTO-DEPLOY: Trigger Vercel if the customer has a hook saved
            if vhook:
                async with httpx.AsyncClient() as client:
                    await client.post(vhook)
                print(f"{YELLOW}🚀 Deploy Triggered for {config.get('name', pid)}{RESET}")

    return {"status": "success", "results": results}