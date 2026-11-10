# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## รีโปนี้คืออะไร

**Loeiland** — เว็บนายหน้าขายที่ดิน/อสังหาฯ ใน **จังหวัดเลย** (ที่ดินเปล่า บ้าน สวน อาคารพาณิชย์ รีสอร์ต ที่นา/ที่ไร่) ให้ผู้ซื้อค้นทรัพย์จากแผนที่แบบโซน แล้วติดต่อผ่านทีม Loeiland

สถานะ: **ยังไม่ได้ scaffold** (ยังไม่มี `package.json`) งานแรกคือ P0-01 ใน `docs/TASKS.md`

- `docs/mock-up.html` — prototype ไฟล์เดียว (~2,600 บรรทัด HTML/CSS/JS ไม่มี dependency) ใช้เป็น **spec ด้าน UX, copy และกฎทางธุรกิจ** ดูได้ด้วยการเปิดไฟล์ในเบราว์เซอร์ตรง ๆ ให้ถือเป็นเอกสารอ้างอิง อย่าแก้หรือต่อยอดไฟล์นี้
- `docs/PLAN.md` — stack, กติกาความเป็นส่วนตัว, DB schema + RLS, routes, flow ของฟอร์ม/การอนุมัติ, env, เรื่องที่ยังต้องตัดสินใจ
- `docs/TASKS.md` — checklist รายเฟส (P0–P5) และ **แหล่งอ้างอิงหลักของสถานะงาน**

**Stack:** Next.js (App Router) + TypeScript + Tailwind v4 · next-intl (locale ใน URL) · Supabase (Postgres + RLS, Auth, Storage) · Longdo Map API v3 · RHF + Zod · Turnstile + Upstash rate limit · LINE Messaging API / Resend · Vitest + Playwright · Vercel Pro — ตรวจ docs ของเวอร์ชันที่ติดตั้งจริงก่อนเขียนโค้ดทุกครั้ง (เช่น Next.js 16 เปลี่ยน `middleware.ts` เป็น `proxy.ts` และ Supabase เปลี่ยนเป็น key แบบ publishable/secret)

เนื้อหาที่ผู้ใช้เห็นเป็นภาษาไทยเป็นหลัก และเว็บรองรับสองภาษา (th/en) · เอกสารในรีโปเขียนเป็นภาษาไทย

## วิธีทำงานกับแผน (ต้องทำทุกครั้ง)

- **เริ่มงาน:** อ่านส่วน "📍 ทำถึงไหนแล้ว" ใน `docs/TASKS.md` ก่อน แล้วทำต่อจาก "ขั้นต่อไป" · ทำตามลำดับ `P0 → P1 → (P2 ∥ P3) → P4 → P5`
- **ระหว่างทำ:** ติ๊ก subtask `- [x]` ทันทีที่เสร็จแต่ละข้อ ไม่รอจนจบ task · subtask ครบแล้วให้ติ๊กหัวข้อ task และแก้ตัวเลข/สถานะในตารางสถานะเฟส
- **จบรอบการทำงาน (ก่อนส่งคำตอบสุดท้าย หรือก่อน commit):** อัปเดต "📍 ทำถึงไหนแล้ว" (เฟส, task ที่ทำอยู่, ขั้นต่อไป, สิ่งที่ค้าง, หมายเหตุให้รอบถัดไป) และเพิ่ม 1 บรรทัดใน "บันทึกความคืบหน้า"
- ต้องเพิ่ม/ตัด/แก้ subtask ระหว่างทำได้ ให้แก้ใน `TASKS.md` ให้ตรงกับงานจริง
- เจอเรื่องที่ต้องให้คนตัดสินใจ → ใส่ใน "ค้างอยู่" ของ 📍 · ตัดสินใจแล้วบันทึกลง "บันทึกการตัดสินใจ" พร้อมเหตุผล
- commit message อ้างรหัส task เช่น `P1-02: add RLS policies` และ commit การอัปเดต `TASKS.md` ไปพร้อมโค้ด
- ถ้าโค้ดต้องเบี่ยงจาก `PLAN.md` ให้แก้ `PLAN.md` ไปพร้อมกัน

## Commands

ยังไม่มี — หลัง P0 คาดว่าจะมี `npm run dev` / `build` / `lint` / `typecheck` / `test` (Vitest) และ Playwright สำหรับ e2e ให้แก้ส่วนนี้ให้ตรงกับของจริงเมื่อ scaffold เสร็จ

## สิ่งที่ mockup กำหนดไว้ (ต้องรักษาไว้ในตัวจริง)

