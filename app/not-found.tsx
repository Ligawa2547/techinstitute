import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
          <Image src="/logo.png" alt="Ratego" width={40} height={40} className="rounded-lg" priority />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sidebar-primary">Ratego</p>
            <p className="text-[10px] text-sidebar-foreground/40 leading-tight">Learning Platform</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Search className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/apply" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <Search className="h-4 w-4" />
            Apply Now
          </Link>
        </nav>

        <div className="border-t border-sidebar-border px-4 py-4">
          <p className="text-[11px] text-sidebar-foreground/40 text-center">Page Not Found</p>
        </div>
      </aside>

      {/* MOBILE NAV */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar text-sidebar-foreground border-b border-sidebar-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Ratego" width={32} height={32} className="rounded-lg" />
          <span className="text-sm font-bold">Ratego</span>
        </div>
        <Link href="/" className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
          <Home className="h-5 w-5" />
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full md:ml-64 flex flex-1 flex-col mt-16 md:mt-0">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 flex flex-col items-center justify-center min-h-screen md:min-h-[calc(100vh-64px)]">
          <div className="text-center space-y-6 max-w-2xl">
            {/* 404 Illustration */}
            <div className="space-y-4">
              <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                404
              </div>
              <p className="text-3xl md:text-4xl font-bold text-foreground">Page Not Found</p>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                <Home className="h-4 w-4" />
                Go to Home
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>

            {/* Additional Help */}
            <div className="pt-12 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Need help?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <Link href="/apply" className="text-primary hover:underline font-medium">
                  Apply for a Course
                </Link>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="mailto:info@ratego.org" className="text-primary hover:underline font-medium">
                  Contact Support
                </a>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <a href="tel:+254734086120" className="text-primary hover:underline font-medium">
                  Call Us: +254 734 086 120
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
