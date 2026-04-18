import { hash, compare } from "bcrypt";
import { prisma } from "@/lib/prisma";

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const DEV_BYPASS_DOMAINS = new Set(["movida.tv", "demo.movida.tv"]);

function isBypassEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return process.env.NODE_ENV !== "production" && DEV_BYPASS_DOMAINS.has(domain);
}

export class OtpActionError extends Error {
  code: "otp_missing" | "otp_expired" | "otp_invalid" | "otp_max";

  constructor(code: "otp_missing" | "otp_expired" | "otp_invalid" | "otp_max") {
    super(code);
    this.code = code;
  }
}

function createOtpCode() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

function normalizeOtpCode(value: string) {
  return value.replace(/\D/g, "").slice(0, OTP_LENGTH);
}

export async function createEmailOtp(input: {
  email: string;
  userId?: number | null;
}) {
  const email = input.email.toLowerCase();
  if (isBypassEmail(email)) {
    return { code: "000000", expiresMinutes: OTP_TTL_MINUTES };
  }
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000);
  const code = createOtpCode();
  const codeHash = await hash(code, 10);

  await prisma.$transaction(async (tx) => {
    await tx.emailOtp.updateMany({
      where: {
        email,
        consumed_at: null,
      },
      data: {
        consumed_at: now,
      },
    });

    await tx.emailOtp.create({
      data: {
        email,
        id_usuario: input.userId ?? null,
        codigo_hash: codeHash,
        expires_at: expiresAt,
        attempts: 0,
      },
    });
  });

  return { code, expiresMinutes: OTP_TTL_MINUTES };
}

export async function verifyEmailOtp(input: { email: string; code: string }) {
  const email = input.email.toLowerCase();
  const normalizedCode = normalizeOtpCode(input.code);

  if (isBypassEmail(email)) {
    if (normalizedCode !== "000000") {
      throw new OtpActionError("otp_invalid");
    }
    return true;
  }

  if (!normalizedCode) {
    throw new OtpActionError("otp_missing");
  }

  const records = await prisma.emailOtp.findMany({
    where: {
      email,
      consumed_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (records.length === 0) {
    throw new OtpActionError("otp_missing");
  }

  const now = new Date();
  const staleIds: number[] = [];
  const activeRecords = [];

  for (const record of records) {
    if (record.expires_at <= now || record.attempts >= OTP_MAX_ATTEMPTS) {
      staleIds.push(record.id_otp);
      continue;
    }

    activeRecords.push(record);
  }

  if (staleIds.length > 0) {
    await prisma.emailOtp.updateMany({
      where: {
        id_otp: { in: staleIds },
        consumed_at: null,
      },
      data: { consumed_at: now },
    });
  }

  // Accept any still-active OTP for the email so concurrent submissions or
  // delayed emails do not invalidate a code that was legitimately issued.
  for (const record of activeRecords) {
    const matches = await compare(normalizedCode, record.codigo_hash);
    if (!matches) {
      continue;
    }

    await prisma.emailOtp.updateMany({
      where: {
        email,
        consumed_at: null,
      },
      data: {
        consumed_at: now,
      },
    });

    return true;
  }

  const latestActiveRecord = activeRecords[0];

  if (!latestActiveRecord) {
    const latestRecord = records[0];
    throw new OtpActionError(
      latestRecord.expires_at <= now ? "otp_expired" : "otp_max",
    );
  }

  await prisma.emailOtp.update({
    where: { id_otp: latestActiveRecord.id_otp },
    data: { attempts: latestActiveRecord.attempts + 1 },
  });

  throw new OtpActionError("otp_invalid");
}
