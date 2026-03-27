import { NextResponse } from "next/server";
import { getResourceDocs } from "@/lib/api/resources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);

  return NextResponse.json({
    name: "Movida Deportiva TV API",
    baseUrl: `${url.origin}/api`,
    docs: {
      listAllResources: `${url.origin}/api`,
      collectionExample: `${url.origin}/api/usuarios`,
      itemExample: `${url.origin}/api/usuarios/1`,
    },
    queryParams: {
      limit: "Entero entre 1 y 100. Por defecto 50.",
      offset: "Entero mayor o igual a 0. Por defecto 0.",
      all: 'Si es "true", devuelve todos los registros sin paginar.',
    },
    endpoints: getResourceDocs(url.origin),
  });
}
