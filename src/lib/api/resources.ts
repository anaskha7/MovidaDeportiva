import { hash } from "bcrypt";
import { z } from "zod";

const positiveInt = z.coerce.number().int().positive();

function requiredText(max: number) {
  return z.string().trim().min(1).max(max);
}

const roleCreateSchema = z.object({
  rol: requiredText(20),
});

const tipoCreateSchema = z.object({
  tipo: requiredText(20),
});

const estadoCreateSchema = z.object({
  estado: requiredText(30),
});

const generoCreateSchema = z.object({
  nombre: requiredText(20),
});

const deporteCreateSchema = z.object({
  nombre_deporte: requiredText(50),
  descripcion: z.string().trim().max(234).optional().nullable(),
});

const directoCreateSchema = z.object({
  nombre_directo: z.string().trim().max(80).optional().nullable(),
  descripcion: z.string().trim().max(160).optional().nullable(),
  fecha_programada: z.coerce.date().optional().nullable(),
  url_streaming: requiredText(255),
  estado: requiredText(20),
});

const usuarioCreateSchema = z.object({
  nombre: requiredText(80),
  email: z.string().trim().min(1).max(255).email(),
  password: z.string().min(8).max(72),
  fecha_registro: z.coerce.date().optional(),
  admin: positiveInt,
});

const usuarioUpdateSchema = z.object({
  nombre: requiredText(80).optional(),
  email: z.string().trim().min(1).max(255).email().optional(),
  password: z.string().min(8).max(72).optional(),
  fecha_registro: z.coerce.date().optional(),
  admin: positiveInt.optional(),
  bloqueado: z.boolean().optional(),
});

const federacionCreateSchema = z.object({
  nombre_federacion: requiredText(20),
  genero_federacion: requiredText(20),
  id_deporte: positiveInt,
});

const equipoCreateSchema = z.object({
  nombre_equipo: requiredText(30),
  id_deporte: positiveInt,
  id_federacion: positiveInt,
  id_genero: positiveInt,
});

const competicionCreateSchema = z.object({
  nombre_competicion: requiredText(80),
  tipo_competicion: requiredText(20),
  temporada: requiredText(20),
  id_deporte: positiveInt,
  id_federacion: positiveInt,
  id_genero: positiveInt,
  categoria_edad: z.string().trim().max(30).optional().nullable(),
  ambito: z.string().trim().max(20).optional().nullable(),
});

const partidoCreateSchema = z.object({
  id_competicion: positiveInt,
  id_equipo_local: positiveInt.optional().nullable(),
  id_equipo_visitante: positiveInt.optional().nullable(),
  equipo_local_nombre: requiredText(60),
  equipo_visitante_nombre: requiredText(60),
  fecha_partido: z.coerce.date(),
  jornada: z.string().trim().max(20).optional().nullable(),
  grupo: z.string().trim().max(30).optional().nullable(),
  destacado: z.boolean().optional(),
  emitido: z.boolean().optional(),
});

const solicitudServicioCreateSchema = z.object({
  id_usuario: positiveInt.optional().nullable(),
  nombre_contacto: requiredText(80),
  email_contacto: z.string().trim().min(1).max(255).email(),
  servicios: requiredText(255),
  fecha_servicio: z.coerce.date(),
  horas_servicio: z.coerce.number().int().min(1).max(24),
  detalles: z.string().trim().max(500).optional().nullable(),
  extras: z.string().trim().max(255).optional().nullable(),
  total_estimado: z.coerce.number().nonnegative(),
  estado: z.string().trim().max(20).optional(),
});

const appNotificationCreateSchema = z.object({
  titulo: z.string().trim().max(80).optional().nullable(),
  mensaje: requiredText(255),
  tipo: z.string().trim().max(20).optional(),
  actor: z.string().trim().max(80).optional().nullable(),
  id_usuario_destino: positiveInt.optional().nullable(),
  rol_destino: z.string().trim().max(20).optional().nullable(),
  leida: z.boolean().optional(),
  enlace: z.string().trim().max(255).optional().nullable(),
  id_actor_usuario: positiveInt.optional().nullable(),
});

