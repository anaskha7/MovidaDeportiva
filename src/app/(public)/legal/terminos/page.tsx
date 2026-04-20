import { getLocale } from "@/lib/i18n";
import styles from "../Legal.module.css";

export default async function TermsPage() {
  const locale = await getLocale();

  const content = {
    es: {
      eyebrow: "Términos",
      title: "Términos del servicio",
      subtitle:
        "Página preparada para dejar publicados los términos de acceso y uso de la plataforma.",
      items: [
        "Espacio reservado para definir condiciones generales de uso.",
        "Espacio reservado para explicar altas, acceso privado, suscripciones y restricciones.",
        "Espacio reservado para responsabilidades, disponibilidad del servicio y limitaciones técnicas.",
        "Espacio reservado para normas de conducta, propiedad intelectual y procedimiento de contacto.",
      ],
      note: "Cuando tengas el texto jurídico definitivo, aquí ya está la estructura y la ruta pública listas.",
    },
    ca: {
      eyebrow: "Termes",
      title: "Termes del servei",
      subtitle:
        "Pàgina preparada per deixar publicats els termes d'accés i ús de la plataforma.",
      items: [
        "Espai reservat per definir condicions generals d'ús.",
        "Espai reservat per explicar altes, accés privat, subscripcions i restriccions.",
        "Espai reservat per a responsabilitats, disponibilitat del servei i limitacions tècniques.",
        "Espai reservat per a normes de conducta, propietat intel·lectual i procediment de contacte.",
      ],
      note: "Quan tinguis el text jurídic definitiu, aquí ja tens l'estructura i la ruta pública preparades.",
    },
    en: {
      eyebrow: "Terms",
      title: "Terms of service",
      subtitle:
        "This page is ready for the final public access and usage terms.",
      items: [
        "Reserved space for general usage conditions.",
        "Reserved space for account creation, private access, subscriptions and restrictions.",
        "Reserved space for responsibilities, service availability and technical limitations.",
        "Reserved space for conduct rules, intellectual property and contact procedure.",
      ],
      note: "Once you have the final legal wording, the structure and public route are already in place.",
    },
  }[locale];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.subtitle}</p>
      </section>

      <article className={styles.card}>
        <ul className={styles.list}>
          {content.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <div className={styles.note}>{content.note}</div>
    </main>
  );
}
