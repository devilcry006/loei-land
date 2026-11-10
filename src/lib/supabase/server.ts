import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

// อ่าน cookie ทำให้หน้าเป็น dynamic — หน้าสาธารณะที่แคชได้ให้ใช้ ./public แทน
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component เขียน cookie ไม่ได้ ปล่อยให้ proxy / Server Action เป็นคน refresh session
        }
      },
    },
  });
}
