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

export default function QuienesSomosPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={`kdam ${styles.heroTitle}`}>NUESTRO EQUIPO</h1>
      </section>

      <section className={styles.storySection}>
        <div className={styles.storyImage}>
          <img src="/assets/figma/team-1.png" alt="Jugador de fútbol" />
        </div>
        <div className={styles.storyContent}>
          <div className={styles.storyBody}>
            <h2 className={styles.sectionTitle}>Nuestra historia</h2>
            <div className={styles.storyText}>
              <p>
                <strong>Movida Deportiva TV</strong> nació de la pasión por el deporte y
                la tecnología audiovisual.
              </p>
              <p>
                Lo que comenzó como un proyecto para documentar eventos locales, se ha
                convertido en una empresa especializada en streaming profesional y
                producción audiovisual deportiva.
              </p>
            </div>
          </div>

          <div className={styles.storyNote}>
            Hemos crecido colaborando con equipos, federaciones y organizaciones que
            comparten nuestra visión: llevar el deporte a más personas a través de
            contenido de alta calidad.
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Nuestros valores</h2>
        <div className={styles.valuesGrid}>
          {values.map((item) => (
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
          <h2 className={styles.sectionTitle}>Nuestra misión</h2>
          <div className={styles.missionText}>
            <p>
              Nuestra misión es transformar conceptos en experiencias visuales únicas,
              fusionando tecnología avanzada con narrativas cautivadoras. Nos
              especializamos en todas las etapas del proceso audiovisual: desde la
              preproducción y planificación, hasta la filmación, edición y postproducción.
            </p>
            <p>
              Todo, con un enfoque personalizado y detallado que asegura que cada
              proyecto refleja la visión exacta que buscas.
            </p>
          </div>
          <div className={styles.missionPills}>
            <span>Preproducción → Planificación detallada de cada proyecto</span>
            <span>Filmación → Captura profesional con equipos de última generación</span>
            <span>Postproducción → Edición y efectos que dan vida a tu visión</span>
          </div>
        </div>

        <div className={styles.missionImageWrap}>
          <div className={styles.missionImage}>
            <img src="/assets/figma/team-2.png" alt="Producción deportiva en campo" />
          </div>
        </div>
      </section>

      <section className={styles.distinguishSection}>
        <h2 className={styles.sectionTitle}>¿Qué nos Distingue?</h2>
        <div className={styles.distinguishGrid}>
          {distinguishItems.map((item) => (
            <article key={item.title} className={styles.distinguishCard}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.collabSection}>
        <h2 className={styles.sectionTitle}>Nuestros colaboradores</h2>
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
