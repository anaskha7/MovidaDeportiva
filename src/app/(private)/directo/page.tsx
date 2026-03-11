import { getSession } from "@/lib/session";
import { getChatMessagesByMatchId } from "@/lib/repos/mensajes";
import { getLiveMatch, getOtherLiveMatches } from "@/lib/repos/partidos";
import styles from "./Directo.module.css";

export default async function DirectoPage() {
  await getSession();
  const liveMatch = getLiveMatch();
  const otherMatches = getOtherLiveMatches();
  const chatMessages = getChatMessagesByMatchId(liveMatch.id);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <img className={styles.logo} src="/assets/figma/logo.png" alt="Movida Deportiva TV" />
          <div className={styles.menu}>
            <span className={styles.menuLabel}>Menú</span>
            <div className={styles.menuItem}>
              <img src="/assets/figma/icon-home.png" alt="" />
              <span>Inicio</span>
            </div>
            <div className={`${styles.menuItem} ${styles.active}`}>
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

        <section className={styles.mainContent}>
          <div className={styles.videoCard}>
            <div className={styles.videoWrapper}>
              <img src={liveMatch.coverUrl} alt="Partido en directo" />
              <div className={styles.videoOverlay} />
              <div className={styles.liveBadge}>EN VIVO</div>
              <div className={styles.scoreBoard}>
                <div>
                  <span>{liveMatch.home.abreviatura}</span>
                  <strong>{liveMatch.scoreHome ?? "-"}</strong>
                </div>
                <span>-</span>
                <div>
                  <span>{liveMatch.away.abreviatura}</span>
                  <strong>{liveMatch.scoreAway ?? "-"}</strong>
                </div>
              </div>
              <div className={styles.timeTag}>{liveMatch.clock ?? "--:--"}</div>
              <div className={styles.playButton}>
                <img src="/assets/figma/directo-play.png" alt="" />
              </div>
            </div>
            <div className={styles.videoInfo}>
              <h2>
                {liveMatch.home.nombre} vs {liveMatch.away.nombre}
              </h2>
              <p>
                {liveMatch.competition} - {liveMatch.grupo} - Jornada {liveMatch.jornada}
              </p>
            </div>
            <div className={styles.otherMatches}>
              <div className={styles.otherHeader}>
                <strong>Otros partidos</strong>
                <span>Jornada {liveMatch.jornada}</span>
              </div>
              <div className={styles.otherGrid}>
                {otherMatches.map((match) => (
                  <div key={match.id} className={styles.otherCard}>
                    <div className={styles.otherMeta}>
                      {match.competition} - {match.grupo}
                    </div>
                    <div className={styles.otherLive}>EN VIVO</div>
                    <div className={styles.otherTeams}>
                      <div>
                        <span>{match.home.nombre}</span>
                        <span>{match.away.nombre}</span>
                      </div>
                      <strong>
                        {match.scoreHome ?? "-"} - {match.scoreAway ?? "-"}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <strong>Chat en directo</strong>
            <span className={styles.chatDot} />
          </div>
          <div className={styles.chatMessages}>
            {chatMessages.map((item) => (
              <div key={item.id} className={styles.chatItem}>
                <div className={styles.chatEmoji}>{item.emoji}</div>
                <div>
                  <div className={styles.chatMeta}>
                    <strong>{item.name}</strong>
                    <span>{item.timeLabel}</span>
                  </div>
                  <p>{item.message}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.chatInput}>
            <span>Escribe un mensaje...</span>
            <button>
              <img src="/assets/figma/directo-send.png" alt="" />
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
