import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import Unocss from "unocss/vite"; // 新增导入
import { presetUno } from "unocss"; // 新增导入

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
    Unocss({
      // 新增插件配置
      presets: [presetUno()],
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
