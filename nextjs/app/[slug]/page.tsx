import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DynamicPageTemplate } from '@/components/DynamicPageTemplate'
import { getPageData, getAllSlugs, getPagesByCategory } from '@/lib/getPageData'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageData(slug)

  // getPageData filters by validation_status; if not validated, returns null
  if (!page) {
    return { title: 'Page Not Found' }
  }

  return {
    title: `${page.title} | Page Forge`,
    description: page.seo_description,
  }
}

export async function generateStaticParams() {
  /** * getAllSlugs() is updated in lib/getPageData.ts 
   * to only return slugs where validation_status match "Validated*"
   **/
  const slugs = await getAllSlugs()

  return slugs.map((slug: string) => ({
    slug,
  }))
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageData(slug)

  // Guard: returns 404 if page is missing or failed FastAPI validation
  if (!page) {
    notFound()
  }

  let relatedPages: any[] = []

  if (page.category) {
    const categoryPages = await getPagesByCategory(page.category)

    // Secondary filter to ensure related content is also strictly validated
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