import { DEFAULT_LOCALE } from "@/config/i18n";

const NON_PREFIXABLE = /^(https?:\/\/|mailto:|tel:|#)/i;

export function normalizeLocaleId(locale?: string | null) {
  return locale?.trim().toLowerCase() || "";
}

export function localizeHref({
  href,
  locale,
  locales,
  needsLocalePrefix,
}: {
  href?: string | null;
  locale: string;
  locales: string[];
  needsLocalePrefix: boolean;
}) {
  const safeHref = href || "#";
  const normalizedLocale = normalizeLocaleId(locale) || DEFAULT_LOCALE;

  if (!needsLocalePrefix || NON_PREFIXABLE.test(safeHref)) {
    return safeHref;
  }

  if (!safeHref.startsWith("/")) {
    return safeHref;
  }

  const segments = safeHref.split("/");
  const firstSegment = normalizeLocaleId(segments[1]);

  if (locales.includes(firstSegment)) {
    return safeHref;
  }

  if (safeHref === "/") {
    return `/${normalizedLocale}`;
  }

  return `/${normalizedLocale}${safeHref}`;
}

export function stripLocalePrefix(pathname: string, locales: string[]) {
  if (!pathname.startsWith("/")) {
    return pathname;
  }

  const segments = pathname.split("/");
  const firstSegment = normalizeLocaleId(segments[1]);

  if (!locales.includes(firstSegment)) {
    return pathname;
  }

  const rest = segments.slice(2).join("/");
  return rest ? `/${rest}` : "/";
}
