# Loeiland — แผนสถาปัตยกรรม

> เอกสารนี้ตอบคำถามว่า **"ทำไม" และ "ออกแบบอย่างไร"** · ส่วน **"ทำอะไร / ถึงไหนแล้ว"** อยู่ที่ [`TASKS.md`](./TASKS.md)
> `docs/mock-up.html` คือ spec ด้าน UX / copy / business rule ใช้อ้างอิงอย่างเดียว ไม่แก้ต่อ

---

## 1. เป้าหมาย

เว็บนายหน้าที่ดินจังหวัดเลย ทำให้ (1) ผู้ซื้อหาทรัพย์เจอจาก Google/Facebook (2) ผู้ซื้อทิ้งช่องทางติดต่อให้ทีม (3) เจ้าของฝากขายเข้ามาได้ (4) แอดมินตรวจ อนุมัติ และตามลูกค้าได้จากที่เดียว

**เปิดตัว 2 จังหวะ:** 🚀 M1 เปิดตัวแบบย่อ (หน้ารายการ + หน้าทรัพย์ + ฟอร์มสนใจทรัพย์ + แจ้งเตือน LINE, ทรัพย์จริง ≥ 10 แปลง, ยังไม่มีแผนที่และหลังบ้าน) แล้วค่อยเปิดตัวเต็มหลัง P5 — รายละเอียดใน `TASKS.md`

**ตัวชี้วัดตอนเปิดตัวเต็ม:** มีทรัพย์จริง ≥ 30 แปลง · หน้าทรัพย์ติด index ใน Google · lead เข้า DB แล้วแอดมินได้รับแจ้งภายใน 1 นาที

**ยังไม่ทำในรอบแรก:** บัญชีผู้ใช้ฝั่งผู้ซื้อ/เจ้าของ, ชำระเงิน, แชทในเว็บ, แอปมือถือ, ระบบหลายนายหน้า

---

## 2. Stack

| ชั้น                | เลือก                                                                 | เหตุผล                                                                  |
| ------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Framework           | **Next.js (App Router, รุ่นเสถียรล่าสุด) + TypeScript**               | SSR/ISR ทำให้ Google เห็นเนื้อหา · ใช้ Server Actions แทน backend แยก   |
| Styling             | **Tailwind CSS v4** (config ใน CSS ด้วย `@theme`)                     | ยก design token จาก `:root` ของ mockup มาได้ตรง ๆ                       |
| i18n                | **next-intl** ใส่ locale ใน URL (`/th`, `/en`)                        | Google index ได้ทั้งสองภาษา                                             |
| DB / Auth / Storage | **Supabase** (Postgres + RLS, Auth, Storage) region สิงคโปร์          | ใช้ RLS ล็อกข้อมูลลับระดับแถว และมี auth กับที่เก็บรูปในตัว             |
| แผนที่              | **Longdo Map API v3**                                                 | ข้อมูลแผนที่ไทยครบ · มี free tier · แทนการดึง tile OSM ตรง ๆ ของ mockup |
| ฟอร์ม               | **React Hook Form + Zod** (ใช้ schema ชุดเดียวทั้ง client และ server) |                                                                         |
| กันบอท / spam       | **Cloudflare Turnstile** + rate limit (Upstash Redis)                 | ใช้กับฟอร์มสาธารณะ 3 ฟอร์ม                                              |
| แจ้งเตือนแอดมิน     | **LINE Messaging API** (push) + **Resend** (อีเมลสำรอง)               | แอดมินต้องรู้ทันทีเมื่อมี lead                                          |
| รูป                 | Supabase Storage + `sharp` (re-encode + ลบ EXIF)                      |                                                                         |
| Monitoring          | Sentry (free) + Vercel Analytics                                      |                                                                         |
| Test                | Vitest (unit) + Playwright (e2e / privacy contract)                   |                                                                         |
| Deploy              | **Vercel Pro**                                                        | แผน Hobby ห้ามใช้เชิงพาณิชย์                                            |

