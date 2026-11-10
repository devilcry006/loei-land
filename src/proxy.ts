import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16: middleware เปลี่ยนชื่อเป็น proxy · ตอนนี้ทำแค่ locale routing (guard /admin เพิ่มใน P4-01)
export default createMiddleware(routing);

export const config = {
  // ข้าม api, ไฟล์ภายในของ Next/Vercel, ไฟล์ที่มีนามสกุล (favicon, รูป) และ /admin (ไม่มี locale)
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
