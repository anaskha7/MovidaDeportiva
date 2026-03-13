import { getLocale } from "@/lib/i18n";
import styles from "./QuienesSomos.module.css";

const values = [
  {
    title: "Pasión",
    description:
      "Cada proyecto lo abordamos con la misma pasión que sienten los deportistas por su disciplina.",
    icon: "/assets/figma/value-pasion.svg",
  },
  {
    title: "Excelencia",
    description:
      "Buscamos la perfección en cada detalle, desde la planificación hasta el resultado final.",
    icon: "/assets/figma/value-excelencia.svg",
    darkIcon: true,
  },
  {
    title: "Colaboración",
    description:
      "Trabajamos de la mano contigo para materializar tu visión exactamente como la imaginas.",
    icon: "/assets/figma/value-colaboracion.svg",
  },
];

const distinguishItems = [
  {
    title: "Calidad cinematográfica",
    description: "Utilizamos equipos y técnicas de nivel profesional.",
  },
  {
    title: "Pasión por el detalle",
    description: "Nos gusta cuidar todos los detalles de nuestras emisiones.",
  },
  {
    title: "Enfoque personalizado",
    description: "Cada proyecto refleja tu visión exacta.",
  },
];

const collaborators = [
  "/assets/figma/collab-1.png",
  "/assets/figma/collab-2.png",
  "/assets/figma/collab-3.png",
  "/assets/figma/collab-4.png",
  "/assets/figma/collab-5.png",
  "/assets/figma/collab-6.png",
  "/assets/figma/collab-7.png",
];