ต้นทุนช่วงแรกประมาณ **~750 ฿/เดือน** (Vercel Pro + โดเมน ส่วนที่เหลือใช้ free tier) · ค่าใช้จ่ายที่น่าจะเพิ่มก่อนคือ Supabase Pro ($25) เมื่อรูปเยอะขึ้น

> หมายเหตุเวอร์ชัน: ติดตั้งจริง (P0-01) ได้ **Next.js 16.4.6, React 19.3, Tailwind 4.3** · `cacheComponents` เปิดอยู่ คำว่า "ISR" ในเอกสารนี้หมายถึงหน้าที่แคชด้วย `"use cache"` + `cacheTag` และสั่ง revalidate ด้วย tag ตอนแอดมินอนุมัติ/แก้ไข · Next.js 16 เปลี่ยนชื่อ `middleware.ts` เป็น `proxy.ts` · Supabase โปรเจกต์ใหม่ใช้ key แบบ publishable/secret (`sb_publishable_…` / `sb_secret_…`) แทน anon/service_role ให้ตรวจ docs ของเวอร์ชันที่ติดตั้งจริงทุกครั้ง

---

## 3. กติกาความเป็นส่วนตัว (หัวใจของสินค้า)

เว็บแสดง **โซนโดยประมาณ** เท่านั้น ห้ามเผยพิกัดจริง เลขโฉนด หรือข้อมูลติดต่อเจ้าของ เพื่อไม่ให้ผู้ซื้อติดต่อเจ้าของโดยตรงข้ามนายหน้า

1. **แยกตาราง** `properties` (สาธารณะ) กับ `property_private` (ลับ) · ต่อให้ `select *` พลาด เบอร์เจ้าของก็ไม่หลุด
2. **เบลอพิกัดฝั่ง server ตอนอนุมัติ** สุ่มเลื่อน 500–1,000 ม. แล้วเก็บไว้ที่ `properties.zone_lat/lon` · ไม่เชื่อพิกัดที่ client ส่งมา
3. **ลบ EXIF GPS ออกจากรูป** ด้วยการ re-encode ฝั่ง server ตอนอัปโหลด
4. ฟอร์มสาธารณะ **ไม่เขียนด้วย anon/publishable key** ให้ผ่าน Server Action (Zod → Turnstile → rate limit) แล้วเขียนด้วย secret key ฝั่ง server
5. เก็บ consent เป็นข้อมูล (`consent_at`, `consent_version`) · เก็บ IP เป็น hash
6. แอดมินเปิดดู PII → เขียน `audit_log` · หน้าแอดมิน render input ผู้ใช้เป็น text เท่านั้น (ห้าม `dangerouslySetInnerHTML`)
7. PDPA: หน้า `/privacy` ฉบับเต็ม, ช่องทางขอดู/ขอลบข้อมูล, ลบ lead ที่ปิดแล้วเกิน 18 เดือนอัตโนมัติ

---

## 4. Database schema

