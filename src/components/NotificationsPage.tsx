import Link from "next/link";
import type { NotificationFeedItem } from "@/lib/backoffice";
import type { Locale } from "@/lib/i18n-shared";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import styles from "@/app/app/notificaciones/Notificaciones.module.css";

type NotificationsPageProps = {
  locale: Locale;
  displayName: string;
  isAdmin: boolean;
  items: NotificationFeedItem[];
  notificationCount: number;
};

export default function NotificationsPage({
  locale,
  displayName,
  isAdmin,
  items,
  notificationCount,
}: NotificationsPageProps) {
  const homeHref = isAdmin ? "/dashboard" : "/app";
  const notificationsHref = isAdmin ? "/admin/notificaciones" : "/app/notificaciones";
  const t = {
    es: {
      menu: "Menú",
      home: "Inicio",
      adminPanel: "Panel admin",
      live: "En directo",
      events: "Partidos y eventos",
      services: "Nuestros servicios",
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
      services: "Els nostres serveis",
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
      services: "Our services",
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
          <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          <div className={styles.menuBlock}>
            <p className={styles.menuLabel}>{t.menu}</p>
            <nav className={styles.menuList}>
              <Link href={homeHref} prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
              </Link>
              {isAdmin ? (
                <Link href="/admin/panel" prefetch={false} className={styles.menuItem}>
                  <img src="/assets/figma/admin-menu-panel.svg" alt="" />
                  <span>{t.adminPanel}</span>
                </Link>
              ) : null}
              <Link href="/directo" prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                <span className={styles.liveTag}>
                  Live <i />
                </span>
              </Link>
              <Link href="/videos" prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-events.svg" alt="" />
                <span>{t.events}</span>
              </Link>
              <Link href="/app/servicios" prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-services.svg" alt="" />
                <span>{t.services}</span>
              </Link>
              <Link href={notificationsHref} prefetch={false} className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/admin-menu-bell.svg" alt="" />
                <span>{t.notifications}</span>
                <NotificationDateBadge count={notificationCount} className={styles.badge} />
              </Link>
              <Link href="/app/ajustes" prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-settings.svg" alt="" />
                <span>{t.settings}</span>
              </Link>
            </nav>
          </div>
        </ResponsiveSidebar>

        <section className={styles.content}>
          <header className={styles.topbar}>
            <div className={styles.userInfo}>
              <img src="/assets/figma/dashboard-user.png" alt="" />
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
              <Link href="/logout" className={styles.headerLogoutButton}>
                {t.logout}
              </Link>
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
