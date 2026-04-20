import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActionError, getUserByEmailOrThrow } from "@/lib/auth";
import { createEmailOtp } from "@/lib/email-otp";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();

  try {
    const user = await getUserByEmailOrThrow(email);
    const otp = await createEmailOtp({
      email: user.email,
      userId: user.id,
      intent: "password_reset",
    });

    await sendOtpEmail({
      email: user.email,
      code: otp.code,
      expiresMinutes: otp.expiresMinutes,
      purpose: "password_reset",
    });

    const url = new URL("/recuperar-password", request.url);
    url.searchParams.set("step", "code");
    url.searchParams.set("email", user.email);
    url.searchParams.set("sent", "1");
    return NextResponse.redirect(url, 303);
  } catch (error) {
    const url = new URL("/recuperar-password", request.url);

    if (error instanceof AuthActionError) {
      url.searchParams.set("error", error.code === "blocked" ? "blocked" : "invalid_email");
      return NextResponse.redirect(url, 303);
    }

    throw error;
  }
}
