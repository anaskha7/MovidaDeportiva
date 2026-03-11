import { getSession } from "@/lib/session";
import styles from "./Dashboard.module.css";

export default async function DashboardPage() {
  const session = await getSession();
  return (
    <main className={styles.dashboardPage}>
      <div className={styles.dashboardGrid}>
        <aside className={styles.sidebar}>
          <img className={styles.logo} src="/assets/figma/logo.png" alt="Movida Deportiva TV" />
          <div className={styles.menuBlock}>
            <p className={styles.menuLabel}>Menú</p>
            <nav className={styles.menuList}>
              <div className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/icon-home.png" alt="" />
                <span>Inicio</span>
              </div>
              <div className={styles.menuItem}>
                <img src="/assets/figma/icon-video.png" alt="" />
                <span>En directo</span>
                <span className={styles.liveTag}>
                  Live <i />
                </span>
              </div>
              <div className={styles.menuItem}>
                <img src="/assets/figma/icon-dribbble.png" alt="" />
                <span>Partidos y eventos</span>
              </div>
              <div className={styles.menuItem}>
                <img src="/assets/figma/icon-clipboard.png" alt="" />
                <span>Nuestros servicios</span>
              </div>
              <div className={styles.menuItem}>
                <img src="/assets/figma/icon-bell.png" alt="" />
                <span>Notificaciones</span>
                <span className={styles.badge}>22</span>
              </div>
              <div className={styles.menuItem}>
                <img src="/assets/figma/icon-message.png" alt="" />
                <span>Tus mensajes</span>
                <span className={styles.badge}>7</span>
              </div>
              <div className={styles.menuItem}>
                <img src="/assets/figma/icon-settings.png" alt="" />
                <span>Ajustes</span>
              </div>
            </nav>
          </div>
          <div className={styles.subscribeCard}>
            <div className={`kdam ${styles.subscribeTitle}`}>
              ¡SÚSCRIBETE
              <br />
              AHORA!
            </div>
            <div className={styles.subscribeFooter}>
              <p>Para disfrutar de todas las ventajas del Premium</p>
              <img src="/assets/figma/arrow-right.png" alt="" />
            </div>
          </div>
        </aside>

        <section className={styles.mainColumn}>
          <header className={styles.topbar}>
            <div className={styles.userInfo}>
              <img src="/assets/figma/dashboard-user.png" alt="" />
              <div>
                <p>Buenos días,</p>
                <strong>{session?.name ?? "Admin"}</strong>
              </div>
            </div>
            <div className={styles.topbarActions}>
              <div className={styles.searchBox}>
                <img src="/assets/figma/icon-search.png" alt="" />
                <span>¿Qué estás buscando?</span>
              </div>
              <div className={styles.iconGroup}>
                <span>
                  <img src="/assets/figma/icon-message-small.png" alt="" />
                  <i />
                </span>
                <span>
                  <img src="/assets/figma/icon-bell-small.png" alt="" />
                  <i />
                </span>
              </div>
            </div>
          </header>

          <div className={styles.mainContent}>
            <div className={styles.leftStack}>
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
                  <img src="/assets/figma/arrow-right.png" alt="" />
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

              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <strong>Solicitar servicios</strong>
                    <p>Escoje que tipo de servicio quieres contratar.</p>
                  </div>
                  <img src="/assets/figma/arrow-right.png" alt="" />
                </div>
                <div className={styles.serviceRow}>
                  <div className={styles.serviceBox}>
                    <strong>SERVICIOS RETRANSMISION</strong>
                    <span>Desde 19,99€/hora</span>
                  </div>
                  <div className={styles.serviceBoxLight}>
                    <strong>SPEAKERS Y ANIMACIÓN</strong>
                    <span>Desde 27,99€/hora</span>
                  </div>
                </div>
              </article>

              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <strong>Partidos y eventos</strong>
                    <p>Disfruta del mejor fútbol siempre que quieras</p>
                  </div>
                  <img src="/assets/figma/arrow-right.png" alt="" />
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
            </div>

            <div className={styles.rightStack}>
              <article className={styles.cardSmall}>
                <div className={styles.cardHeader}>
                  <strong>Hoy, Sábado 6 de Febrero</strong>
                </div>
                <div className={styles.scheduleItemActive}>
                  <div>
                    <span className={styles.scheduleLive}>Live now</span>
                    <strong>GRAMA vs VILANOVA</strong>
                    <p>3ª Federación - GRUPO V</p>
                  </div>
                  <span>Ahora</span>
                </div>
                {[
                  "V.HEBRON vs VILAFRANCA",
                  "VILASSAR vs GRAMA",
                  "LES CORTS vs LLEFIÁ",
                ].map((item) => (
                  <div key={item} className={styles.scheduleItem}>
                    <div>
                      <strong>{item}</strong>
                      <p>3ª Federación - GRUPO V</p>
                    </div>
                    <span>11:30 h</span>
                  </div>
                ))}
                <button className={styles.linkButton}>Ver todos</button>
              </article>

              <article className={styles.cardSmall}>
                <div className={styles.cardHeader}>
                  <strong>Febrero 2026</strong>
                </div>
                <img src="/assets/figma/icon-camera.png" alt="" />
                <div className={styles.calendarGrid}>
                  {[...Array(14)].map((_, idx) => (
                    <span key={idx} className={idx % 5 === 0 ? styles.highlight : ""}>
                      {idx + 1}
                    </span>
                  ))}
                </div>
              </article>

              <article className={styles.cardSmall}>
                <div className={styles.cardHeader}>
                  <div className={styles.noticeHeader}>
                    <strong>Notificaciones</strong>
                    <span className={styles.badge}>22</span>
                  </div>
                </div>
                {[
                  "@futbol_008 ha reaccionado a tu mensaje",
                  "Has reservado los Servicios Streaming para el 18/03 con éxito.",
                  "@juannn_mp ha contestado tu mensaje de chat",
                  "@futbol_008 ha reaccionado a tu mensaje",
                ].map((text) => (
                  <div key={text} className={styles.noticeItem}>
                    <span />
                    <p>{text}</p>
                  </div>
                ))}
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
