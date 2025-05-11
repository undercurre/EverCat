import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import Unocss from "unocss/vite"; // 新增导入

const mainConfig = {
  base: "./",
  plugins: [vue(), Unocss()],
  server: {
    port: 3000,
  },
};

const electronConfig = {
  plugins: [
    vue(),
    Unocss(),
    electron({
      main: {
        entry: "main.js",
      },
    }),
  ],
};

export default defineConfig(({ command }) => {
  return command === "build"
    ? mainConfig
    : { ...mainConfig, ...electronConfig };
});
