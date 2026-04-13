"use server";

import { z } from "zod";
import { createAppNotification, createAuditLog } from "@/lib/backoffice";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const inquirySchema = z.object({
  email: z.string().trim().min(1).max(255).email(),
  message: z.string().trim().min(10).max(500),
});

export async function submitPublicInquiryAction(input: {
  email: string;
  message: string;
}) {
  const session = await getSession();
  const parsed = inquirySchema.parse(input);
  const fallbackName = parsed.email.split("@")[0] || "Consulta web";
  const contactName = (session?.name?.trim() || fallbackName).slice(0, 80);

  const request = await prisma.solicitudServicio.create({
    data: {
      id_usuario: session?.userId ?? null,
      nombre_contacto: contactName,
      email_contacto: parsed.email.toLowerCase(),
      servicios: "Consulta desde web pública",
      fecha_servicio: new Date(),
      horas_servicio: 1,
      detalles: parsed.message,
      extras: null,
      total_estimado: 0,
      estado: "pendiente",
    },
  });

  await createAppNotification({
    title: "Nueva consulta desde la web",
    message: `${parsed.email} ha enviado una consulta desde la página pública.`,
    type: "info",
    targetRole: "admin",
    href: "/admin/panel",
    actor: contactName,
    actorUserId: session?.userId ?? null,
  });

  await createAuditLog({
    actorUserId: session?.userId ?? null,
    action: "crear",
    entity: "solicitud_servicio",
    entityId: request.id_solicitud,
    description: `Nueva consulta pública enviada por ${parsed.email}.`,
    metadata: {
      origen: "web_publica",
      email: parsed.email.toLowerCase(),
    },
  });

  revalidatePath("/admin/panel");
  revalidatePath("/dashboard");
  revalidatePath("/admin/notificaciones");

  return {
    ok: true,
    requestId: request.id_solicitud,
  };
}
