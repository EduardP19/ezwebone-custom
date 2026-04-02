import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";

const FOOTER_LINKS = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
  ],
  contact: [
    { label: "+44 7448 929894", href: "tel:+447448929894" },
    { label: "support@ezwebone.co.uk", href: "mailto:support@ezwebone.co.uk" },
    { label: "Hemel Hempstead, UK", href: "#" },
  ],
};

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path d="M4.98 3.5A2.48 2.48 0 0 0 2.5 5.98c0 1.36 1.1 2.47 2.48 2.47a2.48 2.48 0 1 0 0-4.95ZM3 9h4v12H3zM10 9h3.84v1.71h.05c.53-1 1.84-2.06 3.8-2.06 4.06 0 4.81 2.67 4.81 6.13V21h-4v-5.41c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21h-4z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95Zm8.95 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.36 3.36 0 0 0 12 8.65Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-dark)] text-[color:var(--color-text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex items-center">
              <BrandLogo variant="wordmark" size={58} className="h-10 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[color:var(--color-text-secondary)]">
              Websites, automations, and AI agents for businesses that want to grow.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="EZWebOne on LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white/5 text-[color:var(--color-text-secondary)] transition hover:border-[color:var(--color-primary-light)] hover:text-white"
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href="#"
                aria-label="EZWebOne on Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white/5 text-[color:var(--color-text-secondary)] transition hover:border-[color:var(--color-primary-light)] hover:text-white"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mono-label mb-6 text-xs text-[color:var(--color-text-secondary)]">Quick Links</h4>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mono-label mb-6 text-xs text-[color:var(--color-text-secondary)]">Contact</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.contact.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm leading-7 text-[color:var(--color-text-secondary)] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-[color:var(--color-border)] pt-8">
          <p className="text-xs leading-6 text-[color:var(--color-text-secondary)]">
            EZWebOne is a trading name for EMAGF LTD, registered in England and Wales. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
