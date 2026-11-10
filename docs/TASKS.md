# Loeiland — Tasks & Progress

> ไฟล์นี้คือแหล่งอ้างอิงหลักของ **สถานะงาน** · เหตุผลและการออกแบบอยู่ที่ [`PLAN.md`](./PLAN.md)
>
> โครงสร้าง: **เฟส** (P0–P5) → **task** (`P1-03`) → **subtask** (`- [ ]`)
> - ติ๊ก subtask `- [x]` ทันทีที่ทำเสร็จแต่ละข้อ
> - subtask ครบแล้ว → ติ๊กหัวข้อ task (`- [x] **P1-03** …`) + แก้ตัวเลขในตารางสถานะเฟส
> - จบรอบการทำงานแต่ละครั้ง → อัปเดตส่วน **"📍 ทำถึงไหนแล้ว"** และเพิ่มบรรทัดใน **"บันทึกความคืบหน้า"**
> - commit อ้างรหัส task เช่น `P1-03: seed districts and starter properties`

---

## 📍 ทำถึงไหนแล้ว

> อัปเดตทุกครั้งที่จบรอบการทำงาน — คนหรือ Claude ที่มาทำต่อจะอ่านส่วนนี้ก่อน

- **เฟสปัจจุบัน:** P0 — 🟨 กำลังทำ (branch `feat/p0-setup`)
- **task ที่กำลังทำ:** P0-01 ✅ เสร็จ
- **ขั้นต่อไป:** P0-02 design tokens + UI primitives
- **ค้างอยู่ / รอคนตัดสินใจ:** D-1…D-6 ใน `PLAN.md` §8 (ไม่บล็อก P0–P1) · ยืนยันว่าจะเปิดตัวแบบย่อหรือไม่ (ถ้าเอา ต้องจัดลำดับ task ใหม่)
- **หมายเหตุสำหรับรอบถัดไป:**
  - `cacheComponents: true` เปิดอยู่ → แคชด้วย `"use cache"` / `cacheTag` ไม่ใช่ `revalidate` แบบเดิม
  - typecheck ต้องรัน `next typegen` ก่อน `tsc --noEmit` (ให้ใส่ใน script `typecheck` ตอน P0-05)
  - `.gitignore` มี `.env*` ซึ่งกัน `.env.example` ด้วย → ต้องเพิ่ม `!.env.example` ใน P0-05
  - `pnpm-workspace.yaml` ตั้ง `ignoredBuiltDependencies: sharp` → ก่อน P3-04 ต้องอนุญาตให้ build `sharp`
  - `AGENTS.md` ถูกเขียนซ้ำโดย `next dev` ให้ commit ไว้ อย่าลบ

---

## ตารางสถานะเฟส

ลำดับ: `P0 → P1 → (P2 ∥ P3) → P4 → P5` · P2 กับ P3 ทำขนานกันได้ · P4 ต้องรอ P3

| เฟส | สถานะ | task เสร็จ/ทั้งหมด |
|---|---|---|
| P0 ตั้งต้น | 🟨 กำลังทำ | 1/6 |
| P1 ข้อมูล + หน้าสาธารณะ | ⬜ | 0/8 |
| P2 แผนที่ Longdo | ⬜ | 0/5 |
| P3 ฟอร์มสาธารณะ | ⬜ | 0/6 |
| P4 หลังบ้านแอดมิน | ⬜ | 0/7 |
| P5 SEO + เตรียมเปิดตัว | ⬜ | 0/8 |

สัญลักษณ์: ⬜ ยังไม่เริ่ม · 🟨 กำลังทำ · ✅ เสร็จ · ⛔ ติดบล็อก

---

## P0 — ตั้งต้น
**เสร็จเมื่อ:** URL production เปิด `/th` และ `/en` ได้ · PR ผ่าน CI (typecheck + lint + test + build)

- [x] **P0-01** scaffold Next.js
  - [x] `pnpm dlx create-next-app@latest` เลือก TS, ESLint, Tailwind, App Router, `src/`, alias `@/*`
  - [x] ลบ boilerplate (หน้าแรก โลโก้ CSS ตัวอย่าง ฟอนต์ Geist ไฟล์ใน `public/`)
  - [x] ตรวจเวอร์ชัน Next.js / Tailwind ที่ได้ และจดไว้ใน "บันทึกการตัดสินใจ"
  - [x] `pnpm dev` เปิดหน้าเปล่าได้ + lint / typecheck / build ผ่าน
- [ ] **P0-02** design tokens + UI primitives
  - [ ] ยกตัวแปร `:root` จาก `mock-up.html` (`--bg --paper --ink --muted --line --brand --brand-2 --soft --danger --shadow --radius`) ไปไว้ใน `@theme` ของ `globals.css`
  - [ ] ตั้งฟอนต์ Noto Sans Thai ด้วย `next/font` ใน root layout
  - [ ] สร้าง `components/ui/Button`, `Field`, `Badge` ที่ใช้ token
  - [ ] หน้าทดสอบ token ชั่วคราว ดูสีครบ แล้วลบทิ้ง
- [ ] **P0-03** next-intl
  - [ ] `npm i next-intl` + `src/i18n/routing.ts` (`locales: ['th','en']`, `defaultLocale: 'th'`, prefix ทุก locale)
  - [ ] ตั้ง middleware/proxy ของ next-intl (ตามชื่อไฟล์ของเวอร์ชัน Next.js ที่ใช้)
  - [ ] `src/app/[locale]/layout.tsx` + `messages/th.json`, `messages/en.json`
  - [ ] `/` redirect ไป `/th` · เปิด `/th` และ `/en` ได้
