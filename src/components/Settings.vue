<template>
  <div
    class="flex flex-col justify-center items-center text-#fff mt-20px box-border"
  >
    <p>
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

onMounted(async () => {
  logPath.value = await window.electronAPI.getLogFolder();
  console.log("logPath.value", logPath.value);
});
</script>
