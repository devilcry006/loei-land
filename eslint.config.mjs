import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // กัน XSS จากข้อความที่ผู้ใช้กรอก · จำเป็นจริง (เช่น JSON-LD) ให้ปิดเฉพาะบรรทัดพร้อมเหตุผล
      "react/no-danger": "error",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message:
                "หน้าใต้ [locale] ให้ใช้ Link จาก @/i18n/navigation (ใส่ locale ให้อัตโนมัติ)",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/app/not-found.tsx", "src/app/admin/**"],
    rules: { "no-restricted-imports": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "docs/**"]),
]);

export default eslintConfig;
