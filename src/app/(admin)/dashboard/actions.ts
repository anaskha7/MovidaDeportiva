"use server";

import { z } from "zod";
import {
  getRoleNameById,
  toggleUserBlocked,
  updateUserRole,
} from "@/lib/auth";
import {
  createAppNotification,
  createAuditLog,
  requireAdminUser,
} from "@/lib/backoffice";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { Rol } from "@/lib/types";
import { revalidatePath } from "next/cache";

const positiveInt = z.coerce.number().int().positive();

const roleChangeSchema = z.object({
  userId: positiveInt,
  roleId: positiveInt,
});

const blockSchema = z.object({
  userId: positiveInt,
  blocked: z.enum(["true", "false"]),
});

const directSchema = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(160).optional(),
  url: z.string().trim().url().max(255),
  status: z.string().trim().min(1).max(20),
  scheduledAt: z.string().trim().optional(),
});

const directStatusSchema = z.object({
  directId: positiveInt,
  status: z.string().trim().min(1).max(20),
});

const requestStatusSchema = z.object({
  requestId: positiveInt,
  status: z.string().trim().min(1).max(20),
});

const notificationSchema = z.object({
  title: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1).max(255),
  type: z.string().trim().max(20).optional(),
  target: z.enum(["all", "admin", "user", "suscriptor"]),
});

function revalidateBackoffice() {
  revalidatePath("/dashboard");
  revalidatePath("/admin/panel");
  revalidatePath("/admin/notificaciones");
  revalidatePath("/app/notificaciones");
  revalidatePath("/app/servicios");
}

function parseOptionalDateTime(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function changeUserRoleAction(formData: FormData) {
  const adminUser = await requireAdminUser(await getSession());
  const parsed = roleChangeSchema.parse({
    userId: formData.get("userId"),
    roleId: formData.get("roleId"),
  });

  const nextRoleName = await getRoleNameById(parsed.roleId);
  const updatedUser = await updateUserRole(parsed.userId, parsed.roleId);

  await createAuditLog({
    actorUserId: adminUser.id_usuario,
    action: "cambiar_rol",
    entity: "usuario",
    entityId: updatedUser.id,
    description: `Rol actualizado a ${nextRoleName} para ${updatedUser.email}.`,
    metadata: {
      roleId: parsed.roleId,
      roleName: nextRoleName,
    },
  });

  await createAppNotification({
    title: "Rol actualizado",
    message: `Tu perfil se ha actualizado al rol ${nextRoleName}.`,
    type: "info",
    targetUserId: updatedUser.id,
    href: "/app/ajustes",
    actorUserId: adminUser.id_usuario,
    actor: adminUser.nombre,
  });

  revalidateBackoffice();
}

export async function toggleUserBlockedAction(formData: FormData) {
  const adminUser = await requireAdminUser(await getSession());
  const parsed = blockSchema.parse({
    userId: formData.get("userId"),
    blocked: formData.get("blocked"),
  });
  const blocked = parsed.blocked === "true";
  const updatedUser = await toggleUserBlocked(parsed.userId, blocked);

  await createAuditLog({
    actorUserId: adminUser.id_usuario,
    action: blocked ? "bloquear" : "desbloquear",
    entity: "usuario",
    entityId: updatedUser.id,
    description: `${blocked ? "Bloqueado" : "Desbloqueado"} el acceso de ${updatedUser.email}.`,
    metadata: {
      blocked,
    },
  });

  await createAppNotification({
    title: blocked ? "Cuenta bloqueada" : "Cuenta reactivada",
    message: blocked
      ? "Tu acceso a Movida Deportiva TV ha sido bloqueado temporalmente."
      : "Tu acceso a Movida Deportiva TV vuelve a estar activo.",
    type: blocked ? "warning" : "success",
    targetUserId: updatedUser.id,
    href: "/login",
    actorUserId: adminUser.id_usuario,
    actor: adminUser.nombre,
  });

  revalidateBackoffice();
}

export async function createDirectoAction(formData: FormData) {
  const adminUser = await requireAdminUser(await getSession());
  const parsed = directSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    url: formData.get("url"),
    status: formData.get("status"),
    scheduledAt: formData.get("scheduledAt"),
  });

  const directo = await prisma.directo.create({
    data: {
      nombre_directo: parsed.title,
      descripcion: parsed.description || null,
      url_streaming: parsed.url,
      estado: parsed.status,
      fecha_programada: parseOptionalDateTime(parsed.scheduledAt),
    },
  });

  await createAuditLog({
    actorUserId: adminUser.id_usuario,
    action: "crear",
    entity: "directo",
    entityId: directo.id_directo,
    description: `Creado el directo ${parsed.title}.`,
    metadata: {
      estado: directo.estado,
      fechaProgramada: directo.fecha_programada?.toISOString() ?? null,
    },
  });

  revalidateBackoffice();
}

