# Loeiland — แผนพัฒนาเว็บจริง (Next.js + Supabase + Longdo Map)

> เอกสารนี้ใช้ `index.html` (single-file prototype, 2,631 บรรทัด) เป็น **spec ด้าน UX / copy / business rule**
> ตัว prototype จะไม่ถูกแก้ต่อ แต่จะถูกอ้างอิงว่า "หน้าตาและกติกาต้องได้แบบนี้"
>
> **เอกสารนี้อธิบาย "ทำไม" — ส่วน "ทำอะไรบ้าง" อยู่ที่ [`tasks/`](./tasks/) และสถานะปัจจุบันอยู่ที่ [`PROGRESS.md`](./PROGRESS.md)**

---

## 1. สิ่งที่ prototype พิสูจน์ไว้แล้ว (เอาไปใช้ต่อได้เลย)

| ส่วน | สิ่งที่มีอยู่แล้วใน `index.html` | สถานะ |
|---|---|---|
| Flow ธุรกิจ | ค้นหา → แผนที่โซน → รายละเอียด → ฝากขาย → แอดมินตรวจ → เผยแพร่ → CRM | ✅ ใช้เป็น spec |
| ตัวกรอง | คำสำคัญ, ประเภท, อำเภอ, ตำบล, ราคาสูงสุด, ขนาดขั้นต่ำ | ✅ ใช้เป็น spec |
| Data model | 24 ฟิลด์ต่อทรัพย์ (`starterProperties` บรรทัด 1392–1513) | ✅ แปลงเป็น schema |
| หน่วยวัดไทย | ไร่ / งาน / ตร.ว. + คำนวณราคา/ไร่ และ ราคา/ตร.ว. | ✅ ใช้เป็น spec |
| CRM statuses | ใหม่ → ติดต่อแล้ว → นัดดูทรัพย์ → ต่อรอง → ปิดดีล → ยกเลิก | ✅ ใช้เป็น spec |
| สองภาษา | ไทย/อังกฤษ (dict `i18n` บรรทัด 1556+) | ✅ ใช้เป็น spec |
| กติกาความเป็นส่วนตัว | ไม่โชว์เลขโฉนด, ไม่โชว์พิกัดจริง, แสดงเป็น "โซน" | ✅ **หัวใจของสินค้า** |
| ข้อความ consent (PDPA) | มี 3 ชุด (lead / เจ้าของ / ผู้ซื้อ) | ✅ ใช้เป็น spec |

**สิ่งที่ห้ามยกมาทั้งดุ้น (ต้องเขียนใหม่):**

1. `localStorage` เป็นที่เก็บข้อมูลจริง — ข้อมูลอยู่แค่ในเครื่องคนเปิดเว็บ แอดมินคนละเครื่องมองไม่เห็นกัน
2. `adminPin: "2468"` อยู่ใน JS ฝั่ง client (บรรทัด 1389) — ใครกด View Source ก็เห็น = ไม่ใช่ระบบล็อกอิน
3. `renderAdminQueue()` (บรรทัด 2276) ยัดข้อความที่ผู้ใช้กรอกเข้า `innerHTML` ตรง ๆ ไม่ escape → **stored XSS** ถ้ามีคนกรอก `<script>` ในช่อง "หมายเหตุ"
4. `approveSubmission()` เอา object ที่มี `ownerName` / `ownerContact` / `adminNote` ไปกองรวมกับทรัพย์สาธารณะ → เบอร์เจ้าของหลุดถึงมือคนทั่วไป
5. แผนที่เขียน projection + tile loader เอง (`project`/`unproject`/`tileUrl` บรรทัด 1857–1887) และดึง tile จาก OSM ตรง ๆ ซึ่งผิด usage policy ของ OSM ถ้าใช้เชิงพาณิชย์ → เปลี่ยนเป็น Longdo

---

## 2. Stack ที่ต้องใช้

### 2.1 หลัก

