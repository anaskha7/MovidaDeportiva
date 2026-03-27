import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { getNotificationFeedForSession } from "@/lib/backoffice";
import { getLocale } from "@/lib/i18n";
import { hasActiveLiveMatch } from "@/lib/repos/partidos";
import { formatUserName, getSession } from "@/lib/session";
import { submitServiceRequestAction } from "./actions";
import ContratarServiciosClient from "./ContratarServiciosClient";
import styles from "./ServiciosPrivados.module.css";

export default async function ServiciosPrivadosPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const session = await getSession();
  const locale = await getLocale();
  const hasLiveNow = hasActiveLiveMatch();
  const homeHref = session?.role === "admin" ? "/dashboard" : "/app";
  const notificationsHref =
    session?.role === "admin" ? "/admin/notificaciones" : "/app/notificaciones";
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const searchQuery = searchParams?.q?.trim() || "";
  const notificationFeed = await getNotificationFeedForSession({
    session,
    locale,
    limit: 6,
  });
  const t = {
    es: { menu: "Menú", home: "Inicio", live: "En directo", events: "Partidos y eventos", services: "Nuestros servicios", notifications: "Notificaciones", settings: "Ajustes", logout: "Cerrar sesión", subscribe: "¡SÚSCRIBETE", subscribe2: "AHORA!", subscribeText: "Para disfrutar de todas las ventajas del Premium", greeting: "Buenos días,", search: "Buscar servicio..." },
    ca: { menu: "Menú", home: "Inici", live: "En directe", events: "Partits i esdeveniments", services: "Els nostres serveis", notifications: "Notificacions", settings: "Ajustos", logout: "Tancar sessió", subscribe: "SUBSCRIU-TE", subscribe2: "ARA!", subscribeText: "Per gaudir de tots els avantatges del Premium", greeting: "Bon dia,", search: "Cercar servei..." },
    en: { menu: "Menu", home: "Home", live: "Live", events: "Matches and events", services: "Our services", notifications: "Notifications", settings: "Settings", logout: "Log out", subscribe: "SUBSCRIBE", subscribe2: "NOW!", subscribeText: "Enjoy all the benefits of Premium", greeting: "Good morning,", search: "Search service..." },
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
              items={notificationFeed.items}
              count={notificationFeed.count}
            />
          }
        >
          <img
            className={styles.logo}
            src="/assets/figma/logo-md-dark.svg"
            alt="Movida Deportiva TV"
          />
          <div className={styles.menuBlock}>
            <p className={styles.menuLabel}>{t.menu}</p>
            <nav className={styles.menuList}>
              <Link href={homeHref} prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
              </Link>
              {session?.role === "admin" ? (
                <Link href="/admin/panel" prefetch={false} className={styles.menuItem}>
                  <img src="/assets/figma/admin-menu-panel.svg" alt="" />
                  <span>{locale === "en" ? "Admin panel" : locale === "ca" ? "Panell admin" : "Panel admin"}</span>
                </Link>
              ) : null}
              <Link href="/directo" prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                {hasLiveNow ? <span className={styles.liveTag}>Live <i /></span> : null}
              </Link>
              <Link href="/videos" prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-events.svg" alt="" />
                <span>{t.events}</span>
              </Link>
              <Link href="/app/servicios" prefetch={false} className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/admin-menu-services.svg" alt="" />
                <span>{t.services}</span>
              </Link>
              <Link href={notificationsHref} prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-bell.svg" alt="" />
                <span>{t.notifications}</span>
                <NotificationDateBadge count={notificationFeed.count} className={styles.badge} />
              </Link>
              <Link href="/app/ajustes" prefetch={false} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-settings.svg" alt="" />
                <span>{t.settings}</span>
              </Link>
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
              <form className={styles.searchBox} action="/app/servicios" method="get">
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
                  viewAllHref={notificationsHref}
                  className={styles.mobileHiddenBell}
                  items={notificationFeed.items}
                  count={notificationFeed.count}
                />
                <Link href="/logout" className={styles.headerLogoutButton}>
                  {t.logout}
                </Link>
              </div>
            </div>
          </header>

          <ContratarServiciosClient
            locale={locale}
            initialQuery={searchQuery}
            initialName={session?.name ?? ""}
            initialEmail={session?.email ?? ""}
            onSubmitRequest={submitServiceRequestAction}
          />
        </section>
      </div>
    </main>
  );
}
