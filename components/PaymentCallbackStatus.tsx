"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet } from "@/lib/client-api";
import { withLocale } from "@/lib/locales";
import { uiCopy } from "@/lib/ui-copy";
import type { Locale } from "@/types/api";

type CallbackState = "loading" | "success" | "error" | "missing";

type ApiStatus = {
  status?: boolean;
  message?: string;
};

const endpointMap = {
  "paypal-verify": "payments/paypal/capture",
  "paypal-canceled": "payments/paypal/cancel",
  "fawaterk-success": "payments/fawaterk/update/invoice",
  "fawaterk-pending": "payments/fawaterk/update/invoice",
  "fawaterk-canceled": "payments/fawaterk/update/invoice",
} as const;

export type PaymentCallbackKind = keyof typeof endpointMap;

// React development checks can mount a callback route more than once. Share
// the in-flight request so one invoice URL cannot issue concurrent updates.
const callbackRequests = new Map<string, Promise<ApiStatus>>();

function requestCallbackStatus(callback: PaymentCallbackKind, invoiceId: string) {
  const requestKey = `${callback}:${invoiceId}`;
  const existing = callbackRequests.get(requestKey);
  if (existing) return existing;
  const request = apiGet<ApiStatus>(`${endpointMap[callback]}?invoice_id=${encodeURIComponent(invoiceId)}`);
  callbackRequests.set(requestKey, request);
  request.catch(() => callbackRequests.delete(requestKey));
  return request;
}

export function PaymentCallbackStatus({
  provider,
  status,
  callback,
  locale = "en",
}: {
  provider: string;
  status: string;
  callback: PaymentCallbackKind;
  locale?: Locale;
}) {
  const params = useSearchParams();
  const copy = uiCopy(locale);
  const invoiceId = params.get("invoice_id");
  const [state, setState] = useState<CallbackState>("loading");
  const [message, setMessage] = useState("");
  const processedKey = useRef<string | null>(null);

  const expectedSuccess = useMemo(() => ["success", "verify"].includes(status), [status]);

  useEffect(() => {
    let canceled = false;

    async function updateInvoice() {
      if (!invoiceId) {
        setState("missing");
        setMessage("Missing invoice id in the payment callback URL.");
        return;
      }
      const requestKey = `${callback}:${invoiceId}`;
      if (processedKey.current === requestKey) return;
      processedKey.current = requestKey;

      try {
        const response = await requestCallbackStatus(callback, invoiceId);
        if (canceled) return;
        setState(response.status ? "success" : "error");
        setMessage(response.message || "");
      } catch (error) {
        if (canceled) return;
        setState("error");
        setMessage(error instanceof Error ? error.message : "Payment callback request failed.");
      }
    }

    updateInvoice();

    return () => {
      canceled = true;
    };
  }, [callback, invoiceId]);

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const title = isLoading
    ? copy.paymentPending
    : isSuccess && expectedSuccess
      ? copy.paymentSuccess
      : isSuccess
        ? "Payment Updated"
        : state === "missing"
          ? "Missing Invoice"
          : copy.paymentFailed;

  return (
    <main className="payment-status">
      <section className="status-card">
        <p className="eyebrow">{provider}</p>
        <div className={`payment-mark ${isLoading ? "is-loading" : isSuccess ? "is-success" : "is-error"}`} aria-hidden="true">
          {isLoading ? "" : isSuccess ? "✓" : "×"}
        </div>
        <h1>{title}</h1>
        <p className="muted">
          {isLoading
            ? "Please wait while we confirm your payment with Sun Pyramids Tours."
            : message || "Your payment callback has been processed."}
        </p>
        <div className="status-actions">
          <Link className="btn-primary" href={withLocale("/profile/bookings", locale)}>{copy.myBookings}</Link>
          <Link className="btn-outline" href={withLocale("/contact-us", locale)}>{copy.contact}</Link>
        </div>
      </section>
    </main>
  );
}
