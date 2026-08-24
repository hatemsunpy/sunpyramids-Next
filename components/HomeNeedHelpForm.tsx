"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/client-api";
import { generateRecaptchaToken } from "@/lib/recaptcha";
import { withLocale } from "@/lib/locales";
import type { Locale } from "@/types/api";

export function HomeNeedHelpForm({ locale = "en" }: { locale?: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFailed(false);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const token = await generateRecaptchaToken("submit");
    try {
      await apiPost("contact-requests", {
        name,
        phone: String(form.get("phone") || ""),
        country: String(form.get("country") || ""),
        subject: "Need help to Finding my Trip",
        message: "Need help to Finding my Trip",
        email: `${Date.now()}.home@sunpyramidstours.com`,
        type: "home_contact",
        ...(token ? { recaptcha_token: token } : {}),
      }, locale);
      router.push(`${withLocale("/thankful", locale)}?name=${encodeURIComponent(name)}`);
    } catch {
      setFailed(true);
      setPending(false);
    }
  }

  return (
    <form className="home-help-form" onSubmit={submit}>
      <label><span>Full name</span><input name="name" required autoComplete="name" /></label>
      <label><span>Nationality</span><input name="country" required autoComplete="country-name" /></label>
      <label><span>Phone</span><input name="phone" type="tel" required autoComplete="tel" /></label>
      <button className="btn-primary" disabled={pending} type="submit">{pending ? "Sending..." : "Contact Now"}</button>
      {failed ? <p role="alert">Something went wrong. Please try again.</p> : null}
    </form>
  );
}
