import {
  OrderableDocumentList,
  orderableDocumentListDeskItem,
} from "@sanity/orderable-document-list";
import { GenerateIcon, SortIcon } from "@sanity/icons";
import type { ConfigContext } from "sanity";
import type { StructureBuilder } from "sanity/structure";
import {
  Files,
  BookA,
  User,
  ListCollapse,
  Quote,
  Menu,
  Settings,
} from "lucide-react";
import {
  fetchSupportedLanguagesFromSettings,
  getStudioApiVersion,
} from "./lib/fetch-supported-languages";

const ORDERABLE_LIST_API_VERSION = "v2025-06-27";
const IS_STUDIO_I18N_ENABLED =
  process.env.SANITY_STUDIO_I18N_ENABLED !== "false";

/**
 * Matches the child pane shape from `orderableDocumentListDeskItem` so single-language
 * "Pages" stays one click deep (Content → Pages → ordered list).
 */
function orderableTypeListPane(
  S: StructureBuilder,
  context: ConfigContext,
  options: {
    type: string;
    filter?: string;
    params?: Record<string, unknown>;
    listKey: string;
    createIntent?: boolean;
  },
) {
  const { type, filter, params, listKey, createIntent = true } = options;
  const { schema, getClient } = context;
  const perspectiveStack =
    (context as { perspectiveStack?: unknown[] }).perspectiveStack ?? [];
  const client = getClient({ apiVersion: ORDERABLE_LIST_API_VERSION });
  const currentVersion = perspectiveStack[0];
  const typeTitle = schema.get(type)?.title ?? type;

  const menuItems = [];
  if (createIntent !== false) {
    menuItems.push(
      S.menuItem()
        .title(`Create new ${typeTitle}`)
        .intent({ type: "create", params: { type } })
        .serialize(),
    );
  }

  return Object.assign(
    S.documentTypeList(type).canHandleIntent(() => !!createIntent).serialize(),
    {
      __preserveInstance: true,
      key: listKey,
      type: "component",
      component: OrderableDocumentList,
      options: { type, filter, params, client, currentVersion },
      menuItems: [
        ...menuItems,
        S.menuItem()
          .title("Reset Order")
          .icon(GenerateIcon)
          .action("resetOrder")
          .serialize(),
        S.menuItem()
          .title("Toggle Increments")
          .icon(SortIcon)
          .action("showIncrements")
          .serialize(),
      ],
    },
  );
}

export const structure = (S: StructureBuilder, context: ConfigContext) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .icon(Files)
        .schemaType("page")
        .child(async () => {
          if (!IS_STUDIO_I18N_ENABLED) {
            return orderableTypeListPane(S, context, {
              type: "page",
              listKey: "orderable-page-all",
            });
          }

          const client = context.getClient({
            apiVersion: getStudioApiVersion(),
          });
          const languages = await fetchSupportedLanguagesFromSettings(client);

          if (languages.length === 1) {
            const only = languages[0];
            return orderableTypeListPane(S, context, {
              type: "page",
              filter: `_type == "page" && language == $language`,
              params: { language: only.id },
              listKey: `orderable-page-${only.id}`,
            });
          }

          return S.list()
            .title("Pages")
            .items(
              languages.map((lang) =>
                orderableDocumentListDeskItem({
                  type: "page",
                  id: `orderable-page-${lang.id}`,
                  title: `${lang.title} (${lang.id})`,
                  icon: Files,
                  S,
                  context,
                  filter: `_type == "page" && language == $language`,
                  params: { language: lang.id },
                }),
              ),
            );
        }),
      S.listItem()
        .title("Posts")
        .schemaType("post")
        .child(async () => {
          if (!IS_STUDIO_I18N_ENABLED) {
            return S.documentTypeList("post")
              .title("Posts")
              .defaultOrdering([{ field: "_createdAt", direction: "desc" }]);
          }

          const client = context.getClient({
            apiVersion: getStudioApiVersion(),
          });
          const languages = await fetchSupportedLanguagesFromSettings(client);

          if (languages.length === 1) {
            const only = languages[0];
            return S.documentTypeList("post")
              .title("Posts")
              .filter("language == $language")
              .params({ language: only.id })
              .defaultOrdering([{ field: "_createdAt", direction: "desc" }]);
          }

          return S.list()
            .title("Posts")
            .items(
              languages.map((lang) =>
                S.listItem()
                  .title(`${lang.title} (${lang.id})`)
                  .schemaType("post")
                  .child(
                    S.documentTypeList("post")
                      .title(`Posts — ${lang.title}`)
                      .filter("language == $language")
                      .params({ language: lang.id })
                      .defaultOrdering([
                        { field: "_createdAt", direction: "desc" },
                      ]),
                  ),
              ),
            );
        }),
      orderableDocumentListDeskItem({
        type: "category",
        title: "Categories",
        icon: BookA,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "author",
        title: "Authors",
        icon: User,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "faq",
        title: "FAQs",
        icon: ListCollapse,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "testimonial",
        title: "Testimonials",
        icon: Quote,
        S,
        context,
      }),
      S.divider({ id: "global-section", type: "divider", title: "Global" }),
      S.listItem()
        .title("Navigation")
        .icon(Menu)
        .child(
          S.editor()
            .id("navigation")
            .schemaType("navigation")
            .documentId("navigation"),
        ),
      S.listItem()
        .title("Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("settings")
            .schemaType("settings")
            .documentId("settings"),
        ),
    ]);
