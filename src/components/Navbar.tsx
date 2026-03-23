"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n-shared";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Navbar.module.css";

const navItems = {
  es: [
    { label: "Inicio", href: "/" },
    { label: "¿Quiénes somos?", href: "/quienes-somos" },
    { label: "Servicios", href: "/servicios/streaming" },
  ],
  ca: [
    { label: "Inici", href: "/" },
    { label: "Qui som?", href: "/quienes-somos" },
    { label: "Serveis", href: "/servicios/streaming" },
  ],
  en: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/quienes-somos" },
    { label: "Services", href: "/servicios/streaming" },
  ],
} as const;

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const items = navItems[locale];
  const servicesLabel = items[2].label;
  const loginLabel = locale === "ca" ? "Entrar" : locale === "en" ? "Log in" : "Iniciar sesión";

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        <img src="/assets/figma/logo-public.svg" alt="Movida Deportiva TV" />
      </Link>
      <nav className={styles.links}>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? styles.activeLink : styles.link}
            >
              <span className={styles.linkText}>{item.label}</span>
              {item.label === servicesLabel && (
                <span className={styles.chevron} aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <path d="m5 7 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className={styles.actions}>
        <LanguageSwitcher locale={locale} />
        <Link href="/login" className={styles.loginButton}>
          <span>{loginLabel}</span>
          <img src="/assets/figma/arrow-right.png" alt="" />
        </Link>
      </div>
    </header>
  );
}
