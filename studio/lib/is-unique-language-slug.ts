type SlugValidationContext = {
  document?: {
    _id?: string;
    _type?: string;
    language?: string;
  };
  getClient: (config: { apiVersion: string }) => {
    fetch: (query: string, params: Record<string, unknown>) => Promise<boolean>;
  };
};

export async function isUniqueLanguageSlug(
  slug: string,
  context: SlugValidationContext,
) {
  const language = context.document?.language;
  const documentType = context.document?._type;

  if (!slug || !language || !documentType) {
    return true;
  }

  const client = context.getClient({ apiVersion: "2026-03-23" });
  const documentId = context.document?._id?.replace(/^drafts\./, "");

  if (!documentId) {
    return true;
  }

  const params = {
    draft: `drafts.${documentId}`,
    published: documentId,
    slug,
    language,
    documentType,
  };

  const query = `!defined(*[
    !(_id in [$draft, $published])
    && _type == $documentType
    && language == $language
    && slug.current == $slug
  ][0]._id)`;

  return client.fetch(query, params);
}
