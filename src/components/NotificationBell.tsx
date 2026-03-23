"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getNotificationItems } from "@/lib/notifications";
import type { Locale } from "@/lib/i18n-shared";
import styles from "./NotificationBell.module.css";

type NotificationBellProps = {
  locale: Locale;
  iconSrc?: string;
};

export default function NotificationBell({
  locale,
  iconSrc = "/assets/figma/admin-menu-bell.svg",
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const items = getNotificationItems(locale);
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

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen((value) => !value)}
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
              <span className={styles.badge}>22</span>
            </div>
            <Link href="/dashboard#notificaciones" className={styles.viewAll} onClick={() => setOpen(false)}>
              {t.viewAll}
            </Link>
          </div>

          <div className={styles.list}>
            {items.map((item) => (
              <div key={`${item.actor ?? "system"}-${item.message}`} className={styles.item}>
                <span className={styles.itemDot} />
                <p>
                  {item.actor ? <strong>{item.actor}</strong> : null}
                  {item.actor ? " " : null}
                  <span>{item.message}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
