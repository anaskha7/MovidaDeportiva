import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import { getCollaborationsLabel, PUBLIC_COLLABORATORS } from "./collaborations";
import styles from "./Home.module.css";

const mediaBase = "/assets/figma/Fotografias%20-%20Multimedia/fotos%20mdtv%20pagina%20web";

export default async function HomePage() {
  const locale = await getLocale();
  const t = {
    es: {
      hero: "Producción audiovisual & retransmisiones en vivo",
      discover: "Descubrir más",
      servicesPill: "Nuestros servicios",
      servicesTitle: "Tenemos todo lo que necesitas.",
      servicesText: "Dos soluciones claras para retransmitir tu evento con calidad profesional.",
      knowMore: "Quiero saber más",
      streaming: "Servicio streaming",
      streamingText: "Emitimos el evento en la plataforma que ya utilizas, con realización en directo, audio profesional y señal preparada para una entrega estable en 1080p.",
      streamingDetail: "Nos encargamos de la producción técnica para que tu organización mantenga el control del canal sin renunciar a una emisión sólida y bien presentada.",
      mdtvText: "Si prefieres apoyarte en nuestro canal, publicamos la retransmisión en MDTV y nos ocupamos de la parte operativa, la puesta en marcha y la visibilidad del directo.",
      livePill: "Directos",
      liveTitle: "Transmisiones exclusivas y chat en directo.",
      watchNow: "Ver ahora",
      liveCard1: "Cobertura multicámara con realización en vivo para que no te pierdas ningún detalle.",
      liveCard2: "Narración, realización y seguimiento del evento con una experiencia pensada para tu audiencia.",
      liveCard3: "Producción audiovisual preparada para emitir con calidad profesional desde cualquier recinto.",
      aboutPill: "¿Quiénes somos?",
      aboutTitle: "Conócenos",
      aboutText: "Contamos historias que conectan, inspiran y trascienden",
      mission: "Nuestra misión",
      missionText: "Transformar conceptos en experiencias visuales únicas, fusionando tecnología avanzada con narrativas cautivadoras.",
      distinct: "¿Qué nos distingue?",
      distinct1: "Calidad cinematográfica, usamos equipos y técnicos de nivel profesional",
      distinct2: "Pasión por el detalle, cuidamos todos los detalles de nuestras emisiones",
      distinct3: "Enfoque personalizado, cada proyecto refleja la visión exacta que buscas",
      excellence: "Nuestro compromiso de excelencia",
      excellenceText: "Nuestro portafolio incluye proyectos para grandes marcas, pequeñas empresas y creadores independientes, siempre con el mismo compromiso de excelencia",
      create: "Crear cuenta",
      haveAccount: "¿Ya tienes cuenta?",
      login: "Iniciar sesión",
    },
    ca: {
      hero: "Producció audiovisual i retransmissions en directe",
      discover: "Descobrir més",
      servicesPill: "Els nostres serveis",
      servicesTitle: "Tenim tot el que necessites.",
      servicesText: "Dues solucions clares per retransmetre el teu esdeveniment amb qualitat professional.",
      knowMore: "Vull saber-ne més",
      streaming: "Servei d'Streaming",
      streamingText: "Emetem l'esdeveniment a la plataforma que ja utilitzes, amb realització en directe, àudio professional i senyal preparada per a una entrega estable en 1080p.",
      streamingDetail: "Ens ocupem de la producció tècnica perquè la teva organització mantingui el control del canal sense renunciar a una emissió sòlida i ben presentada.",
      mdtvText: "Si prefereixes recolzar-te en el nostre canal, publiquem la retransmissió a MDTV i ens ocupem de la part operativa, la posada en marxa i la visibilitat del directe.",
      livePill: "Directes",
      liveTitle: "Transmissions exclusives i xat en directe.",
      watchNow: "Veure ara",
      liveCard1: "Cobertura multicàmera amb realització en viu perquè no et perdis cap detall.",
      liveCard2: "Narració, realització i seguiment de l'esdeveniment amb una experiència pensada per a la teva audiència.",
      liveCard3: "Producció audiovisual preparada per emetre amb qualitat professional des de qualsevol recinte.",
      aboutPill: "Qui som?",
      aboutTitle: "Coneix-nos",
      aboutText: "Expliquem històries que connecten, inspiren i transcendeixen",
      mission: "La nostra missió",
      missionText: "Transformar conceptes en experiències visuals úniques, fusionant tecnologia avançada amb narratives captivadores.",
      distinct: "Què ens distingeix?",
      distinct1: "Qualitat cinematogràfica, fem servir equips i tècnics de nivell professional",
      distinct2: "Passió pel detall, cuidem tots els detalls de les nostres emissions",
      distinct3: "Enfocament personalitzat, cada projecte reflecteix la visió exacta que busques",
      excellence: "El nostre compromís d'excel·lència",
      excellenceText: "El nostre portafoli inclou projectes per a grans marques, petites empreses i creadors independents, sempre amb el mateix compromís d'excel·lència",
      create: "Crear compte",
      haveAccount: "Ja tens compte?",
      login: "Iniciar sessió",
    },
    en: {
      hero: "Audiovisual production & live broadcasts",
      discover: "Discover more",
      servicesPill: "Our services",
      servicesTitle: "We have everything you need.",
      servicesText: "Two clear ways to broadcast your event with professional delivery.",
      knowMore: "I want to know more",
      streaming: "Streaming service",
      streamingText: "We deliver the event to the platform you already use, with live direction, professional audio and a stable 1080p-ready feed.",
      streamingDetail: "We handle the technical production so your organisation keeps control of the channel without sacrificing a polished broadcast.",
      mdtvText: "If you prefer to rely on our channel, we publish the broadcast on MDTV and take care of the operational setup, launch and live visibility.",
      livePill: "Live",
      liveTitle: "Exclusive broadcasts and live chat.",
      watchNow: "Watch now",
      liveCard1: "Multi-camera coverage with live direction so your audience catches every key moment.",
      liveCard2: "Commentary, live production and event tracking designed for a more immersive broadcast.",
      liveCard3: "Audiovisual production ready to go live with professional quality from any venue.",
      aboutPill: "Who are we?",
      aboutTitle: "Get to know us",
      aboutText: "We tell stories that connect, inspire and transcend",
      mission: "Our mission",
      missionText: "To transform concepts into unique visual experiences, combining advanced technology with captivating narratives.",
      distinct: "What makes us different?",
      distinct1: "Cinematic quality, we use professional-grade teams and technicians",
      distinct2: "Attention to detail, we take care of every detail in our broadcasts",
      distinct3: "Personalised approach, each project reflects the exact vision you want",
      excellence: "Our commitment to excellence",
      excellenceText: "Our portfolio includes projects for major brands, small businesses and independent creators, always with the same commitment to excellence",
      create: "Create account",
      haveAccount: "Already have an account?",
      login: "Log in",
    },
  }[locale];

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
            <span className={styles.heroTitleTop}>MOVIDA</span>
            <span className={styles.heroTitleBottom}>DEPORTIVA TV</span>
          </div>
          <div className={styles.heroTextBlock}>
            <p>
              {t.hero}
            </p>
            <Link href="/quienes-somos" className={styles.primaryButton}>
              {t.discover}
              <img src="/assets/figma/arrow-right.png" alt="" />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.servicesIntro}>
          <span className={styles.pill}>{t.servicesPill}</span>
          <h2>{t.servicesTitle}</h2>
          <p>{t.servicesText}</p>
          <Link href="/servicios/streaming" className={styles.primaryButton}>
            {t.knowMore}
            <img src="/assets/figma/arrow-right.png" alt="" />
          </Link>
        </div>
        <div className={styles.servicesVisualGroup}>
          <div className={styles.servicesGrid}>
            <Link href="/servicios/streaming" className={`${styles.cardLink} ${styles.cardLinkFeatured}`}>
              <article className={`${styles.serviceCard} ${styles.serviceCardFeatured}`}>
                <div>
                  <h3>{t.streaming}</h3>
                  <p>{t.streamingText}</p>
                  <p>{t.streamingDetail}</p>
                </div>
              </article>
            </Link>
            <Link href="/servicios/streaming" className={styles.cardLink}>
              <article className={styles.serviceCard}>
                <div>
                  <h3>MDTV</h3>
                  <p>{t.mdtvText}</p>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.directosSection}>
        <span className={styles.pill}>{t.livePill}</span>
        <h2>{t.liveTitle}</h2>
        <div className={styles.directosGrid}>
          {[
            {
              img: `${mediaBase}/IMG_6291.JPG`,
              title: "GRAMA vs VILANOVA",
              subtitle: t.liveCard1,
            },
            {
              img: `${mediaBase}/IMG_6300.JPG`,
              title: "UD SALUD vs ALCALÁ",
              subtitle: t.liveCard2,
            },
            {
              img: `${mediaBase}/1665aec1-55a2-4eea-9bfd-dd02c883b516.jpg`,
              title: "REAL LION FEM vs BADALONA FEM",
              subtitle: t.liveCard3,
            },
          ].map((item) => (
            <Link key={item.title} href="/directo" prefetch={false} className={styles.cardLink}>
            <article className={styles.directoCard}>
              <div className={styles.directoImage}>
                <img src={item.img} alt={`Cobertura multimedia de ${item.title}`} />
                <div className={styles.directoOverlay} />
                <span className={styles.secondaryButton}>
                  {t.watchNow}
                </span>
              </div>
              <div className={styles.directoMeta}>
                <span className={styles.directoCategory}>{t.livePill}</span>
                <img src="/assets/figma/arrow-right.png" alt="" />
              </div>
              <p className={styles.directoTitle}>
                <span>{item.subtitle}</span>
              </p>
            </article>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.aboutText}>
          <span className={styles.pill}>{t.aboutPill}</span>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutText}</p>
          <div className={styles.aboutGrid}>
            <Link href="/quienes-somos" className={styles.cardLink}>
            <article className={styles.aboutCard}>
              <h3>{t.mission}</h3>
              <p>{t.missionText}</p>
            </article>
            </Link>
            <Link href="/quienes-somos" className={styles.cardLink}>
            <article className={styles.aboutCard}>
              <h3>{t.distinct}</h3>
              <ul>
                <li>
                  <img src="/assets/figma/check.png" alt="" />
                  {t.distinct1}
                </li>
                <li>
                  <img src="/assets/figma/check.png" alt="" />
                  {t.distinct2}
                </li>
                <li>
                  <img src="/assets/figma/check.png" alt="" />
                  {t.distinct3}
                </li>
              </ul>
            </article>
            </Link>
          </div>
        </div>
        <div className={styles.aboutImage}>
          <img
            src={`${mediaBase}/IMG_5975.JPG`}
            alt="Operador de cámara de Movida Deportiva TV durante una retransmisión"
          />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <div>
            <h2>{t.excellence}</h2>
            <p>{t.excellenceText}</p>
          </div>
          <Link href="/login" className={styles.darkButton}>
            <span>{t.create}</span>
            <img src="/assets/figma/arrow-right.png" alt="" />
          </Link>
          <a className={styles.ctaLogin} href="/login">
            {t.haveAccount} <span>{t.login}</span>
          </a>
        </div>
      </section>

      <section className={styles.collabSection}>
        <h2>{getCollaborationsLabel(locale)}</h2>
        <div className={styles.collabGrid}>
          {PUBLIC_COLLABORATORS.map((item) => (
            <div key={item.src} className={styles.collabItem}>
              <img src={item.src} alt={item.alt} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
