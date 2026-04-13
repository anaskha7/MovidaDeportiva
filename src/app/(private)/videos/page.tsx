import Link from "next/link";
import HardNavLink from "@/components/HardNavLink";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { getNotificationFeedForSession } from "@/lib/backoffice";
import { getLocale } from "@/lib/i18n";
import { hasActiveLiveMatch } from "@/lib/repos/partidos";
import { formatUserName, getSession } from "@/lib/session";
import { getCategorias, getDeportes } from "@/lib/repos/categorias";
import { getVideos } from "@/lib/repos/videos";
import { getCompetitionSchedule } from "@/lib/schedules";
import { getStandingsTable } from "@/lib/standings";
import styles from "./Videos.module.css";

type VideosPageProps = {
  searchParams?: Promise<{
    deporte?: string;
    categoria?: string;
    q?: string;
    page?: string;
  }>;
};

function buildFilterHref({
  deporte,
  categoria,
  q,
  page,
}: {
  deporte?: string;
  categoria?: string;
  q?: string;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (deporte) params.set("deporte", deporte);
  if (categoria) params.set("categoria", categoria);
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/videos?${query}` : "/videos";
}

function formatScheduleDate(dateIso: string, locale: "es" | "ca" | "en") {
  return new Intl.DateTimeFormat(locale === "ca" ? "ca-ES" : locale === "en" ? "en-US" : "es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${dateIso}T12:00:00`));
}

