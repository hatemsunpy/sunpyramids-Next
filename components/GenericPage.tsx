import Image from "next/image";
import Link from "next/link";
import type { ApiPage, Locale, Tour } from "@/types/api";
import { ContactForm } from "@/components/ContactForm";
import { DestinationCard } from "@/components/DestinationCard";
import { TourCard } from "@/components/TourCard";
import { BlogCard } from "@/components/BlogCard";
import { withLocale } from "@/lib/locales";
import { sanitizeHtml } from "@/lib/sanitize-html";

type GenericPageProps = {
  page: ApiPage | null;
  fallbackTitle: string;
  route: string;
  locale?: Locale;
  faqs?: ApiPage[];
  categories?: ApiPage[];
  tours?: Tour[];
  blogs?: ApiPage[];
};

const fallbackBanners: Record<string, string> = {
  faqs: "/images/faqs-banner.png",
  "contact-us": "/images/contactForm.png",
  "about-us": "/images/aboutusmainbanner.png",
  sustainability: "/images/certification.png",
  "accessible-travel": "/images/wheelChair.png",
  "make-your-trip": "/images/makeYourTripImage.png",
  "rent-car": "/images/Cairo_Egypt_Unsplash.png",
};

function meta(page: ApiPage | null, key: string) {
  return page?.metas?.find((item) => item.meta_key === key);
}

function metaHtml(page: ApiPage | null, key: string) {
  const item = meta(page, key);
  return String(item?.meta_value || item?.value || item?.description || "");
}

function heroImage(page: ApiPage | null, route: string) {
  return page?.banner || page?.featured_image || page?.image || fallbackBanners[route] || "/images/aboutusmainbanner.png";
}

export function GenericPage({
  page,
  fallbackTitle,
  route,
  locale = "en",
  faqs = [],
  categories = [],
  tours = [],
  blogs = [],
}: GenericPageProps) {
  const title = page?.title || page?.name || fallbackTitle;
  const image = heroImage(page, route);

  if (route === "about-us") {
    return <AboutPage page={page} title={title} image={image} locale={locale} faqs={faqs} />;
  }

  if (route === "contact-us") {
    return <ContactPage page={page} title={title} image={image} locale={locale} />;
  }

  if (route === "faqs") {
    return <FaqPage title={title} image={image} faqs={faqs} locale={locale} />;
  }

  if (route === "events") {
    return <EventsPage page={page} title={title} image={image} categories={categories} locale={locale} />;
  }

  if (route === "make-your-trip" || route === "rent-car") {
    return <PlannerPage page={page} title={title} image={image} route={route} locale={locale} />;
  }

  if (route === "accessible-travel" || route === "sustainability") {
    return <ImpactPage page={page} title={title} image={image} route={route} locale={locale} tours={tours} blogs={blogs} faqs={faqs} />;
  }

  return <ContentPage page={page} title={title} image={image} />;
}

function PageHero({ title, image }: { title: string; image: string }) {
  return (
    <section className="original-page-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.55)), url(${image})` }}>
      <h1>{title}</h1>
    </section>
  );
}

function ContentPage({ page, title, image }: { page: ApiPage | null; title: string; image: string }) {
  return (
    <main>
      <PageHero title={title} image={image} />
      <section className="original-content-section container-shell">
        <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(page?.content || page?.description) }} />
      </section>
    </main>
  );
}

function ContactPage({ page, title, image, locale }: { page: ApiPage | null; title: string; image: string; locale: Locale }) {
  return (
    <main>
      <PageHero title={title} image={image} />
      <section className="contact-clone container-shell">
        <div className="contact-info-panel">
          <p className="eyebrow">Contact Info</p>
          <h2>Send Your Feedback</h2>
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(page?.content || page?.description || "We would be happy to help you plan your Egypt trip.") }} />
          <div className="contact-methods">
            <a href="tel:+201095888830">+20 109 588 8830</a>
            <a href="tel:+201095888831">+20 109 588 8831</a>
            <a href="mailto:info@sunpyramidstours.com">info@sunpyramidstours.com</a>
            <p>Pyramids View Tower - Mansourieh Intersection with Faisal - Above Tseppas Pastry - Fourth Floor</p>
          </div>
        </div>
        <ContactForm locale={locale} />
      </section>
    </main>
  );
}

