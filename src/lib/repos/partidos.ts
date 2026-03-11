import { mockOtrosPartidosLive, mockPartidoLive } from "../mock";
import type { PartidoDirecto, PartidoEstado } from "../types";

export function getLiveMatch(): PartidoDirecto {
  return mockPartidoLive;
}

export function getOtherLiveMatches(): PartidoDirecto[] {
  return mockOtrosPartidosLive;
}

export function getMatchesByStatus(status: PartidoEstado): PartidoDirecto[] {
  if (status === "LIVE") {
    return [mockPartidoLive, ...mockOtrosPartidosLive];
  }
  return [];
}
