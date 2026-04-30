import type { SanityClient } from "@sanity/client";
import { DEFAULT_LANGUAGE, DEFAULT_LANGUAGE_TITLE } from "./i18n-config";

export type SupportedLanguageFromSettings = { id: string; title: string };

const SUPPORTED_LANGUAGES_QUERY = `*[_type == "settings"][0]{supportedLanguages[]{_key,id,title}}`;

const API_VERSION =
  process.env.SANITY_STUDIO_API_VERSION || "2026-03-23";

export async function fetchSupportedLanguagesFromSettings(
  client: SanityClient,
): Promise<SupportedLanguageFromSettings[]> {
  const settings = await client.fetch<{
    supportedLanguages?: Array<{ id?: string; title?: string }>;
  }>(SUPPORTED_LANGUAGES_QUERY);

  const languages =
    settings?.supportedLanguages
      ?.map((locale) => ({
        id: locale.id?.trim().toLowerCase() ?? "",
        title: locale.title?.trim() ?? "",
      }))
      .filter((locale) => locale.id.length > 0 && locale.title.length > 0) ??
    [];

  if (languages.length > 0) {
    return languages;
  }

  return [{ id: DEFAULT_LANGUAGE, title: DEFAULT_LANGUAGE_TITLE }];
}

export function getStudioApiVersion(): string {
  return API_VERSION;
}
