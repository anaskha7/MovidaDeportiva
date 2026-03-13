import { cookies } from "next/headers";
import type { Rol } from "./types";

export const SESSION_COOKIE_ROLE = "mdv_role";
export const SESSION_COOKIE_NAME = "mdv_name";

export interface SessionData {
  role: Rol;
  name: string;
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

  if (!role || !name) {
    return null;
  }

  return { role, name };
}
