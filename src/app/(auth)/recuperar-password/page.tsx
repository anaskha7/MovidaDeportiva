import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getLocale } from "@/lib/i18n";
import styles from "../login/Login.module.css";

export default async function RecuperarPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{
    step?: string;
    email?: string;
    error?: string;
    sent?: string;
  }>;
}) {
  const locale = await getLocale();
  const params = await searchParams;
  const step = params?.step === "code" ? "code" : "request";
  const email = params?.email ?? "";
  const error = params?.error;
  const sent = params?.sent === "1";

  const t = {
    es: {
      back: "Volver a la web",
      title: "Recuperar contraseña",
      requestTitle: "Te enviamos un código por correo",
      requestText: "Introduce el email de tu cuenta y te mandaremos un código para cambiar la contraseña.",
      codeTitle: "Introduce el código y tu nueva contraseña",
      codeText: "Usa el código recibido por correo para completar el cambio.",
      email: "Correo electrónico",
      code: "Código",
      password: "Nueva contraseña",
      confirmPassword: "Confirmar contraseña",
      send: "Enviar código",
      reset: "Cambiar contraseña",
      resend: "Reenviar código",
      login: "Volver al login",
      sent: "Código enviado. Revisa tu correo.",
      invalid: "No se ha encontrado una cuenta con ese correo.",
      blocked: "La cuenta está bloqueada. Contacta con administración.",
      otpInvalid: "El código no es válido.",
      otpExpired: "El código ha caducado. Solicita otro.",
      otpMax: "Has agotado los intentos. Solicita un nuevo código.",
      mismatch: "Las contraseñas no coinciden.",
      weak: "La nueva contraseña debe tener al menos 8 caracteres.",
    },
    ca: {
      back: "Tornar al web",
      title: "Recuperar contrasenya",
      requestTitle: "T'enviem un codi per correu",
      requestText: "Introdueix el correu del teu compte i t'enviarem un codi per canviar la contrasenya.",
      codeTitle: "Introdueix el codi i la nova contrasenya",
      codeText: "Fes servir el codi rebut per correu per completar el canvi.",
      email: "Correu electrònic",
      code: "Codi",
      password: "Nova contrasenya",
      confirmPassword: "Confirmar contrasenya",
      send: "Enviar codi",
      reset: "Canviar contrasenya",
      resend: "Tornar a enviar el codi",
      login: "Tornar al login",
      sent: "Codi enviat. Revisa el teu correu.",
      invalid: "No s'ha trobat cap compte amb aquest correu.",
      blocked: "El compte està bloquejat. Contacta amb administració.",
      otpInvalid: "El codi no és vàlid.",
      otpExpired: "El codi ha caducat. Demana'n un altre.",
      otpMax: "Has esgotat els intents. Demana un nou codi.",
      mismatch: "Les contrasenyes no coincideixen.",
      weak: "La nova contrasenya ha de tenir almenys 8 caràcters.",
    },
    en: {
      back: "Back to website",
      title: "Reset password",
      requestTitle: "We will send you a code by email",
      requestText: "Enter your account email and we will send you a code to change your password.",
      codeTitle: "Enter the code and your new password",
      codeText: "Use the code sent by email to complete the change.",
      email: "Email",
      code: "Code",
      password: "New password",
      confirmPassword: "Confirm password",
      send: "Send code",
      reset: "Change password",
      resend: "Resend code",
      login: "Back to login",
      sent: "Code sent. Check your inbox.",
      invalid: "No account was found for that email.",
      blocked: "The account is blocked. Contact administration.",
      otpInvalid: "The code is not valid.",
      otpExpired: "The code has expired. Request a new one.",
      otpMax: "You have exhausted the attempts. Request a new code.",
      mismatch: "Passwords do not match.",
      weak: "The new password must be at least 8 characters long.",
    },
  }[locale];

  const errorMessage =
    error === "invalid_email"
      ? t.invalid
      : error === "blocked"
        ? t.blocked
      : error === "otp_invalid"
        ? t.otpInvalid
        : error === "otp_expired"
          ? t.otpExpired
          : error === "otp_max"
            ? t.otpMax
            : error === "password_mismatch"
              ? t.mismatch
              : error === "weak_password"
                ? t.weak
                : null;

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          {t.back}
        </Link>
        <LanguageSwitcher locale={locale} compact />
      </div>
      <div className={styles.card}>
        <div className={styles.imagePanel}>
          <img src="/assets/figma/login-image.png" alt="" />
          <div className={styles.logoOverlay}>
            <img src="/assets/figma/logo-public.svg" alt="Movida Deportiva TV" />
          </div>
        </div>
        <div className={styles.formPanel}>
          <div className={styles.otpHeader}>
            <h2>{t.title}</h2>
            <p>{step === "code" ? t.codeText : t.requestText}</p>
          </div>

          {step === "code" ? (
            <form action="/auth/password/reset" method="post">
              <div className={styles.formFields}>
                {sent ? <div className={styles.success}>{t.sent}</div> : null}
                {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
                <input type="hidden" name="email" value={email} />
                <label>
                  {t.email}
                  <div className={styles.inputBox}>
                    <input type="email" value={email} readOnly />
                  </div>
                </label>
                <label>
                  {t.code}
                  <div className={styles.inputBox}>
                    <input name="code" inputMode="numeric" maxLength={6} required />
                  </div>
                </label>
                <label>
                  {t.password}
                  <div className={styles.inputBox}>
                    <input name="password" type="password" minLength={8} required />
                  </div>
                </label>
                <label>
                  {t.confirmPassword}
                  <div className={styles.inputBox}>
                    <input name="confirmPassword" type="password" minLength={8} required />
                  </div>
                </label>
              </div>
              <div className={styles.actions}>
                <button className={styles.primaryButton} type="submit">
                  {t.reset}
                  <img src="/assets/figma/arrow-right.png" alt="" />
                </button>
              </div>
            </form>
          ) : (
            <form action="/auth/password/request" method="post">
              <div className={styles.formFields}>
                {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}
                <label>
                  {t.email}
                  <div className={styles.inputBox}>
                    <input name="email" type="email" required />
                  </div>
                </label>
              </div>
              <div className={styles.actions}>
                <button className={styles.primaryButton} type="submit">
                  {t.send}
                  <img src="/assets/figma/arrow-right.png" alt="" />
                </button>
              </div>
            </form>
          )}

          {step === "code" ? (
            <form action="/auth/password/request" method="post" className={styles.otpResend}>
              <input type="hidden" name="email" value={email} />
              <button type="submit" className={styles.linkButton}>
                {t.resend}
              </button>
            </form>
          ) : null}

          <Link href="/login" className={styles.linkButton}>
            {t.login}
          </Link>
        </div>
      </div>
    </main>
  );
}
