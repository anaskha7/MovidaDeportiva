import { mockCategorias, mockDeportes, mockFederaciones } from "../mock";
import type { Categoria, Deporte, Federacion } from "../types";

export function getCategorias(): Categoria[] {
  return mockCategorias;
}

export function getDeportes(): Deporte[] {
  return mockDeportes;
}

export function getFederaciones(): Federacion[] {
  return mockFederaciones;
}