| ชั้น | เลือกใช้ | เหตุผล |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR ได้ = SEO ผ่าน, Server Actions ใช้แทน backend แยก |
| Styling | **Tailwind CSS** | ย้าย design token จาก `:root` (บรรทัด 9–23) มาเป็น theme ได้ตรง ๆ |
| Database | **Supabase (Postgres)** | RLS ล็อกข้อมูลลับได้ระดับแถว, มี Auth + Storage ในตัว |
| Auth (แอดมิน) | **Supabase Auth** (email + password, เปิด MFA) | แทน PIN `2468` |
| เก็บรูปทรัพย์ | **Supabase Storage** (bucket ส่วนตัว + signed URL) | prototype ใช้แค่ URL รูป ยังอัปโหลดจริงไม่ได้ |
| แผนที่ | **Longdo Map API v3** | ข้อมูลไทยละเอียดกว่า, ชื่ออำเภอ/ตำบลภาษาไทยครบ, free tier ใหญ่มาก |
| Validation | **Zod** | ใช้ schema เดียวกันทั้ง client และ server |
| ฟอร์ม | **React Hook Form** | ฟอร์มฝากขายมี 20 ช่อง — จัดการ error ด้วยมือไม่ไหว |
| กันบอท | **Cloudflare Turnstile** | ฟอร์มเปิดสาธารณะ 3 ตัว ต้องมีตัวกัน spam |
| แจ้งเตือน | **Resend** (อีเมล) + LINE Notify/Messaging API | แอดมินต้องรู้ทันทีเมื่อมี lead ใหม่ |
| Deploy | **Vercel** | ทาง native ของ Next.js |
| Error tracking | **Sentry** (free tier) | จำเป็นเมื่อไม่มีทีม dev คอยเฝ้า |

### 2.2 เสริม (เอาไว้ทีหลังได้)

- `next-intl` — ทำ i18n ให้เป็น URL แยก `/th` `/en` (ดีต่อ SEO กว่า dict สลับด้วย JS)
- `@vercel/og` — สร้างรูป preview ตอนแชร์ลง Facebook อัตโนมัติ
- Plausible / Umami — analytics ที่ PDPA-friendly (ไม่ต้องขอ cookie consent)

### 2.3 ต้นทุนจริง (ประมาณต่อเดือน)

| รายการ | ฟรีได้ไหม | ถ้าต้องจ่าย |
|---|---|---|
| **Longdo Map** | ✅ ฟรีจนถึง 800,000 map transactions/เดือน, 100,000 service transactions/เดือน (จำกัด 60 req/นาที, 5,000 req/วัน) | Starter 8,250 ฿/เดือน |
| **Supabase** | ✅ Free tier (500 MB DB, 1 GB storage) พอสำหรับปีแรก | Pro $25/เดือน (~900 ฿) เมื่อรูปเยอะ |
| **Vercel** | ⚠️ Hobby ฟรี แต่ **ห้ามใช้เชิงพาณิชย์ตาม ToS** | Pro $20/เดือน (~700 ฿) |
| **โดเมน** | ❌ | ~400–800 ฿/ปี |
| **Resend** | ✅ 3,000 อีเมล/เดือน | — |
| **Cloudflare Turnstile** | ✅ ฟรีไม่จำกัด | — |

> **ประเด็นต้นทุนที่ต้องตัดสินใจ:** Longdo free tier ใหญ่เกินพอสำหรับเว็บระดับจังหวัด — 800,000 transactions/เดือนคือเยอะมาก จุดที่จะเสียเงินจริงคือ Vercel Pro
> **ทางเลือกประหยัด:** ถ้าอยากกดให้เหลือ ~0 บาท/เดือน ใช้ **Cloudflare Workers/Pages** แทน Vercel (free tier ใช้เชิงพาณิชย์ได้) หรือรัน Next.js บน VPS ไทย (~200–300 ฿/เดือน) แลกกับต้องดูแล server เอง

---

## 3. โครงหน้าเว็บ (routes)

