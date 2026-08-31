# Loeiland — แผนพัฒนาเว็บจริง

> เอกสารนี้อธิบาย **"ทำไม"** — โครงสถาปัตยกรรม การตัดสินใจ และกติกา
> **"ทำอะไรบ้าง"** อยู่ที่ [`ROADMAP.md`](./ROADMAP.md) · **สถานะปัจจุบัน** อยู่ที่ [`PROGRESS.md`](./PROGRESS.md)
>
> `docs/mock-up.html` (single-file prototype, 2,631 บรรทัด) คือ **spec ด้าน UX / copy / business rule**
> ไม่แก้ prototype ต่อ — อ้างอิงอย่างเดียว

---

## 1. Prototype พิสูจน์อะไรไว้แล้ว (ยกไปใช้เป็น spec ได้เลย)

| ส่วน | อยู่ที่ไหนใน `mock-up.html` | เอาไปทำอะไร |
|---|---|---|
| Flow ธุรกิจ | ทั้งไฟล์ | ค้นหา → แผนที่โซน → รายละเอียด → lead / ฝากขาย / ต้องการซื้อ → แอดมินตรวจ → เผยแพร่ → CRM |
| Data model ต่อทรัพย์ | `starterProperties` บรรทัด 1392–1513 | ~20 ฟิลด์/แปลง → แปลงเป็น DB schema (ข้อ 4) |
| หน่วยที่ดินไทย + คณิต | `totalWah` / `ratePerRai` / `ratePerWah` บรรทัด 1838–1855 | `rai*400 + ngan*100 + wah`; ราคา/ไร่ = price ÷ (wah/400); ราคา/ตร.ว. = price ÷ wah |
| ตัวกรอง | บรรทัด 1988–2024 | keyword (ค้นใน id/title/type/district/subdistrict/zone/tags/highlights), ประเภท, อำเภอ, ตำบล (ขึ้นกับอำเภอ), ราคาสูงสุด (bucket), ขนาดขั้นต่ำ (bucket ของ total wah) |
| CRM statuses | `CRM_STATUSES` บรรทัด 1552 | ใหม่ → ติดต่อแล้ว → นัดดูทรัพย์ → ต่อรอง → ปิดดีล → ยกเลิก |
| สองภาษา | dict `i18n` บรรทัด 1556–1781 (~120 คีย์) | th/en — ย้ายเป็นไฟล์ message ของ `next-intl` |
| POI | `poi` บรรทัด 1515–1522 | โรงพยาบาล / มหาลัย / ถนนคนเดิน ฯลฯ — ตาราง `poi` |
| ข้อความ consent (PDPA) | 3 ชุด: `consentText` / `ownerConsentText` / `buyerConsentText` | เก็บเป็นข้อมูล ไม่ใช่แค่ checkbox (ข้อ 5) |
| กติกาความเป็นส่วนตัว | badge / legalNote / mapNote ทั้งไฟล์ | **หัวใจของสินค้า** — โชว์ "โซน" ไม่โชว์พิกัดจริง ไม่โชว์เลขโฉนด ไม่โชว์ตัวตนเจ้าของ |
| สถานะทรัพย์ | `status` ใน starterProperties | พร้อมขาย / รับนัดดูทรัพย์ / รับข้อเสนอ (ป้ายบนการ์ด — คนละเรื่องกับ `state` ที่เป็น workflow) |

## 2. สิ่งที่ห้ามยกมาทั้งดุ้น — คือเหตุผลที่ต้อง rewrite

