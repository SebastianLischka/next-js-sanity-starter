import { groq } from "next-sanity";

export const SETTINGS_I18N_QUERY = groq`*[_type == "settings"][0]{
  supportedLanguages[]{
    id,
    title
  },
  defaultLanguage
}`;

export const SETTINGS_QUERY = groq`*[_type == "settings"][0]{
  _type,
  siteName,
  supportedLanguages[]{
    id,
    title
  },
  defaultLanguage,
  logo{
    dark{
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
      }
    },
    light{
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
      }
    },
    width,
    height,
  },
  copyright
}`;
