import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { ApiPage, Locale, Tour } from "@/types/api";
import { BlogCard } from "@/components/BlogCard";
import { ContactForm } from "@/components/ContactForm";
import { AccountFlow, AuthFlow, CartFlow } from "@/components/CustomerFlows";
import { DestinationCard } from "@/components/DestinationCard";
import { PaymentCallbackKind, PaymentCallbackStatus } from "@/components/PaymentCallbackStatus";
import { TourCard } from "@/components/TourCard";
import { TrustIndexLoader } from "@/components/TrustIndexLoader";
import { withLocale } from "@/lib/locales";
import { sanitizeHtml } from "@/lib/sanitize-html";

export function AuthPage({ mode, locale = "en" }: { mode: string; locale?: Locale }) {
  return (
    <main className="auth-clone">
      <section className="auth-panel">
        <div className="auth-top">
          <Link href={withLocale("/", locale)}><Image src="/images/Artboard 5.png" alt="Sun Pyramids" width={86} height={86} /></Link>
        </div>
        <Suspense fallback={<div className="auth-form-wrap"><p className="eyebrow">Sun Pyramids Tours</p><h1>Account</h1></div>}>
          <AuthFlow mode={mode} locale={locale} />
        </Suspense>
      </section>
      <section className="auth-image"><Image src="/images/authHero.png" alt="Egypt travel" fill sizes="50vw" /></section>
    </main>
  );
}

export function AccountPage({ view = "profile", locale = "en" }: { view?: string; locale?: Locale }) {
  return (
    <main className="account-page">
      <section className="original-page-hero" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.55)), url(/images/authHero.png)" }}>
        <h1>{view === "bookings" ? "My Bookings" : view === "favourites" ? "Favourites" : view === "settings" ? "Profile Settings" : "Profile"}</h1>
      </section>
      <section className="account-layout container-shell">
        <aside>
          {[
            ["Profile", "/profile"],
            ["Bookings", "/profile/bookings"],
            ["Favourites", "/profile/favourites"],
            ["Settings", "/profile/settings"],
          ].map(([label, href]) => <Link key={href} href={withLocale(href, locale)}>{label}</Link>)}
        </aside>
        <AccountFlow view={view} locale={locale} />
      </section>
    </main>
  );
}

export function CartClonePage({ checkout = false, locale = "en" }: { checkout?: boolean; locale?: Locale }) {
  return (
    <main>
      <section className="original-page-hero" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.55)), url(/images/Cairo_Egypt_Unsplash.png)" }}>
        <h1>{checkout ? "Checkout" : "Cart"}</h1>
      </section>
      <section className="cart-layout container-shell">
        <CartFlow checkout={checkout} locale={locale} />
        <aside className="cart-summary">
          <h3>Summary</h3>
          <p>Subtotal</p>
          <strong>$0.00</strong>
          <button className="btn-primary" type="button">Continue</button>
        </aside>
      </section>
    </main>
  );
}

export function PaymentStatusPage({ provider, status, callback }: { provider: string; status: string; callback: PaymentCallbackKind }) {
  return (
    <Suspense fallback={<PaymentCallbackShell provider={provider} title="Updating Payment" />}>
      <PaymentCallbackStatus provider={provider} status={status} callback={callback} />
    </Suspense>
  );
}

function PaymentCallbackShell({ provider, title }: { provider: string; title: string }) {
  return (
    <main className="payment-status">
      <section className="status-card">
        <p className="eyebrow">{provider}</p>
        <div className="payment-mark is-loading" aria-hidden="true" />
        <h1>{title}</h1>
        <p className="muted">Please wait while we confirm your payment with Sun Pyramids Tours.</p>
      </section>
    </main>
  );
}

