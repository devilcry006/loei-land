import type messages from "../messages/th.json";
import type { routing } from "@/i18n/routing";

// ให้ next-intl รู้ type ของ locale และ key ข้อความ (th.json เป็นต้นแบบ)
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
