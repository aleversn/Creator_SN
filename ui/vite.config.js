import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    extensions: [".js", ".vue", ".json"]
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: '@use "@/style/global.scss" as *;' }
    }
  },
  server: { host: "0.0.0.0", port: 8080 }
});
