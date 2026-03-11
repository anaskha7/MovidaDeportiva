import { getSession } from "@/lib/session";
import { getCategorias, getDeportes } from "@/lib/repos/categorias";
import { getVideos } from "@/lib/repos/videos";
import styles from "./Videos.module.css";

export default async function VideosGuardadosPage() {
  const session = await getSession();
  const deportes = getDeportes();
  const categorias = getCategorias();
  const videosPage = getVideos({}, 1, 6);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <img className={styles.logo} src="/assets/figma/logo.png" alt="Movida Deportiva TV" />
          <div className={styles.menu}>
            <span className={styles.menuLabel}>Menú</span>
            <div className={styles.menuItem}>
              <img src="/assets/figma/icon-home-2.png" alt="" />
              <span>Inicio</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/icon-video-2.png" alt="" />
              <span>En directo</span>
              <span className={styles.liveTag}>
                Live <i />
              </span>
            </div>
            <div className={`${styles.menuItem} ${styles.active}`}>
              <img src="/assets/figma/icon-saved.png" alt="" />
              <span>Videos guardados</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/icon-dribbble-2.png" alt="" />
              <span>Partidos y eventos</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/icon-clipboard-2.png" alt="" />
              <span>Nuestros servicios</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/icon-bell-2.png" alt="" />
              <span>Notificaciones</span>
              <span className={styles.badge}>22</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/icon-message-2.png" alt="" />
              <span>Tus mensajes</span>
              <span className={styles.badge}>7</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/icon-settings-2.png" alt="" />
              <span>Ajustes</span>
            </div>
          </div>
          <div className={styles.subscribeCard}>
            <div className={`kdam ${styles.subscribeTitle}`}>
              ¡SÚSCRIBETE
              <br />
              AHORA!
            </div>
            <p>Para disfrutar de todas las ventajas del Premium</p>
          </div>
        </aside>

        <section className={styles.content}>
          <header className={styles.header}>
            <div className={styles.userInfo}>
              <img src="/assets/figma/videos-user.png" alt="" />
              <div>
                <p>Buenos días,</p>
                <strong>{session?.name ?? "Usuario"}</strong>
              </div>
            </div>
            <div className={styles.searchBox}>
              <img src="/assets/figma/icon-search-2.png" alt="" />
              <span>Buscar videos...</span>
            </div>
          </header>

          <div className={styles.mainCard}>
            <div className={styles.heading}>
              <h1>Videos Guardados</h1>
              <p>{videosPage.total} partidos disponibles</p>
            </div>

            <div className={styles.filters}>
              <div>
                <span className={styles.filterLabel}>Tipo de deporte</span>
                <div className={styles.filterRow}>
                  <button className={styles.filterActive}>Todos</button>
                  {deportes.map((deporte) => (
                    <button key={deporte.id}>
                      {deporte.icono ? `${deporte.icono} ` : ""}
                      {deporte.nombre}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className={styles.filterLabel}>Categoría</span>
                <div className={styles.filterRow}>
                  <button className={styles.filterActive}>Todos</button>
                  {categorias.map((categoria) => (
                    <button key={categoria.id}>{categoria.nombre}</button>
                  ))}
                  <button>⭐ Mis favoritos</button>
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

            <button className={styles.loadMore}>Cargar más videos</button>
          </div>
        </section>
      </div>
    </main>
  );
}