export function TripsListingPage({ page, tours, locale = "en" }: { page: ApiPage | null; tours: Tour[]; locale?: Locale }) {
  return (
    <main>
      <section className="original-page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.55)), url(${page?.banner || "/images/mainBanner.png"})` }}>
        <h1>{page?.title || "Egypt Tours"}</h1>
      </section>
      <section className="trips-layout">
        <aside className="trips-filter">
          <h3>Tours Type</h3>
          {["Day Tour", "Multi Days Tours", "Nile Cruises", "Shore Excursions", "Special Offers"].map((item) => <span key={item}>{item}</span>)}
          <h3>Egypt Destinations</h3>
          {["Cairo", "Luxor", "Aswan", "Hurghada", "Alexandria"].map((item) => <span key={item}>{item}</span>)}
        </aside>
        <div className="trips-results">
          <div className="section-heading original-heading"><div><h2>Egypt Tours</h2><p>Browse all available Sun Pyramids tours</p></div></div>
          <div className="grid-cards">{tours.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}</div>
        </div>
      </section>
    </main>
  );
}

export function TravelGuidePage({ page, categories, blogs, locale = "en" }: { page: ApiPage | null; categories: ApiPage[]; blogs?: ApiPage[]; locale?: Locale }) {
  return (
    <main>
      <section className="original-page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.55)), url(${page?.banner || "/images/blogsHero.png"})` }}>
        <h1>{page?.title || "Egypt Travel Guide"}</h1>
      </section>
      <section className="faq-search-section"><div className="container-shell"><input placeholder="Search Egypt travel guide" /></div></section>
      {categories.length ? (
        <section className="destination-grid-section">
          {categories.map((category) => <DestinationCard key={category.id || category.slug} destination={category} basePath="/egypt-travel-guide" locale={locale} />)}
        </section>
      ) : null}
      {blogs?.length ? <section className="section-pad container-shell grid-cards blog-grid">{blogs.map((blog) => <BlogCard key={blog.id || blog.slug} blog={blog} locale={locale} />)}</section> : null}
    </main>
  );
}

export function EventDetailPage({ event, relatedTours, locale = "en" }: { event: ApiPage | null; relatedTours: Tour[]; locale?: Locale }) {
  const title = event?.title || event?.name || "Egypt Event";
  return (
    <main>
      <section className="original-page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.55)), url(${event?.banner || event?.featured_image || "/images/eventsHero.png"})` }}>
        <h1>{title}</h1>
      </section>
      <section className="event-detail-layout container-shell">
        <article>
          <h2>{title}</h2>
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event?.description || event?.content) }} />
        </article>
        <aside className="booking-panel">
          <p className="eyebrow">Event details</p>
          <h3>{title}</h3>
          <ContactForm locale={locale} />
        </aside>
      </section>
      {relatedTours.length ? <section className="section-pad container-shell"><div className="grid-cards">{relatedTours.slice(0, 4).map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}</div></section> : null}
    </main>
  );
}

export function MarketingLandingPage({ page, tours, locale = "en" }: { page: ApiPage | null; tours: Tour[]; locale?: Locale }) {
  return (
    <main>
      <section className="landing-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.55)), url(${page?.banner || "/images/mainBanner.png"})` }}>
        <div>
          <p className="eyebrow">Sun Pyramids Tours</p>
          <h1>{page?.title || "Book Egypt Trip"}</h1>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(page?.short_description || page?.description) }} />
          <Link className="btn-primary" href={withLocale("/make-your-trip", locale)}>Plan Your Trip</Link>
        </div>
      </section>
      <section className="why-grid container-shell">
        {["Private guided tours", "Flexible itineraries", "Trusted local team"].map((item) => <article key={item}><h3>{item}</h3><p>Experience Egypt with thoughtful planning, helpful support, and carefully selected tours.</p></article>)}
      </section>
      {tours.length ? <section className="section-pad container-shell"><div className="grid-cards">{tours.slice(0, 4).map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}</div></section> : null}
      <section className="container-shell landing-contact"><ContactForm locale={locale} /></section>
      <TrustIndexLoader containerId="home-reviews" script="https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e" />
    </main>
  );
}

export function ThankfulPage() {
  return (
    <main className="payment-status">
      <section className="status-card">
        <p className="eyebrow">Thank you</p>
        <h1>Your request has been received</h1>
        <p className="muted">Sun Pyramids Tours will contact you shortly with the next steps.</p>
        <Link className="btn-primary" href="/">Back Home</Link>
      </section>
    </main>
  );
}
