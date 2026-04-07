"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n/LocaleProvider";
import { localizePath, type Locale } from "@/lib/i18n/config";

interface LocalizedLinkProps extends Omit<ComponentProps<typeof Link>, "href"> {
  href: string;
  localeOverride?: Locale | false;
}

export function LocalizedLink({
  href,
  localeOverride,
  ...props
}: LocalizedLinkProps) {
  const { locale } = useI18n();
  const nextHref = localeOverride === false ? href : localizePath(localeOverride ?? locale, href);

  return <Link href={nextHref} {...props} />;
}
