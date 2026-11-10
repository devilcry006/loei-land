# Loeiland — Tasks & Progress

> ไฟล์นี้คือแหล่งอ้างอิงหลักของ **สถานะงาน** · เหตุผลและการออกแบบอยู่ที่ [`PLAN.md`](./PLAN.md)
>
> โครงสร้าง: **เฟส** (P0–P5) → **task** (`P1-03`) → **subtask** (`- [ ]`)
>
> - ติ๊ก subtask `- [x]` ทันทีที่ทำเสร็จแต่ละข้อ
> - subtask ครบแล้ว → ติ๊กหัวข้อ task (`- [x] **P1-03** …`) + แก้ตัวเลขในตารางสถานะเฟส
> - จบรอบการทำงานแต่ละครั้ง → อัปเดตส่วน **"📍 ทำถึงไหนแล้ว"** และเพิ่มบรรทัดใน **"บันทึกความคืบหน้า"**
> - commit อ้างรหัส task เช่น `P1-03: seed districts and starter properties`

---

## 📍 ทำถึงไหนแล้ว

> อัปเดตทุกครั้งที่จบรอบการทำงาน — คนหรือ Claude ที่มาทำต่อจะอ่านส่วนนี้ก่อน

- **เฟสปัจจุบัน:** P1 🟨 (branch `p1-schema` ยังไม่ merge · P1-01, P1-02 เสร็จ)
- **task ที่กำลังทำ:** —
- **ขั้นต่อไป:** P1-03 seed (14 อำเภอ + ตำบล, POI จาก landmark ใน mockup, ทรัพย์ 5 แปลง) · เริ่ม `pnpm db:start` ก่อนทุกครั้ง
- **ค้างอยู่ / รอคนตัดสินใจ:** `pnpm db:test` ยังไม่อยู่ใน CI (รอ M1-05) · บัญชี Supabase cloud / Vercel / Sentry + push CI ย้ายไป M1-05 แล้ว · D-2, D-3, D-5, D-6 ต้องเสร็จก่อน 🚀 M1 · D-1 (Longdo) ไม่บล็อก M1 เพราะ M1 ไม่มีแผนที่
- **หมายเหตุสำหรับรอบถัดไป:**
  - `cacheComponents: true` เปิดอยู่ → แคชด้วย `"use cache"` / `cacheTag` ไม่ใช่ `revalidate` แบบเดิม
  - `pnpm-workspace.yaml` ตั้ง `ignoredBuiltDependencies: sharp` → ต้องอนุญาตให้ build `sharp` ใน M1-02
  - `AGENTS.md` ถูกเขียนซ้ำโดย `next dev` ให้ commit ไว้ อย่าลบ
  - Supabase local: key ใน `.env.local` เป็นค่าตั้งต้นของ local · เลือก client ตามตารางใน `CLAUDE.md` (หน้าสาธารณะใช้ `createPublicClient` เพื่อให้แคชได้) · แก้ schema แล้วรัน `pnpm db:types`
  - ใช้ `pnpm typecheck` เสมอ (ลบ type เก่าใน `.next/dev/types` + typegen ให้แล้ว) อย่ารัน `tsc` ตรง ๆ · รัน `pnpm check` ก่อน commit
  - Tailwind v4 ตัด CSS variable ที่ไม่มี class ใช้ทิ้ง จึงใช้ `@theme static` · ปุ่ม/ช่องกรอกสูง 44px (mockup ใช้ 38px) เพื่อให้แตะบนมือถือได้
  - i18n: `<html>` อยู่ใน `app/[locale]/layout.tsx` · `app/layout.tsx` แค่คืน children · `app/not-found.tsx` มี `<html>` ของตัวเอง (404 ชั่วคราว ทำเต็มใน P1-08) · ทุกหน้าใต้ `[locale]` ต้องเรียก `setRequestLocale(locale)` ถึงจะ static ได้
  - schema: enum เก็บรหัสอังกฤษ (`property_type`, `listing_status`, `crm_status` ฯลฯ) ป้าย th/en ต้องไปอยู่ใน messages · ข้อความทรัพย์เป็นคู่ `_th`/`_en` (`_en` ว่างได้ → fallback) · `code`/`slug`/`zone_lat/lon` ว่างได้จนกว่าจะเผยแพร่ (check `approved_is_publishable` บังคับตอน approved) · subdistrict อ้างด้วย slug แบบ fk คู่ `(district, subdistrict)`
  - RLS: anon ถูก revoke ทุกสิทธิ์ (รวม default privileges) ยกเว้น select 5 ตารางสาธารณะ → ตารางใหม่ต้อง `grant` เอง · test RLS อยู่ใน `supabase/tests/` รันด้วย `pnpm db:test` · seed แอดมิน: insert `auth.users` id ลง `admins` ด้วย secret key/SQL
  - Chrome headless บังคับความกว้างขั้นต่ำประมาณ 500px ภาพ screenshot มือถือจึงดูล้นจอ ให้ใช้ device emulation ของ Playwright แทน

