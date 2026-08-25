import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const LIVE_ORIGIN = "https://sunpyramidstours.com";
const SITEMAP_INDEX = `${LIVE_ORIGIN}/sitemap.xml`;
const LOCALES = new Set(["fr", "de", "it", "pt", "es", "zh"]);

const manualPaths = [
  "/about-us", "/contact-us", "/blogs/all-blogs", "/events",
  "/egypt-tours/one-day-tours", "/egypt-travel-guide", "/make-your-trip",
  "/rent-car", "/cart", "/cart/checkout", "/auth/sign-in", "/auth/sign-up",
  "/profile", "/profile/bookings", "/profile/favourites", "/profile/settings",
  "/privacy-and-cookies", "/terms-and-conditions", "/sustainability", "/faqs",
  "/accessible-travel", "/book-egypt-trip", "/thankful", "/trips",
  "/order/payment/callback/fawaterk/canceled",
  "/order/payment/callback/fawaterk/pending",
  "/order/payment/callback/fawaterk/success",
  "/order/payment/callback/paypal/canceled",
  "/order/payment/callback/paypal/verify",
  "/egypt-tours/egypt-sightseeing-tours",
  "/egypt-tours/egypt-travel-packages",
  "/egypt-tours/egypt-vacation-packages",
  "/egypt-tours/pyramids-tours",
  ...["fr", "de", "it", "pt", "es", "zh"].flatMap((locale) => [
    `/${locale}`, `/${locale}/tour/tour-to-pyramids-sphinx`,
    `/${locale}/blogs/all-blogs`, `/${locale}/events`,
    `/${locale}/egypt-travel-guide`, `/${locale}/make-your-trip`,
    `/${locale}/rent-car`, `/${locale}/cart`, `/${locale}/auth/sign-in`,
    `/${locale}/profile`, `/${locale}/thankful`,
  ]),
];

const nuxtRedirects = [
  "/es/tour/a%D9%90swan-to-abu-simbel-private-transfer",
  "/zh/tour/a%D9%90swan-to-abu-simbel-private-transfer/",
  "/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole",
  "/fr/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole",
  "/de/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole",
  "/it/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole",
  "/pt/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole",
  "/es/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole",
  "/zh/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20delle%20Piramidi%20del%20Sole",
  "/fr/tour/cairo's-islamic-gems-citadel-alabaster-mosque-art-museum",
  "/zh/blog/Bazar%20Khan%20El%20Khalili%20del%20Cairo%20%7C%20Tour%20%20delle%20Piramidi%20del%20Sole",
  "/zh/tour/cairo's-islamic-gems-citadel-alabaster-mosque-art-museum",
  "/blog/Bazar%20Khan%20El%20Khalili%20du%20Caire%20%7C%20Visites%20%20des%20pyramides%20du%20soleil",
  ...["", "/fr", "/de", "/it", "/pt", "/es", "/zh"].map(
    (prefix) => `${prefix}/tour/2-day-cairo-adventure-tours`,
  ),
];

async function fetchText(url, { method = "GET", attempts = 3 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(url, {
        method,
        redirect: "manual",
        headers: { Accept: "text/html,application/xml,text/plain,*/*" },
        signal: controller.signal,
      });
      const text = method === "HEAD" ? "" : await response.text();
      return { status: response.status, location: response.headers.get("location"), text };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((r) => setTimeout(r, 500 * attempt));
    } finally {
      clearTimeout(timer);
    }
  }
  return { status: "ERROR", location: null, text: "", error: String(lastError) };
}

function xmlLocs(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
    match[1].replaceAll("&amp;", "&").trim(),
  );
}

function localeAndBare(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const locale = LOCALES.has(parts[0]) ? parts.shift() : "en";
  return { locale, bare: `/${parts.join("/")}`.replace(/\/$/, "") || "/" };
}

function routePattern(pathname) {
  const { locale, bare } = localeAndBare(pathname);
  const prefix = locale === "en" ? "" : "/[locale]";
  if (/^\/tour\/[^/]+\/?$/i.test(bare)) return `${prefix}/tour/[slug]`;
  if (/^\/blog\/[^/]+\/?$/i.test(bare)) return `${prefix}/blog/[slug]`;
  if (/^\/event\/[^/]+\/?$/i.test(bare)) return `${prefix}/event/[slug]`;
  if (/^\/egypt-travel-guide\/[^/]+\/[^/]+\/?$/i.test(bare)) return `${prefix}/egypt-travel-guide/[cate]/[id]`;
  if (/^\/egypt-travel-guide\/[^/]+\/?$/i.test(bare)) return `${prefix}/egypt-travel-guide/[cate]`;
  if (/^\/egypt-tours\/.+/i.test(bare)) return `${prefix}/egypt-tours/[...slug]`;
  return `${prefix}${bare === "/" ? "" : bare}` || "/";
}

