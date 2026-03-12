'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { ContactFormData } from '@/lib/types'

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Form submitted:', formData)
      setSubmitStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      })

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

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
                <span className="text-sm font-medium text-accent uppercase tracking-wide">Get In Touch</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-pretty">
                We'd Love to Hear From You
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Have questions about Page Forge? Want to collaborate? Drop us a line and we'll get back
                to you as soon as possible.
              </p>
            </div>
          </Container>
        </section>

        {/* Contact Form */}
        <section className="py-20 md:py-32">
          <Container>
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="font-medium text-foreground text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      placeholder="John"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="font-medium text-foreground text-sm">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-medium text-foreground text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="font-medium text-foreground text-sm">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 text-accent">
                    <p className="font-medium">Thank you!</p>
                    <p className="text-sm">We've received your message and will be in touch soon.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
                    <p className="font-medium">Oops!</p>
                    <p className="text-sm">Something went wrong. Please try again.</p>
                  </div>
                )}
              </form>
            </div>
          </Container>
        </section>

        {/* Info Cards */}
        <section className="py-20 md:py-32 bg-secondary/30">
          <Container>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-secondary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent text-xl">
                  📧
                </div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-sm text-muted-foreground">hello@pageforge.dev</p>
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-secondary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent text-xl">
                  💬
                </div>
                <h3 className="font-semibold text-foreground">Chat</h3>
                <p className="text-sm text-muted-foreground">Available during business hours</p>
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-lg border border-border bg-secondary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-accent text-xl">
                  🌍
                </div>
                <h3 className="font-semibold text-foreground">Website</h3>
                <p className="text-sm text-muted-foreground">pageforge.dev</p>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}
