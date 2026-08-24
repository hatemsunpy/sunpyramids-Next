"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/client-api";
import { withLocale } from "@/lib/locales";
import type { ApiPage, Locale } from "@/types/api";

type SearchMode = "make" | "find" | "car";
type LocationOption = { id?: number; name?: string };
type ApiListResponse<T> = { data?: T[] | { data?: T[] } };

function listData<T>(response: ApiListResponse<T>): T[] {
  if (Array.isArray(response.data)) return response.data;
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

function DateTimeField({ name, placeholder, nativeType }: { name: string; placeholder: string; nativeType: "date" | "datetime-local" }) {
  const [type, setType] = useState<"text" | "date" | "datetime-local">("text");
  return (
    <input
      name={name}
      onBlur={(event) => { if (!event.target.value) setType("text"); }}
      onChange={(event) => { if (event.target.value) setType(nativeType); }}
      onFocus={() => setType(nativeType)}
      placeholder={placeholder}
      required
      type={type}
    />
  );
}

export function HomeSearchShortcuts({ locale = "en", destinations }: { locale?: Locale; destinations: ApiPage[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>("make");
  const [makeType, setMakeType] = useState("existTime");
  const [carType, setCarType] = useState("oneWay");
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [dropLocations, setDropLocations] = useState<LocationOption[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    if (mode !== "car") return;
    apiGet<ApiListResponse<LocationOption>>("locations?page_limit=200&order_by=id,asc", locale, false)
      .then((response) => setLocations(listData(response)))
      .catch(() => setLocations([]));
  }, [locale, mode]);

  async function loadDropLocations(pickupId: string) {
    if (!pickupId) return;
    setLoadingLocations(true);
    try {
      const response = await apiPost<{ data?: LocationOption[] }>("car/rental/available/destinations", { pickup_location_id: Number(pickupId) }, locale);
      setDropLocations(Array.isArray(response.data) ? response.data : []);
    } catch {
      setDropLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (mode === "find") {
      router.push(withLocale(`/trips?days=${form.get("duration")}&distination=${encodeURIComponent(String(form.get("place") || ""))}`, locale));
      return;
    }
    if (mode === "car") {
      const params = new URLSearchParams({ type: carType, picupDate: String(form.get("pickupDate") || ""), location: String(form.get("location") || ""), dropLoaction: String(form.get("dropLocation") || "") });
      if (carType === "roundTrip") params.set("returnDate", String(form.get("returnDate") || ""));
      router.push(`${withLocale("/rent-car", locale)}?${params.toString()}`);
      return;
    }
    const params = new URLSearchParams({ type: makeType });
    if (makeType === "existTime") {
      params.set("from", String(form.get("fromDate") || ""));
      params.set("to", String(form.get("toDate") || ""));
    } else if (makeType === "approximateTime") {
      params.set("month", String(form.get("month") || ""));
    } else {
      params.set("days", String(form.get("days") || ""));
    }
    router.push(`${withLocale("/make-your-trip", locale)}?${params.toString()}`);
  }

  return (
    <form className="home-search-panel" onSubmit={submit}>
      <div className="home-search-tabs" role="tablist" aria-label="Trip search modes">
        {([["make", "Make Your Trip"], ["find", "Find your trip"], ["car", "Rent Car"]] as const).map(([value, label]) => (
          <button className={mode === value ? "is-active" : ""} key={value} onClick={() => setMode(value)} role="tab" aria-selected={mode === value} type="button">{label}</button>
        ))}
      </div>
      {mode === "make" ? (
        <div className="home-search-fields home-search-make-fields">
          <fieldset aria-label="When will you be traveling?" role="radiogroup"><span className="home-search-question">When will you be traveling?</span><label><input checked={makeType === "existTime"} name="makeType" onChange={() => setMakeType("existTime")} type="radio" /> Have An Exact Time</label><label><input checked={makeType === "approximateTime"} name="makeType" onChange={() => setMakeType("approximateTime")} type="radio" /> Have An Approximate Time</label><label><input checked={makeType === "notSureYet"} name="makeType" onChange={() => setMakeType("notSureYet")} type="radio" /> Not Sure Yet</label></fieldset>
          {makeType === "existTime" ? <><label><span>From</span><DateTimeField name="fromDate" nativeType="date" placeholder="Select the start date of the trip" /></label><label><span>To</span><DateTimeField name="toDate" nativeType="date" placeholder="Select the end date of the trip" /></label></> : null}
          {makeType === "approximateTime" ? <label><span>Expected month</span><input name="month" required type="month" /></label> : null}
          {makeType === "notSureYet" ? <label><span>How many days?</span><input min="1" name="days" required type="number" placeholder="Enter number of days" /></label> : null}
          <button className="btn-primary" type="submit">Make Trip</button>
        </div>
      ) : null}
      {mode === "find" ? <div className="home-search-fields"><label><span>Where?</span><select defaultValue="" name="place" required><option disabled value="">Choose your favorite place in Egypt</option>{destinations.map((destination) => <option key={String(destination.id || destination.slug)} value={destination.slug || destination.id}>{destination.title || destination.name}</option>)}</select></label><label><span>How Long?</span><select defaultValue="" name="duration" required><option disabled value="">How many days do you stay in Egypt</option>{Array.from({ length: 45 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? "Day" : "Days"}</option>)}</select></label><button className="btn-primary" type="submit">Search</button></div> : null}
      {mode === "car" ? <div className="home-search-fields home-search-car-fields"><fieldset aria-label="Type of Trip?" role="radiogroup"><span className="home-search-question">Type of Trip?</span><label><input checked={carType === "oneWay"} name="carType" onChange={() => setCarType("oneWay")} type="radio" value="oneWay" /> One Way</label><label><input checked={carType === "roundTrip"} name="carType" onChange={() => setCarType("roundTrip")} type="radio" value="roundTrip" /> Round Trip</label></fieldset><label><span>Car Holder</span><select defaultValue="" name="location" onChange={(event) => loadDropLocations(event.target.value)} required><option disabled value="">Choose Pick-Up Location</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label><label><span>Drop Off Location</span><select defaultValue="" name="dropLocation" required><option disabled value="">{loadingLocations ? "Loading..." : "Choose Drop-Off Location"}</option>{dropLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label><label><span>Pick Up Date and time</span><DateTimeField name="pickupDate" nativeType="datetime-local" placeholder="Choose the time and date for Pick Up" /></label>{carType === "roundTrip" ? <label><span>Return date and time</span><DateTimeField name="returnDate" nativeType="datetime-local" placeholder="Choose the time and date for return" /></label> : null}<button className="btn-primary" type="submit">Send Request</button></div> : null}
    </form>
  );
}
