import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from "@/sanity/queries/page";
import { NAVIGATION_QUERY } from "@/sanity/queries/navigation";
import { SETTINGS_QUERY } from "@/sanity/queries/settings";
import {
  POST_QUERY,
  POSTS_QUERY,
  POSTS_SLUGS_QUERY,
} from "@/sanity/queries/post";
import {
  PAGE_QUERY_RESULT,
  PAGES_SLUGS_QUERY_RESULT,
  POST_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  POSTS_SLUGS_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
} from "@/sanity.types";
import { DEFAULT_LOCALE } from "@/config/i18n";

export const fetchSanityPageBySlug = async ({
  slug,
  language,
}: {
  slug: string;
  language?: string;
}): Promise<PAGE_QUERY_RESULT> => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug, language: language || DEFAULT_LOCALE, defaultLanguage: DEFAULT_LOCALE },
  });

  return data;
};

export const fetchSanityPagesStaticParams =
  async ({
    language,
  }: {
    language?: string;
  } = {}): Promise<PAGES_SLUGS_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: PAGES_SLUGS_QUERY,
      params: { language: language || DEFAULT_LOCALE, defaultLanguage: DEFAULT_LOCALE },
      perspective: "published",
      stega: false,
    });

    return data;
  };

export const fetchSanityPosts = async ({
  language,
}: {
  language?: string;
} = {}): Promise<POSTS_QUERY_RESULT> => {
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
    params: { language: language || DEFAULT_LOCALE, defaultLanguage: DEFAULT_LOCALE },
  });

  return data;
};

export const fetchSanityPostBySlug = async ({
  slug,
  language,
}: {
  slug: string;
  language?: string;
}): Promise<POST_QUERY_RESULT> => {
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug, language: language || DEFAULT_LOCALE, defaultLanguage: DEFAULT_LOCALE },
  });

  return data;
};

export const fetchSanityPostsStaticParams =
  async ({
    language,
  }: {
    language?: string;
  } = {}): Promise<POSTS_SLUGS_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: POSTS_SLUGS_QUERY,
      params: { language: language || DEFAULT_LOCALE, defaultLanguage: DEFAULT_LOCALE },
      perspective: "published",
      stega: false,
    });

    return data;
  };

export const fetchSanityNavigation =
  async (): Promise<NAVIGATION_QUERY_RESULT> => {
    const { data } = await sanityFetch({
      query: NAVIGATION_QUERY,
    });

    return data;
  };

export const fetchSanitySettings = async (): Promise<SETTINGS_QUERY_RESULT> => {
  const { data } = await sanityFetch({
    query: SETTINGS_QUERY,
  });

  return data;
};
