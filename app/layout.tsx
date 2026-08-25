import type { Metadata } from "next";
import { headers } from "next/headers";
import { ThirdPartyScripts } from "@/components/ThirdPartyScripts";
import { isLocale } from "@/lib/locales";
import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sunpyramidstours.com"),
  title: {
    default: "Sun Pyramids Tours",
    template: "%s | Sun Pyramids Tours",
  },
  description: "Sun Pyramids Tours offers Egypt tours, Nile cruises, day tours, and vacation packages.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const routeLocale = (await headers()).get("x-sunpyramids-route-locale") || "en";
  const lang = isLocale(routeLocale) ? routeLocale : "en";
  return (
    <html lang={lang}>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KDF33T7"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
