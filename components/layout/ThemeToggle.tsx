"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  trackingLabel?: string;
};

export function ThemeToggle({ className, trackingLabel = "stampuser:theme-toggle" }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const cookieMatch = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("theme="));
    const cookieTheme = cookieMatch?.slice("theme=".length) as "light" | "dark" | undefined;
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const resolved = cookieTheme ?? stored ?? "light";
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    document.cookie = `theme=${resolved}; Max-Age=31536000; Path=/; SameSite=Lax`;
    localStorage.setItem("theme", resolved);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    document.cookie = `theme=${next}; Max-Age=31536000; Path=/; SameSite=Lax`;
  };

  return (
    <button
      onClick={toggle}
      data-track-label={trackingLabel}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
        "border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]",
        "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]",
        className
      )}
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
