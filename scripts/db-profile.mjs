import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");
const profilePaths = {
  local: path.join(root, ".env.db.local"),
  neon: path.join(root, ".env.db.neon"),
};

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const entries = {};
  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#") || !line.includes("=")) {
      continue;
    }

    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

function formatEnvValue(value) {
  return `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function upsertEnvFile(filePath, updates, header) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const lines = existing ? existing.split(/\r?\n/) : [];
  const remaining = new Set(Object.keys(updates));

  const nextLines = lines.map((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      return line;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();

    if (!remaining.has(key)) {
      return line;
    }

    remaining.delete(key);
    return `${key}=${formatEnvValue(updates[key])}`;
  });

  if (!lines.length && header) {
    nextLines.push(...header, "");
  }

  if (lines.length && header && !existing.startsWith(header[0])) {
    nextLines.unshift("", ...header);
  }

  for (const key of Object.keys(updates)) {
    if (remaining.has(key)) {
      nextLines.push(`${key}=${formatEnvValue(updates[key])}`);
    }
  }

  const normalized = `${nextLines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
  fs.writeFileSync(filePath, normalized, "utf8");
}

function ensureEnvExists() {
  if (!fs.existsSync(envPath)) {
    throw new Error("No existe .env en la raíz del proyecto.");
  }
}

function getCurrentDbConfig() {
  ensureEnvExists();
  const env = parseEnvFile(envPath);
  return {
    DB_TARGET: env.DB_TARGET || "custom",
    DATABASE_URL: env.DATABASE_URL || "",
    DIRECT_URL: env.DIRECT_URL || "",
  };
}

function showTarget() {
  const current = getCurrentDbConfig();
  const local = parseEnvFile(profilePaths.local);
  const neon = parseEnvFile(profilePaths.neon);

  const matchesLocal =
    current.DATABASE_URL === local.DATABASE_URL &&
    current.DIRECT_URL === local.DIRECT_URL;
  const matchesNeon =
    current.DATABASE_URL === neon.DATABASE_URL &&
    current.DIRECT_URL === neon.DIRECT_URL;

  const inferred = matchesLocal ? "local" : matchesNeon ? "neon" : current.DB_TARGET || "custom";
  console.log(`DB target actual: ${inferred}`);
}

function saveTarget(target) {
  const filePath = profilePaths[target];
  if (!filePath) {
    throw new Error(`Target no soportado: ${target}`);
  }

  const current = getCurrentDbConfig();
  if (!current.DATABASE_URL || !current.DIRECT_URL) {
    throw new Error("DATABASE_URL y DIRECT_URL deben estar definidas en .env antes de guardar.");
  }

  upsertEnvFile(
    filePath,
    {
      DB_TARGET: target,
      DATABASE_URL: current.DATABASE_URL,
      DIRECT_URL: current.DIRECT_URL,
    },
    [`# Perfil de base de datos: ${target}`],
  );

  console.log(`Perfil guardado: ${path.basename(filePath)}`);
}

function switchTarget(target) {
  const filePath = profilePaths[target];
  if (!filePath) {
    throw new Error(`Target no soportado: ${target}`);
  }

  const profile = parseEnvFile(filePath);
  if (!profile.DATABASE_URL || !profile.DIRECT_URL) {
    throw new Error(`Falta DATABASE_URL o DIRECT_URL en ${path.basename(filePath)}.`);
  }

  upsertEnvFile(envPath, {
    DB_TARGET: target,
    DATABASE_URL: profile.DATABASE_URL,
    DIRECT_URL: profile.DIRECT_URL,
  });

  console.log(`.env actualizado para usar: ${target}`);
}

const [command, target] = process.argv.slice(2);

try {
  if (command === "show") {
    showTarget();
  } else if (command === "save") {
    if (!target) {
      throw new Error("Indica un target: local o neon.");
    }
    saveTarget(target);
  } else if (command === "switch") {
    if (!target) {
      throw new Error("Indica un target: local o neon.");
    }
    switchTarget(target);
  } else {
    throw new Error("Uso: node scripts/db-profile.mjs <show|save|switch> [local|neon]");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
