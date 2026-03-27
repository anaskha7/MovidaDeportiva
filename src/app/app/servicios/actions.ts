"use server";

import { z } from "zod";
import { createAppNotification, createAuditLog } from "@/lib/backoffice";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const submitSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().min(1).max(255).email(),
  services: z.array(z.string().trim().min(1)).min(1),
  hours: z.coerce.number().int().min(1).max(24),
  date: z.coerce.date(),
  details: z.string().trim().max(500).optional(),
  extras: z.array(z.string().trim().min(1)),
  total: z.coerce.number().nonnegative(),
});

export async function submitServiceRequestAction(input: {
  name: string;
  email: string;
  services: string[];
  hours: number;
  date: string;
  details?: string;
  extras: string[];
  total: number;
}) {
  const session = await getSession();
  const parsed = submitSchema.parse(input);

  const request = await prisma.solicitudServicio.create({
    data: {
      id_usuario: session?.userId ?? null,
      nombre_contacto: parsed.name,
      email_contacto: parsed.email.toLowerCase(),
      servicios: parsed.services.join(", "),
      fecha_servicio: parsed.date,
      horas_servicio: parsed.hours,
      detalles: parsed.details?.trim() || null,
      extras: parsed.extras.length > 0 ? parsed.extras.join(", ") : null,
      total_estimado: parsed.total,
      estado: "pendiente",
    },
  });

  await createAppNotification({
    title: "Nueva solicitud de servicios",
    message: `${parsed.name} ha solicitado ${parsed.services.join(", ")} para ${parsed.date.toLocaleDateString("es-ES")}.`,
    type: "info",
    targetRole: "admin",
    href: "/admin/panel",
    targetUserId: null,
    actor: parsed.name,
    actorUserId: session?.userId ?? null,
  });

  await createAuditLog({
    actorUserId: session?.userId ?? null,
    action: "crear",
    entity: "solicitud_servicio",
    entityId: request.id_solicitud,
    description: `Nueva solicitud de ${parsed.name} para ${parsed.services.join(", ")}.`,
    metadata: {
      total: parsed.total,
      email: parsed.email,
    },
  });

  revalidatePath("/app/servicios");
  revalidatePath("/admin/panel");
  revalidatePath("/dashboard");
  revalidatePath("/admin/notificaciones");

  return {
    ok: true,
    requestId: request.id_solicitud,
  };
}