function contentType(pathname) {
  const { bare } = localeAndBare(pathname);
  if (bare.startsWith("/tour/")) return "Tour detail";
  if (bare.startsWith("/blog/")) return "Blog detail";
  if (bare.startsWith("/event/")) return "Event detail";
  if (bare.startsWith("/egypt-travel-guide/") && bare.split("/").length >= 4) return "Travel-guide article";
  if (bare.startsWith("/egypt-travel-guide/")) return "Travel-guide category";
  if (bare.startsWith("/egypt-tours/")) return "Tour category/destination/marketing";
  if (bare.startsWith("/auth/")) return "Authentication";
  if (bare.startsWith("/profile")) return "Profile";
  if (bare.startsWith("/cart")) return "Cart/checkout";
  if (bare.startsWith("/order/payment/")) return "Payment callback";
  return "Static/API page";
}

const localizedNextBare = new Set([
  "/", "/about-us", "/accessible-travel", "/blog/[slug]", "/blogs/all-blogs",
  "/contact-us", "/egypt-tours/[...slug]", "/egypt-travel-guide",
  "/egypt-travel-guide/[cate]", "/egypt-travel-guide/[cate]/[id]",
  "/event/[slug]", "/events", "/faqs", "/make-your-trip",
  "/privacy-and-cookies", "/rent-car", "/sustainability",
  "/terms-and-conditions", "/tour/[slug]", "/trips",
]);

const englishStatic = new Set([
  "/",
  ...manualPaths.filter((p) => !/^\/(fr|de|it|pt|es|zh)(\/|$)/.test(p)),
]);

function isPublicDocumentUrl(url) {
  const pathname = url.pathname.toLowerCase();
  if (["/_nuxt/", "/images/", "/icons/", "/fonts/"].some((prefix) => pathname.startsWith(prefix))) return false;
  if (/\.(?:js|css|json|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|eot|pdf|xml|txt)$/i.test(pathname)) return false;
  return true;
}

function capability(pathname) {
  const { locale, bare } = localeAndBare(pathname);
  const normalized = routePattern(pathname).replace(/^\/\[locale\]/, "") || "/";
  const dynamic = ["/tour/[slug]", "/blog/[slug]", "/event/[slug]", "/egypt-tours/[...slug]", "/egypt-travel-guide/[cate]", "/egypt-travel-guide/[cate]/[id]"].includes(normalized);
  const exists = locale === "en"
    ? dynamic || englishStatic.has(bare)
    : localizedNextBare.has(normalized);
  return { exists, equivalent: exists ? routePattern(pathname) : "None" };
}

