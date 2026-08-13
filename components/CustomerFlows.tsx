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
import { generateRecaptchaToken } from "@/lib/recaptcha";
import { useCurrency } from "@/components/CurrencyProvider";

type ApiResponse<T = any> = {
  status?: boolean;
  message?: string;
  data?: T;
};

type LoadState = "idle" | "loading" | "success" | "error";

const allowedPaymentRedirectHosts = new Set([
  "paypal.com",
  "www.paypal.com",
  "sandbox.paypal.com",
  "www.sandbox.paypal.com",
  "fawaterk.com",
  "www.fawaterk.com",
  "checkout.fawaterk.com",
  "staging-checkout.fawaterk.com",
  "sunpyramidtours.com",
  "www.sunpyramidtours.com",
  "sunpyramidstours.com",
  "www.sunpyramidstours.com",
]);

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function statusClass(state: LoadState) {
  return state === "error" ? "form-message error" : "form-message";
}

function isAllowedPaymentRedirect(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedPaymentRedirectHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
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

function couponIdFrom(value: any) {
  return value?.id || value?.coupon_id || value?.coupon?.id || null;
}

function cartRemoveIdentifier(item: any) {
  if (item?.type === "tour") return item?.tour?.id || null;
  if (item?.type === "rental") return item?.id || null;
  if (item?.tour?.id) return item.tour.id;
  return item?.id || null;
}

function cartItemTotal(item: any): number | null {
  const tour = item?.tour;
  if (tour) {
    const adults = Number(item?.adults) || 1;
    const children = Number(item?.children) || 0;
    const infants = Number(item?.infants) || 0;
    const groups = Array.isArray(tour.pricing_groups) ? tour.pricing_groups : [];
    const group = groups.find((g: any) => adults >= Number(g?.from) && adults <= Number(g?.to));
    const adultRate = group ? Number(group.price) : Number(tour.adult_price ?? tour.start_from ?? tour.price ?? 0);
    const childRate = group ? Number(group.child_price) : Number(tour.child_price ?? 0);
    const infantRate = Number(tour.infant_price ?? 0);
    let total = adultRate * adults + childRate * children + infantRate * infants;
    if (Array.isArray(item.options)) {
      total += item.options.reduce((sum: number, option: any) => sum + Number(option?.adult_price ?? 0) * adults + Number(option?.child_price ?? 0) * children, 0);
    }
    const offer = Number(tour.offer) || 0;
    if (offer) total -= total * (offer / 100);
    return Number.isFinite(total) ? total : null;
  }
  const fallback = Number(item?.total ?? item?.price ?? item?.car_route_price);
  return Number.isFinite(fallback) && fallback > 0 ? fallback : null;
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
  const { selected, format } = useCurrency();
  const [state, setState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [hasToken, setHasToken] = useState(false);
  const [coupon, setCoupon] = useState<any>(null);

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

  async function removeCartItem(item: any) {
    const removeId = cartRemoveIdentifier(item);
    if (!removeId) {
      setState("error");
      setMessage("This cart item cannot be safely removed because its backend identifier is missing.");
      return;
    }
    setState("loading");
    try {
      const res = await apiDelete<ApiResponse>(`cart/remove/${removeId}`, locale, true);
      await loadCart(hasToken);
      setMessage(res.message || "Cart item removed.");
    } catch (error) {
      setState("error");
      setMessage(messageFromError(error));
    }
  }

  async function editTourCartItem(event: FormEvent<HTMLFormElement>, item: any) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const tourId = item?.tour?.id;
    if (!tourId) return;
    setState("loading");
    try {
      const options = String(form.get("options") || "")
        .split(",")
        .map((value) => Number(value.trim()))
        .filter(Boolean);
      const res = await apiPost<ApiResponse>("cart/tours/append", {
        tour_id: tourId,
        start_date: String(form.get("startDate") || item.start_date || ""),
        adults: Number(form.get("adults") || item.adults || 1),
        children: Number(form.get("children") || item.children || 0),
        infants: Number(form.get("infants") || item.infants || 0),
        options,
      }, locale, hasToken);
      await loadCart(hasToken);
      setMessage(res.message || "Cart item updated.");
    } catch (error) {
      setState("error");
      setMessage(messageFromError(error));
    }
  }

  async function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!getCookie("sunpyramids-token")) {
      setState("error");
      setMessage("Please login to apply the coupon.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const code = String(form.get("couponCode") || "").trim();
    if (!code) return;
    setState("loading");
    try {
      const res = await apiGet<ApiResponse>(`coupons/${encodeURIComponent(code)}/validate`, locale, true);
      setCoupon(res.data);
      const couponId = couponIdFrom(res.data);
      if (couponId) {
        const nextCheckoutData = { ...(checkoutData || {}), discountID: couponId };
        setCheckoutData(nextCheckoutData);
        setCookie("sunpyramids-checkout-data", JSON.stringify(nextCheckoutData));
      }
      setState("success");
      setMessage(res.message || "Coupon applied.");
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
    const paymentMethod = String(form.get("paymentMethod") || "card");
    const body: Record<string, unknown> = {
      first_name: firstName,
      last_name: lastParts.join(" ") || "none",
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      country: String(form.get("country") || ""),
      state: String(form.get("state") || ""),
      pickup_location: String(form.get("pickupLocation") || ""),
      notes: String(form.get("note") || ""),
      payment_method: paymentMethod,
      currency_id: selected.id || Number(form.get("currencyId") || 1),
      coupon_id: form.get("couponId") ? Number(form.get("couponId")) : couponIdFrom(coupon),
    };
    if (paymentMethod === "card") {
      body.payment_method_id = Number(form.get("paymentMethodId") || 9);
    }
    let bookingCreated = false;

    try {
      const res = await apiPost<ApiResponse<{ payment?: { redirect?: { location?: string } }; booking?: { id?: number } }>>("bookings", body, locale, true);
      const bookingId = res.data?.booking?.id;
      bookingCreated = !!bookingId;
      const redirect = res.data?.payment?.redirect?.location;
      if (redirect && isAllowedPaymentRedirect(redirect)) {
        window.location.href = redirect;
        return;
      }
      if (redirect) throw new Error("Payment redirect URL was not approved.");
      setState("success");
      setMessage(res.message || "Booking created.");
    } catch (error) {
      if (bookingCreated) {
        const redirectRejected = /redirect URL was not approved/i.test(messageFromError(error));
        setState("error");
        setMessage(
          redirectRejected
            ? "Booking was created, but the payment redirect was not approved. Please contact support or open your bookings before retrying checkout."
            : "Booking was created, but checkout could not finish. Please contact support or open your bookings before retrying checkout."
        );
        return;
      }
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
          <input name="state" placeholder="State" required />
          <input name="pickupLocation" placeholder="Pickup location" />
          <input name="currencyId" type="hidden" value={selected.id} />
          <input name="couponId" type="number" placeholder="Coupon ID" defaultValue={checkoutData?.discountID || ""} />
          <select name="paymentMethod" defaultValue="card" required>
            <option value="paypal">PayPal</option>
            <option value="card">Card</option>
          </select>
          <input name="paymentMethodId" type="number" placeholder="Card payment method ID" defaultValue={9} />
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
          {cart.map((item, index) => {
            const itemTotal = cartItemTotal(item);
            return (
            <article key={item.id || index}>
              <strong>{item.tour?.title || item.title || item.name || `Cart item ${index + 1}`}</strong>
              {itemTotal !== null ? <span>Total: {format(itemTotal)}</span> : null}
              {item.type === "tour" || item.tour ? (
                <form className="cart-inline-form" onSubmit={(event) => editTourCartItem(event, item)}>
                  <input name="startDate" type="date" defaultValue={String(item.start_date || "").slice(0, 10)} />
                  <input name="adults" type="number" min={1} defaultValue={item.adults || 1} aria-label="Adults" />
                  <input name="children" type="number" min={0} defaultValue={item.children || 0} aria-label="Children" />
                  <input name="infants" type="number" min={0} defaultValue={item.infants || 0} aria-label="Infants" />
                  <input name="options" placeholder="Option IDs, comma separated" defaultValue={Array.isArray(item.options) ? item.options.map((option: any) => option.id).filter(Boolean).join(",") : ""} />
                  <button className="btn-outline" type="submit" disabled={state === "loading"}>Save</button>
                </form>
              ) : null}
              <button className="btn-outline" type="button" onClick={() => removeCartItem(item)} disabled={state === "loading"}>Remove</button>
            </article>
            );
          })}
        </div>
      ) : null}
      {cart.length ? (
        <form className="cart-inline-form" onSubmit={applyCoupon}>
          <input name="couponCode" placeholder="Coupon code" />
          <button className="btn-outline" type="submit" disabled={state === "loading"}>Apply Coupon</button>
          {coupon?.value ? <span>Discount: {coupon.value}%</span> : null}
        </form>
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

export function PlannerRequestFlow({ route, locale = "en" }: { route: "make-your-trip" | "rent-car"; locale?: Locale }) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");
  const [locations, setLocations] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const isCar = route === "rent-car";

  useEffect(() => {
    async function loadOptions() {
      try {
        const [countryRes, locationRes] = await Promise.all([
          apiGet<ApiResponse<any[]>>("countries", locale, false),
          isCar ? apiGet<ApiResponse<{ data?: any[] }>>("locations?page_limit=200&order_by=id,asc", locale, false) : Promise.resolve(null),
        ]);
        setCountries(Array.isArray(countryRes.data) ? countryRes.data : []);
        if (locationRes) setLocations(Array.isArray(locationRes.data?.data) ? locationRes.data.data : []);
      } catch {
        setCountries([]);
        setLocations([]);
      }
    }
    loadOptions();
  }, [isCar, locale]);

  async function loadRentalDestinations(pickupId: string) {
    if (!pickupId) return;
    try {
      const res = await apiPost<ApiResponse<any[]>>("car/rental/available/destinations", {
        pickup_location_id: Number(pickupId),
      }, locale);
      setDestinations(Array.isArray(res.data) ? res.data : []);
    } catch {
      setDestinations([]);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      if (isCar) {
        const returnDate = String(form.get("returnDate") || "");
        const returnTime = String(form.get("returnTime") || "");
        if (form.get("type") === "roundTrip" && (!returnDate || !returnTime)) {
          throw new Error("Return date and time are required for round trips.");
        }
        const body: Record<string, unknown> = {
          pickup_location_id: String(form.get("pickupLocationId") || ""),
          destination_id: String(form.get("destinationId") || ""),
          pickup_date: String(form.get("pickupDate") || ""),
          pickup_time: String(form.get("pickupTime") || ""),
          oneway: form.get("type") !== "roundTrip",
          adults: Number(form.get("adults") || 1),
          children: Number(form.get("children") || 0),
          name: String(form.get("fullName") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || ""),
          currency_id: 1,
          nationality: String(form.get("nationality") || ""),
          stops: [],
        };
        if (returnDate) {
          body.return_date = returnDate;
          body.return_time = returnTime;
        }
        const res = await apiPost<ApiResponse>("cart/rentals/append", body, locale, !!getCookie("sunpyramids-token"));
        setState("success");
        setMessage(res.message || "Rental added to cart.");
        router.push(withLocale("/cart", locale));
        return;
      }

      const token = await generateRecaptchaToken("submit");
      const tripType = String(form.get("type") || "exact_time");
      const fullName = String(form.get("fullName") || "").trim();
      const [firstName = "", ...lastNameParts] = fullName.split(/\s+/).filter(Boolean);
      const body: Record<string, unknown> = {
        destination: "egypt",
        type: tripType,
        name: fullName,
        first_name: firstName || fullName,
        last_name: lastNameParts.join(" ") || "none",
        phone_number: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        adults: Number(form.get("adults") || 1),
        children: Number(form.get("children") || 0),
        infants: Number(form.get("infants") || 0),
        nationality: String(form.get("nationality") || ""),
        min_person_budget: Number(form.get("minBudget") || 1000),
        max_person_budget: Number(form.get("maxBudget") || 3000),
        flight_offer: form.get("flightOffer") === "on",
        additional_notes: String(form.get("note") || ""),
      };
      if (token) body.recaptcha_token = token;
      if (tripType === "exact_time") {
        const startDate = String(form.get("startDate") || "");
        const endDate = String(form.get("endDate") || "");
        if (!startDate || !endDate) {
          throw new Error("Start and end dates are required for exact time trips.");
        }
        body.start_date = startDate;
        body.end_date = endDate;
      } else if (tripType === "approx_time") {
        const month = String(form.get("month") || "");
        const days = Number(form.get("days") || 0);
        if (!month) {
          throw new Error("Month is required for approximate time trips.");
        }
        if (!days || days < 1) {
          throw new Error("Days must be a valid number of days.");
        }
        body.month = month;
        body.days = days;
      } else {
        const days = Number(form.get("days") || 0);
        if (!days || days < 1) {
          throw new Error("Days must be a valid number of days.");
        }
        body.days = days;
      }
      await apiPost<ApiResponse>("custom/trips", body, locale, !!getCookie("sunpyramids-token"));
      setState("success");
      router.push(`${withLocale("/thankful", locale)}?name=${encodeURIComponent(String(form.get("fullName") || ""))}`);
    } catch (error) {
      setState("error");
      setMessage(messageFromError(error));
    }
  }

  return (
    <form className="planner-form" onSubmit={submit}>
      <div className="step-label">Quick Info</div>
      {isCar ? (
        <>
          <select name="type" defaultValue="oneWay"><option value="oneWay">One way</option><option value="roundTrip">Round trip</option></select>
          <input name="pickupDate" type="date" required />
          <input name="pickupTime" type="time" required />
          <select name="pickupLocationId" required onChange={(event) => loadRentalDestinations(event.currentTarget.value)}>
            <option value="">Pickup location</option>
            {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
          </select>
          <select name="destinationId" required>
            <option value="">Drop-off location</option>
            {destinations.map((destination) => <option key={destination.id} value={destination.id}>{destination.name}</option>)}
          </select>
          <input name="returnDate" type="date" />
          <input name="returnTime" type="time" />
        </>
      ) : (
        <>
          <select name="type" defaultValue="exact_time"><option value="exact_time">Exact time</option><option value="approx_time">Approximate time</option><option value="not_sure">Not sure</option></select>
          <input name="startDate" type="date" />
          <input name="endDate" type="date" />
          <input name="month" placeholder="Month" />
          <input name="days" type="number" min={1} placeholder="Days" />
        </>
      )}
      <div className="step-label">Personal Info</div>
      <input name="fullName" placeholder="Full name" required />
      <input name="email" type="email" placeholder="Email address" required />
      <input name="phone" placeholder="Phone number" required />
      <select name="nationality" required>
        <option value="">Nationality</option>
        {countries.map((country) => <option key={country.id || country.name} value={country.name}>{country.name}</option>)}
      </select>
      <input name="adults" type="number" min={1} defaultValue={1} />
      <input name="children" type="number" min={0} defaultValue={0} />
      <input name="infants" type="number" min={0} defaultValue={0} />
      {!isCar ? (
        <>
          <input name="minBudget" type="number" min={0} defaultValue={1000} />
          <input name="maxBudget" type="number" min={0} defaultValue={3000} />
          <label className="inline-check"><input name="flightOffer" type="checkbox" /> Include flight offer</label>
          <textarea name="note" placeholder="Additional notes" rows={4} />
        </>
      ) : null}
      <button className="btn-primary" type="submit" disabled={state === "loading"}>{state === "loading" ? "Submitting..." : isCar ? "Add Rental To Cart" : "Submit Trip Request"}</button>
      {message ? <p className={statusClass(state)}>{message}</p> : null}
    </form>
  );
}
