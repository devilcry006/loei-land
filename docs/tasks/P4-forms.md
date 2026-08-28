# P4 — ฟอร์มสาธารณะ

| | |
|---|---|
| สถานะ | ⬜ ยังไม่เริ่ม |
| ต้องทำหลัง | P1 |
| ปลดล็อกให้ | P5 |
| ขนาด | M |

## เป้าหมาย

ฟอร์มทั้ง 3 ตัว (สนใจทรัพย์ / ฝากขาย / แจ้งต้องการซื้อ) บันทึกเข้า Postgres จริง กันบอทได้ และแอดมินได้รับแจ้งเตือนทันที

## ขอบเขต

**อยู่ในเฟสนี้:** validation, กันบอท, บันทึกข้อมูล, แจ้งเตือน, บันทึก consent
**ไม่อยู่ในเฟสนี้:** หน้าจอที่แอดมินใช้ดู/อนุมัติ (P5) — เฟสนี้แค่ทำให้ข้อมูล "เข้ามา" ได้ถูกต้องปลอดภัย

## Checklist

- [ ] **P4-01** Zod schema ใน `lib/schemas/` ใช้ร่วมกันทั้ง client validation และ server — เขียนที่เดียว
- [ ] **P4-02** Cloudflare Turnstile ทั้ง 3 ฟอร์ม + verify token ฝั่ง server
- [ ] **P4-03** rate limit ต่อ IP (เช่น 5 ครั้ง/ชม./ฟอร์ม) — เก็บ `ip_hash` ไม่ใช่ IP ดิบ
- [ ] **P4-04** Server Action ฟอร์มสนใจทรัพย์ → `leads` (จาก `index.html:1119-1134`)
- [ ] **P4-05** Server Action ฟอร์มฝากขาย → `properties` (`state='pending'`) + `property_private` ในทรานแซกชันเดียว (จาก `index.html:1146-1245`)
      → **ข้อมูลเจ้าของและพิกัดจริงต้องลง `property_private` เท่านั้น** ห้ามปนเข้า `properties`
- [ ] **P4-06** Server Action ฟอร์มแจ้งต้องการซื้อ → `buyer_requests` (จาก `index.html:1257-1324`)
- [ ] **P4-07** บันทึก consent เป็นข้อมูล: `consent_at` + `consent_version` (ข้อความ consent 3 ชุดอยู่ที่ `index.html:1587-1589`) + เก็บข้อความแต่ละเวอร์ชันไว้ใน repo
- [ ] **P4-08** แจ้งเตือนอีเมลผ่าน Resend เมื่อมีรายการใหม่ — **ในอีเมลใส่แค่ลิงก์เข้า `/admin` ห้ามใส่เบอร์/ชื่อผู้ติดต่อในเนื้ออีเมล**
- [ ] **P4-09** แจ้งเตือน LINE (ขึ้นกับ D-3 ว่ามี LINE OA จริงหรือยัง)
- [ ] **P4-10** ฟอร์มฝากขาย 20 ช่องแบ่งเป็น 3 สเต็ป + `inputmode="numeric"` ช่องตัวเลข + ปุ่มแตะ ≥44px + จำค่าที่กรอกไว้เมื่อกดถอยกลับ

## เกณฑ์ว่า "เสร็จ"

- ส่งฟอร์มครบทั้ง 3 แล้วข้อมูลเข้า DB ถูกตาราง ถูกคอลัมน์
- ส่งฟอร์มฝากขายแล้ว query `select * from properties where state='pending'` **ไม่เห็น** ชื่อ/เบอร์เจ้าของ (อยู่ใน `property_private`)
- ปิด JS แล้วยิง POST ตรงด้วย `curl` โดยไม่มี Turnstile token → ต้องถูกปฏิเสธ
- ยิงฟอร์มรัว 10 ครั้ง → ครั้งที่ 6 เป็นต้นไปถูกบล็อก
- กรอก `<script>alert(1)</script>` ในช่องหมายเหตุ แล้วเปิดดูใน `/admin` ต้องเห็นเป็น**ข้อความธรรมดา** ไม่ใช่ popup
- ส่งฟอร์มแล้วได้อีเมลแจ้งเตือนภายใน 1 นาที

## ไฟล์ที่จะแตะ

```
lib/schemas/lead.ts  lib/schemas/submission.ts  lib/schemas/buyerRequest.ts
lib/turnstile.ts  lib/ratelimit.ts  lib/notify.ts
app/actions/lead.ts  app/actions/submitProperty.ts  app/actions/buyerRequest.ts
app/[locale]/submit/page.tsx
app/[locale]/buyer-request/page.tsx
components/forms/*
content/consent/v1.th.md                       (เก็บข้อความ consent แต่ละเวอร์ชัน)
```

## ข้อควรระวัง

- **ห้ามให้ anon key insert เข้า Supabase ตรง ๆ** — ต้องผ่าน Server Action ที่ตรวจ Turnstile + rate limit ก่อน แล้วเขียนด้วย service role ฝั่ง server เท่านั้น ถ้าเปิด anon insert จะโดนยิงฟอร์มขยะรัวทันที
- prototype ให้เจ้าของกรอก "ละติจูดโซนโดยประมาณ" เอง (`index.html:1203-1209`) — **เชื่อไม่ได้** ให้รับพิกัดจริงเข้า `property_private` แล้วให้ระบบเบลอเองตอนอนุมัติ (P5-05)
- prototype มี `sendToEndpoint()` ยิงไป Google Apps Script (`index.html:2174`) — ตัดทิ้ง ไม่ต้อง port
- ค่า default พิกัด `17.486, 101.58` ใน prototype (`index.html:2222`) อย่า port มา ถ้าไม่มีพิกัดให้เป็น null แล้วให้แอดมินเติม
