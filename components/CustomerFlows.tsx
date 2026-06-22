"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { Locale } from "@/types/api";
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  clientApiUrl,
  getCookie,
  setCookie,
} from "@/lib/client-api";
import { withLocale } from "@/lib/locales";

type ApiResponse<T = any> = {
  status?: boolean;
  message?: string;
  data?: T;
};

type LoadState = "idle" | "loading" | "success" | "error";

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function statusClass(state: LoadState) {
  return state === "error" ? "form-message error" : "form-message";
}

function readUserCookie() {
  const raw = getCookie("sunpyramids-user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthFlow({ mode, locale = "en" }: { mode: string; locale?: Locale }) {
  const router = useRouter();
  const params = useSearchParams();
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");
  const [rememberEmail, setRememberEmail] = useState("");
  const title = {
    "sign-in": "Welcome back",
    "sign-up": "Create New Account",
    "forget-password": "Forget Password",
    "reset-password": "Reset Password",
    "create-password": "Create Password",
    "confirm-code": "Confirm Code",
  }[mode] || "Account";

  useEffect(() => {
    queueMicrotask(() => setRememberEmail(getCookie("sunpyramids-email") || ""));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      if (mode === "sign-in") {
        const email = String(form.get("email") || "");
        const password = String(form.get("password") || "");
        const remember = form.get("signSave") === "on";
        const res = await apiPost<ApiResponse<{ accessToken?: string; [key: string]: unknown }>>("auth/login", { email, password }, locale);
        if (res.data?.accessToken) {
          setCookie("sunpyramids-token", res.data.accessToken);
          setCookie("sunpyramids-user", JSON.stringify(res.data));
          setCookie("sunpyramids-email", remember ? email : null);
        }
        setMessage(res.message || "Signed in successfully.");
        setState("success");
        router.push(withLocale("/", locale));
        return;
      }

      if (mode === "sign-up") {
        const body = {
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          password: String(form.get("password") || ""),
          password_confirmation: String(form.get("confirmPassword") || ""),
        };
        const res = await apiPost<ApiResponse>("auth/register", body, locale);
        setMessage(res.message || "Account created successfully.");
        setState("success");
        router.push(withLocale("/auth/sign-in", locale));
        return;
      }

      if (mode === "forget-password") {
        const email = String(form.get("email") || "");
        const res = await apiPost<ApiResponse>("auth/password/forget", { email }, locale);
        setMessage(res.message || "Confirmation code sent.");
        setState("success");
        router.push(`${withLocale("/auth/confirm-code", locale)}?email=${encodeURIComponent(email)}`);
        return;
      }

      if (mode === "confirm-code") {
        const email = String(form.get("email") || params.get("email") || "");
        const otp = String(form.get("otp") || "");
        await apiPost<ApiResponse>("auth/password/otp/verify", { email, otp }, locale);
        setMessage("Code confirmed.");
        setState("success");
        router.push(`${withLocale("/auth/create-password", locale)}?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
        return;
      }

      if (mode === "create-password") {
        const body = {
          email: String(form.get("email") || params.get("email") || ""),
          otp: String(form.get("otp") || params.get("otp") || ""),
          password: String(form.get("password") || ""),
          password_confirmation: String(form.get("confirmPassword") || ""),
        };
        const res = await apiPost<ApiResponse>("auth/password/reset", body, locale);
        setMessage(res.message || "Password updated.");
        setState("success");
        router.push(withLocale("/auth/sign-in", locale));
        return;
      }

      if (mode === "reset-password") {
        const body = {
          email: String(form.get("email") || params.get("email") || ""),
          token: String(form.get("token") || params.get("token") || ""),
          password: String(form.get("password") || ""),
          password_confirmation: String(form.get("confirmPassword") || ""),
        };
        const res = await apiPost<ApiResponse>("client/reset-password", body, locale);
        setMessage(res.message || "Password updated.");
        setState("success");
        router.push(withLocale("/auth/sign-in", locale));
      }
    } catch (error) {
      setState("error");
      setMessage(messageFromError(error));
    }
  }

  function socialRedirect(endpoint: string) {
    window.location.href = clientApiUrl(endpoint);
  }

  const isPasswordMode = mode.includes("password") || mode === "sign-in" || mode === "sign-up";

  return (
    <div className="auth-form-wrap">
      <p className="eyebrow">Sun Pyramids Tours</p>
      <h1>{title}</h1>
      {mode === "sign-in" || mode === "sign-up" ? (
        <div className="social-row">
          <button type="button" onClick={() => socialRedirect("auth/google/redirect")}>Google</button>
          <button type="button" onClick={() => socialRedirect("auth/facebook/redirect/")}>Facebook</button>
        </div>
      ) : null}
      <form className="auth-form" onSubmit={submit}>
        {mode === "sign-up" ? <input name="name" placeholder="Full name" required /> : null}
        {mode === "confirm-code" || mode === "create-password" || mode === "reset-password" ? (
          <input name="email" type="email" placeholder="Email address" defaultValue={params.get("email") || ""} required />
        ) : null}
        {mode === "sign-in" || mode === "sign-up" || mode === "forget-password" ? (
          <input name="email" type="email" placeholder="Email address" defaultValue={mode === "sign-in" ? rememberEmail : ""} required />
        ) : null}
        {mode === "confirm-code" ? <input name="otp" placeholder="Confirmation code" inputMode="numeric" minLength={6} maxLength={6} required /> : null}
        {mode === "reset-password" ? <input name="token" placeholder="Reset token" defaultValue={params.get("token") || ""} required /> : null}
        {mode === "create-password" ? <input name="otp" placeholder="Confirmation code" defaultValue={params.get("otp") || ""} required /> : null}
        {isPasswordMode ? <input name="password" type="password" placeholder="Password" minLength={8} required /> : null}
        {mode === "sign-up" || mode === "create-password" || mode === "reset-password" ? (
          <input name="confirmPassword" type="password" placeholder="Confirm password" minLength={8} required />
        ) : null}
        {mode === "sign-in" ? (
          <label className="inline-check">
            <input name="signSave" type="checkbox" defaultChecked={!!rememberEmail} /> Save login
          </label>
        ) : null}
        {mode === "sign-up" ? (
          <label className="inline-check">
            <input name="agreeTerms" type="checkbox" required /> I agree to the terms and conditions
          </label>
        ) : null}
        <button className="btn-primary" type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Please wait..." : title}
        </button>
      </form>
      {message ? <p className={statusClass(state)}>{message}</p> : null}
      <div className="auth-links">
        <Link href={withLocale("/auth/sign-in", locale)}>Sign in</Link>
        <Link href={withLocale("/auth/sign-up", locale)}>Create account</Link>
        <Link href={withLocale("/auth/forget-password", locale)}>Forgot password?</Link>
      </div>
    </div>
  );
}

export function AccountFlow({ view = "profile", locale = "en" }: { view?: string; locale?: Locale }) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const hasToken = !!getCookie("sunpyramids-token");
    const cookieUser = readUserCookie();
    queueMicrotask(() => {
      setIsAuthenticated(hasToken);
      setUser(cookieUser);
    });

    async function load() {
      if (!hasToken) {
        setState("idle");
        return;
      }
      try {
        if (view === "bookings") {
          const res = await apiGet<ApiResponse<{ data?: any[] }>>("bookings?page_limit=200&includes=currency,tours", locale);
          setItems(Array.isArray(res.data?.data) ? res.data.data : []);
        } else if (view === "favourites") {
          const res = await apiGet<ApiResponse<{ data?: any[] }>>("wishlist?page=1&page_limit=200", locale);
          setItems(Array.isArray(res.data?.data) ? res.data.data : []);
        }
        setState("success");
      } catch (error) {
        setState("error");
        setMessage(messageFromError(error));
      }
    }

    load();
  }, [locale, view]);

  function logout() {
    setCookie("sunpyramids-token", null);
    setCookie("sunpyramids-user", null);
    router.push(withLocale("/", locale));
  }

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const currentUser = user || {};
    const body: Record<string, unknown> = {
      ...currentUser,
      name: String(form.get("fullName") || currentUser.name || ""),
      email: String(form.get("email") || currentUser.email || ""),
      phone: String(form.get("phone") || currentUser.phone || ""),
      nationality: String(form.get("nationality") || currentUser.nationality || ""),
      birthdate: String(form.get("birthDate") || currentUser.birthdate || ""),
      password: null,
      password_confirmation: null,
    };
    const password = String(form.get("password") || "");
    if (password) {
      body.password = password;
      body.password_confirmation = String(form.get("confirmPassword") || "");
    }

    try {
      const res = await apiPatch<ApiResponse>("profile", body, locale);
      const nextUser = { ...body };
      delete nextUser.password;
      delete nextUser.password_confirmation;
      setCookie("sunpyramids-user", JSON.stringify(nextUser));
      setUser(nextUser);
      setState("success");
      setMessage(res.message || "Profile updated successfully.");
    } catch (error) {
      setState("error");
      setMessage(messageFromError(error));
    }
  }

  return (
    <div className="account-card">
      <div className="account-card-head">
        <p className="eyebrow">Account area</p>
        {isAuthenticated ? <button className="btn-outline" type="button" onClick={logout}>Logout</button> : null}
      </div>
      {!isAuthenticated ? (
        <>
          <h2>Sign in required</h2>
          <p className="muted">Sign in to sync your bookings, favourites, profile settings, and checkout activity.</p>
          <Link className="btn-primary" href={withLocale("/auth/sign-in", locale)}>Sign in</Link>
        </>
      ) : view === "settings" || view === "profile" ? (
        <form className="form-grid account-form" onSubmit={updateProfile}>
          <input name="fullName" placeholder="Full name" defaultValue={user?.name || ""} required />
          <input name="email" type="email" placeholder="Email" defaultValue={user?.email || ""} required />
          <input name="phone" placeholder="Phone" defaultValue={user?.phone || ""} />
          <input name="birthDate" type="date" defaultValue={user?.birthdate || ""} />
          <input name="nationality" placeholder="Nationality" defaultValue={user?.nationality || ""} />
          <input name="password" type="password" placeholder="New password" minLength={8} />
          <input name="confirmPassword" type="password" placeholder="Confirm password" minLength={8} />
          <button className="btn-primary" type="submit" disabled={state === "loading"}>Save Changes</button>
          {message ? <p className={statusClass(state)}>{message}</p> : null}
        </form>
      ) : (
        <>
          <h2>{view === "bookings" ? "My Bookings" : "My Favorites"}</h2>
          {state === "loading" ? <p className="muted">Loading...</p> : null}
          {state === "error" ? <p className="form-message error">{message}</p> : null}
          {state !== "loading" && items.length === 0 ? <p className="muted">{view === "bookings" ? "There are no bookings." : "The wishlist is empty."}</p> : null}
          {items.length ? (
            <div className="account-list">
              {items.map((item, index) => (
                <article key={item.id || item.slug || index}>
                  <strong>{item.title || item.name || item.code || `Item ${index + 1}`}</strong>
                  {item.email ? <span>{item.email}</span> : null}
                </article>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export function CartFlow({ checkout = false, locale = "en" }: { checkout?: boolean; locale?: Locale }) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [hasToken, setHasToken] = useState(false);

  async function loadCart(tokenExists = hasToken) {
    setState("loading");
    try {
      const res = await apiGet<ApiResponse<any[]>>("cart/list", locale, tokenExists);
      setCart(Array.isArray(res.data) ? res.data : []);
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(messageFromError(error));
    }
  }

  useEffect(() => {
    const tokenExists = !!getCookie("sunpyramids-token");
    queueMicrotask(() => setHasToken(tokenExists));
    if (checkout) {
      const raw = getCookie("sunpyramids-checkout-data");
      if (raw) {
        try {
          queueMicrotask(() => setCheckoutData(JSON.parse(raw)));
        } catch {
          queueMicrotask(() => setCheckoutData(null));
        }
      }
    }
    queueMicrotask(() => loadCart(tokenExists));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout, locale]);

  async function clearCart() {
    setState("loading");
    try {
      const res = await apiDelete<ApiResponse>("cart/clear", locale);
      setCart([]);
      setState("success");
      setMessage(res.message || "Cart cleared.");
    } catch (error) {
      setState("error");
      setMessage(messageFromError(error));
    }
  }

  async function checkoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") || "");
    const [firstName, ...lastParts] = fullName.split(" ");
    const body = {
      first_name: firstName,
      last_name: lastParts.join(" ") || "none",
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      country: String(form.get("country") || ""),
      state: String(form.get("state") || ""),
      pickup_location: String(form.get("pickupLocation") || ""),
      note: String(form.get("note") || ""),
      currency_id: Number(form.get("currencyId") || 1),
      coupon_id: form.get("couponId") ? Number(form.get("couponId")) : null,
    };

    try {
      const res = await apiPost<ApiResponse<{ payment?: { redirect?: { location?: string } }; booking?: { id?: number } }>>("bookings", body, locale, true);
      setState("success");
      setMessage(res.message || "Booking created.");
      const redirect = res.data?.payment?.redirect?.location;
      if (redirect) window.location.href = redirect;
    } catch (error) {
      setState("error");
      setMessage(messageFromError(error));
    }
  }

  if (checkout) {
    return (
      <div className="cart-empty checkout-form-card">
        <p className="eyebrow">Secure checkout</p>
        <h2>Complete Your Booking</h2>
        <form className="form-grid" onSubmit={checkoutSubmit}>
          <input name="fullName" placeholder="Full name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" placeholder="Phone" required />
          <input name="country" placeholder="Country" required />
          <input name="state" placeholder="State" />
          <input name="pickupLocation" placeholder="Pickup location" />
          <input name="currencyId" type="number" placeholder="Currency ID" defaultValue={1} />
          <input name="couponId" type="number" placeholder="Coupon ID" defaultValue={checkoutData?.discountID || ""} />
          <textarea name="note" placeholder="Note" rows={4} />
          <button className="btn-primary" type="submit" disabled={state === "loading"}>{state === "loading" ? "Creating booking..." : "Create Booking"}</button>
        </form>
        {message ? <p className={statusClass(state)}>{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="cart-empty">
      <p className="eyebrow">Your cart</p>
      <h2>Your cart is ready for your next Egypt tour</h2>
      {state === "loading" ? <p className="muted">Loading cart...</p> : null}
      {state === "error" ? <p className="form-message error">{message}</p> : null}
      {state !== "loading" && cart.length === 0 ? <p className="muted">Add tours or car rentals to continue.</p> : null}
      {cart.length ? (
        <div className="account-list">
          {cart.map((item, index) => (
            <article key={item.id || index}>
              <strong>{item.tour?.title || item.title || item.name || `Cart item ${index + 1}`}</strong>
              {item.total ? <span>Total: {item.total}</span> : null}
            </article>
          ))}
        </div>
      ) : null}
      <div className="status-actions">
        <Link className="btn-primary" href={withLocale("/trips", locale)}>Explore Trips</Link>
        {cart.length ? <Link className="btn-outline" href={withLocale("/cart/checkout", locale)}>Checkout</Link> : null}
        {cart.length ? <button className="btn-outline" type="button" onClick={clearCart}>Clear Cart</button> : null}
      </div>
      {message && state !== "error" ? <p className="form-message">{message}</p> : null}
    </div>
  );
}

export async function toggleWishlist(tourId: number | string, locale: Locale = "en") {
  if (!getCookie("sunpyramids-token")) {
    throw new Error("Please login to like the tour");
  }
  return apiPut<ApiResponse>(`wishlist/${tourId}/toggle`, locale, true);
}
