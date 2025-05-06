import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    electron({
      main: {
        entry: "main.js",
      },
    }),
  ],
});