1. **`localStorage` เป็น datastore** (`readStorage`/`writeStorage` บรรทัด 1524–1534) — ข้อมูลอยู่แค่ในเครื่องคนเปิดเว็บ แอดมินคนละเครื่องมองไม่เห็นกัน
2. **`adminPin: "2468"` ใน JS ฝั่ง client** (บรรทัด 1389) — กด View Source ก็เห็น ไม่ใช่ระบบล็อกอิน
3. **`renderAdminQueue()` ยัด input ผู้ใช้เข้า `innerHTML` ตรง ๆ** (บรรทัด 2287–2333) — กรอก `<script>` ในช่อง "หมายเหตุ" = stored XSS
4. **`approveSubmission()` เอา object ที่มี `ownerName`/`ownerContact`/`adminNote` ไปกองรวมกับทรัพย์สาธารณะ** (บรรทัด 2336–2348) — เบอร์เจ้าของหลุดถึงมือคนทั่วไป
5. **เจ้าของกรอกพิกัด "โซน" เอง** (`submitLat`/`submitLon` บรรทัด 1203–1208) — เชื่อไม่ได้ว่าจะเบลอจริง ต้องเบลอฝั่ง server
6. **แผนที่เขียน projection เอง + ดึง OSM tile ตรง ๆ** (`project`/`unproject`/`tileUrl` บรรทัด 1857–1887) — ผิด usage policy ของ `tile.openstreetmap.org` สำหรับใช้เชิงพาณิชย์ → Longdo
7. **ทุกอย่างเป็น drawer บน URL เดียว** — Google เก็บหน้าไม่ได้ แชร์ Facebook ไปโผล่หน้าแรกเสมอ
8. **`body { overflow: hidden }` + grid 2 คอลัมน์ desktop-only** (บรรทัด 35, 134) — ต้องออกแบบ mobile-first ใหม่

---

## 3. Stack

| ชั้น | เลือก | เหตุผล |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR/ISR = SEO ผ่าน · Server Actions แทน backend แยก |
| Styling | **Tailwind CSS** | ย้าย design token จาก `:root` (บรรทัด 9–23) เป็น theme ตรง ๆ |
| i18n | **next-intl** — locale ใน URL (`/th`, `/en`) | dict สลับด้วย JS แบบเดิม Google เห็นภาษาเดียว |
| Database | **Supabase Postgres** | RLS ล็อกข้อมูลลับระดับแถว · มี Auth + Storage ในตัว |
| Auth แอดมิน | **Supabase Auth** (email+password, บังคับ MFA, ไม่เปิด public sign-up) | แทน PIN `2468` |
| เก็บรูป | **Supabase Storage** — private bucket + signed URL / `next/image` loader | prototype มีแค่ URL รูป |
| แผนที่ | **Longdo Map API v3** | ข้อมูลอำเภอ/ตำบลไทยครบ · free tier 800k map tx/เดือน |
| Validation | **Zod** — schema เดียวใช้ทั้ง client + server | |
| ฟอร์ม | **React Hook Form** | ฟอร์มฝากขาย ~20 ช่อง |
| กันบอท | **Cloudflare Turnstile** | ฟอร์มสาธารณะ 3 ตัว |
| Rate limit | **Upstash Redis (`@upstash/ratelimit`)** free tier | กันยิงฟอร์มรัว — ตัดสินใจ D-6 |
| แจ้งเตือน | **Resend** (อีเมล) + **LINE Messaging API** (push หาแอดมิน) | แอดมินต้องรู้ทันทีเมื่อมี lead |
| Analytics | **Vercel Analytics** หรือ **Plausible** | PDPA-friendly ไม่ต้องขอ cookie consent — ตัดสินใจ D-7 |
| Error tracking | **Sentry** free tier | ไม่มีทีม dev เฝ้า |
| Deploy | **Vercel Pro** (~700 ฿/เดือน) | Hobby ห้ามใช้เชิงพาณิชย์ (D-2) |
| Test | **Playwright** | เทสต์ contract: public API ไม่เคยคืนฟิลด์ลับ + RLS leak |

**ต้นทุนโดยประมาณ/เดือน:** Vercel Pro ~700 ฿ · Supabase Free (ปีแรก) · Longdo Free · Resend/Turnstile/Upstash Free · โดเมน ~50 ฿ → **~750 ฿/เดือน** จุดที่จะแพงขึ้นคือ Supabase Pro ($25) เมื่อรูปเยอะ

---

## 4. Database schema

### 4.1 แยกสาธารณะ / ลับ เป็นคนละตาราง — จุดสำคัญที่สุด

