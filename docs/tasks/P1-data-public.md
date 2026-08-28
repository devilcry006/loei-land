# P1 — ข้อมูล + หน้าอ่านอย่างเดียว

| | |
|---|---|
| สถานะ | ⬜ ยังไม่เริ่ม |
| ต้องทำหลัง | P0 |
| ปลดล็อกให้ | P2, P3, P4 |
| ขนาด | L — เฟสใหญ่สุดของโปรเจกต์ |

## เป้าหมาย

เปิดเว็บแล้วเห็นทรัพย์จริงที่ดึงจาก Postgres กรองได้ครบทุกตัวกรองเหมือน prototype และทรัพย์แต่ละแปลงมี URL ของตัวเอง — ยังไม่มีฟอร์ม ยังไม่มีแผนที่ ยังไม่มีหลังบ้าน

## ขอบเขต

**อยู่ในเฟสนี้:** schema, RLS, seed, หน้าแรก, หน้ารายละเอียด, หน้าค้นหา, i18n
**ไม่อยู่ในเฟสนี้:** metadata/JSON-LD (P2), แผนที่ (P3), ฟอร์มใด ๆ (P4), `/admin` (P5)

## Checklist

### ฐานข้อมูล

- [ ] **P1-01** migration แรก: ตาราง `properties` + `property_private` ตาม `PLAN.md` §4.1
      → **แยกสองตารางตั้งแต่วันแรก** อย่าทำตารางเดียวแล้วคิดว่าค่อยแยกทีหลัง
- [ ] **P1-02** ตารางที่เหลือ: `property_photos`, `leads`, `buyer_requests`, `crm_events`, `audit_log`, `districts`, `poi`
- [ ] **P1-03** generated column `total_wah = rai*400 + ngan*100 + wah` + index บน `state`, `district`, `price`, `total_wah`, `slug`
      → prototype คำนวณสดทุกครั้งใน `totalWah()` (`index.html:1838`) ซึ่งกรองไม่ได้เมื่อข้อมูลเยอะ
- [ ] **P1-04** RLS policy ทุกตารางตาม `PLAN.md` §4.3 — anon เห็นได้เฉพาะ `properties` ที่ `state='approved'` เท่านั้น
- [ ] **P1-05** **ทดสอบ RLS ด้วย anon key จริง** — เขียนสคริปต์ที่พยายาม `select` จาก `property_private` และ `leads` แล้วต้อง**ล้มเหลว** เก็บไว้รันซ้ำได้
- [ ] **P1-06** seed: 5 แปลงจาก `index.html:1392-1513`, POI 6 จุดจาก `index.html:1515-1521`, อำเภอ 14 แห่ง (ดู D-5 ใน PROGRESS)
- [ ] **P1-07** `supabase gen types typescript` → `types/database.ts` + สคริปต์ npm ให้ generate ซ้ำได้

### โค้ดฝั่งแอป

- [ ] **P1-08** data access layer ใน `lib/db/` — **ทุกฟังก์ชันเป็น server-only** (ใส่ `import 'server-only'`) ไม่มี query ไหนถูกเรียกจาก client component
- [ ] **P1-09** port helper จาก prototype: `money()` (`:1811`), `sizeText()` (`:1842`), `ratePerRai()` (`:1852`), `ratePerWah()` (`:1857`) + เขียน unit test
- [ ] **P1-10** UI primitives: Button (`pill`/`primary`/`ghost`), Card, Badge, Field, Toast — ตามหน้าตาใน prototype
- [ ] **P1-11** หน้าแรก `/` — รายการทรัพย์ + ตัวกรอง 6 ตัว (คำสำคัญ, ประเภท, อำเภอ, ตำบล, ราคาสูงสุด, ขนาดขั้นต่ำ)
      → **สถานะตัวกรองเก็บใน URL search params** ไม่ใช่ useState เพื่อให้แชร์ลิงก์ผลค้นหาได้และ SSR ได้
- [ ] **P1-12** หน้า `/property/[slug]` — เนื้อหาจาก drawer เดิม (`index.html:1093-1135`) แต่เป็นหน้าเต็ม
- [ ] **P1-13** หน้า `/search` — ผลค้นหาแบบเต็มหน้า + pagination
- [ ] **P1-14** i18n th/en ด้วย `next-intl` เป็น URL prefix `/th` `/en` — port dict จาก `index.html:1556+`
- [ ] **P1-15** สถานะ empty / loading / error ทุกหน้า (prototype มีแค่ empty ที่ `index.html:1073`)

## เกณฑ์ว่า "เสร็จ"

- เพิ่มทรัพย์ใน DB แล้ว refresh เว็บ เห็นทันทีโดยไม่ต้องแก้โค้ด
- ตัวกรองทั้ง 6 ทำงานครบและ**รวมกันได้** เช่น "เชียงคาน + รีสอร์ต + ไม่เกิน 10 ล้าน"
- copy URL ที่กรองแล้วไปเปิดแท็บใหม่ ได้ผลเดิม
- สคริปต์ P1-05 รันแล้วทุกเคสที่ควร fail ต้อง fail จริง
- ดู page source ของ `/property/[slug]` แล้ว **ไม่มี** คำว่า `owner_name`, `owner_contact`, `deed_number`, `exact_lat` โผล่เลยแม้แต่ที่เดียว

## ไฟล์ที่จะแตะ

```
supabase/migrations/0001_properties.sql
supabase/migrations/0002_leads_crm.sql
supabase/migrations/0003_rls.sql
supabase/seed.sql
lib/db/properties.ts  lib/format.ts  lib/format.test.ts
types/database.ts
app/[locale]/page.tsx
app/[locale]/property/[slug]/page.tsx
app/[locale]/search/page.tsx
components/PropertyCard.tsx  components/Filters.tsx  components/ui/*
messages/th.json  messages/en.json
scripts/test-rls.ts
```

## ข้อควรระวัง

- **ตัวกรองตำบลต้องขึ้นกับอำเภอ** — prototype ทำไว้แล้วที่ `index.html:2565` อย่าลืม
- prototype เก็บ `type` เป็นสตริงไทยตรง ๆ (`"ที่ดินเปล่า"`) — ใน DB ควรเก็บเป็น slug/enum แล้วค่อย map เป็นชื่อไทย/อังกฤษตอนแสดง ไม่งั้นเปลี่ยนคำเรียกทีเดียวข้อมูลพัง
- `slug` ต้อง unique และคงที่ ถ้าแก้ชื่อประกาศแล้ว slug เปลี่ยน ลิงก์เก่าจะตาย — เก็บ slug เดิมไว้ redirect
- อย่าใช้ `dangerouslySetInnerHTML` ที่ไหนเลย (prototype ทำผิดข้อนี้ที่ `index.html:2276`)
