import { AuthActionError, authenticateUser, registerUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { isGoogleAuthConfigured } from "@/lib/next-auth";
import { getSession } from "@/lib/session";
import {
  SESSION_COOKIE_EMAIL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_ROLE,
  SESSION_COOKIE_USER_ID,
} from "@/lib/session-cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LoginForm from "./LoginForm";
import styles from "./Login.module.css";

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  let user;

  try {
    user = await authenticateUser({ email, password });
  } catch (error) {
    if (error instanceof AuthActionError) {
      const errorCode = error.code === "blocked" ? "blocked" : "invalid";
      redirect(`/login?error=${errorCode}&tab=login`);
    }

    throw error;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_ROLE, user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_NAME, user.name, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_USER_ID, String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_EMAIL, user.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect(user.role === "admin" ? "/dashboard" : "/app");
}

async function registerAction(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  let user;

  try {
    user = await registerUser({ name, email, password });
  } catch (error) {
    if (error instanceof AuthActionError) {
      const errorCode =
        error.code === "exists" ? "exists" : "register_invalid";
      redirect(`/login?error=${errorCode}&tab=register`);
    }

    throw error;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_ROLE, user.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_NAME, user.name, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_USER_ID, String(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_EMAIL, user.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/app");
}

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
          onLogin={loginAction}
          onRegister={registerAction}
          locale={locale}
          googleEnabled={isGoogleAuthConfigured}
        />
      </div>
    </main>
  );
}
