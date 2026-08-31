"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale, Tour } from "@/types/api";
import { ContactForm } from "@/components/ContactForm";
import { HomeSearchShortcuts } from "@/components/HomeSearchShortcuts";
import { TourCard } from "@/components/TourCard";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { withLocale } from "@/lib/locales";
import { apiPost } from "@/lib/client-api";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/components/CurrencyProvider";
import { PriceText } from "@/components/PriceText";
import { optionCost, toggleWishlist } from "@/components/CustomerFlows";
import { parseLocalCalendarDate } from "@/lib/local-date";
import { whatsappInquiryUrl } from "@/lib/site-contact";

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
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  return (
    <main className="tour-page">
      <TourBreadcrumb title={title} locale={locale} />
      <section className="tour-page-shell">
        <h1 className="tour-page-title tour-page-title-desktop">{title}</h1>

        <div className="tour-page-grid">
          <TourLeftPanel tour={tour} locale={locale} title={title} selectedOptions={selectedOptions} onSelectedOptionsChange={setSelectedOptions} />
          <TourRightPanel tour={tour} locale={locale} selectedOptions={selectedOptions} onSelectedOptionsChange={setSelectedOptions} />
        </div>
      </section>

      {tour?.is_inquiry ? null : tour?.seasons?.length ? <TourSeasonPrices seasons={tour.seasons} /> : null}

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

      <section className="tour-make-trip section-pad original-destination-band">
        <div className="container-shell make-trip-section">
          <div>
            <h2>Make Your Trip</h2>
            <HomeSearchShortcuts
              locale={locale}
              destinations={(tour?.destinations ?? []).map(({ id, name, title: destinationTitle, slug }) => ({ id, name, title: destinationTitle, slug }))}
              modeOnly="make"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function TourBreadcrumb({ title, locale }: { title: string; locale: Locale }) {
  return (
    <nav className="tour-breadcrumb" aria-label="Breadcrumb">
      <Link className="tour-breadcrumb-back" href={withLocale("/trips", locale)} aria-label="Back to tours">←</Link>
      <span className="tour-breadcrumb-trail">
        <Link href={withLocale("/", locale)}>Home</Link><span aria-hidden="true">›</span>
        <Link href={withLocale("/trips", locale)}>Tours</Link><span aria-hidden="true">›</span>
      </span>
      <span className="tour-breadcrumb-current">{title}</span>
    </nav>
  );
}

function useTourActions(tour: Tour | null, locale: Locale) {
  const [actionMessage, setActionMessage] = useState("");

  async function shareTour() {
    const shareData = { title: tour?.title || "Sun Pyramids Tour", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.url);
        setActionMessage("Tour link copied");
      }
    } catch {
      setActionMessage("Sharing was cancelled");
    }
  }

  async function favoriteTour() {
    if (!tour?.id) return;
    try {
      await toggleWishlist(tour.id, locale);
      setActionMessage("Favorites updated");
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "Please sign in to use favorites");
    }
  }

  return { actionMessage, favoriteTour, shareTour };
}

function TourLeftPanel({ tour, locale, title, selectedOptions, onSelectedOptionsChange }: { tour: Tour | null; locale: Locale; title: string; selectedOptions: number[]; onSelectedOptionsChange: (ids: number[]) => void }) {
  return (
    <div className="tour-left-panel">
      <TourGallery tour={tour} locale={locale} />
      <h1 className="tour-page-title tour-page-title-mobile">{title}</h1>
      <TourInfo tour={tour} />
      <TourHighlights tour={tour} locale={locale} />
      {tour?.days?.length ? <TourItinerary days={tour.days} locale={locale} /> : null}
      {tour?.included ? <TourIncludedExcluded title="What's Included?" items={tour.included} icon="check" /> : null}
      {tour?.excluded ? <TourIncludedExcluded title="What's Excluded?" items={tour.excluded} icon="cross" /> : null}
      {tour?.options?.length ? <TourAddOns options={tour.options} selected={selectedOptions} onChange={onSelectedOptionsChange} /> : null}
    </div>
  );
}

