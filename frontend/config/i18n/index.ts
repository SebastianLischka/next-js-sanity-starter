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

export const DEFAULT_LOCALE = assertLocale(
  process.env.NEXT_PUBLIC_I18N_DEFAULT_LOCALE,
  "NEXT_PUBLIC_I18N_DEFAULT_LOCALE",
);
