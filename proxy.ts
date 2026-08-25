import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/locales";

export function proxy(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean)[0];
  const locale = isLocale(firstSegment) && firstSegment !== "en" ? firstSegment : "en";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-sunpyramids-route-locale", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