```sql
-- enum เก็บเป็นรหัสภาษาอังกฤษ · ป้ายที่แสดงอยู่ใน messages/{th,en}.json
property_type  = land | house | orchard | commercial | resort | farm     -- ที่ดินเปล่า บ้าน สวน อาคารพาณิชย์ รีสอร์ต ที่นา/ที่ไร่
property_state = pending | approved | rejected | sold | archived
listing_status = available | viewing | offers                              -- พร้อมขาย / รับนัดดูทรัพย์ / รับข้อเสนอ (ป้ายบนการ์ด)
crm_status     = new | contacted | viewing | negotiating | won | cancelled -- ใหม่ → ติดต่อแล้ว → นัดดูทรัพย์ → ต่อรอง → ปิดดีล / ยกเลิก

-- สาธารณะ: anon อ่านได้เฉพาะ state = 'approved'
-- ข้อความสองภาษาใช้ _th (บังคับ) + _en (ว่างได้ หน้าเว็บ fallback เป็น _th)
properties (
  id uuid pk, code text unique,            -- LL-0001 · ว่างได้จนกว่าจะเผยแพร่
  slug text unique,                        -- ว่างได้จนกว่าจะเผยแพร่
  title_th, title_en, type property_type,
  district fk districts.slug, subdistrict, -- (district, subdistrict) fk subdistricts
  zone_th, zone_en,
  zone_lat, zone_lon numeric(9,6),         -- พิกัดที่เบลอแล้ว
  zone_radius_m int default 800,
  price bigint, rai int, ngan int (0–3), wah numeric(5,2) (0–<100),
  total_wah numeric generated always as (rai*400 + ngan*100 + wah) stored,
  frontage_th/_en, road_th/_en, utilities_th/_en,
  deed_type text,                          -- ประเภทเอกสาร ไม่เก็บเลข
  listing_status listing_status,
  highlights_th text[], highlights_en text[], tags text[],
  state property_state default 'pending',
  published_at, created_at, updated_at
  -- check: state='approved' ต้องมี code, slug, zone_lat/lon, published_at
)

-- ลับ 1:1 — anon ไม่มีสิทธิ์ใด ๆ · สร้างพร้อมกันตั้งแต่ตอน submit
property_private (
  property_id pk fk, exact_lat, exact_lon, deed_number,
  owner_name, owner_contact, encumbrance, admin_note,
  consent_at, consent_version, ip_hash, created_at
)

property_photos (id, property_id, storage_path unique, sort_order, is_cover, alt_th, alt_en, created_at)  -- รูปปกได้ 1 รูปต่อทรัพย์
leads           (id, property_id, name, contact, message, crm_status, consent_at, consent_version, ip_hash, created_at, updated_at)
buyer_requests  (id, name, contact, target_property_id, district, preferred_zone, budget_min, budget_max,
                 min_rai, purpose, road_need, utility_need, detail, crm_status, consent_at, consent_version, ip_hash, created_at, updated_at)
crm_events      (id, entity_type lead|buyer_request|property, entity_id, from_status, to_status, actor_id, note, created_at)
audit_log       (id, actor_id, action, entity_type, entity_id, meta jsonb, created_at)
admins          (user_id pk fk auth.users, created_at)                -- รายชื่อแอดมินสำหรับ RLS
districts       (slug pk, name_th, name_en, center_lat, center_lon)   -- 14 อำเภอ
subdistricts    (district_slug, slug, name_th, name_en)              -- pk (district_slug, slug)
poi             (id, name_th, name_en, kind, lat, lon)                -- ยกมาจาก landmark ใน mockup
```

**RLS:** anon อ่านได้แค่ `properties` (approved), รูปของทรัพย์ที่ approved, `districts`/`subdistricts`/`poi` · ตารางอื่นปิดทั้งหมด และ revoke สิทธิ์ของ anon ทุกตารางยกเว้น select 5 ตารางนั้น (ชั้นป้องกันที่สอง) · แอดมิน = authenticated + อยู่ในตาราง `admins` (`is_admin()` security definer) ทำได้ทุกอย่าง ยกเว้น `crm_events`/`audit_log` ที่ insert ได้อย่างเดียวและ `actor_id` ต้องเป็นตัวเอง · ตาราง `admins` แก้ได้ผ่าน dashboard / secret key เท่านั้น · test: `supabase/tests/rls.test.sql` (pgTAP)
`crm_status` ตาม `CRM_STATUSES` ใน mockup แต่เก็บเป็นรหัสอังกฤษ (ดู enum ด้านบน)

---

## 5. Routes

