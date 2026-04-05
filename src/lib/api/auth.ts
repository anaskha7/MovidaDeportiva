import { ApiRequestError } from "@/lib/api/http";
import { getSession } from "@/lib/session";

export async function requireApiAdmin() {
  const session = await getSession();

  if (!session) {
    throw new ApiRequestError(401, "No autorizado.");
  }

  if (session.role !== "admin") {
    throw new ApiRequestError(403, "Acceso restringido a administradores.");
  }

  return session;
}
