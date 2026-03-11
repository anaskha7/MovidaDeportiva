import Link from "next/link";
import styles from "./Footer.module.css";

const socialIcons = [
  {
    id: "facebook",
    label: "Facebook",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 4.9V12H6v4h3v4h4v-4h3l1-4h-4V9.2c0-.8.3-1.2 1-1.2Z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "X",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.9 3H21l-6.5 7.4L22 21h-5.9l-4.6-6-5.3 6H4.1l7-7.9L2 3h6l4.2 5.5L18.9 3Z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.35" cy="6.65" r="1.15" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    glyph: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.2c0 2.3-.3 4.4-.6 5.3-.2.7-.8 1.3-1.5 1.5-1.5.4-6.9.4-6.9.4s-5.4 0-6.9-.4c-.7-.2-1.3-.8-1.5-1.5C3.3 16.6 3 14.5 3 12.2s.3-4.4.6-5.3c.2-.7.8-1.3 1.5-1.5C6.6 5 12 5 12 5s5.4 0 6.9.4c.7.2 1.3.8 1.5 1.5.3.9.6 3 .6 5.3Z" />
        <path d="M10 15.5v-7l6 3.5-6 3.5Z" fill="#ffffff" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerColumns}>
          <div className={styles.columnGroup}>
            <div>
              <h3>Enlaces rápidos</h3>
              <ul>
                <li><Link href="/">Inicio</Link></li>
                <li><Link href="/quienes-somos">Conócenos</Link></li>
                <li><a href="mailto:movidadeportiva.direccion@gmail.com">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3>Legal</h3>
              <ul>
                <li><Link href="/quienes-somos">Política de Privacidad</Link></li>
                <li><Link href="/quienes-somos">Términos de Servicio</Link></li>
              </ul>
            </div>
          </div>
          <div>
            <h3>Nuestros servicios</h3>
            <ul>
              <li><Link href="/servicios/streaming">Servicio de streaming</Link></li>
              <li><Link href="/servicios/streaming">MDTV</Link></li>
              <li><Link href="/servicios/streaming">Alquiler de material</Link></li>
              <li><Link href="/servicios/streaming">Speakers y animación</Link></li>
            </ul>
          </div>
          <div>
            <div className={styles.contactGroup}>
              <h3>Contacto</h3>
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
              <h3>Atención al cliente</h3>
              <p>
                Disponible por correo y teléfono. Respuesta en menos de 24 horas
              </p>
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
              <div key={icon.id} className={styles.socialCircle}>
                <span className={styles.socialGlyph} aria-label={icon.label}>
                  {icon.glyph}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
