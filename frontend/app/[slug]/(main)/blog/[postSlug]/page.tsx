import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PortableTextRenderer from "@/components/portable-text-renderer";
import PostHero from "@/components/blocks/post-hero";
import { getI18nConfig, getResolvedLocale } from "@/lib/i18n";
import { stripLocalePrefix } from "@/lib/i18n-routing";
import {
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";

type BreadcrumbLink = {
  label: string;
  href: string;
};

export async function generateStaticParams() {
  const { locales, isI18nOn } = await getI18nConfig();

  if (!isI18nOn) {
    return [];
  }

  const paramsPerLocale = await Promise.all(
    locales.map(async (localeSlug) => {
      const posts = await fetchSanityPostsStaticParams({ language: localeSlug });
      return posts
        .filter((post) => Boolean(post.slug?.current))
        .map((post) => ({
          slug: localeSlug,
          postSlug: post.slug!.current!,
        }));
    }),
  );

  return paramsPerLocale.flat();
}

export async function generateMetadata(props: {
  params: Promise<{ postSlug: string; slug: string }>;
}) {
  const { postSlug, slug } = await props.params;
  const { locale, locales, needsLocalePrefix, isI18nOn, isValidLocale } =
    await getResolvedLocale(slug);
  const post = await fetchSanityPostBySlug({ slug: postSlug, language: locale });

  if (!isI18nOn || !isValidLocale || !post) {
    notFound();
  }

  return generatePageMetadata({
    page: post,
    slug: `blog/${postSlug}`,
    lang: locale,
    locales,
    needsLocalePrefix,
  });
}

export default async function LocalizedPostPage(props: {
  params: Promise<{ postSlug: string; slug: string }>;
}) {
  const { postSlug, slug } = await props.params;
  const { locale, isI18nOn, isValidLocale, locales, needsLocalePrefix } =
    await getResolvedLocale(slug);

  if (!isI18nOn) {
    redirect(stripLocalePrefix(`/${slug}/blog/${postSlug}`, locales));
  }

  if (!isValidLocale) {
    notFound();
  }

  const post = await fetchSanityPostBySlug({ slug: postSlug, language: locale });

  if (!post) {
    notFound();
  }

  const links: BreadcrumbLink[] = [
    { label: "Home", href: `/${locale}` },
    { label: "Blog", href: `/${locale}/blog` },
    { label: post.title as string, href: "#" },
  ];

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs links={links} />
          <PostHero
            {...post}
            lang={locale}
            locales={locales}
            needsLocalePrefix={needsLocalePrefix}
          />
          {post.body && <PortableTextRenderer value={post.body} />}
        </article>
      </div>
    </section>
  );
}
