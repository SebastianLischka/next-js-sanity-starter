import { groq } from "next-sanity";

// Shared language filter to keep page/post behavior identical.
export const languageFilterQuery = groq`
  (
    language == $language ||
    (!defined(language) && $language == $defaultLanguage)
  )
`;

// Prefer documents with explicit language match over fallback docs.
export const languageOrderQuery = groq`
  select(language == $language => 1, 0) desc,
  _updatedAt desc
`;