const suscripcionCreateSchema = z.object({
  id_usuario: positiveInt,
  plan: requiredText(40),
  estado: requiredText(20),
  fecha_inicio: z.coerce.date(),
  fecha_fin: z.coerce.date().optional().nullable(),
  fecha_renovacion: z.coerce.date().optional().nullable(),
});

const vodCreateSchema = z.object({
  id_partido: positiveInt.optional().nullable(),
  cloudflare_id: requiredText(120),
  duracion_segundos: z.coerce.number().int().min(0).optional().nullable(),
  estado: requiredText(20),
});

const auditLogCreateSchema = z.object({
  accion: requiredText(40),
  entidad: requiredText(40),
  entidad_id: z.coerce.number().int().positive().optional().nullable(),
  descripcion: requiredText(255),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  id_usuario_actor: positiveInt.optional().nullable(),
});

const materialBaseSchema = z.object({
  fecha_inicio: z.coerce.date(),
  fecha_fin: z.coerce.date(),
  id_usuario: positiveInt,
  id_tipo: positiveInt,
  id_estado: positiveInt,
});

const materialCreateSchema = materialBaseSchema.refine(
  (data) => data.fecha_fin >= data.fecha_inicio,
  {
    message: "fecha_fin no puede ser anterior a fecha_inicio.",
    path: ["fecha_fin"],
  },
);

const materialUpdateSchema = materialBaseSchema.partial().refine(
  (data) => {
    if (!data.fecha_inicio || !data.fecha_fin) {
      return true;
    }

    return data.fecha_fin >= data.fecha_inicio;
  },
  {
    message: "fecha_fin no puede ser anterior a fecha_inicio.",
    path: ["fecha_fin"],
  },
);

const comentarioCreateSchema = z.object({
  fecha_publicacion: z.coerce.date().optional(),
  minuto_video: requiredText(20),
  contenido: requiredText(50),
  id_directo: positiveInt,
  id_usuario: positiveInt,
});

const usuarioSelect = {
  id_usuario: true,
  nombre: true,
  email: true,
  fecha_registro: true,
  admin: true,
  bloqueado: true,
  role: {
    select: {
      rol: true,
    },
  },
} as const;

const directoSelect = {
  id_directo: true,
  nombre_directo: true,
  descripcion: true,
  url_streaming: true,
  estado: true,
  fecha_programada: true,
} as const;

const solicitudServicioSelect = {
  id_solicitud: true,
  nombre_contacto: true,
  email_contacto: true,
  servicios: true,
  fecha_servicio: true,
  horas_servicio: true,
  detalles: true,
  extras: true,
  total_estimado: true,
  estado: true,
  fecha_creacion: true,
  usuario: {
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
    },
  },
} as const;

const appNotificationSelect = {
  id_notificacion: true,
  titulo: true,
  mensaje: true,
  tipo: true,
  actor: true,
  id_usuario_destino: true,
  rol_destino: true,
  leida: true,
  enlace: true,
  fecha_creacion: true,
  actor_usuario: {
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
    },
  },
  usuario_destino: {
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
    },
  },
} as const;

const auditLogSelect = {
  id_log: true,
  accion: true,
  entidad: true,
  entidad_id: true,
  descripcion: true,
  metadata: true,
  fecha_creacion: true,
  actor: {
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
    },
  },
} as const;

const suscripcionSelect = {
  id_suscripcion: true,
  id_usuario: true,
  plan: true,
  estado: true,
  fecha_inicio: true,
  fecha_fin: true,
  fecha_renovacion: true,
  usuario: {
    select: {
      id_usuario: true,
      nombre: true,
      email: true,
    },
  },
} as const;

const vodSelect = {
  id_vod: true,
  id_partido: true,
  cloudflare_id: true,
  duracion_segundos: true,
  estado: true,
  partido: {
    select: {
      id_partido: true,
      equipo_local_nombre: true,
      equipo_visitante_nombre: true,
      fecha_partido: true,
    },
  },
} as const;

