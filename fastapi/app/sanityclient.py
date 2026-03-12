import httpx
import os
from dotenv import load_dotenv

load_dotenv()

# Load environment variables
SANITY_PROJECT_ID = os.getenv("SANITY_PROJECT_ID")
SANITY_DATASET = os.getenv("SANITY_DATASET")
SANITY_TOKEN = os.getenv("SANITY_API_TOKEN")

# Terminal Colors for debugging
RED = "\033[91m"
RESET = "\033[0m"

async def fetch_all_pages():
    """
    Fetches all documents of type 'post' or 'page' to check for duplicates.
    """
    # Using 'in ["post", "page"]' makes the query safer if you rename your schema
    query = '*[_type in ["post", "page"]]{_id, title, "slug": slug.current}' 
    sanity_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/{SANITY_DATASET}?query={query}"
    headers = {"Authorization": f"Bearer {SANITY_TOKEN}"}

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(sanity_url, headers=headers)
            resp.raise_for_status() # Check if the request actually worked
            return resp.json().get("result", [])
        except Exception as e:
            print(f"{RED}🔌 SANITY FETCH ERROR: {e}{RESET}")
            return []

async def patch_sanity_document(doc_id: str, status_msg: str):
    """
    Updates the 'validation_status' field in the Sanity document.
    """
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-01-01/data/mutate/{SANITY_DATASET}"
    headers = {
        "Authorization": f"Bearer {SANITY_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # We use 'setIfMissing' for validation_status to ensure it exists, 
    # then 'set' to update the message.
    payload = {
        "mutations": [
            {
                "patch": {
                    "id": doc_id,
                    "set": {"validation_status": status_msg}
                }
            }
        ]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code != 200:
                print(f"{RED}📤 PATCH FAILED: {resp.text}{RESET}")
        except Exception as e:
            print(f"{RED}📤 SANITY PATCH ERROR: {e}{RESET}")