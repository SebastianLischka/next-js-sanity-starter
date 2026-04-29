import Link from "next/link";
import Logo from "@/components/logo";
import MobileNav from "@/components/header/mobile-nav";
import DesktopNav from "@/components/header/desktop-nav";
import { ModeToggleClient } from "@/components/menu-toggle-client";
import { fetchSanitySettings, fetchSanityNavigation } from "@/sanity/lib/fetch";
import { getI18nConfig } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n-routing";
import { DEFAULT_LOCALE } from "@/config/i18n";
import LocaleSwitcher from "@/components/header/locale-switcher";

export default async function Header({
  locale = DEFAULT_LOCALE,
}: {
  locale?: string;
}) {
  const [{ locales, needsLocalePrefix }, settings, navigation] =
    await Promise.all([
      getI18nConfig(),
      fetchSanitySettings(),
      fetchSanityNavigation(),
    ]);

  const homeHref = localizeHref({
    href: "/",
    locale,
    locales,
    needsLocalePrefix,
  });

  return (
    <header className="sticky top-0 w-full border-border/40 bg-background/95 z-50">
      <div className="container flex items-center justify-between h-14">
        <Link href={homeHref} aria-label="Home page">
          <Logo settings={settings} />
        </Link>
        <div className="hidden xl:flex gap-7 items-center justify-between">
          <DesktopNav
            locale={locale}
            locales={locales}
            needsLocalePrefix={needsLocalePrefix}
            navigation={navigation}
          />
          <LocaleSwitcher
            locale={locale}
            locales={locales}
            needsLocalePrefix={needsLocalePrefix}
          />
          <ModeToggleClient />
        </div>
        <div className="flex items-center xl:hidden">
          <LocaleSwitcher
            locale={locale}
            locales={locales}
            needsLocalePrefix={needsLocalePrefix}
          />
          <ModeToggleClient />
          <MobileNav
            locale={locale}
            locales={locales}
            needsLocalePrefix={needsLocalePrefix}
            navigation={navigation}
            settings={settings}
          />
        </div>
      </div>
    </header>
  );
}
