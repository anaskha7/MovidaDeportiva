import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import { getLocale } from "@/lib/i18n";
import { formatUserName, getSession } from "@/lib/session";
import AdminDashboardPanel from "@/app/(admin)/dashboard/AdminDashboardPanel";
import styles from "@/app/(admin)/dashboard/Dashboard.module.css";

export default async function AdminPanelPage() {
  const session = await getSession();
  const locale = await getLocale();
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
      subscribe: "¡SÚSCRIBETE",
      subscribe2: "AHORA!",
      subscribeText: "Para disfrutar de todas las ventajas del Premium",
      greeting: "Buenos días,",
      search: "Buscar en admin...",
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
      subscribe: "SUBSCRIU-TE",
      subscribe2: "ARA!",
      subscribeText: "Per gaudir de tots els avantatges del Premium",
      greeting: "Bon dia,",
      search: "Cercar a admin...",
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
      subscribe: "SUBSCRIBE",
      subscribe2: "NOW!",
      subscribeText: "Enjoy all the benefits of Premium",
      greeting: "Good morning,",
      search: "Search in admin...",
    },
  }[locale];

  return (
    <main className={styles.dashboardPage}>
      <div className={styles.dashboardGrid}>
        <aside className={styles.sidebar}>
          <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          <div className={styles.menuBlock}>
            <p className={styles.menuLabel}>{t.menu}</p>
            <nav className={styles.menuList}>
              <Link href="/dashboard" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
              </Link>
              <Link href="/admin/panel" className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/admin-menu-panel.svg" alt="" />
                <span>{t.adminPanel}</span>
              </Link>
              <Link href="/directo" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                <span className={styles.liveTag}>Live <i /></span>
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
              <Link href="/app/ajustes" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-settings.svg" alt="" />
                <span>{t.settings}</span>
              </Link>
            </nav>
          </div>
          <div className={styles.subscribeCard}>
            <div className={`kdam ${styles.subscribeTitle}`}>
              {t.subscribe}
              <br />
              {t.subscribe2}
            </div>
            <div className={styles.subscribeFooter}>
              <p>{t.subscribeText}</p>
              <img src="/assets/figma/icon-arrow-up-right.svg" alt="" />
            </div>
          </div>
        </aside>

        <section className={styles.mainColumn}>
          <header className={styles.topbar}>
            <div className={styles.userInfo}>
              <img src="/assets/figma/dashboard-user.png" alt="" />
              <div>
                <p>{t.greeting}</p>
                <strong>{formatUserName(session?.name)}</strong>
              </div>
            </div>
            <div className={styles.topbarActions}>
              <form className={styles.searchBox} action="/admin/panel" method="get">
                <img src="/assets/figma/icon-search.png" alt="" />
                <input type="text" name="q" placeholder={t.search} aria-label={t.search} />
              </form>
              <div className={styles.iconGroup}>
                <NotificationBell locale={locale} />
                <Link href="/logout" className={styles.headerLogoutButton}>
                  {t.logout}
                </Link>
              </div>
            </div>
          </header>

          <AdminDashboardPanel locale={locale} />
        </section>
      </div>
    </main>
  );
}
