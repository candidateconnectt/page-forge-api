import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { CTA } from '@/components/sections/CTA'

export const metadata = {
  title: 'About Page Forge',
  description: 'Learn about Page Forge and our mission to make building websites simple and beautiful.',
}

export default function About() {
  const team = [
    {
      name: 'Mission',
      description: 'We believe building websites should be simple, beautiful, and accessible to everyone.',
    },
    {
      name: 'Vision',
      description: 'To empower creators and businesses with modern tools that make their ideas come to life.',
    },
    {
      name: 'Values',
      description: 'Quality, simplicity, and user-first design guide everything we create.',
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-32 border-b border-border">
          <Container>
            <div className="flex flex-col gap-8 max-w-3xl">
              <div className="inline-flex items-center gap-2 w-fit">
                <span className="h-1 w-1 rounded-full bg-accent" />
                <span className="text-sm font-medium text-accent uppercase tracking-wide">About Us</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-pretty">
                Crafted for Creators
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Page Forge is a modern platform built to help creators, designers, and businesses build
                beautiful, performant websites. Our tools are designed with simplicity and elegance in mind,
                allowing you to focus on what matters most: your content.
              </p>
            </div>
          </Container>
        </section>

        {/* Core Values */}
        <section className="py-20 md:py-32">
          <Container>
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Core Values</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {team.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-4 p-8 rounded-lg border border-border bg-secondary/30"
                >
                  <h3 className="text-xl font-semibold text-accent">{item.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Story */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Our Story</h2>

              <div className="flex flex-col gap-6 text-muted-foreground leading-relaxed">
                <p>
                  Page Forge was born from a simple observation: building beautiful websites shouldn't
                  require deep technical expertise or expensive enterprise solutions. We noticed countless
                  talented creators struggling with outdated tools and complex workflows.
                </p>

                <p>
                  So we decided to build something different. A platform that combines modern design
                  principles with powerful functionality, all wrapped in an intuitive interface that
                  respects your time and creativity.
                </p>

                <p>
                  Today, Page Forge powers websites for thousands of creators, helping them share their
                  stories, showcase their work, and connect with their audiences. We're just getting
                  started.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <CTA
          title="Ready to Create?"
          description="Build your first page with Page Forge today and join our growing community of creators."
          buttonText="Get Started"
          buttonHref="/contact"
        />
      </main>

      <Footer />
    </div>
  )
}
