import { mockMensajes } from "../mock";
import type { ChatMessage } from "../types";

export function getChatMessagesByMatchId(_matchId: string): ChatMessage[] {
  return mockMensajes;
}
