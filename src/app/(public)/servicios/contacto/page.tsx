import { getLocale } from "@/lib/i18n";
import { getSession } from "@/lib/session";
import ContactoServiciosClient from "./ContactoServiciosClient";
import { submitPublicInquiryAction } from "./actions";
import styles from "./ContactoServicios.module.css";

export default async function PublicServicesContactPage() {
  const locale = await getLocale();
  const session = await getSession();

  const t = {
    es: {
      eyebrow: "Contacto",
    },
    ca: {
      eyebrow: "Contacte",
    },
    en: {
      eyebrow: "Contact",
    },
  }[locale];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>{t.eyebrow}</span>
      </section>

      <ContactoServiciosClient
        locale={locale}
        initialEmail={session?.email ?? ""}
        onSubmitInquiry={submitPublicInquiryAction}
      />
    </main>
  );
}
