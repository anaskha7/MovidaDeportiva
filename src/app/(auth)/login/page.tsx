import { getLocale } from "@/lib/i18n";
import { isGoogleAuthConfigured } from "@/lib/next-auth";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LoginForm from "./LoginForm";
import styles from "./Login.module.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; tab?: string; step?: string; email?: string; reset?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const locale = await getLocale();
  const session = await getSession();
  const error = resolvedSearchParams?.error;
  const step = resolvedSearchParams?.step;
  const otpEmail = resolvedSearchParams?.email;
  const reset = resolvedSearchParams?.reset;
  const initialTab =
    resolvedSearchParams?.tab === "register" ? "register" : "login";
  const notice =
    reset === "success"
      ? locale === "en"
        ? "Password updated. You can log in now."
        : locale === "ca"
          ? "Contrasenya actualitzada. Ja pots iniciar sessió."
          : "Contraseña actualizada. Ya puedes iniciar sesión."
      : null;

  if (session && !error) {
    redirect(session.role === "admin" ? "/dashboard" : "/app");
  }

  return (
    <main className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          {locale === "en" ? "Back to website" : locale === "ca" ? "Tornar al web" : "Volver a la web"}
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
        <LoginForm
          error={error}
          initialTab={initialTab}
          step={step === "otp" ? "otp" : undefined}
          otpEmail={otpEmail}
          locale={locale}
          googleEnabled={isGoogleAuthConfigured}
          notice={notice}
        />
      </div>
    </main>
  );
}
