import type { ReactNode } from "react";
import type { Locale, PublicSiteSettings } from "@/types/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BottomBar } from "@/components/BottomBar";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { getPublicSiteSettings } from "@/lib/data";

export async function SiteShell({ children, locale = "en", settings: providedSettings }: { children: ReactNode; locale?: Locale; settings?: PublicSiteSettings }) {
  const settings = providedSettings ?? await getPublicSiteSettings(locale);
  return (
    <CurrencyProvider>
      <Header locale={locale} siteTitle={settings.siteTitle} />
      {children}
      <WhatsAppButton />
      <Footer locale={locale} settings={settings} />
      <BottomBar locale={locale} />
    </CurrencyProvider>
  );
}
