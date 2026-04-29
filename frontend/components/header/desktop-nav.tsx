import { cn } from "@/lib/utils";
import { NAVIGATION_QUERY_RESULT } from "@/sanity.types";
import ActionLinkButton from "@/components/blocks/shared/action-link-button";
import { localizeHref } from "@/lib/i18n-routing";

type SanityLink = NonNullable<NAVIGATION_QUERY_RESULT[0]["links"]>[number];

export default function DesktopNav({
  navigation,
  locale,
  locales,
  needsLocalePrefix,
}: {
  navigation: NAVIGATION_QUERY_RESULT;
  locale: string;
  locales: string[];
  needsLocalePrefix: boolean;
}) {
  return (
    <div className="hidden xl:flex items-center gap-7 text-primary">
      {navigation[0]?.links?.map((navItem: SanityLink) => (
        <ActionLinkButton
          key={navItem._key}
          title={navItem.title}
          href={localizeHref({
            href: navItem.href || "#",
            locale,
            locales,
            needsLocalePrefix,
          })}
          target={navItem.target}
          action={navItem.action}
          variant={navItem.buttonVariant || "default"}
          className={cn(
            navItem.buttonVariant === "ghost" &&
              "transition-colors hover:text-foreground/80 text-foreground/60 text-sm p-0 h-auto hover:bg-transparent",
          )}
        />
      ))}
    </div>
  );
}
