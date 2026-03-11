"use client";

import { useState } from "react";
import styles from "./Login.module.css";

type Props = {
  error?: string;
  onLogin: (formData: FormData) => void;
  onRegister: (formData: FormData) => void;
};

export default function LoginForm({ error, onLogin, onRegister }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className={styles.formPanel}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={tab === "login" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setTab("login")}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          className={tab === "register" ? styles.activeTab : styles.inactiveTab}
          onClick={() => setTab("register")}
        >
          Crear cuenta
        </button>
      </div>

      {tab === "login" ? (
        <form action={onLogin}>
          <div className={styles.formFields}>
            <label>
              Correo electrónico
              <div className={styles.inputBox}>
                <input
                  name="email"
                  type="email"
                  placeholder="Escribe tu correo electrónico"
                  required
                />
              </div>
            </label>
            <label>
              Contraseña
              <div className={styles.inputBox}>
                <input
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <img src="/assets/figma/login-eye-off.png" alt="" />
              </div>
            </label>
            <a className={styles.forgot} href="#">
              ¿Has olvidado tu contraseña?
            </a>
            {error && (
              <div className={styles.error}>
                {error === "forbidden"
                  ? "No tienes permisos para acceder a esa sección."
                  : "Credenciales inválidas. Prueba con un usuario de demo."}
              </div>
            )}
          </div>
          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit">
              Entrar
              <img src="/assets/figma/arrow-right.png" alt="" />
            </button>
            <div className={styles.divider}>
              <img src="/assets/figma/login-divider.png" alt="" />
              <span>o</span>
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
              Al enviar, acepto que Movida Deportiva procese mis datos de acuerdo con la{" "}
              <span>política de privacidad.</span>
            </p>
          </div>
        </form>
      ) : (
        <form action={onRegister}>
          <div className={styles.formFields}>
            <label>
              Nombre completo
              <div className={styles.inputBox}>
                <input name="name" type="text" placeholder="Tu nombre" required />
              </div>
            </label>
            <label>
              Correo electrónico
              <div className={styles.inputBox}>
                <input
                  name="email"
                  type="email"
                  placeholder="Escribe tu correo electrónico"
                  required
                />
              </div>
            </label>
            <label>
              Contraseña
              <div className={styles.inputBox}>
                <input
                  name="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <img src="/assets/figma/login-eye-off.png" alt="" />
              </div>
            </label>
          </div>
          <div className={styles.actions}>
            <button className={styles.primaryButton} type="submit">
              Crear cuenta
              <img src="/assets/figma/arrow-right.png" alt="" />
            </button>
            <p className={styles.privacy}>
              Al enviar, acepto que Movida Deportiva procese mis datos de acuerdo con la{" "}
              <span>política de privacidad.</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
