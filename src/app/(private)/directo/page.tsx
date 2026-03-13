import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import { getSession } from "@/lib/session";
import { getChatMessagesByMatchId } from "@/lib/repos/mensajes";
import { getLiveMatch, getOtherLiveMatches } from "@/lib/repos/partidos";
import styles from "./Directo.module.css";

export default async function DirectoPage() {
  await getSession();
  const locale = await getLocale();
  const t = {
    es: { menu: "Menú", home: "Inicio", live: "En directo", events: "Partidos y eventos", services: "Nuestros servicios", notifications: "Notificaciones", settings: "Ajustes", subscribe: "¡SÚSCRIBETE", subscribe2: "AHORA!", subscribeText: "Para disfrutar de todas las ventajas del Premium", liveNow: "EN VIVO", other: "Otros partidos", round: "Jornada", chat: "Chat en directo", write: "Escribe un mensaje..." },
    ca: { menu: "Menú", home: "Inici", live: "En directe", events: "Partits i esdeveniments", services: "Els nostres serveis", notifications: "Notificacions", settings: "Ajustos", subscribe: "SUBSCRIU-TE", subscribe2: "ARA!", subscribeText: "Per gaudir de tots els avantatges del Premium", liveNow: "EN DIRECTE", other: "Altres partits", round: "Jornada", chat: "Xat en directe", write: "Escriu un missatge..." },
    en: { menu: "Menu", home: "Home", live: "Live", events: "Matches and events", services: "Our services", notifications: "Notifications", settings: "Settings", subscribe: "SUBSCRIBE", subscribe2: "NOW!", subscribeText: "Enjoy all the benefits of Premium", liveNow: "LIVE", other: "Other matches", round: "Matchday", chat: "Live chat", write: "Write a message..." },
  }[locale];
  const liveMatch = getLiveMatch();
  const otherMatches = getOtherLiveMatches();
  const chatMessages = getChatMessagesByMatchId(liveMatch.id);

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
              <Link href="/directo" className={`${styles.menuItem} ${styles.active}`}>
                <img src="/assets/figma/admin-menu-live.svg" alt="" />
                <span>{t.live}</span>
                <span className={styles.liveTag}>
                  Live <i />
                </span>
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

        <section className={styles.mainContent}>
          <div className={styles.videoCard}>
            <div className={styles.videoWrapper}>
              <img src={liveMatch.coverUrl} alt="Partido en directo" />
              <div className={styles.videoOverlay} />
              <div className={styles.liveBadge}>{t.liveNow}</div>
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
                <strong>{t.other}</strong>
                <span>{t.round} {liveMatch.jornada}</span>
              </div>
              <div className={styles.otherGrid}>
                {otherMatches.map((match) => (
                  <div key={match.id} className={styles.otherCard}>
                    <div className={styles.otherMeta}>
                      {match.competition} - {match.grupo}
                    </div>
                    <div className={styles.otherLive}>{t.liveNow}</div>
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
            <strong>{t.chat}</strong>
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
            <span>{t.write}</span>
            <button>
              <img src="/assets/figma/directo-send.png" alt="" />
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
