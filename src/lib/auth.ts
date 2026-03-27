import { compare, hash } from "bcrypt";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatUserName } from "@/lib/session";
import type { Rol } from "@/lib/types";
import { z } from "zod";

const APP_ROLES = ["admin", "user", "suscriptor"] as const satisfies readonly Rol[];

const loginSchema = z.object({
  email: z.string().trim().min(1).max(255).email(),
  password: z.string().min(1).max(72),
});

const registerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().min(1).max(255).email(),
  password: z.string().min(8).max(72),
});

const googleProfileSchema = z.object({
  email: z.string().trim().min(1).max(255).email(),
  name: z.string().trim().min(1).max(80).optional().nullable(),
});

export class AuthActionError extends Error {
  code: "invalid" | "exists" | "blocked";

  constructor(code: "invalid" | "exists" | "blocked", message?: string) {
    super(message ?? code);
    this.code = code;
  }
}

export interface AuthSessionUser {
  id: number;
  name: string;
  email: string;
  role: Rol;
}

function normalizeStoredName(name: string | null | undefined, email?: string) {
  const fallback = email ? email.split("@")[0]?.replace(/[._-]+/g, " ") : undefined;
  return formatUserName(name ?? fallback ?? "Usuario").slice(0, 80);
}

function isAppRole(value: string): value is Rol {
  return APP_ROLES.includes(value as Rol);
}

export async function ensureBaseRoles() {
  const existingRoles = await prisma.role.findMany({
    select: {
      admin: true,
      rol: true,
    },
  });

  const existingNames = new Set(
    existingRoles.map((role) => role.rol.toLowerCase()),
  );

  for (const roleName of APP_ROLES) {
    if (existingNames.has(roleName)) {
      continue;
    }

    try {
      await prisma.role.create({
        data: {
          rol: roleName,
        },
      });
    } catch (error) {
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== "P2002"
      ) {
        throw error;
      }
    }
  }

  return prisma.role.findMany({
    select: {
      admin: true,
      rol: true,
    },
  });
}

async function getRoleId(role: Rol) {
  const roles = await ensureBaseRoles();
  const match = roles.find((item) => item.rol === role);

  if (!match) {
    throw new Error(`No se encontró el rol "${role}" en la base de datos.`);
  }

  return match.admin;
}

async function getRoleName(admin: number) {
  const role = await prisma.role.findUnique({
    where: { admin },
    select: { rol: true },
  });

  if (!role || !isAppRole(role.rol)) {
    throw new Error(`No se encontró un rol válido para admin=${admin}.`);
  }

  return role.rol;
}

