import Blocks from "@/components/blocks";
import { getI18nConfig, getResolvedLocale } from "@/lib/i18n";
import { stripLocalePrefix } from "@/lib/i18n-routing";
import {
  fetchSanityPageBySlug,
  fetchSanityPagesStaticParams,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { notFound, redirect } from "next/navigation";

export async function generateStaticParams() {
  const { locales, isI18nOn } = await getI18nConfig();

  if (!isI18nOn) {
    return [];
  }

  const paramsPerLocale = await Promise.all(
    locales.map(async (lang) => {
      const pages = await fetchSanityPagesStaticParams({ language: lang });
      return pages
        .filter((page) => Boolean(page.slug?.current))
        .map((page) => ({
          lang,
          slug: page.slug!.current!,
        }));
    }),
  );

  return paramsPerLocale.flat();
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await props.params;
  const { locale, locales, needsLocalePrefix, isI18nOn, isValidLocale } =
    await getResolvedLocale(lang);

  if (!isI18nOn || !isValidLocale) {
    notFound();
  }

  const page = await fetchSanityPageBySlug({ slug, language: locale });

  if (!page) {
    notFound();
  }

  return generatePageMetadata({
    page,
    slug,
    lang: locale,
    locales,
    needsLocalePrefix,
  });
}

export default async function LocalizedPage(props: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug, lang } = await props.params;
  const { locale, isI18nOn, isValidLocale, locales } = await getResolvedLocale(
    lang,
  );

  if (!isI18nOn) {
    redirect(stripLocalePrefix(`/${lang}/${slug}`, locales));
  }

  if (!isValidLocale) {
    notFound();
  }

  const page = await fetchSanityPageBySlug({ slug, language: locale });

  if (!page) {
    notFound();
  }

  return <Blocks blocks={page?.blocks ?? []} lang={locale} />;
}
