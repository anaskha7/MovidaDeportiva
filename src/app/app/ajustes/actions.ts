"use server";

import { compare, hash } from "bcrypt";
import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAuditLog, getSessionUserRecord } from "@/lib/backoffice";
import { prisma } from "@/lib/prisma";
import { formatUserName, getSession } from "@/lib/session";
import {
  SESSION_COOKIE_EMAIL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_ROLE,
  SESSION_COOKIE_USER_ID,
} from "@/lib/session-cookies";
import type { Locale } from "@/lib/i18n-shared";

export type SettingsActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  updatedName?: string;
  updatedEmail?: string;
};

const profileSchema = z.object({
  locale: z.enum(["es", "ca", "en"]).catch("es"),
  fullName: z.string().trim().min(1).max(80),
});

const passwordSchema = z
  .object({
    locale: z.enum(["es", "ca", "en"]).catch("es"),
    currentPassword: z.string().min(1).max(72),
    newPassword: z.string().min(8).max(72),
    confirmPassword: z.string().min(8).max(72),
  })
  .superRefine((value, ctx) => {
    if (value.newPassword !== value.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "password_mismatch",
      });
    }
  });

const messages = {
  es: {
    expired: "Tu sesión ha expirado. Vuelve a iniciar sesión.",
    invalidName: "Introduce un nombre válido.",
    profileSaved: "Tu nombre se ha actualizado correctamente.",
    invalidPasswordData: "Revisa los datos de seguridad.",
    currentPasswordWrong: "La contraseña actual no es correcta.",
    passwordSaved: "Tu contraseña se ha actualizado correctamente.",
  },
  ca: {
    expired: "La teva sessió ha caducat. Torna a iniciar sessió.",
    invalidName: "Introdueix un nom vàlid.",
    profileSaved: "El teu nom s'ha actualitzat correctament.",
    invalidPasswordData: "Revisa les dades de seguretat.",
    currentPasswordWrong: "La contrasenya actual no és correcta.",
    passwordSaved: "La teva contrasenya s'ha actualitzat correctament.",
  },
  en: {
    expired: "Your session has expired. Please sign in again.",
    invalidName: "Enter a valid name.",
    profileSaved: "Your name has been updated successfully.",
    invalidPasswordData: "Please review the security details.",
    currentPasswordWrong: "The current password is incorrect.",
    passwordSaved: "Your password has been updated successfully.",
  },
} as const;

function getMessages(locale: Locale) {
  return messages[locale] ?? messages.es;
}

async function refreshSessionCookies(input: {
  role: string;
  name: string;
  userId: number;
  email: string;
}) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_ROLE, input.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_NAME, input.name, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_USER_ID, String(input.userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(SESSION_COOKIE_EMAIL, input.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

function revalidateUserSurfaces() {
  revalidatePath("/app");
  revalidatePath("/app/ajustes");
  revalidatePath("/videos");
  revalidatePath("/directo");
  revalidatePath("/app/servicios");
  revalidatePath("/app/notificaciones");
}

export async function updateProfileSettingsAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = profileSchema.safeParse({
    locale: formData.get("locale"),
    fullName: formData.get("fullName"),
  });

  const locale = parsed.success ? parsed.data.locale : "es";
  const t = getMessages(locale);

  if (!parsed.success) {
    return {
      status: "error",
      message: t.invalidName,
    };
  }

  const session = await getSession();
  const currentUser = await getSessionUserRecord(session);

  if (!session || !currentUser) {
    return {
      status: "error",
      message: t.expired,
    };
  }

  const normalizedName = formatUserName(parsed.data.fullName).slice(0, 80);
  const updatedUser = await prisma.usuario.update({
    where: {
      id_usuario: currentUser.id_usuario,
    },
    data: {
      nombre: normalizedName,
    },
    include: {
      role: {
        select: {
          rol: true,
        },
      },
    },
  });

  await refreshSessionCookies({
    role: updatedUser.role.rol,
    name: formatUserName(updatedUser.nombre),
    userId: updatedUser.id_usuario,
    email: updatedUser.email,
  });

  await createAuditLog({
    actorUserId: updatedUser.id_usuario,
    action: "actualizar_perfil",
    entity: "usuario",
    entityId: updatedUser.id_usuario,
    description: "El usuario ha actualizado su nombre desde ajustes.",
    metadata: {
      nombre: updatedUser.nombre,
    },
  });

  revalidateUserSurfaces();

  return {
    status: "success",
    message: t.profileSaved,
    updatedName: formatUserName(updatedUser.nombre),
    updatedEmail: updatedUser.email,
  };
}

export async function updatePasswordSettingsAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = passwordSchema.safeParse({
    locale: formData.get("locale"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  const locale =
    formData.get("locale") === "ca" || formData.get("locale") === "en"
      ? (formData.get("locale") as Locale)
      : "es";
  const t = getMessages(locale);

  if (!parsed.success) {
    const passwordMismatch = parsed.error.issues.some(
      (issue) => issue.message === "password_mismatch",
    );

    return {
      status: "error",
      message: passwordMismatch ? t.invalidPasswordData : t.invalidPasswordData,
    };
  }

  const session = await getSession();
  const currentUser = await getSessionUserRecord(session);

  if (!session || !currentUser) {
    return {
      status: "error",
      message: t.expired,
    };
  }

  const passwordMatches = await compare(
    parsed.data.currentPassword,
    currentUser.password,
  );

  if (!passwordMatches) {
    return {
      status: "error",
      message: t.currentPasswordWrong,
    };
  }

  const passwordHash = await hash(parsed.data.newPassword, 10);

  await prisma.usuario.update({
    where: {
      id_usuario: currentUser.id_usuario,
    },
    data: {
      password: passwordHash,
    },
  });

  await createAuditLog({
    actorUserId: currentUser.id_usuario,
    action: "actualizar_password",
    entity: "usuario",
    entityId: currentUser.id_usuario,
    description: "El usuario ha actualizado su contraseña desde ajustes.",
  });

  revalidateUserSurfaces();

  return {
    status: "success",
    message: t.passwordSaved,
  };
}
