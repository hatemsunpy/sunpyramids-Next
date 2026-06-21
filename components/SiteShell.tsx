import type { ReactNode } from "react";
import type { Locale } from "@/types/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BottomBar } from "@/components/BottomBar";

export function SiteShell({ children, locale = "en" }: { children: ReactNode; locale?: Locale }) {
  return (
    <>
      <Header locale={locale} />
      {children}
      <WhatsAppButton />
      <Footer locale={locale} />
      <BottomBar locale={locale} />
    </>
  );
}