export async function authenticateUser(input: {
  email: string;
  password: string;
}): Promise<AuthSessionUser> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    throw new AuthActionError("invalid");
  }

  await ensureBaseRoles();

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.usuario.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
    include: {
      role: {
        select: {
          rol: true,
        },
      },
    },
  });

  if (!user || !isAppRole(user.role.rol)) {
    throw new AuthActionError("invalid");
  }

  if (user.bloqueado) {
    throw new AuthActionError("blocked");
  }

  const passwordMatches = await compare(parsed.data.password, user.password);

  if (!passwordMatches) {
    throw new AuthActionError("invalid");
  }

  return {
    id: user.id_usuario,
    name: formatUserName(user.nombre),
    email: user.email,
    role: user.role.rol,
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSessionUser> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    throw new AuthActionError("invalid");
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.usuario.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
    select: {
      id_usuario: true,
    },
  });

  if (existingUser) {
    throw new AuthActionError("exists");
  }

  const userRoleId = await getRoleId("user");
  const passwordHash = await hash(parsed.data.password, 10);
  let createdUser;

  try {
    createdUser = await prisma.usuario.create({
      data: {
        nombre: normalizeStoredName(parsed.data.name, email),
        email,
        password: passwordHash,
        fecha_registro: new Date(),
        admin: userRoleId,
      },
      include: {
        role: {
          select: {
            rol: true,
          },
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AuthActionError("exists");
    }

    throw error;
  }

  if (!isAppRole(createdUser.role.rol)) {
    throw new Error("El rol del usuario creado no es válido para la app.");
  }

  return {
    id: createdUser.id_usuario,
    name: formatUserName(createdUser.nombre),
    email: createdUser.email,
    role: createdUser.role.rol,
  };
}

export async function syncGoogleUser(input: {
  email: string;
  name?: string | null;
}): Promise<AuthSessionUser> {
  const parsed = googleProfileSchema.safeParse(input);

  if (!parsed.success) {
    throw new AuthActionError("invalid");
  }

  const email = parsed.data.email.toLowerCase();
  const normalizedName = normalizeStoredName(parsed.data.name, email);

  await ensureBaseRoles();

  const existingUser = await prisma.usuario.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
    include: {
      role: {
        select: {
          rol: true,
        },
      },
    },
  });

  if (existingUser) {
    if (!isAppRole(existingUser.role.rol)) {
      throw new AuthActionError("invalid");
    }

    if (existingUser.bloqueado) {
      throw new AuthActionError("blocked");
    }

    if (existingUser.nombre !== normalizedName) {
      await prisma.usuario.update({
        where: {
          id_usuario: existingUser.id_usuario,
        },
        data: {
          nombre: normalizedName,
        },
      });
    }

    return {
      id: existingUser.id_usuario,
      name: formatUserName(normalizedName),
      email: existingUser.email,
      role: existingUser.role.rol,
    };
  }

  const userRoleId = await getRoleId("user");
  const passwordHash = await hash(`google-oauth:${crypto.randomUUID()}`, 10);
  const createdUser = await prisma.usuario.create({
    data: {
      nombre: normalizedName,
      email,
      password: passwordHash,
      fecha_registro: new Date(),
      admin: userRoleId,
    },
    include: {
      role: {
        select: {
          rol: true,
        },
      },
    },
  });

  if (!isAppRole(createdUser.role.rol)) {
    throw new AuthActionError("invalid");
  }

  return {
    id: createdUser.id_usuario,
    name: formatUserName(createdUser.nombre),
    email: createdUser.email,
    role: createdUser.role.rol,
  };
}

export async function getCurrentUserBySession(session: {
  userId?: number | null;
  email?: string | null;
}) {
  if (session.userId) {
    return prisma.usuario.findUnique({
      where: { id_usuario: session.userId },
      include: {
        role: {
          select: {
            rol: true,
          },
        },
      },
    });
  }

  if (session.email) {
    return prisma.usuario.findFirst({
      where: {
        email: {
          equals: session.email,
          mode: "insensitive",
        },
      },
      include: {
        role: {
          select: {
            rol: true,
          },
        },
      },
    });
  }

  return null;
}

export async function updateUserRole(userId: number, roleId: number) {
  const updatedUser = await prisma.usuario.update({
    where: { id_usuario: userId },
    data: { admin: roleId },
    include: {
      role: {
        select: {
          rol: true,
        },
      },
    },
  });

  return {
    id: updatedUser.id_usuario,
    name: formatUserName(updatedUser.nombre),
    email: updatedUser.email,
    role: updatedUser.role.rol,
    blocked: updatedUser.bloqueado,
  };
}

export async function toggleUserBlocked(userId: number, blocked: boolean) {
  const updatedUser = await prisma.usuario.update({
    where: { id_usuario: userId },
    data: { bloqueado: blocked },
    include: {
      role: {
        select: {
          rol: true,
        },
      },
    },
  });

  return {
    id: updatedUser.id_usuario,
    name: formatUserName(updatedUser.nombre),
    email: updatedUser.email,
    role: updatedUser.role.rol,
    blocked: updatedUser.bloqueado,
  };
}

export async function getRoleNameById(roleId: number) {
  return getRoleName(roleId);
}
