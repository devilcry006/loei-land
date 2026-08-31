# Loeiland — Roadmap

> **"ทำไม" → [`PLAN.md`](./PLAN.md) · "สถานะ" → [`PROGRESS.md`](./PROGRESS.md)**
> **งานย่อยรายข้อ (checklist ที่ใช้ทำงานจริง) → [`tasks/P0.md`](./tasks/P0.md) … [`tasks/P6.md`](./tasks/P6.md)**
> **แบ่งงาน 2 สาย หน้าบ้าน/หลังบ้าน (ทำขนาน) → [`TRACKS.md`](./TRACKS.md)**

โครงสร้าง 3 ชั้น:

```
เฟส (P0–P6)         ← ไฟล์นี้: ภาพรวม + ลำดับ + เกณฑ์ว่าเฟสเสร็จ
 └ task (P1-04)      ← tasks/Pn.md: หน่วยที่นับใน PROGRESS.md (รวม 71 ข้อ)
    └ subtask [ ]    ← tasks/Pn.md: ขั้นย่อยของ task นั้น ติ๊กระหว่างทำ
```

ลำดับ: `P0 → P1 → (P2 ∥ P3 ∥ P4) → P5 → P6` — P2/P3/P4 ขนานกันได้หลัง P1 · P5 รอ P4

---

## P0 — ตั้งต้นโปรเจกต์ · [tasks/P0.md](./tasks/P0.md) · ขนาด S · 9 tasks

รางรถไฟพร้อมวิ่ง: Next.js + TS + Tailwind + next-intl, Supabase project, env, CI, deploy เปล่า

**เสร็จเมื่อ:** URL production เห็นหน้า placeholder ที่ `/th` และ `/en` · PR เปล่าผ่าน CI (typecheck + lint + build) · error เข้า Sentry

## P1 — ข้อมูล + หน้าอ่านอย่างเดียว · [tasks/P1.md](./tasks/P1.md) · ขนาด L · 15 tasks

schema + RLS + seed 5 แปลง, หน้าแรก/ค้นหา/รายละเอียด, design token, i18n, utils หน่วยที่ดิน

**เสร็จเมื่อ:** กรองครบ 6 แบบให้ผลตรง prototype · `curl /th/property/<slug>` ได้ HTML เนื้อหาเต็มโดยไม่รัน JS · contract test (public query ไม่คืนฟิลด์ลับ) เขียว

## P2 — SEO · [tasks/P2.md](./tasks/P2.md) · ขนาด M · 10 tasks · ขนานกับ P3/P4

metadata + JSON-LD + sitemap + landing 14 อำเภอ + รายประเภท + OG image

**เสร็จเมื่อ:** Rich Results Test ไม่มี error บนหน้าทรัพย์ + landing 1 อำเภอ · `curl` เห็น `og:*` + JSON-LD ครบ · Lighthouse SEO = 100

## P3 — แผนที่ Longdo · [tasks/P3.md](./tasks/P3.md) · ขนาด M · 8 tasks · ขนานกับ P2/P4

map component (lazy), หมุด + วงโซน + POI, popup, sync กับ filter + URL, มือถือสลับ list⇄map

**เสร็จเมื่อ:** filter แล้วหมุดเปลี่ยนตาม · ไม่มี request ไป `tile.openstreetmap.org` · Longdo SDK ไม่โหลดจนกว่าจะเปิดแผนที่ (ดู Network tab)

## P4 — ฟอร์มสาธารณะ · [tasks/P4.md](./tasks/P4.md) · ขนาด M · 10 tasks · ขนานกับ P2/P3

Zod + RHF + Turnstile + rate limit + Server Actions (lead / ฝากขาย / ต้องการซื้อ) + แจ้งเตือน

**เสร็จเมื่อ:** ส่งครบ 3 ฟอร์ม → แถวเข้า DB ถูกตาราง + owner PII อยู่ใน `property_private` เท่านั้น + ได้อีเมล/LINE · ยิงซ้ำเร็ว ๆ โดน rate limit · anon insert ตรง ๆ ถูก RLS ปฏิเสธ

## P5 — หลังบ้านแอดมิน · [tasks/P5.md](./tasks/P5.md) · ขนาด L · 9 tasks · รอ P4

Supabase Auth + MFA, คิวตรวจ, อนุมัติ (เบลอพิกัดอัตโนมัติ) / ปฏิเสธ, อัปโหลดรูป, CRM board, CSV, audit_log

**เสร็จเมื่อ:** submit ทรัพย์ทดสอบ → เห็นคิว → กดอนุมัติ → ทรัพย์ขึ้นเว็บด้วยพิกัดที่ **ไม่ตรง** กับที่กรอก · `property_private` ยังมีพิกัดจริง · เปิดดูเบอร์แล้วมีแถวใน `audit_log` · ไม่มี `adminPin` หลงเหลือ

## P6 — เตรียมเปิดจริง · [tasks/P6.md](./tasks/P6.md) · ขนาด M · 10 tasks

`/privacy` เต็ม, data-request + hard delete, retention cron, Sentry, Lighthouse budget, Playwright e2e, seed 30–50 แปลงจริง, เชื่อม FB/LINE จริง

**เสร็จเมื่อ:** Playwright e2e เขียวทั้ง 3 เคส (RLS leak / view-source ไม่มี PII / flow submit→approve→ปรากฏ) · Lighthouse mobile ≥ 90 ทุกหมวด · ทุกแถว decision ใน `PROGRESS.md` = ✅

---

## กติกาปิดงาน

1. ติ๊ก subtask `- [x]` ใน `tasks/Pn.md` ระหว่างทำ
2. subtask ของ task ครบ → ติ๊ก task `- [x]` (หัวข้อ `### Pn-XX`)
3. อัปเดต `PROGRESS.md`: ตัวเลขคืบหน้า + สถานะเฟส + เพิ่มบรรทัด "บันทึกความคืบหน้า"
4. commit อ้างรหัส task: `P1-04: add RLS policies for properties`
5. เจอเรื่องต้องตัดสินใจ → เพิ่มแถวตาราง "เรื่องที่ติดอยู่" ใน `PROGRESS.md` ทันที
6. `PLAN.md` ผิด → แก้ `PLAN.md` ด้วย
