# P0 — ตั้งต้นโปรเจกต์

| | |
|---|---|
| สถานะ | ⬜ ยังไม่เริ่ม |
| ต้องทำหลัง | — (เริ่มได้เลย) |
| ปลดล็อกให้ | ทุกเฟส |
| ขนาด | S |

## เป้าหมาย

มีโครง Next.js + Supabase ที่ deploy ขึ้นออนไลน์ได้จริง มี CI ตรวจ typecheck/lint/build และ design token ย้ายมาจาก prototype เรียบร้อย — ยังไม่มีฟีเจอร์อะไร แต่ "รางรถไฟ" พร้อมวิ่ง

## ขอบเขต

**อยู่ในเฟสนี้:** scaffold, env, design token, CI, deploy หน้าเปล่า
**ไม่อยู่ในเฟสนี้:** schema (P1), UI จริง (P1), แผนที่ (P3) — เฟสนี้ห้ามหลงไปเขียนฟีเจอร์

## Checklist

- [ ] **P0-01** ตัดสินใจ hosting — Vercel Pro (~700฿/ด) / Cloudflare Workers (ฟรี ใช้เชิงพาณิชย์ได้) / VPS ไทย (~250฿/ด)
      → Vercel Hobby **ใช้ไม่ได้** เพราะ ToS ห้ามเชิงพาณิชย์ และเว็บนายหน้าอสังหาฯ นับเป็นเชิงพาณิชย์
- [ ] **P0-02** อีเมลถาม Longdo เรื่องเงื่อนไข free tier กับการใช้เชิงพาณิชย์ (ถามตั้งแต่ตอนนี้ คำตอบใช้เวลา)
- [ ] **P0-03** `create-next-app` — App Router + TypeScript + Tailwind + ESLint + import alias `@/*`
- [ ] **P0-04** วางโครงโฟลเดอร์ `app/ components/ lib/ db/ types/` และ `.editorconfig` + Prettier
- [ ] **P0-05** ย้าย design token จาก `index.html:9-23` (`--bg --paper --ink --muted --line --brand --brand-2 --soft --danger --shadow --radius`) เข้า Tailwind theme + ตั้งฟอนต์ไทย (`Noto Sans Thai` ผ่าน `next/font`)
- [ ] **P0-06** สร้าง Supabase project (เลือก region สิงคโปร์ ใกล้ไทยสุด) + เชื่อม Supabase CLI + `supabase init`
- [ ] **P0-07** ตั้ง env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
      → ทำ `.env.example` ด้วย · ตรวจว่า `.env*.local` อยู่ใน `.gitignore` แล้ว
- [ ] **P0-08** deploy หน้าเปล่าขึ้น host ที่เลือกจาก P0-01 ให้เห็นว่าออนไลน์ได้จริง
- [ ] **P0-09** เขียน `CLAUDE.md` ที่ราก — บอกโครงโปรเจกต์, คำสั่งที่ใช้บ่อย, กติกาห้ามแตะข้อมูลลับ

## เกณฑ์ว่า "เสร็จ"

- เปิด URL production แล้วเห็นหน้าเว็บ (ไม่ใช่ 404/500)
- `npm run build` และ `npx tsc --noEmit` ผ่านทั้งคู่ใน CI
- `git grep -n "SERVICE_ROLE"` แล้ว **ไม่เจอ** ในไฟล์ที่ commit ไป และไม่มีตัวไหนขึ้นต้นด้วย `NEXT_PUBLIC_`
- สีจาก prototype ใช้ผ่าน Tailwind class ได้ เช่น `bg-brand`

## ไฟล์ที่จะแตะ

```
package.json  tsconfig.json  tailwind.config.ts  next.config.ts
.env.example  .gitignore  CLAUDE.md
app/layout.tsx  app/page.tsx  app/globals.css
supabase/config.toml
.github/workflows/ci.yml
```

## ข้อควรระวัง

- **`SUPABASE_SERVICE_ROLE_KEY` ห้ามขึ้นต้นด้วย `NEXT_PUBLIC_` เด็ดขาด** — Next.js จะ inline ค่าลง bundle ฝั่ง client แปลว่าคีย์ที่ข้าม RLS ได้ทั้งหมดจะไปโผล่ใน View Source
- อย่าเพิ่งลง dependency แผนที่ในเฟสนี้ รอ P3
- `body { overflow: hidden }` จาก prototype (`index.html:34`) **อย่าเอามา** — มันคือต้นเหตุที่เว็บใช้บนมือถือไม่ได้
