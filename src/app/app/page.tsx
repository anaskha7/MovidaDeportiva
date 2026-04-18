import { redirect } from "next/navigation";
import HardNavLink from "@/components/HardNavLink";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ProfileAvatar from "@/components/ProfileAvatar";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { getNotificationFeedForSession } from "@/lib/backoffice";
import { getCurrentUserBySession } from "@/lib/auth";
import { getLocale } from "@/lib/i18n";
import { getCategorias } from "@/lib/repos/categorias";
import { hasActiveLiveMatch } from "@/lib/repos/partidos";
import { getCompetitionSchedule, getScheduleMatchTimeLabel } from "@/lib/schedules";
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
  const currentUser = await getCurrentUserBySession({
    userId: session?.userId,
    email: session?.email,
  });
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
      notifications: "Notificaciones",
      settings: "Ajustes",
      logout: "Cerrar sesión",
      greeting: "Buenos días,",
      search: "¿Qué estás buscando?",
      eventsText: "Disfruta del mejor fútbol siempre que quieras",
      noResults: "No hay resultados para esta búsqueda.",
    },
    ca: {
      menu: "Menú",
      home: "Inici",
      live: "En directe",
      events: "Partits i esdeveniments",
      notifications: "Notificacions",
      settings: "Ajustos",
      logout: "Tancar sessió",
      greeting: "Bon dia,",
      search: "Què estàs buscant?",
      eventsText: "Gaudeix del millor futbol sempre que vulguis",
      noResults: "No s'han trobat resultats per a aquesta cerca.",
    },
    en: {
      menu: "Menu",
      home: "Home",
      live: "Live",
      events: "Matches and events",
      notifications: "Notifications",
      settings: "Settings",
      logout: "Log out",
      greeting: "Good morning,",
      search: "What are you looking for?",
      eventsText: "Enjoy the best football whenever you want",
      noResults: "No results found for this search.",
    },
  }[locale];
  const scheduleTimeFallback =
    locale === "en" ? "Kick-off TBC" : locale === "ca" ? "Hora pendent" : "Hora por confirmar";
  const matchesSearch = (value: string) =>
    !searchQuery || value.toLowerCase().includes(searchQuery);
  const notificationFeed = await getNotificationFeedForSession({
    session,
    locale,
    limit: 6,
  });

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
          timeLabel: getScheduleMatchTimeLabel(match.timeLabel) ?? scheduleTimeFallback,
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
              <HardNavLink href="/app" className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
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
              <HardNavLink href={notificationsHref} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-bell.svg" alt="" />
                <span>{t.notifications}</span>
                <NotificationDateBadge count={notificationFeed.count} className={styles.badge} />
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
              <ProfileAvatar
                alt={formatUserName(session?.name)}
                src={currentUser?.avatar_url ?? null}
              />
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
                <HardNavLink href="/logout" className={styles.headerLogoutButton}>
                  {t.logout}
                </HardNavLink>
              </div>
            </div>
          </header>

          <div className={styles.mainContent}>
            <div className={styles.leftStack}>
              {showLiveCard ? <HardNavLink href="/directo" className={styles.cardLink}>
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
              </HardNavLink> : null}

              {showEventsCard ? <HardNavLink href="/videos" className={styles.cardLink}>
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
              </HardNavLink> : null}
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
                {!showLiveCard && !showEventsCard && notificationItems.length === 0 ? (
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
