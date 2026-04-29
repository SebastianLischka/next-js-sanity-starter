import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERY_RESULT, POST_QUERY_RESULT } from "@/sanity.types";
import { localizeHref } from "@/lib/i18n-routing";
import { toOpenGraphLocale } from "@/lib/i18n";
import { DEFAULT_LOCALE } from "@/config/i18n";
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export function generatePageMetadata({
  page,
  slug,
  lang,
  locales = [DEFAULT_LOCALE],
  needsLocalePrefix = false,
}: {
  page: PAGE_QUERY_RESULT | POST_QUERY_RESULT;
  slug: string;
  lang?: string;
  locales?: string[];
  needsLocalePrefix?: boolean;
}) {
  const activeLocale = lang || DEFAULT_LOCALE;
  const basePath = slug === "index" ? "/" : `/${slug}`;
  const canonicalPath = localizeHref({
    href: basePath,
    locale: activeLocale,
    locales,
    needsLocalePrefix,
  });
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL}${canonicalPath}`;
  const languageAlternates = needsLocalePrefix
    ? Object.fromEntries(
        locales.map((locale) => [
          locale,
          `${process.env.NEXT_PUBLIC_SITE_URL}${localizeHref({
            href: basePath,
            locale,
            locales,
            needsLocalePrefix,
          })}`,
        ]),
      )
    : undefined;

  return {
    title: page?.meta?.title,
    description: page?.meta?.description,
    openGraph: {
      images: [
        {
          url: page?.meta?.image
            ? urlFor(page?.meta?.image).quality(100).url()
            : `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
          width: page?.meta?.image?.asset?.metadata?.dimensions?.width || 1200,
          height: page?.meta?.image?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: toOpenGraphLocale(activeLocale),
      type: "website",
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : page?.meta?.noindex
        ? "noindex"
        : "index, follow",
    alternates: {
      canonical,
      languages: languageAlternates,
    },
  };
}
