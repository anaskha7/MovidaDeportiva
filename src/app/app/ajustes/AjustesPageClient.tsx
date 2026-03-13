"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n-shared";
import type { Rol } from "@/lib/types";
import SettingsPanel from "@/app/(admin)/administracion/SettingsPanel";
import styles from "@/app/(admin)/administracion/Administracion.module.css";

type AjustesPageClientProps = {
  displayName: string;
  role: Rol;
  initialLanguage: Locale;
};

const translations = {
  es: {
    menu: "Menú",
    home: "Inicio",
    live: "En directo",
    events: "Partidos y eventos",
    services: "Nuestros servicios",
    notifications: "Notificaciones",
    settings: "Ajustes",
    liveTag: "Live",
    subscribe: "¡SÚSCRIBETE AHORA!",
    subscribeText: "Para disfrutar de todas las ventajas del Premium",
    title: "Ajustes",
    subtitle: "Gestiona tu cuenta, preferencias y suscripción",
    admin: "Administrador",
    user: "Usuario",
  },
  ca: {
    menu: "Menú",
    home: "Inici",
    live: "En directe",
    events: "Partits i esdeveniments",
    services: "Els nostres serveis",
    notifications: "Notificacions",
    settings: "Ajustos",
    liveTag: "Live",
    subscribe: "SUBSCRIU-TE ARA!",
    subscribeText: "Per gaudir de tots els avantatges del Premium",
    title: "Ajustos",
    subtitle: "Gestiona el teu compte, preferències i subscripció",
    admin: "Administrador",
    user: "Usuari",
  },
  en: {
    menu: "Menu",
    home: "Home",
    live: "Live",
    events: "Matches and events",
    services: "Our services",
    notifications: "Notifications",
    settings: "Settings",
    liveTag: "Live",
    subscribe: "SUBSCRIBE NOW!",
    subscribeText: "Enjoy all the benefits of Premium",
    title: "Settings",
    subtitle: "Manage your account, preferences and subscription",
    admin: "Administrator",
    user: "User",
  },
} as const;

export default function AjustesPageClient({
  displayName,
  role,
  initialLanguage,
}: AjustesPageClientProps) {
  const [language, setLanguage] = useState<Locale>(initialLanguage);
  const t = translations[language];
  const roleLabel = useMemo(
    () => (role === "admin" ? t.admin : t.user),
    [role, t.admin, t.user]
  );

  useEffect(() => {
    document.cookie = `${LOCALE_COOKIE}=${language}; path=/; max-age=31536000; samesite=lax`;
  }, [language]);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          <p className={styles.menuLabel}>{t.menu}</p>
          <nav className={styles.menuList}>
            <Link href="/dashboard" className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-home.svg" alt="" />
              <span>{t.home}</span>
            </Link>
            <Link href="/directo" className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-live.svg" alt="" />
              <span>{t.live}</span>
              <span className={styles.liveTag}>
                {t.liveTag} <i />
              </span>
            </Link>
            <Link href="/videos" className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-events.svg" alt="" />
              <span>{t.events}</span>
            </Link>
            <Link href="/app/servicios" className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-services.svg" alt="" />
              <span>{t.services}</span>
            </Link>
            <Link href="/dashboard#notificaciones" className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-bell.svg" alt="" />
              <span>{t.notifications}</span>
              <span className={styles.badge}>22</span>
            </Link>
            <Link href="/app/ajustes" className={`${styles.menuItem} ${styles.active}`}>
              <img src="/assets/figma/admin-menu-settings.svg" alt="" />
              <span>{t.settings}</span>
            </Link>
          </nav>
          <div className={styles.subscribeCard}>
            <div className={`kdam ${styles.subscribeTitle}`}>
              {t.subscribe.split(" ").slice(0, -1).join(" ")}
              <br />
              {t.subscribe.split(" ").slice(-1)}
            </div>
            <div className={styles.subscribeFooter}>
              <p>{t.subscribeText}</p>
              <img src="/assets/figma/icon-arrow-up-right.svg" alt="" />
            </div>
          </div>
        </aside>

        <section className={styles.content}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <img
                className={styles.logoSmall}
                src="/assets/figma/logo-md-dark.svg"
                alt="Movida Deportiva TV"
              />
              <div>
                <h1>{t.title}</h1>
                <p>{t.subtitle}</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.iconButton}>
                <img src="/assets/figma/admin2-icon-bell-top.png" alt="" />
                <span className={styles.dot} />
              </button>
              <div className={styles.adminCard}>
                <span className={styles.adminIcon}>
                  <img src="/assets/figma/admin2-icon-user.png" alt="" />
                </span>
                <div>
                  <strong>{displayName}</strong>
                  <p>{roleLabel}</p>
                </div>
              </div>
            </div>
          </header>
          <div className={styles.settingsContent}>
            <SettingsPanel
              displayName={displayName}
              roleLabel={roleLabel}
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
