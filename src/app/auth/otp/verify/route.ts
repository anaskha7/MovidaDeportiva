import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthActionError, getUserByEmailOrThrow } from "@/lib/auth";
import { OtpActionError, verifyEmailOtp } from "@/lib/email-otp";
import { isOtpExemptEmail } from "@/lib/otp-policy";
import { applySessionToResponse } from "@/lib/session-response";
import { applyTrustedDeviceToResponse } from "@/lib/trusted-device";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();

  if (!email) {
    const url = new URL("/login", request.url);
    url.searchParams.set("step", "otp");
    url.searchParams.set("email", email);
    url.searchParams.set("error", "otp_missing");
    return NextResponse.redirect(url, 303);
  }

  try {
    const user = await getUserByEmailOrThrow(email);

    if (!isOtpExemptEmail(user.email) && !code) {
      const url = new URL("/login", request.url);
      url.searchParams.set("step", "otp");
      url.searchParams.set("email", email);
      url.searchParams.set("error", "otp_missing");
      return NextResponse.redirect(url, 303);
    }

    if (!isOtpExemptEmail(user.email)) {
      await verifyEmailOtp({ email, code });
    }

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
  } catch (error) {
    const url = new URL("/login", request.url);
    url.searchParams.set("step", "otp");
    url.searchParams.set("email", email);

    if (error instanceof OtpActionError) {
      url.searchParams.set("error", error.code);
      return NextResponse.redirect(url, 303);
    }

    if (error instanceof AuthActionError) {
      url.searchParams.set("error", error.code === "blocked" ? "blocked" : "otp_invalid");
      return NextResponse.redirect(url, 303);
    }

    throw error;
  }
}