```sql
-- ขึ้นเว็บได้เท่านั้น
create table properties (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,            -- LL-0001
  slug          text unique not null,            -- ทีดินเมืองเลย-กุดปอง-ll0001
  title_th      text not null,
  title_en      text,
  type          text not null,
  district      text not null,
  subdistrict   text not null,
  zone          text not null,                   -- "โซนตัวเมืองเลย"
  zone_lat      numeric(9,6) not null,           -- พิกัดที่เบลอแล้ว (server-side)
  zone_lon      numeric(9,6) not null,
  zone_radius_m int not null default 800,        -- รัศมีวงกลมบนแผนที่
  price         bigint not null,
  rai           int not null default 0,
  ngan          int not null default 0,
  wah           numeric not null default 0,
  total_wah     numeric generated always as (rai*400 + ngan*100 + wah) stored,  -- index/sort/filter
  frontage      text,
  road          text,
  utilities     text,
  deed_type     text,                            -- "โฉนด" เท่านั้น — ไม่มีเลข
  listing_status text,                           -- พร้อมขาย / รับนัดดูทรัพย์ / รับข้อเสนอ
  highlights    text[] not null default '{}',
  tags          text[] not null default '{}',
  state         text not null default 'pending', -- pending | approved | rejected | sold | archived
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on properties (state);
create index on properties (district) where state = 'approved';
create index on properties (total_wah) where state = 'approved';

-- ลับ 1:1 — แอดมินเท่านั้น ไม่มีทางหลุดผ่าน API สาธารณะ
create table property_private (
  property_id     uuid primary key references properties(id) on delete cascade,
  exact_lat       numeric(9,6),
  exact_lon       numeric(9,6),
  deed_number     text,
  owner_name      text not null,
  owner_contact   text not null,
  encumbrance     text,                          -- ภาระจำนอง / สถานะเอกสาร
  admin_note      text,
  consent_at      timestamptz not null,
  consent_version text not null,
  submitted_ip_hash text,
  created_at      timestamptz not null default now()
);
```

> แยกตารางแบบนี้ = **ต่อให้เขียนโค้ดพลาด `select *`** ก็ยังไม่เผลอส่งเบอร์เจ้าของออกหน้าเว็บ ต่างจาก prototype ที่ทุกอย่างอยู่ใน object เดียว
> ตอนเจ้าของ submit: ฟิลด์สาธารณะ → `properties` (state=pending), PII + พิกัดจริง + consent → `property_private` **ทันทีตั้งแต่ pending**

### 4.2 ตารางที่เหลือ

```sql
property_photos  (id, property_id, storage_path, sort_order, is_cover, alt_th, alt_en, created_at)
leads            (id, property_id, name, contact, message, crm_status default 'ใหม่',
                  consent_at, consent_version, source, ip_hash, created_at)
buyer_requests   (id, name, contact, target_property_id, district, preferred_zone,
                  budget_min, budget_max, min_rai, purpose, road_need, utility_need, detail,
                  crm_status default 'ใหม่', consent_at, consent_version, ip_hash, created_at)
crm_events       (id, entity_type, entity_id, from_status, to_status, actor_id, note, created_at)
audit_log        (id, actor_id, action, entity_type, entity_id, created_at)  -- PDPA: ใครเปิดดูเบอร์ใครเมื่อไหร่
districts        (name_th, name_en, center_lat, center_lon)                  -- 14 อำเภอ
subdistricts     (district_name_th, name_th, name_en)                        -- ~90 ตำบล
poi              (id, name_th, name_en, kind, lat, lon)                      -- ย้ายจาก array บรรทัด 1515
```

### 4.3 RLS (สรุป)

| ตาราง | anon | admin (authenticated) |
|---|---|---|
| `properties` | SELECT เฉพาะ `state = 'approved'` | ทั้งหมด |
| `property_private` | ❌ ปิดสนิท | ทั้งหมด |
| `property_photos` | SELECT เฉพาะรูปของทรัพย์ที่ approved | ทั้งหมด |
| `leads` / `buyer_requests` | ❌ ปิดสนิท read + write | ทั้งหมด |
| `crm_events` / `audit_log` | ❌ | SELECT / INSERT |
| `districts` / `subdistricts` / `poi` | SELECT | ทั้งหมด |

> ฟอร์มสาธารณะ **ไม่** insert ด้วย anon key — ผ่าน **Server Action** ที่ตรวจ Zod + Turnstile + rate limit ก่อน แล้วเขียนด้วย **service role ฝั่ง server** เท่านั้น

---

## 5. ความปลอดภัย + PDPA (ห่วงข้อ 1)

**ต้องมีก่อนเปิดจริง:**

