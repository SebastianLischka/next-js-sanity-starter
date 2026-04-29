import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { getI18nConfig } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n-routing";

const VIEWABLE_TYPES = ["page", "post"] as const;
const SITEMAP_QUERY = groq`
  *[
    _type in $viewableTypes
    && meta.noindex != true
    && defined(slug.current)
  ] {
    _type,
    language,
    slug,
    _updatedAt,
    "changeFrequency": select(_type == "page" => "daily", "weekly"),
    "priority": select(
      _type == "page" && slug.current == "index" => 1,
      _type == "page" => 0.5,
      0.7
    )
  } | order(priority desc, url asc)
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ locales, defaultLocale, needsLocalePrefix }, { data }] =
    await Promise.all([
      getI18nConfig(),
      sanityFetch({
        query: SITEMAP_QUERY,
        params: {
          viewableTypes: [...VIEWABLE_TYPES],
        },
      }),
    ]);

  const entries = (data as
    | Array<{
        _type: "page" | "post";
        language?: string;
        slug?: { current?: string };
        _updatedAt?: string;
        changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
        priority?: number;
      }>
    | null
    | undefined) ?? [];

  const seen = new Set<string>();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const entry of entries) {
    const slug = entry.slug?.current;
    if (!slug) continue;

    const locale = (entry.language || defaultLocale).toLowerCase();
    if (!needsLocalePrefix && locale !== defaultLocale) {
      continue;
    }

    const basePath =
      entry._type === "post"
        ? `/blog/${slug}`
        : slug === "index"
          ? "/"
          : `/${slug}`;

    const localizedPath = localizeHref({
      href: basePath,
      locale,
      locales,
      needsLocalePrefix,
    });
    const absoluteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${localizedPath}`;
    const dedupeKey = `${absoluteUrl}-${locale}`;

    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    sitemapEntries.push({
      url: absoluteUrl,
      lastModified: entry._updatedAt,
      changeFrequency: entry.changeFrequency || "weekly",
      priority: entry.priority,
    });
  }

  return sitemapEntries.sort((a, b) => a.url.localeCompare(b.url));
}