```
/[locale]                        หน้าแรก: รายการ + ตัวกรอง (ตัวกรองเก็บใน query string) + ปุ่มเปิดแผนที่   SSR
/[locale]/property/[slug]        หน้าทรัพย์รายตัว — ตัวหลักของ SEO และการแชร์                          ISR
/[locale]/district/[district]    landing รายอำเภอ 14 หน้า                                             ISR
/[locale]/submit                 ฝากขาย (ฟอร์มหลายสเต็ป)
/[locale]/buyer-request          แจ้งต้องการซื้อ
/[locale]/privacy, /terms
/admin                           คิวตรวจ (ล็อกอิน + MFA, ไม่มี locale)
/admin/properties | /admin/leads | /admin/buyer-requests
```

**มือถือมาก่อน:** หน้าแรกบนมือถือแสดงรายการเป็นหลัก มีปุ่มลอย "ดูแผนที่" · ตัวกรองเป็น bottom sheet · ปุ่มโทร/LINE ติดขอบล่างของหน้าทรัพย์ · โหลด Longdo SDK แบบ lazy เมื่อเปิดแผนที่เท่านั้น

**SEO:** `generateMetadata` ต่อหน้า, JSON-LD (`RealEstateListing`, `RealEstateAgent`), `sitemap.ts`, hreflang, OG image อัตโนมัติ (traffic หลักมาจาก Facebook)

---

## 6. Flow สำคัญ

**ฟอร์มสาธารณะ** (lead / submit / buyer-request):
`RHF + Zod + Turnstile` → Server Action → ตรวจ Zod ซ้ำ → ยืนยัน Turnstile → rate limit ต่อ IP → แยกฟิลด์ สาธารณะ/ลับ → เขียนด้วย secret key → แจ้ง LINE/อีเมลหาแอดมิน

**อนุมัติทรัพย์:**
แอดมินตรวจตาม checklist → Server Action: เบลอพิกัดจาก `exact_lat/lon` → สร้าง `code` + `slug` → `state='approved'`, `published_at` → `revalidatePath` หน้าทรัพย์/หน้าอำเภอ/หน้าแรก/sitemap

---

## 7. Env (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=                 # ห้ามขึ้นต้น NEXT_PUBLIC_
NEXT_PUBLIC_LONGDO_MAP_KEY=          # จำกัด referrer ใน Longdo console
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
LINE_CHANNEL_ACCESS_TOKEN=
LINE_ADMIN_TARGET_ID=
RESEND_API_KEY=
SENTRY_DSN=
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_LINE_URL=
```

---

## 8. เรื่องที่ต้องตัดสินใจ / เสี่ยง

| #   | เรื่อง                                                      | บล็อกอะไร                              |
| --- | ----------------------------------------------------------- | -------------------------------------- |
| D-1 | Longdo free tier ใช้เชิงพาณิชย์ได้ไหม (ต้องอีเมลถาม Longdo) | เปิดตัวจริง (ระหว่างพัฒนาใช้ไปก่อนได้) |
| D-2 | บัญชี Vercel Pro + โดเมน                                    | deploy production                      |
| D-3 | เพจ Facebook / LINE OA จริง                                 | แจ้งเตือน + ปุ่มติดต่อ                 |
| D-4 | ชุดข้อมูลอำเภอ/ตำบลจังหวัดเลย (14 อำเภอ)                    | seed                                   |
| D-5 | ทรัพย์จริงตอนเปิดตัว ≥ 30 แปลง + ใครถ่ายรูป                 | เปิดตัว                                |
| D-6 | ข้อความ consent / privacy ให้ผู้รู้กฎหมายตรวจ               | เปิดตัว                                |

---

## 9. อ้างอิง

- Longdo Map API v3: https://map.longdo.com/docs3/ · ขอ key: https://api.longdo.com/console/ · ตัวอย่าง Next.js: https://github.com/MetamediaTechnology/longdomap-nextjs-example
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- next-intl App Router: https://next-intl.dev/docs/getting-started/app-router
- Turnstile server validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
