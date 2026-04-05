import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { SessionData } from "@/lib/session-token";
import { createSessionToken } from "@/lib/session-token";
import {
  SESSION_COOKIE_EMAIL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_ROLE,
  SESSION_COOKIE_TOKEN,
  SESSION_COOKIE_USER_ID,
  getExpiredSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/session-cookies";

export async function applySessionToResponse(
  response: NextResponse,
  session: SessionData,
) {
  const token = await createSessionToken(session);
  response.cookies.set(SESSION_COOKIE_TOKEN, token, getSessionCookieOptions());
  response.cookies.set(SESSION_COOKIE_ROLE, "", getExpiredSessionCookieOptions());
  response.cookies.set(SESSION_COOKIE_NAME, "", getExpiredSessionCookieOptions());
  response.cookies.set(SESSION_COOKIE_USER_ID, "", getExpiredSessionCookieOptions());
  response.cookies.set(SESSION_COOKIE_EMAIL, "", getExpiredSessionCookieOptions());
  return response;
}

export async function applySessionToCookieStore(session: SessionData) {
  const cookieStore = await cookies();
  const token = await createSessionToken(session);
  cookieStore.set(SESSION_COOKIE_TOKEN, token, getSessionCookieOptions());
  cookieStore.set(SESSION_COOKIE_ROLE, "", getExpiredSessionCookieOptions());
  cookieStore.set(SESSION_COOKIE_NAME, "", getExpiredSessionCookieOptions());
  cookieStore.set(SESSION_COOKIE_USER_ID, "", getExpiredSessionCookieOptions());
  cookieStore.set(SESSION_COOKIE_EMAIL, "", getExpiredSessionCookieOptions());
}

export function clearSessionCookies(response: NextResponse) {
  const expired = getExpiredSessionCookieOptions();
  response.cookies.set(SESSION_COOKIE_TOKEN, "", expired);
  response.cookies.set(SESSION_COOKIE_ROLE, "", expired);
  response.cookies.set(SESSION_COOKIE_NAME, "", expired);
  response.cookies.set(SESSION_COOKIE_USER_ID, "", expired);
  response.cookies.set(SESSION_COOKIE_EMAIL, "", expired);
  return response;
}
