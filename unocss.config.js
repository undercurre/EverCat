import { defineConfig, presetUno } from "unocss";

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      // 扩展主题色（可选）
      primary: "#2980b9", // 使用现有项目的蓝色主题
    },
  },
});
