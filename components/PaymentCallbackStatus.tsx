"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet } from "@/lib/client-api";

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

export function PaymentCallbackStatus({
  provider,
  status,
  callback,
}: {
  provider: string;
  status: string;
  callback: PaymentCallbackKind;
}) {
  const params = useSearchParams();
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
        const response = await apiGet<ApiStatus>(`${endpointMap[callback]}?invoice_id=${encodeURIComponent(invoiceId)}`);
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
    ? "Updating Payment"
    : isSuccess && expectedSuccess
      ? "Payment Confirmed"
      : isSuccess
        ? "Payment Updated"
        : state === "missing"
          ? "Missing Invoice"
          : "Payment Update Failed";

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
          <Link className="btn-primary" href="/profile/bookings">View Bookings</Link>
          <Link className="btn-outline" href="/contact-us">Contact Support</Link>
        </div>
      </section>
    </main>
  );
}
