import Link from 'next/link'
import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <Container className="flex flex-col items-center justify-center text-center gap-8 py-32">
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-bold">404</h1>
            <h2 className="text-3xl font-semibold">Page Not Found</h2>
            <p className="text-lg text-muted-foreground max-w-md">
              Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full bg-primary px-8 py-3 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Go Back Home
          </Link>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
