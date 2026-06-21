"use client";

import { FormEvent, useState } from "react";
import { apiPost } from "@/lib/client-api";
import type { Locale } from "@/types/api";

export function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      await apiPost("contact-requests", payload, locale);
      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="form-card form-grid" onSubmit={submit}>
      <div className="form-field">
        <input name="name" placeholder="Full name" required />
      </div>
      <div className="form-field">
        <input name="email" type="email" placeholder="Email address" required />
      </div>
      <div className="form-field">
        <input name="phone" placeholder="Phone number" />
      </div>
      <div className="form-field">
        <textarea name="message" placeholder="How can we help?" rows={5} required />
      </div>
      <button className="btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send A Message"}
      </button>
      {status === "success" ? <p style={{ color: "var(--primary)" }}>Your message was sent successfully.</p> : null}
      {status === "error" ? <p style={{ color: "#dc2626" }}>Something went wrong. Please try again.</p> : null}
    </form>
  );
}