1. **ลบ PIN** → Supabase Auth, บัญชีแอดมินสร้างมือ, บังคับ MFA, ไม่เปิด public sign-up
2. **แยก `property_private`** + RLS ปิดสนิทสำหรับ anon (ข้อ 4)
3. **เบลอพิกัดฝั่ง server ตอนอนุมัติ** — สุ่มเลื่อน 500–1,000 ม. เก็บเป็น `zone_lat/zone_lon`; พิกัดจริงอยู่ `property_private` เท่านั้น ไม่เชื่อค่าที่เจ้าของกรอก
4. **ไม่เก็บเลขโฉนดถ้าไม่จำเป็น** — เก็บแค่ `deed_type` เก็บน้อย = เสี่ยงน้อย
5. **ไม่มี `dangerouslySetInnerHTML` ในหน้าแอดมิน** — render input ผู้ใช้เป็น text เท่านั้น (ช่องโหว่ข้อ 3 ในหมวด 2)
6. **consent เป็นข้อมูล** — `consent_at` + `consent_version` พิสูจน์ได้ว่ายินยอมข้อความเวอร์ชันไหน
7. **สิทธิ์เจ้าของข้อมูล (PDPA ม.30–33)** — ช่องทางขอดู/ขอลบ + ปุ่ม hard-delete ใน `/admin` + บันทึก `audit_log`
8. **Retention** — lead/buyer_request ที่ปิดแล้วเกิน 18 เดือน ลบอัตโนมัติด้วย Supabase scheduled function
9. **`/privacy` ฉบับเต็ม** — ผู้ควบคุมข้อมูล, ฐานทางกฎหมาย, ระยะเก็บ, ช่องทางร้องเรียน (drawer เดิมสั้นไป)
10. **env** — `SUPABASE_SERVICE_ROLE_KEY` ห้ามขึ้นต้น `NEXT_PUBLIC_` · `.env*.local` ไม่เข้า git · มี `.env.example`
11. **audit ตอนเปิดดู PII** — ทุกครั้งที่แอดมินเปิด `property_private` / เบอร์ lead → เขียน `audit_log`
12. **ล้าง EXIF GPS จากรูปตอนอัปโหลด** — รูปถ่ายมือถือฝังพิกัดจริงไว้ใน metadata · server ต้อง re-encode รูปใหม่ (เช่น `sharp` `.rotate()` + strip metadata) ก่อนเก็บลง Storage · ระบบไม่อ่าน/ไม่ใช้พิกัดจากรูป — อัปโหลดมาเฉย ๆ เท่านั้น

---

## 6. SEO (ห่วงข้อ 2)

prototype เรนเดอร์ทุกอย่างด้วย JS จาก array → Google เห็นหน้าเปล่า

1. **URL ต่อทรัพย์** — `/[locale]/property/[slug]` เรนเดอร์ฝั่ง server, ISR revalidate 1 ชม.
2. **`generateMetadata()` ต่อหน้า** — เช่น "ที่ดิน 3-2-20 ไร่ โซนเชียงคาน 9.6 ล้าน | Loeiland"
3. **JSON-LD** — `RealEstateListing` + `Place` + `Offer` ต่อทรัพย์ · `RealEstateAgent`/`LocalBusiness` หน้าแรก
4. **`sitemap.ts` + `robots.ts`** — sitemap สร้างอัตโนมัติจากทรัพย์ approved
5. **Landing page รายอำเภอ 14 หน้า** (`/[locale]/district/[district]`) — traffic ตัวจริง คนค้น "ที่ดินภูเรือ" ไม่ได้ค้น "Loeiland"
6. **Landing page รายประเภท** (`/[locale]/type/[type]`)
7. **hreflang** จาก locale routing ของ next-intl
8. **OG image อัตโนมัติ** (`opengraph-image.tsx`) — traffic หลักมาจาก Facebook
9. **`next/image` + alt ภาษาไทย**
10. **Google Search Console + Google Business Profile** — งาน ops นอกโค้ด ให้ผลเร็ว

---

## 7. มือถือ (ห่วงข้อ 3) — ออกแบบ mobile-first

- ค่าเริ่มต้นมือถือ = **รายการ** + ปุ่มลอย "ดูแผนที่" สลับเต็มจอ (คนไทยหาที่ดิน scroll รายการมากกว่าจิ้มแผนที่)
- รายละเอียดทรัพย์ = **หน้าเต็มมี URL** ไม่ใช่ drawer
- ตัวกรอง = bottom sheet + ปุ่ม "ใช้ตัวกรอง" (ไม่กรองรัวทุกครั้งที่แตะ)
- แผนที่ **lazy load** — ไม่โหลด Longdo SDK จนกดดูแผนที่ (ประหยัด data + quota)
- ฟอร์มฝากขาย ~20 ช่อง → แบ่ง 3 สเต็ป + `inputmode="numeric"` ในช่องตัวเลข + ปุ่มแตะ ≥ 44px
- ปุ่มโทร / เพิ่มเพื่อน LINE ติดขอบล่างในหน้าทรัพย์ (conversion หลัก)
- ห้ามยก `body { overflow: hidden }` มา

