import type { Prisma } from "@prisma/client";
import { getCurrentUserBySession } from "@/lib/auth";
import type { Locale } from "@/lib/i18n-shared";
import { prisma } from "@/lib/prisma";
import type { SessionData } from "@/lib/session";
import type { Rol } from "@/lib/types";

export type NotificationFeedItem = {
  id: number;
  title: string | null;
  actor?: string;
  message: string;
  type: string;
  read: boolean;
  href: string | null;
  createdAtIso: string;
  createdAtLabel: string;
};

export type AdminMetricSnapshot = {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  pendingRequests: number;
  activeDirects: number;
  scheduledDirects: number;
  unreadNotifications: number;
};

function getIntlLocale(locale: Locale) {
  if (locale === "ca") return "ca-ES";
  if (locale === "en") return "en-US";
  return "es-ES";
}

function formatDateTime(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function formatDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatRoleLabel(role: string) {
  return role;
}

function buildNotificationWhere(session: SessionData | null): Prisma.AppNotificationWhereInput {
  const filters: Prisma.AppNotificationWhereInput[] = [
    {
      id_usuario_destino: null,
      rol_destino: null,
    },
  ];

  if (session?.role) {
    filters.push({
      rol_destino: session.role,
    });
  }

  if (session?.userId) {
    filters.push({
      id_usuario_destino: session.userId,
    });
  }

  return {
    OR: filters,
  };
}

export async function getSessionUserRecord(session: SessionData | null) {
  if (!session) {
    return null;
  }

  return getCurrentUserBySession({
    userId: session.userId,
    email: session.email,
  });
}

export async function requireAdminUser(session: SessionData | null) {
  const user = await getSessionUserRecord(session);

  if (!user || user.role.rol !== "admin") {
    throw new Error("Acceso admin no autorizado.");
  }

  return user;
}

export async function createAuditLog(input: {
  actorUserId?: number | null;
  action: string;
  entity: string;
  entityId?: number | null;
  description: string;
  metadata?: Prisma.InputJsonValue | null;
}) {
  return prisma.auditLog.create({
    data: {
      accion: input.action,
      entidad: input.entity,
      entidad_id: input.entityId ?? null,
      descripcion: input.description,
      metadata: input.metadata ?? undefined,
      id_usuario_actor: input.actorUserId ?? null,
    },
  });
}

export async function createAppNotification(input: {
  title?: string | null;
  message: string;
  type?: string;
  actor?: string | null;
  targetUserId?: number | null;
  targetRole?: Rol | null;
  href?: string | null;
  actorUserId?: number | null;
}) {
  return prisma.appNotification.create({
    data: {
      titulo: input.title ?? null,
      mensaje: input.message,
      tipo: input.type ?? "info",
      actor: input.actor ?? null,
      id_usuario_destino: input.targetUserId ?? null,
      rol_destino: input.targetRole ?? null,
      enlace: input.href ?? null,
      id_actor_usuario: input.actorUserId ?? null,
      leida: false,
    },
  });
}

export async function getNotificationFeedForSession(params: {
  session: SessionData | null;
  locale: Locale;
  limit?: number;
}) {
  const { session, locale, limit = 12 } = params;

  if (!session?.role) {
    return {
      count: 0,
      total: 0,
      items: [] as NotificationFeedItem[],
    };
  }

  const where = buildNotificationWhere(session);

  const [total, count, notifications] = await Promise.all([
    prisma.appNotification.count({ where }),
    prisma.appNotification.count({
      where: {
        ...where,
        leida: false,
      },
    }),
    prisma.appNotification.findMany({
      where,
      orderBy: {
        fecha_creacion: "desc",
      },
      take: limit,
      include: {
        actor_usuario: {
          select: {
            nombre: true,
          },
        },
      },
    }),
  ]);

  return {
    count,
    total,
    items: notifications.map((item) => ({
      id: item.id_notificacion,
      title: item.titulo,
      actor: item.actor ?? item.actor_usuario?.nombre ?? undefined,
      message: item.mensaje,
      type: item.tipo,
      read: item.leida,
      href: item.enlace,
      createdAtIso: item.fecha_creacion.toISOString(),
      createdAtLabel: formatDateTime(item.fecha_creacion, locale),
    })),
  };
}

export async function getAdminMetrics(params: {
  session: SessionData | null;
  locale: Locale;
}) {
  const notificationFeed = await getNotificationFeedForSession({
    session: params.session,
    locale: params.locale,
    limit: 6,
  });

  const [totalUsers, blockedUsers, pendingRequests, activeDirects, scheduledDirects] =
    await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({
        where: {
          bloqueado: true,
        },
      }),
      prisma.solicitudServicio.count({
        where: {
          estado: {
            in: ["pendiente", "revisando"],
          },
        },
      }),
      prisma.directo.count({
        where: {
          estado: "live",
        },
      }),
      prisma.directo.count({
        where: {
          estado: "programado",
        },
      }),
    ]);

  return {
    totalUsers,
    activeUsers: totalUsers - blockedUsers,
    blockedUsers,
    pendingRequests,
    activeDirects,
    scheduledDirects,
    unreadNotifications: notificationFeed.count,
  } satisfies AdminMetricSnapshot;
}

