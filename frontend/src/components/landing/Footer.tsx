import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-32">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 w-fit mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h5v2H2zM2 8h8v2H2zM2 12h6v2H2z" fill="#FF6B6B" />
                  <circle cx="12" cy="5" r="3" fill="#FF6B6B" opacity="0.4" />
                  <circle cx="12" cy="5" r="1.5" fill="#FF6B6B" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-light">
                Prepzy<span className="text-accent">AI</span>
              </span>
            </Link>

            <p className="text-muted text-base leading-relaxed max-w-sm font-body">
              The professional AI-powered mock interview platform.
              We help job seekers master their interviews through intelligent feedback
              and adaptive conversational AI.
            </p>

            <div className="flex gap-4 mt-8">
              {[
                { name: "Twitter", icon: "X" },
                { name: "LinkedIn", icon: "in" },
                { name: "GitHub", icon: "gh" }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 rounded-xl border border-border bg-white text-muted hover:text-accent hover:border-accent/30 hover:shadow-sm transition-all flex items-center justify-center text-sm font-bold"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-light font-heading font-bold text-sm mb-6 tracking-wide">
              Product
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Features", href: "/#features" },
                { name: "How it Works", href: "/#how-it-works" },
                { name: "Pricing", href: "/pricing" },
                { name: "FAQ", href: "/contact#faq" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted hover:text-accent text-sm font-medium transition-colors font-body">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-light font-heading font-bold text-sm mb-6 tracking-wide">
              Company
            </h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Blog", href: "#" },
                { name: "Changelog", href: "#" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted hover:text-accent text-sm font-medium transition-colors font-body">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted text-sm font-medium">
            © {new Date().getFullYear()} PrepzyAI. Crafted for excellence.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-muted hover:text-light text-xs font-semibold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted hover:text-light text-xs font-semibold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}