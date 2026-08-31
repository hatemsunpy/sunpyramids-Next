"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/locales";

export function HtmlLangSynchronizer() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const locale = localeFromPathname(pathname);
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [pathname]);

  return null;
}
