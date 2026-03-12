import Link from 'next/link'
import { Container } from '@/components/Container'

interface CTAProps {
  title: string
  description?: string
  buttonText: string
  buttonHref: string
  buttonVariant?: 'primary' | 'secondary'
}

export function CTA({
  title,
  description,
  buttonText,
  buttonHref,
  buttonVariant = 'primary',
}: CTAProps) {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-secondary to-background px-6 py-16 md:px-12 md:py-24">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-pretty">
              {title}
            </h2>

            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
                {description}
              </p>
            )}

            <Link
              href={buttonHref}
              className={`inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold transition-all ${
                buttonVariant === 'primary'
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-secondary text-foreground border border-border hover:bg-secondary/80'
              }`}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
