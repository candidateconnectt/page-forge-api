import Link from 'next/link'
import Image from 'next/image'
import { Page } from '@/lib/types'
import { Container } from '@/components/Container'

interface DynamicPageTemplateProps {
  page: Page
  relatedPages?: Page[]
}

export function DynamicPageTemplate({
  page,
  relatedPages = [],
}: DynamicPageTemplateProps) {
  console.log("RENDER DEBUG - Image URL:", page.image_url);
  return (
    <article>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 w-fit">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {page.category && (
                <span className="text-sm font-medium text-accent uppercase tracking-wide">
                  {page.category}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-pretty">
              {page.title}
            </h1>

            {page.seo_description && (
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                {page.seo_description}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Featured Image */}
      {page.image_url && (
        <section className="border-y border-border py-8">
          <Container>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
              <Image
                src={page.image_url}
                alt={page.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          </Container>
        </section>
      )}

      {/* Content */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl prose dark:prose-invert mx-auto">
            <div
              className="whitespace-pre-wrap text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: page.body?.replace(/\n/g, '<br />') || ''
              }}
            />
          </div>
        </Container>
      </section>

      {/* Related Pages */}
      {relatedPages.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary/30 border-t border-border">
          <Container>
            <h2 className="text-3xl font-bold tracking-tight mb-12">Related Pages</h2>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedPages.map((relatedPage) => (
                <Link
                  key={relatedPage.slug.current}
                  href={`/${relatedPage.slug.current}`}
                  className="group flex flex-col gap-4 p-6 rounded-lg border border-border bg-secondary hover:border-accent transition-colors"
                >
                  {relatedPage.image_url && (
                    <div className="aspect-video rounded bg-muted overflow-hidden relative">
                      <Image
                        src={relatedPage.image_url}
                        alt={relatedPage.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                      {relatedPage.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {relatedPage.seo_description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Navigation */}
      <section className="py-12 border-t border-border">
        <Container>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
          >
            <span>←</span>
            Back to Home
          </Link>
        </Container>
      </section>
    </article>
  )
}
