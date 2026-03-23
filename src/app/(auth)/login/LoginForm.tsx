"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./Login.module.css";

type Props = {
  error?: string;
  onLogin: (formData: FormData) => void;
  onRegister: (formData: FormData) => void;
  locale: Locale;
};

export default function LoginForm({ error, onLogin, onRegister, locale }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const t = {
    es: {
      login: "Iniciar sesión", register: "Crear cuenta", email: "Correo electrónico", emailPlaceholder: "Escribe tu correo electrónico", password: "Contraseña", passwordPlaceholder: "Mínimo 8 caracteres", forgot: "¿Has olvidado tu contraseña?", forbidden: "No tienes permisos para acceder a esa sección.", invalid: "Credenciales inválidas. Prueba con un usuario de demo.", enter: "Entrar", or: "o", privacy: "Al enviar, acepto que Movida Deportiva procese mis datos de acuerdo con la", privacyLink: "política de privacidad.", fullName: "Nombre completo", namePlaceholder: "Tu nombre", showPassword: "Mostrar contraseña", hidePassword: "Ocultar contraseña",
    },
    ca: {
      login: "Iniciar sessió", register: "Crear compte", email: "Correu electrònic", emailPlaceholder: "Escriu el teu correu electrònic", password: "Contrasenya", passwordPlaceholder: "Mínim 8 caràcters", forgot: "Has oblidat la contrasenya?", forbidden: "No tens permisos per accedir a aquesta secció.", invalid: "Credencials invàlides. Prova amb un usuari de demostració.", enter: "Entrar", or: "o", privacy: "En enviar, accepto que Movida Deportiva processi les meves dades d'acord amb la", privacyLink: "política de privacitat.", fullName: "Nom complet", namePlaceholder: "El teu nom", showPassword: "Mostrar contrasenya", hidePassword: "Ocultar contrasenya",
    },
    en: {
      login: "Log in", register: "Create account", email: "Email", emailPlaceholder: "Enter your email", password: "Password", passwordPlaceholder: "Minimum 8 characters", forgot: "Forgot your password?", forbidden: "You do not have permission to access that section.", invalid: "Invalid credentials. Try a demo user.", enter: "Enter", or: "or", privacy: "By submitting, I accept that Movida Deportiva processes my data according to the", privacyLink: "privacy policy.", fullName: "Full name", namePlaceholder: "Your name", showPassword: "Show password", hidePassword: "Hide password",
    },
  }[locale];

  return (
    <div className={styles.formPanel}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={tab === "login" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setTab("login")}
        >
          {t.login}
        </button>
        <button
          type="button"
          className={tab === "register" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setTab("register")}
        >
          {t.register}
        </button>
      </div>

      {tab === "login" ? (
        <form action={onLogin}>
          <div className={styles.formFields}>
            <label>
              {t.email}
              <div className={styles.inputBox}>
                <input
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                />
              </div>
            </label>
            <label>
              {t.password}
              <div className={styles.inputBox}>
                <input
                  name="password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowLoginPassword((value) => !value)}
                  aria-label={showLoginPassword ? t.hidePassword : t.showPassword}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2.5 12s3.5-5.5 9.5-5.5S21.5 12 21.5 12s-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    {!showLoginPassword ? (
                      <path
                        d="M4 20 20 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    ) : null}
                  </svg>
                </button>
              </div>
            </label>
            <a className={styles.forgot} href="#">
              {t.forgot}
            </a>
            {error && (
              <div className={styles.error}>
                {error === "forbidden"
                  ? t.forbidden
                  : t.invalid}
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit">
              {t.enter}
              <img src="/assets/figma/arrow-right.png" alt="" />
            </button>
            <div className={styles.divider}>
              <img src="/assets/figma/login-divider.png" alt="" />
              <span>{t.or}</span>
              <img src="/assets/figma/login-divider.png" alt="" />
            </div>
            <div className={styles.socialButtons}>
              <button type="button">
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.socialIcon}>
                  <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.5-.2-2.2H12Z" />
                  <path fill="#34A853" d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.4-4H3.4v2.5A10 10 0 0 0 12 22Z" />
                  <path fill="#4A90E2" d="M6.6 14.1A6 6 0 0 1 6.3 12c0-.7.1-1.4.3-2.1V7.4H3.4A10 10 0 0 0 2 12c0 1.6.4 3.1 1.4 4.6l3.2-2.5Z" />
                  <path fill="#FBBC05" d="M12 5.9c1.4 0 2.7.5 3.7 1.4l2.8-2.8A10 10 0 0 0 3.4 7.4l3.2 2.5c.7-2.3 2.9-4 5.4-4Z" />
                </svg>
                Google
              </button>
              <button type="button">
                <img src="/assets/figma/login-apple.png" alt="" />
                Apple
              </button>
            </div>
            <p className={styles.privacy}>
              {t.privacy}{" "}
              <span>{t.privacyLink}</span>
            </p>
          </div>
        </form>
      ) : (
        <form action={onRegister}>
          <div className={styles.formFields}>
            <label>
              {t.fullName}
              <div className={styles.inputBox}>
                <input name="name" type="text" placeholder={t.namePlaceholder} required />
              </div>
            </label>
            <label>
              {t.email}
              <div className={styles.inputBox}>
                <input
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  required
                />
              </div>
            </label>
            <label>
              {t.password}
              <div className={styles.inputBox}>
                <input
                  name="password"
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowRegisterPassword((value) => !value)}
                  aria-label={showRegisterPassword ? t.hidePassword : t.showPassword}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M2.5 12s3.5-5.5 9.5-5.5S21.5 12 21.5 12s-3.5 5.5-9.5 5.5S2.5 12 2.5 12Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    {!showRegisterPassword ? (
                      <path
                        d="M4 20 20 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    ) : null}
                  </svg>
                </button>
              </div>
            </label>
          </div>
          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit">
              {t.register}
              <img src="/assets/figma/arrow-right.png" alt="" />
            </button>
            <p className={styles.privacy}>
              {t.privacy}{" "}
              <span>{t.privacyLink}</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
