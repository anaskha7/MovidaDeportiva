import { mockOtrosPartidosLive, mockPartidoLive } from "../mock";
import type { PartidoDirecto, PartidoEstado } from "../types";

const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000;

function isMatchCurrentlyLive(match: PartidoDirecto, now = new Date()) {
  if (match.status !== "LIVE") {
    return false;
  }

  const start = new Date(match.fechaISO);
  if (Number.isNaN(start.getTime())) {
    return false;
  }

  const end = new Date(start.getTime() + LIVE_WINDOW_MS);
  return now >= start && now <= end;
}

export function getLiveMatch(): PartidoDirecto {
  return mockPartidoLive;
}

export function getOtherLiveMatches(): PartidoDirecto[] {
  return mockOtrosPartidosLive;
}

export function getMatchesByStatus(status: PartidoEstado): PartidoDirecto[] {
  if (status === "LIVE") {
    return [mockPartidoLive, ...mockOtrosPartidosLive].filter((match) =>
      isMatchCurrentlyLive(match),
    );
  }
  return [];
}

export function hasActiveLiveMatch(now = new Date()) {
  return [mockPartidoLive, ...mockOtrosPartidosLive].some((match) =>
    isMatchCurrentlyLive(match, now),
  );
}
