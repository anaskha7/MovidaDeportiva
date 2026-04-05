import { cookies } from "next/headers";
import {
  SESSION_COOKIE_TOKEN,
  SESSION_COOKIE_EMAIL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_ROLE,
  SESSION_COOKIE_USER_ID,
} from "./session-cookies";
import { formatUserName, type SessionData, verifySessionToken } from "./session-token";
import type { Rol } from "./types";

export { formatUserName, type SessionData } from "./session-token";

function isLegacyRol(value: string): value is Rol {
  return value === "admin" || value === "user" || value === "suscriptor";
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_TOKEN)?.value;

  if (sessionToken) {
    return verifySessionToken(sessionToken);
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const role = cookieStore.get(SESSION_COOKIE_ROLE)?.value;
  const name = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const userIdValue = cookieStore.get(SESSION_COOKIE_USER_ID)?.value;
  const email = cookieStore.get(SESSION_COOKIE_EMAIL)?.value ?? null;

  if (!role || !name || !isLegacyRol(role)) {
    return null;
  }

  const parsedUserId = userIdValue ? Number(userIdValue) : null;
  return {
    role,
    name: formatUserName(name),
    userId: Number.isInteger(parsedUserId) ? parsedUserId : null,
    email,
  };
}
