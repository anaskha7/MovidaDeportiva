import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActionError, registerUser } from "@/lib/auth";
import { applySessionToResponse } from "@/lib/session-response";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const user = await registerUser({ name, email, password });
    const response = NextResponse.redirect(new URL("/app", request.url), 303);
    return applySessionToResponse(response, {
      role: user.role,
      name: user.name,
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof AuthActionError) {
      const errorCode = error.code === "exists" ? "exists" : "register_invalid";
      return NextResponse.redirect(
        new URL(`/login?error=${errorCode}&tab=register`, request.url),
        303,
      );
    }

    throw error;
  }
}
