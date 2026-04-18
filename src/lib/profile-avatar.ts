export const DEFAULT_PROFILE_AVATAR_URL = "/assets/figma/user-avatar-default.svg";
export const LEGACY_PROFILE_AVATAR_URL = "/assets/figma/dashboard-user.png";
export const PROFILE_AVATAR_STORAGE_KEY = "mdv_profile_avatar";
export const PROFILE_AVATAR_UPDATED_EVENT = "mdv-profile-avatar-updated";
export const PROFILE_AVATAR_MAX_LENGTH = 1_000_000;

export function sanitizeProfileAvatarUrl(value?: string | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (
    !trimmed ||
    trimmed === DEFAULT_PROFILE_AVATAR_URL ||
    trimmed === LEGACY_PROFILE_AVATAR_URL
  ) {
    return null;
  }

  if (trimmed.length > PROFILE_AVATAR_MAX_LENGTH) {
    return null;
  }

  if (
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  ) {
    return trimmed;
  }

  return null;
}

export function normalizeProfileAvatarUrl(value?: string | null) {
  return sanitizeProfileAvatarUrl(value) ?? DEFAULT_PROFILE_AVATAR_URL;
}

export function emitProfileAvatarUpdated(value: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<string>(PROFILE_AVATAR_UPDATED_EVENT, {
      detail: value,
    }),
  );
}
