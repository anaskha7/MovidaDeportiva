const OTP_EXEMPT_DOMAINS = ["movida.tv"];

export function isOtpExemptEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1] ?? "";

  return OTP_EXEMPT_DOMAINS.includes(domain);
}
