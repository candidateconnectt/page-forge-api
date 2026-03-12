'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary hover:opacity-80 transition-opacity">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-accent text-accent-foreground font-bold">
            PF
          </span>
          Page Forge
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-foreground hover:text-accent transition-colors text-sm font-medium">
            About
          </Link>
          <Link href="/contact" className="text-foreground hover:text-accent transition-colors text-sm font-medium">
            Contact
          </Link>
          <a href="#" className="rounded-full bg-primary px-6 py-2 text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-border bg-background md:hidden">
            <div className="flex flex-col gap-4 px-4 py-4">
              <Link href="/about" className="text-foreground hover:text-accent transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-foreground hover:text-accent transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <a href="#" className="rounded-full bg-primary px-6 py-2 text-primary-foreground font-medium text-center hover:opacity-90 transition-opacity">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