export default async function QuienesSomosPage() {
  const locale = await getLocale();
  const content = {
    es: {
      hero: "NUESTRO EQUIPO", history: "Nuestra historia", valuesTitle: "Nuestros valores", mission: "Nuestra misión", distinguish: "¿Qué nos Distingue?", collaborators: "Nuestros colaboradores",
      history1: "nació de la pasión por el deporte y la tecnología audiovisual.",
      history2: "Lo que comenzó como un proyecto para documentar eventos locales, se ha convertido en una empresa especializada en streaming profesional y producción audiovisual deportiva.",
      note: "Hemos crecido colaborando con equipos, federaciones y organizaciones que comparten nuestra visión: llevar el deporte a más personas a través de contenido de alta calidad.",
      mission1: "Nuestra misión es transformar conceptos en experiencias visuales únicas, fusionando tecnología avanzada con narrativas cautivadoras. Nos especializamos en todas las etapas del proceso audiovisual: desde la preproducción y planificación, hasta la filmación, edición y postproducción.",
      mission2: "Todo, con un enfoque personalizado y detallado que asegura que cada proyecto refleja la visión exacta que buscas.",
      pill1: "Preproducción → Planificación detallada de cada proyecto", pill2: "Filmación → Captura profesional con equipos de última generación", pill3: "Postproducción → Edición y efectos que dan vida a tu visión",
      valuesItems: values,
      distinguishItems,
    },
    ca: {
      hero: "EL NOSTRE EQUIP", history: "La nostra història", valuesTitle: "Els nostres valors", mission: "La nostra missió", distinguish: "Què ens distingeix?", collaborators: "Els nostres col·laboradors",
      history1: "va néixer de la passió per l'esport i la tecnologia audiovisual.",
      history2: "El que va començar com un projecte per documentar esdeveniments locals s'ha convertit en una empresa especialitzada en streaming professional i producció audiovisual esportiva.",
      note: "Hem crescut col·laborant amb equips, federacions i organitzacions que comparteixen la nostra visió: portar l'esport a més persones a través de contingut d'alta qualitat.",
      mission1: "La nostra missió és transformar conceptes en experiències visuals úniques, fusionant tecnologia avançada amb narratives captivadores. Ens especialitzem en totes les etapes del procés audiovisual: des de la preproducció i planificació fins a la filmació, edició i postproducció.",
      mission2: "Tot, amb un enfocament personalitzat i detallat que assegura que cada projecte reflecteix la visió exacta que busques.",
      pill1: "Preproducció → Planificació detallada de cada projecte", pill2: "Filmació → Captura professional amb equips d'última generació", pill3: "Postproducció → Edició i efectes que donen vida a la teva visió",
      valuesItems: [
        { title: "Passió", description: "Abordem cada projecte amb la mateixa passió que senten els esportistes per la seva disciplina.", icon: "/assets/figma/value-pasion.svg" },
        { title: "Excel·lència", description: "Busquem la perfecció en cada detall, des de la planificació fins al resultat final.", icon: "/assets/figma/value-excelencia.svg", darkIcon: true },
        { title: "Col·laboració", description: "Treballem colze a colze amb tu per materialitzar la teva visió exactament com la imagines.", icon: "/assets/figma/value-colaboracion.svg" },
      ],
      distinguishItems: [
        { title: "Qualitat cinematogràfica", description: "Utilitzem equips i tècniques de nivell professional." },
        { title: "Passió pel detall", description: "Ens agrada cuidar tots els detalls de les nostres emissions." },
        { title: "Enfocament personalitzat", description: "Cada projecte reflecteix la teva visió exacta." },
      ],
    },
    en: {
      hero: "OUR TEAM", history: "Our story", valuesTitle: "Our values", mission: "Our mission", distinguish: "What sets us apart?", collaborators: "Our collaborators",
      history1: "was born from a passion for sport and audiovisual technology.",
      history2: "What started as a project to document local events has become a company specialised in professional streaming and sports audiovisual production.",
      note: "We have grown by collaborating with teams, federations and organisations that share our vision: bringing sport to more people through high-quality content.",
      mission1: "Our mission is to transform concepts into unique visual experiences, combining advanced technology with captivating narratives. We specialise in every stage of the audiovisual process: from pre-production and planning to filming, editing and post-production.",
      mission2: "All with a personalised and detailed approach that ensures each project reflects the exact vision you are looking for.",
      pill1: "Pre-production → Detailed planning for each project", pill2: "Filming → Professional capture with state-of-the-art equipment", pill3: "Post-production → Editing and effects that bring your vision to life",
      valuesItems: [
        { title: "Passion", description: "We approach every project with the same passion athletes feel for their discipline.", icon: "/assets/figma/value-pasion.svg" },
        { title: "Excellence", description: "We pursue perfection in every detail, from planning to the final result.", icon: "/assets/figma/value-excelencia.svg", darkIcon: true },
        { title: "Collaboration", description: "We work hand in hand with you to bring your vision to life exactly as you imagine it.", icon: "/assets/figma/value-colaboracion.svg" },
      ],
      distinguishItems: [
        { title: "Cinematic quality", description: "We use professional-level equipment and techniques." },
        { title: "Attention to detail", description: "We care about every detail of our broadcasts." },
        { title: "Personalised approach", description: "Every project reflects your exact vision." },
      ],
    },
  }[locale];
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={`kdam ${styles.heroTitle}`}>{content.hero}</h1>
      </section>

      <section className={styles.storySection}>
        <div className={styles.storyImage}>
          <img src="/assets/figma/team-1.png" alt="Jugador de fútbol" />
        </div>
        <div className={styles.storyContent}>
          <div className={styles.storyBody}>
            <h2 className={styles.sectionTitle}>{content.history}</h2>
            <div className={styles.storyText}>
              <p>
                <strong>Movida Deportiva TV</strong> {content.history1}
              </p>
              <p>{content.history2}</p>
            </div>
          </div>

          <div className={styles.storyNote}>
            {content.note}
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>{content.valuesTitle}</h2>
        <div className={styles.valuesGrid}>
          {content.valuesItems.map((item) => (
            <article key={item.title} className={styles.valueCard}>
              <div className={item.darkIcon ? styles.valueIconDark : styles.valueIcon}>
                <img src={item.icon} alt="" />
              </div>
              <div className={styles.valueCopy}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.missionContent}>
          <h2 className={styles.sectionTitle}>{content.mission}</h2>
          <div className={styles.missionText}>
            <p>{content.mission1}</p>
            <p>{content.mission2}</p>
          </div>
          <div className={styles.missionPills}>
            <span>{content.pill1}</span>
            <span>{content.pill2}</span>
            <span>{content.pill3}</span>
          </div>
        </div>

        <div className={styles.missionImageWrap}>
          <div className={styles.missionImage}>
            <img src="/assets/figma/team-2.png" alt="Producción deportiva en campo" />
          </div>
        </div>
      </section>

      <section className={styles.distinguishSection}>
        <h2 className={styles.sectionTitle}>{content.distinguish}</h2>
        <div className={styles.distinguishGrid}>
          {content.distinguishItems.map((item) => (
            <article key={item.title} className={styles.distinguishCard}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.collabSection}>
        <h2 className={styles.sectionTitle}>{content.collaborators}</h2>
        <div className={styles.collabGrid}>
          {collaborators.map((src, index) => (
            <div key={src} className={styles.collabItem}>
              <img src={src} alt={`Colaborador ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
