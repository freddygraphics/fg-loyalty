import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  // 🔐 Clave fija (env luego)
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("admin", "true", {
    httpOnly: true,
    path: "/",
  });

  return res;
}
