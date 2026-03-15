import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    redirectTo: "https://getfideliza.com/login",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    domain: ".getfideliza.com",
    path: "/",
    maxAge: 0, // elimina cookie
  };

  response.cookies.set("userId", "", cookieOptions);
  response.cookies.set("businessId", "", cookieOptions);

  return response;
}
