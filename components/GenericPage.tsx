import Image from "next/image";
import type { ApiPage } from "@/types/api";

export function GenericPage({ page, fallbackTitle }: { page: ApiPage | null; fallbackTitle: string }) {
  const title = page?.title || page?.name || fallbackTitle;
  const image = page?.banner || page?.image || "/images/aboutusmainbanner.png";

  return (
    <main>
      <section className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(${image})` }}>
        <h1>{title}</h1>
      </section>
      <section className="section-pad container-shell">
        {page?.content || page?.description ? (
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: String(page.content || page.description) }} />
        ) : (
          <div className="two-col">
            <div>
              <h2>{title}</h2>
              <p className="content-prose">
                This page is migrated to Next.js and remains connected to the dashboard API. When dashboard content is available, it renders server-side here.
              </p>
            </div>
            <Image src={image} alt={title} width={680} height={460} style={{ width: "100%", height: "auto", borderRadius: "1.25rem" }} />
          </div>
        )}
      </section>
    </main>
  );
}
