import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const supportedLocales = ["en", "es"] as const;

type SupportedLocale = (typeof supportedLocales)[number];

function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();

  const cookieLocale = cookieStore.get("fideliza_locale")?.value;

  const locale: SupportedLocale =
    cookieLocale && isSupportedLocale(cookieLocale) ? cookieLocale : "en";

  const messages =
    locale === "es"
      ? (await import("./es")).default
      : (await import("./en")).default;

  return {
    locale,
    messages,
  };
});
