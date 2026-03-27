import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiRequestError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created(data: unknown) {
  return ok(data, { status: 201 });
}

export function errorResponse(
  status: number,
  error: string,
  details?: unknown,
) {
  return ok(
    details === undefined ? { error } : { error, details },
    { status },
  );
}

export function parseIdParam(value: string, label = "id") {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ApiRequestError(
      400,
      `El parámetro "${label}" debe ser un entero positivo.`,
    );
  }

  return parsed;
}

export function parsePagination(searchParams: URLSearchParams) {
  const all = searchParams.get("all") === "true";
  const limitParam = searchParams.get("limit");
  const offsetParam = searchParams.get("offset");
  const parsedLimit =
    limitParam === null ? 50 : Number.parseInt(limitParam, 10);
  const offset = offsetParam === null ? 0 : Number.parseInt(offsetParam, 10);

  if (
    !all &&
    (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100)
  ) {
    throw new ApiRequestError(
      400,
      'El parámetro "limit" debe ser un entero entre 1 y 100.',
    );
  }

  if (!Number.isInteger(offset) || offset < 0) {
    throw new ApiRequestError(
      400,
      'El parámetro "offset" debe ser un entero mayor o igual a 0.',
    );
  }

  return {
    all,
    limit: all ? null : parsedLimit,
    offset,
  };
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiRequestError) {
    return errorResponse(error.status, error.message, error.details);
  }

  if (error instanceof ZodError) {
    return errorResponse(400, "Datos inválidos.", error.flatten());
  }

  if (error instanceof SyntaxError) {
    return errorResponse(400, "El cuerpo JSON no es válido.");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return errorResponse(409, "Ya existe un registro con esos datos.", {
        code: error.code,
        target: error.meta?.target ?? null,
      });
    }

    if (error.code === "P2003") {
      return errorResponse(409, "La relación indicada no existe.", {
        code: error.code,
        field: error.meta?.field_name ?? null,
      });
    }

    if (error.code === "P2025") {
      return errorResponse(404, "Registro no encontrado.", {
        code: error.code,
      });
    }

    return errorResponse(400, "Error de base de datos.", {
      code: error.code,
      meta: error.meta ?? null,
    });
  }

  console.error(error);

  return errorResponse(500, "Error interno del servidor.");
}
