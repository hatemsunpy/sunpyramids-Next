import Image from "next/image";
import Link from "next/link";
import type { ApiPage, Locale, Tour } from "@/types/api";
import { withLocale } from "@/lib/locales";
import { TourCard } from "@/components/TourCard";
import { BlogCard } from "@/components/BlogCard";
import { TrustIndexLoader } from "@/components/TrustIndexLoader";
import { HomeNeedHelpForm } from "@/components/HomeNeedHelpForm";
import { HomeSearchShortcuts } from "@/components/HomeSearchShortcuts";
import { HomePopularTours } from "@/components/HomePopularTours";
import { sanitizeHtml } from "@/lib/sanitize-html";

const stats = [
  ["+100K", "Happy customer"],
  ["+50", "Years of experience"],
  ["+60", "Total Destinations"],
  ["5.0", "Rating in Tripadvisor"],
];

const bookingSteps = [
  ["1", "Find your trip", "Choose the experience, destination, and pace that fit your journey."],
  ["2", "Book your trip", "Reserve securely and receive clear confirmation from our local team."],
  ["3", "Enjoy your trip", "Meet your guide and experience Egypt with every detail arranged."],
];

const gallery = [
  ["/images/shorts.png", "/images/shorts-gallary.png", "YouTube Shorts"],
  ["/images/youtubeone.png", "/images/youtube-gallary.png", "YouTube"],
  ["/images/tiktok.png", "/images/tiktok-gallary.png", "TikTok"],
  ["/images/instagram.png", "/images/insta-gallary.png", "Instagram"],
  ["/images/youtubetwo.png", "/images/fb-logo.webp", "Facebook"],
];

const partners = [
  "partner1.webp", "civitatis.webp", "partner.webp", "partner2.webp", "partner3.webp",
  "partner4.webp", "partner5.webp", "partner6.webp", "partner7.webp", "partner8.webp",
  "partner9.webp", "partner12.webp", "partner99.webp", "tourradar.webp", "viator.webp",
];

