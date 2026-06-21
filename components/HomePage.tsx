import Image from "next/image";
import Link from "next/link";
import type { ApiPage, Locale, Tour } from "@/types/api";
import { withLocale } from "@/lib/locales";
import { TourCard } from "@/components/TourCard";
import { BlogCard } from "@/components/BlogCard";
import { TrustIndexLoader } from "@/components/TrustIndexLoader";

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
      <section className="hero">
        <div className="hero-media">
          <Image src={heroImage} alt="Sun Pyramids Tours Egypt experience" fill priority sizes="100vw" />
        </div>
        <div className="hero-content">
          <div className="hero-kicker">Get Started</div>
          <h1 className="hero-title">Exciting Journey With Us</h1>
          <form className="shortcut-panel" action={withLocale("/trips", locale)}>
            <input name="title" placeholder="Where do you want to go?" />
            <select name="main" defaultValue="">
              <option value="">All tours</option>
              <option value="special-offers">Special offers</option>
              <option value="nile-cruises">Nile cruises</option>
            </select>
            <button className="btn-primary" type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="section-pad container-shell">
        <div className="section-heading">
          <div>
            <p className="muted">Hand-picked experiences</p>
            <h2>Special Offers</h2>
          </div>
          <Link className="btn-outline" href={withLocale("/egypt-tours/multi-days-tours", locale)}>See More</Link>
        </div>
        <div className="grid-cards">
          {tours.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
        </div>
      </section>

      <section className="section-pad" style={{ background: "#fff" }}>
        <div className="container-shell two-col">
          <div>
            <p className="muted">Tailor made travel</p>
            <h2>Make Your Trip</h2>
            <p className="content-prose">
              Build a custom Egypt itinerary with the same guided flow from the Nuxt site, backed by the Laravel API.
            </p>
            <Link className="btn-primary" href={withLocale("/make-your-trip", locale)}>Start Planning</Link>
          </div>
          <Image src="/images/makeYourTripImage.png" alt="Make your Egypt trip" width={620} height={430} style={{ width: "100%", height: "auto", borderRadius: "1.25rem" }} />
        </div>
      </section>

      <section className="section-pad container-shell">
        <div className="section-heading">
          <div>
            <p className="muted">Travel inspiration</p>
            <h2>Travel Blogs</h2>
          </div>
          <Link className="btn-outline" href={withLocale("/blogs/all-blogs", locale)}>All Blogs</Link>
        </div>
        <div className="grid-cards">
          {blogs.slice(0, 4).map((blog) => <BlogCard key={blog.id || blog.slug} blog={blog} locale={locale} />)}
        </div>
      </section>

      <section className="section-pad container-shell">
        <div id="home-reviews" style={{ minHeight: 120 }} />
        <TrustIndexLoader containerId="home-reviews" script="https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e" />
      </section>
    </main>
  );
}
