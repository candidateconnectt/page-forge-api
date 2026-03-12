import Link from 'next/link'
import { Container } from '@/components/Container'

interface HeroProps {
  title: string
  subtitle: string
  description: string
  primaryCTA?: { text: string; href: string }
  secondaryCTA?: { text: string; href: string }
  image?: string
}

export function Hero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  image,
}: HeroProps) {
  return (
    <section className="relative min-h-[600px] overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-6">
            {subtitle && (
              <div className="inline-flex items-center gap-2 w-fit">
                <span className="h-1 w-1 rounded-full bg-accent" />
                <span className="text-sm font-medium text-accent uppercase tracking-wide">{subtitle}</span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-pretty">
              {title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {primaryCTA && (
                <Link
                  href={primaryCTA.href}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  {primaryCTA.text}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-8 py-3 text-foreground font-semibold hover:bg-secondary transition-colors"
                >
                  {secondaryCTA.text}
                </Link>
              )}
            </div>
          </div>

          {image && (
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-background border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl text-muted-foreground/30">✦</div>
                    <p className="text-muted-foreground mt-4">Visual showcase area</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
