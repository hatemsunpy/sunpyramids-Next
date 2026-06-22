import Image from "next/image";
import Link from "next/link";
import type { ApiPage, Locale, Tour } from "@/types/api";
import { withLocale } from "@/lib/locales";
import { TourCard } from "@/components/TourCard";
import { BlogCard } from "@/components/BlogCard";
import { TrustIndexLoader } from "@/components/TrustIndexLoader";

const stats = [
  ["+100K", "Happy customer"],
  ["+50", "Years of experience"],
  ["+60", "Total Destinations"],
  ["5.0", "Rating in Tripadvisor"],
];

export function HomePage({
  page,
  tours,
  blogs,
  locale = "en",
}: {
  page: ApiPage | null;
  tours: Tour[];
  blogs: ApiPage[];
  locale?: Locale;
}) {
  const heroImage = page?.gallery?.[0] || page?.banner || page?.image || "/images/mainBanner.png";

  return (
    <main>
      <section className="hero original-home-hero">
        <div className="hero-media">
          <Image src={heroImage} alt="Sun Pyramids Tours Egypt experience" fill priority sizes="100vw" />
        </div>
        <div className="hero-content">
          <p className="hero-kicker">Get Started</p>
          <h1 className="hero-title">Exciting Journey With Us</h1>
          <form className="shortcut-panel original-shortcuts" action={withLocale("/trips", locale)}>
            <div className="shortcut-tabs" aria-label="Trip search modes">
              <span>Make Trip</span>
              <span>Find Trip</span>
              <span>Rent Car</span>
            </div>
            <input name="title" placeholder="Where do you want to go?" />
            <select name="main" defaultValue="">
              <option value="">All tours</option>
              <option value="special-offers">Special offers</option>
              <option value="nile-cruises">Nile cruises</option>
            </select>
            <button className="btn-primary" type="submit">Search</button>
          </form>
        </div>
        <div className="hero-stats">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
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

      <section className="section-pad container-shell review-section">
        <div id="home-reviews" />
        <TrustIndexLoader containerId="home-reviews" script="https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e" />
      </section>
    </main>
  );
}
