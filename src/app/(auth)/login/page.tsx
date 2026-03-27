import { getLocale } from "@/lib/i18n";
import { isGoogleAuthConfigured } from "@/lib/next-auth";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LoginForm from "./LoginForm";
import styles from "./Login.module.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const locale = await getLocale();
  const session = await getSession();
  const error = resolvedSearchParams?.error;
  const initialTab =
    resolvedSearchParams?.tab === "register" ? "register" : "login";

  if (session && !error) {
    redirect(session.role === "admin" ? "/dashboard" : "/app");
  }

  return (
    <main className={styles.page}>
      <div className={styles.languageBar}>
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
          locale={locale}
          googleEnabled={isGoogleAuthConfigured}
        />
      </div>
    </main>
  );
}
