import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";
import { DEFAULT_LANGUAGE, DEFAULT_LANGUAGE_TITLE } from "../../lib/i18n-config";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: Settings,
  fields: [
    defineField({
      name: "logo",
      type: "object",
      fields: [
        defineField({
          name: "dark",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "light",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "width",
          type: "number",
          title: "Width",
          description:
            "The width of the logo. Default is dimensions of the image.",
        }),
        defineField({
          name: "height",
          type: "number",
          title: "Height",
          description:
            "The height of the logo. Default is dimensions of the image.",
        }),
      ],
    }),
    defineField({
      name: "siteName",
      type: "string",
      description: "The name of your site",
      validation: (Rule) => Rule.required().error("Site name is required"),
    }),
    defineField({
      name: "copyright",
      type: "block-content",
      description: "The copyright text to display in the footer",
    }),
    defineField({
      name: "supportedLanguages",
      title: "Supported Languages",
      type: "array",
      description:
        "Defines which languages are available in the site and in translation workflows.",
      of: [{ type: "locale" }],
      initialValue: [
        {
          _type: "locale",
          id: DEFAULT_LANGUAGE,
          title: DEFAULT_LANGUAGE_TITLE,
        },
      ],
      validation: (rule) =>
        rule.custom((value) => {
          const locales = Array.isArray(value) ? value : [];
          if (locales.length === 0) {
            return "Add at least one language.";
          }

          const ids = locales
            .map((item) =>
              (item as { id?: string })?.id?.trim().toLowerCase(),
            )
            .filter(Boolean);

          if (!ids.includes(DEFAULT_LANGUAGE)) {
            return `Default locale "${DEFAULT_LANGUAGE}" must always be present.`;
          }

          if (new Set(ids).size !== ids.length) {
            return "Language codes must be unique.";
          }

          return true;
        }),
    }),
    defineField({
      name: "defaultLanguage",
      title: "Default Language",
      type: "string",
      description: "Project default language from SANITY_STUDIO_DEFAULT_LANGUAGE.",
      initialValue: DEFAULT_LANGUAGE,
      readOnly: true,
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            value === DEFAULT_LANGUAGE
              ? true
              : `Default language must be "${DEFAULT_LANGUAGE}".`,
          ),
    }),
  ],
  preview: {
    select: {
      title: "siteName",
      media: "logo",
    },
    prepare({ title, media }) {
      return {
        title: title || "Site Settings",
        media,
      };
    },
  },
});
