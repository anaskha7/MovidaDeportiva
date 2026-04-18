"use client";

import { useEffect, useMemo, useState } from "react";
import HardNavLink from "@/components/HardNavLink";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ProfileAvatar from "@/components/ProfileAvatar";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import type { NotificationFeedItem } from "@/lib/backoffice";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n-shared";
import type { Rol } from "@/lib/types";
import SettingsPanel from "@/app/(admin)/administracion/SettingsPanel";
import styles from "@/app/(admin)/administracion/Administracion.module.css";

type AjustesPageClientProps = {
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  role: Rol;
  initialLanguage: Locale;
  hasLiveNow: boolean;
  notificationItems: NotificationFeedItem[];
  notificationCount: number;
};

const translations = {
    es: {
      menu: "Menú",
    home: "Inicio",
    live: "En directo",
    events: "Partidos y eventos",
      notifications: "Notificaciones",
      settings: "Ajustes",
      logout: "Cerrar sesión",
    liveTag: "Live",
    subscribe: "¡SÚSCRIBETE AHORA!",
    subscribeText: "Para disfrutar de todas las ventajas del Premium",
    title: "Ajustes",
    subtitle: "Gestiona tu cuenta, preferencias y suscripción",
    admin: "Administrador",
    subscriber: "Suscriptor",
    user: "Usuario",
  },
  ca: {
    menu: "Menú",
    home: "Inici",
    live: "En directe",
    events: "Partits i esdeveniments",
      notifications: "Notificacions",
      settings: "Ajustos",
      logout: "Tancar sessió",
    liveTag: "Live",
    subscribe: "SUBSCRIU-TE ARA!",
    subscribeText: "Per gaudir de tots els avantatges del Premium",
    title: "Ajustos",
    subtitle: "Gestiona el teu compte, preferències i subscripció",
    admin: "Administrador",
    subscriber: "Subscriptor",
    user: "Usuari",
  },
  en: {
    menu: "Menu",
    home: "Home",
    live: "Live",
    events: "Matches and events",
      notifications: "Notifications",
      settings: "Settings",
      logout: "Log out",
    liveTag: "Live",
    subscribe: "SUBSCRIBE NOW!",
    subscribeText: "Enjoy all the benefits of Premium",
    title: "Settings",
    subtitle: "Manage your account, preferences and subscription",
    admin: "Administrator",
    subscriber: "Subscriber",
    user: "User",
  },
} as const;

export default function AjustesPageClient({
  displayName,
  email,
  avatarUrl,
  role,
  initialLanguage,
  hasLiveNow,
  notificationItems,
  notificationCount,
}: AjustesPageClientProps) {
  const [language, setLanguage] = useState<Locale>(initialLanguage);
  const [currentDisplayName, setCurrentDisplayName] = useState(displayName);
  const [currentEmail, setCurrentEmail] = useState(email);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(
    avatarUrl ?? null,
  );
  const t = translations[language];
  const roleLabel = useMemo(
    () => (role === "admin" ? t.admin : role === "suscriptor" ? t.subscriber : t.user),
    [role, t.admin, t.subscriber, t.user]
  );
  const homeHref = role === "admin" ? "/dashboard" : "/app";
  const notificationsHref =
    role === "admin" ? "/admin/notificaciones" : "/app/notificaciones";

  useEffect(() => {
    document.cookie = `${LOCALE_COOKIE}=${language}; path=/; max-age=31536000; samesite=lax`;
  }, [language]);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ResponsiveSidebar
          locale={language}
          sidebarClassName={styles.sidebar}
          mobileActions={
            <NotificationBell
              locale={language}
              iconSrc="/assets/figma/admin-menu-bell.svg"
              viewAllHref={notificationsHref}
              items={notificationItems}
              count={notificationCount}
            />
          }
        >
          <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          <p className={styles.menuLabel}>{t.menu}</p>
          <nav className={styles.menuList}>
            <HardNavLink href={homeHref} className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-home.svg" alt="" />
              <span>{t.home}</span>
            </HardNavLink>
            {role === "admin" ? (
              <HardNavLink href="/admin/panel" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-panel.svg" alt="" />
                <span>{language === "en" ? "Admin panel" : language === "ca" ? "Panell admin" : "Panel admin"}</span>
              </HardNavLink>
            ) : null}
            <HardNavLink href="/directo" className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-live.svg" alt="" />
              <span>{t.live}</span>
              {hasLiveNow ? (
                <span className={styles.liveTag}>
                  {t.liveTag} <i />
                </span>
              ) : null}
            </HardNavLink>
            <HardNavLink href="/videos" className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-events.svg" alt="" />
              <span>{t.events}</span>
            </HardNavLink>
            <HardNavLink href={notificationsHref} className={styles.menuItem}>
              <img src="/assets/figma/admin-menu-bell.svg" alt="" />
              <span>{t.notifications}</span>
              <NotificationDateBadge count={notificationCount} className={styles.badge} />
            </HardNavLink>
            <HardNavLink href="/app/ajustes" className={`${styles.menuItem} ${styles.active}`}>
              <img src="/assets/figma/admin-menu-settings.svg" alt="" />
              <span>{t.settings}</span>
            </HardNavLink>
          </nav>
        </ResponsiveSidebar>

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
              <div className={styles.adminCard}>
                <span className={styles.adminIcon}>
                  <ProfileAvatar
                    alt={currentDisplayName}
                    src={currentAvatarUrl}
                  />
                </span>
              <div>
                  <strong>{currentDisplayName}</strong>
                  <p>{roleLabel}</p>
                </div>
              </div>
              <NotificationBell
                locale={language}
                iconSrc="/assets/figma/admin-menu-bell.svg"
                viewAllHref={notificationsHref}
                className={styles.mobileHiddenBell}
                items={notificationItems}
                count={notificationCount}
              />
              <HardNavLink href="/logout" className={styles.headerLogoutButton}>
                {t.logout}
              </HardNavLink>
            </div>
          </header>
          <div className={styles.settingsContent}>
            <SettingsPanel
              displayName={currentDisplayName}
              email={currentEmail}
              avatarUrl={currentAvatarUrl}
              role={role}
              roleLabel={roleLabel}
              language={language}
              onLanguageChange={setLanguage}
              onProfileUpdated={({
                displayName: nextDisplayName,
                email: nextEmail,
                avatarUrl: nextAvatarUrl,
              }) => {
                setCurrentDisplayName(nextDisplayName);
                setCurrentEmail(nextEmail);
                setCurrentAvatarUrl(nextAvatarUrl);
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
