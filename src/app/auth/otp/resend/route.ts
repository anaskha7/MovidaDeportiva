import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActionError, getUserByEmailOrThrow } from "@/lib/auth";
import { createEmailOtp } from "@/lib/email-otp";
import { sendOtpEmail } from "@/lib/mailer";
import { isOtpExemptEmail } from "@/lib/otp-policy";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    const url = new URL("/login", request.url);
    url.searchParams.set("tab", "login");
    return NextResponse.redirect(url, 303);
  }

  try {
    const user = await getUserByEmailOrThrow(email);

    if (isOtpExemptEmail(user.email)) {
      const destination = user.role === "admin" ? "/dashboard" : "/app";
      return NextResponse.redirect(new URL(destination, request.url), 303);
    }

    const otp = await createEmailOtp({ email: user.email, userId: user.id });
    await sendOtpEmail({
      email: user.email,
      code: otp.code,
      expiresMinutes: otp.expiresMinutes,
    });
    const url = new URL("/login", request.url);
    url.searchParams.set("step", "otp");
    url.searchParams.set("email", user.email);
    url.searchParams.set("error", "otp_sent");
    return NextResponse.redirect(url, 303);
  } catch (error) {
    const url = new URL("/login", request.url);
    url.searchParams.set("step", "otp");
    url.searchParams.set("email", email);

    if (error instanceof AuthActionError) {
      url.searchParams.set("error", error.code === "blocked" ? "blocked" : "otp_invalid");
      return NextResponse.redirect(url, 303);
    }

    throw error;
  }
}