function ShortcutIcon({ type }: { type: "make" | "find" | "car" }) {
  if (type === "find") {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>;
  }
  if (type === "car") {
    return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 17h14l-1-6-2-3H8l-2 3-1 6Z" /><circle cx="8" cy="17" r="1.5" /><circle cx="16" cy="17" r="1.5" /></svg>;
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m3 15 8-3 3-8 2 1-1 7 5 3-1 2-6-1-3 5-2-1 1-5-5 2-1-2Z" /></svg>;
}

export function HomePage({
  page,
  tours,
  popularTours,
  specialOffers,
  highlights,
  blogs,
  faqs,
  locale = "en",
}: {
  page: ApiPage | null;
  tours: Tour[];
  popularTours: Tour[];
  specialOffers: Tour[];
  highlights: ApiPage[];
  blogs: ApiPage[];
  faqs: ApiPage[];
  locale?: Locale;
}) {
  const heroImage = page?.gallery?.[0] || page?.banner || page?.image || "/images/mainBanner.png";

  return (
    <main className="home-page">
      <section className="hero original-home-hero">
        <div className="hero-media">
          <Image src={heroImage} alt="Sun Pyramids Tours Egypt experience" fill priority sizes="100vw" />
        </div>
        <div className="hero-content">
          <p className="hero-kicker">Get Started</p>
          <h1 className="hero-title">Exciting Journey With Us</h1>
          <HomeSearchShortcuts locale={locale} destinations={highlights} />
        </div>
        <div className="hero-stats">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <nav className="home-mobile-shortcuts" aria-label="Quick trip actions">
          <Link href={withLocale("/make-your-trip", locale)}><ShortcutIcon type="make" /><strong>Make Trip</strong></Link>
          <Link href={withLocale("/trips", locale)}><ShortcutIcon type="find" /><strong>Find Trip</strong></Link>
          <Link href={withLocale("/rent-car", locale)}><ShortcutIcon type="car" /><strong>Rent Car</strong></Link>
        </nav>
      </section>

      <section className="home-mobile-statistics" aria-label="Sun Pyramids Tours statistics">
        {stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section className="section-pad container-shell">
        <div className="section-heading original-heading">
          <div>
            <h2>Egypt Easter Tours</h2>
            <p>Celebrate Easter with unforgettable Egypt Itineraries</p>
          </div>
          <Link className="see-more-link" href={withLocale("/egypt-tours/multi-days-tours/easter-packages", locale)}>See more</Link>
        </div>
        <div className="grid-cards">
          {tours.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
        </div>
      </section>

      <section className="section-pad container-shell home-live-section">
        <div className="section-heading original-heading home-centered-heading">
          <div><h2>Popular Destination</h2><p>Explore our most recommended Egypt tours and experiences</p></div>
          <Link className="see-more-link" href={withLocale("/trips", locale)}>See more</Link>
        </div>
        <HomePopularTours initialTours={popularTours} locale={locale} />
      </section>

      <section className="section-pad original-destination-band">
        <div className="container-shell two-col make-trip-section">
          <div>
            <h2>Make Your Trip</h2>
            <p className="content-prose">
              Customize every step of your Egypt journey with Sun Pyramids Tours, from route planning to guided visits and transport.
            </p>
            <Link className="btn-primary" href={withLocale("/make-your-trip", locale)}>Start Planning</Link>
          </div>
          <Image src="/images/makeYourTripImage.png" alt="Make your Egypt trip" width={620} height={430} />
        </div>
      </section>

      <section className="section-pad container-shell home-live-section">
        <div className="section-heading original-heading home-centered-heading">
          <div><h2>Special offers for you</h2><p>Save on selected Egypt tours and vacation packages</p></div>
          <Link className="see-more-link" href={withLocale("/trips?main=special-offers", locale)}>See more</Link>
        </div>
        <div className="grid-cards">
          {specialOffers.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
        </div>
      </section>

      <section className="home-how-section">
        <div className="container-shell">
          <div className="home-centered-heading"><h2>How it works?</h2><p>Plan your Egypt journey in three simple steps</p></div>
          <div className="home-booking-steps">
            {bookingSteps.map(([number, title, description], index) => (
              <div className="home-step-wrap" key={number}>
                <article className="home-step"><strong>{number}</strong><div><h3>{title}</h3><p>{description}</p></div></article>
                {index < bookingSteps.length - 1 ? <Image src="/images/arrow_steps.png" alt="" width={96} height={36} /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad home-highlights-section">
        <div className="container-shell home-centered-heading"><h2>Highlights of Egypt</h2><p>Discover the places that make every Egypt journey unforgettable</p></div>
        <div className="home-highlight-track">
          {highlights.map((destination) => {
            const title = destination.title || destination.name || "Egypt";
            const image = destination.featured_image || destination.image || destination.banner || "/images/mainBanner.png";
            return <Link className="home-highlight-card" key={destination.id || destination.slug} href={withLocale(`/egypt-tours/one-day-tours/${destination.slug || destination.id}`, locale)}><Image src={image} alt={title} fill sizes="(max-width: 768px) 44vw, 24vw" /><span>{title}</span></Link>;
          })}
        </div>
      </section>

      <section className="section-pad container-shell">
        <div className="section-heading original-heading">
          <div>
            <h2>Travel Blogs</h2>
            <p>Fresh Egypt travel advice, guides, and inspiration</p>
          </div>
          <Link className="see-more-link" href={withLocale("/blogs/all-blogs", locale)}>See more</Link>
        </div>
        <div className="grid-cards blog-grid">
          {blogs.slice(0, 4).map((blog) => <BlogCard key={blog.id || blog.slug} blog={blog} locale={locale} />)}
        </div>
      </section>

      <section className="home-certification-section">
        <div><h2>Tailored <span>guidance</span> for your <span>sustainability</span> journey</h2><p>Sustainability is not an add-on. It is integrated into how we design, operate, and deliver travel experiences across Egypt.</p><Link className="btn-primary" href={withLocale("/sustainability", locale)}>See more</Link></div>
        <Image src="/images/certified-logo.png" alt="Certified sustainable travel" width={430} height={350} />
      </section>

      <section className="section-pad container-shell home-gallery-section">
        <div className="home-centered-heading"><h2>Gallery of Exciting journeys</h2><p>Follow moments from our travellers across Egypt</p></div>
        <div className="home-social-gallery">
          {gallery.map(([image, icon, label]) => <article key={label}><Image src={image} alt={`${label} travel moments`} fill sizes="(max-width: 768px) 72vw, 25vw" /><Image className="home-gallery-icon" src={icon} alt={label} width={66} height={66} /></article>)}
        </div>
      </section>

      <section className="section-pad container-shell review-section">
        <div id="home-reviews" />
        <TrustIndexLoader containerId="home-reviews" script="https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e" />
      </section>

      <section className="home-faq-section">
        <div className="home-faq-title"><h2>Frequently Asked Questions</h2><Link className="see-more-link" href={withLocale("/faqs", locale)}>See more</Link></div>
        <div className="faq-list">
          {faqs.map((faq) => <details className="faq-item" key={String(faq.id || faq.question || faq.title)}><summary>{String(faq.question || faq.title || "Question")}</summary><div dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer || faq.description) }} /></details>)}
        </div>
      </section>

      <section className="home-help-section container-shell">
        <div className="home-help-panel"><h2>Need help to Finding your Trip?</h2><HomeNeedHelpForm locale={locale} /></div>
      </section>

      <section className="home-partners" aria-label="Travel partners">
        {partners.map((name) => <Image key={name} src={`https://sunpyramidtours.com/storage/media/pages/assets/partner/${name}`} alt="Sun Pyramids Tours partner" width={110} height={72} />)}
      </section>
    </main>
  );
}
