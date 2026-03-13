import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import styles from "./Home.module.css";

export default async function HomePage() {
  const locale = await getLocale();
  const t = {
    es: {
      hero: "Producción audiovisual & retransmisiones en vivo",
      discover: "Descubrir más",
      servicesPill: "Nuestros servicios",
      servicesTitle: "Tenemos todo lo que necesitas.",
      servicesText: "Desde streaming profesional hasta producción completa.",
      knowMore: "Quiero saber más",
      streaming: "Servicio streaming",
      streamingText: "Disponible en múltiples plataformas. YouTube, Facebook, Instagram, Twitch y más. Calidad 4K, audio profesional y chat interactivo.",
      rental: "Alquiler de material",
      rentalText: "Equipos profesionales de última generación. Cámaras 4K, audio inalámbrico, iluminación LED, drones y sistemas de streaming completos.",
      speakers: "Speakers y animación",
      speakersText: "Servicios de locución profesional y animación para dar vida a tus eventos con energía y profesionalismo.",
      livePill: "Directos",
      liveTitle: "Transmisiones exclusivas y chat en directo.",
      watchNow: "Ver ahora",
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
      collaborators: "Nuestros colaboradores",
    },
    ca: {
      hero: "Producció audiovisual i retransmissions en directe",
      discover: "Descobrir més",
      servicesPill: "Els nostres serveis",
      servicesTitle: "Tenim tot el que necessites.",
      servicesText: "Des d'Streaming professional fins a producció completa.",
      knowMore: "Vull saber-ne més",
      streaming: "Servei d'Streaming",
      streamingText: "Disponible en múltiples plataformes. YouTube, Facebook, Instagram, Twitch i més. Qualitat 4K, àudio professional i xat interactiu.",
      rental: "Lloguer de material",
      rentalText: "Equips professionals d'última generació. Càmeres 4K, àudio sense fils, il·luminació LED, drons i sistemes d'Streaming complets.",
      speakers: "Speakers i animació",
      speakersText: "Serveis de locució professional i animació per donar vida als teus esdeveniments amb energia i professionalitat.",
      livePill: "Directes",
      liveTitle: "Transmissions exclusives i xat en directe.",
      watchNow: "Veure ara",
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
      collaborators: "Els nostres col·laboradors",
    },
    en: {
      hero: "Audiovisual production & live broadcasts",
      discover: "Discover more",
      servicesPill: "Our services",
      servicesTitle: "We have everything you need.",
      servicesText: "From professional streaming to full production.",
      knowMore: "I want to know more",
      streaming: "Streaming service",
      streamingText: "Available on multiple platforms. YouTube, Facebook, Instagram, Twitch and more. 4K quality, professional audio and interactive chat.",
      rental: "Equipment rental",
      rentalText: "State-of-the-art professional equipment. 4K cameras, wireless audio, LED lighting, drones and complete streaming systems.",
      speakers: "Speakers and entertainment",
      speakersText: "Professional voice-over and entertainment services to bring your events to life with energy and professionalism.",
      livePill: "Live",
      liveTitle: "Exclusive broadcasts and live chat.",
      watchNow: "Watch now",
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
      collaborators: "Our collaborators",
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
            <span>MOVIDA</span>
            <span>DEPORTIVA TV</span>
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
        <div className={styles.servicesGrid}>
          <article className={styles.serviceCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardArrow} aria-hidden="true" />
            </div>
            <div>
              <h3>{t.streaming}</h3>
              <p>{t.streamingText}</p>
            </div>
          </article>
          <article className={styles.serviceCard}>
            <div className={styles.cardTop}>
              <span className={styles.cardArrow} aria-hidden="true" />
            </div>
            <div>
              <h3>{t.rental}</h3>
              <p>{t.rentalText}</p>
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
              <h3>{t.speakers}</h3>
              <p>{t.speakersText}</p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.directosSection}>
        <span className={styles.pill}>{t.livePill}</span>
        <h2>{t.liveTitle}</h2>
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
                  {t.watchNow}
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
          <span className={styles.pill}>{t.aboutPill}</span>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutText}</p>
          <div className={styles.aboutGrid}>
            <article className={styles.aboutCard}>
              <h3>{t.mission}</h3>
              <p>{t.missionText}</p>
            </article>
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
          </div>
        </div>
        <div className={styles.aboutImage}>
          <img src="/assets/figma/home-about.png" alt="" />
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
        <h2>{t.collaborators}</h2>
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
