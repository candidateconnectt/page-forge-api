import { Container } from '@/components/Container'
import { FeatureItem } from '@/lib/types'

interface FeaturesProps {
  title: string
  description?: string
  features: FeatureItem[]
  columns?: 2 | 3 | 4
}

export function Features({
  title,
  description,
  features,
  columns = 3,
}: FeaturesProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }

  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="flex flex-col gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>

        <div className={`grid gap-8 sm:grid-cols-2 ${gridCols[columns]}`}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group flex flex-col gap-3 p-6 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors hover:border-accent/50"
            >
              <div className="flex items-start gap-4">
                {feature.icon && (
                  <div className="mt-1 flex-shrink-0 h-6 w-6 rounded bg-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <span className="text-sm font-bold">{feature.icon}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
