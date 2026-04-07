"use client";

import * as React from "react";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}

export function LocaleProvider({ locale, dictionary, children }: LocaleProviderProps) {
  const value = {
    locale,
    dictionary,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const value = React.useContext(LocaleContext);

  if (!value) {
    throw new Error("useI18n must be used within a LocaleProvider.");
  }

  return value;
}
