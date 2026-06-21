import Image from "next/image";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://api.whatsapp.com/send?phone=201095888830"
      target="_blank"
      rel="noreferrer"
      aria-label="Contact Sun Pyramids on WhatsApp"
    >
      <Image src="/images/whatsapp.png" alt="" width={40} height={40} />
    </a>
  );
}
