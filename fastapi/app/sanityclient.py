import httpx
import os
from dotenv import load_dotenv

load_dotenv()

# Terminal Colors
RED = "\033[91m"
RESET = "\033[0m"

async def fetch_all_pages(project_id: str, dataset: str, token: str):
    """
    Fetches documents for ANY project using the provided credentials.
    """
    query = '*[_type in ["post", "page"]]{_id, title, "slug": slug.current}' 
    sanity_url = f"https://{project_id}.api.sanity.io/v2023-01-01/data/query/{dataset}?query={query}"
    headers = {"Authorization": f"Bearer {token}"}

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(sanity_url, headers=headers)
            resp.raise_for_status() 
            return resp.json().get("result", [])
        except Exception as e:
            print(f"{RED}🔌 SANITY FETCH ERROR: {e}{RESET}")
            return []

async def patch_sanity_document(doc_id: str, status_msg: str, project_id: str, dataset: str, token: str):
    """
    Updates the 'validation_status' field for ANY project.
    """
    url = f"https://{project_id}.api.sanity.io/v2023-01-01/data/mutate/{dataset}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
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