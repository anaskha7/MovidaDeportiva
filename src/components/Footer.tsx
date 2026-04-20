import Link from "next/link";
import styles from "./Footer.module.css";

type Locale = "es" | "ca" | "en";

const socialIcons = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/movidadeportivatv/",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="3.25"
          y="3.25"
          width="17.5"
          height="17.5"
          rx="5"
          ry="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="4.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="17.35" cy="6.65" r="1.15" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@movidadeportivatv",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.2c0 2.3-.3 4.4-.6 5.3-.2.7-.8 1.3-1.5 1.5-1.5.4-6.9.4-6.9.4s-5.4 0-6.9-.4c-.7-.2-1.3-.8-1.5-1.5C3.3 16.6 3 14.5 3 12.2s.3-4.4.6-5.3c.2-.7.8-1.3 1.5-1.5C6.6 5 12 5 12 5s5.4 0 6.9.4c.7.2 1.3.8 1.5 1.5.3.9.6 3 .6 5.3Z" />
        <path d="M10 15.5v-7l6 3.5-6 3.5Z" fill="#ffffff" />
      </svg>
    ),
  },
];

export default function Footer({ locale }: { locale: Locale }) {
  const copy = {
    es: {
      quick: "Enlaces rápidos",
      home: "Inicio",
      about: "Conócenos",
      contact: "Contacto",
      legalSpace: "Espacio legal",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      services: "Nuestros servicios",
      streaming: "Servicio de retransmisión",
      mdtv: "Emisión en plataforma MDTV",
      support: "Soporte",
      supportText:
        "Te atendemos por correo o teléfono para dudas, presupuestos y seguimiento.",
    },
    ca: {
      quick: "Enllaços ràpids",
      home: "Inici",
      about: "Coneix-nos",
      contact: "Contacte",
      legalSpace: "Espai legal",
      privacy: "Política de privacitat",
      terms: "Termes del servei",
      services: "Els nostres serveis",
      streaming: "Servei de retransmissió",
      mdtv: "Emissió a la plataforma MDTV",
      support: "Suport",
      supportText:
        "T'atendrem per correu o telèfon per dubtes, pressupostos i seguiment.",
    },
    en: {
      quick: "Quick links",
      home: "Home",
      about: "About us",
      contact: "Contact",
      legalSpace: "Legal area",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      services: "Our services",
      streaming: "Broadcast service",
      mdtv: "Broadcast on MDTV platform",
      support: "Support",
      supportText:
        "Reach us by email or phone for questions, quotes and follow-up.",
    },
  }[locale];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerColumns}>
          <div className={styles.columnGroup}>
            <div>
              <h3>{copy.quick}</h3>
              <ul>
                <li>
                  <Link href="/">{copy.home}</Link>
                </li>
                <li>
                  <Link href="/quienes-somos">{copy.about}</Link>
                </li>
                <li>
                  <Link href="/servicios/contacto">{copy.contact}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>{copy.legalSpace}</h3>
              <ul>
                <li>
                  <Link href="/legal/privacidad">{copy.privacy}</Link>
                </li>
                <li>
                  <Link href="/legal/terminos">{copy.terms}</Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3>{copy.services}</h3>
            <ul>
              <li>
                <Link href="/servicios/streaming">{copy.streaming}</Link>
              </li>
              <li>
                <Link href="/servicios/streaming">{copy.mdtv}</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className={styles.contactGroup}>
              <h3>{copy.contact}</h3>
              <div className={styles.contactRow}>
                <img src="/assets/figma/footer-mail.svg" alt="" />
                <a href="mailto:movidadeportiva.direccion@gmail.com">
                  movidadeportiva.direccion@gmail.com
                </a>
              </div>
              <div className={styles.contactRow}>
                <img src="/assets/figma/footer-phone.svg" alt="" />
                <span>+34 640 92 52 25</span>
              </div>
            </div>
            <div className={styles.contactGroup}>
              <h3>{copy.support}</h3>
              <p>{copy.supportText}</p>
              <div className={styles.contactRow}>
                <img src="/assets/figma/footer-phone.svg" alt="" />
                <span>+34 666 123 456</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 Movida Deportiva TV.</p>
          <div className={styles.socials}>
            {socialIcons.map((icon) => (
              <a
                key={icon.id}
                href={icon.href}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label={icon.label}
                title={icon.label}
              >
                <span className={styles.socialGlyph} aria-label={icon.label}>
                  {icon.glyph}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
