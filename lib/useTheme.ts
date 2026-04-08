"use client";

import * as React from "react";

/**
 * Returns true when the active theme is dark.
 * Uses useSyncExternalStore so hydration starts from a stable server snapshot
 * and updates after mount when the real DOM theme is available.
 */
export function useIsDark(): boolean {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const observer = new MutationObserver(onStoreChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const onStorage = (event: StorageEvent) => {
      if (event.key === "theme") {
        onStoreChange();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const getSnapshot = React.useCallback(
    () => document.documentElement.getAttribute("data-theme") === "dark",
    []
  );
  const getServerSnapshot = React.useCallback(() => false, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
