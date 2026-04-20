require("dotenv/config");

const bcrypt = require("bcrypt");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("No está definida ni DIRECT_URL ni DATABASE_URL.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEMO_USERS = [
  {
    name: "Admin",
    email: "admin@movida.tv",
    password: "Admin12345!",
    role: "admin",
  },
  {
    name: "User",
    email: "user@movida.tv",
    password: "User12345!",
    role: "user",
  },
  {
    name: "Suscriptor",
    email: "suscriptor@movida.tv",
    password: "Suscriptor12345!",
    role: "suscriptor",
  },
];

const BASE_GENEROS = ["masculino", "femenino", "mixto"];

async function ensureRoles() {
  for (const rol of ["admin", "user", "suscriptor"]) {
    await prisma.role.upsert({
      where: { rol },
      update: {},
      create: { rol },
    });
  }

  return prisma.role.findMany({
    select: {
      admin: true,
      rol: true,
    },
  });
}

async function ensureGeneros() {
  for (const nombre of BASE_GENEROS) {
    const existing = await prisma.genero.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: "insensitive",
        },
      },
      select: {
        id_genero: true,
      },
    });

    if (!existing) {
      await prisma.genero.create({
        data: { nombre },
      });
    }
  }
}

async function ensureDemoUsers(roleMap) {
  for (const user of DEMO_USERS) {
    const password = await bcrypt.hash(user.password, 10);

    await prisma.usuario.upsert({
      where: {
        email: user.email,
      },
      update: {
        nombre: user.name,
        password,
        admin: roleMap.get(user.role),
        bloqueado: false,
      },
      create: {
        nombre: user.name,
        email: user.email,
        password,
        fecha_registro: new Date(),
        admin: roleMap.get(user.role),
      },
    });
  }
}

async function ensureDemoSubscriptions() {
  const subscriber = await prisma.usuario.findUnique({
    where: { email: "suscriptor@movida.tv" },
    select: { id_usuario: true },
  });

  if (!subscriber) {
    return;
  }

  const existingSubscription = await prisma.suscripcion.findFirst({
    where: { id_usuario: subscriber.id_usuario },
    select: { id_suscripcion: true },
  });

  if (existingSubscription) {
    await prisma.suscripcion.update({
      where: { id_suscripcion: existingSubscription.id_suscripcion },
      data: {
        id_usuario: subscriber.id_usuario,
        plan: "premium",
        estado: "activa",
        fecha_inicio: new Date("2026-04-01T00:00:00.000Z"),
        fecha_renovacion: new Date("2026-05-01T00:00:00.000Z"),
        fecha_fin: null,
      },
    });
    return;
  }

  await prisma.suscripcion.create({
    data: {
      id_usuario: subscriber.id_usuario,
      plan: "premium",
      estado: "activa",
      fecha_inicio: new Date("2026-04-01T00:00:00.000Z"),
      fecha_renovacion: new Date("2026-05-01T00:00:00.000Z"),
      fecha_fin: null,
    },
  });
}

async function main() {
  const roles = await ensureRoles();
  const roleMap = new Map(roles.map((role) => [role.rol, role.admin]));

  await ensureGeneros();
  await ensureDemoUsers(roleMap);
  await ensureDemoSubscriptions();

  console.log("Seed completado:");
  console.log("- Roles base: admin, user, suscriptor");
  console.log("- Géneros base: masculino, femenino, mixto");
  console.log("- Usuarios demo: admin@movida.tv, user@movida.tv, suscriptor@movida.tv");
  console.log("- Suscripción demo: premium activa para suscriptor@movida.tv");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
