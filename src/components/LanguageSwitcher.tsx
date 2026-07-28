"use client";

import { Languages, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SupportedLocale = "en" | "es";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Common");

  const [changing, setChanging] = useState(false);

  async function changeLanguage(nextLocale: SupportedLocale) {
    if (changing || nextLocale === locale) return;

    try {
      setChanging(true);

      const response = await fetch("/api/locale", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: nextLocale,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update language");
      }

      router.refresh();
    } catch (error) {
      console.error("LANGUAGE CHANGE ERROR:", error);
    } finally {
      setChanging(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {changing ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
      ) : (
        <Languages className="h-4 w-4 text-gray-500" />
      )}

      <select
        value={locale}
        disabled={changing}
        onChange={(event) =>
          changeLanguage(event.target.value as SupportedLocale)
        }
        aria-label={t("language")}
        className="h-9 rounded-lg border border-[#ededed] bg-white px-3 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="en">{t("english")}</option>
        <option value="es">{t("spanish")}</option>
      </select>
    </div>
  );
}
