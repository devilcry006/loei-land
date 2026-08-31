# Loeiland — แบ่งงาน 2 สาย: หน้าบ้าน / หลังบ้าน

> มุมมองตัดขวางของ [`ROADMAP.md`](./ROADMAP.md) — จัด 71 task เป็น 2 สายเพื่อทำขนาน
> subtask จริงยังอยู่ที่ [`tasks/P0.md`](./tasks/P0.md)…[`tasks/P6.md`](./tasks/P6.md) · สถานะที่ [`PROGRESS.md`](./PROGRESS.md)

**นิยาม**

| สาย | ครอบคลุม |
|---|---|
| 🟦 **หน้าบ้าน (FE)** | Next.js pages/components, rendering, Tailwind/UI, i18n dict, SEO metadata, แผนที่ฝั่ง client, ฟอร์ม UI, หน้าจอแอดมิน |
| 🟥 **หลังบ้าน (BE)** | DB schema + RLS, data-access layer, Server Actions, Auth, Storage, integrations (Resend/LINE/Turnstile verify), rate limit, cron, infra/CI/deploy, contract & e2e test |
| 🟨 **ร่วม** | ต้องทั้งสองสายต่อกัน (shared lib / ฟอร์ม+action / อัปโหลด) — จบเมื่อสองฝั่งมาบรรจบ |

**หลักการเดินงาน**

1. **หลังบ้านนำก่อนใน P0–P1** — schema + RLS + DAL + seed ต้องเสร็จก่อน หน้าบ้านถึงจะต่อหน้า public ได้
2. **หลัง P1 หน้าบ้านวิ่งยาว** — P2 (SEO) + P3 (แผนที่) เกือบทั้งหมดเป็น FE ทำขนานกันได้
3. **ช่วง P2/P3 หลังบ้านเริ่ม P4/P5 ล่วงหน้า** — Server Actions, rate limit, Auth (P5-01/02) ทำได้เลยไม่ต้องรอ FE
4. **P4 และ P5 คือจุดบรรจบ** — ฟอร์ม/หน้าจอแอดมิน (FE) ต่อกับ action/DB (BE)

---

## ตาราง task → สาย

| เฟส | 🟦 หน้าบ้าน | 🟥 หลังบ้าน | 🟨 ร่วม |
|---|---|---|---|
| **P0** | P0-02, P0-03 | P0-01, P0-04, P0-05, P0-06, P0-07, P0-08, P0-09 | — |
| **P1** | P1-07, P1-08, P1-09, P1-10, P1-11, P1-12, P1-13, P1-14 | P1-01, P1-02, P1-03, P1-04, P1-06, P1-15 | P1-05 |
| **P2** | P2-01, P2-02, P2-03, P2-04, P2-05, P2-06, P2-07, P2-08, P2-09 | P2-10 | — |
| **P3** | P3-02, P3-03, P3-04, P3-05, P3-06, P3-07, P3-08 | P3-01 | — |
| **P4** | P4-02, P4-09 | P4-04, P4-05, P4-06, P4-07, P4-08, P4-10 | P4-01, P4-03 |
| **P5** | P5-03, P5-07 | P5-01, P5-02, P5-04, P5-05, P5-08, P5-09 | P5-06 |
| **P6** | P6-01, P6-07, P6-08 | P6-03, P6-04, P6-06, P6-09, P6-10 | P6-02, P6-05 |

รวม: 🟦 33 · 🟥 32 · 🟨 6

---

## 🟥 เส้นทางสายหลังบ้าน (ลำดับทำ + ปลดล็อกอะไร)

| ลำดับ | task | ปลดล็อก |
|---|---|---|
| 1 | **P0-01** scaffold · **P0-04** Supabase clients · **P0-05** env · **P0-06** tooling · **P0-07** CI · **P0-08** deploy · **P0-09** Sentry | ทุกอย่าง |
| 2 | **P1-01/02** migrations · **P1-03** RLS | P1-04, งาน FE ทั้ง P1 |
| 3 | **P1-04** data-access layer (`PublicProperty` ไม่มีฟิลด์ลับ) | 🟦 P1-08/09/10/11 |
| 4 | **P1-06** seed 5 แปลง + POI + อำเภอ (รอ **D-4**) | 🟦 เห็นข้อมูลจริงบนหน้า |
| 5 | **P1-15** contract test (public ไม่คืนฟิลด์ลับ) | เกณฑ์จบ P1 |
| 6 | **P3-01** Longdo key (รอ **D-1** สำหรับ prod) | 🟦 P3-02 |
| 7 | **P4-01** Zod schemas (ร่วม) · **P4-04** rate limit · **P4-05/06/07** Server Actions · **P4-08** แจ้งเตือน Resend/LINE (รอ **D-3**) | 🟦 P4-02 ต่อ action ได้ |
| 8 | **P4-10** test anon-write ถูกปฏิเสธ | เกณฑ์จบ P4 |
| 9 | **P5-01** Auth+MFA · **P5-02** middleware + ลบ PIN | 🟦 P5-03 หน้าจอแอดมิน |
| 10 | **P5-04** approve + เบลอพิกัด · **P5-05** reject/delete · **P5-08** audit_log · **P5-09** CSV | เกณฑ์จบ P5 |
| 11 | **P6-03** retention cron · **P6-04** Sentry เต็ม · **P6-06** Playwright e2e · **P6-10** ปิด D-1/D-2 + go-live | เปิดจริง |
| — | **P2-10** ตรวจ Rich Results + ส่ง Search Console (ops) · **P6-09** seed 30–50 แปลงจริง (ops, รอ **D-5**) | |

