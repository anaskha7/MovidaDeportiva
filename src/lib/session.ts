import { cookies } from "next/headers";
import type { Rol } from "./types";

export const SESSION_COOKIE_ROLE = "mdv_role";
export const SESSION_COOKIE_NAME = "mdv_name";

export interface SessionData {
  role: Rol;
  name: string;
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
