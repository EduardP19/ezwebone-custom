"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { BRAND_LOGO_MARK_DARK_SRC } from "@/lib/brand";
import { useIsDark } from "@/lib/useTheme";

const FOOTER_LINKS = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
  { key: "privacy", href: "/privacy" },
  { key: "cookies", href: "/cookies" },
  { key: "terms", href: "/terms" },
] as const;

const PRIMARY_FOOTER_LINKS = FOOTER_LINKS.slice(0, 4);
const SECONDARY_FOOTER_LINKS = FOOTER_LINKS.slice(4);
const SHOW_SOCIAL_ICONS = false;

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
  const { dictionary } = useI18n();
  const isDark = useIsDark();
  const pathname = usePathname();

  const contactLinks = [
    { label: dictionary.footer.contact.phone, href: "tel:+447448929894" },
    { label: dictionary.footer.contact.email, href: "mailto:support@ezwebone.co.uk" },
    { label: dictionary.footer.contact.location, href: null },
  ];

  if (
    pathname?.startsWith("/hf") ||
    pathname?.startsWith("/ro/hf") ||
    pathname?.startsWith("/bt") ||
    pathname?.startsWith("/ro/bt")
  ) {
    return null;
  }

  return (
    <footer className={`mt-auto text-white ${isDark ? "bg-[#08080d]" : "bg-[#1C2A44]"}`}>
      <div className="h-[5px] w-full bg-[#F97316]" />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 md:px-6 md:pb-16 md:pt-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <LocalizedLink href="/" className="inline-flex items-center">
              <span className="inline-flex items-center gap-3">
                <Image
                  src={BRAND_LOGO_MARK_DARK_SRC}
                  alt="EZWebOne logo"
                  width={116}
                  height={116}
                  className="h-28 w-28"
                />
              </span>
            </LocalizedLink>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              {dictionary.footer.strapline}
            </p>

            {SHOW_SOCIAL_ICONS ? (
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#"
                  aria-label="EZWebOne on LinkedIn"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#F5F2ED]/5 text-white/70 transition hover:border-[color:var(--color-primary-light)] hover:text-white/100"
                >
                  <LinkedInIcon size={18} />
                </a>
                <a
                  href="#"
                  aria-label="EZWebOne on Instagram"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#F5F2ED]/5 text-white/70 transition hover:border-[color:var(--color-primary-light)] hover:text-white/100"
                >
                  <InstagramIcon size={18} />
                </a>
              </div>
            ) : null}
          </div>

          <div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h4 className="mono-label mb-6 text-xs text-white/70">
                  {dictionary.footer.quickLinksTitle}
                </h4>
                <ul className="space-y-4">
                  {PRIMARY_FOOTER_LINKS.map((link) => (
                    <li key={link.key}>
                      <LocalizedLink
                        href={link.href}
                        className="text-sm text-white/70 transition-colors hover:text-white/100"
                      >
                        {dictionary.footer.quickLinks[link.key]}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mono-label mb-6 text-xs text-white/70">
                  {dictionary.footer.usefulLinksTitle}
                </h4>
                <ul className="space-y-4">
                  {SECONDARY_FOOTER_LINKS.map((link) => (
                    <li key={link.key}>
                      <LocalizedLink
                        href={link.href}
                        className="text-sm text-white/70 transition-colors hover:text-white/100"
                      >
                        {dictionary.footer.quickLinks[link.key]}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mono-label mb-6 text-xs text-white/70">
              {dictionary.footer.contactTitle}
            </h4>
            <ul className="space-y-4">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a
                      href={link.href}
                      className="text-sm leading-7 text-white/70 transition-colors hover:text-white/100"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="text-sm leading-7 text-white/70">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/20 pt-8" style={{ textAlign: 'center' }}>
          <p className="text-xs leading-6 text-white/70">
            {dictionary.footer.companyStatement}
          </p>
        </div>
      </div>
    </footer>
  );
}
