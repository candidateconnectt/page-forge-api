import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold bg-accent text-accent-foreground">
                PF
              </span>
              Page Forge
            </div>
            <p className="text-sm text-muted-foreground">Build beautiful multi-page sites with ease.</p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Product</h3>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guides</a>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Page Forge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
