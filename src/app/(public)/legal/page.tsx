import Link from "next/link";
import { getLocale } from "@/lib/i18n";
import styles from "./Legal.module.css";

export default async function LegalIndexPage() {
  const locale = await getLocale();

  const content = {
    es: {
      eyebrow: "Legal",
      title: "Espacio legal",
      subtitle:
        "Aquí quedan preparados los accesos públicos para términos y privacidad. El contenido definitivo se puede completar después sin tocar la navegación.",
      privacy: "Política de privacidad",
      privacyText:
        "Espacio reservado para explicar tratamiento de datos, conservación, derechos del usuario y canales de contacto legales.",
      terms: "Términos del servicio",
      termsText:
        "Espacio reservado para condiciones de uso, límites del servicio, responsabilidades y normas generales de acceso a la plataforma.",
      privacyCta: "Abrir privacidad",
      termsCta: "Abrir términos",
    },
    ca: {
      eyebrow: "Legal",
      title: "Espai legal",
      subtitle:
        "Aquí queden preparats els accessos públics per a termes i privacitat. El contingut definitiu es pot completar després sense tocar la navegació.",
      privacy: "Política de privacitat",
      privacyText:
        "Espai reservat per explicar tractament de dades, conservació, drets de l'usuari i canals de contacte legals.",
      terms: "Termes del servei",
      termsText:
        "Espai reservat per a condicions d'ús, límits del servei, responsabilitats i normes generals d'accés a la plataforma.",
      privacyCta: "Obrir privacitat",
      termsCta: "Obrir termes",
    },
    en: {
      eyebrow: "Legal",
      title: "Legal area",
      subtitle:
        "This keeps the public entries for terms and privacy in place. Final legal copy can be completed later without changing site navigation.",
      privacy: "Privacy policy",
      privacyText:
        "Reserved space for data processing, storage periods, user rights and legal contact channels.",
      terms: "Terms of service",
      termsText:
        "Reserved space for usage conditions, service limits, responsibilities and general access rules.",
      privacyCta: "Open privacy",
      termsCta: "Open terms",
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
        <article className={styles.card}>
          <h2>{content.privacy}</h2>
          <p>{content.privacyText}</p>
          <Link href="/legal/privacidad">{content.privacyCta}</Link>
        </article>
        <article className={styles.card}>
          <h2>{content.terms}</h2>
          <p>{content.termsText}</p>
          <Link href="/legal/terminos">{content.termsCta}</Link>
        </article>
      </section>
    </main>
  );
}
