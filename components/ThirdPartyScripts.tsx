"use client";

import { useEffect } from "react";

function isThirdPartyDisabled() {
  return new URLSearchParams(window.location.search).get("no-third-party") === "1";
}

function appendScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const node = document.createElement("script");
  node.src = src;
  node.async = true;
  document.head.appendChild(node);
}

export function ThirdPartyScripts() {
  useEffect(() => {
    if (isThirdPartyDisabled()) return;

    appendScript("https://www.googletagmanager.com/gtag/js?id=G-NKZ6W32C4J");

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-NKZ6W32C4J");

    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    appendScript("https://www.googletagmanager.com/gtm.js?id=GTM-KDF33T7");
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
