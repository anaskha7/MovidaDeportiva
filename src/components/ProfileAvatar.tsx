"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_PROFILE_AVATAR_URL,
  PROFILE_AVATAR_STORAGE_KEY,
  PROFILE_AVATAR_UPDATED_EVENT,
  normalizeProfileAvatarUrl,
  sanitizeProfileAvatarUrl,
} from "@/lib/profile-avatar";

type ProfileAvatarProps = {
  alt: string;
  className?: string;
  fallbackSrc?: string;
  src?: string | null;
};

export default function ProfileAvatar({
  alt,
  className,
  fallbackSrc = DEFAULT_PROFILE_AVATAR_URL,
  src,
}: ProfileAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState(
    normalizeProfileAvatarUrl(src ?? fallbackSrc),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function applyAvatar(nextValue?: string | null) {
      const normalizedValue = normalizeProfileAvatarUrl(nextValue ?? fallbackSrc);
      setAvatarUrl(normalizedValue);

      if (nextValue && nextValue !== normalizedValue) {
        window.localStorage.setItem(PROFILE_AVATAR_STORAGE_KEY, normalizedValue);
      }
    }

    if (typeof src !== "undefined") {
      const persistedAvatar = sanitizeProfileAvatarUrl(src);

      if (persistedAvatar) {
        window.localStorage.setItem(PROFILE_AVATAR_STORAGE_KEY, persistedAvatar);
        applyAvatar(persistedAvatar);
      } else {
        const savedAvatar = sanitizeProfileAvatarUrl(
          window.localStorage.getItem(PROFILE_AVATAR_STORAGE_KEY),
        );

        if (savedAvatar) {
          applyAvatar(savedAvatar);
        } else {
          window.localStorage.removeItem(PROFILE_AVATAR_STORAGE_KEY);
          applyAvatar(null);
        }
      }
    } else {
      applyAvatar(window.localStorage.getItem(PROFILE_AVATAR_STORAGE_KEY));
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === PROFILE_AVATAR_STORAGE_KEY) {
        applyAvatar(event.newValue);
      }
    }

    function handleAvatarUpdated(event: Event) {
      const customEvent = event as CustomEvent<string>;
      applyAvatar(customEvent.detail);
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(PROFILE_AVATAR_UPDATED_EVENT, handleAvatarUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(PROFILE_AVATAR_UPDATED_EVENT, handleAvatarUpdated);
    };
  }, [fallbackSrc, src]);

  return <img src={avatarUrl} alt={alt} className={className} />;
}