```
/                          หน้าแรก — แผนที่ + รายการ + ตัวกรอง        (SSR)
/property/[slug]           หน้าทรัพย์รายตัว                          (ISR) ← ตัวหลักของ SEO
/search                    ผลค้นหา ตัวกรองอยู่ใน URL                  (SSR)
/district/[district]       landing page รายอำเภอ 14 หน้า             (ISR) ← ดัก "ที่ดินเชียงคาน"
/type/[type]               landing page รายประเภททรัพย์               (ISR)
/submit                    ฝากขายทรัพย์
/buyer-request             แจ้งต้องการซื้อ
/privacy  /terms           PDPA + เงื่อนไข (ขยายจาก drawer เดิม)
/admin                     คิวตรวจ                                   (ต้องล็อกอิน)
/admin/properties          จัดการทรัพย์ทั้งหมด
/admin/leads               CRM: ผู้สนใจซื้อรายแปลง
/admin/buyer-requests      CRM: ความต้องการซื้อ
```

**เปลี่ยนจาก prototype ที่สำคัญ:** ตอนนี้ทุกอย่างเป็น drawer บน URL เดียว → ทรัพย์แต่ละแปลงต้องมี URL ของตัวเอง ไม่งั้น Google เก็บหน้าไม่ได้ และแชร์ลง Facebook ก็ไปโผล่หน้าแรกเสมอ

---

## 4. Database schema

### 4.1 แยกข้อมูลสาธารณะ / ข้อมูลลับ — จุดสำคัญที่สุดของงานนี้

```sql
-- ข้อมูลที่ "ขึ้นเว็บได้" เท่านั้น
create table properties (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,          -- LL-0001
  slug          text unique not null,          -- ที่ดินเมืองเลย-กุดป่อง-ll0001
  title_th      text not null,
  title_en      text,
  type          text not null,
  district      text not null,
  subdistrict   text not null,
  zone          text not null,                 -- "โซนตัวเมืองเลย"
  zone_lat      numeric(9,6) not null,         -- พิกัดที่ "เบลอแล้ว"
  zone_lon      numeric(9,6) not null,
  zone_radius_m int default 800,               -- รัศมีวงกลมที่วาดบนแผนที่
  price         bigint not null,
  rai           int default 0,
  ngan          int default 0,
  wah           numeric default 0,
  frontage text, road text, utilities text,
  deed_type     text,                          -- "โฉนด" เท่านั้น ไม่มีเลข
  status        text,                          -- พร้อมขาย / รับนัดดูทรัพย์ / รับข้อเสนอ
  highlights    text[],
  tags          text[],
  state         text not null default 'pending',  -- pending|approved|rejected|sold|archived
  published_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ข้อมูลลับ 1:1 แอดมินเท่านั้นที่เห็น — ไม่มีทางหลุดผ่าน API สาธารณะ
create table property_private (
  property_id   uuid primary key references properties(id) on delete cascade,
  exact_lat     numeric(9,6),
  exact_lon     numeric(9,6),
  deed_number   text,
  owner_name    text not null,
  owner_contact text not null,
  encumbrance   text,           -- ภาระจำนอง
  admin_note    text,
  consent_at    timestamptz not null,
  consent_version text not null
);
```

> การแยกตารางนี้ทำให้ **ต่อให้เขียนโค้ดพลาด** ก็ยังไม่มีทางเผลอ `select *` แล้วส่งเบอร์เจ้าของออกไปหน้าเว็บ — ต่างจาก prototype ที่ทุกอย่างอยู่ใน object เดียว

### 4.2 ตารางที่เหลือ

```sql
property_photos   (property_id, storage_path, sort_order, is_cover, alt_th, alt_en)
leads             (property_id, name, contact, message, crm_status, consent_at,
                   consent_version, source, ip_hash, created_at)
buyer_requests    (name, contact, target_property_id, district, preferred_zone,
                   budget_min, budget_max, min_rai, purpose, road_need,
                   utility_need, detail, crm_status, consent_at, consent_version)
crm_events        (entity_type, entity_id, from_status, to_status, actor_id, note, created_at)
audit_log         (actor_id, action, entity_type, entity_id, created_at)  -- PDPA: ใครเปิดดูเบอร์ใครเมื่อไหร่
districts         (name_th, name_en, center_lat, center_lon)              -- 14 อำเภอ
poi               (name_th, name_en, kind, lat, lon)                      -- ย้ายจาก array บรรทัด 1515
```

