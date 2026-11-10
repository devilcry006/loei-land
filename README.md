# Loeiland

เว็บนายหน้าขายที่ดินและอสังหาริมทรัพย์จังหวัดเลย — Next.js 16 + Supabase + Longdo Map

- แผนและการออกแบบ: [`docs/PLAN.md`](docs/PLAN.md)
- งานและสถานะ: [`docs/TASKS.md`](docs/TASKS.md)
- spec ด้าน UX (prototype): เปิด [`docs/mock-up.html`](docs/mock-up.html) ในเบราว์เซอร์

## เริ่มต้น

ต้องมี Node.js 24 ([`.nvmrc`](.nvmrc)), [pnpm](https://pnpm.io) และ Docker (สำหรับ Supabase local)

```bash
pnpm install
pnpm db:start                # Supabase local — ครั้งแรกจะดาวน์โหลด image นาน
cp .env.example .env.local   # ใส่ API_URL / PUBLISHABLE_KEY / SECRET_KEY จาก `pnpm db:status`
pnpm dev                     # http://localhost:5173
```

## คำสั่ง

| คำสั่ง                                    | ทำอะไร                                                |
| ----------------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                                | dev server ที่ port 5173                              |
| `pnpm build` / `pnpm start`               | build และรันแบบ production                            |
| `pnpm lint`                               | ESLint                                                |
| `pnpm typecheck`                          | สร้าง route types แล้วรัน `tsc --noEmit`              |
| `pnpm test` / `pnpm test:watch`           | Vitest                                                |
| `pnpm format` / `pnpm format:check`       | Prettier                                              |
| `pnpm check`                              | lint + typecheck + test + format:check (รันก่อน push) |
| `pnpm db:start` / `db:stop` / `db:status` | Supabase local บน Docker                              |
| `pnpm db:reset`                           | ล้าง DB local แล้วรัน migration + seed ใหม่           |
| `pnpm db:types`                           | สร้าง TypeScript types จาก schema                     |
