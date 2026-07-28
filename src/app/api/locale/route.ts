import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supportedLocales = ["en", "es"] as const;

type SupportedLocale = (typeof supportedLocales)[number];

function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === "string" &&
    supportedLocales.includes(value as SupportedLocale)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const locale = body?.locale;

    if (!isSupportedLocale(locale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      locale,
    });

    response.cookies.set({
      name: "fideliza_locale",
      value: locale,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error) {
    console.error("LOCALE UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Unable to update language" },
      { status: 500 },
    );
  }
}
