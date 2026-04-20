import HardNavLink from "@/components/HardNavLink";
import NotificationBell from "@/components/NotificationBell";
import NotificationDateBadge from "@/components/NotificationDateBadge";
import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { createLiveChatToken } from "@/lib/ably-server";
import { getCurrentUserBySession } from "@/lib/auth";
import { getNotificationFeedForSession } from "@/lib/backoffice";
import { getLocale } from "@/lib/i18n";
import { getSession } from "@/lib/session";
import { getLiveMatch, getOtherLiveMatches, hasActiveLiveMatch } from "@/lib/repos/partidos";
import styles from "./Directo.module.css";
import DirectoChatClient from "./DirectoChatClient";

export default async function DirectoPage() {
  const session = await getSession();
  const locale = await getLocale();
  const hasLiveNow = hasActiveLiveMatch();
  const currentUser = await getCurrentUserBySession({
    userId: session?.userId,
    email: session?.email,
  });
  const homeHref = session?.role === "admin" ? "/dashboard" : "/app";
  const notificationsHref =
    session?.role === "admin" ? "/admin/notificaciones" : "/app/notificaciones";
  const notificationFeed = await getNotificationFeedForSession({
    session,
    locale,
    limit: 6,
  });
  const t = {
    es: { menu: "Menú", home: "Inicio", live: "En directo", events: "Partidos y eventos", notifications: "Notificaciones", settings: "Ajustes", logout: "Cerrar sesión", subscribe: "¡SÚSCRIBETE", subscribe2: "AHORA!", subscribeText: "Para disfrutar de todas las ventajas del Premium", liveNow: "EN VIVO", other: "Otros partidos", round: "Jornada", chat: "Chat en directo", write: "Escribe un mensaje..." },
    ca: { menu: "Menú", home: "Inici", live: "En directe", events: "Partits i esdeveniments", notifications: "Notificacions", settings: "Ajustos", logout: "Tancar sessió", subscribe: "SUBSCRIU-TE", subscribe2: "ARA!", subscribeText: "Per gaudir de tots els avantatges del Premium", liveNow: "EN DIRECTE", other: "Altres partits", round: "Jornada", chat: "Xat en directe", write: "Escriu un missatge..." },
    en: { menu: "Menu", home: "Home", live: "Live", events: "Matches and events", notifications: "Notifications", settings: "Settings", logout: "Log out", subscribe: "SUBSCRIBE", subscribe2: "NOW!", subscribeText: "Enjoy all the benefits of Premium", liveNow: "LIVE", other: "Other matches", round: "Matchday", chat: "Live chat", write: "Write a message..." },
  }[locale];
  const liveMatch = getLiveMatch();
  const otherMatches = getOtherLiveMatches();
  let ablyToken: string | null = null;

  if (session) {
    try {
      ablyToken = await createLiveChatToken(session);
    } catch (error) {
      console.error("No se pudo preparar el token del chat en directo", error);
    }
  }

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
          <HardNavLink href="/" aria-label="Volver a la web">
            <img className={styles.logo} src="/assets/figma/logo-md-dark.svg" alt="Movida Deportiva TV" />
          </HardNavLink>
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
              <HardNavLink href="/directo" className={`${styles.menuItem} ${styles.active}`}>
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
          <HardNavLink href="/logout" className={styles.logoutButton}>
            {t.logout}
          </HardNavLink>
        </ResponsiveSidebar>

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

        <DirectoChatClient
          ablyToken={ablyToken}
          avatarUrl={currentUser?.avatar_url ?? null}
          locale={locale}
          matchId={liveMatch.id}
          name={session?.name ?? "Invitado"}
          role={session?.role ?? null}
          title={t.chat}
          placeholder={t.write}
        />
      </div>
    </main>
  );
}
