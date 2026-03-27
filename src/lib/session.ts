import { cookies } from "next/headers";
import {
  SESSION_COOKIE_EMAIL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_ROLE,
  SESSION_COOKIE_USER_ID,
} from "./session-cookies";
import type { Rol } from "./types";

export interface SessionData {
  role: Rol;
  name: string;
  userId: number | null;
  email: string | null;
}

export function formatUserName(name: string | null | undefined): string {
  if (!name) return "Usuario";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const role = cookieStore.get(SESSION_COOKIE_ROLE)?.value as Rol | undefined;
  const name = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const userIdValue = cookieStore.get(SESSION_COOKIE_USER_ID)?.value;
  const email = cookieStore.get(SESSION_COOKIE_EMAIL)?.value ?? null;

  if (!role || !name) {
    return null;
  }

  const parsedUserId = userIdValue ? Number(userIdValue) : null;

  return {
    role,
    name,
    userId: Number.isInteger(parsedUserId) ? parsedUserId : null,
    email,
  };
}
