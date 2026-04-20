import HardNavLink from "@/components/HardNavLink";
import type { NotificationFeedItem } from "@/lib/backoffice";
import type { Locale } from "@/lib/i18n-shared";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ProfileAvatar from "@/components/ProfileAvatar";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { hasActiveLiveMatch } from "@/lib/repos/partidos";
import styles from "@/app/app/notificaciones/Notificaciones.module.css";

type NotificationsPageProps = {
  locale: Locale;
  displayName: string;
  avatarUrl?: string | null;
  isAdmin: boolean;
  items: NotificationFeedItem[];
  notificationCount: number;
};

export default function NotificationsPage({
  locale,
  displayName,
  avatarUrl,
  isAdmin,
  items,
  notificationCount,
}: NotificationsPageProps) {
  const homeHref = isAdmin ? "/dashboard" : "/app";
  const notificationsHref = isAdmin ? "/admin/notificaciones" : "/app/notificaciones";
  const hasLiveNow = hasActiveLiveMatch();
  const t = {
    es: {
      menu: "Menú",
      home: "Inicio",
      adminPanel: "Panel admin",
      live: "En directo",
      events: "Partidos y eventos",
      notifications: "Notificaciones",
      settings: "Ajustes",
      logout: "Cerrar sesión",
      greeting: "Buenos días,",
      title: "Tus notificaciones",
      subtitle: "Consulta actividad reciente y avisos de tu cuenta.",
      now: "Ahora",
      recent: "Reciente",
    },
    ca: {
      menu: "Menú",
      home: "Inici",
      adminPanel: "Panell admin",
      live: "En directe",
      events: "Partits i esdeveniments",
      notifications: "Notificacions",
      settings: "Ajustos",
      logout: "Tancar sessió",
      greeting: "Bon dia,",
      title: "Les teves notificacions",
      subtitle: "Consulta l'activitat recent i els avisos del teu compte.",
      now: "Ara",
      recent: "Recent",
    },
    en: {
      menu: "Menu",
      home: "Home",
      adminPanel: "Admin panel",
      live: "Live",
      events: "Matches and events",
      notifications: "Notifications",
      settings: "Settings",
      logout: "Log out",
      greeting: "Good morning,",
      title: "Your notifications",
      subtitle: "Check recent activity and account alerts.",
      now: "Now",
      recent: "Recent",
    },
  }[locale];

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <ResponsiveSidebar
          locale={locale}
          sidebarClassName={styles.sidebar}
          mobileActions={
            <NotificationBell
              locale={locale}
              viewAllHref={notificationsHref}
              items={items.slice(0, 6)}
              count={notificationCount}
            />
          }
        >
          <HardNavLink href="/" aria-label="Volver a la web">
            <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          </HardNavLink>
          <div className={styles.menuBlock}>
            <p className={styles.menuLabel}>{t.menu}</p>
            <nav className={styles.menuList}>
              <HardNavLink href={homeHref} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
              </HardNavLink>
              {isAdmin ? (
                <HardNavLink href="/admin/panel" className={styles.menuItem}>
                  <img src="/assets/figma/admin-menu-panel.svg" alt="" />
                  <span>{t.adminPanel}</span>
                </HardNavLink>
              ) : null}
              <HardNavLink href="/directo" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                {hasLiveNow ? (
                  <span className={styles.liveTag}>
                    Live <i />
                  </span>
                ) : null}
              </HardNavLink>
              <HardNavLink href="/videos" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-events.svg" alt="" />
                <span>{t.events}</span>
              </HardNavLink>
              <HardNavLink href={notificationsHref} className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/admin-menu-bell.svg" alt="" />
                <span>{t.notifications}</span>
                <NotificationDateBadge count={notificationCount} className={styles.badge} />
              </HardNavLink>
              <HardNavLink href="/app/ajustes" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-settings.svg" alt="" />
                <span>{t.settings}</span>
              </HardNavLink>
            </nav>
          </div>
        </ResponsiveSidebar>

        <section className={styles.content}>
          <header className={styles.topbar}>
            <div className={styles.userInfo}>
              <ProfileAvatar alt={displayName} src={avatarUrl} />
              <div>
                <p>{t.greeting}</p>
                <strong>{displayName}</strong>
              </div>
            </div>
            <div className={styles.topbarActions}>
              <NotificationBell
                locale={locale}
                viewAllHref={notificationsHref}
                className={styles.mobileHiddenBell}
                items={items.slice(0, 6)}
                count={notificationCount}
              />
              <HardNavLink href="/logout" className={styles.headerLogoutButton}>
                {t.logout}
              </HardNavLink>
            </div>
          </header>

          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.eyebrow}>{t.recent}</span>
                <h1>{t.title}</h1>
                <p>{t.subtitle}</p>
              </div>
              <div className={styles.counter}>
                <NotificationDateBadge count={notificationCount} as="strong" />
                <span>{t.now}</span>
              </div>
            </div>

            <div className={styles.list}>
              {items.map((item) => (
                <article key={item.id} className={styles.item}>
                  <span className={styles.itemDot} />
                  <div className={styles.itemBody}>
                    <p>
                      {item.actor ? <strong>{item.actor}</strong> : null}
                      {item.actor ? " " : null}
                      <span>{item.message}</span>
                    </p>
                    <span className={styles.itemMeta}>{item.createdAtLabel}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
