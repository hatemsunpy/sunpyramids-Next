"use client";

import { useEffect, useState } from "react";

export type BlogHeading = {
  id: string;
  level: 2 | 3;
  title: string;
};

export function BlogTableOfContents({ headings }: { headings: BlogHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id || "");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -62% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="blog-post-toc-links" aria-label="Article sections">
      {headings.map((heading) => (
        <a
          className={`${heading.level === 3 ? "is-child " : ""}${activeId === heading.id ? "is-active" : ""}`}
          href={`#${heading.id}`}
          key={heading.id}
          onClick={() => setActiveId(heading.id)}
        >
          {heading.title}
        </a>
      ))}
    </nav>
  );
}
