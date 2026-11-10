import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

// ไม่มี session/cookie จึงใช้ใน "use cache" ได้ · สิทธิ์เท่ากับ anon (RLS เห็นแค่ข้อมูลสาธารณะ)
export function createPublicClient() {
  return createSupabaseClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
