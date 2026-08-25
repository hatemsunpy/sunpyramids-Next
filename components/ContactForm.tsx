"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/client-api";
import { generateRecaptchaToken } from "@/lib/recaptcha";
import { withLocale } from "@/lib/locales";
import { uiCopy } from "@/lib/ui-copy";
import type { Locale } from "@/types/api";

export function ContactForm({
  locale = "en",
  tourId,
  tourTitle,
  submitLabel,
}: {
  locale?: Locale;
  tourId?: number;
  tourTitle?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const copy = uiCopy(locale);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    const token = await generateRecaptchaToken("submit");
    const name = String(form.get("name") || "");
    const payload: Record<string, string> = {
      name,
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      country: String(form.get("country") || ""),
      subject: "contact-us",
      message: String(form.get("message") || ""),
      type: "form_contact",
    };
    if (token) payload.recaptcha_token = token;
    if (tourId != null) payload.tour_id = String(tourId);
    if (tourTitle) payload.tour_title = tourTitle;

    try {
      await apiPost("contact-requests", payload, locale);
      setStatus("success");
      event.currentTarget.reset();
      router.push(`${withLocale("/thankful", locale)}?name=${encodeURIComponent(name)}`);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="form-card form-grid" onSubmit={submit} aria-busy={status === "loading"}>
      <div className="form-field">
        <input name="name" placeholder={copy.fullName} autoComplete="name" required />
      </div>
      <div className="form-field">
        <input name="email" type="email" placeholder={copy.email} autoComplete="email" required />
      </div>
      <div className="form-field">
        <input name="phone" type="tel" placeholder={copy.phone} autoComplete="tel" required />
      </div>
      <div className="form-field">
        <input name="country" placeholder={copy.country} autoComplete="country-name" required />
      </div>
      <div className="form-field">
        <textarea name="message" placeholder={copy.writeUs} rows={5} required />
      </div>
      <button className="btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? copy.sending : submitLabel || copy.sendMessage}
      </button>
      <div aria-live="polite">
        {status === "success" ? <p style={{ color: "var(--primary)" }}>{copy.messageSuccess}</p> : null}
        {status === "error" ? <p style={{ color: "#dc2626" }}>{copy.messageError}</p> : null}
      </div>
    </form>
  );
}