### 4.3 RLS policy (สรุป)

| ตาราง | anon (คนทั่วไป) | admin |
|---|---|---|
| `properties` | SELECT ได้เฉพาะ `state = 'approved'` | ทุกอย่าง |
| `property_private` | ❌ ปิดสนิท | ทุกอย่าง |
| `property_photos` | SELECT ได้เฉพาะรูปของทรัพย์ที่ approved | ทุกอย่าง |
| `leads` / `buyer_requests` | ❌ ปิดสนิททั้ง read และ write | ทุกอย่าง |
| `crm_events` / `audit_log` | ❌ | SELECT / INSERT |

> ฟอร์มสาธารณะ **ไม่** insert เข้า Supabase ตรง ๆ ด้วย anon key — ให้ผ่าน **Server Action** ที่ตรวจ Zod + Turnstile + rate limit ก่อน แล้วค่อยเขียนด้วย service role ฝั่ง server เท่านั้น (ถ้าเปิดให้ anon insert ได้ จะโดนยิงฟอร์มขยะรัวได้ทันที)

---

## 5. ความปลอดภัย + PDPA (ห่วงข้อที่ 1)

**ต้องมีก่อนเปิดจริง:**

1. **ลบ PIN ทิ้ง** → Supabase Auth, บัญชีแอดมินสร้างด้วยมือเท่านั้น (ไม่เปิด public sign-up), บังคับ MFA
2. **แยกตาราง `property_private`** ตามข้อ 4.1 + RLS ปิดสนิทสำหรับ anon
3. **เบลอพิกัดจริงฝั่ง server** — เมื่อแอดมินอนุมัติ ให้ระบบสุ่มเลื่อนพิกัดจริงในรัศมี 500–1,000 ม. แล้วเก็บผลลงเป็น `zone_lat/zone_lon` โดยพิกัดจริงอยู่ใน `property_private` เท่านั้น (prototype ให้เจ้าของกรอกพิกัดโซนเอง — เชื่อไม่ได้ว่าจะเบลอจริง)
4. **ไม่เก็บเลขโฉนดในระบบเลย** ถ้าไม่จำเป็น — เก็บแค่ประเภทเอกสาร ส่วนเลขให้ตรวจนอกระบบ (เก็บน้อย = เสี่ยงน้อย)
5. **Escape ทุกข้อความที่ผู้ใช้กรอก** — React ทำให้อัตโนมัติ แต่ห้ามใช้ `dangerouslySetInnerHTML` ในหน้าแอดมินเด็ดขาด (นี่คือช่องโหว่ข้อ 3 ในหมวด 1)
6. **บันทึก consent เป็นข้อมูล** ไม่ใช่แค่ checkbox — เก็บ `consent_at` + `consent_version` เพื่อพิสูจน์ได้ว่ายินยอมข้อความเวอร์ชันไหน
7. **สิทธิ์เจ้าของข้อมูล (PDPA ม.30–33)** — ต้องมีช่องทางขอดู/ขอลบข้อมูล + ปุ่มลบใน `/admin` ที่ลบจริง (hard delete) พร้อมบันทึกลง `audit_log`
8. **Retention policy** — lead ที่ปิดแล้วเกิน 12–24 เดือน ให้ลบอัตโนมัติด้วย Supabase cron
9. **หน้า `/privacy` ฉบับเต็ม** — ระบุผู้ควบคุมข้อมูล, ฐานทางกฎหมาย, ระยะเก็บ, ช่องทางร้องเรียน (drawer เดิมสั้นเกินสำหรับใช้จริง)
10. **`.env` ไม่เข้า git** — `SUPABASE_SERVICE_ROLE_KEY` ห้ามขึ้นต้นด้วย `NEXT_PUBLIC_` เด็ดขาด

---

## 6. SEO (ห่วงข้อที่ 2)

ตอนนี้ prototype เป็น SPA ที่เรนเดอร์ทุกอย่างด้วย JS จาก array ในไฟล์ → Google เห็นแค่หน้าเปล่า

