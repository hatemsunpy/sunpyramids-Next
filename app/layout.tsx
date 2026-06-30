import type { Metadata } from "next";
import { ThirdPartyScripts } from "@/components/ThirdPartyScripts";
import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sunpyramidstours.com"),
  title: {
    default: "Sun Pyramids Tours",
    template: "%s | Sun Pyramids Tours",
  },
  description: "Sun Pyramids Tours offers Egypt tours, Nile cruises, day tours, and vacation packages.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
