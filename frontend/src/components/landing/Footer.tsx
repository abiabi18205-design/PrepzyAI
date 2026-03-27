import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 w-fit mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h5v2H2zM2 8h8v2H2zM2 12h6v2H2z" fill="#6EE7B7" />
                  <circle cx="12" cy="5" r="3" fill="#6EE7B7" opacity="0.4" />
                  <circle cx="12" cy="5" r="1.5" fill="#6EE7B7" />
                </svg>
              </div>
              <span className="font-heading font-bold text-lg text-light">
                Mock<span className="text-accent">Pilot</span>
                <span className="text-muted font-normal text-sm ml-0.5">AI</span>
              </span>
            </Link>

            <p className="text-muted text-sm leading-relaxed max-w-xs font-body">
              AI-powered mock interview platform that prepares you for real-world
              job interviews with intelligent feedback and personalized coaching.
            </p>

            <div className="flex gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-lg border border-border bg-card text-muted hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center text-xs font-mono">X</a>
              <a href="#" className="w-9 h-9 rounded-lg border border-border bg-card text-muted hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center text-xs font-mono">in</a>
              <a href="#" className="w-9 h-9 rounded-lg border border-border bg-card text-muted hover:text-accent hover:border-accent/30 transition-all flex items-center justify-center text-xs font-mono">gh</a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-light font-heading font-semibold text-xs mb-4 tracking-widest uppercase">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted hover:text-accent text-sm transition-colors font-body">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-accent text-sm transition-colors font-body">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted hover:text-accent text-sm transition-colors font-body">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-light font-heading font-semibold text-xs mb-4 tracking-widest uppercase">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-muted hover:text-accent text-sm transition-colors font-body">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted hover:text-accent text-sm transition-colors font-body">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-accent text-sm transition-colors font-body">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted hover:text-accent text-sm transition-colors font-body">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
          <p className="text-muted text-xs font-mono">
            © {new Date().getFullYear()} MockPilotAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted hover:text-accent text-xs transition-colors font-mono">
              Privacy Policy
            </a>
            <a href="#" className="text-muted hover:text-accent text-xs transition-colors font-mono">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}