# CLAUDE.md

แนวทางสำหรับ Claude Code เมื่อทำงานในรีโปนี้

## รีโปนี้คืออะไรตอนนี้

Loeiland คือเว็บประกาศขายที่ดิน/อสังหาฯ ของ **จังหวัดเลย** — ยังอยู่ขั้น **ก่อน scaffold**

- `docs/mock-up.html` — prototype ไฟล์เดียว 2,631 บรรทัด (HTML/CSS/JS) เป็น **spec ด้าน UX / copy / business rule** อ้างอิงอย่างเดียว **ห้ามแก้ต่อ ห้าม build ทับ** (เดิมชื่อ `index.html`)
- `docs/PLAN.md` — "ทำไม": stack, routes, DB schema, แผน security/PDPA/SEO/mobile, ต้นทุน, เฟส
- `docs/ROADMAP.md` — "ทำอะไร" ระดับเฟส: 7 เฟส + ลำดับ + เกณฑ์ว่าเฟสเสร็จ
- `docs/tasks/P0.md`…`P6.md` — checklist ที่ใช้ทำงานจริง: 71 task (`P1-04`) แตกเป็น subtask `- [ ]`
- `docs/TRACKS.md` — มุมมองตัดขวาง: จัด 71 task เป็น 2 สาย 🟦 หน้าบ้าน / 🟥 หลังบ้าน / 🟨 ร่วม + ลำดับทำขนาน
- `docs/PROGRESS.md` — "อยู่ตรงไหน": **แหล่งความจริงเรื่องสถานะ** ตอนนี้ P0 ยังไม่เริ่ม

ยังไม่มี `package.json` / framework / โค้ดแอป การเริ่มจริงคือ task **P0-01** (`create-next-app`)

## จังหวะการทำงาน

1. ทำเฟสตามลำดับ · P2 / P3 / P4 ขนานกันได้หลัง P1 · P5 ต้องรอ P4
2. ระหว่างทำ: ติ๊ก subtask `- [x]` ใน `tasks/Pn.md`
3. ปิด task (subtask ครบ) = ติ๊กหัวข้อ `### Pn-XX` + แก้ตัวเลขคืบหน้า/สถานะเฟสใน `PROGRESS.md` + เพิ่มบรรทัดใน "บันทึกความคืบหน้า"
4. commit message อ้างรหัส task เช่น `P1-04: add RLS policies for properties`
5. เจอเรื่องต้องตัดสินใจกลางคัน → เพิ่มแถวในตาราง "เรื่องที่ติดอยู่" ของ `PROGRESS.md` ทันที · ตัดสินใจแล้วย้ายลง "บันทึกการตัดสินใจ" พร้อมเหตุผล
6. ถ้า `PLAN.md` ผิด → แก้ `PLAN.md` ด้วย อย่าให้เอกสารกับโค้ดเล่าคนละเรื่อง

เอกสารเขียนภาษาไทย เนื้อหา user-facing ก็ภาษาไทย เว็บสองภาษา (th/en)

## Commands

ยังไม่มี — ยังไม่ได้ scaffold Next.js หลัง P0-01 ชุดที่คาดว่าจะมี:

```bash
npm run dev            # dev server
npm run build          # production build (ต้องผ่าน CI)
npx tsc --noEmit       # typecheck (ต้องผ่าน CI)
npm run lint           # ESLint
```

ดู prototype ตอนนี้: เปิด `docs/mock-up.html` ในเบราว์เซอร์ตรง ๆ

## สถาปัตยกรรมที่เลือกแล้ว (ตัดสินใจแล้ว ยังไม่ได้ build)

- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind · Supabase (Postgres + Auth + Storage) · Longdo Map API v3 · next-intl (locale ใน URL) · Zod + React Hook Form · Cloudflare Turnstile · Upstash rate limit · Resend + LINE Messaging API · Sentry · deploy Vercel Pro
- **Routes:** ทุกทรัพย์มี URL ของตัวเอง (`/[locale]/property/[slug]`, ISR) — วิธี single-URL-with-drawers ของ prototype พัง SEO และการแชร์ · landing รายอำเภอ 14 หน้า (`/[locale]/district/[district]`) คือ traffic ตัวจริง
- **Design token:** ตัวแปร `:root` ใน `mock-up.html` (`--bg --paper --ink --muted --line --brand --brand-2 --soft --danger --shadow --radius`) → Tailwind theme (P0-02)
- **Data model:** array `starterProperties` (`mock-up.html:1392–1513`, ~20 ฟิลด์/แปลง) → DB schema · หน่วยไทย (ไร่/งาน/ตร.ว.) + คณิตราคา/ไร่ · ราคา/ตร.ว. เป็น spec
- **Mobile:** ออกแบบ mobile-first · **ห้ามยก** `body { overflow: hidden }` และ grid 2 คอลัมน์ desktop-only มา

## กติกาเหล็ก

**ความเป็นส่วนตัวคือตัวสินค้า** — เว็บโชว์ *โซนโดยประมาณ* ไม่เคยโชว์พิกัดจริงหรือข้อมูลระบุตัวเจ้าของ

- ข้อมูลสาธารณะกับข้อมูลลับอยู่ **คนละตาราง**: `properties` (public) vs `property_private` (พิกัดจริง, เลขโฉนด, `owner_name`, `owner_contact`, `admin_note`, consent) · `property_private` ปิดสนิทสำหรับ role `anon` ด้วย RLS · ห้าม join เบอร์เจ้าของ / พิกัดจริง / เลขโฉนด เข้าอะไรที่เสิร์ฟให้สาธารณะ
- พิกัดจริงถูกเบลอ **ฝั่ง server ตอนอนุมัติ** (สุ่มเลื่อน 500–1,000 ม.) เก็บผลใน `properties.zone_lat/lon` เท่านั้น · ไม่เชื่อค่า "โซน" ที่ client ส่งมา
- **รูปทรัพย์ต้องถูกล้าง metadata ตำแหน่ง (EXIF GPS) ฝั่ง server ตอนอัปโหลด** — re-encode รูปใหม่ ไม่เก็บ/ไม่อ่านพิกัดจากรูป (รูปที่ถ่ายด้วยมือถือฝัง GPS ไว้ = พิกัดจริงหลุดทางรูป)
- เก็บ consent เป็นข้อมูล (`consent_at` + `consent_version`) ไม่ใช่แค่ checkbox
- ฟอร์มสาธารณะ (lead / submit / buyer-request) **ไม่** insert ด้วย anon key — ผ่าน Server Action ที่รัน Zod + Turnstile + rate-limit ก่อน แล้วเขียนด้วย service role
- `SUPABASE_SERVICE_ROLE_KEY` **ห้าม** ขึ้นต้น `NEXT_PUBLIC_` และห้ามหลุดเข้า client bundle · `.env*.local` ไม่เข้า git · ดูแล `.env.example`
- **ห้าม** `dangerouslySetInnerHTML` ในหน้าแอดมิน — ข้อความที่ผู้ใช้กรอก render เป็น text เท่านั้น
- ทุกครั้งที่หน้าแอดมินอ่าน PII (`property_private` / เบอร์ lead) → เขียน `audit_log`

**ห้ามยกของพวกนี้จาก prototype** (คือเหตุผลที่ต้อง rewrite): `localStorage` เป็น datastore · `adminPin` "2468" ฝั่ง client · การยัด `innerHTML` ของ input ผู้ใช้ในคิวแอดมิน · การ merge ฟิลด์เจ้าของเข้า object ทรัพย์สาธารณะตอน approve · projection + ดึง OSM tile เองที่เขียนมือ (ผิด usage policy เชิงพาณิชย์ → Longdo)

## Skills

`.claude/skills/` vendor `frontend-design` และ `vercel-react-best-practices` (pin ใน `skills-lock.json`) · ใช้ skill perf ของ React/Next.js ตอนเขียนหรือรีวิว component
