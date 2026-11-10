import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // /admin ไม่มี locale จึงต้องข้าม
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
