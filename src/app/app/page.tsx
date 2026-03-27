import Link from "next/link";
import { redirect } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { getNotificationFeedForSession } from "@/lib/backoffice";
import { getLocale } from "@/lib/i18n";
import { getCategorias } from "@/lib/repos/categorias";
import { hasActiveLiveMatch } from "@/lib/repos/partidos";
import { getVideos } from "@/lib/repos/videos";
import { getCompetitionSchedule } from "@/lib/schedules";
import { prisma } from "@/lib/prisma";
import { formatUserName, getSession } from "@/lib/session";
import DashboardSidebarWidgets from "../(admin)/dashboard/DashboardSidebarWidgets";
import styles from "../(admin)/dashboard/Dashboard.module.css";

function getMadridDateKey() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate(),
    ).padStart(2, "0")}`;
  }

  return `${year}-${month}-${day}`;
}

export default async function AppPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const session = await getSession();

  if (session?.role === "admin") {
    redirect("/dashboard");
  }

  const locale = await getLocale();
  const hasLiveNow = hasActiveLiveMatch();
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const searchQuery =
    typeof searchParams?.q === "string" ? searchParams.q.trim().toLowerCase() : "";
  const notificationsHref = "/app/notificaciones";
  const t = {
    es: {
      menu: "Menú",
      home: "Inicio",
      live: "En directo",
      events: "Partidos y eventos",
      services: "Nuestros servicios",
      notifications: "Notificaciones",
      settings: "Ajustes",
      logout: "Cerrar sesión",
      greeting: "Buenos días,",
      search: "¿Qué estás buscando?",
      request: "Solicitar servicios",
      requestText: "Escoje que tipo de servicio quieres contratar.",
      from: "Desde",
      eventsText: "Disfruta del mejor fútbol siempre que quieras",
      noResults: "No hay resultados para esta búsqueda.",
    },
    ca: {
      menu: "Menú",
      home: "Inici",
      live: "En directe",
      events: "Partits i esdeveniments",
      services: "Els nostres serveis",
      notifications: "Notificacions",
      settings: "Ajustos",
      logout: "Tancar sessió",
      greeting: "Bon dia,",
      search: "Què estàs buscant?",
      request: "Sol·licitar serveis",
      requestText: "Escull quin tipus de servei vols contractar.",
      from: "Des de",
      eventsText: "Gaudeix del millor futbol sempre que vulguis",
      noResults: "No s'han trobat resultats per a aquesta cerca.",
    },
    en: {
      menu: "Menu",
      home: "Home",
      live: "Live",
      events: "Matches and events",
      services: "Our services",
      notifications: "Notifications",
      settings: "Settings",
      logout: "Log out",
      greeting: "Good morning,",
      search: "What are you looking for?",
      request: "Request services",
      requestText: "Choose the type of service you want to hire.",
      from: "From",
      eventsText: "Enjoy the best football whenever you want",
      noResults: "No results found for this search.",
    },
  }[locale];
  const metricsCopy = {
    es: {
      metrics: "Resumen del panel",
      savedVideos: "Partidos guardados",
      nextMatches: "Próximos partidos",
      requests: "Mis solicitudes",
      unread: "Sin leer",
    },
    ca: {
      metrics: "Resum del panell",
      savedVideos: "Partits desats",
      nextMatches: "Pròxims partits",
      requests: "Les meves sol·licituds",
      unread: "Sense llegir",
    },
    en: {
      metrics: "Panel overview",
      savedVideos: "Saved matches",
      nextMatches: "Upcoming matches",
      requests: "My requests",
      unread: "Unread",
    },
  }[locale];
  const matchesSearch = (value: string) =>
    !searchQuery || value.toLowerCase().includes(searchQuery);
  const serviceCards = [
    { title: "SERVICIOS RETRANSMISION", price: "19,99€/hora", className: styles.serviceBox, icon: "video" },
    { title: "SPEAKERS Y ANIMACIÓN", price: "27,99€/hora", className: styles.serviceBoxLight, icon: "audio" },
  ].filter((item) => matchesSearch(item.title));

  const [notificationFeed, ownRequestsCount] = await Promise.all([
    getNotificationFeedForSession({ session, locale, limit: 6 }),
    prisma.solicitudServicio.count({
      where: session?.userId
        ? { id_usuario: session.userId }
        : session?.email
          ? { email_contacto: session.email }
          : undefined,
    }),
  ]);

  const todayIso = getMadridDateKey();
  const categoriasConCalendario = getCategorias().filter((categoria) => categoria.calendarioUrl);
  const dashboardCalendarEvents = (
    await Promise.all(
      categoriasConCalendario.map(async (categoria) => ({
        categoria,
        schedule: categoria.calendarioUrl
          ? await getCompetitionSchedule(categoria.calendarioUrl)
          : null,
      })),
    )
  )
    .flatMap(({ categoria, schedule }) =>
      schedule?.rounds.flatMap((round) =>
        round.matches.map((match, index) => ({
          id: `${categoria.id}-${round.round}-${round.dateIso}-${index}`,
          title: `${match.homeTeam} vs ${match.awayTeam}`,
          competition: categoria.nombre,
          timeLabel: match.timeLabel ?? round.dateLabel,
          dateIso: round.dateIso,
        })),
      ) ?? [],
    )
    .filter((event) => matchesSearch(`${event.title} ${event.competition}`))
    .sort((a, b) =>
      a.dateIso === b.dateIso
        ? a.competition.localeCompare(b.competition, locale === "ca" ? "ca" : locale)
        : a.dateIso.localeCompare(b.dateIso),
    );

  const savedVideosCount = getVideos({
    deportes: ["dep-futbol", "dep-futsal"],
  }).total;
  const showLiveCard = matchesSearch("GRAMA vs VILANOVA 3ª Federación Grupo V Jornada 19");
  const showEventsCard = matchesSearch("Partidos y eventos Disfruta del mejor fútbol siempre que quieras");
  const notificationItems = notificationFeed.items.filter(
    (item: (typeof notificationFeed.items)[number]) =>
      matchesSearch(`${item.actor ?? ""} ${item.message}`),
  );

  return (
    <main className={styles.dashboardPage}>
      <div className={styles.dashboardGrid}>
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
              <Link href="/app" className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
              </Link>
              <Link href="/directo" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                {hasLiveNow ? <span className={styles.liveTag}>Live <i /></span> : null}
              </Link>
              <Link href="/videos" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-events.svg" alt="" />
                <span>{t.events}</span>
              </Link>
              <Link href="/app/servicios" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-services.svg" alt="" />
                <span>{t.services}</span>
              </Link>
              <Link href={notificationsHref} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-bell.svg" alt="" />
                <span>{t.notifications}</span>
                <NotificationDateBadge count={notificationFeed.count} className={styles.badge} />
              </Link>
              <Link href="/app/ajustes" className={styles.menuItem}>
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
              <form className={styles.searchBox} action="/app" method="get">
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

          <div className={styles.mainContent}>
            <div className={styles.leftStack}>
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <strong>{metricsCopy.metrics}</strong>
                    <p>{metricsCopy.unread}: {notificationFeed.count}</p>
                  </div>
                </div>
                <div className={styles.metricsGrid}>
                  <div className={styles.metricCard}>
                    <span>{metricsCopy.savedVideos}</span>
                    <strong>{savedVideosCount}</strong>
                  </div>
                  <div className={styles.metricCard}>
                    <span>{metricsCopy.nextMatches}</span>
                    <strong>{dashboardCalendarEvents.length}</strong>
                  </div>
                  <div className={styles.metricCard}>
                    <span>{metricsCopy.requests}</span>
                    <strong>{ownRequestsCount}</strong>
                  </div>
                  <div className={styles.metricCard}>
                    <span>{metricsCopy.unread}</span>
                    <strong>{notificationFeed.count}</strong>
                  </div>
                </div>
              </article>

              {showLiveCard ? <Link href="/directo" className={styles.cardLink}>
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.cardTitle}>
                      <strong>GRAMA vs VILANOVA</strong>
                      <span className={styles.liveTagSmall}>
                        Live <i />
                      </span>
                    </div>
                    <p>3ª Federación - GRUPO V - Jornada 19</p>
                  </div>
                  <img src="/assets/figma/icon-arrow-up-right-dark.svg" alt="" />
                </div>
                <div className={styles.videoFrame}>
                  <img src="/assets/figma/dashboard-live.png" alt="" />
                  <div className={styles.videoOverlay} />
                  <img
                    className={styles.playIcon}
                    src="/assets/figma/icon-play.png"
                    alt=""
                  />
                </div>
              </article>
              </Link> : null}

              {serviceCards.length > 0 ? <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <strong>{t.request}</strong>
                    <p>{t.requestText}</p>
                  </div>
                  <img src="/assets/figma/icon-arrow-up-right-dark.svg" alt="" />
                </div>
                <div className={styles.serviceRow}>
                  {serviceCards.map((card) => (
                  <Link key={card.title} href="/app/servicios" className={card.className}>
                    <div className={styles.serviceBoxInner}>
                      <strong>{card.title}</strong>
                      <span>{t.from} {card.price}</span>
                    </div>
                    <span className={styles.serviceBoxIcon} aria-hidden="true">
                      {card.icon === "video" ? (
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="7" width="12" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M15 10.2 20.5 7.5v9L15 13.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" />
                        <path d="M6.5 14.2h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      ) : (
                      <svg viewBox="0 0 24 24">
                        <path d="M5 13.5V12a7 7 0 1 1 14 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <rect x="4" y="12.5" width="3.8" height="6.5" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        <rect x="16.2" y="12.5" width="3.8" height="6.5" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M7.8 19h3.2c.3 1 1.2 1.7 2.3 1.7h1.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      )}
                    </span>
                  </Link>
                  ))}
                </div>
              </article> : null}

              {showEventsCard ? <Link href="/videos" className={styles.cardLink}>
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <strong>{t.events}</strong>
                    <p>{t.eventsText}</p>
                  </div>
                  <img src="/assets/figma/icon-arrow-up-right-dark.svg" alt="" />
                </div>
                <div className={styles.eventRow}>
                  <div className={styles.eventCard}>
                    <img src="/assets/figma/dashboard-live-2.png" alt="" />
                    <div className={styles.eventOverlay} />
                    <div className={styles.eventMeta}>1:43:28</div>
                  </div>
                  <div className={styles.eventCard}>
                    <img src="/assets/figma/dashboard-live.png" alt="" />
                    <div className={styles.eventOverlay} />
                    <div className={styles.eventMeta}>1:47:12</div>
                  </div>
                </div>
              </article>
              </Link> : null}
            </div>

            <div className={styles.rightStack}>
              <DashboardSidebarWidgets
                locale={locale}
                todayIso={todayIso}
                events={dashboardCalendarEvents}
              />

              <article id="notificaciones" className={styles.cardSmall}>
                <div className={styles.cardHeader}>
                  <div className={styles.noticeHeader}>
                    <strong>{t.notifications}</strong>
                    <NotificationDateBadge count={notificationFeed.count} className={styles.badge} />
                  </div>
                </div>
                {notificationItems.map((item: (typeof notificationItems)[number]) => (
                  <div key={item.id} className={styles.noticeItem}>
                    <span className={styles.noticeDot} />
                    <p>
                      {item.actor ? <strong>{item.actor}</strong> : null}
                      {item.actor ? " " : null}
                      <span>{item.message}</span>
                    </p>
                  </div>
                ))}
                {!showLiveCard && !showEventsCard && serviceCards.length === 0 && notificationItems.length === 0 ? (
                  <div className={styles.scheduleEmptyAlt}>
                    <p>{t.noResults}</p>
                  </div>
                ) : null}
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
