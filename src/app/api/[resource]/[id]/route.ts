import type { NextRequest } from "next/server";
import { ApiRequestError, handleApiError, ok, parseIdParam } from "@/lib/api/http";
import { getResourceConfig } from "@/lib/api/resources";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResourceItemRouteContext = {
  params: Promise<{
    resource: string;
    id: string;
  }>;
};

interface ItemDelegate {
  findUnique: (args: Record<string, unknown>) => Promise<unknown | null>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  delete: (args: Record<string, unknown>) => Promise<unknown>;
}

function getDelegate(delegateName: string) {
  return (prisma as unknown as Record<string, ItemDelegate>)[delegateName];
}

function resolveConfig(resource: string) {
  const config = getResourceConfig(resource);

  if (!config) {
    throw new ApiRequestError(404, `El recurso "${resource}" no existe.`);
  }

  return config;
}

function buildWhere(idField: string, id: number) {
  return {
    [idField]: id,
  };
}

export async function GET(
  _request: NextRequest,
  context: ResourceItemRouteContext,
) {
  try {
    const { resource, id } = await context.params;
    const config = resolveConfig(resource);
    const delegate = getDelegate(config.delegate);
    const parsedId = parseIdParam(id, config.idField);

    const findUniqueArgs: Record<string, unknown> = {
      where: buildWhere(config.idField, parsedId),
    };

    if (config.select) {
      findUniqueArgs.select = config.select;
    }

    const record = await delegate.findUnique(findUniqueArgs);

    if (!record) {
      throw new ApiRequestError(404, "Registro no encontrado.");
    }

    return ok({
      resource: config.resource,
      data: record,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function updateRecord(
  request: NextRequest,
  context: ResourceItemRouteContext,
) {
  const { resource, id } = await context.params;
  const config = resolveConfig(resource);
  const delegate = getDelegate(config.delegate);
  const parsedId = parseIdParam(id, config.idField);
  const body = await request.json();
  const parsed = (await config.updateSchema.parseAsync(
    body,
  )) as Record<string, unknown>;

  if (Object.keys(parsed).length === 0) {
    throw new ApiRequestError(400, "El cuerpo de la petición no puede estar vacío.");
  }

  const data = config.transformUpdate
    ? await config.transformUpdate(parsed)
    : parsed;

  const updateArgs: Record<string, unknown> = {
    where: buildWhere(config.idField, parsedId),
    data,
  };

  if (config.select) {
    updateArgs.select = config.select;
  }

  const record = await delegate.update(updateArgs);

  return ok({
    resource: config.resource,
    data: record,
  });
}

export async function PUT(
  request: NextRequest,
  context: ResourceItemRouteContext,
) {
  try {
    return await updateRecord(request, context);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: ResourceItemRouteContext,
) {
  try {
    return await updateRecord(request, context);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: ResourceItemRouteContext,
) {
  try {
    const { resource, id } = await context.params;
    const config = resolveConfig(resource);
    const delegate = getDelegate(config.delegate);
    const parsedId = parseIdParam(id, config.idField);

    const deleteArgs: Record<string, unknown> = {
      where: buildWhere(config.idField, parsedId),
    };

    if (config.select) {
      deleteArgs.select = config.select;
    }

    const record = await delegate.delete(deleteArgs);

    return ok({
      resource: config.resource,
      deleted: true,
      data: record,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, PUT, PATCH, DELETE, OPTIONS",
    },
  });
}
