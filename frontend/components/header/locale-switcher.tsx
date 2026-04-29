"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { normalizeLocaleId, localizeHref, stripLocalePrefix } from "@/lib/i18n-routing";

type LocaleSwitcherProps = {
  locale: string;
  locales: string[];
  needsLocalePrefix: boolean;
};

export default function LocaleSwitcher({
  locale,
  locales,
  needsLocalePrefix,
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!needsLocalePrefix || locales.length <= 1) {
    return null;
  }

  const normalizedCurrent = normalizeLocaleId(locale);

  return (
    <label className="inline-flex items-center gap-2 text-xs text-foreground/70">
      <span className="sr-only">Select language</span>
      <select
        aria-label="Select language"
        className="h-8 rounded-md border bg-background px-2 text-xs"
        value={normalizedCurrent}
        onChange={(event) => {
          const nextLocale = normalizeLocaleId(event.target.value);
          const basePath = stripLocalePrefix(pathname, locales);
          const localizedPath = localizeHref({
            href: basePath,
            locale: nextLocale,
            locales,
            needsLocalePrefix,
          });
          const query = searchParams.toString();
          router.push(query ? `${localizedPath}?${query}` : localizedPath);
        }}
      >
        {locales.map((localeOption) => (
          <option key={localeOption} value={localeOption}>
            {localeOption.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
