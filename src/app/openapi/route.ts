import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { requireApiAdmin } from "@/lib/api/auth";
import { handleApiError } from "@/lib/api/http";
import { buildOpenApiDocument } from "@/lib/api/openapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getOriginFromHeaders(headerList: Headers) {
  const host =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export async function GET() {
  try {
    await requireApiAdmin();
    const headerList = await headers();
    const origin = getOriginFromHeaders(headerList);

    return NextResponse.json(buildOpenApiDocument(origin));
  } catch (error) {
    return handleApiError(error);
  }
}