function AboutPage({ page, title, image, locale, faqs }: { page: ApiPage | null; title: string; image: string; locale: Locale; faqs: ApiPage[] }) {
  const gallery = page?.gallery || [];
  const goals = [
    ["Mission", metaHtml(page, "mission")],
    ["Vision", metaHtml(page, "vision")],
  ].filter((item) => item[1]);

  return (
    <main>
      <PageHero title={title} image={image} />
      <section className="about-intro container-shell">
        <div>
          <p className="eyebrow">Since 1970</p>
          <h2>Sun Pyramids Tours</h2>
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(metaHtml(page, "about-sun-pyramids") || page?.content) }} />
        </div>
        <Image src={String(page?.feature_1 || gallery[0] || "/images/aboutusmainbanner.png")} alt={title} width={720} height={520} />
      </section>
      <section className="about-gallery">
        {gallery.slice(0, 4).map((item) => (
          <Image key={item} src={item} alt="Sun Pyramids team and guests" width={460} height={320} />
        ))}
      </section>
      <section className="about-goals container-shell">
        {goals.map(([goalTitle, html]) => (
          <article key={goalTitle}>
            <h3>{goalTitle}</h3>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
          </article>
        ))}
      </section>
      <section className="team-section container-shell">
        <div className="section-heading original-heading">
          <div>
            <h2>Our Team</h2>
            <p>The people behind your Egypt journey</p>
          </div>
        </div>
        <div className="team-grid">
          {["Ahmed_Talaat", "Yasmin_Ahmed", "NadaAbdelazim", "HagarHassan"].map((name) => (
            <Image key={name} src={`/images/team/${name}.png`} alt={name.replaceAll("_", " ")} width={260} height={300} />
          ))}
        </div>
      </section>
      <FaqTeaser faqs={faqs} locale={locale} />
    </main>
  );
}

function FaqPage({ title, image, faqs, locale }: { title: string; image: string; faqs: ApiPage[]; locale: Locale }) {
  return (
    <main>
      <PageHero title={title} image={image} />
      <section className="faq-list container-shell">
        {faqs.map((faq) => (
          <details key={faq.id} className="faq-item">
            <summary>{String(faq.question || faq.title || "Question")}</summary>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer || faq.description) }} />
          </details>
        ))}
      </section>
      <NeedHelp locale={locale} />
    </main>
  );
}

function EventsPage({ page, title, image, categories, locale }: { page: ApiPage | null; title: string; image: string; categories: ApiPage[]; locale: Locale }) {
  return (
    <main>
      <PageHero title={title} image={image} />
      {page?.short_description ? (
        <section className="event-description container-shell">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.short_description) }} />
        </section>
      ) : null}
      <section className="event-grid">
        {categories.map((category) => (
          <article className="event-card" key={category.id || category.slug}>
            <DestinationCard destination={category} basePath="/event" locale={locale} />
            <Link className="event-read-more" href={withLocale(`/event/${category.slug || category.id}`, locale)}>Read More</Link>
          </article>
        ))}
      </section>
      <GalleryStrip gallery={page?.gallery || []} />
    </main>
  );
}

