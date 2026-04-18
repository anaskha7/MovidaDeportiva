import type { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const TRUSTED_DEVICE_COOKIE = "mdv_trusted_device_v2";
export const TRUSTED_DEVICE_MAX_AGE = 60 * 60 * 24 * 7;
const MAX_TRUSTED_ENTRIES = 6;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

type TrustedDeviceEntry = {
  userId: number;
  email: string;
  exp: number;
};

type TrustedDevicePayload = {
  v: 2;
  entries: TrustedDeviceEntry[];
};

function getTrustedDeviceSecret() {
  const secret =
    process.env.SESSION_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "movida-dev-session-secret"
      : null);

  if (!secret) {
    throw new Error("Falta SESSION_SECRET o NEXTAUTH_SECRET para firmar el dispositivo confiable.");
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

async function importTrustedDeviceKey() {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getTrustedDeviceSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signTrustedDevicePayload(payload: TrustedDevicePayload) {
  const payloadPart = toBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const key = await importTrustedDeviceKey();
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(payloadPart));
  return `${payloadPart}.${toBase64Url(new Uint8Array(signature))}`;
}

async function readTrustedDevicePayload(token: string | undefined): Promise<TrustedDevicePayload | null> {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart, ...rest] = token.split(".");
  if (!payloadPart || !signaturePart || rest.length > 0) {
    return null;
  }

  try {
    const key = await importTrustedDeviceKey();
    const verified = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signaturePart),
      textEncoder.encode(payloadPart),
    );

    if (!verified) {
      return null;
    }

    const parsed = JSON.parse(textDecoder.decode(fromBase64Url(payloadPart))) as Partial<TrustedDevicePayload>;
    if (parsed.v !== 2 || !Array.isArray(parsed.entries)) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const entries = parsed.entries.filter((entry): entry is TrustedDeviceEntry => {
      return (
        typeof entry?.userId === "number" &&
        Number.isInteger(entry.userId) &&
        typeof entry.email === "string" &&
        typeof entry.exp === "number" &&
        entry.exp > now
      );
    });

    return { v: 2, entries };
  } catch {
    return null;
  }
}

export async function hasTrustedDevice(
  request: NextRequest,
  input: { userId: number; email: string },
) {
  const payload = await readTrustedDevicePayload(
    request.cookies.get(TRUSTED_DEVICE_COOKIE)?.value,
  );

  if (!payload) {
    return false;
  }

  const normalizedEmail = input.email.toLowerCase();
  return payload.entries.some(
    (entry) => entry.userId === input.userId && entry.email.toLowerCase() === normalizedEmail,
  );
}

export async function applyTrustedDeviceToResponse(
  request: NextRequest,
  response: NextResponse,
  input: { userId: number; email: string },
) {
  const payload =
    (await readTrustedDevicePayload(request.cookies.get(TRUSTED_DEVICE_COOKIE)?.value)) ??
    { v: 2 as const, entries: [] };
  const normalizedEmail = input.email.toLowerCase();
  const nextExp = Math.floor(Date.now() / 1000) + TRUSTED_DEVICE_MAX_AGE;

  const filteredEntries = payload.entries.filter(
    (entry) => !(entry.userId === input.userId && entry.email.toLowerCase() === normalizedEmail),
  );

  const nextPayload: TrustedDevicePayload = {
    v: 2,
    entries: [
      { userId: input.userId, email: normalizedEmail, exp: nextExp },
      ...filteredEntries,
    ].slice(0, MAX_TRUSTED_ENTRIES),
  };

  const token = await signTrustedDevicePayload(nextPayload);
  response.cookies.set(TRUSTED_DEVICE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TRUSTED_DEVICE_MAX_AGE,
  });

  return response;
}
