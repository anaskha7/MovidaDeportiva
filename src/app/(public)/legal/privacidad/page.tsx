import { getLocale } from "@/lib/i18n";
import styles from "../Legal.module.css";

export default async function PrivacyPage() {
  const locale = await getLocale();

  const content = {
    es: {
      eyebrow: "Privacidad",
      title: "Política de privacidad",
      subtitle:
        "Página preparada para incorporar el texto legal definitivo sobre protección de datos.",
      sections: [
        {
          title: "Responsable del tratamiento",
          body: "Espacio reservado para identificar a la entidad responsable, domicilio, correo de contacto y datos corporativos.",
        },
        {
          title: "Datos tratados",
          body: "Espacio reservado para detallar qué datos se recogen en registro, contacto, autenticación y uso de la plataforma.",
        },
        {
          title: "Finalidad y conservación",
          body: "Espacio reservado para explicar para qué se usan los datos, durante cuánto tiempo se conservan y bajo qué base jurídica.",
        },
        {
          title: "Derechos del usuario",
          body: "Espacio reservado para describir acceso, rectificación, supresión, oposición, limitación y portabilidad.",
        },
      ],
      note: "El bloque legal definitivo puede sustituir este contenido sin tocar rutas, footer ni navegación pública.",
    },
    ca: {
      eyebrow: "Privacitat",
      title: "Política de privacitat",
      subtitle:
        "Pàgina preparada per incorporar el text legal definitiu sobre protecció de dades.",
      sections: [
        {
          title: "Responsable del tractament",
          body: "Espai reservat per identificar l'entitat responsable, domicili, correu de contacte i dades corporatives.",
        },
        {
          title: "Dades tractades",
          body: "Espai reservat per detallar quines dades es recullen en registre, contacte, autenticació i ús de la plataforma.",
        },
        {
          title: "Finalitat i conservació",
          body: "Espai reservat per explicar per a què s'utilitzen les dades, durant quant temps es conserven i sota quina base jurídica.",
        },
        {
          title: "Drets de l'usuari",
          body: "Espai reservat per descriure accés, rectificació, supressió, oposició, limitació i portabilitat.",
        },
      ],
      note: "El bloc legal definitiu pot substituir aquest contingut sense tocar rutes, footer ni navegació pública.",
    },
    en: {
      eyebrow: "Privacy",
      title: "Privacy policy",
      subtitle:
        "This page is ready for the final legal data-protection copy.",
      sections: [
        {
          title: "Data controller",
          body: "Reserved space to identify the responsible entity, registered address, contact email and corporate details.",
        },
        {
          title: "Data processed",
          body: "Reserved space to detail which data is collected through registration, contact, authentication and platform use.",
        },
        {
          title: "Purpose and retention",
          body: "Reserved space to explain why data is processed, how long it is stored and the legal basis used.",
        },
        {
          title: "User rights",
          body: "Reserved space to describe access, rectification, deletion, objection, restriction and portability rights.",
        },
      ],
      note: "Final legal copy can replace this content without touching routes, footer or public navigation.",
    },
  }[locale];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </section>

      <section className={styles.grid}>
        {content.sections.map((section) => (
          <article key={section.title} className={styles.card}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <div className={styles.note}>{content.note}</div>
    </main>
  );
}
