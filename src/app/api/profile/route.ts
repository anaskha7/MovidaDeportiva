import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUserRecord, createAuditLog } from "@/lib/backoffice";
import { sanitizeProfileAvatarUrl } from "@/lib/profile-avatar";
import { prisma } from "@/lib/prisma";
import { formatUserName, getSession } from "@/lib/session";
import { applySessionToResponse } from "@/lib/session-response";
import type { Locale } from "@/lib/i18n-shared";

const profileSchema = z.object({
  locale: z.enum(["es", "ca", "en"]).catch("es"),
  fullName: z.string().trim().min(1).max(80),
  avatarUrl: z.string().nullable().optional(),
});

const messages = {
  es: {
    expired: "Tu sesión ha expirado. Vuelve a iniciar sesión.",
    invalidName: "Introduce un nombre válido.",
    profileSaved: "Tu perfil se ha actualizado correctamente.",
  },
  ca: {
    expired: "La teva sessió ha caducat. Torna a iniciar sessió.",
    invalidName: "Introdueix un nom vàlid.",
    profileSaved: "El teu perfil s'ha actualitzat correctament.",
  },
  en: {
    expired: "Your session has expired. Please sign in again.",
    invalidName: "Enter a valid name.",
    profileSaved: "Your profile has been updated successfully.",
  },
} as const;

function getMessages(locale: Locale) {
  return messages[locale] ?? messages.es;
}

function revalidateUserSurfaces() {
  revalidatePath("/app");
  revalidatePath("/app/ajustes");
  revalidatePath("/videos");
  revalidatePath("/directo");
  revalidatePath("/app/servicios");
  revalidatePath("/app/notificaciones");
  revalidatePath("/dashboard");
  revalidatePath("/admin/panel");
  revalidatePath("/admin/notificaciones");
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);
  const locale = parsed.success ? parsed.data.locale : "es";
  const t = getMessages(locale);

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        message: t.invalidName,
      },
      { status: 400 },
    );
  }

  const session = await getSession();
  const currentUser = await getSessionUserRecord(session);

  if (!session || !currentUser) {
    return NextResponse.json(
      {
        status: "error",
        message: t.expired,
      },
      { status: 401 },
    );
  }

  const normalizedName = formatUserName(parsed.data.fullName).slice(0, 80);
  const sanitizedAvatarUrl = sanitizeProfileAvatarUrl(parsed.data.avatarUrl ?? null);

  const updatedUser = await prisma.usuario.update({
    where: {
      id_usuario: currentUser.id_usuario,
    },
    data: {
      nombre: normalizedName,
      avatar_url: sanitizedAvatarUrl,
    },
    include: {
      role: {
        select: {
          rol: true,
        },
      },
    },
  });

  await createAuditLog({
    actorUserId: updatedUser.id_usuario,
    action: "actualizar_perfil",
    entity: "usuario",
    entityId: updatedUser.id_usuario,
    description: "El usuario ha actualizado su perfil desde ajustes.",
    metadata: {
      nombre: updatedUser.nombre,
      avatarUrl: updatedUser.avatar_url,
    },
  });

  revalidateUserSurfaces();

  const response = await applySessionToResponse(
    NextResponse.json({
      status: "success",
      message: t.profileSaved,
      updatedName: formatUserName(updatedUser.nombre),
      updatedEmail: updatedUser.email,
      updatedAvatarUrl: updatedUser.avatar_url,
    }),
    {
      role: updatedUser.role.rol as "admin" | "user" | "suscriptor",
      name: formatUserName(updatedUser.nombre),
      userId: updatedUser.id_usuario,
      email: updatedUser.email,
    },
  );

  response.headers.set("Cache-Control", "no-store");
  return response;
}