function TourGallery({ tour, locale }: { tour: Tour | null; locale: Locale }) {
  const [active, setActive] = useState(0);
  const [thumbnailsReady, setThumbnailsReady] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const { actionMessage, favoriteTour, shareTour } = useTourActions(tour, locale);
  const gallery = tour?.gallery?.length ? tour.gallery : [tour?.featured_image || "/images/mainBanner.png"];
  const thumbnailWindowSize = 5;
  const thumbnailStart = Math.min(
    Math.max(active - Math.floor(thumbnailWindowSize / 2), 0),
    Math.max(gallery.length - thumbnailWindowSize, 0),
  );
  const visibleThumbnails = gallery.slice(thumbnailStart, thumbnailStart + thumbnailWindowSize);

  function showPhoto(index: number) {
    setActive((index + gallery.length) % gallery.length);
  }

  return (
    <section className="tour-gallery">
      <div
        className="tour-gallery-main"
        onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStartX.current == null) return;
          const distance = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
          if (Math.abs(distance) > 45) showPhoto(active + (distance < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        <Image
          key={`${gallery[active]}-${active}`}
          src={gallery[active]}
          alt={`${tour?.title || "Tour"} photo ${active + 1}`}
          fill
          preload={active === 0}
          fetchPriority={active === 0 ? "high" : "auto"}
          loading={active === 0 ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 62vw, 967px"
          className="tour-gallery-slide is-active"
          onLoad={() => setThumbnailsReady(true)}
        />
        {gallery.length > 1 ? (
          <>
            <button className="tour-gallery-arrow tour-gallery-prev" type="button" onClick={() => showPhoto(active - 1)} aria-label="Previous photo">‹</button>
            <button className="tour-gallery-arrow tour-gallery-next" type="button" onClick={() => showPhoto(active + 1)} aria-label="Next photo">›</button>
          </>
        ) : null}
        <div className="tour-gallery-actions">
          <button type="button" onClick={favoriteTour} aria-label="Add tour to favorites">♡</button>
          <button type="button" onClick={shareTour} aria-label="Share tour">↗</button>
        </div>
        <a className="tour-gallery-expand" href={gallery[active]} target="_blank" rel="noreferrer" aria-label="Open current photo">↗</a>
      </div>
      <div className="tour-gallery-thumbs">
        {visibleThumbnails.map((src, offset) => {
          const index = thumbnailStart + offset;
          return (
          <button
            key={`thumb-${src}-${index}`}
            type="button"
            className={`tour-gallery-thumb ${index === active ? "is-active" : ""}`}
            onClick={() => setActive(index)}
            aria-label={`View photo ${index + 1}`}
          >
            {thumbnailsReady || index === active ? (
              <Image src={src} alt="" width={80} height={80} loading="lazy" />
            ) : null}
          </button>
          );
        })}
      </div>
      <span className="tour-gallery-count" aria-live="polite">{active + 1} / {gallery.length}</span>
      {actionMessage ? <p className="tour-gallery-message" role="status">{actionMessage}</p> : null}
    </section>
  );
}

function normalizedDestinationSlug(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tourDestinationCount(tour: Tour | null) {
  const destinations = tour?.destinations ?? [];
  const featuredDestinations = destinations.filter((destination) => !destination.global && destination.enabled && destination.featured);
  const globalDestinations = destinations.filter((destination) => destination.global && destination.enabled);
  const namedRegions = featuredDestinations.filter((destination) => {
    const titleSlug = normalizedDestinationSlug(String(destination.title || destination.name || ""));
    return titleSlug && titleSlug === String(destination.slug || "").toLowerCase();
  });
  return globalDestinations.length + namedRegions.length || featuredDestinations.length;
}

function TourInfo({ tour }: { tour: Tour | null }) {
  const category = tour?.categories?.[0]?.title || tour?.category?.name || "—";
  const destinationCount = tourDestinationCount(tour);

  return (
    <>
      <section className="tour-info-grid">
        <div className="tour-info-card">
          <TourInfoIcon type="duration" />
          <span className="tour-info-label">Duration</span>
          <span className="tour-info-value">{tour?.duration || `${tour?.duration_in_days || 1} Days`}</span>
        </div>
        <div className="tour-info-card">
          <TourInfoIcon type="cities" />
          <span className="tour-info-label">Cities</span>
          <span className="tour-info-value">{destinationCount} Cities</span>
        </div>
        <div className="tour-info-card">
          <TourInfoIcon type="type" />
          <span className="tour-info-label">Type</span>
          <span className="tour-info-value">{tour?.type || "Private Tour"}</span>
        </div>
        <div className="tour-info-card">
          <TourInfoIcon type="category" />
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

function TourInfoIcon({ type }: { type: "duration" | "cities" | "type" | "category" }) {
  const paths = {
    duration: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    cities: <><path d="M5 21v-8l7-4 7 4v8" /><path d="M9 21v-4h6v4M12 3v6" /></>,
    type: <><path d="M4 20V9l8-5 8 5v11" /><path d="M8 20v-6h8v6" /></>,
    category: <><path d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z" /></>,
  } as const;
  return <svg className="tour-info-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

type TourDestination = NonNullable<Tour["destinations"]>[number];

function destinationMapUrl(destinations: TourDestination[], activeDestination: TourDestination) {
  const coordinates = destinations
    .map((destination) => ({ latitude: Number(destination.latitude), longitude: Number(destination.longitude) }))
    .filter(({ latitude, longitude }) => Number.isFinite(latitude) && Number.isFinite(longitude));
  const activeLatitude = Number(activeDestination.latitude);
  const activeLongitude = Number(activeDestination.longitude);
  if (!coordinates.length || !Number.isFinite(activeLatitude) || !Number.isFinite(activeLongitude)) return "";
  const latitudes = coordinates.map(({ latitude }) => latitude);
  const longitudes = coordinates.map(({ longitude }) => longitude);
  const latitudePadding = Math.max(0.8, (Math.max(...latitudes) - Math.min(...latitudes)) * 0.18);
  const longitudePadding = Math.max(0.8, (Math.max(...longitudes) - Math.min(...longitudes)) * 0.18);
  const bounds = [Math.min(...longitudes) - longitudePadding, Math.min(...latitudes) - latitudePadding, Math.max(...longitudes) + longitudePadding, Math.max(...latitudes) + latitudePadding];
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.join("%2C")}&layer=mapnik&marker=${activeLatitude}%2C${activeLongitude}`;
}

function DeferredTourMapImage({ sizes }: { sizes: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="tour-deferred-map-image">
      {visible ? <Image src="/images/map.png" alt="Tour destinations map" fill sizes={sizes} /> : null}
    </div>
  );
}

function DestinationMap({ destinations, activeDestination }: { destinations: TourDestination[]; activeDestination: TourDestination }) {
  const mapUrl = destinationMapUrl(destinations, activeDestination);
  return (
    <div className="tour-destinations-map">
      {mapUrl ? (
        <iframe key={mapUrl} src={mapUrl} title={`Map showing ${activeDestination.title || "tour destination"}`} loading="lazy" />
      ) : (
        <DeferredTourMapImage sizes="(max-width: 800px) 100vw, 50vw" />
      )}
    </div>
  );
}

function DestinationList({ destinations, activeDestination, onSelect }: { destinations: TourDestination[]; activeDestination: TourDestination; onSelect: (destination: TourDestination) => void }) {
  return (
    <div className="tour-destinations-list" aria-label="Tour destinations">
      {destinations.map((destination) => (
        <button key={destination.id || destination.slug} type="button" className={destination === activeDestination ? "is-active" : ""} onClick={() => onSelect(destination)}>
          <span className="tour-destination-marker" aria-hidden="true" />
          <span>{destination.title || destination.name}</span>
        </button>
      ))}
    </div>
  );
}

function TourDestinationsModal({ tour, locale, destinations, open, onClose }: { tour: Tour; locale: Locale; destinations: TourDestination[]; open: boolean; onClose: () => void }) {
  const { format } = useCurrency();
  const [activeDestination, setActiveDestination] = useState(destinations[0]);
  const { actionMessage, shareTour } = useTourActions(tour, locale);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!open || !activeDestination) return null;

  function openBookingPanel() {
    onClose();
    window.dispatchEvent(new CustomEvent("tour:open-booking"));
  }

  return (
    <div className="tour-destinations-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="tour-destinations-modal" role="dialog" aria-modal="true" aria-labelledby="tour-destinations-title">
        <header className="tour-destinations-head">
          <h2 id="tour-destinations-title">View Destinations</h2>
          <button type="button" onClick={onClose} aria-label="Close destinations">×</button>
        </header>
        <div className="tour-destinations-layout">
          <DestinationMap destinations={destinations} activeDestination={activeDestination} />
          <div className="tour-destinations-summary">
            <h3>{tour.title || tour.name}</h3>
            <div className="tour-destinations-price-row">
              <div><span>Price</span><strong>{format(tour.adult_price || tour.start_from || tour.price || 0)}</strong></div>
              <button className="btn-outline" type="button" onClick={shareTour}>Share</button>
            </div>
            <button className="btn-primary tour-destinations-book" type="button" onClick={openBookingPanel}>Book now</button>
            <h4>Destinations</h4>
            <DestinationList destinations={destinations} activeDestination={activeDestination} onSelect={setActiveDestination} />
            {actionMessage ? <p className="tour-booking-status" role="status">{actionMessage}</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function TourHighlights({ tour, locale }: { tour: Tour | null; locale: Locale }) {
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const featuredDestinations = tour?.destinations?.filter((d) => !d.global && d.enabled && d.featured) ?? [];
  const attractionDestinations = tour?.destinations?.filter((destination) => !destination.global && !destination.featured && destination.enabled) ?? [];

  return (
    <section className="tour-highlights">
      <Collapsible title="Highlights" defaultOpen>
        {tour?.highlights ? (
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(tour.highlights) }} />
        ) : (
          <>
            <div className="tour-highlights-map">
              <DeferredTourMapImage sizes="100vw" />
              <button type="button" className="tour-map-button" onClick={() => setDestinationsOpen(true)}>
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
            {tour && attractionDestinations.length ? (
              <TourDestinationsModal tour={tour} locale={locale} destinations={attractionDestinations} open={destinationsOpen} onClose={() => setDestinationsOpen(false)} />
            ) : null}
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

function TourAddOns({ options, selected, onChange }: { options: NonNullable<Tour["options"]>; selected: number[]; onChange: (ids: number[]) => void }) {
  const { format } = useCurrency();
  return (
    <section className="tour-addons">
      <Collapsible title="Add-ons" defaultOpen>
        <div className="tour-addon-list">
          {options.map((option) => (
            <label key={option.id} className="tour-addon">
              <input
                type="checkbox"
                value={option.id}
                name="tour_options"
                checked={selected.includes(Number(option.id))}
                onChange={(event) => {
                  const id = Number(option.id);
                  onChange(updatedSelectedOptions(selected, id, event.target.checked));
                }}
              />
              <span className="tour-addon-name">{option.name}</span>
              <span className="tour-addon-price">{format(option.adult_price || 0)}</span>
            </label>
          ))}
        </div>
      </Collapsible>
    </section>
  );
}

function updatedSelectedOptions(selected: number[], optionId: number, checked: boolean) {
  return checked ? [...selected, optionId] : selected.filter((selectedId) => selectedId !== optionId);
}

function TourBookingAddOns({ options, selected, optionsTotal, onChange }: { options: NonNullable<Tour["options"]>; selected: number[]; optionsTotal: number; onChange: (ids: number[]) => void }) {
  const { format } = useCurrency();
  const [expanded, setExpanded] = useState(true);
  return (
    <section className="tour-booking-amount" aria-labelledby="tour-booking-amount-title">
      <h4 id="tour-booking-amount-title">Amount</h4>
      <div className="tour-booking-addons-head">
        <div>
          <strong>Add-ons</strong>
          <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>{expanded ? "Hide details" : "See details"}</button>
        </div>
        <strong>{format(optionsTotal)}</strong>
      </div>
      {expanded ? (
        <div className="tour-booking-addon-list">
          {options.map((option) => {
            const optionId = Number(option.id);
            return (
              <label key={option.id || option.name}>
                <input type="checkbox" checked={selected.includes(optionId)} onChange={(event) => onChange(updatedSelectedOptions(selected, optionId, event.target.checked))} />
                <span>{option.name}</span>
                <strong>{format(option.adult_price || 0)}</strong>
              </label>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function matchingSeason(tour: Tour | null | undefined, dateString?: string) {
  if (!Array.isArray(tour?.seasons)) return null;
  const parsed = parseLocalCalendarDate(dateString);
  if (!parsed) return null;

  return tour!.seasons!.find((season) => {
    const availability = season?.calender_availability;
    if (!availability) return false;
    return (
      availability.day_numbers?.includes(parsed.day) &&
      availability.day_names?.includes(parsed.weekday) &&
      availability.month_names?.includes(parsed.monthName) &&
      availability.years_numbers?.includes(parsed.year)
    );
  }) ?? null;
}

function TourRightPanel({ tour, locale, selectedOptions, onSelectedOptionsChange }: { tour: Tour | null; locale: Locale; selectedOptions: number[]; onSelectedOptionsChange: (ids: number[]) => void }) {
  const router = useRouter();
  const { format } = useCurrency();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { actionMessage, favoriteTour, shareTour } = useTourActions(tour, locale);

  useEffect(() => {
    const openBookingPanel = () => {
      setMobileOpen(true);
      requestAnimationFrame(() => document.querySelector<HTMLInputElement>(".tour-field input")?.focus());
    };
    window.addEventListener("tour:open-booking", openBookingPanel);
    return () => window.removeEventListener("tour:open-booking", openBookingPanel);
  }, []);

  // Inquiry tours bypass all booking/pricing logic and render a contact form instead.
  if (tour?.is_inquiry) {
    return (
      <aside className="tour-right-panel">
        <div className="tour-booking-card tour-inquiry-card">
          <h3 className="tour-inquiry-title">Contact Us For Checking Availability</h3>
          <ContactForm locale={locale} tourId={tour?.id} tourTitle={tour?.title} />
        </div>
      </aside>
    );
  }

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
  const passengerTotal = offer ? baseTotal - baseTotal * (offer / 100) : baseTotal;
  const optionsTotal = (tour?.options ?? [])
    .filter((option) => option?.id != null && selectedOptions.includes(Number(option.id)))
    .reduce((sum, option) => sum + optionCost(option, adults, children), 0);
  const total = passengerTotal + optionsTotal;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tour?.id) return;
    setStatus("loading");
    try {
      await apiPost(
        "cart/tours/append",
        {
          tour_id: tour.id,
          start_date: date,
          adults,
          children,
          infants,
          options: selectedOptions,
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
      <div className={`tour-booking-dialog ${mobileOpen ? "is-open" : ""}`} role="dialog" aria-modal={mobileOpen || undefined} aria-label="Book this tour">
        <button className="tour-booking-backdrop" type="button" onClick={() => setMobileOpen(false)} aria-label="Close booking panel" />
        <div className="tour-booking-card">
          <button className="tour-booking-close" type="button" onClick={() => setMobileOpen(false)} aria-label="Close booking panel">×</button>
          <div className="tour-booking-price">
            <div>
              <span className="tour-booking-label">Price</span>
              <strong className="tour-price-current">{format(passengerTotal)}</strong>
              {offer ? <span className="tour-price-original">{format(baseTotal)}</span> : null}
            </div>
            <button type="button" className="btn-outline btn-sm" onClick={shareTour}>
              Share
            </button>
          </div>

          <form className="tour-booking-form" onSubmit={submit}>
            <label className="tour-field">
              <span>Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
            </label>

            <div className="tour-passengers">
              <span className="tour-booking-label">Passengers</span>
              <Counter label="Adults (12+)" value={adults} onChange={setAdults} min={1} />
              <Counter label="Children (3 - 11)" value={children} onChange={setChildren} />
              <Counter label="Infants (0 - 2)" value={infants} onChange={setInfants} />
            </div>

            {tour?.options?.length ? (
              <TourBookingAddOns options={tour.options} selected={selectedOptions} optionsTotal={optionsTotal} onChange={onSelectedOptionsChange} />
            ) : null}

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
            <button type="button" className="btn-outline" onClick={favoriteTour}>
              Favorites
            </button>
            <a className="btn-outline" href={whatsappInquiryUrl(`I want to inquire about a tour (${tour?.title})`)} target="_blank" rel="noreferrer">
              Ask a question
            </a>
          </div>
          {actionMessage ? <p className="tour-booking-status" role="status">{actionMessage}</p> : null}
        </div>
      </div>

      <div className="tour-mobile-booking-bar">
        <div><span>Price</span><strong>{format(total)}</strong></div>
        <button type="button" className="btn-primary" onClick={() => setMobileOpen(true)}>Book now</button>
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
            const days = availability.day_numbers ?? [];
            const monthLabel = months.map((month) => month.slice(0, 3).replace(/^./, (letter) => letter.toUpperCase())).join(" & ");
            const dayLabel = days.length ? `${Math.min(...days)} - ${Math.max(...days)}` : "";
            const yearLabel = years.join(" & ");
            const seasonLabel = monthLabel
              ? `${dayLabel ? `(${dayLabel}) ` : ""}${monthLabel}${yearLabel ? ` ${yearLabel}` : ""}`
              : season.title || `Season ${index + 1}`;
            return (
              <div key={index} className="tour-season-card">
                <p className="tour-season-date">{seasonLabel}</p>
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
  { type: "shorts", image: "/images/shorts.png", icon: "/images/shorts-gallary.png", url: "https://www.youtube.com/channel/UCCsn_rbLMuer0kJd9iK6RDA" },
  { type: "youtube", image: "/images/youtubetwo.png", icon: "/images/youtube-gallary.png", url: "https://www.youtube.com/channel/UCCsn_rbLMuer0kJd9iK6RDA" },
  { type: "facebook", image: "/images/youtubetwo.png", icon: "/images/fb-logo.webp", url: "https://www.facebook.com/SunPyramidsTours/" },
  { type: "youtube", image: "/images/youtubeone.png", icon: "/images/youtube-gallary.png", url: "https://www.youtube.com/channel/UCCsn_rbLMuer0kJd9iK6RDA" },
  { type: "tiktok", image: "/images/tiktok.png", icon: "/images/tiktok-gallary.png", url: "https://www.tiktok.com/@sunpyramidstours" },
  { type: "instagram", image: "/images/instagram.png", icon: "/images/insta-gallary.png", url: "https://www.instagram.com/sunpyramidstours/" },
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
              <Image src={item.image || "/images/shorts.png"} alt="" fill sizes="20vw" loading="lazy" />
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
