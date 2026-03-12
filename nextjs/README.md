# Page Forge

A modern, multi-page platform built with Next.js 16 featuring dynamic routing, static pages, and a premium SaaS aesthetic.

## Features

- **Dynamic Routing** - Automatically generate pages from your content using the `[slug]` route system
- **Static Pages** - Home, About, and Contact pages with reusable section components
- **Responsive Design** - Mobile-first design that works perfectly on all devices
- **TypeScript** - Full type safety with comprehensive types
- **Modern Stack** - Built with Next.js, React 19, Tailwind CSS, and shadcn/ui
- **SEO Optimized** - Automatic sitemap generation, metadata management, and performance optimization
- **Production Ready** - Security headers, performance optimization, and deployment-ready configuration

## Project Structure

```
├── app/
│   ├── [slug]/              # Dynamic page routes
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── not-found.tsx        # 404 page
│   └── sitemap.ts           # Dynamic sitemap generation
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   ├── Container.tsx        # Layout container
│   ├── DynamicPageTemplate.tsx # Dynamic page template
│   ├── sections/            # Reusable page sections
│   │   ├── Hero.tsx         # Hero section
│   │   ├── Features.tsx     # Features grid
│   │   └── CTA.tsx          # Call-to-action section
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   ├── dataService.ts       # Data fetching and CMS abstraction layer
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
│   └── robots.txt           # SEO robots configuration
├── next.config.mjs          # Next.js configuration
├── vercel.json              # Vercel deployment configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies using pnpm (recommended) or npm
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Adding Dynamic Pages

Dynamic pages are managed through the `dataService.ts` file. To add new pages:

1. **Update the sample data** in `lib/dataService.ts`:

```typescript
const pagesData: Page[] = [
  {
    id: '1',
    slug: 'your-page-slug',
    title: 'Your Page Title',
    description: 'Page description',
    content: 'Page content goes here',
    category: 'category-name',
    featured: true,
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  // Add more pages...
]
```

2. **Connect to a CMS** - The `dataService.ts` is designed to be easily connected to a CMS. Replace the sample data with API calls to:
   - Sanity
   - Contentful
   - Strapi
   - Notion
   - Or any other CMS

Example CMS integration:

```typescript
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const response = await fetch(`https://api.example.com/pages/${slug}`)
  return response.json()
}
```

## Customization

### Design System

The design system uses semantic design tokens defined in `app/globals.css`. Customize colors by editing the CSS custom properties:

```css
:root {
  --background: oklch(0.08 0 0);
  --foreground: oklch(0.98 0 0);
  --accent: oklch(0.65 0.15 142);
  /* ... more tokens */
}
```

### Adding New Pages

Create a new folder in `app/` with a `page.tsx` file. Example:

```typescript
// app/services/page.tsx
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Services() {
  return (
    <div>
      <Header />
      <main>{/* Your content */}</main>
      <Footer />
    </div>
  )
}
```

### Reusable Sections

Use the included section components to build consistent layouts:

```typescript
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { CTA } from '@/components/sections/CTA'

export default function MyPage() {
  return (
    <>
      <Hero title="Welcome" description="..." />
      <Features title="Our Features" features={[...]} />
      <CTA title="Get Started" buttonText="Go" buttonHref="/contact" />
    </>
  )
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel automatically detects Next.js and configures the build
4. Deploy with a single click

### Environment Variables

Set the following environment variable in your deployment platform:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Performance

This project is optimized for performance:

- **Static Generation** - Pages are statically generated at build time when possible
- **Incremental Static Regeneration** - Dynamic content can be refreshed on-demand
- **Image Optimization** - Automatic image optimization (configured for Vercel)
- **CSS Optimization** - Tailwind CSS purges unused styles
- **Compression** - Automatic gzip compression

## SEO

The project includes comprehensive SEO optimization:

- Dynamic sitemap generation (`app/sitemap.ts`)
- Robots.txt configuration (`public/robots.txt`)
- Metadata management with next/head
- Open Graph and Twitter card support
- Structured data ready

## Type Safety

The project uses TypeScript for full type safety. Key types:

```typescript
interface Page {
  id: string
  slug: string
  title: string
  description: string
  content: string
  image?: string
  category?: string
  featured?: boolean
  publishedAt: string
  updatedAt: string
}
```

## Development

### Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Code Quality

- Uses TypeScript for type safety
- Follows Next.js best practices
- Responsive design with Tailwind CSS
- Accessibility-first components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.

## Roadmap

- [ ] Multi-language support
- [ ] Search functionality
- [ ] Comment system
- [ ] Newsletter integration
- [ ] Analytics integration
- [ ] Dark mode toggle (design tokens ready)
- [ ] Advanced caching strategies
- [ ] CDN optimization
