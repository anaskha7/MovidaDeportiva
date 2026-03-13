"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n-shared";
import styles from "./LanguageSwitcher.module.css";

const options: Array<{ value: Locale; label: string }> = [
  { value: "es", label: "ES" },
  { value: "ca", label: "CA" },
  { value: "en", label: "EN" },
];

export default function LanguageSwitcher({
  locale,
  compact = false,
}: {
  locale: Locale;
  compact?: boolean;
}) {
  const router = useRouter();

  return (
    <div className={`${styles.switcher} ${compact ? styles.compact : ""}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.option} ${locale === option.value ? styles.active : ""}`}
          onClick={() => {
            document.cookie = `${LOCALE_COOKIE}=${option.value}; path=/; max-age=31536000; samesite=lax`;
            router.refresh();
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
