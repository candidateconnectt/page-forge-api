import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { CTA } from '@/components/sections/CTA'
import { getFeaturedPages } from '@/lib/dataService'

export default async function Home() {
  const featuredPages = await getFeaturedPages()

  const features = [
    {
      title: 'Lightning Fast',
      description: 'Built with Next.js and optimized for performance. Enjoy instant page loads.',
      icon: '⚡',
    },
    {
      title: 'Dynamic Routing',
      description: 'Automatically generate pages from your content. Add new pages instantly.',
      icon: '🔄',
    },
    {
      title: 'Beautiful Design',
      description: 'Premium SaaS aesthetic with modern components and smooth interactions.',
      icon: '✨',
    },
    {
      title: 'Fully Responsive',
      description: 'Perfect on mobile, tablet, and desktop. Works everywhere your users are.',
      icon: '📱',
    },
    {
      title: 'SEO Optimized',
      description: 'Built-in metadata, structured data, and performance optimization.',
      icon: '🔍',
    },
    {
      title: 'Easy to Extend',
      description: 'Clean architecture and TypeScript for easy customization and scaling.',
      icon: '🛠️',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Hero
          title="Welcome to Page Forge"
          subtitle="Build Beautiful Sites"
          description="A modern multi-page platform with dynamic routing, stunning design, and seamless navigation. Perfect for portfolios, product showcases, and more."
          primaryCTA={{ text: 'Explore Pages', href: '/about' }}
          secondaryCTA={{ text: 'Learn More', href: '#features' }}
          image="/placeholder.jpg"
        />

        <Features
          title="Powerful Features"
          description="Everything you need to create an amazing website experience."
          features={features}
          columns={3}
        />

        {/* Featured Content */}
        {featuredPages.length > 0 && (
          <section className="py-20 md:py-32 bg-secondary/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Content</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Explore our latest additions and popular items.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredPages.slice(0, 3).map((page) => (
                  <a
                    key={page.id}
                    href={`/${page.slug}`}
                    className="group flex flex-col gap-4 p-6 rounded-lg border border-border bg-secondary hover:border-accent transition-colors"
                  >
                    {page.image && (
                      <div className="aspect-video rounded bg-muted overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          [Image: {page.title}]
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">{page.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(page.publishedAt).toLocaleDateString()}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTA
          title="Ready to Get Started?"
          description="Explore all available pages and discover what Page Forge can do for you."
          buttonText="View All Pages"
          buttonHref="/about"
        />
      </main>

      <Footer />
    </div>
  )
}
