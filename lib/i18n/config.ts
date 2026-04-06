export const locales = ["en", "ro"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "ezw_locale";
export const LOCALE_HEADER = "x-ezw-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ro";
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const [, maybeLocale] = pathname.split("/");
  return isLocale(maybeLocale) ? maybeLocale : null;
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;

  const nextPath = pathname.slice(`/${locale}`.length);
  return nextPath.length > 0 ? nextPath : "/";
}

export function localizePath(locale: Locale, pathname = "/"): string {
  if (pathname.startsWith("#")) {
    return pathname;
  }

  if (/^https?:\/\//.test(pathname) || pathname.startsWith("mailto:") || pathname.startsWith("tel:")) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === defaultLocale) {
    return normalizedPath;
  }

  if (!pathname || pathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function getLocalizedUrlMap(pathname = "/") {
  return {
    en: localizePath("en", pathname),
    ro: localizePath("ro", pathname),
  };
}

export function resolvePreferredLocale(
  cookieValue: string | null | undefined,
  acceptLanguage: string | null | undefined
): Locale {
  if (isLocale(cookieValue)) {
    return cookieValue;
  }

  const normalized = acceptLanguage?.toLowerCase() ?? "";
  if (normalized.includes("ro")) {
    return "ro";
  }

  return defaultLocale;
}