export interface ResourceConfig {
  resource: string;
  label: string;
  delegate: string;
  idField: string;
  description?: string;
  fields: string[];
  createSchema: z.ZodTypeAny;
  updateSchema: z.ZodTypeAny;
  select?: Record<string, unknown>;
  notes?: string[];
  exampleCreateBody?: Record<string, unknown>;
  exampleUpdateBody?: Record<string, unknown>;
  transformCreate?: (
    data: Record<string, unknown>,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;
  transformUpdate?: (
    data: Record<string, unknown>,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;
}

export const RESOURCE_CONFIGS: Record<string, ResourceConfig> = {
  roles: {
    resource: "roles",
    label: "Roles",
    delegate: "role",
    idField: "admin",
    description: "Catálogo de roles disponibles dentro de la aplicación.",
    fields: ["rol"],
    createSchema: roleCreateSchema,
    updateSchema: roleCreateSchema.partial(),
    exampleCreateBody: {
      rol: "editor",
    },
    exampleUpdateBody: {
      rol: "moderador",
    },
  },
  tipos: {
    resource: "tipos",
    label: "Tipos",
    delegate: "tipo",
    idField: "id_tipo",
    description: "Tipos de material o recurso gestionados en la plataforma.",
    fields: ["tipo"],
    createSchema: tipoCreateSchema,
    updateSchema: tipoCreateSchema.partial(),
    exampleCreateBody: {
      tipo: "camara",
    },
    exampleUpdateBody: {
      tipo: "microfono",
    },
  },
  estados: {
    resource: "estados",
    label: "Estados",
    delegate: "estado",
    idField: "id_estado",
    description: "Estados posibles para materiales y otros registros.",
    fields: ["estado"],
    createSchema: estadoCreateSchema,
    updateSchema: estadoCreateSchema.partial(),
    exampleCreateBody: {
      estado: "disponible",
    },
    exampleUpdateBody: {
      estado: "ocupado",
    },
  },
  generos: {
    resource: "generos",
    label: "Géneros",
    delegate: "genero",
    idField: "id_genero",
    description: "Géneros deportivos usados en equipos y competiciones.",
    fields: ["nombre"],
    createSchema: generoCreateSchema,
    updateSchema: generoCreateSchema.partial(),
    exampleCreateBody: {
      nombre: "masculino",
    },
    exampleUpdateBody: {
      nombre: "femenino",
    },
  },
  deportes: {
    resource: "deportes",
    label: "Deportes",
    delegate: "deporte",
    idField: "id_deporte",
    description: "Deportes principales disponibles en la plataforma.",
    fields: ["nombre_deporte", "descripcion"],
    createSchema: deporteCreateSchema,
    updateSchema: deporteCreateSchema.partial(),
    exampleCreateBody: {
      nombre_deporte: "Futbol",
      descripcion: "Partidos y contenidos audiovisuales de futbol.",
    },
    exampleUpdateBody: {
      descripcion: "Cobertura en directo y bajo demanda.",
    },
  },
  directos: {
    resource: "directos",
    label: "Directos",
    delegate: "directo",
    idField: "id_directo",
    description: "Emisiones en directo y sus URLs de streaming.",
    fields: [
      "nombre_directo",
      "descripcion",
      "fecha_programada",
      "url_streaming",
      "estado",
    ],
    createSchema: directoCreateSchema,
    updateSchema: directoCreateSchema.partial(),
    select: directoSelect,
    exampleCreateBody: {
      nombre_directo: "Previa Jornada 28",
      descripcion: "Señal principal para la retransmisión del fin de semana.",
      fecha_programada: "2026-03-29T16:30:00.000Z",
      url_streaming: "https://stream.movida.tv/directo-1",
      estado: "programado",
    },
    exampleUpdateBody: {
      estado: "finalizado",
    },
  },
  usuarios: {
    resource: "usuarios",
    label: "Usuarios",
    delegate: "usuario",
    idField: "id_usuario",
    description: "Usuarios registrados con rol y fecha de alta.",
    fields: [
      "nombre",
      "email",
      "password",
      "fecha_registro",
      "admin",
      "bloqueado",
    ],
    createSchema: usuarioCreateSchema,
    updateSchema: usuarioUpdateSchema,
    select: usuarioSelect,
    notes: [
      "El campo password nunca se devuelve en las respuestas.",
      "Si envías password en POST, PUT o PATCH se guarda hasheado con bcrypt.",
    ],
    exampleCreateBody: {
      nombre: "Cliente Demo",
      email: "cliente@movida.tv",
      password: "Cliente123!",
      admin: 4,
    },
    exampleUpdateBody: {
      nombre: "Cliente Premium",
      admin: 5,
      bloqueado: false,
    },
    async transformCreate(data) {
      return {
        ...data,
        fecha_registro:
          data.fecha_registro instanceof Date ? data.fecha_registro : new Date(),
        password: await hash(String(data.password), 10),
      };
    },
    async transformUpdate(data) {
      const nextData = { ...data };

      if (nextData.password) {
        nextData.password = await hash(String(nextData.password), 10);
      }

      return nextData;
    },
  },
  federaciones: {
    resource: "federaciones",
    label: "Federaciones",
    delegate: "federacion",
    idField: "id_federacion",
    description: "Federaciones deportivas vinculadas a cada deporte.",
    fields: ["nombre_federacion", "genero_federacion", "id_deporte"],
    createSchema: federacionCreateSchema,
    updateSchema: federacionCreateSchema.partial(),
    exampleCreateBody: {
      nombre_federacion: "RFEF",
      genero_federacion: "masculino",
      id_deporte: 1,
    },
    exampleUpdateBody: {
      genero_federacion: "mixto",
    },
  },
  equipos: {
    resource: "equipos",
    label: "Equipos",
    delegate: "equipo",
    idField: "id_equipo",
    description: "Equipos deportivos relacionados con deporte, federación y género.",
    fields: ["nombre_equipo", "id_deporte", "id_federacion", "id_genero"],
    createSchema: equipoCreateSchema,
    updateSchema: equipoCreateSchema.partial(),
    exampleCreateBody: {
      nombre_equipo: "Movida FC",
      id_deporte: 1,
      id_federacion: 1,
      id_genero: 1,
    },
    exampleUpdateBody: {
      nombre_equipo: "Movida FC A",
    },
  },
  competiciones: {
    resource: "competiciones",
    label: "Competiciones",
    delegate: "competicion",
    idField: "id_competicion",
    description: "Ligas, copas y torneos gestionados para cada federación y temporada.",
    fields: [
      "nombre_competicion",
      "tipo_competicion",
      "temporada",
      "id_deporte",
      "id_federacion",
      "id_genero",
      "categoria_edad",
      "ambito",
    ],
    createSchema: competicionCreateSchema,
    updateSchema: competicionCreateSchema.partial(),
    exampleCreateBody: {
      nombre_competicion: "Tercera Federacion",
      tipo_competicion: "liga",
      temporada: "2025/2026",
      id_deporte: 1,
      id_federacion: 1,
      id_genero: 1,
      categoria_edad: "senior",
      ambito: "nacional",
    },
    exampleUpdateBody: {
      ambito: "territorial",
    },
  },
  partidos: {
    resource: "partidos",
    label: "Partidos",
    delegate: "partido",
    idField: "id_partido",
    description: "Partidos programados o emitidos, con soporte para equipos normalizados o solo nombres libres.",
    fields: [
      "id_competicion",
      "id_equipo_local",
      "id_equipo_visitante",
      "equipo_local_nombre",
      "equipo_visitante_nombre",
      "fecha_partido",
      "jornada",
      "grupo",
      "destacado",
      "emitido",
    ],
    createSchema: partidoCreateSchema,
    updateSchema: partidoCreateSchema.partial(),
    notes: [
      "Los nombres de los equipos son obligatorios aunque no uses todavía la tabla equipos.",
      "id_equipo_local e id_equipo_visitante son opcionales para no bloquear la carga inicial de partidos.",
    ],
    exampleCreateBody: {
      id_competicion: 1,
      equipo_local_nombre: "Movida FC",
      equipo_visitante_nombre: "Atleti Costa",
      fecha_partido: "2026-03-29T11:30:00.000Z",
      jornada: "24",
      grupo: "Grupo V",
      destacado: true,
      emitido: false,
    },
    exampleUpdateBody: {
      emitido: true,
      id_equipo_local: 1,
      id_equipo_visitante: 2,
    },
  },
  solicitudes_servicio: {
    resource: "solicitudes_servicio",
    label: "Solicitudes de servicio",
    delegate: "solicitudServicio",
    idField: "id_solicitud",
    description: "Solicitudes comerciales enviadas desde la plataforma para contratar servicios.",
    fields: [
      "id_usuario",
      "nombre_contacto",
      "email_contacto",
      "servicios",
      "fecha_servicio",
      "horas_servicio",
      "detalles",
      "extras",
      "total_estimado",
      "estado",
    ],
    createSchema: solicitudServicioCreateSchema,
    updateSchema: solicitudServicioCreateSchema.partial(),
    select: solicitudServicioSelect,
    exampleCreateBody: {
      id_usuario: 2,
      nombre_contacto: "Club Demo",
      email_contacto: "club@demo.com",
      servicios: "Retransmisión para tu plataforma, Retransmisión en MDTV",
      fecha_servicio: "2026-03-29",
      horas_servicio: 3,
      detalles: "Cobertura completa del partido principal del fin de semana.",
      extras: "Zona mixta y entrevistas, Clips para redes sociales",
      total_estimado: 144.97,
      estado: "pendiente",
    },
    exampleUpdateBody: {
      estado: "confirmada",
    },
    transformCreate(data) {
      return {
        ...data,
        estado: data.estado ?? "pendiente",
      };
    },
  },
  app_notifications: {
    resource: "app_notifications",
    label: "Notificaciones",
    delegate: "appNotification",
    idField: "id_notificacion",
    description: "Notificaciones internas para usuarios, admins o avisos generales.",
    fields: [
      "titulo",
      "mensaje",
      "tipo",
      "actor",
      "id_usuario_destino",
      "rol_destino",
      "leida",
      "enlace",
      "id_actor_usuario",
    ],
    createSchema: appNotificationCreateSchema,
    updateSchema: appNotificationCreateSchema.partial(),
    select: appNotificationSelect,
    exampleCreateBody: {
      titulo: "Nueva solicitud",
      mensaje: "Se ha registrado una nueva solicitud de servicios para este fin de semana.",
      tipo: "info",
      rol_destino: "admin",
      enlace: "/admin/panel",
      id_actor_usuario: 1,
    },
    exampleUpdateBody: {
      leida: true,
    },
    transformCreate(data) {
      return {
        ...data,
        tipo: data.tipo ?? "info",
        leida: data.leida ?? false,
      };
    },
  },
  audit_logs: {
    resource: "audit_logs",
    label: "Logs de auditoría",
    delegate: "auditLog",
    idField: "id_log",
    description: "Trazas básicas de acciones realizadas desde administración.",
    fields: [
      "accion",
      "entidad",
      "entidad_id",
      "descripcion",
      "metadata",
      "id_usuario_actor",
    ],
    createSchema: auditLogCreateSchema,
    updateSchema: auditLogCreateSchema.partial(),
    select: auditLogSelect,
    exampleCreateBody: {
      accion: "crear",
      entidad: "directo",
      entidad_id: 1,
      descripcion: "El administrador creó un nuevo directo programado.",
      metadata: {
        estado: "programado",
      },
      id_usuario_actor: 1,
    },
    exampleUpdateBody: {
      descripcion: "Ajuste manual del log de auditoría.",
    },
  },
  suscripciones: {
    resource: "suscripciones",
    label: "Suscripciones",
    delegate: "suscripcion",
    idField: "id_suscripcion",
    description: "Planes contratados por usuario, con fechas de inicio, fin y renovación.",
    fields: ["id_usuario", "plan", "estado", "fecha_inicio", "fecha_fin", "fecha_renovacion"],
    createSchema: suscripcionCreateSchema,
    updateSchema: suscripcionCreateSchema.partial(),
    select: suscripcionSelect,
    exampleCreateBody: {
      id_usuario: 3,
      plan: "premium",
      estado: "activa",
      fecha_inicio: "2026-04-20T00:00:00.000Z",
      fecha_renovacion: "2026-05-20T00:00:00.000Z",
    },
    exampleUpdateBody: {
      estado: "cancelada",
      fecha_fin: "2026-05-20T00:00:00.000Z",
    },
  },
  vods: {
    resource: "vods",
    label: "VODs",
    delegate: "vod",
    idField: "id_vod",
    description: "Vídeos bajo demanda vinculados a Cloudflare y, opcionalmente, a un partido.",
    fields: ["id_partido", "cloudflare_id", "duracion_segundos", "estado"],
    createSchema: vodCreateSchema,
    updateSchema: vodCreateSchema.partial(),
    select: vodSelect,
    exampleCreateBody: {
      id_partido: 1,
      cloudflare_id: "8c9e2a7b-demo-vod-id",
      duracion_segundos: 5820,
      estado: "publicado",
    },
    exampleUpdateBody: {
      estado: "procesando",
    },
  },
  materiales: {
    resource: "materiales",
    label: "Materiales",
    delegate: "material",
    idField: "id_material",
    description: "Material técnico reservado o utilizado en producciones.",
    fields: ["fecha_inicio", "fecha_fin", "id_usuario", "id_tipo", "id_estado"],
    createSchema: materialCreateSchema,
    updateSchema: materialUpdateSchema,
    exampleCreateBody: {
      fecha_inicio: "2026-03-24T10:00:00.000Z",
      fecha_fin: "2026-03-24T14:00:00.000Z",
      id_usuario: 1,
      id_tipo: 1,
      id_estado: 1,
    },
    exampleUpdateBody: {
      id_estado: 2,
    },
  },
  comentarios: {
    resource: "comentarios",
    label: "Comentarios",
    delegate: "comentario",
    idField: "id_comentario",
    description: "Comentarios asociados a directos y usuarios.",
    fields: [
      "fecha_publicacion",
      "minuto_video",
      "contenido",
      "id_directo",
      "id_usuario",
    ],
    createSchema: comentarioCreateSchema,
    updateSchema: comentarioCreateSchema.partial(),
    exampleCreateBody: {
      fecha_publicacion: "2026-03-24",
      minuto_video: "67:12",
      contenido: "Golazo desde fuera del area",
      id_directo: 1,
      id_usuario: 1,
    },
    exampleUpdateBody: {
      contenido: "Golazo validado por el arbitro",
    },
    transformCreate(data) {
      return {
        ...data,
        fecha_publicacion:
          data.fecha_publicacion instanceof Date
            ? data.fecha_publicacion
            : new Date(),
      };
    },
  },
};

export function getResourceConfig(resource: string) {
  return RESOURCE_CONFIGS[resource] ?? null;
}

export function getResourceDocs(baseUrl: string) {
  return Object.values(RESOURCE_CONFIGS).map((config) => ({
    resource: config.resource,
    label: config.label,
    description: config.description ?? "",
    idField: config.idField,
    fields: config.fields,
    notes: config.notes ?? [],
    endpoints: {
      collection: `${baseUrl}/api/${config.resource}`,
      item: `${baseUrl}/api/${config.resource}/:${config.idField}`,
    },
    methods: {
      collection: ["GET", "POST"],
      item: ["GET", "PUT", "PATCH", "DELETE"],
    },
    examples: {
      list: `GET ${baseUrl}/api/${config.resource}?limit=10&offset=0`,
      item: `GET ${baseUrl}/api/${config.resource}/1`,
      create: {
        method: "POST",
        url: `${baseUrl}/api/${config.resource}`,
        body: config.exampleCreateBody ?? null,
      },
      update: {
        method: "PATCH",
        url: `${baseUrl}/api/${config.resource}/1`,
        body: config.exampleUpdateBody ?? null,
      },
      remove: `DELETE ${baseUrl}/api/${config.resource}/1`,
    },
  }));
}
