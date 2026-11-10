import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// ใช้ Link / redirect / useRouter จากไฟล์นี้แทนของ next/* เพื่อให้ใส่ locale ให้อัตโนมัติ
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
