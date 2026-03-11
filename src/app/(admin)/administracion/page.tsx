import { getSession } from "@/lib/session";
import styles from "./Administracion.module.css";

export default async function AdministracionPage() {
  const session = await getSession();
  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <img className={styles.logo} src="/assets/figma/logo.png" alt="Movida Deportiva TV" />
          <p className={styles.menuLabel}>Menú</p>
          <nav className={styles.menuList}>
            <div className={styles.menuItem}>
              <img src="/assets/figma/admin2-icon-home.png" alt="" />
              <span>Inicio</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/admin2-icon-live.png" alt="" />
              <span>En directo</span>
              <span className={styles.liveTag}>
                Live <i />
              </span>
            </div>
            <div className={`${styles.menuItem} ${styles.active}`}>
              <img src="/assets/figma/admin2-icon-admin.png" alt="" />
              <span>Admin</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/admin2-icon-events.png" alt="" />
              <span>Partidos y eventos</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/admin2-icon-services.png" alt="" />
              <span>Nuestros servicios</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/admin2-icon-bell.png" alt="" />
              <span>Notificaciones</span>
              <span className={styles.badge}>22</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/admin2-icon-messages.png" alt="" />
              <span>Tus mensajes</span>
              <span className={styles.badge}>7</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/assets/figma/admin2-icon-settings.png" alt="" />
              <span>Ajustes</span>
            </div>
          </nav>
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
            <div className={styles.headerLeft}>
              <img
                className={styles.logoSmall}
                src="/assets/figma/logo.png"
                alt="Movida Deportiva TV"
              />
              <div>
                <h1>Panel de Administración</h1>
                <p>Gestiona tu plataforma deportiva</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.iconButton}>
                <img src="/assets/figma/admin2-icon-bell-top.png" alt="" />
                <span className={styles.dot} />
              </button>
              <div className={styles.adminCard}>
                <span className={styles.adminIcon}>
                  <img src="/assets/figma/admin2-icon-user.png" alt="" />
                </span>
                <div>
                  <strong>{session?.name ?? "Admin"}</strong>
                  <p>SuperUsuario</p>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.tabs}>
            <button className={styles.tabActive}>
              <img src="/assets/figma/admin2-tab-resumen.png" alt="" />
              Resumen
            </button>
            <button className={styles.tab}>
              <img src="/assets/figma/admin2-tab-usuarios.png" alt="" />
              Usuarios
            </button>
            <button className={styles.tab}>
              <img src="/assets/figma/admin2-tab-videos.png" alt="" />
              Videos
            </button>
            <button className={styles.tab}>
              <img src="/assets/figma/admin2-tab-sistema.png" alt="" />
              Sistema
            </button>
          </div>

          <div className={styles.statsGrid}>
            {[
              {
                title: "Total Usuarios",
                value: "2,847",
                change: "+12.5%",
                icon: "/assets/figma/admin2-card-users-1.png",
              },
              {
                title: "Videos Publicados",
                value: "1,234",
                change: "+8.2%",
                icon: "/assets/figma/admin2-card-videos-1.png",
              },
              {
                title: "Visualizaciones",
                value: "45.2K",
                change: "+23.1%",
                icon: "/assets/figma/admin2-card-views.png",
              },
              {
                title: "Engagement",
                value: "78%",
                change: "+5.4%",
                icon: "/assets/figma/admin2-card-engagement-2.png",
              },
            ].map((card) => (
              <article key={card.title} className={styles.statCard}>
                <div>
                  <p>{card.title}</p>
                  <h3>{card.value}</h3>
                  <span>{card.change}</span>
                </div>
                <div className={styles.statIcon}>
                  <img src={card.icon} alt="" />
                </div>
              </article>
            ))}
          </div>

          <div className={styles.bodyGrid}>
            <section className={styles.activityCard}>
              <h2>Actividad Reciente</h2>
              <p>Últimas 24 horas</p>
              <div className={styles.activityList}>
                {[
                  { title: "Nuevo usuario registrado", meta: "Carlos Rodríguez • Hace 5 min" },
                  { title: "Video publicado", meta: "Admin • Hace 15 min" },
                  { title: "Configuración actualizada", meta: "SuperAdmin • Hace 1 hora" },
                  { title: "Usuario premium activado", meta: "María García • Hace 2 horas" },
                  { title: "Comentario reportado", meta: "Sistema • Hace 3 horas" },
                ].map((item) => (
                  <div key={item.title} className={styles.activityItem}>
                    <span className={styles.activityDot} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.systemCard}>
              <h2>Estado del Sistema</h2>
              <p>Métricas de rendimiento</p>
              {[
                { label: "Uso de CPU", value: "45%" },
                { label: "Memoria", value: "62%" },
                { label: "Almacenamiento", value: "78%" },
                { label: "Ancho de Banda", value: "34%" },
              ].map((metric) => (
                <div key={metric.label} className={styles.metric}>
                  <div>
                    <span>{metric.label}</span>
                    <span>{metric.value}</span>
                  </div>
                  <div className={styles.metricBar}>
                    <span style={{ width: metric.value }} />
                  </div>
                </div>
              ))}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
