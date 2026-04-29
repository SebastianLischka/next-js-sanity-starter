import Blocks from "@/components/blocks";
import {
  fetchSanityPageBySlug,
  fetchSanityPagesStaticParams,
} from "@/sanity/lib/fetch";
import { notFound, redirect } from "next/navigation";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { getI18nConfig } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n-routing";
import { DEFAULT_LOCALE } from "@/config/i18n";

export async function generateStaticParams() {
  const pages = await fetchSanityPagesStaticParams({ language: DEFAULT_LOCALE });

  return pages.map((page) => ({
    slug: page.slug?.current,
  })).filter((page) => Boolean(page.slug && page.slug !== "index"));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { defaultLocale, locales, needsLocalePrefix } = await getI18nConfig();
  const localeFromSlug = locales.includes(params.slug) ? params.slug : null;
  const page = await fetchSanityPageBySlug({
    slug: localeFromSlug ? "index" : params.slug,
    language: localeFromSlug || DEFAULT_LOCALE,
  });

  if (!page) {
    notFound();
  }

  return generatePageMetadata({
    page,
    slug: localeFromSlug ? "index" : params.slug,
    lang: localeFromSlug || defaultLocale,
    locales,
    needsLocalePrefix,
  });
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { defaultLocale, locales, needsLocalePrefix } = await getI18nConfig();
  const localeFromSlug = locales.includes(params.slug) ? params.slug : null;

  if (needsLocalePrefix && !localeFromSlug) {
    redirect(
      localizeHref({
        href: `/${params.slug}`,
        locale: defaultLocale,
        locales,
        needsLocalePrefix,
      }),
    );
  }

  const page = await fetchSanityPageBySlug({
    slug: localeFromSlug ? "index" : params.slug,
    language: localeFromSlug || DEFAULT_LOCALE,
  });

  if (!page) {
    notFound();
  }

  return (
    <Blocks
      blocks={page?.blocks ?? []}
      lang={localeFromSlug || DEFAULT_LOCALE}
    />
  );
}
