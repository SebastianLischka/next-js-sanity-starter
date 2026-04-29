import { Languages } from "lucide-react";
import { defineField, defineType } from "sanity";

export const locale = defineType({
  name: "locale",
  title: "Locale",
  type: "object",
  icon: Languages,
  fields: [
    defineField({
      name: "id",
      type: "string",
      description: 'Locale code, for example "de" or "en".',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z]{2}$/, {
            name: "locale",
            invert: false,
          })
          .error('Use a lowercase 2-letter locale code, for example "de".'),
    }),
    defineField({
      name: "title",
      type: "string",
      description: 'Human readable language title, for example "Deutsch".',
      validation: (rule) =>
        rule.required().error("Language title is required."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "id",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Locale",
        subtitle: subtitle ? `Code: ${subtitle}` : "Missing locale code",
      };
    },
  },
});
