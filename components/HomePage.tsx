import Image from "next/image";
import Link from "next/link";
import type { ApiPage, Locale, SocialLink, Tour } from "@/types/api";
import { withLocale } from "@/lib/locales";
import { TourCard } from "@/components/TourCard";
import { BlogCard } from "@/components/BlogCard";
import { TrustIndexLoader } from "@/components/TrustIndexLoader";
import { HomeNeedHelpForm } from "@/components/HomeNeedHelpForm";
import { HomeSearchShortcuts } from "@/components/HomeSearchShortcuts";
import { HomePopularTours } from "@/components/HomePopularTours";
import { HomeHeroMedia } from "@/components/HomeHeroMedia";
import { TravelPartners } from "@/components/TravelPartners";
import { SwipeCarousel } from "@/components/SwipeCarousel";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { homeCopy } from "@/lib/home-copy";

const gallery = [
  ["/images/shorts.png", "/images/shorts-gallary.png", "YouTube Shorts", "shorts"],
  ["/images/youtubeone.png", "/images/youtube-gallary.png", "YouTube", "youtube-video-1"],
  ["/images/tiktok.png", "/images/tiktok-gallary.png", "TikTok", "tiktok"],
  ["/images/instagram.png", "/images/insta-gallary.png", "Instagram", "insta-link"],
  ["/images/youtubetwo.png", "/images/fb-logo.webp", "Facebook", "youtube-video-2"],
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
  socialLinks,
  locale = "en",
}: {
  page: ApiPage | null;
  tours: Tour[];
  popularTours: Tour[];
  specialOffers: Tour[];
  highlights: ApiPage[];
  blogs: ApiPage[];
  faqs: ApiPage[];
  socialLinks: SocialLink[];
  locale?: Locale;
}) {
  const copy = homeCopy(locale);
  const heroImages = page?.gallery?.length
    ? page.gallery
    : [page?.banner || page?.image || "/images/mainBanner.png"];
  const stats = [
    ["+100K", copy.happyCustomer],
    ["+50", copy.yearsExperience],
    ["+60", copy.totalDestinations],
    ["5.0", copy.tripadvisorRating],
  ];
  const bookingSteps = [
    ["1", copy.findingTitle, copy.findingDescription],
    ["2", copy.bookingTitle, copy.bookingDescription],
    ["3", copy.enjoyTitle, copy.enjoyDescription],
  ];
  const socialUrls = new Map(socialLinks.map((item) => [item.type, item.url]));

  return (
    <main className="home-page">
      <section className="hero original-home-hero">
        <div className="hero-media">
          <HomeHeroMedia images={heroImages} alt="Sun Pyramids Tours Egypt experience" />
        </div>
        <div className="hero-content">
          <p className="hero-kicker">{copy.heroKicker}</p>
          <h1 className="hero-title">{copy.heroTitle}</h1>
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
          <Link href={withLocale("/make-your-trip", locale)}><ShortcutIcon type="make" /><strong>{copy.makeTripShort}</strong></Link>
          <Link href={withLocale("/trips", locale)}><ShortcutIcon type="find" /><strong>{copy.findTripShort}</strong></Link>
          <Link href={withLocale("/rent-car", locale)}><ShortcutIcon type="car" /><strong>{copy.rentCarShort}</strong></Link>
        </nav>
      </section>

      <section className="home-mobile-statistics" aria-label="Sun Pyramids Tours statistics">
        {stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section className="section-pad container-shell">
        <div className="section-heading original-heading">
          <div>
            <h2>{copy.seasonalTitle}</h2>
            <p>{copy.seasonalDescription}</p>
          </div>
          <Link className="see-more-link" href={withLocale("/event/egypt-christmas-event-2027", locale)}>{copy.seeMore}</Link>
        </div>
        <SwipeCarousel className="grid-cards home-mobile-card-track" ariaLabel={copy.seasonalTitle}>
          {tours.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
        </SwipeCarousel>
      </section>

      <section className="section-pad container-shell home-live-section">
        <div className="section-heading original-heading home-centered-heading">
          <div><h2>{copy.popularTitle}</h2><p>{copy.popularDescription}</p></div>
          <Link className="see-more-link" href={withLocale("/trips", locale)}>{copy.seeMore}</Link>
        </div>
        <HomePopularTours initialTours={popularTours} locale={locale} />
      </section>

      <section className="section-pad original-destination-band">
        <div className="container-shell make-trip-section">
          <div>
            <h2>{copy.makeYourTrip}</h2>
            <HomeSearchShortcuts locale={locale} destinations={highlights} modeOnly="make" />
          </div>
        </div>
      </section>

      <section className="section-pad container-shell home-live-section">
        <div className="section-heading original-heading home-centered-heading">
          <div><h2>{copy.specialOffersTitle}</h2><p>{copy.specialOffersDescription}</p></div>
          <Link className="see-more-link" href={withLocale("/trips?main=special-offers", locale)}>{copy.seeMore}</Link>
        </div>
        <SwipeCarousel className="grid-cards home-mobile-card-track" ariaLabel={copy.specialOffersTitle}>
          {specialOffers.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
        </SwipeCarousel>
      </section>

      <section className="home-how-section">
        <div className="container-shell">
          <div className="home-centered-heading"><h2>{copy.howItWorks}</h2><p>{copy.howItWorksDescription}</p></div>
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
        <div className="container-shell home-centered-heading"><h2>{copy.highlightsTitle}</h2><p>{copy.highlightsDescription}</p></div>
        <SwipeCarousel className="home-highlight-track" ariaLabel={copy.highlightsTitle}>
          {highlights.map((destination) => {
            const title = destination.title || destination.name || "Egypt";
            const image = destination.featured_image || destination.image || destination.banner || "/images/mainBanner.png";
            return <Link className="home-highlight-card" key={destination.id || destination.slug} href={withLocale(`/egypt-tours/one-day-tours/${destination.slug || destination.id}`, locale)}><Image src={image} alt={title} fill sizes="(max-width: 768px) 44vw, 24vw" /><span>{title}</span></Link>;
          })}
        </SwipeCarousel>
      </section>

      <section className="section-pad container-shell">
        <div className="section-heading original-heading">
          <div>
            <h2>{copy.travelBlogs}</h2>
          </div>
          <Link className="see-more-link" href={withLocale("/blogs/all-blogs", locale)}>{copy.seeMore}</Link>
        </div>
        <SwipeCarousel className="grid-cards blog-grid home-mobile-card-track home-blog-track" ariaLabel={copy.travelBlogs}>
          {blogs.slice(0, 4).map((blog) => <BlogCard key={blog.id || blog.slug} blog={blog} locale={locale} />)}
        </SwipeCarousel>
      </section>

      <section className="home-certification-section">
        <div><h2>Tailored <span>guidance</span> for your <span>sustainability</span> journey</h2><p>Sustainability is not an add-on — it is integrated into how we design, operate, and deliver travel experiences across Egypt.</p><Link className="btn-primary" href={withLocale("/sustainability", locale)}>{copy.seeMore}</Link></div>
        <Image src="/images/certified-logo.png" alt="Certified sustainable travel" width={430} height={350} />
      </section>

      <section className="section-pad container-shell home-gallery-section">
        <div className="home-centered-heading"><h2>{copy.galleryTitle}</h2><p>{copy.galleryDescription}</p></div>
        <SwipeCarousel className="home-social-gallery" ariaLabel={copy.galleryTitle}>
          {gallery.map(([image, icon, label, type]) => {
            const content = <><Image src={image} alt={`${label} travel moments`} fill sizes="(max-width: 768px) 72vw, 25vw" /><Image className="home-gallery-icon" src={icon} alt="" width={66} height={66} /></>;
            const url = socialUrls.get(type);
            return <article key={label}>{url ? <a href={url} target="_blank" rel="noreferrer" aria-label={label}>{content}</a> : content}</article>;
          })}
        </SwipeCarousel>
      </section>

      <section className="section-pad container-shell review-section">
        <div id="home-reviews" />
        <TrustIndexLoader containerId="home-reviews" script="https://cdn.trustindex.io/loader.js?1d15b034519c8049128609a4d4e" />
      </section>

      <section className="home-faq-section">
        <div className="home-faq-title"><h2>{copy.faqTitle}</h2><Link className="see-more-link" href={withLocale("/faqs", locale)}>{copy.seeMore}</Link></div>
        <div className="faq-list">
          {faqs.map((faq) => <details className="faq-item" key={String(faq.id || faq.question || faq.title)}><summary>{String(faq.question || faq.title || "Question")}</summary><div dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer || faq.description) }} /></details>)}
        </div>
      </section>

      <section className="home-help-section container-shell">
        <div className="home-help-panel"><h2>{copy.needHelp}</h2><HomeNeedHelpForm locale={locale} /></div>
      </section>

      <TravelPartners />
    </main>
  );
}
