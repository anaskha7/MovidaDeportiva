import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clearSessionCookies } from "@/lib/session-response";

export function GET(request: NextRequest) {
  const response = clearSessionCookies(
    NextResponse.redirect(new URL("/", request.url)),
  );
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Clear-Site-Data", "\"cache\", \"storage\"");
  response.cookies.set("next-auth.session-token", "", { path: "/", maxAge: 0 });
  response.cookies.set("__Secure-next-auth.session-token", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("next-auth.callback-url", "", { path: "/", maxAge: 0 });
  response.cookies.set("__Secure-next-auth.callback-url", "", {
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("next-auth.csrf-token", "", { path: "/", maxAge: 0 });
  response.cookies.set("__Host-next-auth.csrf-token", "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}
