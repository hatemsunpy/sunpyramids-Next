import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { BlogTableOfContents, type BlogHeading } from "@/components/BlogTableOfContents";
import { DeferredBlogAdventureMedia } from "@/components/DeferredBlogAdventureMedia";
import { HomeNeedHelpForm } from "@/components/HomeNeedHelpForm";
import { TourCard } from "@/components/TourCard";
import { blogPostCopy } from "@/lib/blog-copy";
import { homeCopy } from "@/lib/home-copy";
import { withLocale } from "@/lib/locales";
import { sanitizeHtml } from "@/lib/sanitize-html";
import type { ApiPage, Locale } from "@/types/api";

function plainText(rawHtml: string) {
  return rawHtml
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headingId(title: string, index: number) {
  const slug = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return `article-${slug || index + 1}`;
}

function prepareArticle(rawArticleHtml: unknown) {
  const headings: BlogHeading[] = [];
  const seen = new Map<string, number>();
  const html = sanitizeHtml(rawArticleHtml).replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, rawLevel: string, rawAttributes: string, innerHtml: string) => {
      const level = Number(rawLevel) as 2 | 3;
      const title = plainText(innerHtml);
      if (!title) return _match;
      const baseId = headingId(title, headings.length);
      const duplicate = seen.get(baseId) || 0;
      seen.set(baseId, duplicate + 1);
      const id = duplicate ? `${baseId}-${duplicate + 1}` : baseId;
      headings.push({ id, level, title });
      const attributes = rawAttributes.replace(/\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
      return `<h${level}${attributes} id="${id}">${innerHtml}</h${level}>`;
    },
  );
  return { html, headings };
}

function formatDate(dateValue: string | null | undefined, locale: Locale) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function AdventureCard({ locale }: { locale: Locale }) {
  const copy = blogPostCopy(locale);
  return (
    <aside className="blog-post-adventure">
      <div className="blog-post-adventure-art">
        <h2>{copy.plan}</h2>
        <DeferredBlogAdventureMedia />
      </div>
      <div className="blog-post-adventure-actions">
        <Link className="btn-outline" href={withLocale("/trips", locale)}>{copy.explore}</Link>
        <Link className="btn-primary" href={withLocale("/make-your-trip", locale)}>{copy.make}</Link>
      </div>
    </aside>
  );
}

function BlogPostHeader({ blog, title, image, date, locale }: { blog: ApiPage; title: string; image: string; date: string; locale: Locale }) {
  const copy = blogPostCopy(locale);
  return <>
    <nav className="blog-post-breadcrumb" aria-label="Breadcrumb">
      <Link href={withLocale("/", locale)}>{copy.home}</Link><span aria-hidden="true">›</span>
      <Link href={withLocale("/blogs/all-blogs", locale)}>{copy.blogs}</Link><span aria-hidden="true">›</span>
      <span>{title}</span>
    </nav>
    <section className="blog-post-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,19,37,.5), rgba(8,19,37,.12)), url("${image}")` }}>
      <div><h1>{title}</h1>{date ? <time dateTime={blog.published_at || blog.created_at || undefined}>{date}</time> : null}</div>
    </section>
  </>;
}

function BlogPostArticle({ title, html, headings, locale }: { title: string; html: string; headings: BlogHeading[]; locale: Locale }) {
  const copy = blogPostCopy(locale);
  return <section className="blog-post-layout">
    <article className="blog-post-article">
      <h2 className="blog-post-title">{title}</h2>
      <div className="blog-post-prose" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
    <div className="blog-post-sidebar">
      {headings.length ? <aside className="blog-post-toc"><h2>{copy.contents}</h2><BlogTableOfContents headings={headings} /></aside> : null}
      <AdventureCard locale={locale} />
    </div>
  </section>;
}

function RelatedTours({ blog, locale }: { blog: ApiPage; locale: Locale }) {
  const tours = blog.related_tours || [];
  if (!tours.length) return null;
  return <section className="blog-post-section blog-post-related-tours">
    <h2>{blogPostCopy(locale).relatedTours}</h2>
    <div className="blog-post-card-track blog-post-tour-track">
      {tours.slice(0, 6).map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
    </div>
  </section>;
}

function BlogPostFaqs({ faqs, locale }: { faqs: ApiPage[]; locale: Locale }) {
  const copy = blogPostCopy(locale);
  return <section className="blog-post-section blog-post-faqs">
    <div className="blog-post-section-heading"><h2>{copy.faqs}</h2><Link href={withLocale("/faqs", locale)}>{copy.seeMore}</Link></div>
    {faqs.length ? <div className="faq-list">{faqs.map((faq) => (
      <details className="faq-item" key={String(faq.id || faq.question || faq.title)}>
        <summary>{String(faq.question || faq.title || "Question")}</summary>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.answer || faq.description) }} />
      </details>
    ))}</div> : <p className="blog-post-empty">{copy.noFaqs}</p>}
  </section>;
}

function RelatedBlogs({ blogs, locale }: { blogs: ApiPage[]; locale: Locale }) {
  if (!blogs.length) return null;
  return <section className="blog-post-related-blogs"><div className="blog-post-section">
    <h2>{blogPostCopy(locale).relatedBlogs}</h2>
    <div className="blog-post-card-track blog-post-blog-track">
      {blogs.slice(0, 5).map((blog) => <BlogCard key={blog.id || blog.slug} blog={blog} locale={locale} variant="listing" />)}
    </div>
  </div></section>;
}

export function BlogPostPage({
  blog,
  faqs,
  relatedBlogs,
  locale = "en",
}: {
  blog: ApiPage;
  faqs: ApiPage[];
  relatedBlogs: ApiPage[];
  locale?: Locale;
}) {
  const title = blog.title || blog.name || "Egypt Travel Guide";
  const image = blog.featured_image || blog.image || blog.banner || "/images/blogsHero.png";
  const date = formatDate(blog.published_at || blog.created_at, locale);
  const { html, headings } = prepareArticle(blog.description || blog.content);

  return (
    <main className="blog-post-page">
      <BlogPostHeader blog={blog} title={title} image={image} date={date} locale={locale} />
      <BlogPostArticle title={title} html={html} headings={headings} locale={locale} />
      <RelatedTours blog={blog} locale={locale} />
      <BlogPostFaqs faqs={faqs} locale={locale} />
      <RelatedBlogs blogs={relatedBlogs} locale={locale} />
      <section className="home-help-section blog-post-help">
        <div className="home-help-panel">
          <h2>{homeCopy(locale).needHelp}</h2>
          <HomeNeedHelpForm locale={locale} />
        </div>
      </section>
    </main>
  );
}
