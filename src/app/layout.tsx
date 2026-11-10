import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loeiland | ที่ดินและอสังหาริมทรัพย์จังหวัดเลย",
  description:
    "ค้นหาที่ดิน บ้าน สวน รีสอร์ต และอสังหาริมทรัพย์จังหวัดเลยแบบดูโซนบนแผนที่",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${notoThai.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
