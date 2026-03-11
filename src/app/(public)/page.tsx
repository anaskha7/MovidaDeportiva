import Link from "next/link";
import styles from "./Home.module.css";

export default function HomePage() {
  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <img
          className={styles.heroImage}
          src="/assets/figma/home-hero.png"
          alt=""
        />
        <div className={styles.heroContent}>
          <div className={`${styles.heroTitle} kdam`}>
            <span>MOVIDA</span>
            <span>DEPORTIVA TV</span>
          </div>
          <div className={styles.heroTextBlock}>
            <p>
              Producción audiovisual &amp; retransmisiones en vivo
            </p>
            <Link href="/quienes-somos" className={styles.primaryButton}>
              Descubrir más
              <img src="/assets/figma/arrow-right.png" alt="" />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.servicesIntro}>
          <span className={styles.pill}>Nuestros servicios</span>
          <h2>Tenemos todo lo que necesitas.</h2>
          <p>Desde streaming profesional hasta producción completa.</p>
          <Link href="/servicios/streaming" className={styles.primaryButton}>
            Quiero saber más
            <img src="/assets/figma/arrow-right.png" alt="" />
          </Link>
        </div>
        <div className={styles.servicesGrid}>
          <article className={styles.serviceCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardArrow} aria-hidden="true" />
            </div>
            <div>
              <h3>Servicio streaming</h3>
              <p>
                Disponible en múltiples plataformas. YouTube, Facebook, Instagram,
                Twitch y más. Calidad 4K, audio profesional y chat interactivo.
              </p>
            </div>
          </article>
          <article className={styles.serviceCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardArrow} aria-hidden="true" />
            </div>
            <div>
              <h3>Alquiler de material</h3>
              <p>
                Equipos profesionales de última generación. Cámaras 4K, audio
                inalámbrico, iluminación LED, drones y sistemas de streaming completos.
              </p>
            </div>
          </article>
          <article className={styles.serviceCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardArrow} aria-hidden="true" />
            </div>
            <div>
              <h3>MDTV</h3>
              <p>
                Producción audiovisual completa. Desde la idea hasta la pantalla,
                creamos contenido que conecta con tu audiencia.
              </p>
            </div>
          </article>
          <article className={styles.serviceCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardArrow} aria-hidden="true" />
            </div>
            <div>
              <h3>Speakers y animación</h3>
              <p>
                Servicios de locución profesional y animación para dar vida a tus
                eventos con energía y profesionalismo.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.directosSection}>
        <span className={styles.pill}>Directos</span>
        <h2>Transmisiones exclusivas y chat en directo.</h2>
        <div className={styles.directosGrid}>
          {[
            {
              img: "/assets/figma/home-directo-1.png",
              title: "GRAMA vs VILANOVA",
              subtitle: "3ª FEDERACIÓN - GRUPO V - JORNADA 19",
            },
            {
              img: "/assets/figma/home-directo-2.png",
              title: "UD SALUD vs ALCALÁ",
              subtitle: "SEGUNDA REGIONAL - GRUPO 2 - JORNADA 14",
            },
            {
              img: "/assets/figma/home-directo-3.png",
              title: "REAL LION FEM vs BADALONA FEM",
              subtitle: "3ª FEDERACIÓN - GRUPO 2 - JORNADA 16",
            },
          ].map((item) => (
            <article key={item.title} className={styles.directoCard}>
              <div className={styles.directoImage}>
                <img src={item.img} alt="" />
                <div className={styles.directoOverlay} />
                <Link href="/directo" className={styles.secondaryButton}>
                  Ver ahora
                </Link>
              </div>
              <div className={styles.directoMeta}>
                <div className={styles.liveBadge}>
                  <span>Live</span>
                  <span className={styles.liveDot} />
                </div>
                <img src="/assets/figma/arrow-right.png" alt="" />
              </div>
              <p className={styles.directoTitle}>
                <strong>{item.title}</strong> - <span>{item.subtitle}</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.aboutText}>
          <span className={styles.pill}>¿Quiénes somos?</span>
          <h2>Conócenos</h2>
          <p>
            Contamos historias que conectan, inspiran y trascienden
          </p>
          <div className={styles.aboutGrid}>
            <article className={styles.aboutCard}>
              <h3>Nuestra misión</h3>
              <p>
                Transformar conceptos en experiencias visuales únicas, fusionando
                tecnología avanzada con narrativas cautivadoras.
              </p>
            </article>
            <article className={styles.aboutCard}>
              <h3>¿Qué nos distingue?</h3>
              <ul>
                <li>
                  <img src="/assets/figma/check.png" alt="" />
                  Calidad cinematográfica, usamos equipos y técnicos de nivel
                  profesional
                </li>
                <li>
                  <img src="/assets/figma/check.png" alt="" />
                  Pasión por el detalle, cuidamos todos los detalles de nuestras
                  emisiones
                </li>
                <li>
                  <img src="/assets/figma/check.png" alt="" />
                  Enfoque personalizado, cada proyecto refleja la visión exacta que
                  buscas
                </li>
              </ul>
            </article>
          </div>
        </div>
        <div className={styles.aboutImage}>
          <img src="/assets/figma/home-about.png" alt="" />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <div>
            <h2>Nuestro compromiso de excelencia</h2>
            <p>
              Nuestro portafolio incluye proyectos para grandes marcas, pequeñas
              empresas y creadores independientes, siempre con el mismo compromiso de
              excelencia
            </p>
          </div>
          <Link href="/login" className={styles.darkButton}>
            <span>Crear cuenta</span>
            <img src="/assets/figma/arrow-right.png" alt="" />
          </Link>
          <a className={styles.ctaLogin} href="/login">
            ¿Ya tienes cuenta? <span>Iniciar sesión</span>
          </a>
        </div>
      </section>

      <section className={styles.collabSection}>
        <h2>Nuestros colaboradores</h2>
        <div className={styles.collabGrid}>
          {[
            "/assets/figma/collab-1.png",
            "/assets/figma/collab-2.png",
            "/assets/figma/collab-3.png",
            "/assets/figma/collab-4.png",
            "/assets/figma/collab-5.png",
            "/assets/figma/collab-6.png",
            "/assets/figma/collab-7.png",
          ].map((src, index) => (
            <div key={src} className={styles.collabItem}>
              <img src={src} alt={`Colaborador ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