---

## ตารางสถานะเฟส

ลำดับ (แผนเปิดตัวแบบย่อ):

```
P0 → P1 → P3 บางส่วน (P3-01, 02, 03, 06) → 🚀 M1 เปิดตัวแบบย่อ → (P2 ∥ P3 ที่เหลือ) → P4 → P5 เปิดตัวเต็ม
```

ช่วงก่อน P4 แอดมินใส่ทรัพย์ผ่าน Supabase dashboard + เครื่องมือใน M1 · P4 ต้องรอ P3 ครบ

| เฟส                     | สถานะ    | task เสร็จ/ทั้งหมด |
| ----------------------- | -------- | ------------------ |
| P0 ตั้งต้น              | ✅ เสร็จ | 6/6                |
| P1 ข้อมูล + หน้าสาธารณะ | 🟨       | 2/8                |
| P3 บางส่วน (ก่อน M1)    | ⬜       | 0/4                |
| 🚀 M1 เปิดตัวแบบย่อ     | ⬜       | 0/6                |
| P2 แผนที่ Longdo        | ⬜       | 0/5                |
| P3 ที่เหลือ (P3-04, 05) | ⬜       | 0/2                |
| P4 หลังบ้านแอดมิน       | ⬜       | 0/7                |
| P5 SEO + เปิดตัวเต็ม    | ⬜       | 0/8                |

สัญลักษณ์: ⬜ ยังไม่เริ่ม · 🟨 กำลังทำ · ✅ เสร็จ · ⛔ ติดบล็อก

---

## P0 — ตั้งต้น

**เสร็จเมื่อ:** URL production เปิด `/th` และ `/en` ได้ · PR ผ่าน CI (typecheck + lint + test + build)

- [x] **P0-01** scaffold Next.js
  - [x] `pnpm dlx create-next-app@latest` เลือก TS, ESLint, Tailwind, App Router, `src/`, alias `@/*`
  - [x] ลบ boilerplate (หน้าแรก โลโก้ CSS ตัวอย่าง ฟอนต์ Geist ไฟล์ใน `public/`)
  - [x] ตรวจเวอร์ชัน Next.js / Tailwind ที่ได้ และจดไว้ใน "บันทึกการตัดสินใจ"
  - [x] `pnpm dev` เปิดหน้าเปล่าได้ + lint / typecheck / build ผ่าน
- [x] **P0-02** design tokens + UI primitives
  - [x] ยกตัวแปร `:root` จาก `mock-up.html` ไปไว้ใน `@theme static` ของ `globals.css` (เพิ่ม `brand-dark`, `note`, `note-ink` ที่ mockup ใช้แบบ hardcode)
  - [x] ตั้งฟอนต์ Noto Sans Thai ด้วย `next/font` ใน root layout (subset thai + latin)
  - [x] สร้าง `components/ui/Button`, `Field` (+ `Input` `Select` `Textarea`), `Badge` ที่ใช้ token + `lib/cn.ts`
  - [x] หน้าทดสอบ token ชั่วคราว ดูสีครบ (screenshot desktop/มือถือ) แล้วลบทิ้ง
- [x] **P0-03** next-intl
  - [x] `pnpm add next-intl` (4.14.9) + `src/i18n/routing.ts` (`locales: ['th','en']`, `defaultLocale: 'th'`, prefix ทุก locale) + `request.ts` + `navigation.ts`
  - [x] `src/proxy.ts` ใช้ middleware ของ next-intl (ข้าม `api`, `admin`, `_next`, ไฟล์ที่มีนามสกุล)
  - [x] `src/app/[locale]/layout.tsx` (มี `<html lang>`, ฟอนต์, metadata ตามภาษา, `setRequestLocale`) + `messages/th.json`, `messages/en.json` + type ของ key ข้อความใน `src/global.d.ts`
  - [x] `/` redirect ไป `/th` (หรือ `/en` ถ้าเบราว์เซอร์ตั้งภาษาอังกฤษ) · `/th` และ `/en` เป็นหน้า static · URL ผิดได้ 404
