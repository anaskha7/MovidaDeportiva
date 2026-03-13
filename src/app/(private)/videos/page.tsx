import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import { formatUserName, getSession } from "@/lib/session";
import { getCategorias, getDeportes } from "@/lib/repos/categorias";
import { getVideos } from "@/lib/repos/videos";
import styles from "./Videos.module.css";

type VideosPageProps = {
  searchParams?: Promise<{
    deporte?: string;
    categoria?: string;
    q?: string;
  }>;
};

function buildFilterHref({
  deporte,
  categoria,
  q,
}: {
  deporte?: string;
  categoria?: string;
  q?: string;
}) {
  const params = new URLSearchParams();

  if (deporte) params.set("deporte", deporte);
  if (categoria) params.set("categoria", categoria);
  if (q) params.set("q", q);

  const query = params.toString();
  return query ? `/videos?${query}` : "/videos";
}

export default async function VideosGuardadosPage({
  searchParams,
}: VideosPageProps) {
  const session = await getSession();
  const locale = await getLocale();
  const t = {
    es: { menu: "Menú", home: "Inicio", live: "En directo", events: "Partidos y eventos", services: "Nuestros servicios", notifications: "Notificaciones", settings: "Ajustes", subscribe: "¡SÚSCRIBETE", subscribe2: "AHORA!", subscribeText: "Para disfrutar de todas las ventajas del Premium", greeting: "Buenos días,", search: "Buscar videos...", saved: "Videos guardados", available: "partidos disponibles", sport: "Tipo de deporte", category: "Categoría", all: "Todos", load: "Cargar más videos" },
    ca: { menu: "Menú", home: "Inici", live: "En directe", events: "Partits i esdeveniments", services: "Els nostres serveis", notifications: "Notificacions", settings: "Ajustos", subscribe: "SUBSCRIU-TE", subscribe2: "ARA!", subscribeText: "Per gaudir de tots els avantatges del Premium", greeting: "Bon dia,", search: "Cercar vídeos...", saved: "Vídeos desats", available: "partits disponibles", sport: "Tipus d'esport", category: "Categoria", all: "Tots", load: "Carregar més vídeos" },
    en: { menu: "Menu", home: "Home", live: "Live", events: "Matches and events", services: "Our services", notifications: "Notifications", settings: "Settings", subscribe: "SUBSCRIBE", subscribe2: "NOW!", subscribeText: "Enjoy all the benefits of Premium", greeting: "Good morning,", search: "Search videos...", saved: "Saved videos", available: "matches available", sport: "Sport type", category: "Category", all: "All", load: "Load more videos" },
  }[locale];
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const allowedSports = ["dep-futbol", "dep-futsal"];
  const deportes = getDeportes().filter((deporte) =>
    allowedSports.includes(deporte.id)
  );
  const categorias = getCategorias();
  const selectedSport =
    resolvedSearchParams.deporte &&
    allowedSports.includes(resolvedSearchParams.deporte)
      ? resolvedSearchParams.deporte
      : undefined;
  const selectedCategory = resolvedSearchParams.categoria || undefined;
  const searchQuery = resolvedSearchParams.q?.trim() || "";
  const videosPage = getVideos(
    {
      deportes: selectedSport ? [selectedSport] : allowedSports,
      categoria: selectedCategory,
      query: searchQuery,
    },
    1,
    6
  );

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          <div className={styles.menu}>
            <span className={styles.menuLabel}>{t.menu}</span>
            <nav className={styles.menuList}>
              <Link href="/dashboard" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-home.svg" alt="" />
                <span>{t.home}</span>
              </Link>
              <Link href="/directo" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                <span className={styles.liveTag}>
                  Live <i />
                </span>
              </Link>
              <Link href="/videos" className={`${styles.menuItem} ${styles.active}`}>
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
                <img src="/assets/figma/icon-search.png" alt="" />
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
                <span>
                  <img src="/assets/figma/admin-menu-bell.svg" alt="" />
                  <i />
                </span>
              </div>
            </div>
          </header>

          <div className={styles.mainCard}>
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
                        categoria: selectedCategory,
                        q: searchQuery,
                      })}
                      className={`${styles.filterButton} ${selectedSport === deporte.id ? styles.filterActive : ""}`}
                    >
                      {deporte.icono ? `${deporte.icono} ` : ""}
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
                  {categorias.map((categoria) => (
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

            <div className={styles.videoGrid}>
              {videosPage.items.map((video) => (
                <article key={video.id} className={styles.videoCard}>
                  <div className={styles.videoThumb}>
                    <img src={video.thumbUrl} alt="" />
                    <div className={styles.videoOverlay} />
                    <div className={styles.scoreBadge}>{video.scoreLabel}</div>
                    <div className={styles.durationBadge}>{video.durationLabel}</div>
                    <div className={styles.playBadge}>
                      <img src="/assets/figma/icon-play-small.png" alt="" />
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
              ))}
              <button className={styles.carouselButton}>
                <img src="/assets/figma/icon-arrow-right-dark.png" alt="" />
              </button>
            </div>

            <div className={styles.carouselDots}>
              <span className={styles.dotActive} />
              <span />
              <span />
            </div>

            <button className={styles.loadMore}>{t.load}</button>
          </div>
        </section>
      </div>
    </main>
  );
}
