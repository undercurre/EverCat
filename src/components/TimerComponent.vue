<template>
  <div class="floating-window" @mousedown="startDrag">
    <div class="timer-display">
      {{ formattedTime }}
    </div>
    <div class="controls">
      <button @click="toggleTimer">{{ isRunning ? "暂停" : "开始" }}</button>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, computed, onMounted } from "vue";

const timeLeft = ref(25 * 60); // 25分钟
const isRunning = ref(false);
const isAlwaysOnTop = ref(true);
let timer = null;

// 格式化时间显示
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// 切换计时器状态
const toggleTimer = () => {
  isRunning.value = !isRunning.value;
  if (isRunning.value) {
    timer = setInterval(() => {
      timeLeft.value -= 1;
      if (timeLeft.value <= 0) {
        new Notification("番茄钟完成！");
        resetTimer();
      }
    }, 1000);
  } else {
    clearInterval(timer);
  }
};

// 窗口置顶切换
const toggleAlwaysOnTop = () => {
  isAlwaysOnTop.value = !isAlwaysOnTop.value;
  window.electronAPI.setAlwaysOnTop(isAlwaysOnTop.value)
};

// 实现窗口拖动
const startDrag = (e) => {
  const startX = e.screenX;
  const startY = e.screenY;

  const onMouseMove = (e) => {
    const mouseX = e.screenX - startX;
    const mouseY = e.screenY - startY;
    window.electronAPI.windowDrag({ mouseX, mouseY })
  };

  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};
</script>

<style>
.floating-window {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  -webkit-app-region: drag;
}

.controls {
  margin-top: 15px;
  -webkit-app-region: no-drag;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
