import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const dir = path.dirname(fileURLToPath(import.meta.url));

// Standalone client-only build used to package the site as an offline desktop app.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@/lib/gate.functions", replacement: path.resolve(dir, "src/electron/gate.local.ts") },
      { find: "@", replacement: path.resolve(dir, "src") },
    ],
  },
  define: {
    __ADMIN_PASSWORD__: JSON.stringify(process.env["SITE_PASSWORD"] ?? "tenaosis"),
  },
  build: {
    outDir: "dist-electron-renderer",
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(dir, "electron/index.html") },
  },
});
