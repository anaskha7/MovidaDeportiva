import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM ?? "Movida Deportiva <no-reply@movida.tv>";
const siteUrl =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

function isSmtpConfigured() {
  return Boolean(smtpHost && smtpPort && smtpUser && smtpPass);
}

export async function sendOtpEmail(input: {
  email: string;
  code: string;
  expiresMinutes: number;
  purpose?: "login" | "password_reset";
}) {
  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP no configurado. Define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS y SMTP_FROM.");
    }
    console.info(`[DEV] OTP para ${input.email}: ${input.code}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const purpose = input.purpose ?? "login";
  const subject =
    purpose === "password_reset"
      ? "Tu código para cambiar la contraseña"
      : "Tu código de acceso";
  const title =
    purpose === "password_reset" ? "Tu código para cambiar la contraseña" : "Tu código de acceso";
  const intro =
    purpose === "password_reset"
      ? `Usa este código para restablecer tu contraseña. Caduca en ${input.expiresMinutes} minutos.`
      : `Usa este código para completar el acceso. Caduca en ${input.expiresMinutes} minutos.`;
  const footer =
    purpose === "password_reset"
      ? "Si no has solicitado este cambio, ignora este email y mantén tu contraseña actual."
      : "Si no has solicitado este código, puedes ignorar este email.";
  const text = `${title}: ${input.code}. ${intro}`;
  const logoUrl = siteUrl
    ? `${siteUrl.replace(/\/$/, "")}/assets/figma/logo-public.svg`
    : "";
  const html = `
  <div style="font-family: 'Manrope', Arial, sans-serif; background:#f6f7f7; padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      ${logoUrl ? `
        <div style="background:#1a2c2a;padding:18px 24px;">
          <img src="${logoUrl}" alt="Movida Deportiva TV" style="width:96px;height:auto;display:block;" />
        </div>` : ""}
      <div style="padding:24px 28px;">
      <h2 style="margin:0 0 8px;font-size:22px;color:#1a2c2a;">${title}</h2>
      <p style="margin:0 0 16px;color:#4b4b4b;font-size:15px;">${intro}</p>
      <div style="font-size:28px;letter-spacing:6px;font-weight:700;color:#1a2c2a;background:#f2f2f2;padding:14px 18px;border-radius:12px;text-align:center;">
        ${input.code}
      </div>
      <p style="margin:16px 0 0;color:#7a7f82;font-size:12px;">${footer}</p>
      </div>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from: smtpFrom,
    replyTo: smtpFrom,
    to: input.email,
    subject,
    text,
    html,
  });
}
