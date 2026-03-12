import { Page } from './types'

// Sample data - easily replaceable with API calls or CMS integration
const pagesData: Page[] = [
  {
    id: '1',
    slug: 'red-shoes',
    title: 'Premium Red Shoes',
    description: 'Handcrafted leather shoes in striking red.',
    content: 'These premium red shoes are made from the finest Italian leather and feature a timeless design that works for any occasion.',
    image: '/images/red-shoes.jpg',
    category: 'footwear',
    featured: true,
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    slug: 'blue-shirt',
    title: 'Classic Blue Shirt',
    description: 'Comfortable cotton shirt in deep blue.',
    content: 'Our classic blue shirt is perfect for work or casual wear. Made from 100% organic cotton with a perfect fit.',
    image: '/images/blue-shirt.jpg',
    category: 'apparel',
    featured: true,
    publishedAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    slug: 'summer-collection',
    title: 'Summer Collection 2024',
    description: 'Fresh designs for the sunny season.',
    content: 'Discover our latest summer collection featuring bright colors, breathable fabrics, and modern cuts designed for warm weather.',
    image: '/images/summer.jpg',
    category: 'collection',
    featured: false,
    publishedAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
]

/**
 * Get all pages
 */
export async function getAllPages(): Promise<Page[]> {
  // TODO: Replace with actual API/CMS call
  // const response = await fetch('https://api.example.com/pages');
  // return response.json();
  return pagesData
}

/**
 * Get a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  // TODO: Replace with actual API/CMS call
  // const response = await fetch(`https://api.example.com/pages/${slug}`);
  // return response.json();
  return pagesData.find((page) => page.slug === slug) || null
}

/**
 * Get featured pages
 */
export async function getFeaturedPages(): Promise<Page[]> {
  // TODO: Replace with actual API/CMS call
  const pages = await getAllPages()
  return pages.filter((page) => page.featured)
}

/**
 * Get pages by category
 */
export async function getPagesByCategory(category: string): Promise<Page[]> {
  // TODO: Replace with actual API/CMS call
  const pages = await getAllPages()
  return pages.filter((page) => page.category === category)
}

/**
 * Search pages
 */
export async function searchPages(query: string): Promise<Page[]> {
  // TODO: Replace with actual API/CMS call
  const pages = await getAllPages()
  const lowerQuery = query.toLowerCase()
  return pages.filter(
    (page) =>
      page.title.toLowerCase().includes(lowerQuery) ||
      page.description.toLowerCase().includes(lowerQuery) ||
      page.content.toLowerCase().includes(lowerQuery)
  )
}
