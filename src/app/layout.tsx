import "./globals.css";

// <html> อยู่ใน app/[locale]/layout.tsx เพื่อให้ lang ตรงภาษา หน้าที่อยู่นอก [locale] ต้องมี <html> เอง
export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
