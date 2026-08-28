# P3 — แผนที่ Longdo

| | |
|---|---|
| สถานะ | ⬜ ยังไม่เริ่ม |
| ต้องทำหลัง | P1 |
| ทำขนานกับ | P2, P4 |
| ขนาด | M |

## เป้าหมาย

แทนที่ tile renderer ที่เขียนเองใน prototype (`index.html:1857-1987`) ด้วย Longdo Map v3 — ให้ทำงานได้เท่าเดิมทุกอย่าง แต่ลื่นบนมือถือและถูกลิขสิทธิ์

> **ทำไมต้องเปลี่ยน:** prototype เขียน projection/unproject/tileUrl เองและดึง tile จาก OpenStreetMap ตรง ๆ ซึ่งผิด usage policy ของ OSM เมื่อใช้เชิงพาณิชย์ ส่วน Longdo มีข้อมูลไทยละเอียดกว่ามาก

## ขอบเขต

**อยู่ในเฟสนี้:** map component, หมุด, วงโซน, POI, popup, sync กับตัวกรอง
**ไม่อยู่ในเฟสนี้:** วาดขอบเขตแปลงจริง, street view, เส้นทางนำทาง

## Checklist

- [ ] **P3-01** ขอ API key ที่ [api.longdo.com/console](https://api.longdo.com/console/) + ตั้ง domain restriction ให้ใช้ได้เฉพาะโดเมนของเรา
- [ ] **P3-02** `<PropertyMap>` component — โหลดผ่าน `dynamic(..., { ssr: false })` และ **lazy load ต่อเมื่อผู้ใช้กดดูแผนที่**
      → ประหยัดทั้ง data ผู้ใช้บนมือถือ และ transaction quota ของ Longdo
- [ ] **P3-03** หมุดทรัพย์ + **วงกลมโซน** รัศมี `zone_radius_m` — วงกลมสำคัญกว่าหมุด เพราะสื่อว่า "บริเวณโดยประมาณ" ไม่ใช่จุดเป๊ะ
- [ ] **P3-04** ชั้น POI จากตาราง `poi` (โรงพยาบาล, มหาวิทยาลัย, ตลาด, อุทยาน) — เปิด/ปิดได้
- [ ] **P3-05** การ์ด preview ตอน hover/tap — port พฤติกรรมจาก `showMapPreview()` (`index.html:1893`)
      → บนมือถือใช้ **tap** ไม่ใช่ hover และให้เด้งเป็น bottom sheet
- [ ] **P3-06** sync สองทาง: กรอง → แผนที่อัปเดตหมุด · คลิกหมุด → เลื่อนไปการ์ดนั้นในรายการ (`focusProperty()` ที่ `index.html:2078`)
- [ ] **P3-07** clustering เมื่อหมุดเยอะ + ปุ่ม "ค้นหาในบริเวณนี้" เมื่อผู้ใช้เลื่อนแผนที่
- [ ] **P3-08** ใส่ตัวนับ/แจ้งเตือนการใช้ quota + fallback เป็นรายการเฉย ๆ ถ้าแผนที่โหลดไม่ขึ้น

## เกณฑ์ว่า "เสร็จ"

- เปิดหน้าแรกครั้งแรก **ไม่มี** request ไป Longdo เลยจนกว่าจะกดดูแผนที่ (ดูใน Network tab)
- ลากแผนที่บนมือถือจริงแล้วลื่น ไม่กระตุก
- กรองเป็น "เชียงคาน" แล้วหมุดเหลือเฉพาะเชียงคาน
- ตรวจ Network tab: พิกัดที่ส่งมาฝั่ง client ต้องเป็น `zone_lat/zone_lon` เท่านั้น **ไม่มี** `exact_lat/exact_lon` หลุดมา
- แผนที่โหลดไม่ขึ้น (ลองบล็อกโดเมน Longdo) แล้วเว็บยังใช้งานได้ ไม่ขาวทั้งหน้า

## ไฟล์ที่จะแตะ

```
components/map/PropertyMap.tsx
components/map/MapMarker.tsx  components/map/ZoneCircle.tsx
components/map/MapPreviewCard.tsx
lib/longdo.ts
types/longdo.d.ts
app/[locale]/page.tsx        (เชื่อมแผนที่เข้ากับตัวกรอง)
```

## อ้างอิง

- [Longdo Map v3 — Getting Started (React/Next.js)](https://map.longdo.com/docs3/react/getting-start)
- [ตัวอย่าง Longdo + Next.js บน GitHub](https://github.com/MetamediaTechnology/longdomap-nextjs-example)
- [TypeScript types สำหรับ Longdo Map](https://github.com/MetamediaTechnology/longdomap-type)
- free tier: 800,000 map transactions/เดือน · 100,000 service transactions/เดือน · 60 req/นาที · 5,000 req/วัน

## ข้อควรระวัง

- API key ของ Longdo ต้องอยู่ฝั่ง client (SDK ต้องใช้) → **บังคับตั้ง domain restriction ใน console ให้ได้** ไม่งั้นคนอื่นเอาคีย์เราไปใช้จนเต็ม quota
- อย่าเรียก geocoding API ของ Longdo ทุกครั้งที่เรนเดอร์ — นับเป็น service transaction แคชผลไว้ใน DB
- ยังไม่มีคำตอบเรื่องเงื่อนไขเชิงพาณิชย์ของ free tier (ดู D-2 ใน PROGRESS) — ใช้ dev ไปก่อนได้ แต่ต้องเคลียร์ก่อนเปิดจริง