## 🟦 เส้นทางสายหน้าบ้าน (ลำดับทำ + รออะไรจากหลังบ้าน)

| ลำดับ | task | รอ 🟥 |
|---|---|---|
| 1 | **P0-02** Tailwind + design tokens · **P0-03** next-intl routing | P0-01 |
| 2 | **P1-07** i18n dict (ย้าย `i18n` จาก mockup) | — (ทำคู่ขนาน P0/P1 ได้) |
| 3 | **P1-08** หน้าแรก · **P1-09** การ์ดทรัพย์ | P1-04 |
| 4 | **P1-10** ตัวกรอง + /search · **P1-11** หน้าทรัพย์ | P1-04 |
| 5 | **P1-12** static params · **P1-13** empty/loading/error · **P1-14** mobile pass | P1-11 |
| 6 | **P2-01…P2-09** metadata, JSON-LD, sitemap, robots, landing 14 อำเภอ + ประเภท, OG image, next/image | เสร็จ P1 |
| 7 | **P3-02…P3-08** ZoneMap lazy, หมุด, วงโซน, POI, popup, sync, มือถือ | P3-01 |
| 8 | **P4-02** RHF 3-step + **P4-03** Turnstile widget (ร่วม) · **P4-09** UX สำเร็จ/ผิดพลาด | P4-01, P4-05/06/07 |
| 9 | **P5-03** คิวตรวจ /admin · **P5-07** CRM board | P5-02, P5-04, P5-08 |
| 10 | **P6-01** privacy/terms · **P6-07** perf budget · **P6-08** CTA FB/LINE (รอ **D-3**) | — |

## 🟨 จุดบรรจบ (ต้องนัดสองสายมาต่อกัน)

| task | ฝั่ง FE ทำ | ฝั่ง BE ทำ |
|---|---|---|
| **P1-05** utils หน่วยที่ดิน | เรียกใช้ใน card/detail | เขียน `format.ts` + unit test |
| **P4-01** Zod schemas | ใช้ใน `zodResolver` | ใช้ validate ใน Server Action |
| **P4-03** Turnstile | ฝัง widget + ส่ง token | verify token กับ Cloudflare |
| **P5-06** อัปโหลดรูป | UI เลือกไฟล์ + จัด `sort_order` + `is_cover` | Storage private bucket + signed URL |
| **P6-02** data subject request | ฟอร์มหน้าเว็บ | `/admin/data-requests` + hard delete + audit |
| **P6-05** analytics | ฝัง script + ยิง event | เลือกเครื่องมือ (**D-7**) + ตั้งค่า |

---

## ทำขนานยังไง (2 เลน)

```
เวลา →
เลน 🟥 หลังบ้าน : P0 infra ─ P1 schema+RLS+DAL+seed ─┬─ P4 actions+ratelimit ─ P5 auth+approve+audit ─ P6 cron+e2e+golive
                                                    │
เลน 🟦 หน้าบ้าน : P0-02/03 ─(รอ P1-04)─ P1 หน้า public ─┴─ P2 SEO ∥ P3 แผนที่ ── P4 ฟอร์ม UI ─ P5 หน้าจอแอดมิน ─ P6 privacy+perf
```

- **สัปดาห์แรก:** 🟥 ลุย P0+P1 schema · 🟦 ทำ P0-02/03 + P1-07 (i18n dict) ระหว่างรอ
- **หลัง P1-04 ผ่าน:** 🟦 เปิดเต็มสูบ P1 หน้า public → P2 + P3 (ยาวสุดของสาย FE)
- **ระหว่างนั้น:** 🟥 เริ่ม P4 (Server Actions) + P5-01/02 (Auth) ล่วงหน้า
- **บรรจบที่ P4:** FE ต่อฟอร์มเข้ากับ action ที่ BE ทำไว้
- **บรรจบที่ P5:** FE ทำหน้าจอแอดมินบน query/action ที่ BE ทำไว้
- **P6:** แบ่งตาม tag ในตาราง ทำขนานได้เกือบหมด