function migrationStatus(url, sources) {
  const path = new URL(url).pathname;
  const { locale, bare } = localeAndBare(path);
  const { exists } = capability(path);
  if (sources.has("Nuxt redirect rule")) return "MISSING";
  if (!exists) return "MISSING";
  if (["/egypt-tours/egypt-sightseeing-tours", "/egypt-tours/egypt-travel-packages", "/egypt-tours/egypt-vacation-packages", "/egypt-tours/pyramids-tours"].includes(bare)) return "PARTIAL";
  if (/^\/(tour|blog)\//.test(bare) || /^\/event\//.test(bare)) return "PARTIAL";
  if (locale !== "en" && ["/cart", "/auth/sign-in", "/profile", "/thankful"].includes(bare)) return "MISSING";
  return "PASS";
}

function escapeCell(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

async function main() {
  const index = await fetchText(SITEMAP_INDEX);
  if (index.status !== 200) throw new Error(`Sitemap index returned ${index.status}`);
  const childUrls = xmlLocs(index.text);
  const records = new Map();

  function add(url, source, discoveredStatus) {
    const normalized = new URL(url, LIVE_ORIGIN);
    normalized.hash = "";
    const key = normalized.toString();
    const existing = records.get(key) || { url: key, sources: new Set(), discoveredStatus: null };
    existing.sources.add(source);
    if (discoveredStatus) existing.discoveredStatus = discoveredStatus;
    records.set(key, existing);
  }

  const childSummary = [];
  for (const childUrl of childUrls) {
    const response = await fetchText(childUrl);
    const urls = response.status === 200 ? xmlLocs(response.text) : [];
    childSummary.push({ url: childUrl, status: response.status, count: urls.length });
    for (const url of urls) add(url, `sitemap:${new URL(childUrl).pathname.slice(1)}`, `listed; child HTTP ${response.status}`);
  }

  const homepage = await fetchText(LIVE_ORIGIN);
  for (const match of homepage.text.matchAll(/href=["']([^"'#]+)["']/gi)) {
    try {
      const url = new URL(match[1], LIVE_ORIGIN);
      if (url.origin === LIVE_ORIGIN && isPublicDocumentUrl(url)) add(url.toString(), "homepage internal link");
    } catch {}
  }

  for (const path of manualPaths) add(new URL(path, LIVE_ORIGIN).toString(), "manually known");
  for (const path of nuxtRedirects) add(new URL(path, LIVE_ORIGIN).toString(), "Nuxt redirect rule");

  const needsProbe = [...records.values()].filter((r) =>
    [...r.sources].some((s) => s === "manually known" || s === "homepage internal link" || s === "Nuxt redirect rule"),
  );
  for (let i = 0; i < needsProbe.length; i += 8) {
    await Promise.all(needsProbe.slice(i, i + 8).map(async (record) => {
      const result = await fetchText(record.url, { method: "HEAD" });
      record.probe = result.status === 405 ? await fetchText(record.url) : result;
    }));
  }

  const rows = [...records.values()].sort((a, b) => a.url.localeCompare(b.url));
  const localeCounts = Object.fromEntries(["en", "fr", "de", "it", "pt", "es", "zh"].map((locale) => [locale, 0]));
  const statusCounts = {};
  for (const record of rows) {
    const locale = localeAndBare(new URL(record.url).pathname).locale;
    localeCounts[locale] += 1;
    const status = migrationStatus(record.url, record.sources);
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  }

  const lines = [
    "# Live route inventory",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Safe-evidence policy: sitemap/robots/homepage discovery used GET only. Sitemap-listed URLs were not individually requested; `HTTP status` explicitly distinguishes child-sitemap availability from a per-URL HEAD probe. Manually known, homepage-linked, and Nuxt-redirect URLs were probed with HEAD (GET only when HEAD was unsupported). No forms or state-changing endpoints were called.",
    "",
    `- Unique live URLs discovered: **${rows.length}**`,
    `- Sitemap URLs: **${childSummary.reduce((sum, item) => sum + item.count, 0)}**`,
    `- Locale counts: ${Object.entries(localeCounts).map(([key, value]) => `${key}=${value}`).join(", ")}`,
    `- Migration classifications: ${Object.entries(statusCounts).map(([key, value]) => `${key}=${value}`).join(", ")}`,
    "",
    "## Sitemap sources",
    "",
    "| Sitemap | HTTP | URLs |",
    "|---|---:|---:|",
    ...childSummary.map((item) => `| ${item.url} | ${item.status} | ${item.count} |`),
    "",
    "## URL inventory",
    "",
    "| Live URL | Route pattern | Source | HTTP status | Locale | Dynamic/static | Content type | Next equivalent | Migration status |",
    "|---|---|---|---|---|---|---|---|---|",
  ];

  for (const record of rows) {
    const url = new URL(record.url);
    const { locale } = localeAndBare(url.pathname);
    const pattern = routePattern(url.pathname);
    const dynamic = /\[/.test(pattern) ? "dynamic" : "static";
    const cap = capability(url.pathname);
    const http = record.probe
      ? `${record.probe.status}${record.probe.location ? ` → ${record.probe.location}` : ""}`
      : `not individually probed (${record.discoveredStatus || "discovered"})`;
    lines.push(`| ${escapeCell(record.url)} | ${escapeCell(pattern)} | ${escapeCell([...record.sources].join(", "))} | ${escapeCell(http)} | ${locale} | ${dynamic} | ${contentType(url.pathname)} | ${escapeCell(cap.equivalent)} | ${migrationStatus(record.url, record.sources)} |`);
  }

  const output = resolve("docs/next-migration/live-route-inventory.md");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${lines.join("\n")}\n`, "utf8");
  console.log(JSON.stringify({ output, total: rows.length, sitemap: childSummary, localeCounts, statusCounts }, null, 2));
}

await main();
