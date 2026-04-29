import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Custom404 from "@/components/404";
import { getResolvedLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Page not found",
};

export default async function LocalizedNotFoundPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const { locale } = await getResolvedLocale(lang);

  return (
    <>
      <Header locale={locale} />
      <Custom404 />
      <Footer locale={locale} />
    </>
  );
}