export default async function VideosGuardadosPage({
  searchParams,
}: VideosPageProps) {
  const session = await getSession();
  const locale = await getLocale();
  const hasLiveNow = hasActiveLiveMatch();
  const t = {
    es: { menu: "Menú", home: "Inicio", live: "En directo", events: "Partidos y eventos", notifications: "Notificaciones", settings: "Ajustes", logout: "Cerrar sesión", subscribe: "¡SÚSCRIBETE", subscribe2: "AHORA!", subscribeText: "Para disfrutar de todas las ventajas del Premium", greeting: "Buenos días,", search: "Buscar videos...", saved: "Videos guardados", available: "partidos disponibles", sport: "Deporte", category: "Liga", all: "Todos", load: "Cargar más videos", standings: "Clasificación", calendar: "Calendario", updatedDaily: "Siguiente jornada oficial de la liga seleccionada. Actualización diaria.", matchday: "Jornada", noCalendar: "No se ha podido cargar el calendario oficial ahora mismo.", source: "Fuente oficial", premiumLocked: "Contenido premium para suscriptores", premiumBadge: "Premium", premiumTitle: "Hazte suscriptor para desbloquear los partidos guardados", premiumText: "Con la cuenta básica puedes seguir clasificaciones y calendarios, pero los VODs completos quedan reservados para suscriptores.", premiumBenefits: ["Acceso a todos los partidos guardados", "Histórico completo por liga", "Cobertura premium sin cortes"], premiumCta: "Quiero suscribirme", premiumEyebrow: "Acceso restringido", premiumHeadline: "Este apartado está reservado para cuentas suscriptor", premiumSubheadline: "Si quieres acceder a todos los partidos guardados, tendrás que activar un plan suscriptor.", premiumHighlights: ["Sigue consultando clasificaciones y jornadas oficiales", "Desbloquea los VODs completos de cada liga", "Accede al histórico premium de retransmisiones"], premiumPreviewLabel: "Vista previa bloqueada", premiumVideoCountLabel: "partidos premium", premiumLeagueCountLabel: "ligas activas", premiumLockedItem: "Bloqueado" },
    ca: { menu: "Menú", home: "Inici", live: "En directe", events: "Partits i esdeveniments", notifications: "Notificacions", settings: "Ajustos", logout: "Tancar sessió", subscribe: "SUBSCRIU-TE", subscribe2: "ARA!", subscribeText: "Per gaudir de tots els avantatges del Premium", greeting: "Bon dia,", search: "Cercar vídeos...", saved: "Vídeos desats", available: "partits disponibles", sport: "Esport", category: "Lliga", all: "Tots", load: "Carregar més vídeos", standings: "Classificació", calendar: "Calendari", updatedDaily: "Següent jornada oficial de la lliga seleccionada. Actualització diària.", matchday: "Jornada", noCalendar: "No s'ha pogut carregar el calendari oficial ara mateix.", source: "Font oficial", premiumLocked: "Contingut premium per a subscriptors", premiumBadge: "Premium", premiumTitle: "Fes-te subscriptor per desbloquejar els partits desats", premiumText: "Amb el compte bàsic pots seguir classificacions i calendaris, però els VODs complets queden reservats per a subscriptors.", premiumBenefits: ["Accés a tots els partits desats", "Històric complet per lliga", "Cobertura premium sense talls"], premiumCta: "Vull subscriure'm", premiumEyebrow: "Accés restringit", premiumHeadline: "Aquest apartat està reservat per a comptes subscriptor", premiumSubheadline: "Si vols accedir a tots els partits desats, hauràs d'activar un pla subscriptor.", premiumHighlights: ["Continua consultant classificacions i jornades oficials", "Desbloqueja els VODs complets de cada lliga", "Accedeix a l'històric premium de retransmissions"], premiumPreviewLabel: "Vista prèvia bloquejada", premiumVideoCountLabel: "partits premium", premiumLeagueCountLabel: "lligues actives", premiumLockedItem: "Bloquejat" },
    en: { menu: "Menu", home: "Home", live: "Live", events: "Matches and events", notifications: "Notifications", settings: "Settings", logout: "Log out", subscribe: "SUBSCRIBE", subscribe2: "NOW!", subscribeText: "Enjoy all the benefits of Premium", greeting: "Good morning,", search: "Search videos...", saved: "Saved videos", available: "matches available", sport: "Sport", category: "League", all: "All", load: "Load more videos", standings: "Standings", calendar: "Schedule", updatedDaily: "Next official matchday for the selected league. Updated daily.", matchday: "Matchday", noCalendar: "The official schedule could not be loaded right now.", source: "Official source", premiumLocked: "Premium content for subscribers", premiumBadge: "Premium", premiumTitle: "Upgrade to subscriber to unlock saved matches", premiumText: "A basic account can follow standings and schedules, but full VOD access is reserved for subscribers.", premiumBenefits: ["Full access to saved matches", "Complete archive by league", "Premium match coverage"], premiumCta: "I want to subscribe", premiumEyebrow: "Restricted access", premiumHeadline: "This section is reserved for subscriber accounts", premiumSubheadline: "If you want access to all saved matches, you need to upgrade to a subscriber plan.", premiumHighlights: ["Keep following official standings and matchdays", "Unlock full VODs for every league", "Access the premium archive of broadcasts"], premiumPreviewLabel: "Locked preview", premiumVideoCountLabel: "premium matches", premiumLeagueCountLabel: "active leagues", premiumLockedItem: "Locked" },
  }[locale];
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const allowedSports = ["dep-futbol", "dep-futsal"];
  const deportes = getDeportes().filter((deporte) =>
    allowedSports.includes(deporte.id)
  );
  const categorias = getCategorias();
  const categoriasById = new Map(categorias.map((categoria) => [categoria.id, categoria]));
  const selectedSport =
    resolvedSearchParams.deporte &&
    allowedSports.includes(resolvedSearchParams.deporte)
      ? resolvedSearchParams.deporte
      : undefined;
  const requestedCategory = resolvedSearchParams.categoria?.trim() || undefined;
  const selectedCategory =
    requestedCategory &&
    categoriasById.has(requestedCategory) &&
    (!selectedSport ||
      categoriasById.get(requestedCategory)?.deporteId === selectedSport)
      ? requestedCategory
      : undefined;
  const visibleCategorias = selectedSport
    ? categorias.filter((categoria) => categoria.deporteId === selectedSport)
    : categorias;
  const visibleClasificaciones = selectedCategory
    ? visibleCategorias.filter((categoria) => categoria.id === selectedCategory)
    : visibleCategorias;
  const searchQuery = resolvedSearchParams.q?.trim() || "";
  const parsedPage = Number.parseInt(resolvedSearchParams.page ?? "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageSize = 6;
  const visibleVideoCount = currentPage * pageSize;
  const canWatchSavedVideos =
    session?.role === "admin" || session?.role === "suscriptor";
  const homeHref = session?.role === "admin" ? "/dashboard" : "/app";
  const notificationsHref =
    session?.role === "admin" ? "/admin/notificaciones" : "/app/notificaciones";
  const notificationFeed = await getNotificationFeedForSession({
    session,
    locale,
    limit: 6,
  });
  const videosPage = getVideos(
    {
      deportes: selectedSport ? [selectedSport] : allowedSports,
      categoria: selectedCategory,
      query: searchQuery,
    },
    1,
    visibleVideoCount
  );
  const standingsEntries = await Promise.all(
    visibleClasificaciones.map(async (categoria) => ({
      categoria,
      standings: categoria.clasificacionUrl
        ? await getStandingsTable(categoria.clasificacionUrl)
        : null,
    }))
  );
  const scheduleEntries = await Promise.all(
    visibleClasificaciones.map(async (categoria) => ({
      categoria,
      schedule: categoria.calendarioUrl
        ? await getCompetitionSchedule(categoria.calendarioUrl)
        : null,
    })),
  );
  const hasMoreVideos = videosPage.items.length < videosPage.total;
  const premiumPreviewVideos = (
    videosPage.items.length
      ? videosPage.items
      : getVideos({ deportes: allowedSports }, 1, 3).items
  ).slice(0, 3);

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
          <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          <div className={styles.menu}>
            <span className={styles.menuLabel}>{t.menu}</span>
            <nav className={styles.menuList}>
              <HardNavLink href={homeHref} className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
              </HardNavLink>
              {session?.role === "admin" ? (
                <HardNavLink href="/admin/panel" className={styles.menuItem}>
                  <img src="/assets/figma/admin-menu-panel.svg" alt="" />
                  <span>{locale === "en" ? "Admin panel" : locale === "ca" ? "Panell admin" : "Panel admin"}</span>
                </HardNavLink>
              ) : null}
              <HardNavLink href="/directo" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                {hasLiveNow ? <span className={styles.liveTag}>Live <i /></span> : null}
              </HardNavLink>
              <HardNavLink href="/videos" className={`${styles.menuItem} ${styles.active}`}>
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

        <section className={styles.content}>
          <header className={styles.header}>
            <div className={styles.userInfo}>
              <img src="/assets/figma/videos-user.png" alt="" />
              <div>
                <p>{t.greeting}</p>
                <strong>{formatUserName(session?.name)}</strong>
              </div>
            </div>
            <div className={styles.topbarActions}>
              <form className={styles.searchBox} action="/videos" method="get">
                <img src="/assets/figma/icon-search.svg" alt="" />
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder={t.search}
                  aria-label={t.search}
                />
                {selectedSport ? <input type="hidden" name="deporte" value={selectedSport} /> : null}
                {selectedCategory ? (
                  <input type="hidden" name="categoria" value={selectedCategory} />
                ) : null}
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

          <div className={styles.mainCard}>
            {canWatchSavedVideos ? (
              <>
                <div className={styles.heading}>
                  <h1>{t.saved}</h1>
                  <p>{videosPage.total} {t.available}</p>
                </div>

                <div className={styles.filters}>
                  <div>
                    <span className={styles.filterLabel}>{t.sport}</span>
                    <div className={styles.filterRow}>
                      <Link
                        href={buildFilterHref({ categoria: selectedCategory, q: searchQuery })}
                        className={`${styles.filterButton} ${!selectedSport ? styles.filterActive : ""}`}
                      >
                        {t.all}
                      </Link>
                      {deportes.map((deporte) => (
                        <Link
                          key={deporte.id}
                          href={buildFilterHref({
                            deporte: deporte.id,
                            categoria:
                              selectedCategory &&
                              categoriasById.get(selectedCategory)?.deporteId === deporte.id
                                ? selectedCategory
                                : undefined,
                            q: searchQuery,
                          })}
                          className={`${styles.filterButton} ${selectedSport === deporte.id ? styles.filterActive : ""}`}
                        >
                          {deporte.nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className={styles.filterLabel}>{t.category}</span>
                    <div className={styles.filterRow}>
                      <Link
                        href={buildFilterHref({ deporte: selectedSport, q: searchQuery })}
                        className={`${styles.filterButton} ${!selectedCategory ? styles.filterActive : ""}`}
                      >
                        {t.all}
                      </Link>
                      {visibleCategorias.map((categoria) => (
                        <Link
                          key={categoria.id}
                          href={buildFilterHref({
                            deporte: selectedSport,
                            categoria: categoria.id,
                            q: searchQuery,
                          })}
                          className={`${styles.filterButton} ${selectedCategory === categoria.id ? styles.filterActive : ""}`}
                        >
                          {categoria.nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedCategory ? (
                  <div className={styles.toolsRow}>
                    <div className={styles.toolItem}>
                      <details className={styles.toolPanel}>
                        <summary className={styles.toolHeader}>
                          <span className={styles.toolButton}>{t.standings}</span>
                        </summary>
                        <div className={styles.standingsGrid}>
                          {standingsEntries.map(({ categoria, standings }) => (
                            <article key={categoria.id} className={styles.standingsCard}>
                              <div className={styles.standingsMeta}>
                                <span className={styles.standingsBadge}>{categoria.organizador ?? "Oficial"}</span>
                                <h3>{categoria.nombre}</h3>
                                {standings?.updatedAt ? (
                                  <p>{locale === "en" ? "Updated" : locale === "ca" ? "Actualitzat" : "Actualizado"}: {standings.updatedAt}</p>
                                ) : (
                                  <p>{categoria.resumen}</p>
                                )}
                              </div>
                              {standings?.rows.length ? (
                                <div className={styles.standingsEmbed}>
                                  <table className={styles.standingsTable}>
                                    <thead>
                                      <tr>
                                        <th>#</th>
                                        <th>{locale === "en" ? "Team" : locale === "ca" ? "Equip" : "Equipo"}</th>
                                        <th>{locale === "en" ? "Pts" : locale === "ca" ? "Pts" : "Pts"}</th>
                                        <th>J</th>
                                        <th>G</th>
                                        <th>E</th>
                                        <th>P</th>
                                        <th>GF</th>
                                        <th>GC</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {standings.rows.map((row) => (
                                        <tr key={`${categoria.id}-${row.position}-${row.team}`}>
                                          <td className={styles.positionCell}>{row.position}</td>
                                          <td className={styles.teamCell}>{row.team}</td>
                                          <td className={styles.pointsCell}>{row.points}</td>
                                          <td>{row.played}</td>
                                          <td>{row.won}</td>
                                          <td>{row.drawn}</td>
                                          <td>{row.lost}</td>
                                          <td>{row.goalsFor ?? "-"}</td>
                                          <td>{row.goalsAgainst ?? "-"}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className={styles.standingsFallback}>
                                  {locale === "en"
                                    ? "The official table could not be loaded right now."
                                    : locale === "ca"
                                      ? "La taula oficial no s'ha pogut carregar ara mateix."
                                      : "La tabla oficial no se ha podido cargar ahora mismo."}
                                </p>
                              )}
                            </article>
                          ))}
                        </div>
                      </details>
                    </div>

                    <div className={styles.toolItem}>
                      <details className={styles.toolPanel}>
                        <summary className={styles.toolHeader}>
                          <span className={styles.toolButton}>{t.calendar}</span>
                        </summary>
                        <div className={styles.scheduleGrid}>
                          {scheduleEntries.map(({ categoria, schedule }) => (
                            <article key={categoria.id} className={styles.scheduleCard}>
                              <div className={styles.scheduleMeta}>
                                <span className={styles.scheduleBadge}>{categoria.organizador ?? "Oficial"}</span>
                                <h3>{categoria.nombre}</h3>
                                <p>{t.updatedDaily}</p>
                              </div>
                              {schedule?.rounds[0] ? (
                                <div className={styles.scheduleRounds}>
                                  <section
                                    key={`${categoria.id}-${schedule.rounds[0].round}-${schedule.rounds[0].dateIso}`}
                                    className={styles.scheduleRound}
                                  >
                                    <div className={styles.scheduleRoundHeader}>
                                      <strong>
                                        {t.matchday} {schedule.rounds[0].round}
                                      </strong>
                                      <span>{formatScheduleDate(schedule.rounds[0].dateIso, locale)}</span>
                                    </div>
                                    <div className={styles.scheduleMatches}>
                                      {schedule.rounds[0].matches.map((match) => (
                                        <div
                                          key={`${schedule.rounds[0].dateIso}-${match.homeTeam}-${match.awayTeam}`}
                                          className={styles.scheduleMatch}
                                        >
                                          <div>
                                            <strong>{match.homeTeam}</strong>
                                            <span>vs</span>
                                            <strong>{match.awayTeam}</strong>
                                          </div>
                                          <time>{match.timeLabel ?? schedule.rounds[0].dateLabel}</time>
                                        </div>
                                      ))}
                                    </div>
                                  </section>
                                </div>
                              ) : (
                                <p className={styles.scheduleFallback}>{t.noCalendar}</p>
                              )}
                              {categoria.calendarioUrl ? (
                                <a
                                  href={categoria.calendarioUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.scheduleSource}
                                >
                                  {t.source}
                                </a>
                              ) : null}
                            </article>
                          ))}
                        </div>
                      </details>
                    </div>
                  </div>
                ) : null}

                <div className={styles.videoGrid}>
                  {videosPage.items.map((video) => (
                    <a
                      key={video.id}
                      href={video.vodUrl || "#"}
                      target={video.vodUrl && video.vodUrl !== "#" ? "_blank" : undefined}
                      rel={video.vodUrl && video.vodUrl !== "#" ? "noreferrer" : undefined}
                      className={styles.videoCardLink}
                    >
                    <article className={styles.videoCard}>
                      <div className={styles.videoThumb}>
                        <img src={video.thumbUrl} alt="" />
                        <div className={styles.videoOverlay} />
                        <div className={styles.scoreBadge}>{video.scoreLabel}</div>
                        <div className={styles.durationBadge}>{video.durationLabel}</div>
                        <div className={styles.playBadge}>
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="#ffffff" />
                          </svg>
                        </div>
                      </div>
                      <div className={styles.videoMeta}>
                        <h3>{video.title}</h3>
                        <p>{video.subtitle}</p>
                        <div className={styles.videoInfo}>
                          <span>
                            <img src="/assets/figma/icon-calendar.png" alt="" />
                            {video.dateLabel}
                          </span>
                          <span>
                            <img src="/assets/figma/icon-clock.png" alt="" />
                            {video.durationLabel}
                          </span>
                        </div>
                      </div>
                    </article>
                    </a>
                  ))}
                </div>

                <div className={styles.carouselDots}>
                  <span className={styles.dotActive} />
                  <span />
                  <span />
                </div>

                {hasMoreVideos ? (
                  <Link
                    href={buildFilterHref({
                      deporte: selectedSport,
                      categoria: selectedCategory,
                      q: searchQuery,
                      page: currentPage + 1,
                    })}
                    className={styles.loadMore}
                  >
                    {t.load}
                  </Link>
                ) : null}
              </>
            ) : (
              <section className={styles.premiumShell}>
                <div className={styles.heading}>
                  <h1>{t.saved}</h1>
                  <p>{t.premiumLocked}</p>
                </div>
                <article className={styles.premiumCard}>
                  <div className={styles.premiumContent}>
                    <div className={styles.premiumCopy}>
                      <span className={styles.premiumBadge}>{t.premiumEyebrow}</span>
                      <h2>{t.premiumHeadline}</h2>
                      <p>{t.premiumSubheadline}</p>
                      <ul className={styles.premiumList}>
                        {t.premiumHighlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <div className={styles.premiumDivider} />
                      <h3 className={styles.premiumOfferTitle}>{t.premiumTitle}</h3>
                      <p>{t.premiumText}</p>
                      <ul className={styles.premiumList}>
                        {t.premiumBenefits.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <div className={styles.premiumFooter}>
                        <Link href="/servicios/contacto" prefetch={false} className={styles.premiumButton}>
                          {t.premiumCta}
                        </Link>
                        <div className={styles.premiumStats}>
                          <div className={styles.premiumStat}>
                            <strong>{videosPage.total}</strong>
                            <span>{t.premiumVideoCountLabel}</span>
                          </div>
                          <div className={styles.premiumStat}>
                            <strong>{categorias.length}</strong>
                            <span>{t.premiumLeagueCountLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <aside className={styles.premiumPreview}>
                      <div className={styles.premiumPreviewHeader}>
                        <span className={styles.premiumPreviewTag}>{t.premiumPreviewLabel}</span>
                        <span>{videosPage.total} {t.available}</span>
                      </div>
                      <div className={styles.premiumPreviewList}>
                        {premiumPreviewVideos.map((video) => (
                          <article key={video.id} className={styles.premiumPreviewCard}>
                            <div className={styles.premiumPreviewMedia}>
                              <img src={video.thumbUrl} alt="" />
                              <div className={styles.premiumPreviewOverlay} />
                              <span className={styles.premiumPreviewLock}>{t.premiumLockedItem}</span>
                            </div>
                            <div className={styles.premiumPreviewInfo}>
                              <strong>{video.title}</strong>
                              <p>{video.subtitle}</p>
                              <span>{video.dateLabel}</span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </aside>
                  </div>
                </article>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
