import type { NextRequest } from "next/server";
import { ApiRequestError, created, handleApiError, ok, parsePagination } from "@/lib/api/http";
import { getResourceConfig } from "@/lib/api/resources";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResourceRouteContext = {
  params: Promise<{
    resource: string;
  }>;
};

interface CollectionDelegate {
  count: () => Promise<number>;
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
}

function getDelegate(delegateName: string) {
  return (prisma as unknown as Record<string, CollectionDelegate>)[delegateName];
}

function resolveConfig(resource: string) {
  const config = getResourceConfig(resource);

  if (!config) {
    throw new ApiRequestError(404, `El recurso "${resource}" no existe.`);
  }

  return config;
}

export async function GET(
  request: NextRequest,
  context: ResourceRouteContext,
) {
  try {
    const { resource } = await context.params;
    const config = resolveConfig(resource);
    const delegate = getDelegate(config.delegate);
    const { all, limit, offset } = parsePagination(request.nextUrl.searchParams);

    const findManyArgs: Record<string, unknown> = {
      orderBy: { [config.idField]: "asc" },
    };

    if (config.select) {
      findManyArgs.select = config.select;
    }

    if (!all) {
      findManyArgs.take = limit;
      findManyArgs.skip = offset;
    }

    const [total, data] = await Promise.all([
      delegate.count(),
      delegate.findMany(findManyArgs),
    ]);

    return ok({
      resource: config.resource,
      idField: config.idField,
      total,
      count: data.length,
      limit,
      offset,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  context: ResourceRouteContext,
) {
  try {
    const { resource } = await context.params;
    const config = resolveConfig(resource);
    const delegate = getDelegate(config.delegate);
    const body = await request.json();
    const parsed = (await config.createSchema.parseAsync(
      body,
    )) as Record<string, unknown>;
    const data = config.transformCreate
      ? await config.transformCreate(parsed)
      : parsed;

    const createArgs: Record<string, unknown> = { data };

    if (config.select) {
      createArgs.select = config.select;
    }

    const record = await delegate.create(createArgs);

    return created({
      resource: config.resource,
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
      Allow: "GET, POST, OPTIONS",
    },
  });
}