- [x] **P0-04** Supabase (local บน Docker — project บน cloud ย้ายไป M1-05)
  - [x] `pnpm add -D supabase` (CLI 3.1) + `supabase init` + `pnpm db:start` รันได้ในเครื่อง (Postgres 17) · ปิด sign-up สาธารณะ, ปิด edge runtime / analytics, site_url = `localhost:5173`
  - [x] `.env.local` ใส่ URL + publishable key + secret key ของ Supabase local
  - [x] `@supabase/supabase-js` 2.119 + `@supabase/ssr` 0.12 · `client.ts` (browser), `server.ts` (cookie), `public.ts` (ไม่มี cookie ใช้กับ `"use cache"`) + `database.types.ts`
  - [x] `admin.ts` (secret key) มี `import "server-only"` · Vitest แทน `server-only` ด้วย stub
  - [x] ทดสอบเชื่อมต่อ DB local ได้จริง (admin เรียก Auth admin API ได้ / public เรียกไม่ได้) + เพิ่มคำสั่ง `db:*` ใน `CLAUDE.md` / README

- [x] **P0-05** env + เครื่องมือคุณภาพโค้ด
  - [x] `.env.example` ครบตาม `PLAN.md` §7 (+ `IP_HASH_SALT`, `ADMIN_NOTIFY_EMAIL`) · `.env.local` จริงรอสร้างตอน P0-04
  - [x] `.gitignore` ครอบ `.env*` (ยกเว้น `.env.example`), `.next`, `node_modules`, `.vercel`
  - [x] ESLint `react/no-danger: error` + ห้าม import `next/link` ใต้ `src/` · Prettier (+ plugin tailwind) · Vitest 5 (+ test `cn` และ test key ข้อความ th/en ตรงกัน)
  - [x] scripts: `lint`, `typecheck`, `test`, `format`, `check` รันผ่านทั้งหมด
  - [x] README: ติดตั้ง → ตั้ง env → `pnpm dev` + ตารางคำสั่ง
  - [x] อัปเดตส่วน Commands ใน `CLAUDE.md` ให้ตรงของจริง

- [x] **P0-06** CI (ส่วน deploy / monitoring / branch protection ย้ายไป M1-05)
  - [x] GitHub Actions (`.github/workflows/ci.yml`): install → lint → typecheck → test → format:check → build บนทุก PR และ push เข้า main · Node จาก `.nvmrc` (24) · จำลองใน clone ใหม่ผ่านแล้ว

## P1 — ข้อมูล + หน้าสาธารณะ

**เสร็จเมื่อ:** หน้าแรกแสดงทรัพย์จาก DB กรองได้ครบ 6 ตัวกรองเหมือน mockup · `curl /th/property/<slug>` ได้ HTML ที่มีเนื้อหาครบ · contract test ยืนยันว่า query สาธารณะไม่คืนฟิลด์ลับ

- [x] **P1-01** migration schema
  - [x] ตาราง `properties` (รวม `total_wah` generated + index `state`, `district`, `total_wah`)
  - [x] ตาราง `property_private`, `property_photos`
  - [x] ตาราง `leads`, `buyer_requests`, `crm_events`, `audit_log`
  - [x] ตาราง `districts`, `subdistricts`, `poi` + `admins` (รายชื่อแอดมินสำหรับ RLS)
  - [x] trigger `updated_at` + generate TypeScript types (`pnpm db:types`)
- [x] **P1-02** RLS
  - [x] เปิด RLS ทุกตาราง (ทำไว้ใน migration ของ P1-01 เพื่อให้ deny by default ตั้งแต่แรก)
  - [x] policy anon: `properties` เฉพาะ approved · รูปของทรัพย์ approved · `districts`/`subdistricts`/`poi`
  - [x] policy แอดมิน (ตรวจจากตาราง `admins` ผ่าน `is_admin()`) · `crm_events`/`audit_log` เพิ่มได้อย่างเดียว
  - [x] test: anon อ่าน `property_private` / `leads` / ทรัพย์ pending ไม่ได้ · anon insert ตรงไม่ได้ (pgTAP 30 ข้อ `pnpm db:test`)
  - [ ] เพิ่ม `pnpm db:test` เข้า CI (ต้อง `supabase start` ใน runner) — ทำพร้อม M1-05 ตอน push แล้วดู CI จริง