export async function updateDirectoStatusAction(formData: FormData) {
  const adminUser = await requireAdminUser(await getSession());
  const parsed = directStatusSchema.parse({
    directId: formData.get("directId"),
    status: formData.get("status"),
  });

  const directo = await prisma.directo.update({
    where: {
      id_directo: parsed.directId,
    },
    data: {
      estado: parsed.status,
    },
  });

  await createAuditLog({
    actorUserId: adminUser.id_usuario,
    action: "actualizar_estado",
    entity: "directo",
    entityId: directo.id_directo,
    description: `Estado del directo ${directo.nombre_directo ?? directo.id_directo} actualizado a ${directo.estado}.`,
    metadata: {
      estado: directo.estado,
    },
  });

  revalidateBackoffice();
}

export async function updateServiceRequestStatusAction(formData: FormData) {
  const adminUser = await requireAdminUser(await getSession());
  const parsed = requestStatusSchema.parse({
    requestId: formData.get("requestId"),
    status: formData.get("status"),
  });

  const request = await prisma.solicitudServicio.update({
    where: {
      id_solicitud: parsed.requestId,
    },
    data: {
      estado: parsed.status,
    },
  });

  await createAuditLog({
    actorUserId: adminUser.id_usuario,
    action: "actualizar_estado",
    entity: "solicitud_servicio",
    entityId: request.id_solicitud,
    description: `Solicitud ${request.id_solicitud} actualizada a ${request.estado}.`,
    metadata: {
      estado: request.estado,
      email: request.email_contacto,
    },
  });

  if (request.id_usuario) {
    await createAppNotification({
      title: "Solicitud actualizada",
      message: `Tu solicitud de servicios ahora está en estado ${request.estado}.`,
      type: request.estado === "confirmada" ? "success" : "info",
      targetUserId: request.id_usuario,
      href: "/servicios/contacto",
      actorUserId: adminUser.id_usuario,
      actor: adminUser.nombre,
    });
  }

  revalidateBackoffice();
}

export async function createPlatformNotificationAction(formData: FormData) {
  const adminUser = await requireAdminUser(await getSession());
  const parsed = notificationSchema.parse({
    title: formData.get("title"),
    message: formData.get("message"),
    type: formData.get("type"),
    target: formData.get("target"),
  });

  const targetRole = parsed.target === "all" ? null : (parsed.target as Rol);
  const notification = await createAppNotification({
    title: parsed.title || null,
    message: parsed.message,
    type: parsed.type || "info",
    targetRole,
    actorUserId: adminUser.id_usuario,
    actor: adminUser.nombre,
    href: targetRole === "admin" ? "/admin/notificaciones" : "/app/notificaciones",
  });

  await createAuditLog({
    actorUserId: adminUser.id_usuario,
    action: "crear",
    entity: "notificacion",
    entityId: notification.id_notificacion,
    description: `Notificación enviada a ${parsed.target === "all" ? "toda la plataforma" : parsed.target}.`,
    metadata: {
      target: parsed.target,
      type: notification.tipo,
    },
  });

  revalidateBackoffice();
}
