import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import styles from "./ServiciosStreaming.module.css";

export default async function ServiciosStreamingPage() {
  const locale = await getLocale();
  const t = {
    es: {
      hero: "SERVICIO STREAMING", highlightTitle: "Retransmisiones profesionales de eventos deportivos",
      highlightText: "En MOVIDA DEPORTIVA TV, ofrecemos servicios completos de retransmisión de eventos deportivos, asegurando una cobertura integral y de alta calidad para cada partido. Nuestro compromiso es brindar una experiencia única y envolvente tanto para los espectadores como para los organizadores.",
      include: "Nuestros servicios incluyen", process: "¿Cómo Trabajamos?", ctaTitle: "¿Listo para llevar tu evento al siguiente nivel?", ctaText: "En MOVIDA DEPORTIVA TV, nos apasiona el deporte y estamos dedicados a ofrecer retransmisiones de la más alta calidad.", contact: "Contactar ahora",
    },
    ca: {
      hero: "SERVEI STREAMING", highlightTitle: "Retransmissions professionals d'esdeveniments esportius",
      highlightText: "A MOVIDA DEPORTIVA TV, oferim serveis complets de retransmissió d'esdeveniments esportius, assegurant una cobertura integral i d'alta qualitat per a cada partit. El nostre compromís és oferir una experiència única i immersiva tant per als espectadors com per als organitzadors.",
      include: "Els nostres serveis inclouen", process: "Com treballem?", ctaTitle: "Preparat per portar el teu esdeveniment al següent nivell?", ctaText: "A MOVIDA DEPORTIVA TV, ens apassiona l'esport i estem dedicats a oferir retransmissions de la màxima qualitat.", contact: "Contacta ara",
    },
    en: {
      hero: "STREAMING SERVICE", highlightTitle: "Professional live coverage for sporting events",
      highlightText: "At MOVIDA DEPORTIVA TV, we provide comprehensive sports broadcasting services, ensuring high-quality and complete coverage for every match. Our commitment is to deliver a unique and immersive experience for both viewers and organisers.",
      include: "Our services include", process: "How do we work?", ctaTitle: "Ready to take your event to the next level?", ctaText: "At MOVIDA DEPORTIVA TV, we are passionate about sport and dedicated to offering top-quality broadcasts.", contact: "Contact now",
    },
  }[locale];
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={`kdam ${styles.heroTitle}`}>{t.hero}</h1>
      </section>

      <section className={styles.highlightSection}>
        <div className={styles.highlightBox}>
          <div>
            <h2>{t.highlightTitle}</h2>
            <p>{t.highlightText}</p>
          </div>
          <div className={styles.featureGrid}>
            {[
              {
                title: "Múltiples Plataformas",
                desc: "YouTube, Facebook, Instagram, Twitch y más",
              },
              {
                title: "Calidad 4K",
                desc: "Transmisiones en ultra alta definición",
              },
              {
                title: "Audio Profesional",
                desc: "Sonido cristalino y sin interferencias",
              },
              {
                title: "Chat Interactivo",
                desc: "Conexión directa con tu audiencia",
              },
            ].map((item) => (
              <div key={item.title} className={styles.featureItem}>
                <span className={styles.featureIcon} aria-hidden="true">
                  <img src="/assets/figma/icon.png" alt="" />
                </span>
                <div className={styles.featureText}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <h2>{t.include}</h2>
        <div className={styles.servicesGrid}>
          {[
            {
              num: "1",
              title: "Retransmisión del Partido",
              desc: "Capturamos cada momento con cámaras de alta definición para ofrecer una visualización impecable desde cualquier ángulo.",
            },
            {
              num: "2",
              title: "Realización en Vivo",
              desc: "Coordinamos todas las tomas, gráficos y repeticiones en tiempo real para una producción dinámica y profesional.",
            },
            {
              num: "3",
              title: "Narración y Locución",
              desc: "Proporcionamos comentaristas y locutores experimentados que aportan emoción y conocimiento experto al evento.",
            },
            {
              num: "4",
              title: "Zona Mixta",
              desc: "Cobertura de entrevistas y reacciones post-partido con jugadores y entrenadores para brindar contenido adicional y exclusivo.",
            },
            {
              num: "5",
              title: "Producción Completa",
              desc: "Gestionamos todos los aspectos de la producción, incluyendo gráficos, estadísticas en tiempo real y efectos visuales.",
            },
            {
              num: "6",
              title: "Soporte Técnico",
              desc: "Nuestro equipo técnico altamente capacitado asegura el funcionamiento perfecto de todos los equipos y sistemas durante el evento.",
            },
          ].map((item) => (
            <article key={item.num} className={styles.serviceCard}>
              <div className={styles.serviceNumber}>{item.num}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processImage}>
          <img src="/assets/figma/servicios-image-25.png" alt="" />
        </div>
        <div className={styles.processContent}>
          <h2>{t.process}</h2>
          {[
            {
              num: "1",
              title: "Planificación",
              desc: "Analizamos tu evento y definimos la mejor estrategia de retransmisión",
            },
            {
              num: "2",
              title: "Producción",
              desc: "Ejecutamos la retransmisión con nuestro equipo profesional y tecnología avanzada",
            },
            {
              num: "3",
              title: "Entrega",
              desc: "Proporcionamos el contenido final y análisis de audiencia del evento",
            },
          ].map((item) => (
            <div key={item.num} className={styles.processRow}>
              <div className={styles.processNumber}>{item.num}</div>
              <div className={styles.processCard}>
                <p>
                  <strong>{item.title}</strong>
                  <br />
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBackground}>
          <img src="/assets/figma/servicios-cta-bg.png" alt="" />
        </div>
        <div className={styles.ctaContent}>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
          <Link
            className={styles.primaryButton}
            href="mailto:movidadeportiva.direccion@gmail.com?subject=Quiero%20informaci%C3%B3n%20sobre%20streaming"
          >
            {t.contact}
            <img src="/assets/figma/arrow-right.png" alt="" />
          </Link>
        </div>
      </section>
    </main>
  );
}
