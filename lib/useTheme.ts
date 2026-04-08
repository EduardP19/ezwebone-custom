"use client";

import * as React from "react";

/**
 * Returns true when the active theme is dark.
 * Hydration-safe: first client render matches server, then updates after mount.
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const read = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
