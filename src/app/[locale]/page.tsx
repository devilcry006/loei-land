import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import type { Locale } from "@/i18n/routing";

export default function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("HomePage");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
      <h1 className="text-2xl font-bold">Loeiland</h1>
      <p className="text-muted">{t("tagline")}</p>
    </main>
  );
}
