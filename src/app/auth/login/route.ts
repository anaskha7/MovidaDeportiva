import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActionError, authenticateUser } from "@/lib/auth";
import { applySessionToResponse } from "@/lib/session-response";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const user = await authenticateUser({ email, password });
    const destination = user.role === "admin" ? "/dashboard" : "/app";
    const response = NextResponse.redirect(new URL(destination, request.url), 303);
    return applySessionToResponse(response, {
      role: user.role,
      name: user.name,
      userId: user.id,
      email: user.email,
    });
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
