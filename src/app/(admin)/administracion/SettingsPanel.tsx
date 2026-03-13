"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./Administracion.module.css";

type SettingsPanelProps = {
  displayName: string;
  roleLabel: string;
  language: Locale;
  onLanguageChange: (language: Locale) => void;
};

const content = {
  es: {
    account: "Mi cuenta",
    accountDesc: "Gestiona tu información principal y los datos de acceso.",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    profile: "Perfil",
    club: "Club o entidad",
    security: "Seguridad",
    securityDesc: "Cambia tu contraseña y revisa el acceso a la cuenta.",
    currentPassword: "Contraseña actual",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar nueva contraseña",
    save: "Guardar cambios",
    logout: "Cerrar sesión",
    notifications: "Notificaciones",
    notificationsDesc: "Elige qué avisos quieres recibir en tu cuenta.",
    importantEmails: "Correos importantes",
    importantEmailsDesc: "Reservas, accesos y cambios en tu cuenta.",
    liveAlerts: "Avisos de directos",
    liveAlertsDesc: "Recordatorios cuando arranca un partido o evento.",
    marketing: "Novedades y promociones",
    marketingDesc: "Información sobre servicios, mejoras y ofertas.",
    preferences: "Preferencias",
    preferencesDesc: "Ajusta cómo quieres usar la plataforma.",
    language: "Idioma",
    quality: "Calidad de reproducción por defecto",
    auto: "Automática",
    subscription: "Suscripción",
    subscriptionDesc: "Estado actual y acceso premium.",
    activePlan: "Plan Premium activo",
    renewal: "Renovación",
    access: "Acceso",
    accessValue: "Contenido premium + directos",
    manageSubscription: "Gestionar suscripción",
  },
  ca: {
    account: "El meu compte",
    accountDesc: "Gestiona la teva informació principal i les dades d'accés.",
    fullName: "Nom complet",
    email: "Correu electrònic",
    profile: "Perfil",
    club: "Club o entitat",
    security: "Seguretat",
    securityDesc: "Canvia la contrasenya i revisa l'accés al compte.",
    currentPassword: "Contrasenya actual",
    newPassword: "Nova contrasenya",
    confirmPassword: "Confirmar nova contrasenya",
    save: "Desar canvis",
    logout: "Tancar sessió",
    notifications: "Notificacions",
    notificationsDesc: "Tria quins avisos vols rebre al teu compte.",
    importantEmails: "Correus importants",
    importantEmailsDesc: "Reserves, accessos i canvis al teu compte.",
    liveAlerts: "Avisos de directes",
    liveAlertsDesc: "Recordatoris quan comença un partit o esdeveniment.",
    marketing: "Novetats i promocions",
    marketingDesc: "Informació sobre serveis, millores i ofertes.",
    preferences: "Preferències",
    preferencesDesc: "Ajusta com vols fer servir la plataforma.",
    language: "Idioma",
    quality: "Qualitat de reproducció per defecte",
    auto: "Automàtica",
    subscription: "Subscripció",
    subscriptionDesc: "Estat actual i accés premium.",
    activePlan: "Pla Premium actiu",
    renewal: "Renovació",
    access: "Accés",
    accessValue: "Contingut premium + directes",
    manageSubscription: "Gestionar subscripció",
  },
  en: {
    account: "My account",
    accountDesc: "Manage your main information and access details.",
    fullName: "Full name",
    email: "Email",
    profile: "Profile",
    club: "Club or organisation",
    security: "Security",
    securityDesc: "Change your password and review account access.",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    save: "Save changes",
    logout: "Log out",
    notifications: "Notifications",
    notificationsDesc: "Choose which alerts you want to receive.",
    importantEmails: "Important emails",
    importantEmailsDesc: "Bookings, access and account changes.",
    liveAlerts: "Live alerts",
    liveAlertsDesc: "Reminders when a match or event starts.",
    marketing: "News and promotions",
    marketingDesc: "Information about services, improvements and offers.",
    preferences: "Preferences",
    preferencesDesc: "Adjust how you want to use the platform.",
    language: "Language",
    quality: "Default playback quality",
    auto: "Automatic",
    subscription: "Subscription",
    subscriptionDesc: "Current status and premium access.",
    activePlan: "Premium plan active",
    renewal: "Renewal",
    access: "Access",
    accessValue: "Premium content + live events",
    manageSubscription: "Manage subscription",
  },
} as const;

