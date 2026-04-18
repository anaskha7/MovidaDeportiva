import type { Locale } from "./i18n-shared";
import type { ChatMessage, Rol } from "./types";

type LiveChatIdentity = {
  email?: string | null;
  name: string;
  role?: Rol | null;
  userId?: number | null;
};

export type LiveChatPayload = {
  emoji?: string | null;
  name: string;
  role?: Rol | null;
  avatarUrl?: string | null;
  text: string;
};

export type LiveChatUiMessage = ChatMessage & {
  timestamp: number;
};

export const LIVE_CHAT_CHANNEL_PREFIX = "live-chat:";
export const LIVE_CHAT_EVENT = "chat-message";
export const LIVE_CHAT_HISTORY_LIMIT = 80;
export const LIVE_CHAT_MESSAGE_MAX_LENGTH = 280;

const CHAT_TIME_LOCALE: Record<Locale, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-GB",
};

export function getLiveChatChannelName(matchId: string) {
  return `${LIVE_CHAT_CHANNEL_PREFIX}${matchId}`;
}

export function getLiveChatCapability() {
  return JSON.stringify({
    [`${LIVE_CHAT_CHANNEL_PREFIX}*`]: ["publish", "subscribe", "history"],
  });
}

export function buildLiveChatClientId(identity: LiveChatIdentity) {
  if (identity.userId && Number.isInteger(identity.userId)) {
    return `user-${identity.userId}`;
  }

  if (identity.email) {
    return `email-${toClientSafeFragment(identity.email)}`;
  }

  return `${identity.role ?? "viewer"}-${toClientSafeFragment(identity.name)}`;
}

export function sanitizeLiveChatText(value: string) {
  return value.trim().slice(0, LIVE_CHAT_MESSAGE_MAX_LENGTH);
}

export function buildLiveChatPayload(
  identity: Pick<LiveChatIdentity, "name" | "role"> & { avatarUrl?: string | null },
  text: string,
): LiveChatPayload | null {
  const trimmed = sanitizeLiveChatText(text);

  if (!trimmed) {
    return null;
  }

  return {
    emoji: getRoleEmoji(identity.role ?? null),
    name: normalizeDisplayName(identity.name),
    role: identity.role ?? null,
    avatarUrl: sanitizeAvatarUrl(identity.avatarUrl),
    text: trimmed,
  };
}

export function mapLiveChatPayloadToUiMessage(
  payload: unknown,
  locale: Locale,
  messageId?: string,
  timestamp?: number,
): LiveChatUiMessage | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Partial<LiveChatPayload>;
  const text = sanitizeLiveChatText(typeof candidate.text === "string" ? candidate.text : "");

  if (!text) {
    return null;
  }

  const safeTimestamp = typeof timestamp === "number" ? timestamp : Date.now();
  const role = isRol(candidate.role) ? candidate.role : undefined;
  const normalizedName = normalizeDisplayName(
    typeof candidate.name === "string" ? candidate.name : "Usuario",
  );

  return {
    id: messageId ?? `${safeTimestamp}-${normalizedName}`,
    emoji:
      typeof candidate.emoji === "string" && candidate.emoji.trim()
        ? candidate.emoji.trim()
        : getRoleEmoji(role ?? null),
    message: text,
    name: normalizedName,
    timeLabel: new Intl.DateTimeFormat(CHAT_TIME_LOCALE[locale], {
      hour: "2-digit",
      minute: "2-digit",
    }).format(safeTimestamp),
    timestamp: safeTimestamp,
    avatarUrl: sanitizeAvatarUrl(candidate.avatarUrl),
    userRole: role,
  };
}

function getRoleEmoji(role: Rol | null) {
  if (role === "admin") return "📣";
  if (role === "suscriptor") return "⭐";
  return "💬";
}

function normalizeDisplayName(value: string) {
  const collapsed = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");

  return collapsed || "Usuario";
}

function toClientSafeFragment(value: string) {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || "viewer";
}

function isRol(value: unknown): value is Rol {
  return value === "admin" || value === "user" || value === "suscriptor";
}

function sanitizeAvatarUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
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
