import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Custom404 from "@/components/404";
import { DEFAULT_LOCALE } from "@/config/i18n";

export const metadata: Metadata = {
  title: "Page not found",
};

export default async function LocalizedNotFoundPage() {
  return (
    <>
      <Header locale={DEFAULT_LOCALE} />
      <Custom404 />
      <Footer locale={DEFAULT_LOCALE} />
    </>
  );
}
