import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const FOOTER_LINKS = {
  services: [
    { label: "Website Build", href: "/services#web" },
    { label: "SEO", href: "/services#seo" },
    { label: "Automation", href: "/services#automation" },
    { label: "AI Agents", href: "/services#ai" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  products: [
    { label: "Resevia", href: "https://resevia.co.uk", external: true },
  ],
};

export function Footer() {
  return (
    <footer className="bg-white border-t border-brand-border py-20 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Tagline */}
          <div className="col-span-1">
            <Link href="/" className="font-display font-bold text-2xl tracking-tighter text-brand-black">
              EZWebOne
            </Link>
            <p className="mt-4 text-brand-gray max-w-xs">
              Websites that work as hard as you do. Simple, fast, and conversion-focused.
            </p>
          </div>

          {/* Links Grid */}
          <div>
            <h4 className="font-bold text-brand-black mb-6">Services</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-brand-gray hover:text-brand-purple transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-black mb-6">Company</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-brand-gray hover:text-brand-purple transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-black mb-6">Products</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-brand-gray hover:text-brand-purple transition-colors text-sm"
                  >
                    {link.label}
                    {link.external && <span className="text-xs">→</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-xs text-brand-gray">
            <Link href="/privacy" className="hover:text-brand-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-black transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs text-brand-gray">
            © 2026 EZWebOne. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
