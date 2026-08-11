"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale, Tour } from "@/types/api";
import { ContactForm } from "@/components/ContactForm";
import { TourCard } from "@/components/TourCard";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { withLocale } from "@/lib/locales";
import { apiPost } from "@/lib/client-api";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/components/CurrencyProvider";
import { PriceText } from "@/components/PriceText";

export function TourPage({
  tour,
  relatedTours = [],
  locale = "en",
}: {
  tour: Tour | null;
  relatedTours?: Tour[];
  locale?: Locale;
}) {
  const title = tour?.title || tour?.name || "Egypt Tour";

  return (
    <main className="tour-page">
      <section className="tour-page-shell">
        <h1 className="tour-page-title">{title}</h1>

        <div className="tour-page-grid">
          <TourLeftPanel tour={tour} locale={locale} />
          <TourRightPanel tour={tour} locale={locale} />
        </div>
      </section>

      {tour?.seasons?.length ? <TourSeasonPrices seasons={tour.seasons} /> : null}

      <TourSocialGallery socials={tour?.social_links} />

      {relatedTours.length ? (
        <section className="tour-related">
          <div className="container-shell">
            <h2>Related Tours</h2>
          </div>
          <div className="tour-related-scroll container-shell">
            {relatedTours.map((item) => (
              <TourCard key={item.id || item.slug} tour={item} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function TourLeftPanel({ tour, locale }: { tour: Tour | null; locale: Locale }) {
  return (
    <div className="tour-left-panel">
      <TourGallery tour={tour} />
      <TourInfo tour={tour} />
      <TourHighlights tour={tour} />
      {tour?.days?.length ? <TourItinerary days={tour.days} locale={locale} /> : null}
      {tour?.included ? <TourIncludedExcluded title="What's Included?" items={tour.included} icon="check" /> : null}
      {tour?.excluded ? <TourIncludedExcluded title="What's Excluded?" items={tour.excluded} icon="cross" /> : null}
      {tour?.options?.length ? <TourAddOns options={tour.options} /> : null}
    </div>
  );
}

function TourGallery({ tour }: { tour: Tour | null }) {
  const [active, setActive] = useState(0);
  const gallery = tour?.gallery?.length ? tour.gallery : [tour?.featured_image || "/images/mainBanner.png"];

  return (
    <section className="tour-gallery">
      <div className="tour-gallery-main">
        {gallery.map((src, index) => (
          <Image
            key={`${src}-${index}`}
            src={src}
            alt={`${tour?.title || "Tour"} photo ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 70vw"
            className={`tour-gallery-slide ${index === active ? "is-active" : ""}`}
          />
        ))}
      </div>
      <div className="tour-gallery-thumbs">
        {gallery.map((src, index) => (
          <button
            key={`thumb-${src}-${index}`}
            type="button"
            className={`tour-gallery-thumb ${index === active ? "is-active" : ""}`}
            onClick={() => setActive(index)}
            aria-label={`View photo ${index + 1}`}
          >
            <Image src={src} alt="" width={80} height={80} />
          </button>
        ))}
      </div>
    </section>
  );
}

function TourInfo({ tour }: { tour: Tour | null }) {
  const featuredDestinations = tour?.destinations?.filter((d) => !d.global && d.enabled && d.featured) ?? [];
  const category = tour?.categories?.[0]?.title || tour?.category?.name || "—";
  const destinationCount = featuredDestinations.length;

  return (
    <>
      <section className="tour-info-grid">
        <div className="tour-info-card">
          <span className="tour-info-label">Duration</span>
          <span className="tour-info-value">{tour?.duration || `${tour?.duration_in_days || 1} Days`}</span>
        </div>
        <div className="tour-info-card">
          <span className="tour-info-label">Cities</span>
          <span className="tour-info-value">{destinationCount} Cities</span>
        </div>
        <div className="tour-info-card">
          <span className="tour-info-label">Type</span>
          <span className="tour-info-value">{tour?.type || "Private Tour"}</span>
        </div>
        <div className="tour-info-card">
          <span className="tour-info-label">Category</span>
          <span className="tour-info-value">{category}</span>
        </div>
      </section>

      <section className="tour-overview">
        <Collapsible title="Overview" defaultOpen>
          <div className="tour-overview-pickup">
            <div className="tour-overview-card">
              <span>Pick-up Time</span>
              <strong>{tour?.pickup_time || "—"}</strong>
            </div>
            <div className="tour-overview-card">
              <span>Tour availability</span>
              <strong>{tour?.run || "—"}</strong>
            </div>
          </div>
          {tour?.overview ? (
            <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(tour.overview) }} />
          ) : null}
        </Collapsible>
      </section>
    </>
  );
}

function TourHighlights({ tour }: { tour: Tour | null }) {
  const featuredDestinations = tour?.destinations?.filter((d) => !d.global && d.enabled && d.featured) ?? [];

  return (
    <section className="tour-highlights">
      <Collapsible title="Highlights" defaultOpen>
        {tour?.highlights ? (
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(tour.highlights) }} />
        ) : (
          <>
            <div className="tour-highlights-map">
              <Image src="/images/map.png" alt="Tour destinations map" fill sizes="100vw" />
              <button type="button" className="tour-map-button">
                <Image src="/images/eye-white.png" alt="" width={20} height={20} />
                View Destinations
              </button>
            </div>
            <div className="tour-attractions">
              {featuredDestinations.map((parent) => {
                const children = tour?.destinations?.filter((d) => d.parent_id === parent.id && !d.global) ?? [];
                if (!children.length) return null;
                return (
                  <details key={parent.id} className="tour-attraction" open>
                    <summary>{parent.title} Attractions</summary>
                    <ul>
                      {children.map((child) => (
                        <li key={child.id}>{child.title}</li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          </>
        )}
      </Collapsible>
    </section>
  );
}

function TourItinerary({ days, locale }: { days: NonNullable<Tour["days"]>; locale: Locale }) {
  const [closedAll, setClosedAll] = useState(false);

  return (
    <section className="tour-itinerary">
      <Collapsible
        title="Itinerary"
        defaultOpen
        actions={
          <button type="button" className="btn-outline btn-sm" onClick={() => setClosedAll((v) => !v)}>
            {closedAll ? "Expand All" : "Contract All"}
          </button>
        }
      >
        <div className="tour-days">
          {days.map((day, index) => {
            const translation = day.translations?.find((t) => t.locale === locale) || day.translations?.find((t) => t.locale === "en") || day.translations?.[0];
            const dayTitle = translation?.title?.split(":").slice(1).join(":").trim() || day.title || "";
            const description = translation?.description || day.description || "";
            return (
              <details key={day.id || index} className="tour-day" open={!closedAll}>
                <summary>
                  <span>
                    <strong>Day {index + 1}:</strong> {dayTitle}
                  </span>
                </summary>
                <div className="tour-day-body content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
              </details>
            );
          })}
        </div>
      </Collapsible>
    </section>
  );
}

function TourIncludedExcluded({ title, items, icon }: { title: string; items: string; icon: "check" | "cross" }) {
  const list = items.split(",").map((item) => item.trim()).filter(Boolean);
  return (
    <section className="tour-included-excluded">
      <Collapsible title={title} defaultOpen>
        <ul className="tour-bullet-list">
          {list.map((item, index) => (
            <li key={index}>
              <span className={`tour-bullet-icon ${icon}`} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Collapsible>
    </section>
  );
}

function TourAddOns({ options }: { options: NonNullable<Tour["options"]> }) {
  const { format } = useCurrency();
  return (
    <section className="tour-addons">
      <Collapsible title="Add-ons" defaultOpen>
        <div className="tour-addon-list">
          {options.map((option) => (
            <label key={option.id} className="tour-addon">
              <input type="checkbox" value={option.id} name="tour_options" />
              <span className="tour-addon-name">{option.name}</span>
              <span className="tour-addon-price">{format(option.adult_price || 0)}</span>
            </label>
          ))}
        </div>
      </Collapsible>
    </section>
  );
}

function matchingSeason(tour: Tour | null | undefined, dateString?: string) {
  if (!dateString || !Array.isArray(tour?.seasons)) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  return tour!.seasons!.find((season) => {
    const availability = season?.calender_availability;
    if (!availability) return false;
    return (
      availability.day_numbers?.includes(date.getDate()) &&
      availability.day_names?.includes(date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()) &&
      availability.month_names?.includes(date.toLocaleDateString("en-US", { month: "long" }).toLowerCase()) &&
      availability.years_numbers?.includes(date.getFullYear())
    );
  }) ?? null;
}

function TourRightPanel({ tour, locale }: { tour: Tour | null; locale: Locale }) {
  const router = useRouter();
  const { format } = useCurrency();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const season = matchingSeason(tour, date);
  const source = (season ?? tour) as Tour | null | undefined;
  const groups = Array.isArray(source?.pricing_groups) ? source.pricing_groups : [];
  const group = groups.find((g) => adults >= Number(g?.from) && adults <= Number(g?.to));
  const adultRate = group ? Number(group.price) : Number(source?.adult_price ?? tour?.adult_price ?? tour?.start_from ?? tour?.price ?? 0);
  const childRate = group ? Number(group.child_price) : Number(source?.child_price ?? tour?.child_price ?? 0);
  const infantRate = Number(source?.infant_price ?? tour?.infant_price ?? 0);
  const price = adultRate;
  const offer = Number(tour?.offer || 0);
  const baseTotal = price * adults + childRate * children + infantRate * infants;
  const total = offer ? baseTotal - baseTotal * (offer / 100) : baseTotal;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tour?.id) return;
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    const options = Array.from(form.getAll("tour_options")).map(Number).filter(Boolean);
    try {
      await apiPost(
        "cart/tours/append",
        {
          tour_id: tour.id,
          start_date: date,
          adults,
          children,
          infants,
          options,
        },
        locale,
        true,
      );
      setStatus("success");
      router.push(withLocale("/cart", locale));
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside className="tour-right-panel">
      <div className="tour-booking-card">
        <div className="tour-booking-price">
          <div>
            <span className="tour-booking-label">Price</span>
            <strong className="tour-price-current">{format(total)}</strong>
            {offer ? <span className="tour-price-original">{format(baseTotal)}</span> : null}
          </div>
          <button type="button" className="btn-outline btn-sm">
            Share
          </button>
        </div>

        <form className="tour-booking-form" onSubmit={submit}>
          <label className="tour-field">
            <span>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>

          <div className="tour-passengers">
            <span className="tour-booking-label">Passengers</span>
            <Counter label="Adults (12+)" value={adults} onChange={setAdults} min={1} />
            <Counter label="Children (3 - 11)" value={children} onChange={setChildren} />
            <Counter label="Infants (0 - 2)" value={infants} onChange={setInfants} />
          </div>

          <div className="tour-booking-total">
            <span>Total</span>
            <strong>{format(total)}</strong>
          </div>

          <button type="submit" className="btn-primary" disabled={status === "loading"}>
            {status === "loading" ? "Booking..." : "Book now"}
          </button>
          {status === "error" ? <p className="tour-booking-error">Something went wrong. Please try again.</p> : null}
        </form>

        <div className="tour-booking-actions">
          <button type="button" className="btn-outline">
            Favorites
          </button>
          <a className="btn-outline" href={`https://wa.me/201095888830?text=${encodeURIComponent(`I want to inquire about a tour (${tour?.title})`)}`} target="_blank" rel="noreferrer">
            Ask a question
          </a>
        </div>
      </div>

      <div className="tour-right-help">
        <p className="eyebrow">Need help?</p>
        <ContactForm locale={locale} />
      </div>
    </aside>
  );
}

function Counter({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (value: number) => void; min?: number }) {
  return (
    <div className="tour-counter">
      <span>{label}</span>
      <div className="tour-counter-controls">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease">
          −
        </button>
        <span>{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase">
          +
        </button>
      </div>
    </div>
  );
}

function TourSeasonPrices({ seasons }: { seasons: NonNullable<Tour["seasons"]> }) {
  return (
    <section className="tour-seasons">
      <div className="container-shell">
        <h2>Tour Prices</h2>
        <div className="tour-season-grid">
          {seasons.map((season, index) => {
            const solo = season.pricing_groups?.find((g) => g.from === 1 && g.to === 1);
            const groups = season.pricing_groups?.filter((g) => !(g.from === 1 && g.to === 1)) ?? [];
            const availability = season.calender_availability || {};
            const months = availability.month_names ?? [];
            const years = availability.years_numbers ?? [];
            return (
              <div key={index} className="tour-season-card">
                <p className="tour-season-date">
                  {months.length ? `${months[0]} ${years[0] || ""}` : `Season ${index + 1}`}
                </p>
                {solo ? (
                  <div className="tour-season-row">
                    <span>Solo</span>
                    <strong>
                      <PriceText amount={solo.price} />
                    </strong>
                  </div>
                ) : null}
                {groups.map((g) => (
                  <div key={`${g.from}-${g.to}`} className="tour-season-row">
                    <span>
                      {g.from}-{g.to} PAX
                    </span>
                    <strong>
                      <PriceText amount={g.price} />
                    </strong>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const defaultSocials = [
  { type: "shorts", image: "/images/shorts.png", icon: "/images/shorts-gallary.png", url: "#" },
  { type: "youtube", image: "/images/youtubetwo.png", icon: "/images/youtube-gallary.png", url: "#" },
  { type: "facebook", image: "/images/youtubetwo.png", icon: "/images/fb-logo.webp", url: "#" },
  { type: "youtube", image: "/images/youtubeone.png", icon: "/images/youtube-gallary.png", url: "#" },
  { type: "tiktok", image: "/images/tiktok.png", icon: "/images/tiktok-gallary.png", url: "#" },
  { type: "instagram", image: "/images/instagram.png", icon: "/images/insta-gallary.png", url: "#" },
];

function TourSocialGallery({ socials }: { socials?: { image?: string; icon?: string; url?: string; type?: string }[] }) {
  const items = socials?.length
    ? socials.map((s) => ({ ...s, image: s.image || getDefaultSocial(s.type).image, icon: s.icon || getDefaultSocial(s.type).icon }))
    : defaultSocials;

  return (
    <section className="tour-social-gallery">
      <div className="container-shell">
        <h2>Gallery of Exciting journeys</h2>
        <div className="tour-social-scroll">
          {items.map((item, index) => (
            <a key={index} href={item.url || "#"} target="_blank" rel="noreferrer" className="tour-social-card">
              <Image src={item.image || "/images/shorts.png"} alt="" fill sizes="20vw" />
              <Image src={item.icon || "/images/shorts-gallary.png"} alt="Social gallery icon" width={72} height={72} className="tour-social-icon" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function getDefaultSocial(type?: string) {
  const found = defaultSocials.find((s) => s.type === type) || defaultSocials[0];
  return { image: found.image, icon: found.icon };
}

function Collapsible({
  title,
  children,
  defaultOpen = false,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="tour-collapsible">
      <div className="tour-collapsible-head">
        <h3>{title}</h3>
        <div className="tour-collapsible-actions">
          {actions}
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Collapse" : "Expand"} className={`tour-collapsible-toggle ${open ? "is-open" : ""}`}>
            ▼
          </button>
        </div>
      </div>
      {open ? <div className="tour-collapsible-body">{children}</div> : null}
    </div>
  );
}
