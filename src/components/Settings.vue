<template>
  <div
    class="w-full flex flex-col justify-start items-center text-#fff mt-20px box-border px-80px box-border"
  >
    <p class="mb-4 flex items-center w-full">
      显示悬浮窗：
      <button
        class="switch-btn w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer duration-300 transition"
        :class="{ active: showFloatWindow }"
        @click="toggleFloatWindow"
      >
        <span
          class="slider absolute left-0 top-0 w-6 h-6 rounded-full bg-white transition-transform duration-300"
        ></span>
      </button>
    </p>
    <p class="w-full">
      当前日志路径：<button
        class="bg-#00adb5 p-8px rounded-6px text-#fff"
        @click="selectFolder"
      >
        {{ logPath || "选择日志路径" }}
      </button>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const logPath = ref("");

async function selectFolder() {
  logPath.value = await window.electronAPI.selectLogFolder();
}

const showFloatWindow = ref(false); // 新增悬浮窗状态

// 新增切换方法
async function toggleFloatWindow() {
  showFloatWindow.value = !showFloatWindow.value;
  await window.electronAPI.toggleFloatWindow(showFloatWindow.value);
}

onMounted(async () => {
  logPath.value = await window.electronAPI.getLogFolder();
  console.log("logPath.value", logPath.value);
  window.electronAPI.onFloatWindowStateChange((_, state) => {
    showFloatWindow.value = state;
  });
  showFloatWindow.value = await window.electronAPI.getFloatWindowState();
  console.log("showFloatWindow.value", showFloatWindow.value);
});
</script>

<style scoped>
/* 新增开关样式 */
.switch-btn.active {
  background-color: #00adb5;
}

.switch-btn.active .slider {
  transform: translateX(24px);
}
</style>
