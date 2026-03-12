import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DynamicPageTemplate } from '@/components/DynamicPageTemplate'
// Ensure these functions in getPageData are updated to filter by validation_status
import { getPageData, getAllSlugs, getPagesByCategory } from '@/lib/getPageData'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageData(slug)

  // If page doesn't exist or isn't validated, getPageData will return null
  if (!page) {
    return { title: 'Page Not Found' }
  }

  return {
    title: `${page.title} | Page Forge`,
    description: page.seo_description,
  }
}

export async function generateStaticParams() {
  /** * CRITICAL CHANGE: 
   * getAllSlugs() must now only return slugs where validation_status is "Validated"
   **/
  const slugs = await getAllSlugs()

  return slugs.map((slug: string) => ({
    slug,
  }))
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageData(slug)

  // This ensures that if a user tries to visit a "Failed" slug directly via URL, 
  // they get a 404 instead of a broken page.
  if (!page) {
    notFound()
  }

  let relatedPages: any[] = []

  if (page.category) {
    const categoryPages = await getPagesByCategory(page.category)

    // Filter related pages to also ensure they are validated
    relatedPages = categoryPages
      .filter((p: any) => 
        p.slug.current !== page.slug.current && 
        p.validation_status?.includes("Validated")
      )
      .slice(0, 3)
  }

  return (
    <DynamicPageTemplate
      page={page}
      relatedPages={relatedPages}
    />
  )
}