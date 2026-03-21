import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true, // Allows us to use 'describe' and 'it' without importing them
    include: ["src/**/*.test.ts"],
    exclude: ["tests/**/*.spec.ts", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Fixes the @/ imports
    },
  },
});
