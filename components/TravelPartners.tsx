import Image from "next/image";
import { SwipeCarousel } from "@/components/SwipeCarousel";

const partners = [
  "partner1.webp", "civitatis.webp", "partner.webp", "partner2.webp", "partner3.webp",
  "partner4.webp", "partner5.webp", "partner6.webp", "partner7.webp", "partner8.webp",
  "partner9.webp", "partner12.webp", "partner99.webp", "tourradar.webp", "viator.webp",
];

export function TravelPartners() {
  return (
    <SwipeCarousel className="home-partners" ariaLabel="Travel partners">
      {partners.map((name) => (
        <Image
          key={name}
          src={`https://sunpyramidtours.com/storage/media/pages/assets/partner/${name}`}
          alt="Sun Pyramids Tours partner"
          width={110}
          height={72}
        />
      ))}
    </SwipeCarousel>
  );
}
