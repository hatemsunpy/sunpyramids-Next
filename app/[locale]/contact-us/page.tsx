import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { getPage } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolvePrefixedLocale(params);
  const page = await getPage("contact-us", locale);
  return metadataFromPage(page, `/${locale}/contact-us`, locale);
}

export default async function Page({ params }: Props) {
  const locale = await resolvePrefixedLocale(params);
  const page = await getPage("contact-us", locale);
  return (
    <SiteShell locale={locale}>
      <JsonLd schema={page?.seo?.structure_schema} />
      <main>
        <section className="page-hero" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(/images/contactForm.png)" }}>
          <h1>{page?.title || "Contact Us"}</h1>
        </section>
        <section className="section-pad container-shell two-col">
          <div>
            <h2>Send Your Feedback</h2>
            <div className="content-prose" dangerouslySetInnerHTML={{ __html: String(page?.content || page?.description || "We would be happy to help you plan your Egypt trip.") }} />
          </div>
          <ContactForm locale={locale} />
        </section>
      </main>
    </SiteShell>
  );
}