- [ ] **P1-03** seed
  - [ ] 14 อำเภอ (ชื่อไทย/อังกฤษ, จุดกลาง) + ตำบล
  - [ ] POI จาก landmark ใน mockup
  - [ ] ทรัพย์ 5 แปลงจาก `starterProperties` (แยกส่วนลับไป `property_private`)
  - [ ] `supabase db reset` รันแล้วได้ข้อมูลครบ
- [ ] **P1-04** `lib/land.ts`
  - [ ] แปลงหน่วย ไร่-งาน-ตร.ว. ⇄ ตร.ว. รวม + ข้อความแสดงผล th/en
  - [ ] ราคา/ไร่, ราคา/ตร.ว., format เงินบาท (`Intl.NumberFormat`)
  - [ ] haversine distance
  - [ ] unit test ครอบทุกฟังก์ชัน (รวมกรณีขนาด 0)
- [ ] **P1-05** ย้าย copy
  - [ ] ดึง object `i18n` จาก mockup ไปไว้ใน `messages/th.json` / `en.json` แบ่ง namespace
  - [ ] ตรวจว่า key สองภาษาตรงกัน (script หรือ test)
- [ ] **P1-06** หน้าแรก + ตัวกรอง
  - [ ] data layer: query ทรัพย์ approved ด้วยการเลือกคอลัมน์ชัดเจน (ไม่ `select *`)
  - [ ] การ์ดทรัพย์ (รูป, ป้ายสถานะ, ราคา, ขนาด, ราคา/ไร่, ราคา/ตร.ว.)
  - [ ] ตัวกรอง 6 แบบเก็บใน query string · ตำบลขึ้นกับอำเภอ · ปุ่มล้างตัวกรอง
  - [ ] มือถือ: ตัวกรองเป็น bottom sheet · empty state
  - [ ] ผลกรองตรงกับ mockup บนข้อมูล seed เดียวกัน
- [ ] **P1-07** หน้าทรัพย์ `/[locale]/property/[slug]`
  - [ ] ISR + `generateStaticParams` + 404 เมื่อไม่ใช่ approved
  - [ ] gallery, ตารางข้อมูล, จุดเด่น, สถานที่ใกล้เคียง (POI + ระยะ), หมายเหตุข้อมูล
  - [ ] ปุ่มโทร/LINE ติดขอบล่างบนมือถือ
  - [ ] contract test: HTML ของหน้าไม่มีชื่อ/เบอร์เจ้าของ พิกัดจริง หรือเลขโฉนด
- [ ] **P1-08** layout
  - [ ] header (โลโก้, เมนู ฝากขาย/ต้องการซื้อ, ปุ่ม Facebook/LINE) + footer
  - [ ] ปุ่มสลับภาษาที่คงหน้าเดิมไว้
  - [ ] หน้า 404 / error สองภาษา

## 🚀 M1 — เปิดตัวแบบย่อ

**ต้องเสร็จก่อน:** P0 ทั้งหมด · P1 ทั้งหมด · P3-01, P3-02, P3-03, P3-06
**เสร็จเมื่อ:** เว็บอยู่บนโดเมนจริง · มีทรัพย์จริงขึ้นเว็บ · ส่งฟอร์มสนใจทรัพย์แล้วเข้า DB + แอดมินได้ LINE · view-source หน้าสาธารณะไม่มี PII / พิกัดจริง
**ยังไม่มีในรอบนี้:** แผนที่ (P2), ฟอร์มฝากขาย / ต้องการซื้อ (P3-04, P3-05), หลังบ้าน (P4)

- [ ] **M1-01** ฟังก์ชันเผยแพร่ทรัพย์ฝั่ง DB (ใช้แทนหลังบ้านไปก่อน)
  - [ ] SQL function `publish_property(id)` (security definer, เรียกได้เฉพาะ service role / แอดมิน): เบลอพิกัด 500–1,000 ม. จาก `property_private` → สร้าง `code` + `slug` → `state='approved'`, `published_at`
  - [ ] test: ระยะเบลออยู่ในช่วงเสมอ · anon เรียกไม่ได้
  - [ ] วิธีใส่ทรัพย์ใหม่ทีละขั้น (insert 2 ตาราง → อัปรูป → เรียก `publish_property`) เขียนไว้ใน `docs/ADMIN-MANUAL.md`
  - [ ] สั่ง revalidate cache หลังเผยแพร่ (route handler ที่ต้องใช้ secret หรือ database webhook)
  - [ ] P4-03 ต้องเรียกฟังก์ชันเดียวกันนี้ ห้ามเขียน logic เบลอซ้ำ
