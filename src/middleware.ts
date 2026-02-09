import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo proteger dashboard si el negocio TIENE PIN
  if (pathname.startsWith("/business/") && pathname.includes("/dashboard")) {
    // ⚠️ por ahora no protegemos nada
    return NextResponse.next();
  }

  return NextResponse.next();
}
