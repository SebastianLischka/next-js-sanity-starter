import { groq } from "next-sanity";
import { imageQuery } from "./shared/image";
import { bodyQuery } from "./shared/body";
import { metaQuery } from "./shared/meta";

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug && coalesce(language, $defaultLanguage) == $language][0]{
    "language": coalesce(language, $defaultLanguage),
    title,
    slug,
    image{
      ${imageQuery}
    },
    body[]{
      ${bodyQuery}
    },
    author->{
      name,
      image {
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt
      }
    },
    _createdAt,
    _updatedAt,
    ${metaQuery},
}`;

export const POSTS_QUERY = groq`*[_type == "post" && defined(slug) && coalesce(language, $defaultLanguage) == $language] | order(_createdAt desc){
    "language": coalesce(language, $defaultLanguage),
    title,
    slug,
    excerpt,
    image{
      ${imageQuery}
    },
}`;

export const POSTS_SLUGS_QUERY = groq`*[_type == "post" && defined(slug) && coalesce(language, $defaultLanguage) == $language]{slug}`;