- [ ] **M1-02** script อัปโหลดรูป (ห้ามอัปรูปผ่าน Supabase dashboard ตรง ๆ เพราะ EXIF GPS จะติดไปด้วย)
  - [ ] อนุญาตให้ build `sharp` ใน `pnpm-workspace.yaml`
  - [ ] `pnpm photos:upload <code> <ไฟล์...>`: `sharp` หมุนตาม EXIF → ลบ metadata → ย่อขนาด → อัปขึ้น Storage → insert `property_photos`
  - [ ] test: รูปที่มี GPS เมื่ออัปแล้วไม่มี GPS เหลือ
  - [ ] P3-04 / P4-04 ต้องใช้ฟังก์ชันประมวลผลรูปชุดเดียวกันนี้
- [ ] **M1-03** SEO ขั้นต่ำ (ยกบางส่วนของ P5-01 / P5-02 มาก่อน)
  - [ ] `generateMetadata` หน้าแรก + หน้าทรัพย์
  - [ ] OG image หน้าทรัพย์ (ทดสอบด้วย Facebook Sharing Debugger)
  - [ ] `sitemap.ts` + `robots.ts`
- [ ] **M1-04** `/privacy` + `/terms` ฉบับแรก (ขยายจาก drawer ใน mockup · ให้ผู้รู้ตรวจตาม D-6)
- [ ] **M1-05** เตรียมของจริง (รวมส่วนที่ข้ามจาก P0-04 / P0-06)
  - [ ] push branch แล้วดูว่า CI บน GitHub เขียวจริง + ตั้ง branch protection ของ `main` ให้ต้องผ่าน CI
  - [ ] Supabase project บน cloud (region สิงคโปร์) → `supabase link` → `supabase db push` → ใส่ key ใน env ของ Vercel
  - [ ] Vercel Pro + เชื่อมรีโป + preview deploy ต่อ PR + ตั้ง env (D-2)
  - [ ] Sentry (`@sentry/nextjs`) ทดลองโยน error แล้วเห็นใน dashboard
  - [ ] ชี้โดเมน + HTTPS · production URL เปิด `/th` `/en` ได้
  - [ ] LINE OA / เพจ Facebook จริง + ใส่ลิงก์ใน env (D-3)
  - [ ] ใส่ทรัพย์จริงอย่างน้อย 10 แปลงพร้อมรูป (ตัวเลขนี้ปรับได้)
  - [ ] ส่ง sitemap เข้า Google Search Console
- [ ] **M1-06** smoke test บน production
  - [ ] view-source หน้าแรก / หน้าทรัพย์: ไม่มีชื่อ เบอร์ พิกัดจริง เลขโฉนด
  - [ ] ส่งฟอร์มสนใจทรัพย์จริง → เข้า `leads` + LINE เด้ง
  - [ ] เปิดบนมือถือจริง (Android + iPhone) ใช้ได้ครบ
  - [ ] Sentry รับ error จาก production ได้

## P2 — แผนที่ Longdo (ขนานกับ P3)

**เสร็จเมื่อ:** หมุดเปลี่ยนตามตัวกรอง · ไม่มี request ไป `tile.openstreetmap.org` · SDK ยังไม่โหลดจนกว่าจะเปิดแผนที่

- [ ] **P2-01** โหลด SDK
  - [ ] ขอ key ที่ Longdo console + จำกัด referrer (localhost, preview, production)
  - [ ] component client-only โหลด script แบบ lazy + type ขั้นต่ำของ API ที่ใช้
  - [ ] ยืนยันใน Network tab ว่าไม่โหลดจนกว่าจะเปิดแผนที่
- [ ] **P2-02** หมุด + โซน
  - [ ] หมุดจาก `zone_lat/lon` + วงกลมรัศมี `zone_radius_m`
  - [ ] layer POI แยกไอคอน
  - [ ] ปุ่ม zoom / กลับจุดกลางจังหวัด + ข้อความ "แผนที่แสดงโซน ไม่ใช่พิกัดจริง"
- [ ] **P2-03** popup preview
  - [ ] รูปปก, ชื่อ, ราคา, ขนาด → ลิงก์ไปหน้าทรัพย์
  - [ ] ใช้งานด้วยการแตะบนมือถือได้ (ไม่พึ่ง hover อย่างเดียว)
- [ ] **P2-04** sync
  - [ ] ตัวกรองเปลี่ยน → หมุดเปลี่ยนตาม
  - [ ] hover/เลือกการ์ด ⇄ ไฮไลต์หมุด
