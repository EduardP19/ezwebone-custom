"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

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

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isHome && !isScrolled
          ? "bg-transparent py-5"
          : "border-b border-[color:var(--color-border)] bg-[rgba(10,10,15,0.8)] py-3 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="relative z-50 flex items-center">
            <BrandLogo
              variant="wordmark"
              priority
              size={52}
              className={cn(
                "h-9 w-auto sm:h-10",
                isHome && !isScrolled ? "brightness-125 saturate-110" : "brightness-110"
              )}
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium uppercase tracking-[0.16em] transition-colors",
                  pathname === link.href
                    ? "text-white"
                    : isHome && !isScrolled
                      ? "text-white/72 hover:text-white"
                      : "text-[color:var(--color-text-secondary)] hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link href="/contact">
              <Button size="md" className="px-6 py-3 text-sm">
                Book a Free Call
              </Button>
            </Link>
          </div>

          <button
            className={cn(
              "relative z-[70] p-2 md:hidden",
              isHome && !isScrolled ? "text-white" : "text-[color:var(--color-text-primary)]"
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col border-l border-[color:var(--color-border)] bg-[rgba(10,10,15,0.96)] px-8 pt-28 shadow-[0_0_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-transform duration-500 md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="space-y-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block text-2xl font-display font-semibold tracking-tight text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          <p className="mono-label text-xs text-[color:var(--color-text-secondary)]">
            Websites, Automations, AI Agents
          </p>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
            <Button size="lg" className="w-full">
              Book a Free Call
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