---

## 8. โครงหน้าเว็บ (routes)

```
/[locale]                         หน้าแรก — รายการ + ตัวกรอง + ปุ่มเปิดแผนที่   (SSR)
/[locale]/search                  ผลค้นหา ตัวกรองอยู่ใน URL (?type=&district=…) (SSR)
/[locale]/property/[slug]         หน้าทรัพย์รายตัว                              (ISR) ← ตัวหลักของ SEO
/[locale]/district/[district]     landing รายอำเภอ 14 หน้า                     (ISR)
/[locale]/type/[type]             landing รายประเภท                            (ISR)
/[locale]/submit                  ฝากขายทรัพย์ (multi-step)
/[locale]/buyer-request           แจ้งต้องการซื้อ
/[locale]/privacy  /terms         PDPA + เงื่อนไข (ขยายจาก drawer เดิม)
/admin                            คิวตรวจ                                       (ต้องล็อกอิน, ไม่มี locale prefix)
/admin/properties                 จัดการทรัพย์ทั้งหมด + อัปโหลดรูป
/admin/leads                      CRM: ผู้สนใจซื้อรายแปลง
/admin/buyer-requests             CRM: ความต้องการซื้อ
/admin/data-requests              คำขอใช้สิทธิ์ PDPA
```

---

## 9. Forms architecture (ฟอร์มสาธารณะ 3 ตัว)

```
Client (RHF + Zod + Turnstile widget)
   │  submit
   ▼
Server Action
   ├─ ตรวจ Zod (schema เดียวกับ client)
   ├─ ตรวจ Turnstile token กับ Cloudflare
   ├─ rate limit per IP (Upstash)
   ├─ แยกฟิลด์: สาธารณะ → ตารางหลัก · PII/consent → property_private (กรณี submit)
   ├─ เขียนด้วย service role
   ├─ เก็บ consent_at + consent_version + ip_hash (ไม่เก็บ IP ดิบ)
   └─ trigger แจ้งเตือน: Resend email + LINE push หาแอดมิน
```

- `lead` — จากหน้าทรัพย์ ผูก `property_id`
- `submit-property` — สร้าง `properties(state=pending)` + `property_private`
- `buyer-request` — สร้าง `buyer_requests`

---

## 10. Admin

- Supabase Auth + middleware ป้องกัน `/admin/*` · เปิดดู PII → เขียน `audit_log`
- **คิวตรวจ**: รายการ pending + buyer_requests + leads (เทียบ `renderAdminQueue` บรรทัด 2276)
- **อนุมัติ**: server action → เบลอพิกัด 500–1,000 ม. → gen `code` + `slug` → `state='approved'` + `published_at` → revalidate path
- **ปฏิเสธ**: `state='rejected'` (ไม่ลบ เผื่อ audit) + ปุ่ม hard-delete แยก
- **อัปโหลดรูป**: Supabase Storage private bucket, ตั้ง `is_cover`, จัด `sort_order`
- **CRM board**: เปลี่ยน `crm_status` → เขียน `crm_events` · statuses ตาม prototype
- **Export CSV**: เทียบ `exportCsv` บรรทัด 2420 — BOM + escape ครบ

---

## 11. Config / env

