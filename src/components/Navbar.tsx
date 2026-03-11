"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "¿Quiénes somos?", href: "/quienes-somos" },
  { label: "Servicios", href: "/servicios/streaming" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <img src="/assets/figma/logo.png" alt="Movida Deportiva TV" />
      </div>
      <nav className={styles.links}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? styles.activeLink : styles.link}
            >
              <span className={styles.linkText}>{item.label}</span>
              {item.label === "Servicios" && (
                <img
                  className={styles.chevron}
                  src="/assets/figma/chevron-down.png"
                  alt=""
                />
              )}
            </Link>
          );
        })}
      </nav>
      <Link href="/login" className={styles.loginButton}>
        <span>Log in</span>
        <img src="/assets/figma/arrow-right.png" alt="" />
      </Link>
    </header>
  );
}