function PlannerPage({ page, title, image, route, locale }: { page: ApiPage | null; title: string; image: string; route: string; locale: Locale }) {
  const isCar = route === "rent-car";
  return (
    <main>
      <PageHero title={title} image={image} />
      <section className="planner-layout container-shell">
        <div>
          <p className="eyebrow">{isCar ? "Private transfers" : "Tailor made travel"}</p>
          <h2>{isCar ? "Rent A Car" : "Make Your Trip"}</h2>
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(page?.content || page?.description) }} />
        </div>
        <div className="planner-form">
          <div className="step-label">Quick Info</div>
          <input placeholder={isCar ? "Pickup location" : "Destination"} />
          <input placeholder={isCar ? "Drop-off location" : "Travel date"} />
          <input placeholder={isCar ? "Pickup date" : "Number of travelers"} />
          <div className="step-label">Personal Info</div>
          <input placeholder="Full name" />
          <input placeholder="Email address" />
          <input placeholder="Phone number" />
          <button className="btn-primary" type="button">{isCar ? "Request Car" : "Start Planning"}</button>
        </div>
      </section>
      <NeedHelp locale={locale} />
    </main>
  );
}

function ImpactPage({
  page,
  title,
  image,
  route,
  locale,
  tours,
  blogs,
  faqs,
}: {
  page: ApiPage | null;
  title: string;
  image: string;
  route: string;
  locale: Locale;
  tours: Tour[];
  blogs: ApiPage[];
  faqs: ApiPage[];
}) {
  return (
    <main>
      <PageHero title={title} image={image} />
      <section className="impact-overview container-shell">
        <div>
          <p className="eyebrow">{route === "sustainability" ? "Responsible travel" : "Accessible travel"}</p>
          <h2>{title}</h2>
          <div className="content-prose" dangerouslySetInnerHTML={{ __html: sanitizeHtml(page?.content || page?.description) }} />
        </div>
        <Image src={route === "sustainability" ? "/images/certification.png" : "/images/wheelChair.png"} alt={title} width={520} height={420} />
      </section>
      {tours.length ? (
        <section className="section-pad container-shell">
          <div className="section-heading original-heading"><div><h2>Related Tours</h2><p>Recommended experiences from Sun Pyramids</p></div></div>
          <div className="grid-cards">{tours.slice(0, 4).map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}</div>
        </section>
      ) : null}
      {blogs.length ? (
        <section className="section-pad container-shell">
          <div className="section-heading original-heading"><div><h2>Related Blogs</h2><p>Helpful guides before you travel</p></div></div>
          <div className="grid-cards blog-grid">{blogs.slice(0, 4).map((blog) => <BlogCard key={blog.id || blog.slug} blog={blog} locale={locale} />)}</div>
        </section>
      ) : null}
      <FaqTeaser faqs={faqs} locale={locale} />
    </main>
  );
}

function GalleryStrip({ gallery }: { gallery: string[] }) {
  if (!gallery.length) return null;
  return (
    <section className="gallery-strip">
      {gallery.slice(0, 6).map((item) => (
        <Image key={item} src={item} alt="Sun Pyramids gallery" width={360} height={260} />
      ))}
    </section>
  );
}

function FaqTeaser({ faqs, locale = "en" }: { faqs: ApiPage[]; locale?: Locale }) {
  if (!faqs.length) return null;
  return (
    <section className="faq-teaser container-shell">
      <div className="section-heading original-heading">
        <div><h2>Frequently Asked Questions</h2><p>Answers for your next Egypt trip</p></div>
        <Link className="see-more-link" href={withLocale("/faqs", locale)}>See more</Link>
      </div>
      <div className="faq-list">
        {faqs.slice(0, 5).map((faq) => (
          <details key={faq.id} className="faq-item">
            <summary>{String(faq.question || faq.title || "Question")}</summary>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer || faq.description) }} />
          </details>
        ))}
      </div>
    </section>
  );
}

function NeedHelp({ locale = "en" }: { locale?: Locale }) {
  return (
    <section className="need-help-band">
      <div className="container-shell">
        <div>
          <p className="eyebrow">Need Our Help?</p>
          <h2>We would be happy to help you plan your trip</h2>
        </div>
        <Link className="btn-primary" href={withLocale("/contact-us", locale)}>Contact Us</Link>
      </div>
    </section>
  );
}
