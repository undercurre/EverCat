import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";

export default defineConfig({
  base: "./",
  plugins: [
    vue({
      // 增加模板编译选项（处理中文等特殊字符）
      template: {
        compilerOptions: {
          isCustomElement: (tag) => false,
        },
      },
    }),
    electron({
      main: {
        entry: "main.js",
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
