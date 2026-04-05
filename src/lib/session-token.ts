import {
  SESSION_MAX_AGE,
} from "./session-cookies";
import type { Rol } from "./types";

export interface SessionData {
  role: Rol;
  name: string;
  userId: number | null;
  email: string | null;
}

type SessionTokenPayload = {
  v: 1;
  role: Rol;
  name: string;
  userId: number | null;
  email: string | null;
  exp: number;
};

const SESSION_ROLES: readonly Rol[] = ["admin", "user", "suscriptor"];
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function formatUserName(name: string | null | undefined): string {
  if (!name) return "Usuario";

  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function isRol(value: string): value is Rol {
  return SESSION_ROLES.includes(value as Rol);
}

function getSessionSecret() {
  const secret =
    process.env.SESSION_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "movida-dev-session-secret"
      : null);

  if (!secret) {
    throw new Error("Falta SESSION_SECRET o NEXTAUTH_SECRET para firmar la sesión.");
  }

  return secret;
}

function toBase64(bytes: Uint8Array) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function fromBase64(value: string) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }

  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function toBase64Url(value: Uint8Array) {
  return toBase64(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return fromBase64(`${normalized}${padding}`);
}

async function importSessionKey() {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function normalizeSessionData(data: SessionData) {
  return {
    role: data.role,
    name: formatUserName(data.name),
    userId: Number.isInteger(data.userId) ? data.userId : null,
    email: data.email ?? null,
  } satisfies Omit<SessionTokenPayload, "v" | "exp">;
}

export async function createSessionToken(data: SessionData) {
  const payload: SessionTokenPayload = {
    v: 1,
    ...normalizeSessionData(data),
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const payloadBytes = textEncoder.encode(JSON.stringify(payload));
  const payloadPart = toBase64Url(payloadBytes);
  const key = await importSessionKey();
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(payloadPart));
  return `${payloadPart}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | null | undefined): Promise<SessionData | null> {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart, ...rest] = token.split(".");

  if (!payloadPart || !signaturePart || rest.length > 0) {
    return null;
  }

  try {
    const key = await importSessionKey();
    const verified = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signaturePart),
      textEncoder.encode(payloadPart),
    );

    if (!verified) {
      return null;
    }

    const parsed = JSON.parse(textDecoder.decode(fromBase64Url(payloadPart))) as Partial<SessionTokenPayload>;

    if (
      parsed.v !== 1 ||
      typeof parsed.role !== "string" ||
      !isRol(parsed.role) ||
      typeof parsed.name !== "string" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }

    if (parsed.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    const parsedUserId =
      typeof parsed.userId === "number" && Number.isInteger(parsed.userId)
        ? parsed.userId
        : null;
    const parsedEmail = typeof parsed.email === "string" ? parsed.email : null;

    return {
      role: parsed.role,
      name: formatUserName(parsed.name),
      userId: parsedUserId,
      email: parsedEmail,
    };
  } catch {
    return null;
  }
}

export async function getSessionFromCookieValue(cookieValue: string | undefined) {
  return verifySessionToken(cookieValue ?? null);
}
