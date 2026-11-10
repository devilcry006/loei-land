import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["th", "en"],
  defaultLocale: "th",
  // ใส่ locale ใน URL ทุกภาษา (/th, /en) เพื่อให้ Google index แยกภาษาได้
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
