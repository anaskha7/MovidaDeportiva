import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import styles from "./ServiciosStreaming.module.css";

const mediaBase = "/assets/figma/Fotografias%20-%20Multimedia/fotos%20mdtv%20pagina%20web";

export default async function ServiciosStreamingPage() {
  const locale = await getLocale();
  const t = {
    es: {
      hero: "SERVICIOS DE RETRANSMISIÓN",
      highlightTitle: "Cobertura deportiva clara, profesional y pensada para emitir bien",
      highlightText:
        "Nos hemos centrado en dos formatos de servicio para trabajar mejor: producir la retransmisión para tu propia plataforma o emitirla directamente desde MDTV. Mismo nivel técnico, dos formas de entrega según lo que necesites.",
      include: "Servicios disponibles",
      serviceNote:
        "La primera opción está pensada para entidades que ya tienen su canal o su web. La segunda está orientada a quienes prefieren apoyarse en nuestra estructura y emitir desde MDTV.",
      focusNote:
        "Hemos simplificado la propuesta para especializarnos en estas dos líneas y ejecutarlas con más consistencia.",
      process: "Cómo trabajamos",
      ctaTitle: "Si quieres preparar una retransmisión, lo vemos contigo",
      ctaText:
        "Cuéntanos qué partido, competición o jornada quieres cubrir y te planteamos la opción más adecuada para ese evento.",
      contact: "Contactar ahora",
      services: [
        {
          num: "1",
          title: "Retransmisión para tu plataforma",
          desc: "Producimos el directo para tu web, tu app o tu canal. Tú mantienes el punto de emisión y nosotros nos ocupamos de que la señal llegue con una realización estable, audio profesional y entrega en 1080p.",
        },
        {
          num: "2",
          title: "Retransmisión en nuestra plataforma MDTV",
          desc: "Emitimos el evento en MDTV y asumimos la salida del directo desde nuestro entorno. Es la opción más ágil cuando quieres delegar la operativa y aprovechar nuestro canal de distribución.",
        },
      ],
      featureItems: [
        {
          title: "Entrega 1080p",
          desc: "Señal optimizada para una emisión limpia y consistente.",
        },
        {
          title: "Audio profesional",
          desc: "Sonido claro, controlado y preparado para directo.",
        },
        {
          title: "Producción en vivo",
          desc: "Realización, grafismo y seguimiento técnico del evento.",
        },
        {
          title: "Cobertura adaptable",
          desc: "Nos ajustamos al recinto, al formato y al canal de salida.",
        },
      ],
      processItems: [
        {
          num: "1",
          title: "Briefing",
          desc: "Definimos el partido, el formato de emisión y el canal de salida.",
        },
        {
          num: "2",
          title: "Producción",
          desc: "Preparamos la cobertura técnica y ejecutamos el directo con nuestro equipo.",
        },
        {
          num: "3",
          title: "Entrega",
          desc: "Te dejamos la emisión publicada o integrada en el destino acordado.",
        },
      ],
    },
    ca: {
      hero: "SERVEIS DE RETRANSMISSIÓ",
      highlightTitle: "Cobertura esportiva clara, professional i pensada per emetre bé",
      highlightText:
        "Ens hem centrat en dos formats de servei per treballar millor: produir la retransmissió per a la teva pròpia plataforma o emetre-la directament des de MDTV. Mateix nivell tècnic, dues formes d'entrega segons el que necessitis.",
      include: "Serveis disponibles",
      serviceNote:
        "La primera opció està pensada per a entitats que ja tenen el seu canal o la seva web. La segona està orientada a qui prefereix recolzar-se en la nostra estructura i emetre des de MDTV.",
      focusNote:
        "Hem simplificat la proposta per especialitzar-nos en aquestes dues línies i executar-les amb més consistència.",
      process: "Com treballem",
      ctaTitle: "Si vols preparar una retransmissió, ho mirem amb tu",
      ctaText:
        "Explica'ns quin partit, competició o jornada vols cobrir i et plantejarem l'opció més adequada per a aquell esdeveniment.",
      contact: "Contacta ara",
      services: [
        {
          num: "1",
          title: "Retransmissió per a la teva plataforma",
          desc: "Produïm el directe per a la teva web, la teva app o el teu canal. Tu mantens el punt d'emissió i nosaltres ens ocupem que el senyal arribi amb una realització estable, àudio professional i entrega en 1080p.",
        },
        {
          num: "2",
          title: "Retransmissió a la nostra plataforma MDTV",
          desc: "Emetem l'esdeveniment a MDTV i assumim la sortida del directe des del nostre entorn. És l'opció més àgil quan vols delegar l'operativa i aprofitar el nostre canal de distribució.",
        },
      ],
      featureItems: [
        {
          title: "Entrega 1080p",
          desc: "Senyal optimitzat per a una emissió neta i consistent.",
        },
        {
          title: "Àudio professional",
          desc: "So clar, controlat i preparat per al directe.",
        },
        {
          title: "Producció en viu",
          desc: "Realització, grafisme i seguiment tècnic de l'esdeveniment.",
        },
        {
          title: "Cobertura adaptable",
          desc: "Ens ajustem al recinte, al format i al canal de sortida.",
        },
      ],
      processItems: [
        {
          num: "1",
          title: "Briefing",
          desc: "Definim el partit, el format d'emissió i el canal de sortida.",
        },
        {
          num: "2",
          title: "Producció",
          desc: "Preparem la cobertura tècnica i executem el directe amb el nostre equip.",
        },
        {
          num: "3",
          title: "Entrega",
          desc: "Et deixem l'emissió publicada o integrada al destí acordat.",
        },
      ],
    },
    en: {
      hero: "BROADCAST SERVICES",
      highlightTitle: "Clear, professional sports coverage built to go live properly",
      highlightText:
        "We focus on two service formats: producing the broadcast for your own platform or publishing it directly through MDTV. Same technical standard, two delivery models depending on what you need.",
      include: "Available services",
      serviceNote:
        "The first option is for organisations that already have a website, app or channel. The second is for teams that prefer to rely on our structure and go live from MDTV.",
      focusNote:
        "We streamlined the offer so we can specialise in these two lines and deliver them more consistently.",
      process: "How we work",
      ctaTitle: "If you want to plan a broadcast, we can review it with you",
      ctaText:
        "Tell us which match, competition or round you want to cover and we will suggest the best setup for that event.",
      contact: "Contact now",
      services: [
        {
          num: "1",
          title: "Broadcasting for your platform",
          desc: "We produce the live event for your website, app or channel. You keep control of the publishing point and we make sure the signal is delivered with stable direction, professional audio and 1080p output.",
        },
        {
          num: "2",
          title: "Broadcasting on our MDTV platform",
          desc: "We publish the event on MDTV and handle the live output from our own environment. It is the best option when you want to delegate operations and benefit from our distribution channel.",
        },
      ],
      featureItems: [
        {
          title: "1080p delivery",
          desc: "A clean, stable signal ready for live publishing.",
        },
        {
          title: "Professional audio",
          desc: "Clear sound managed specifically for live production.",
        },
        {
          title: "Live production",
          desc: "Direction, graphics and technical supervision during the event.",
        },
        {
          title: "Adaptable coverage",
          desc: "We adjust to the venue, the format and the publishing channel.",
        },
      ],
      processItems: [
        {
          num: "1",
          title: "Briefing",
          desc: "We define the match, the broadcast format and the publishing channel.",
        },
        {
          num: "2",
          title: "Production",
          desc: "We prepare the technical setup and execute the live coverage with our crew.",
        },
        {
          num: "3",
          title: "Delivery",
          desc: "We leave the broadcast published or integrated into the agreed destination.",
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
            {t.featureItems.map((item) => (
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
          {t.processItems.map((item) => (
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
