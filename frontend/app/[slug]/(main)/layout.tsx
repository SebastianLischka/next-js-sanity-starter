import Header from "@/components/header";
import Footer from "@/components/footer";
import { SanityDraftMode } from "@/components/sanity-draft-mode";
import { getResolvedLocale } from "@/lib/i18n";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

export default async function LocalizedMainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, isValidLocale } = await getResolvedLocale(slug);
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  if (!isValidLocale) {
    notFound();
  }

  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      {isDraftModeEnabled && <SanityDraftMode />}
      <Footer locale={locale} />
    </>
  );
}