- [ ] **P2-05** layout
  - [ ] มือถือ: ปุ่มลอยสลับรายการ ⇄ แผนที่เต็มจอ
  - [ ] เดสก์ท็อป: 2 คอลัมน์แบบ mockup (แผงซ้าย + แผนที่)

## P3 — ฟอร์มสาธารณะ

> P3-01, P3-02, P3-03, P3-06 ทำก่อน M1 · P3-04, P3-05 ทำหลัง M1 (ขนานกับ P2)
> **เสร็จเมื่อ:** ส่งครบ 3 ฟอร์มแล้วข้อมูลเข้าตารางถูกต้อง · PII ของเจ้าของอยู่ใน `property_private` เท่านั้น · แอดมินได้รับ LINE · ยิงฟอร์มซ้ำถี่ ๆ ถูก rate limit

- [ ] **P3-01** Zod schemas (`lib/schemas/`)
  - [ ] lead, submit-property, buyer-request (ข้อความ error สองภาษา)
  - [ ] ค่าคงที่ประเภททรัพย์ / วัตถุประสงค์ / `CONSENT_VERSION`
  - [ ] unit test กรณีถูก/ผิด
- [ ] **P3-02** pipeline กลางของ Server Action
  - [ ] ยืนยัน Turnstile token ฝั่ง server
  - [ ] rate limit ต่อ IP (Upstash) + ทำ ip hash (มี salt จาก env)
  - [ ] helper ห่อ action: validate → turnstile → rate limit → handler → ผลลัพธ์แบบมี type
- [ ] **P3-03** ฟอร์ม lead
  - [ ] UI ในหน้าทรัพย์ (RHF + Turnstile + consent)
  - [ ] action เขียน `leads` พร้อม `property_id`, consent, ip hash
  - [ ] toast สำเร็จ/ผิดพลาด
- [ ] **P3-04** ฟอร์มฝากขาย `/submit`
  - [ ] UI 3 สเต็ป (เจ้าของ → ทรัพย์ → รูป + consent) · `inputmode="numeric"` ช่องตัวเลข
  - [ ] action สร้าง `properties(state='pending')` + `property_private` ในครั้งเดียว
  - [ ] อัปโหลดรูป: ตรวจชนิด/ขนาด → ใช้ฟังก์ชันประมวลผลรูปจาก M1-02 → Storage
- [ ] **P3-05** ฟอร์มต้องการซื้อ `/buyer-request`
  - [ ] UI (เลือกแปลงที่สนใจได้, งบ, โซน, ขนาด, วัตถุประสงค์, เงื่อนไข)
  - [ ] action เขียน `buyer_requests`
- [ ] **P3-06** แจ้งเตือนแอดมิน
  - [ ] LINE push (ข้อความสั้น + ลิงก์ไปหลังบ้าน ไม่ใส่เบอร์ในข้อความ)
  - [ ] อีเมลสำรองผ่าน Resend
  - [ ] แจ้งเตือนล้มต้องไม่ทำให้ฟอร์มล้ม (log ไป Sentry แทน)

## P4 — หลังบ้านแอดมิน

**เสร็จเมื่อ:** submit ทรัพย์ทดสอบ → เห็นในคิว → อนุมัติ → ทรัพย์ขึ้นเว็บด้วยพิกัดที่ **ไม่ตรง** กับพิกัดจริง · เปิดดูเบอร์แล้วมีแถวใน `audit_log`

- [ ] **P4-01** auth
  - [ ] Supabase Auth email + password · ปิด public sign-up · บังคับ MFA (TOTP)
  - [ ] ตารางรายชื่อแอดมิน + สร้างบัญชีแรกด้วยมือ
  - [ ] guard `/admin/*` ฝั่ง server ทุกหน้าและทุก action (ไม่พึ่ง middleware อย่างเดียว)
  - [ ] หน้า login / logout
- [ ] **P4-02** คิวตรวจ `/admin`
  - [ ] รายการทรัพย์ pending + จำนวน lead / buyer request ใหม่
  - [ ] หน้าตรวจรายแปลง พร้อม checklist จาก mockup (ตัวตน, สิทธิ์ขาย, เอกสาร, ภาระ, ราคา, ขนาด, ทางเข้าออก, พิกัดโซน)
