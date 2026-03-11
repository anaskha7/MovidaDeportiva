import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_ROLE } from "@/lib/session";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(SESSION_COOKIE_ROLE, "", { path: "/", maxAge: 0 });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
