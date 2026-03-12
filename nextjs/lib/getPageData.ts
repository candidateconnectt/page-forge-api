import { client } from './sanityClient'
import { Page } from './types'

/**
 * Fetches a single page by slug ONLY if it has been validated by FastAPI.
 */
export async function getPageData(slug: string): Promise<Page | null> {
  const query = `*[_type == "page" && slug.current == $slug && validation_status match "Validated*"][0]{
    _id,
    title,
    body,
    image_url,
    seo_description,
    slug,
    category,
    validation_status
  }`
  return await client.fetch(query, { slug })
}

/**
 * Returns slugs for generateStaticParams.
 * ONLY returns pages that passed the FastAPI "Guard".
 */
export async function getAllSlugs(): Promise<string[]> {
  const query = `*[_type == "page" && validation_status match "Validated*"]{ "slug": slug.current }`
  const pages = await client.fetch(query)
  return pages.map((p: any) => p.slug)
}

/**
 * Fetches related pages within a category.
 * Filters out unvalidated pages so the "Related" section doesn't link to broken routes.
 */
export async function getPagesByCategory(category: string): Promise<Page[]> {
  const query = `*[_type == "page" && category == $category && validation_status match "Validated*"]{
    _id,
    title,
    body,
    image_url,
    seo_description,
    slug,
    category
  }`
  return await client.fetch(query, { category })
}