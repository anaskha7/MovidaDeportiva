import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/next-auth";
import { applySessionToResponse } from "@/lib/session-response";
import type { Rol } from "@/lib/types";

export async function GET(request: NextRequest) {
  const session = await getAuthSession();
  const role = (session?.user as { role?: Rol } | undefined)?.role;
  const name = session?.user?.name;
  const email = session?.user?.email;
  const userId = (session?.user as { id?: number } | undefined)?.id;

  if (!role || !name || !email || !userId) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "oauth");
    url.searchParams.set("tab", "login");
    return NextResponse.redirect(url);
  }

  const destination = role === "admin" ? "/dashboard" : "/app";
  const response = NextResponse.redirect(new URL(destination, request.url));
  return applySessionToResponse(response, {
    role,
    name,
    userId,
    email,
  });
}
