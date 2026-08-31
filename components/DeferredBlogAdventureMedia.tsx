"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function DeferredBlogAdventureMedia() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.01 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="blog-post-adventure-media" aria-hidden="true">
      {visible ? (
        <>
          <Image src="/lottie/Animation - 1740995069688 (1).gif" alt="" fill unoptimized sizes="360px" />
          <Image className="blog-post-adventure-egypt" src="/lottie/Egypt.gif" alt="" fill unoptimized sizes="360px" />
        </>
      ) : null}
    </div>
  );
}
