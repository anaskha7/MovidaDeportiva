import HardNavLink from "@/components/HardNavLink";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { getAdminPanelData } from "@/lib/backoffice";
import { getLocale } from "@/lib/i18n";
import { hasActiveLiveMatch } from "@/lib/repos/partidos";
import { formatUserName, getSession } from "@/lib/session";
import AdminDashboardPanel from "@/app/(admin)/dashboard/AdminDashboardPanel";
import {
  changeUserRoleAction,
  createDirectoAction,
  createPlatformNotificationAction,
  toggleUserBlockedAction,
  updateDirectoStatusAction,
  updateServiceRequestStatusAction,
} from "@/app/(admin)/dashboard/actions";
import styles from "@/app/(admin)/dashboard/Dashboard.module.css";

export default async function AdminPanelPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const session = await getSession();
  const locale = await getLocale();
  const hasLiveNow = hasActiveLiveMatch();
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const searchQuery = searchParams?.q?.trim() ?? "";
  const adminData = await getAdminPanelData({
    locale,
    session,
  });
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
        <ResponsiveSidebar
          locale={locale}
          sidebarClassName={styles.sidebar}
          mobileActions={
            <NotificationBell
              locale={locale}
              viewAllHref="/admin/notificaciones"
              items={adminData.notifications}
              count={adminData.notificationCount}
            />
          }
        >
          <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          <div className={styles.menuBlock}>
            <p className={styles.menuLabel}>{t.menu}</p>
            <nav className={styles.menuList}>
              <HardNavLink href="/dashboard" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
              </HardNavLink>
              <HardNavLink href="/admin/panel" className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/admin-menu-panel.svg" alt="" />
                <span>{t.adminPanel}</span>
              </HardNavLink>
              <HardNavLink href="/directo" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                {hasLiveNow ? <span className={styles.liveTag}>Live <i /></span> : null}
              </HardNavLink>
              <HardNavLink href="/videos" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-events.svg" alt="" />
                <span>{t.events}</span>
              </HardNavLink>
              <HardNavLink href="/admin/notificaciones" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-bell.svg" alt="" />
                <span>{t.notifications}</span>
                <NotificationDateBadge
                  count={adminData.notificationCount}
                  className={styles.badge}
                />
              </HardNavLink>
              <HardNavLink href="/app/ajustes" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-settings.svg" alt="" />
                <span>{t.settings}</span>
              </HardNavLink>
            </nav>
          </div>
        </ResponsiveSidebar>

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
                <img src="/assets/figma/icon-search.svg" alt="" />
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder={t.search}
                  aria-label={t.search}
                />
              </form>
              <div className={styles.iconGroup}>
                <NotificationBell
                  locale={locale}
                  viewAllHref="/admin/notificaciones"
                  className={styles.mobileHiddenBell}
                  items={adminData.notifications}
                  count={adminData.notificationCount}
                />
                <HardNavLink href="/logout" className={styles.headerLogoutButton}>
                  {t.logout}
                </HardNavLink>
              </div>
            </div>
          </header>

          <AdminDashboardPanel
            locale={locale}
            initialQuery={searchQuery}
            users={adminData.users}
            roles={adminData.roles}
            requests={adminData.requests}
            directs={adminData.directs}
            logs={adminData.logs}
            notifications={adminData.notifications}
            metrics={adminData.metrics}
            onChangeUserRole={changeUserRoleAction}
            onToggleUserBlocked={toggleUserBlockedAction}
            onCreateDirect={createDirectoAction}
            onUpdateDirectStatus={updateDirectoStatusAction}
            onUpdateRequestStatus={updateServiceRequestStatusAction}
            onCreateNotification={createPlatformNotificationAction}
          />
        </section>
      </div>
    </main>
  );
}
