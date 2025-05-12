<template>
  <div class="settings">
    <h2>日志设置</h2>
    <p>当前日志路径：{{ logPath }}</p>
    <button @click="selectFolder">选择日志文件夹</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const logPath = ref("");

async function selectFolder() {
  logPath.value = await window.electronAPI.selectLogFolder();
}
</script>
