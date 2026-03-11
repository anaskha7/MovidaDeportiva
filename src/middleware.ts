import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_ROLE } from "./lib/session";

const PRIVATE_PATHS = ["/directo", "/videos", "/app"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(SESSION_COOKIE_ROLE)?.value;

  const isAdminPath = pathname.startsWith("/admin");
  const isPrivatePath = PRIVATE_PATHS.some((path) => pathname.startsWith(path));

  if (!isAdminPath && !isPrivatePath) {
    return NextResponse.next();
  }

  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "auth");
    return NextResponse.redirect(url);
  }

  if (isAdminPath && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "forbidden");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/directo/:path*", "/videos/:path*", "/app/:path*"],
};
