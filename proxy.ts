import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  getLocaleFromPathname,
  localizePath,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  resolvePreferredLocale,
  stripLocaleFromPathname,
} from "@/lib/i18n/config";

function shouldBypass(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[^/]+$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const localeFromPath = getLocaleFromPathname(pathname);

  if (!localeFromPath) {
    const preferredLocale = resolvePreferredLocale(
      request.cookies.get(LOCALE_COOKIE)?.value,
      request.headers.get("accept-language")
    );

    if (preferredLocale === defaultLocale) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set(LOCALE_HEADER, defaultLocale);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      response.cookies.set(LOCALE_COOKIE, defaultLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });

      return response;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = localizePath(preferredLocale, pathname === "/" ? "/" : pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (localeFromPath === defaultLocale) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = stripLocaleFromPathname(pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = stripLocaleFromPathname(pathname);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, localeFromPath);

  const response = NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set(LOCALE_COOKIE, localeFromPath ?? defaultLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
