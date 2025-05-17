import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import Unocss from "unocss/vite"; // 新增导入

export default defineConfig(({ command }) => ({
  base: "./",
  plugins: [
    vue(),
    Unocss(),
    command !== "build" &&
      electron({
        // 仅开发时启用 electron
        main: { entry: "main.js" },
      }),
  ],
  server: { port: 3000 },
}));
