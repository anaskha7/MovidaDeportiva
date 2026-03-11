export type Rol = 'admin' | 'user' | 'suscriptor';

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Deporte {
  id: string;
  nombre: string;
  icono?: string;
}

export interface Federacion {
  id: string;
  nombre: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  abreviatura: string;
  escudoUrl?: string;
}

export type PartidoEstado = 'LIVE' | 'UPCOMING' | 'FINISHED';

export interface PartidoDirecto {
  id: string;
  home: Equipo;
  away: Equipo;
  competition: string;
  grupo: string;
  jornada: number;
  status: PartidoEstado;
  fechaISO: string;
  clock?: string;
  scoreHome?: number;
  scoreAway?: number;
  coverUrl: string;
  streamUrl?: string;
  vodUrl?: string;
  publicado?: boolean;
  deporte?: string;
  categoria?: string;
  federacion?: string;
  genero?: string;
}

export interface VideoGuardado {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  durationLabel: string;
  scoreLabel: string;
  thumbUrl: string;
  deporte?: string;
  categoria?: string;
  federacion?: string;
  genero?: string;
  publicado?: boolean;
  vodUrl?: string;
}

export interface ChatMessage {
  id: string;
  emoji: string;
  name: string;
  timeLabel: string;
  message: string;
  userRole?: Rol;
  isBanned?: boolean;
}
