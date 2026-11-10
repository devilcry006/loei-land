function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env ${name} — ดู .env.example`);
  return value;
}

// ต้องอ้าง process.env.NEXT_PUBLIC_* ตรง ๆ ไม่อย่างนั้น Next จะไม่แทนค่าให้ใน bundle ฝั่งเบราว์เซอร์
export const supabaseUrl = () =>
  required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabasePublishableKey = () =>
  required(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
