import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-03-23" });
const DEFAULT_LANGUAGE = process.env.SANITY_STUDIO_DEFAULT_LANGUAGE?.trim().toLowerCase();
const DEFAULT_LANGUAGE_TITLE =
  process.env.SANITY_STUDIO_DEFAULT_LANGUAGE_TITLE?.trim() || "Deutsch";

if (!DEFAULT_LANGUAGE) {
  throw new Error(
    "Missing environment variable: SANITY_STUDIO_DEFAULT_LANGUAGE",
  );
}

const untranslatedDocuments = await client.fetch(
  `*[_type in ["page","post"] && !defined(language)]{_id}`,
);

let transaction = client.transaction();

for (const document of untranslatedDocuments) {
  transaction = transaction.patch(document._id, {
    setIfMissing: { language: DEFAULT_LANGUAGE },
  });
}

transaction = transaction.patch("settings", {
  setIfMissing: {
    supportedLanguages: [
      {
        _type: "locale",
        id: DEFAULT_LANGUAGE,
        title: DEFAULT_LANGUAGE_TITLE,
      },
    ],
    defaultLanguage: DEFAULT_LANGUAGE,
  },
});

if (untranslatedDocuments.length > 0) {
  const result = await transaction.commit();
  console.log(
    `Updated ${untranslatedDocuments.length} documents with language defaults.`,
  );
  console.log(`Last transaction id: ${result?.transactionId || "unknown"}`);
} else {
  await transaction.commit();
  console.log("No page/post documents required language backfill.");
}
