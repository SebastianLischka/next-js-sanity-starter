import { cn } from "@/lib/utils";
import SectionContainer from "@/components/ui/section-container";

import { PAGE_QUERY_RESULT } from "@/sanity.types";

type SectionHeaderProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["blocks"]>[number],
  { _type: "section-header" }
>;

export default function SectionHeader({
  padding,
  colorVariant,
  sectionWidth = "default",
  stackAlign = "left",
  tagLine,
  title,
  description,
}: SectionHeaderProps) {
  const isNarrow = sectionWidth === "narrow";
  const isPrimary = colorVariant === "primary";

  return (
    <SectionContainer color={colorVariant} padding={padding}>
      <div
        className={cn(
          stackAlign === "center"
            ? "max-w-[48rem] text-center mx-auto"
            : undefined,
          isNarrow ? "max-w-[48rem] mx-auto" : undefined,
        )}
      >
        <div
          className={cn(
            isPrimary ? "text-background" : undefined,
          )}
        >
          {tagLine && (
            <div className={cn("mb-4", stackAlign === "center" ? "flex justify-center" : undefined)}>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
                  isPrimary
                    ? "bg-background/20 text-background"
                    : "bg-primary/10 text-primary",
                )}
              >
                {tagLine}
              </span>
            </div>
          )}
          <h2
            className={cn(
              "text-3xl md:text-5xl font-bold tracking-tight text-balance mb-4 leading-[1.1]",
            )}
          >
            {title}
          </h2>
        </div>
        {description && (
          <p
            className={cn(
              "text-base md:text-lg leading-relaxed",
              isPrimary ? "text-background/80" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </SectionContainer>
  );
}