- [ ] **P0-04** Supabase
  - [ ] สร้าง project region สิงคโปร์ เก็บ URL + publishable key + secret key
  - [ ] `npm i @supabase/supabase-js @supabase/ssr` + `npx supabase init` + `supabase link`
  - [ ] `src/lib/supabase/client.ts` (browser) และ `server.ts` (server component, cookies)
  - [ ] `src/lib/supabase/admin.ts` (secret key) บรรทัดแรกเป็น `import 'server-only'`
- [ ] **P0-05** env + เครื่องมือคุณภาพโค้ด
  - [ ] `.env.example` ครบตาม `PLAN.md` §7 · `.env.local` จริงไม่เข้า git
  - [ ] `.gitignore` ครอบ `.env*.local`, `.next`, `node_modules`, `.vercel`
  - [ ] ESLint `react/no-danger: error` + Prettier (+ plugin tailwind) + Vitest
  - [ ] scripts: `lint`, `typecheck` (`tsc --noEmit`), `test`, `format` รันผ่านทั้งหมด
  - [ ] README: ติดตั้ง → ตั้ง env → `npm run dev`
  - [ ] อัปเดตส่วน Commands ใน `CLAUDE.md` ให้ตรงของจริง
- [ ] **P0-06** CI + deploy + monitoring
  - [ ] GitHub Actions: install → lint → typecheck → test → build บนทุก PR
  - [ ] เชื่อม Vercel + ตั้ง env ฝั่ง Vercel + preview deploy ต่อ PR
  - [ ] Sentry (`@sentry/nextjs`) ทดลองโยน error แล้วเห็นใน dashboard
  - [ ] production URL เปิด `/th` `/en` ได้

## P1 — ข้อมูล + หน้าสาธารณะ
**เสร็จเมื่อ:** หน้าแรกแสดงทรัพย์จาก DB กรองได้ครบ 6 ตัวกรองเหมือน mockup · `curl /th/property/<slug>` ได้ HTML ที่มีเนื้อหาครบ · contract test ยืนยันว่า query สาธารณะไม่คืนฟิลด์ลับ

- [ ] **P1-01** migration schema
  - [ ] ตาราง `properties` (รวม `total_wah` generated + index `state`, `district`, `total_wah`)
  - [ ] ตาราง `property_private`, `property_photos`
  - [ ] ตาราง `leads`, `buyer_requests`, `crm_events`, `audit_log`
  - [ ] ตาราง `districts`, `subdistricts`, `poi`
  - [ ] trigger `updated_at` + generate TypeScript types (`supabase gen types`)
- [ ] **P1-02** RLS
  - [ ] เปิด RLS ทุกตาราง
  - [ ] policy anon: `properties` เฉพาะ approved · รูปของทรัพย์ approved · `districts`/`subdistricts`/`poi`
  - [ ] policy แอดมิน (ตรวจจากตารางรายชื่อแอดมิน)
  - [ ] test: anon อ่าน `property_private` / `leads` / ทรัพย์ pending ไม่ได้ · anon insert ตรงไม่ได้
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

## P3 — ฟอร์มสาธารณะ (ขนานกับ P2)
**เสร็จเมื่อ:** ส่งครบ 3 ฟอร์มแล้วข้อมูลเข้าตารางถูกต้อง · PII ของเจ้าของอยู่ใน `property_private` เท่านั้น · แอดมินได้รับ LINE · ยิงฟอร์มซ้ำถี่ ๆ ถูก rate limit

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
  - [ ] อัปโหลดรูป: ตรวจชนิด/ขนาด → `sharp` re-encode ลบ EXIF → Storage
  - [ ] test: รูปที่มี GPS เมื่อเก็บแล้วไม่มี GPS เหลือ
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

## P5 — SEO + เตรียมเปิดตัว
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

| วันที่ | เรื่อง | ตัดสินใจ | เหตุผล |
|---|---|---|---|
| 2026-11-10 | Stack | Next.js + Supabase + Longdo Map | ตาม PLAN §2 |
| 2026-11-10 | Package manager | pnpm | เร็วกว่า npm และมีในเครื่องอยู่แล้ว |
| 2026-11-10 | เวอร์ชัน | Next.js 16.4.6 · React 19.3 · Tailwind 4.3 (ผ่าน `@tailwindcss/turbopack`) · TypeScript 5.9 | ได้จาก create-next-app ณ วันที่ scaffold |
| 2026-11-10 | Caching | ใช้ `cacheComponents` ตามค่าเริ่มต้น | เป็นแนวทางหลักของ Next 16 และใช้ revalidate ด้วย tag ตอนอนุมัติทรัพย์ได้ตรงกว่า ISR แบบตั้งเวลา |
| 2026-11-10 | Git | งานโค้ดทำบน branch · merge/push เข้า main เมื่อเจ้าของสั่ง | |

## บันทึกความคืบหน้า
ใหม่สุดอยู่บน · 1 บรรทัดต่อรอบการทำงาน: วันที่ — ทำอะไร (รหัส task) — ค้างอะไร

- 2026-11-10 — P0-01 เสร็จ: scaffold Next.js 16 ด้วย pnpm บน `feat/p0-setup` ลบ boilerplate · ต่อไป P0-02

- 2026-11-10 — แตก subtask ทุก task + เพิ่มส่วน "📍 ทำถึงไหนแล้ว" · ยังไม่เริ่ม P0
- 2026-11-10 — เขียนแผนใหม่ (PLAN.md + TASKS.md)
