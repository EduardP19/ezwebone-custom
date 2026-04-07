"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { localizePath } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
] as const;

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  const { locale, dictionary } = useI18n();
  const homePath = localizePath(locale, "/");
  const isHome = pathname === homePath;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 48);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-[80] transition-all duration-300",
        isHome && !isScrolled && !isMenuOpen
          ? "bg-transparent py-5"
          : "border-b border-[color:var(--color-border)] bg-[rgba(10,10,15,0.8)] py-3 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-6">
          <LocalizedLink href="/" className="relative z-40 flex items-center">
            <span className="inline-flex items-center gap-3">
              <BrandLogo
                variant="mark"
                priority
                size={44}
                className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10",
                  isHome && !isScrolled ? "brightness-125 saturate-110" : "brightness-110"
                )}
              />
              <BrandLogo
                variant="wordmark"
                priority
                size={52}
                className={cn(
                  "h-9 w-auto sm:h-10",
                  isHome && !isScrolled ? "brightness-125 saturate-110" : "brightness-110"
                )}
              />
            </span>
          </LocalizedLink>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <LocalizedLink
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium uppercase tracking-[0.16em] transition-colors",
                  pathname === localizePath(locale, link.href)
                    ? "text-white"
                    : isHome && !isScrolled
                      ? "text-white/72 hover:text-white"
                      : "text-[color:var(--color-text-secondary)] hover:text-white"
                )}
              >
                {dictionary.nav.links[link.key]}
              </LocalizedLink>
            ))}
            <LanguageSwitcher />
          </div>

          <div className="hidden md:block">
            <LocalizedLink href="/contact">
              <Button size="md" className="px-6 py-3 text-sm">
                {dictionary.common.bookFreeCall}
              </Button>
            </LocalizedLink>
          </div>

          <button
            className={cn(
              "relative z-[100] p-2 md:hidden",
              isHome && !isScrolled && !isMenuOpen ? "text-white" : "text-[color:var(--color-text-primary)]"
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[90] md:hidden",
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-[rgba(6,6,10,0.82)] backdrop-blur-xl transition-opacity duration-300",
            isMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          id="mobile-navigation"
          className={cn(
            "relative flex min-h-screen flex-col bg-[rgba(10,10,15,0.98)] px-6 pb-10 pt-28 shadow-[0_0_80px_rgba(0,0,0,0.55)] transition-all duration-500 sm:px-8",
            isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          )}
        >
          <div className="space-y-6">
            {NAV_LINKS.map((link) => (
              <LocalizedLink
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-2xl font-display font-semibold tracking-tight text-white"
              >
                {dictionary.nav.links[link.key]}
              </LocalizedLink>
            ))}
          </div>

          <div className="mt-10 space-y-4">
            <p className="mono-label text-xs text-[color:var(--color-text-secondary)]">
              {dictionary.nav.mobileTagline}
            </p>
            <LanguageSwitcher compact />
            <LocalizedLink href="/contact" onClick={() => setIsMenuOpen(false)}>
              <Button size="lg" className="w-full">
                {dictionary.common.bookFreeCall}
              </Button>
            </LocalizedLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
