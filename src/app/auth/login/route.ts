import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActionError, authenticateUser } from "@/lib/auth";
import { createEmailOtp } from "@/lib/email-otp";
import { sendOtpEmail } from "@/lib/mailer";
import { isOtpExemptEmail } from "@/lib/otp-policy";
import { applySessionToResponse } from "@/lib/session-response";
import { applyTrustedDeviceToResponse, hasTrustedDevice } from "@/lib/trusted-device";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const user = await authenticateUser({ email, password });
    const shouldSkipOtp = isOtpExemptEmail(user.email);

    if (
      shouldSkipOtp ||
      (await hasTrustedDevice(request, { userId: user.id, email: user.email }))
    ) {
      const destination = user.role === "admin" ? "/dashboard" : "/app";
      const response = await applySessionToResponse(
        NextResponse.redirect(new URL(destination, request.url), 303),
        {
          role: user.role,
          name: user.name,
          userId: user.id,
          email: user.email,
        },
      );
      return applyTrustedDeviceToResponse(request, response, {
        userId: user.id,
        email: user.email,
      });
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
    return NextResponse.redirect(url, 303);
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
