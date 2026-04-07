# Page Forge

A full-stack, CMS-driven page generation and validation system. Content is authored in Sanity, validated by a FastAPI backend, and rendered as dynamic public pages through a Next.js frontend. Only content that passes validation is published and accessible to users.

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend (FastAPI)](#backend-fastapi)
  - [Frontend (Next.js)](#frontend-nextjs)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Sanity Schema](#sanity-schema)
- [Data Seeding](#data-seeding)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Overview

page-forge-api is a monorepo consisting of two decoupled services:

- A **FastAPI (Python)** backend that acts as a validation gateway. When a page document is created or updated in Sanity, the backend checks it for duplicate slugs, duplicate titles, and valid SEO description length. It then patches the `validation_status` field on the document and optionally triggers a Vercel deployment.
- A **Next.js (TypeScript)** frontend that reads only validated pages from Sanity and renders them using dynamic routing and composable section components.

Sanity serves as the shared data layer between the two services.

---

## End-to-End Flow
```
Google Drive (CSV Upload)
        ↓
n8n Workflow (Automation)
        ↓
Sanity CMS (Content Creation)
        ↓
FastAPI (Validation Layer)
        ↓
Vercel Deploy Hook (Optional)
        ↓
Next.js Frontend (Only Valid Pages Rendered)
```

## Automation with n8n

1. Watches a Google Drive folder
2. Detects new CSV/JSON uploads
3. Extracts structured data
4. Sends it to Sanity CMS
5. (Then backend validation flow takes over)

## How It Works

1. Content is created or updated in the embedded Sanity Studio at `/studio`.
2. A webhook or direct `POST` request is sent to `/v1/validate` on the FastAPI backend, carrying the page payload and a `pid` (Sanity Project ID) query parameter.
3. The backend looks up project credentials from `database.json`, fetches all existing pages from Sanity for that project, and runs three checks: duplicate slug, duplicate title, and SEO description character length (50–160 characters).
4. The validation result is patched back onto the document's `validation_status` field in Sanity.
5. If validation passes and a Vercel deploy hook is configured for the project, a redeployment is triggered automatically.
6. The Next.js frontend queries only pages where `validation_status` begins with `Validated`, so unreviewed or failed content is never rendered publicly.

---

## Architecture

```
page-forge-api/
├── fastapi/
│   ├── app/
│   │   ├── api.py            # FastAPI application and route definitions
│   │   ├── models.py         # Pydantic Page model
│   │   ├── sanityclient.py   # Sanity fetch and patch helpers
│   │   └── validator.py      # Validation logic (slug, title, SEO)
│   ├── database.json         # Per-project credential store
│   └── requirements.txt      # Python dependencies
├── nextjs/
│   ├── app/                  # Next.js App Router pages
│   │   ├── [slug]/page.tsx   # Dynamic page renderer
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── sections/         # Hero, Features, CTA section components
│   │   ├── ui/               # shadcn/ui component library
│   │   ├── Container.tsx
│   │   ├── DynamicPageTemplate.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── dataService.ts    # Stub data service (local mock, not Sanity-backed)
│   │   ├── getPageData.ts    # Sanity-backed data fetchers (validated pages only)
│   │   ├── sanityClient.ts   # Sanity client configuration
│   │   ├── types.ts          # Shared TypeScript interfaces
│   │   └── utils.ts          # Tailwind class merge utility
│   ├── sanity/               # Sanity schema types and client configuration
│   ├── scripts/              # Dataset seeding scripts
│   ├── next.config.mjs
│   ├── vercel.json
│   └── package.json
├── sample-data.json          # Example input payloads for the validation API
├── input-data.json
└── .gitignore
```

---

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- pnpm (preferred, per `vercel.json`) or npm
- A Sanity account with a project and dataset configured
- A Vercel account (optional, for automated deployment)

---

## Getting Started

### Backend (FastAPI)

```bash
cd fastapi

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Create a .env file in fastapi/ with the variables listed in the Environment Variables section

# Start the development server
python -m uvicorn app.api:app --reload
```

The API will be available at `http://localhost:8000`. Auto-generated interactive documentation is at `http://localhost:8000/docs`.

To expose the local server for incoming Sanity webhook calls, use a tunneling tool such as ngrok:

```bash
ngrok http 8000
```

### Frontend (Next.js)

```bash
cd nextjs

# Install dependencies
pnpm install

# Configure environment variables
# Create a .env.local file in nextjs/ with the variables listed in the Environment Variables section

# Start the development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`. The embedded Sanity Studio is accessible at `http://localhost:3000/studio`.

To seed the Sanity dataset with sample page documents for development:

```bash
pnpm tsx scripts/seedPages.ts
```

---

## Environment Variables

**`fastapi/.env`**

| Variable | Description |
|---|---|
| `SANITY_PROJECT_ID` | Your Sanity project ID |
| `SANITY_DATASET` | The target dataset (e.g. `production`) |
| `SANITY_API_TOKEN` | A Sanity API token with read and write permissions |
| `VERCEL_DEPLOY_HOOK` | Optional Vercel deploy hook URL for automatic redeployment |

**`nextjs/.env.local`**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | The target dataset |
| `SANITY_API_TOKEN` | A Sanity API token (used server-side only) |
| `NEXT_PUBLIC_SITE_URL` | The production URL, used for sitemap generation |

---

## API Reference

### `POST /v1/validate`

Validates one or more page documents and patches the result back to the corresponding Sanity document.

**Query Parameters**

| Parameter | Required | Default | Description |
|---|---|---|---|
| `pid` | Yes | — | Sanity Project ID, used to look up stored credentials |
| `ds` | No | `production` | Target dataset name |

**Request Body**

A single page object or an array of page objects:

```json
{
  "_id": "document-id",
  "_type": "page",
  "title": "Page Title",
  "slug": { "current": "page-title" },
  "seo_description": "A description between 50 and 160 characters in length.",
  "category": "outerwear",
  "image_url": "https://cdn.sanity.io/...",
  "body": "Page body content."
}
```

**Validation Rules**

| Rule | Condition |
|---|---|
| Unique slug | `slug.current` must not already exist on another document in the project |
| Unique title | `title` must not already exist on another document in the project |
| SEO description length | `seo_description` must be between 50 and 160 characters |

**Success Response**

```json
{
  "status": "success",
  "results": [{ "status": "success" }]
}
```

**Failure Response**

```json
{
  "status": "success",
  "results": [{ "status": "error", "reason": "Duplicate slug" }]
}
```

Full interactive documentation is available at `http://localhost:8000/docs` when the server is running.

---

## Sanity Schema

The `page` document type is defined in `nextjs/sanity/schemaTypes/pageType.ts`:

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Required; must be unique per project |
| `slug` | `slug` | Auto-generated from title; must be unique per project |
| `category` | `string` | Used for related page grouping on the frontend |
| `image_url` | `url` | External image URL (e.g. Unsplash or a CDN) |
| `body` | `text` | Main page content body |
| `seo_description` | `string` | Must be 50–160 characters to pass validation |
| `validation_status` | — | Managed by FastAPI; not defined in schema but patched onto documents |

---

## Data Seeding

The `nextjs/scripts/seedPages.ts` script populates your Sanity dataset with sample page documents. Page definitions live in `nextjs/scripts/pageData.ts`. The script uses `createOrReplace` and is safe to run multiple times.

```bash
cd nextjs
pnpm tsx scripts/seedPages.ts
```

After seeding, pages must be sent through `/v1/validate` to receive a `validation_status` before they appear on the frontend.

---

## Deployment

### Frontend (Vercel)

The `nextjs/vercel.json` file is pre-configured for Vercel with security headers, build settings, and function configuration. Connect the repository to a Vercel project and set the environment variables in the Vercel dashboard. Deployments can be triggered automatically by the FastAPI backend upon successful page validation.

### Backend

The FastAPI backend can be deployed to any host that supports Python and uvicorn (Railway, Render, Fly.io, and similar platforms). Ensure credentials in `database.json` are managed via environment variables at runtime rather than stored in the file directly in a production environment.

---

## Known Limitations

The following issues are present in the current codebase and should be resolved before deploying to production or sharing the repository publicly.

**Exposed API token**: `fastapi/database.json` contains a live Sanity API token committed in plaintext. This token must be rotated immediately and removed from the repository's Git history. Credentials should be injected at runtime via environment variables.

**No API authentication**: The `/v1/validate` endpoint accepts requests from any caller who supplies a valid `pid`. There is no API key, HMAC signature verification (as Sanity webhooks support), or rate limiting.

**Commented-out dead code**: The original webhook handler in `api.py` is left in a large commented block alongside the active implementation, making the codebase harder to read and the authoritative flow unclear.

**Type mismatch between `dataService.ts` and `types.ts`**: The `Page` interface used in `dataService.ts` references fields (`id`, `description`, `featured`, `publishedAt`, `updatedAt`) that do not exist on the `Page` type defined in `lib/types.ts`. The home page and sitemap both import from the stub data service, which means they are fully disconnected from the Sanity validation workflow.

**Debug log in production component**: `DynamicPageTemplate.tsx` contains `console.log("RENDER DEBUG - Image URL:", page.image_url)` which will emit to the browser console on every dynamic page render.

**Contact form is not wired up**: The contact form simulates a submission using `setTimeout` and logs to `console.log`. No form handling endpoint exists.

**`__pycache__` committed to the repository**: Python bytecode cache files are present in the repository. These should be removed from Git history and the `.gitignore` updated to exclude the directory explicitly.

**Header and Footer duplication**: `app/layout.tsx` already renders `<Header />` and `<Footer />` wrapping all pages. Several page components (`about`, `contact`, `not-found`) also render them explicitly, which causes these elements to appear twice. The per-page imports should be removed.

**No tests**: There is no test coverage for either service — no unit tests for the validation logic, no integration tests for the API endpoint, and no component or end-to-end tests for the frontend.

**No `.env.example` files**: Neither service ships a documented environment variable template. Developers must read the source code to determine what to configure.

**No Docker support**: There is no `Dockerfile` or `docker-compose.yml`. Running both services requires manually configuring two independent runtimes.

**`validation_status` not in Sanity schema**: The field is patched onto documents by the backend but is not defined in `pageType.ts`, meaning it is invisible in the Studio and cannot be managed editorially.

## Author
**Sameer Shah** — AI & Full-Stack Developer  
[Portfolio](https://sameershah-portfolio.vercel.app/) 
