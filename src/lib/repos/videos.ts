import { mockVideos } from "../mock";
import type { VideoGuardado } from "../types";

export interface VideoFilters {
  deporte?: string;
  deportes?: string[];
  categoria?: string;
  federacion?: string;
  genero?: string;
  query?: string;
}

export interface VideoPageResult {
  items: VideoGuardado[];
  total: number;
  page: number;
  pageSize: number;
}

export function getVideos(
  filters: VideoFilters = {},
  page = 1,
  pageSize = 6
): VideoPageResult {
  const normalizedQuery = filters.query?.trim().toLowerCase();

  const filtered = mockVideos.filter((video) => {
    if (filters.deporte && video.deporte !== filters.deporte) return false;
    if (filters.deportes && (!video.deporte || !filters.deportes.includes(video.deporte))) {
      return false;
    }
    if (filters.categoria && video.categoria !== filters.categoria) return false;
    if (filters.federacion && video.federacion !== filters.federacion) return false;
    if (filters.genero && video.genero !== filters.genero) return false;
    if (
      normalizedQuery &&
      !`${video.title} ${video.subtitle}`.toLowerCase().includes(normalizedQuery)
    ) {
      return false;
    }
    return true;
  });

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total: filtered.length,
    page,
    pageSize,
  };
}