- [ ] **P4-03** อนุมัติ / ปฏิเสธ / แก้ไข
  - [ ] ฟังก์ชันเบลอพิกัด 500–1,000 ม. + unit test (ระยะอยู่ในช่วงเสมอ)
  - [ ] สร้าง `code` (`LL-xxxx`) + `slug` ภาษาไทย
  - [ ] อนุมัติ → `state='approved'`, `published_at`, `revalidatePath` หน้าที่เกี่ยวข้อง
  - [ ] ปฏิเสธ → `state='rejected'` (ไม่ลบ) · แก้ไขข้อมูลทรัพย์ / เปลี่ยนเป็น sold, archived
- [ ] **P4-04** จัดการรูป
  - [ ] อัปโหลดหลายรูป (ใช้ pipeline ลบ EXIF เดียวกับ P3-04)
  - [ ] เลือกรูปปก, เรียงลำดับ, ลบ, ใส่ alt
- [ ] **P4-05** CRM
  - [ ] `/admin/leads` และ `/admin/buyer-requests` ตาราง + ตัวกรองตามสถานะ
  - [ ] เปลี่ยน `crm_status` → เขียน `crm_events` + โน้ต
- [ ] **P4-06** audit
  - [ ] helper เปิดดู PII ที่เขียน `audit_log` ทุกครั้ง
  - [ ] ซ่อนเบอร์โดยค่าเริ่มต้น ต้องกด "แสดง" ถึงจะเห็น
- [ ] **P4-07** Export CSV
  - [ ] export leads / buyer requests / ทรัพย์ (BOM + escape ถูกต้อง)
  - [ ] การ export เขียน `audit_log`

## P5 — SEO + เปิดตัวเต็ม

> ส่วนที่ทำไปแล้วใน M1-03 / M1-04 / M1-05 ให้ติ๊กตามได้เลย ไม่ต้องทำซ้ำ

**เสร็จเมื่อ:** Rich Results Test ไม่มี error · Lighthouse mobile ≥ 90 · Playwright e2e ผ่าน · มีทรัพย์จริง ≥ 30 แปลง

- [ ] **P5-01** metadata
  - [ ] `generateMetadata` ทุกหน้า (เช่น "ที่ดิน 3-2-20 ไร่ โซนเชียงคาน 9.6 ล้าน | Loeiland")
  - [ ] JSON-LD `RealEstateListing` (หน้าทรัพย์) + `RealEstateAgent` (หน้าแรก)
  - [ ] hreflang th/en + canonical
  - [ ] OG image อัตโนมัติ (`opengraph-image.tsx`) ทดสอบด้วย Facebook Sharing Debugger
- [ ] **P5-02** `sitemap.ts` + `robots.ts` (ทรัพย์ approved + หน้าอำเภอ, กัน `/admin`)
- [ ] **P5-03** landing รายอำเภอ
  - [ ] `/[locale]/district/[district]` ISR 14 หน้า: คำอธิบายอำเภอ + รายการทรัพย์ + แผนที่
  - [ ] ลิงก์จากหน้าแรกและหน้าทรัพย์
- [ ] **P5-04** PDPA
  - [ ] `/privacy` + `/terms` ฉบับเต็ม (ขยายจาก drawer ใน mockup)
  - [ ] ช่องทางขอดู/ขอลบข้อมูล
  - [ ] ปุ่ม hard delete ในหลังบ้าน + เขียน `audit_log`
- [ ] **P5-05** cron retention: ลบ lead / buyer request ที่ปิดแล้วเกิน 18 เดือน
- [ ] **P5-06** Playwright e2e
  - [ ] (a) view-source หน้าสาธารณะไม่มี PII / พิกัดจริง / เลขโฉนด
  - [ ] (b) anon ใช้ publishable key ทะลุ RLS ไม่ได้
  - [ ] (c) flow submit → approve → ขึ้นเว็บ ด้วยพิกัดที่เบลอแล้ว
  - [ ] รันใน CI
- [ ] **P5-07** performance
  - [ ] Lighthouse mobile ≥ 90 ทุกหมวด บนหน้าแรก / หน้าทรัพย์ / หน้าอำเภอ
  - [ ] แก้รูป (ขนาด, `sizes`, priority) และ bundle ที่ใหญ่เกิน
- [ ] **P5-08** เปิดตัว
  - [ ] ใส่ทรัพย์จริง ≥ 30 แปลงพร้อมรูป
  - [ ] ใส่ลิงก์ Facebook / LINE จริง + ทดสอบแจ้งเตือนจริง
  - [ ] ชี้โดเมน + HTTPS · ส่ง sitemap เข้า Search Console · สร้าง Google Business Profile
  - [ ] ทุกข้อใน D-1…D-6 ปิดแล้ว

---

## บันทึกการตัดสินใจ

