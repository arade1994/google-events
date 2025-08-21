import path from "path";
import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    watch: true,
    setupFiles: ["./vitest-setup.ts"],
    exclude: ["node_modules", "dist", "build", "public/**"],
    coverage: {
      enabled: true,
      reporter: ["text", "text-summary", "json", "lcov"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
