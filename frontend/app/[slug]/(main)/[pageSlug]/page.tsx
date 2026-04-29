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
    locales.map(async (localeSlug) => {
      const pages = await fetchSanityPagesStaticParams({ language: localeSlug });
      return pages
        .filter((page) => Boolean(page.slug?.current))
        .map((page) => ({
          slug: localeSlug,
          pageSlug: page.slug!.current!,
        }));
    }),
  );

  return paramsPerLocale.flat();
}

export async function generateMetadata(props: {
  params: Promise<{ pageSlug: string; slug: string }>;
}) {
  const { pageSlug, slug } = await props.params;
  const { locale, locales, needsLocalePrefix, isI18nOn, isValidLocale } =
    await getResolvedLocale(slug);

  if (!isI18nOn || !isValidLocale) {
    notFound();
  }

  const page = await fetchSanityPageBySlug({ slug: pageSlug, language: locale });

  if (!page) {
    notFound();
  }

  return generatePageMetadata({
    page,
    slug: pageSlug,
    lang: locale,
    locales,
    needsLocalePrefix,
  });
}

export default async function LocalizedPage(props: {
  params: Promise<{ pageSlug: string; slug: string }>;
}) {
  const { pageSlug, slug } = await props.params;
  const { locale, isI18nOn, isValidLocale, locales } = await getResolvedLocale(
    slug,
  );

  if (!isI18nOn) {
    redirect(stripLocalePrefix(`/${slug}/${pageSlug}`, locales));
  }

  if (!isValidLocale) {
    notFound();
  }

  const page = await fetchSanityPageBySlug({ slug: pageSlug, language: locale });

  if (!page) {
    notFound();
  }

  return <Blocks blocks={page?.blocks ?? []} lang={locale} />;
}
