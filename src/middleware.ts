import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_TOKEN } from "./lib/session-cookies";
import { getSessionFromCookieValue } from "./lib/session-token";

const PRIVATE_PATHS = ["/directo", "/videos", "/app", "/administracion"];

function applyNoStore(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromCookieValue(
    request.cookies.get(SESSION_COOKIE_TOKEN)?.value,
  );
  const role = session?.role;

  const isAdminPath = pathname.startsWith("/admin") || pathname === "/dashboard";
  const isPrivatePath = PRIVATE_PATHS.some((path) => pathname.startsWith(path));

  if (!isAdminPath && !isPrivatePath) {
    return NextResponse.next();
  }

  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "auth");
    return applyNoStore(NextResponse.redirect(url));
  }

  if (isAdminPath && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "forbidden");
    return applyNoStore(NextResponse.redirect(url));
  }

  return applyNoStore(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/directo/:path*", "/videos/:path*", "/app/:path*", "/administracion"],
};