export default function SettingsPanel({
  displayName,
  roleLabel,
  language,
  onLanguageChange,
}: SettingsPanelProps) {
  const avatarStorageKey = "mdv_profile_avatar";
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [liveNotifications, setLiveNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  const [defaultQuality, setDefaultQuality] = useState("1080p");
  const [avatarUrl, setAvatarUrl] = useState("/assets/figma/dashboard-user.png");
  const t = content[language];
  const initials = useMemo(
    () =>
      displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join(""),
    [displayName]
  );

  useEffect(() => {
    const savedAvatar = window.localStorage.getItem(avatarStorageKey);
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  return (
    <div className={styles.settingsGrid}>
      <section className={styles.primaryColumn}>
        <article className={styles.settingsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.account}</h2>
              <p>{t.accountDesc}</p>
            </div>
          </div>

          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} />
              ) : (
                <span>{initials || "U"}</span>
              )}
            </div>
            <div className={styles.avatarActions}>
              <strong>{displayName}</strong>
              <p>{roleLabel}</p>
              <label className={styles.avatarButton}>
                {language === "en"
                  ? "Change profile photo"
                  : language === "ca"
                    ? "Canviar foto de perfil"
                    : "Cambiar foto de perfil"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = typeof reader.result === "string" ? reader.result : "";
                      if (!result) return;
                      setAvatarUrl(result);
                      window.localStorage.setItem(avatarStorageKey, result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t.fullName}</span>
              <input type="text" defaultValue={displayName} />
            </label>
            <label className={styles.field}>
              <span>{t.email}</span>
              <input type="email" defaultValue="usuario@movidadeportiva.tv" />
            </label>
            <label className={styles.field}>
              <span>{t.profile}</span>
              <input type="text" defaultValue={roleLabel} readOnly />
            </label>
            <label className={styles.field}>
              <span>{t.club}</span>
              <input type="text" defaultValue="Movida Deportiva Club" />
            </label>
          </div>
        </article>

        <article className={styles.settingsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.security}</h2>
              <p>{t.securityDesc}</p>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t.currentPassword}</span>
              <input type="password" defaultValue="********" />
            </label>
            <label className={styles.field}>
              <span>{t.newPassword}</span>
              <input type="password" defaultValue="********" />
            </label>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span>{t.confirmPassword}</span>
              <input type="password" defaultValue="********" />
            </label>
          </div>

          <div className={styles.actionRow}>
            <button type="button" className={styles.primaryAction}>
              {t.save}
            </button>
            <a href="/logout" className={styles.secondaryAction}>
              {t.logout}
            </a>
          </div>
        </article>
      </section>

      <aside className={styles.secondaryColumn}>
        <article className={styles.settingsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.notifications}</h2>
              <p>{t.notificationsDesc}</p>
            </div>
          </div>

          <div className={styles.preferenceList}>
            <button
              type="button"
              className={styles.preferenceRow}
              onClick={() => setEmailNotifications((value) => !value)}
            >
              <div>
                <strong>{t.importantEmails}</strong>
                <p>{t.importantEmailsDesc}</p>
              </div>
              <span className={`${styles.switch} ${emailNotifications ? styles.switchActive : ""}`} />
            </button>

            <button
              type="button"
              className={styles.preferenceRow}
              onClick={() => setLiveNotifications((value) => !value)}
            >
              <div>
                <strong>{t.liveAlerts}</strong>
                <p>{t.liveAlertsDesc}</p>
              </div>
              <span className={`${styles.switch} ${liveNotifications ? styles.switchActive : ""}`} />
            </button>

            <button
              type="button"
              className={styles.preferenceRow}
              onClick={() => setMarketingNotifications((value) => !value)}
            >
              <div>
                <strong>{t.marketing}</strong>
                <p>{t.marketingDesc}</p>
              </div>
              <span className={`${styles.switch} ${marketingNotifications ? styles.switchActive : ""}`} />
            </button>
          </div>
        </article>

        <article className={styles.settingsCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.preferences}</h2>
              <p>{t.preferencesDesc}</p>
            </div>
          </div>

          <div className={styles.preferenceStack}>
            <label className={styles.field}>
              <span>{t.language}</span>
              <select
                value={language}
                onChange={(event) =>
                  onLanguageChange(event.target.value as Locale)
                }
              >
                <option value="es">Español</option>
                <option value="ca">Català</option>
                <option value="en">English</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>{t.quality}</span>
              <select
                value={defaultQuality}
                onChange={(event) => setDefaultQuality(event.target.value)}
              >
                <option>1080p</option>
                <option>720p</option>
                <option>{t.auto}</option>
              </select>
            </label>
          </div>
        </article>

        <article className={`${styles.settingsCard} ${styles.subscriptionCard}`}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{t.subscription}</h2>
              <p>{t.subscriptionDesc}</p>
            </div>
          </div>

          <div className={styles.planBadge}>{t.activePlan}</div>
          <div className={styles.subscriptionInfo}>
            <div>
              <span>{t.renewal}</span>
              <strong>28 marzo 2026</strong>
            </div>
            <div>
              <span>{t.access}</span>
              <strong>{t.accessValue}</strong>
            </div>
          </div>
          <button type="button" className={styles.primaryAction}>
            {t.manageSubscription}
          </button>
        </article>
      </aside>
    </div>
  );
}
