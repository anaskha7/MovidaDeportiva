import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import { formatUserName, getSession } from "@/lib/session";
import ContratarServiciosClient from "./ContratarServiciosClient";
import styles from "./ServiciosPrivados.module.css";

export default async function ServiciosPrivadosPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const session = await getSession();
  const locale = await getLocale();
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const searchQuery = searchParams?.q?.trim() || "";
  const t = {
    es: { menu: "Menú", home: "Inicio", live: "En directo", events: "Partidos y eventos", services: "Nuestros servicios", notifications: "Notificaciones", settings: "Ajustes", subscribe: "¡SÚSCRIBETE", subscribe2: "AHORA!", subscribeText: "Para disfrutar de todas las ventajas del Premium", greeting: "Buenos días,", search: "Buscar servicio..." },
    ca: { menu: "Menú", home: "Inici", live: "En directe", events: "Partits i esdeveniments", services: "Els nostres serveis", notifications: "Notificacions", settings: "Ajustos", subscribe: "SUBSCRIU-TE", subscribe2: "ARA!", subscribeText: "Per gaudir de tots els avantatges del Premium", greeting: "Bon dia,", search: "Cercar servei..." },
    en: { menu: "Menu", home: "Home", live: "Live", events: "Matches and events", services: "Our services", notifications: "Notifications", settings: "Settings", subscribe: "SUBSCRIBE", subscribe2: "NOW!", subscribeText: "Enjoy all the benefits of Premium", greeting: "Good morning,", search: "Search service..." },
  }[locale];

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <img
            className={styles.logo}
            src="/assets/figma/logo-md-dark.svg"
            alt="Movida Deportiva TV"
          />
          <div className={styles.menuBlock}>
            <p className={styles.menuLabel}>{t.menu}</p>
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
              <Link href="/videos" className={styles.menuItem}>
                <img src="/assets/figma/admin-menu-events.svg" alt="" />
                <span>{t.events}</span>
              </Link>
              <Link href="/app/servicios" className={`${styles.menuItem} ${styles.active}`}>
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
                <img src="/assets/figma/icon-search.png" alt="" />
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder={t.search}
                  aria-label={t.search}
                />
              </form>
              <div className={styles.iconGroup}>
                <span>
                  <img src="/assets/figma/admin-menu-bell.svg" alt="" />
                  <i />
                </span>
              </div>
            </div>
          </header>

          <ContratarServiciosClient locale={locale} initialQuery={searchQuery} />
        </section>
      </div>
    </main>
  );
}
