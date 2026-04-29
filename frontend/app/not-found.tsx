import Header from "@/components/header";
import Footer from "@/components/footer";
import Custom404 from "@/components/404";
import { DEFAULT_LOCALE } from "@/config/i18n";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFoundPage() {
  return (
    <>
      <Header locale={DEFAULT_LOCALE} />
      <Custom404 />
      <Footer locale={DEFAULT_LOCALE} />
    </>
  );
}
