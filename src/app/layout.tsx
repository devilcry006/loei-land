import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loeiland | ที่ดินและอสังหาริมทรัพย์จังหวัดเลย",
  description:
    "ค้นหาที่ดิน บ้าน สวน รีสอร์ต และอสังหาริมทรัพย์จังหวัดเลยแบบดูโซนบนแผนที่",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
