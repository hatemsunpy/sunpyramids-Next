"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HomeHeroMedia({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), 3000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return <Image key={images[active]} src={images[active]} alt={alt} fill priority={active === 0} sizes="100vw" />;
}
