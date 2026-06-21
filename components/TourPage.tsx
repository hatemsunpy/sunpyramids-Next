import Image from "next/image";
import type { Locale, Tour } from "@/types/api";
import { ContactForm } from "@/components/ContactForm";

export function TourPage({ tour, locale = "en" }: { tour: Tour | null; locale?: Locale }) {
  const title = tour?.title || tour?.name || "Egypt Tour";
  const image = tour?.gallery?.[0] || tour?.images?.[0] || tour?.banner || tour?.image || "/images/mainBanner.png";

  return (
    <main>
      <section className="page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(${image})` }}>
        <h1>{title}</h1>
      </section>
      <section className="section-pad container-shell tour-layout">
        <article>
          <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "1.25rem", overflow: "hidden", marginBottom: "1.5rem" }}>
            <Image src={image} alt={title} fill priority sizes="(max-width: 1024px) 100vw, 70vw" />
          </div>
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: String(tour?.content || tour?.description || "Tour details are loaded from the dashboard API.") }} />
        </article>
        <aside className="booking-panel">
          <p className="muted">Start From</p>
          <h2 style={{ color: "var(--primary)" }}>{tour?.price || tour?.start_from ? `$${tour.price || tour.start_from}` : "Request Price"}</h2>
          <p className="muted">{tour?.duration || "Flexible schedule"}</p>
          <ContactForm locale={locale} />
        </aside>
      </section>
    </main>
  );
}
