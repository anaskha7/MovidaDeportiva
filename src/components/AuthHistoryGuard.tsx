"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PROTECTED_PREFIXES = ["/app", "/videos", "/directo", "/dashboard", "/admin", "/administracion"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function AuthHistoryGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !isProtectedPath(pathname)) {
      return;
    }

    let active = true;

    const validateSession = async () => {
      try {
        const response = await fetch("/api/session", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!active) {
          return;
        }

        if (!response.ok) {
          window.location.replace("/login?error=auth");
        }
      } catch {
        if (active) {
          window.location.replace("/login?error=auth");
        }
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      const navigationEntry = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;

      const fromHistory = event.persisted || navigationEntry?.type === "back_forward";

      if (fromHistory) {
        void validateSession();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      active = false;
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [pathname]);

  return null;
}
