<template>
  <div class="settings text-#fff w-full mt-20px">
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
});
</script>
