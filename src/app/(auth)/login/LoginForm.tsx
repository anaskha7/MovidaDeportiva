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
  const t = {
    es: {
      login: "Iniciar sesión", register: "Crear cuenta", email: "Correo electrónico", emailPlaceholder: "Escribe tu correo electrónico", password: "Contraseña", passwordPlaceholder: "Mínimo 8 caracteres", forgot: "¿Has olvidado tu contraseña?", forbidden: "No tienes permisos para acceder a esa sección.", invalid: "Credenciales inválidas. Prueba con un usuario de demo.", enter: "Entrar", or: "o", privacy: "Al enviar, acepto que Movida Deportiva procese mis datos de acuerdo con la", privacyLink: "política de privacidad.", fullName: "Nombre completo", namePlaceholder: "Tu nombre",
    },
    ca: {
      login: "Iniciar sessió", register: "Crear compte", email: "Correu electrònic", emailPlaceholder: "Escriu el teu correu electrònic", password: "Contrasenya", passwordPlaceholder: "Mínim 8 caràcters", forgot: "Has oblidat la contrasenya?", forbidden: "No tens permisos per accedir a aquesta secció.", invalid: "Credencials invàlides. Prova amb un usuari de demostració.", enter: "Entrar", or: "o", privacy: "En enviar, accepto que Movida Deportiva processi les meves dades d'acord amb la", privacyLink: "política de privacitat.", fullName: "Nom complet", namePlaceholder: "El teu nom",
    },
    en: {
      login: "Log in", register: "Create account", email: "Email", emailPlaceholder: "Enter your email", password: "Password", passwordPlaceholder: "Minimum 8 characters", forgot: "Forgot your password?", forbidden: "You do not have permission to access that section.", invalid: "Invalid credentials. Try a demo user.", enter: "Enter", or: "or", privacy: "By submitting, I accept that Movida Deportiva processes my data according to the", privacyLink: "privacy policy.", fullName: "Full name", namePlaceholder: "Your name",
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
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  required
                />
                <img src="/assets/figma/login-eye-off.png" alt="" />
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
                <img src="/assets/figma/login-google.png" alt="" />
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
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  required
                />
                <img src="/assets/figma/login-eye-off.png" alt="" />
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
