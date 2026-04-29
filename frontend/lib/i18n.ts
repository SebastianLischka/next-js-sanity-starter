import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { SETTINGS_I18N_QUERY } from "@/sanity/queries/settings";
import { normalizeLocaleId } from "./i18n-routing";
import { DEFAULT_LOCALE } from "@/config/i18n";

type LanguageOption = {
  id?: string | null;
  title?: string | null;
};

type I18nSettingsResult = {
  supportedLanguages?: LanguageOption[] | null;
  defaultLanguage?: string | null;
} | null;

export const getI18nConfig = cache(async () => {
  const { data } = await sanityFetch({
    query: SETTINGS_I18N_QUERY,
    perspective: "published",
    stega: false,
  });

  const settings = data as I18nSettingsResult;
  const configuredLocales =
    settings?.supportedLanguages
      ?.map((entry) => normalizeLocaleId(entry?.id))
      .filter(Boolean) ?? [];

  const uniqueLocales = Array.from(
    new Set([...configuredLocales, DEFAULT_LOCALE]),
  );

  if (!uniqueLocales.includes(DEFAULT_LOCALE)) {
    uniqueLocales.unshift(DEFAULT_LOCALE);
  } else {
    uniqueLocales.sort((a, b) => {
      if (a === DEFAULT_LOCALE) return -1;
      if (b === DEFAULT_LOCALE) return 1;
      return a.localeCompare(b);
    });
  }

  const configuredDefault = normalizeLocaleId(settings?.defaultLanguage);

  return {
    locales: uniqueLocales,
    defaultLocale:
      configuredDefault === DEFAULT_LOCALE ? DEFAULT_LOCALE : DEFAULT_LOCALE,
    isI18nOn: uniqueLocales.length > 1,
    needsLocalePrefix: uniqueLocales.length > 1,
  };
});

export async function getResolvedLocale(locale?: string) {
  const config = await getI18nConfig();
  const normalized = normalizeLocaleId(locale);
  const isValidLocale = config.locales.includes(normalized);

  return {
    ...config,
    locale: isValidLocale ? normalized : config.defaultLocale,
    isValidLocale,
  };
}

export function toOpenGraphLocale(locale: string) {
  const map: Record<string, string> = {
    de: "de_DE",
    en: "en_US",
    fr: "fr_FR",
    es: "es_ES",
    it: "it_IT",
    nl: "nl_NL",
  };

  return map[locale] || map[DEFAULT_LOCALE] || "en_US";
}
