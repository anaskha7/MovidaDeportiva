import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_EMAIL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_ROLE,
  SESSION_COOKIE_USER_ID,
} from "@/lib/session-cookies";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.cookies.set(SESSION_COOKIE_ROLE, "", { path: "/", maxAge: 0 });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  response.cookies.set(SESSION_COOKIE_USER_ID, "", { path: "/", maxAge: 0 });
  response.cookies.set(SESSION_COOKIE_EMAIL, "", { path: "/", maxAge: 0 });
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
