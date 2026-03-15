import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // eliminar cookies de sesión
  response.cookies.delete("userId");
  response.cookies.delete("businessId");

  // seguridad extra (opcional si usas JWT o session)
  response.cookies.delete("token");

  return response;
}
