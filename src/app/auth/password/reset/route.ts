import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActionError, getUserByEmailOrThrow } from "@/lib/auth";
import { OtpActionError, verifyEmailOtp } from "@/lib/email-otp";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const fallbackUrl = new URL("/recuperar-password", request.url);
  fallbackUrl.searchParams.set("step", "code");
  fallbackUrl.searchParams.set("email", email);

  if (password.length < 8) {
    fallbackUrl.searchParams.set("error", "weak_password");
    return NextResponse.redirect(fallbackUrl, 303);
  }

  if (password !== confirmPassword) {
    fallbackUrl.searchParams.set("error", "password_mismatch");
    return NextResponse.redirect(fallbackUrl, 303);
  }

  try {
    const user = await getUserByEmailOrThrow(email);
    await verifyEmailOtp({
      email: user.email,
      code,
      intent: "password_reset",
    });

    await prisma.usuario.update({
      where: { id_usuario: user.id },
      data: {
        password: await hash(password, 10),
      },
    });

    const url = new URL("/login", request.url);
    url.searchParams.set("tab", "login");
    url.searchParams.set("reset", "success");
    return NextResponse.redirect(url, 303);
  } catch (error) {
    if (error instanceof OtpActionError) {
      fallbackUrl.searchParams.set("error", error.code);
      return NextResponse.redirect(fallbackUrl, 303);
    }

    if (error instanceof AuthActionError) {
      fallbackUrl.searchParams.set("error", error.code === "blocked" ? "blocked" : "invalid_email");
      return NextResponse.redirect(fallbackUrl, 303);
    }

    throw error;
  }
}
