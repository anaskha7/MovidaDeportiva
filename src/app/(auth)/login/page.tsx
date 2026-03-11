import { validateCredentials } from "@/lib/auth-mock";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_ROLE } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import styles from "./Login.module.css";

async function loginAction(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const user = validateCredentials(email, password);

  if (!user) {
    redirect("/login?error=invalid");
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

  redirect(user.role === "admin" ? "/admin/dashboard" : "/app");
}

async function registerAction(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email) {
    redirect("/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_ROLE, "user", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_NAME, name, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  redirect("/app");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error;

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.imagePanel}>
          <img src="/assets/figma/login-image.png" alt="" />
          <div className={styles.logoOverlay}>
            <img src="/assets/figma/logo.png" alt="" />
          </div>
        </div>
        <LoginForm error={error} onLogin={loginAction} onRegister={registerAction} />
      </div>
    </main>
  );
}
