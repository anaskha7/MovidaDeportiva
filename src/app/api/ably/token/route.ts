import { NextResponse } from "next/server";
import { createLiveChatTokenRequest } from "@/lib/ably-server";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para usar el chat en directo." },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  try {
    const tokenRequest = await createLiveChatTokenRequest(session);
    return NextResponse.json(tokenRequest, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("No se pudo emitir el token request de Ably", error);
    return NextResponse.json(
      { error: "No se pudo preparar el acceso al chat." },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
