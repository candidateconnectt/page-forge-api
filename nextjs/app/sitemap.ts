import { MetadataRoute } from 'next'
import { getAllPages } from '@/lib/dataService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pageforge.dev'
  const pages = await getAllPages()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic routes
  const dynamicRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
