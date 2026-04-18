import * as Ably from "ably";

declare global {
  var __movidaAblyClient: Ably.Realtime | undefined;
  var __movidaAblyClientToken: string | undefined;
}

export function getAblyClient(token: string) {
  if (typeof window === "undefined") {
    throw new Error("Ably solo puede inicializarse en el navegador.");
  }

  if (globalThis.__movidaAblyClient && globalThis.__movidaAblyClientToken !== token) {
    globalThis.__movidaAblyClient.close();
    globalThis.__movidaAblyClient = undefined;
    globalThis.__movidaAblyClientToken = undefined;
  }

  if (!globalThis.__movidaAblyClient) {
    globalThis.__movidaAblyClient = new Ably.Realtime({
      token,
      autoConnect: typeof window !== "undefined",
      echoMessages: true,
    });
    globalThis.__movidaAblyClientToken = token;
  }

  return globalThis.__movidaAblyClient;
}