`.env.example` (คีย์ที่ต้องมี):

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=              # ห้าม NEXT_PUBLIC_
NEXT_PUBLIC_LONGDO_MAP_KEY=            # client key (จำกัด referrer)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
RESEND_API_KEY=
LINE_CHANNEL_ACCESS_TOKEN=
LINE_ADMIN_USER_ID=
SENTRY_DSN=
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_LINE_ADD_FRIEND_URL=
```

- `APP_CONFIG` ของ prototype (บรรทัด 1385–1390: `facebookUrl` / `lineUrl` / `googleScriptUrl` / `adminPin`) → เลิกใช้ ยกไปเป็น env ข้างบน
- design token จาก `:root` (`--bg --paper --ink --muted --line --brand --brand-2 --soft --danger --shadow --radius`) → `tailwind.config` theme

---

## 12. เฟสงาน (ย่อ — รายละเอียดใน ROADMAP.md)

| เฟส | ได้อะไร | ตรวจว่าเสร็จยังไง |
|---|---|---|
| **P0 ตั้งต้น** | Next.js+TS+Tailwind+next-intl, Supabase project, env, CI, deploy เปล่าขึ้น Vercel | เว็บเปล่าออนไลน์ + CI (typecheck/lint/build) ผ่าน |
| **P1 ข้อมูล + หน้า public** | schema + RLS, seed 5 แปลง + POI + 14 อำเภอ, หน้าแรก/ค้นหา/รายละเอียด, design token, i18n | เปิดเว็บเห็นทรัพย์จาก DB กรองครบทุกตัวกรอง |
| **P2 SEO** | metadata, JSON-LD, sitemap, landing 14 อำเภอ + รายประเภท, OG image | ผ่าน Rich Results Test + ส่ง sitemap เข้า Search Console |
| **P3 แผนที่ Longdo** | API key, map component (lazy), หมุด+วงโซน+POI, popup, sync กับตัวกรอง+URL | แผนที่เทียบเท่า prototype แต่ลื่นบนมือถือ |
| **P4 ฟอร์ม** | Server Action + Zod + Turnstile + rate limit สำหรับ lead/ฝากขาย/ต้องการซื้อ + แจ้งเตือน | กรอกฟอร์มแล้วเข้า DB ถูกตาราง + แอดมินได้อีเมล/LINE |
| **P5 หลังบ้าน** | Supabase Auth + MFA, `/admin` คิวตรวจ, อนุมัติ (เบลอพิกัดอัตโนมัติ) / ปฏิเสธ, อัปโหลดรูป, CRM board, CSV | แอดมินอนุมัติแล้วทรัพย์ขึ้นเว็บจริง + audit_log ทำงาน |
| **P6 ก่อนเปิด** | `/privacy` เต็ม, ปุ่มลบข้อมูล, retention cron, Sentry, Lighthouse, Playwright RLS/contract test, seed 30–50 แปลงจริง | ผ่าน checklist ข้อ 5 ครบ + test เขียว |

P2 / P3 / P4 ขนานกันได้หลัง P1 · P5 ต้องรอ P4

---

## 13. ความเสี่ยง / เรื่องที่ต้องตัดสินใจ

ดูตารางสด ๆ ใน [`PROGRESS.md`](./PROGRESS.md#เรื่องที่ติดอยู่--ต้องตัดสินใจ) — สรุป:

| # | เรื่อง | บล็อกอะไร |
|---|---|---|
| D-1 | เงื่อนไข Longdo free tier ใช้เชิงพาณิชย์ได้ไหม — ต้องอีเมลถาม | เปิดจริง (dev ใช้ไปก่อนได้) |
| D-2 | บัญชี/การจ่ายเงิน Vercel Pro (Hobby ห้ามเชิงพาณิชย์) | deploy ก่อน P6 |
| D-3 | มีเพจ Facebook / LINE OA จริงหรือยัง | P4 แจ้งเตือน, P6 |
| D-4 | dataset อำเภอ/ตำบลจังหวัดเลย (14 / ~90) | P1 seed |
| D-5 | ตอนเปิดจะมีทรัพย์กี่แปลง + ใครหารูป — ต่ำกว่า 30 เว็บดูร้าง | P6 |
| D-6 | rate-limit backend: Upstash free vs DB token bucket | P4 |
| D-7 | analytics: Vercel Analytics vs Plausible | P2/P6 |

---

## 14. อ้างอิง

- [Longdo Map — pricing / free tier](https://map.longdo.com/products/pricing)
- [Longdo Map API v3 — JavaScript getting started](https://map.longdo.com/docs3/javascript/getting-start)
- [Longdo Map API v3 — React / Next.js](https://map.longdo.com/docs3/react/getting-start)
- [longdomap-nextjs-example (GitHub)](https://github.com/MetamediaTechnology/longdomap-nextjs-example)
- [Longdo API Console — ขอ key](https://api.longdo.com/console/)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [next-intl — App Router](https://next-intl-docs.vercel.app/docs/getting-started/app-router)
- [Cloudflare Turnstile — server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
