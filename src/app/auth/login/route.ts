import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActionError, authenticateUser } from "@/lib/auth";
import {
  SESSION_COOKIE_EMAIL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_ROLE,
  SESSION_COOKIE_USER_ID,
} from "@/lib/session-cookies";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const user = await authenticateUser({ email, password });
    const destination = user.role === "admin" ? "/dashboard" : "/app";
    const response = NextResponse.redirect(new URL(destination, request.url), 303);

    response.cookies.set(SESSION_COOKIE_ROLE, user.role, SESSION_COOKIE_OPTIONS);
    response.cookies.set(SESSION_COOKIE_NAME, user.name, SESSION_COOKIE_OPTIONS);
    response.cookies.set(SESSION_COOKIE_USER_ID, String(user.id), SESSION_COOKIE_OPTIONS);
    response.cookies.set(SESSION_COOKIE_EMAIL, user.email, SESSION_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    if (error instanceof AuthActionError) {
      const errorCode = error.code === "blocked" ? "blocked" : "invalid";
      return NextResponse.redirect(
        new URL(`/login?error=${errorCode}&tab=login`, request.url),
        303,
      );
    }

    throw error;
  }
}