**สิ่งที่ต้องทำ:**

1. **URL ต่อทรัพย์** — `/property/ที่ดินติดถนน-เชียงคาน-ll0002` เรนเดอร์ฝั่ง server (ISR revalidate 1 ชม.)
2. **`generateMetadata()` ต่อหน้า** — title/description ดึงจากข้อมูลจริง เช่น "ที่ดิน 3-2-20 ไร่ โซนเชียงคาน ราคา 9.6 ล้าน | Loeiland"
3. **JSON-LD structured data** — `RealEstateListing` + `Place` + `Offer` ต่อทรัพย์, `RealEstateAgent` + `LocalBusiness` ในหน้าแรก (ช่วยให้ขึ้น rich result)
4. **`sitemap.ts` + `robots.ts`** — sitemap สร้างอัตโนมัติจากทรัพย์ที่ approved
5. **Landing page รายอำเภอ 14 หน้า** — นี่คือ traffic ตัวจริง คนค้น "ที่ดินภูเรือ" "ที่ดินเชียงคาน" ไม่ได้ค้น "Loeiland"
6. **i18n เป็น URL** — `/th/...` และ `/en/...` + `hreflang` (ปุ่มสลับภาษาด้วย JS แบบเดิม Google เห็นภาษาเดียว)
7. **OG image อัตโนมัติ** — สำคัญมากเพราะ traffic หลักน่าจะมาจาก Facebook
8. **รูปผ่าน `next/image`** + alt ภาษาไทย
9. **Google Business Profile + Google Search Console** — งาน local SEO ที่อยู่นอกโค้ด แต่ให้ผลเร็วกว่าโค้ด

---

## 7. มือถือ (ห่วงข้อที่ 3)

Layout ปัจจุบันคือ `grid-template-columns: minmax(340px,420px) 1fr` + `body { overflow: hidden }` (บรรทัด 34, 134) — เป็น desktop-first ล้วน

**ออกแบบใหม่แบบ mobile-first:**

- มือถือ: ค่าเริ่มต้นเป็น **รายการ** + ปุ่มลอย "ดูแผนที่" สลับเต็มจอ (คนไทยหาบ้าน scroll รายการมากกว่าจิ้มแผนที่)
- รายละเอียดทรัพย์: **หน้าเต็ม** ไม่ใช่ drawer (มี URL ของตัวเอง = แชร์ได้ + SEO ได้)
- ตัวกรอง: bottom sheet มีปุ่ม "ใช้ตัวกรอง" ชัดเจน แทนที่จะกรองทันทีทุกครั้งที่แตะ
- แผนที่: **lazy load** ไม่โหลด Longdo SDK จนกว่าจะกดดูแผนที่ (ประหยัดทั้ง data ผู้ใช้ และ transaction quota)
- ฟอร์มฝากขาย 20 ช่อง: แบ่งเป็น 3 สเต็ป + `inputmode="numeric"` ในช่องตัวเลข + ปุ่มแตะขั้นต่ำ 44px
- ปุ่มโทร / เพิ่มเพื่อน LINE ติดขอบล่างในหน้าทรัพย์ (conversion หลักของธุรกิจนี้)

---

## 8. แผนงานเป็นเฟส

