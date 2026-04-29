import { ReactNode } from "react";
import { getI18nConfig } from "@/lib/i18n";

export async function generateStaticParams() {
  const { locales, isI18nOn } = await getI18nConfig();

  if (!isI18nOn) {
    return [];
  }

  return locales.map((lang) => ({ lang }));
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return children;
}
