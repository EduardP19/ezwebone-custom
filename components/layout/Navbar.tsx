"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { localizePath } from "@/lib/i18n/config";
import { CALENDLY_BOOKING_URL } from "@/lib/links";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { BRAND_LOGO_MARK_LIGHT_SRC, BRAND_LOGO_MARK_DARK_SRC } from "@/lib/brand";
import { useIsDark } from "@/lib/useTheme";

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
  const isDark = useIsDark();
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
        isHome && !isScrolled && !isMenuOpen && isDark
          ? "bg-transparent py-3"
          : "border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-card)]/90 py-2 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-6">
          <LocalizedLink href="/" className="relative z-40 flex items-center">
            <span className="inline-flex items-center gap-3">
              <Image
                src={isDark ? BRAND_LOGO_MARK_DARK_SRC : BRAND_LOGO_MARK_LIGHT_SRC}
                alt="EZWebOne logo"
                width={96}
                height={96}
                priority
                className="h-24 w-24"
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
                    ? "text-[color:var(--color-text-primary)]"
                    : isHome && !isScrolled
                      ? "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                      : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                )}
              >
                {dictionary.nav.links[link.key]}
              </LocalizedLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a href={CALENDLY_BOOKING_URL} target="_blank" rel="noreferrer">
              <Button size="md" className="px-6 py-3 text-sm">
                {dictionary.common.bookFreeCall}
              </Button>
            </a>
          </div>

          <button
            className={cn(
              "relative z-[100] p-2 md:hidden",
              isHome && !isScrolled && !isMenuOpen && isDark ? "text-white" : "text-[color:var(--color-text-primary)]"
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
            "absolute inset-0 bg-[color:var(--color-bg-dark)]/80 backdrop-blur-xl transition-opacity duration-300",
            isMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          id="mobile-navigation"
          className={cn(
            "relative flex min-h-screen flex-col bg-[color:var(--color-bg-card)] px-6 pb-10 pt-28 shadow-[0_0_80px_rgba(0,0,0,0.18)] transition-all duration-500 sm:px-8",
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
            <a
              href={CALENDLY_BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button size="lg" className="w-full">
                {dictionary.common.bookFreeCall}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
