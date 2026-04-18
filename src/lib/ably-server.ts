import * as Ably from "ably";
import type { SessionData } from "@/lib/session";
import { buildLiveChatClientId, getLiveChatCapability } from "@/lib/live-chat";

function normalizeAblyApiKey(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function getAblyRestClient() {
  const apiKey = normalizeAblyApiKey(process.env.ABLY_API_KEY);

  if (!apiKey) {
    throw new Error("ABLY_API_KEY no está configurada en el entorno.");
  }

  return new Ably.Rest({
    key: apiKey,
    queryTime: true,
  });
}

function getLiveChatTokenParams(session: SessionData) {
  return {
    capability: getLiveChatCapability(),
    clientId: buildLiveChatClientId(session),
    ttl: 6 * 60 * 60 * 1000,
  };
}

export async function createLiveChatTokenRequest(session: SessionData) {
  const client = getAblyRestClient();
  return client.auth.createTokenRequest(getLiveChatTokenParams(session));
}

export async function createLiveChatToken(session: SessionData) {
  const client = getAblyRestClient();
  const tokenDetails = await client.auth.requestToken(getLiveChatTokenParams(session));
  return tokenDetails.token;
}