export async function getAdminPanelData(params: {
  locale: Locale;
  session: SessionData | null;
}) {
  const [metrics, roles, users, requests, directs, logs, notificationFeed] =
    await Promise.all([
      getAdminMetrics(params),
      prisma.role.findMany({
        orderBy: {
          admin: "asc",
        },
      }),
      prisma.usuario.findMany({
        orderBy: {
          fecha_registro: "desc",
        },
        include: {
          role: {
            select: {
              admin: true,
              rol: true,
            },
          },
        },
      }),
      prisma.solicitudServicio.findMany({
        orderBy: {
          fecha_creacion: "desc",
        },
        take: 12,
        include: {
          usuario: {
            select: {
              id_usuario: true,
              nombre: true,
              email: true,
            },
          },
        },
      }),
      prisma.directo.findMany({
        orderBy: [
          {
            fecha_programada: "asc",
          },
          {
            id_directo: "desc",
          },
        ],
        take: 12,
      }),
      prisma.auditLog.findMany({
        orderBy: {
          fecha_creacion: "desc",
        },
        take: 12,
        include: {
          actor: {
            select: {
              nombre: true,
            },
          },
        },
      }),
      getNotificationFeedForSession({
        session: params.session,
        locale: params.locale,
        limit: 8,
      }),
    ]);

  return {
    metrics,
    roles: roles.map((role) => ({
      id: role.admin,
      name: role.rol,
      label: formatRoleLabel(role.rol),
    })),
    users: users.map((user) => ({
      id: user.id_usuario,
      name: user.nombre,
      email: user.email,
      roleId: user.role.admin,
      role: user.role.rol,
      blocked: user.bloqueado,
      joinedAt: formatDate(user.fecha_registro, params.locale),
    })),
    requests: requests.map((request) => ({
      id: request.id_solicitud,
      userId: request.id_usuario,
      requester: request.nombre_contacto,
      email: request.email_contacto,
      services: request.servicios,
      date: formatDate(request.fecha_servicio, params.locale),
      hours: request.horas_servicio,
      extras: request.extras ?? "",
      details: request.detalles ?? "",
      total: Number(request.total_estimado),
      status: request.estado,
      createdAt: formatDateTime(request.fecha_creacion, params.locale),
    })),
    directs: directs.map((direct) => ({
      id: direct.id_directo,
      title: direct.nombre_directo?.trim() || `Directo ${direct.id_directo}`,
      description: direct.descripcion ?? "",
      url: direct.url_streaming,
      status: direct.estado,
      scheduledAt: direct.fecha_programada
        ? formatDateTime(direct.fecha_programada, params.locale)
        : null,
    })),
    logs: logs.map((log) => ({
      id: log.id_log,
      action: log.accion,
      entity: log.entidad,
      entityId: log.entidad_id,
      description: log.descripcion,
      actor: log.actor?.nombre ?? "Sistema",
      createdAt: formatDateTime(log.fecha_creacion, params.locale),
    })),
    notifications: notificationFeed.items,
    notificationCount: notificationFeed.count,
  };
}
