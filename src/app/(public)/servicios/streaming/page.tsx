import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import styles from "./ServiciosStreaming.module.css";

const mediaBase = "/assets/figma/Fotografias%20-%20Multimedia/fotos%20mdtv%20pagina%20web";

export default async function ServiciosStreamingPage() {
  const locale = await getLocale();
  const t = {
    es: {
      hero: "SERVICIO STREAMING", highlightTitle: "Retransmisiones profesionales de eventos deportivos",
      highlightText: "En MOVIDA DEPORTIVA TV, ofrecemos servicios completos de retransmisión de eventos deportivos, asegurando una cobertura integral y de alta calidad para cada partido. Nuestro compromiso es brindar una experiencia única y envolvente tanto para los espectadores como para los organizadores.",
      include: "Servicios disponibles",
      serviceNote:
        "La diferencia entre ambas opciones es que en la primera retransmitimos para la plataforma del cliente. En la segunda, emitimos en nuestro propio canal de producción, con mayor visibilidad y control completo del directo.",
      focusNote:
        "Hemos dejado de ofrecer otros servicios para enfocarnos en estas dos líneas y garantizarlas al máximo nivel.",
      process: "¿Cómo Trabajamos?",
      ctaTitle: "¿Listo para llevar tu evento al siguiente nivel?",
      ctaText: "En MOVIDA DEPORTIVA TV, nos apasiona el deporte y estamos dedicados a ofrecer retransmisiones de la más alta calidad.",
      contact: "Contactar ahora",
      services: [
        {
          num: "1",
          title: "Retransmisión para tu plataforma",
          desc: "Emitimos el evento para la plataforma del cliente (web, app o canal propio).",
        },
        {
          num: "2",
          title: "Retransmisión en nuestra plataforma MDTV",
          desc: "Emitimos el evento en nuestro canal de producción con toda la infraestructura y difusión MDTV.",
        },
      ],
    },
    ca: {
      hero: "SERVEI STREAMING", highlightTitle: "Retransmissions professionals d'esdeveniments esportius",
      highlightText: "A MOVIDA DEPORTIVA TV, oferim serveis complets de retransmissió d'esdeveniments esportius, assegurant una cobertura integral i d'alta qualitat per a cada partit. El nostre compromís és oferir una experiència única i immersiva tant per als espectadors com per als organitzadors.",
      include: "Serveis disponibles",
      serviceNote:
        "La diferència entre totes dues opcions és que a la primera retransmetem per a la plataforma del client. A la segona, emetem al nostre propi canal de producció, amb més visibilitat i control complet del directe.",
      focusNote:
        "Hem deixat d'oferir altres serveis per centrar-nos en aquestes dues línies i garantir-les al màxim nivell.",
      process: "Com treballem?",
      ctaTitle: "Preparat per portar el teu esdeveniment al següent nivell?",
      ctaText: "A MOVIDA DEPORTIVA TV, ens apassiona l'esport i estem dedicats a oferir retransmissions de la màxima qualitat.",
      contact: "Contacta ara",
      services: [
        {
          num: "1",
          title: "Retransmissió per a la teva plataforma",
          desc: "Emetem l'esdeveniment per a la plataforma del client (web, app o canal propi).",
        },
        {
          num: "2",
          title: "Retransmissió a la nostra plataforma MDTV",
          desc: "Emetem l'esdeveniment al nostre canal de producció amb tota la infraestructura i difusió MDTV.",
        },
      ],
    },
    en: {
      hero: "STREAMING SERVICE", highlightTitle: "Professional live coverage for sporting events",
      highlightText: "At MOVIDA DEPORTIVA TV, we provide comprehensive sports broadcasting services, ensuring high-quality and complete coverage for every match. Our commitment is to deliver a unique and immersive experience for both viewers and organisers.",
      include: "Available services",
      serviceNote:
        "The difference is that in the first option we broadcast for the client's platform. In the second, we broadcast on our own MDTV production channel with full control and wider visibility.",
      focusNote:
        "We no longer offer other services so we can focus on these two and deliver them at the highest level.",
      process: "How do we work?",
      ctaTitle: "Ready to take your event to the next level?",
      ctaText: "At MOVIDA DEPORTIVA TV, we are passionate about sport and dedicated to offering top-quality broadcasts.",
      contact: "Contact now",
      services: [
        {
          num: "1",
          title: "Broadcasting for your platform",
          desc: "We stream the event to the client's platform (web, app, or own channel).",
        },
        {
          num: "2",
          title: "Broadcasting on our MDTV platform",
          desc: "We stream the event on our production channel with full MDTV coverage and distribution.",
        },
      ],
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
          {t.services.map((item) => (
            <article key={item.num} className={styles.serviceCard}>
              <div className={styles.serviceNumber}>{item.num}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.serviceNotes}>
          <p>{t.serviceNote}</p>
          <p>{t.focusNote}</p>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processImage}>
          <img
            src={`${mediaBase}/IMG_6300.JPG`}
            alt="Puesto técnico de retransmisión en directo con monitores y realización"
          />
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
          <img
            src={`${mediaBase}/IMG_6313.JPG`}
            alt="Retransmisión profesional de un partido de fútbol sala"
          />
        </div>
        <div className={styles.ctaContent}>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
          <Link
            className={styles.primaryButton}
            href="/servicios/contacto"
          >
            {t.contact}
            <img src="/assets/figma/arrow-right.png" alt="" />
          </Link>
        </div>
      </section>
    </main>
  );
}