**ฟีเจอร์ / flow** (ใน mockup แต่ละอย่างเป็น drawer บนหน้าเดียว):
- หน้าค้นหา: แผงซ้ายมีตัวกรอง (คำค้น, ประเภท, อำเภอ → ตำบล, ราคาสูงสุด, ขนาดขั้นต่ำ) + การ์ดทรัพย์ แผงขวาเป็นแผนที่ hover หมุดแล้วเห็น preview
- รายละเอียดทรัพย์: ข้อมูล, จุดเด่น, สถานที่สำคัญใกล้เคียง (คำนวณระยะ haversine จากรายการ landmark) และฟอร์ม lead "สนใจทรัพย์นี้"
- ฝากขายทรัพย์ (เจ้าของส่งเข้ามา) → เข้า **คิวรอแอดมินตรวจ** ก่อนเผยแพร่
- แจ้งต้องการซื้อ (buyer request: งบ, โซน, ขนาด, วัตถุประสงค์, เงื่อนไขถนน/ไฟ/น้ำ)
- แอดมิน: อนุมัติ/ปฏิเสธประกาศ, จัดการ lead และ buyer request ด้วยสถานะ CRM `ใหม่ → ติดต่อแล้ว → นัดดูทรัพย์ → ต่อรอง → ปิดดีล / ยกเลิก`, export CSV · checklist ตอนตรวจ: ตัวตนผู้ฝากขาย, สิทธิ์ขาย, เอกสารสิทธิ์, ภาระจำนอง, ราคา, ขนาด, ทางเข้าออก, พิกัดโซน
- หน้า Privacy/Terms ฉบับย่อ และปุ่มติดต่อ LINE / Facebook

**Data model** — ดู array `starterProperties` (`docs/mock-up.html:1392`) ฟิลด์หลัก: `id` (`LL-0001`), `title/titleEn`, `type/typeEn`, `district`, `subdistrict`, `zone`, `lat/lon` (พิกัดโซน), `price`, `rai/ngan/wah`, `frontage`, `road`, `utilities`, `deed`, `encumbrance`, `status`, `highlights[]`, `tags[]`
- ใช้หน่วยไทย 1 ไร่ = 4 งาน = 400 ตร.ว. และแสดงทั้งราคา/ไร่ และราคา/ตร.ว.
- copy สองภาษาอยู่ใน object `i18n` (`docs/mock-up.html:1556`) และ element ใช้ `data-i18n`
- design token อยู่ใน `:root` ของ mockup (`--bg --paper --ink --muted --line --brand --brand-2 --soft --danger --shadow --radius`)

## กติกาหลัก: ความเป็นส่วนตัวคือจุดขาย

- หน้าสาธารณะแสดงเฉพาะ **โซนโดยประมาณ** ห้ามเผยพิกัดจริง เลขเอกสารสิทธิ์ หรือข้อมูลติดต่อเจ้าของต่อสาธารณะ เพื่อกันผู้ซื้อติดต่อเจ้าของข้ามนายหน้า
- ข้อมูลฉบับเต็มใช้ภายในทีมเท่านั้น (นัดหมาย ตรวจเอกสาร ปิดดีล)
- ทุกฟอร์มมี checkbox ยินยอม (PDPA) และต้องเก็บ consent ไว้ด้วย (`consent_at` + `consent_version`)
- ในตัวจริง: ข้อมูลลับอยู่ใน `property_private` แยกจาก `properties` และปิดสิทธิ์ anon ด้วย RLS · เบลอพิกัดฝั่ง server ตอนอนุมัติ · re-encode รูปเพื่อลบ EXIF GPS · ฟอร์มสาธารณะเขียน DB ผ่าน Server Action ด้วย secret key เท่านั้น · secret key ห้ามขึ้นต้น `NEXT_PUBLIC_` · เปิดดู PII ต้องเขียน `audit_log` (รายละเอียดใน `docs/PLAN.md` §3–4)

## จุดที่เป็นแค่ของชั่วคราวใน mockup (ห้ามยกไปใช้ในตัวจริง)

mockup เขียนกำกับไว้เองว่าเป็น MVP และ "ควรต่อ Google Sheets หรือ backend ก่อนใช้งานจริง"
- ใช้ `localStorage` เป็นที่เก็บข้อมูล (`loeilandPendingProperties`, `loeilandApprovedProperties`, `loeilandLeads`, `loeilandBuyerRequests`) และใช้ `APP_CONFIG.googleScriptUrl` ซึ่งยังว่างอยู่
- รหัสแอดมิน `adminPin: "2468"` hardcode ไว้ฝั่ง client
- ตอน `approveSubmission` คัด object ที่ส่งมาทั้งก้อนไปเป็นประกาศสาธารณะ ซึ่งรวมชื่อ/เบอร์เจ้าของ และ lat/lon ที่ผู้ส่งกรอกเองด้วย ตัวจริงต้องแยกข้อมูลสาธารณะกับข้อมูลลับออกจากกัน
- นำ input ของผู้ใช้ไปแสดงผ่าน template string / `innerHTML`
- คำนวณ projection เองแล้วดึง tile จาก `tile.openstreetmap.org` ตรง ๆ (ไม่เหมาะกับการใช้งานเชิงพาณิชย์)
- `body { overflow: hidden }` + layout grid 2 คอลัมน์แบบ desktop — ตัวจริงต้องใช้บนมือถือได้ และทรัพย์แต่ละรายการควรมี URL ของตัวเอง (เพื่อ SEO และการแชร์)
