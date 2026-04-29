import {
  defineLocations,
  defineDocuments,
  PresentationPluginOptions,
} from "sanity/presentation";
import { DEFAULT_LANGUAGE } from "../lib/i18n-config";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    // Add more locations for other post types
    post: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
        language: "language",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/${doc?.language || DEFAULT_LANGUAGE}/blog/${doc?.slug}`,
          },
          {
            title: "Blog",
            href: `/${doc?.language || DEFAULT_LANGUAGE}/blog`,
          },
        ],
      }),
    }),
  },
  mainDocuments: defineDocuments([
    {
      route: "/",
      filter: `_type == 'page' && slug.current == 'index' && coalesce(language, '${DEFAULT_LANGUAGE}') == '${DEFAULT_LANGUAGE}'`,
    },
    {
      route: "/:lang",
      filter: `_type == 'page' && slug.current == 'index' && coalesce(language, '${DEFAULT_LANGUAGE}') == $lang`,
    },
    {
      route: "/:slug",
      filter: `_type == 'page' && slug.current == $slug && coalesce(language, '${DEFAULT_LANGUAGE}') == '${DEFAULT_LANGUAGE}'`,
    },
    {
      route: "/:lang/:slug",
      filter: `_type == 'page' && slug.current == $slug && coalesce(language, '${DEFAULT_LANGUAGE}') == $lang`,
    },
    {
      route: "/blog/:slug",
      filter: `_type == 'post' && slug.current == $slug && coalesce(language, '${DEFAULT_LANGUAGE}') == '${DEFAULT_LANGUAGE}'`,
    },
    {
      route: "/:lang/blog/:slug",
      filter: `_type == 'post' && slug.current == $slug && coalesce(language, '${DEFAULT_LANGUAGE}') == $lang`,
    },
  ]),
};
