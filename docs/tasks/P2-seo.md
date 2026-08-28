# P2 — SEO

| | |
|---|---|
| สถานะ | ⬜ ยังไม่เริ่ม |
| ต้องทำหลัง | P1 |
| ทำขนานกับ | P3, P4 |
| ขนาด | M |

## เป้าหมาย

คนที่ค้น Google ว่า "ที่ดินเชียงคาน" หรือ "ที่ดินภูเรือ" มีโอกาสเจอเว็บนี้ และเวลาแชร์ลิงก์ทรัพย์ลง Facebook ต้องขึ้นรูป + ชื่อ + ราคาของแปลงนั้นจริง ๆ

> **ทำไมสำคัญ:** prototype เรนเดอร์ทุกอย่างด้วย JS จาก array ในไฟล์ Google เห็นแค่หน้าเปล่า และทุกอย่างอยู่ URL เดียว แชร์ลิงก์ทรัพย์ไปก็โผล่หน้าแรกเสมอ

## ขอบเขต

**อยู่ในเฟสนี้:** metadata, structured data, sitemap, landing page, OG image
**ไม่อยู่ในเฟสนี้:** เขียนบทความ/บล็อก, ซื้อโฆษณา, backlink — เป็นงานการตลาด ไม่ใช่งานโค้ด

## Checklist

- [ ] **P2-01** `generateMetadata()` ทุกหน้า — title/description ประกอบจากข้อมูลจริง
      เช่น `"ที่ดิน 3-2-20 ไร่ โซนเชียงคาน ราคา 9.6 ล้าน | Loeiland"`
- [ ] **P2-02** ระบบ slug — สร้างจากชื่อ+อำเภอ+code, unique, และ**เก็บ slug เก่าไว้ redirect 301** เมื่อมีการแก้ชื่อ
- [ ] **P2-03** JSON-LD ต่อทรัพย์: `RealEstateListing` + `Place` + `Offer`
      → **ห้ามใส่พิกัดจริงลง `geo`** ใช้ `zone_lat/zone_lon` เท่านั้น ไม่งั้น structured data จะเปิดพิกัดที่ทั้งเว็บพยายามปิด
- [ ] **P2-04** JSON-LD หน้าแรก: `RealEstateAgent` + `LocalBusiness` (ชื่อ ที่อยู่ เบอร์ เวลาทำการ)
- [ ] **P2-05** `app/sitemap.ts` สร้างอัตโนมัติจากทรัพย์ที่ `state='approved'` + `app/robots.ts`
- [ ] **P2-06** landing page รายอำเภอ `/district/[district]` — 14 หน้า พร้อมข้อความแนะนำทำเลของแต่ละอำเภอ (ไม่ใช่แค่ลิสต์ทรัพย์ ต้องมีเนื้อหาจริงไม่งั้นถือเป็น thin content)
- [ ] **P2-07** landing page รายประเภท `/type/[type]`
- [ ] **P2-08** OG image อัตโนมัติด้วย `@vercel/og` — รูปทรัพย์ + ราคา + ขนาด + โลโก้
- [ ] **P2-09** `hreflang` th/en + canonical URL ทุกหน้า

## เกณฑ์ว่า "เสร็จ"

- `curl` หน้า `/property/[slug]` แล้ว**เห็นชื่อทรัพย์กับราคาใน HTML ดิบ** (ไม่ใช่ต้องรัน JS ก่อน)
- ผ่าน [Rich Results Test](https://search.google.com/test/rich-results) ไม่มี error
- วางลิงก์ทรัพย์ใน Facebook Sharing Debugger แล้วขึ้นรูป/ชื่อ/ราคาถูกต้อง
- เปิด `/sitemap.xml` เห็น URL ทรัพย์ครบทุกแปลงที่อนุมัติแล้ว และ**ไม่มี**แปลงที่ยัง pending
- ส่ง sitemap เข้า Google Search Console แล้วสถานะ Success

## ไฟล์ที่จะแตะ

```
app/sitemap.ts  app/robots.ts
app/[locale]/property/[slug]/page.tsx        (generateMetadata + JSON-LD)
app/[locale]/district/[district]/page.tsx
app/[locale]/type/[type]/page.tsx
app/api/og/route.tsx
lib/seo.ts  lib/slug.ts
content/districts/*.md                        (ข้อความแนะนำแต่ละอำเภอ)
```

## ข้อควรระวัง

- **ทรัพย์ที่ขายแล้วอย่าลบทิ้ง** — เปลี่ยน `state` เป็น `sold` แล้วคงหน้าไว้พร้อมป้าย "ขายแล้ว" + แนะนำทรัพย์ใกล้เคียง หน้าที่ติดอันดับแล้วมีค่ามาก ลบทิ้งคือทิ้งของฟรี
- ระวัง duplicate content ระหว่าง `/search?district=เชียงคาน` กับ `/district/เชียงคาน` — ใส่ canonical ชี้ไปที่ landing page และ `noindex` หน้าผลค้นหาที่มี query
- URL ภาษาไทยใช้ได้และดีต่อ SEO ไทย แต่ต้อง encode ให้ถูกและทดสอบการแชร์ในแอปแชทด้วย
