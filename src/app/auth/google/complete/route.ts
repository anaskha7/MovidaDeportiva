import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/next-auth";
import { createEmailOtp } from "@/lib/email-otp";
import { sendOtpEmail } from "@/lib/mailer";
import { isOtpExemptEmail } from "@/lib/otp-policy";
import { applySessionToResponse } from "@/lib/session-response";
import { applyTrustedDeviceToResponse, hasTrustedDevice } from "@/lib/trusted-device";
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

  if (
    isOtpExemptEmail(email) ||
    (await hasTrustedDevice(request, { userId, email }))
  ) {
    const destination = role === "admin" ? "/dashboard" : "/app";
    const response = await applySessionToResponse(
      NextResponse.redirect(new URL(destination, request.url)),
      {
        role,
        name,
        userId,
        email,
      },
    );
    return applyTrustedDeviceToResponse(request, response, { userId, email });
  }

  const otp = await createEmailOtp({ email, userId });
  await sendOtpEmail({
    email,
    code: otp.code,
    expiresMinutes: otp.expiresMinutes,
  });
  const url = new URL("/login", request.url);
  url.searchParams.set("step", "otp");
  url.searchParams.set("email", email);
  return NextResponse.redirect(url);
}
