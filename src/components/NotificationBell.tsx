"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NotificationFeedItem } from "@/lib/backoffice";
import type { Locale } from "@/lib/i18n-shared";
import NotificationDateBadge from "./NotificationDateBadge";
import styles from "./NotificationBell.module.css";

type NotificationBellProps = {
  locale: Locale;
  iconSrc?: string;
  viewAllHref?: string;
  className?: string;
  items?: NotificationFeedItem[];
  count?: number;
};

export default function NotificationBell({
  locale,
  iconSrc = "/assets/figma/admin-menu-bell.svg",
  viewAllHref = "/app/notificaciones",
  className,
  items = [],
  count = 0,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const t = {
    es: {
      title: "Notificaciones",
      viewAll: "Ver todas",
      open: "Abrir notificaciones",
    },
    ca: {
      title: "Notificacions",
      viewAll: "Veure-les totes",
      open: "Obrir notificacions",
    },
    en: {
      title: "Notifications",
      viewAll: "View all",
      open: "Open notifications",
    },
  }[locale];

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleButtonClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
      const [targetPath, targetHash] = viewAllHref.split("#");
      const currentHash = window.location.hash.replace(/^#/, "");
      const shouldNavigate =
        pathname !== targetPath || (targetHash ? currentHash !== targetHash : false);

      if (shouldNavigate) {
        setOpen(false);
        router.push(viewAllHref);
        return;
      }
    }

    setOpen((value) => !value);
  };

  return (
    <div
      ref={wrapperRef}
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        className={styles.button}
        onClick={handleButtonClick}
        aria-label={t.open}
        aria-expanded={open}
      >
        <img src={iconSrc} alt="" />
        <i className={styles.dot} />
      </button>

      {open ? (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <strong>{t.title}</strong>
              <NotificationDateBadge count={count} className={styles.badge} />
            </div>
            <Link href={viewAllHref} className={styles.viewAll} onClick={() => setOpen(false)}>
              {t.viewAll}
            </Link>
          </div>

          <div className={styles.list}>
            {items.length > 0 ? items.map((item) => (
              <div
                key={item.id}
                className={styles.item}
              >
                <span className={styles.itemDot} />
                <p>
                  {item.actor ? <strong>{item.actor}</strong> : null}
                  {item.actor ? " " : null}
                  <span>{item.message}</span>
                </p>
              </div>
            )) : (
              <div className={styles.item}>
                <span className={styles.itemDot} />
                <p>
                  <span>
                    {locale === "en"
                      ? "No notifications yet."
                      : locale === "ca"
                        ? "Encara no hi ha notificacions."
                        : "Todavía no hay notificaciones."}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
