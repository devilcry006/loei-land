import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabaseUrl } from "./env";

// ข้าม RLS ทั้งหมด — ใช้เฉพาะใน Server Action / route handler หลังตรวจ input และสิทธิ์แล้ว
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error("Missing env SUPABASE_SECRET_KEY — ดู .env.example");

  return createClient<Database>(supabaseUrl(), secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
