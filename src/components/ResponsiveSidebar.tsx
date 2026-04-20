"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type MouseEvent,
  useEffect,
  useState,
} from "react";
import AuthHistoryGuard from "@/components/AuthHistoryGuard";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./ResponsiveSidebar.module.css";

type Props = {
  locale: Locale;
  sidebarClassName: string;
  logoSrc?: string;
  logoAlt?: string;
  mobileActions?: React.ReactNode;
  children: React.ReactNode;
};

const labels = {
  es: {
    open: "Abrir menú",
    close: "Cerrar menú",
  },
  ca: {
    open: "Obrir menú",
    close: "Tancar menú",
  },
  en: {
    open: "Open menu",
    close: "Close menu",
  },
} as const;

export default function ResponsiveSidebar({
  locale,
  sidebarClassName,
  logoSrc = "/assets/figma/logo-md-dark.svg",
  logoAlt = "Movida Deportiva TV",
  mobileActions,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const t = labels[locale];
  const desktopChildren = Children.map(children, (child, index) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: child.key ?? `desktop-${index}`,
        })
      : child
  );
  const drawerChildren = Children.map(children, (child, index) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: child.key ?? `drawer-${index}`,
        })
      : child
  );

  useEffect(() => {
    if (!open) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  const handleDrawerNavigation = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");

    if (!anchor) {
      return;
    }

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      anchor.target === "_blank" ||
      anchor.hasAttribute("download")
    ) {
      return;
    }

    const href = anchor.getAttribute("href");

    if (!href) {
      setOpen(false);
      return;
    }

    event.preventDefault();
    setOpen(false);
    window.location.assign(href);
  };

  return (
    <>
      <AuthHistoryGuard />
      <div className={styles.mobileBar}>
        <a href="/" aria-label={logoAlt}>
          <img className={styles.mobileLogo} src={logoSrc} alt={logoAlt} />
        </a>
        <div className={styles.mobileBarActions}>
          {mobileActions}
          <button
            type="button"
            className={styles.menuButton}
            aria-label={t.open}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open ? (
        <div className={styles.backdrop} onClick={() => setOpen(false)}>
          <div className={styles.drawer} onClick={(event) => event.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <button
                type="button"
                className={styles.closeButton}
                aria-label={t.close}
                onClick={() => setOpen(false)}
              >
                <span />
                <span />
              </button>
            </div>
            <div
              className={`${sidebarClassName} ${styles.drawerSidebar}`}
              onClickCapture={handleDrawerNavigation}
            >
              {drawerChildren}
            </div>
          </div>
        </div>
      ) : null}

      <aside className={`${sidebarClassName} ${styles.desktopSidebar}`}>{desktopChildren}</aside>
    </>
  );
}