| เฟส | งาน | ผลลัพธ์ที่ตรวจได้ |
|---|---|---|
| **0. ตั้งต้น** | Next.js + TS + Tailwind, สร้าง Supabase project, ตั้ง env, `.gitignore`, deploy เปล่าขึ้น Vercel | เว็บเปล่าออนไลน์ + CI ผ่าน |
| **1. ข้อมูล + หน้าอ่านอย่างเดียว** | สร้าง schema + RLS, seed 5 แปลงจาก `starterProperties`, หน้าแรก/รายละเอียด/ค้นหา, ย้าย design token, i18n | เปิดเว็บเห็นทรัพย์จริงจาก DB กรองได้ครบทุกตัวกรอง |
| **2. SEO** | metadata, JSON-LD, sitemap, landing page 14 อำเภอ, OG image | ทดสอบผ่าน Rich Results Test + ส่ง sitemap เข้า Search Console |
| **3. แผนที่ Longdo** | ขอ API key, component แผนที่, หมุด + วงโซน + POI, popup, sync กับตัวกรอง, lazy load | แผนที่ทำงานเทียบเท่า prototype แต่ลื่นกว่าบนมือถือ |
| **4. ฟอร์ม** | Server Action + Zod + Turnstile + rate limit สำหรับ lead / ฝากขาย / ต้องการซื้อ, แจ้งเตือนอีเมล + LINE | กรอกฟอร์มแล้วข้อมูลเข้า DB และแอดมินได้แจ้งเตือน |
| **5. หลังบ้าน** | Supabase Auth + MFA, `/admin` คิวตรวจ, อนุมัติ/ปฏิเสธ, อัปโหลดรูป, เบลอพิกัดอัตโนมัติ, CRM board, export CSV | แอดมินอนุมัติแล้วทรัพย์ขึ้นเว็บจริง |
| **6. ก่อนเปิด** | หน้า privacy/terms ฉบับเต็ม, ปุ่มลบข้อมูล, retention cron, audit log, Sentry, Lighthouse, ทดสอบ RLS ด้วย anon key | ผ่าน checklist ข้อ 5 ครบทุกข้อ |

---

## 9. ความเสี่ยง / เรื่องที่ยังต้องตัดสินใจ

| เรื่อง | ประเด็น |
|---|---|
| **ToS ของ Vercel** | Hobby plan ห้ามใช้เชิงพาณิชย์ — เว็บนายหน้าอสังหาฯ นับเป็นเชิงพาณิชย์ ต้องเลือกระหว่างจ่าย Pro หรือย้ายไป Cloudflare/VPS **ตั้งแต่ก่อนเปิด** |
| **License ของ Longdo** | free tier มีเงื่อนไขการใช้เชิงพาณิชย์ที่ต้องอ่านก่อนเปิดจริง — ควรอีเมลถามทีม Longdo ให้ชัดตั้งแต่เฟส 0 |
| **ข้อมูลอำเภอ/ตำบล** | prototype มีแค่ 5 แปลง จังหวัดเลยมี 14 อำเภอ 90 ตำบล — ต้องหา dataset มาใส่ (มี dataset ตำบล/อำเภอไทยเปิดฟรีอยู่) |
| **ใครเป็นคนใส่ทรัพย์** | ถ้าตอนเปิดยังมีทรัพย์แค่ 5–10 แปลง เว็บจะดูร้าง — ควรมีอย่างน้อย 30–50 แปลงก่อนโปรโมต |
| **`rai/ngan/wah`** | ต้องเก็บ `total_wah` เป็น generated column ไว้เรียงลำดับและกรอง ไม่งั้นกรอง "1 ไร่ขึ้นไป" จะช้าเมื่อข้อมูลเยอะ |
| **รูปทรัพย์** | เป็นตัวชี้ขาดว่าคนจะติดต่อไหม แต่ prototype ยังเป็นแค่ placeholder — ต้องวางกระบวนการถ่ายรูป/ขอรูปจากเจ้าของด้วย ไม่ใช่แค่งานโค้ด |
| **ปุ่ม Facebook** | `APP_CONFIG.facebookUrl` ยังชี้ `https://www.facebook.com/` เปล่า ๆ — ต้องมีเพจจริงและ LINE OA จริงก่อนเปิด |

---

## 10. อ้างอิง

- [Longdo Map — ค่าบริการและ free tier](https://map.longdo.com/products/pricing)
- [Longdo Map API v3 — Getting Started (JavaScript)](https://map.longdo.com/docs3/javascript/getting-start)
- [Longdo Map API v3 — Getting Started (React / Next.js)](https://map.longdo.com/docs3/react/getting-start)
- [ตัวอย่างการต่อ Longdo Map กับ Next.js (GitHub)](https://github.com/MetamediaTechnology/longdomap-nextjs-example)
- [TypeScript types สำหรับ Longdo Map](https://github.com/MetamediaTechnology/longdomap-type)
- [Longdo API Console — ขอ API key](https://api.longdo.com/console/)
