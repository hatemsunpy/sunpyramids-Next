import type { Metadata } from "next";
import Script from "next/script";
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-NKZ6W32C4J" strategy="afterInteractive" />
        <Script id="sunpyramids-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NKZ6W32C4J');
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KDF33T7');
          `}
        </Script>
        <Script
          src="https://www.google.com/recaptcha/enterprise.js?render=6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
