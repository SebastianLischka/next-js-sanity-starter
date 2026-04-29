import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PostHero from "@/components/blocks/post-hero";
import PortableTextRenderer from "@/components/portable-text-renderer";
import {
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import { getI18nConfig } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n-routing";
import { DEFAULT_LOCALE } from "@/config/i18n";

type BreadcrumbLink = {
  label: string;
  href: string;
};

export async function generateStaticParams() {
  const posts = await fetchSanityPostsStaticParams({
    language: DEFAULT_LOCALE,
  });

  return posts.map((post) => ({
    slug: post.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { defaultLocale, locales, needsLocalePrefix } = await getI18nConfig();
  const post = await fetchSanityPostBySlug({
    slug: params.slug,
    language: DEFAULT_LOCALE,
  });

  if (!post) {
    notFound();
  }

  return generatePageMetadata({
    page: post,
    slug: `blog/${params.slug}`,
    lang: defaultLocale,
    locales,
    needsLocalePrefix,
  });
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { defaultLocale, locales, needsLocalePrefix } = await getI18nConfig();

  if (needsLocalePrefix) {
    redirect(
      localizeHref({
        href: `/blog/${params.slug}`,
        locale: defaultLocale,
        locales,
        needsLocalePrefix,
      }),
    );
  }

  const post = await fetchSanityPostBySlug({
    slug: params.slug,
    language: DEFAULT_LOCALE,
  });

  if (!post) {
    notFound();
  }

  const links: BreadcrumbLink[] = post
    ? [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Blog",
          href: "/blog",
        },
        {
          label: post.title as string,
          href: "#",
        },
      ]
    : [];

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs links={links} />
          <PostHero
            {...post}
            lang={DEFAULT_LOCALE}
            locales={locales}
            needsLocalePrefix={false}
          />
          {post.body && <PortableTextRenderer value={post.body} />}
        </article>
      </div>
    </section>
  );
}
