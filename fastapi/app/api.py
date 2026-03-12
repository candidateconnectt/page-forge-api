from fastapi import FastAPI, Request
import httpx, os
from dotenv import load_dotenv
from typing import Union, List
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

@app.post("/webhook")
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

            # 5. Trigger Vercel ONLY once for a successful change
            if VERCEL_DEPLOY_HOOK:
                async with httpx.AsyncClient() as client:
                    await client.post(VERCEL_DEPLOY_HOOK)
                print(f"{YELLOW}🚀 Vercel Deployment Triggered{RESET}")

    return {"results": results}