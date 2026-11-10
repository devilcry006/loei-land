import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // "server-only" throw เมื่อ import นอก React server — ใน test ให้เป็น module ว่าง
      "server-only": new URL("./src/test/server-only-stub.ts", import.meta.url).pathname,
    },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "node",
  },
});
