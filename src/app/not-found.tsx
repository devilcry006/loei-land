import Link from "next/link";

// 404 สำหรับ URL ที่ไม่ผ่าน [locale] (หน้า 404 สองภาษาแบบเต็มทำใน P1-08)
export default function GlobalNotFound() {
  return (
    <html lang="th">
      <body className="flex min-h-screen items-center justify-center bg-bg p-6 font-sans text-ink">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ไม่พบหน้านี้</h1>
          <p className="text-muted">Page not found</p>
          <Link href="/th" className="mt-4 inline-block font-bold text-brand underline">
            กลับหน้าแรก
          </Link>
        </div>
      </body>
    </html>
  );
}
