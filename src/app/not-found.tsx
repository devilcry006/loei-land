import Link from "next/link";

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
