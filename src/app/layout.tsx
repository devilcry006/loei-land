import "./globals.css";

// <html>/<body> อยู่ใน app/[locale]/layout.tsx เพื่อให้ lang ตรงกับภาษา
// layout นี้มีไว้ให้หน้าที่อยู่นอก [locale] (เช่น not-found ระดับบนสุด และ /admin ใน P4)
export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
