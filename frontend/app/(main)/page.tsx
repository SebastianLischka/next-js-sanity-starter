import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import MissingSanityPage from "@/components/ui/missing-sanity-page";
import { getI18nConfig } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n-routing";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/config/i18n";

export async function generateMetadata() {
  const { defaultLocale, locales, needsLocalePrefix } = await getI18nConfig();
  const page = await fetchSanityPageBySlug({
    slug: "index",
    language: DEFAULT_LOCALE,
  });

  return generatePageMetadata({
    page,
    slug: "index",
    lang: defaultLocale,
    locales,
    needsLocalePrefix,
  });
}

export default async function IndexPage() {
  const { defaultLocale, locales, needsLocalePrefix } = await getI18nConfig();

  if (needsLocalePrefix) {
    redirect(
      localizeHref({
        href: "/",
        locale: defaultLocale,
        locales,
        needsLocalePrefix,
      }),
    );
  }

  const page = await fetchSanityPageBySlug({
    slug: "index",
    language: DEFAULT_LOCALE,
  });

  if (!page) {
    return MissingSanityPage({ document: "page", slug: "index" });
  }

  return <Blocks blocks={page?.blocks ?? []} lang={DEFAULT_LOCALE} />;
}
