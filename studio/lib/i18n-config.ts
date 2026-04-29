function assertLocale(value: string | undefined, envName: string) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    throw new Error(`Missing environment variable: ${envName}`);
  }

  if (!/^[a-z]{2}$/.test(normalized)) {
    throw new Error(
      `${envName} must be a lowercase 2-letter locale code (for example: de).`,
    );
  }

  return normalized;
}

export const DEFAULT_LANGUAGE = assertLocale(
  process.env.SANITY_STUDIO_DEFAULT_LANGUAGE,
  "SANITY_STUDIO_DEFAULT_LANGUAGE",
);

export const DEFAULT_LANGUAGE_TITLE =
  process.env.SANITY_STUDIO_DEFAULT_LANGUAGE_TITLE?.trim() || "Deutsch";