เรื่องที่ยังรอตัดสินใจอยู่ในตาราง D-1…D-6 ของ [`PLAN.md`](./PLAN.md#8-เรื่องที่ต้องตัดสินใจ--เสี่ยง) · ตัดสินใจแล้วให้บันทึกลงตารางนี้พร้อมเหตุผล

| วันที่     | เรื่อง             | ตัดสินใจ                                                                                                    | เหตุผล                                                                                          |
| ---------- | ------------------ | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 2026-11-10 | Stack              | Next.js + Supabase + Longdo Map                                                                             | ตาม PLAN §2                                                                                     |
| 2026-11-10 | Package manager    | pnpm                                                                                                        | เร็วกว่า npm และมีในเครื่องอยู่แล้ว                                                             |
| 2026-11-10 | เวอร์ชัน           | Next.js 16.4.6 · React 19.3 · Tailwind 4.3 (ผ่าน `@tailwindcss/turbopack`) · TypeScript 5.9                 | ได้จาก create-next-app ณ วันที่ scaffold                                                        |
| 2026-11-10 | Caching            | ใช้ `cacheComponents` ตามค่าเริ่มต้น                                                                        | เป็นแนวทางหลักของ Next 16 และใช้ revalidate ด้วย tag ตอนอนุมัติทรัพย์ได้ตรงกว่า ISR แบบตั้งเวลา |
| 2026-11-10 | เปิดตัวแบบย่อ (M1) | เปิดหลัง P0 + P1 + ฟอร์มสนใจทรัพย์ + แจ้งเตือน LINE · ใส่ทรัพย์ผ่าน SQL function + script อัปรูปแทนหลังบ้าน | ได้ URL หน้าทรัพย์ไว้แชร์และให้ Google index เร็วขึ้นหลายสัปดาห์                                |
| 2026-11-10 | ค่า enum ใน DB     | เก็บเป็นรหัสอังกฤษ (`land`, `available`, `new` …) แทนข้อความไทยแบบ mockup · ข้อความทรัพย์แยก `_th`/`_en`    | เว็บสองภาษา แปลป้ายผ่าน messages ได้ และ type ของ TS ได้ union ที่ใช้งานง่าย                    |
| 2026-11-10 | Git                | งานโค้ดทำบน branch · merge/push เข้า main เมื่อเจ้าของสั่ง                                                  |                                                                                                 |

## บันทึกความคืบหน้า

ใหม่สุดอยู่บน · 1 บรรทัดต่อรอบการทำงาน: วันที่ — ทำอะไร (รหัส task) — ค้างอะไร

- 2026-11-10 — P1-02 เสร็จ: RLS policy + `is_admin()` + revoke สิทธิ์ anon + pgTAP 30 ข้อ (`pnpm db:test`) · ค้าง: db:test ใน CI · ต่อไป P1-03
- 2026-11-10 — P1-01 เสร็จ: migration `init_schema` (11 ตาราง + enum + trigger `updated_at` + เปิด RLS ทุกตาราง) + types · ต่อไป P1-02
- 2026-11-10 — P0-04 เสร็จ: Supabase local + client 4 แบบ + script `db:*` · **P0 ครบ** · ต่อไป P1-01
- 2026-11-10 — P0-06 เสร็จ (CI) · ย้ายงานที่ต้องใช้บัญชีภายนอกไป M1-05 · P0-04 เปลี่ยนเป็น Supabase local
- 2026-11-10 — P0-05 เสร็จ (ข้าม P0-04 ไว้รอ Supabase project): `.env.example`, ESLint rules, Prettier, Vitest, `pnpm check`
- 2026-11-10 — P0-03 เสร็จ: next-intl 4.14 + `proxy.ts` · `/th` `/en` static · ต่อไป P0-04 (รอ Supabase project)
- 2026-11-10 — P0-02 เสร็จ: design tokens (`@theme static`), ฟอนต์ Noto Sans Thai, `Button` / `Field` / `Badge` · เพิ่ม milestone 🚀 M1 เปิดตัวแบบย่อ · ต่อไป P0-03
- 2026-11-10 — P0-01 เสร็จ: scaffold Next.js 16 ด้วย pnpm บน `feat/p0-setup` ลบ boilerplate · ต่อไป P0-02

- 2026-11-10 — แตก subtask ทุก task + เพิ่มส่วน "📍 ทำถึงไหนแล้ว" · ยังไม่เริ่ม P0
- 2026-11-10 — เขียนแผนใหม่ (PLAN.md + TASKS.md)
