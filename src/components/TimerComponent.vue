<template>
  <div class="countdown">
    <ProgressCube :metrics="progressMetrics" />
    <!-- 修改按钮逻辑 -->
    <div class="control-buttons">
      <button
        v-if="!isStarted"
        @click="startTimer(modes.WORK)"
        class="mode-btn work"
      >
        开始工作
      </button>
      <button
        v-if="!isStarted"
        @click="startTimer(modes.BREAK)"
        class="mode-btn break"
      >
        休息一下
      </button>
      <button
        v-if="isStarted || isEnded"
        @click="resetTimer"
        class="mode-btn restart"
      >
        重新开始
      </button>
    </div>
    <div v-if="isStarted && !isEnded" class="time-container">
      <div class="time-unit">
        <div class="number">{{ hours }}</div>
        <div class="label">小时</div>
      </div>
      <div class="time-unit">
        <div class="number">{{ minutes }}</div>
        <div class="label">分</div>
      </div>
      <div class="time-unit">
        <div class="number">{{ seconds }}</div>
        <div class="label">秒</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, onUnmounted } from "vue";
import ProgressCube from "./ProgressCube.vue";

// 新增模式状态
const modes = {
  WORK: {
    label: "工作钟",
    duration: 60 * 60, // 1小时
    color: "#00adb5",
  },
  BREAK: {
    label: "休息钟",
    duration: 10 * 60, // 10分钟
    color: "#4CAF50",
  },
};

const currentMode = ref(modes.WORK);
const endTimestamp = ref(null);
const totalSeconds = ref(currentMode.value.duration);
const remainingSeconds = ref(totalSeconds.value);
const isStarted = ref(false);
const isEnded = ref(false);
let timer = null;

const STORAGE_KEY = "timerState";

function loadState() {
  try {
    const storedData = window.electronAPI.getStore(STORAGE_KEY);
    if (storedData) {
      const saved = JSON.parse(storedData);
      currentMode.value =
        Object.values(modes).find((m) => m.label === saved.modeLabel) ||
        modes.WORK;
      endTimestamp.value = saved.endTimestamp;
      // 通过endTimestamp计算remainingSeconds
      const now = Date.now();
      const elapsed = Math.max(0, endTimestamp.value - now);
      remainingSeconds.value = Math.floor(elapsed / 1000);
      totalSeconds.value = currentMode.value.duration;
      isStarted.value = saved.isStarted;
      isEnded.value = saved.isEnded;

      // 如果计时器原本在运行中，重新启动
      if (isStarted.value && !isEnded.value) {
        startTimer(currentMode.value);
      }
    }
  } catch (e) {
    console.warn("Failed to load timer state:", e);
  }
}

function saveState() {
  const state = {
    modeLabel: currentMode.value.label,
    endTimestamp: endTimestamp.value,
    isStarted: isStarted.value,
    isEnded: isEnded.value,
  };
  window.electronAPI.setStore(STORAGE_KEY, JSON.stringify(state));
}

function resetTimer() {
  clearInterval(timer);
  currentMode.value = modes.WORK;
  endTimestamp.value = null;
  remainingSeconds.value = currentMode.value.duration;
  totalSeconds.value = currentMode.value.duration;
  isStarted.value = false;
  isEnded.value = false;
  saveState(); // 重置后立即保存状态
}

// 组件挂载时加载状态
onMounted(loadState);

// 修改后的开始计时方法
function startTimer(mode) {
  currentMode.value = mode;
  totalSeconds.value = mode.duration;
  // 没有endTimestamp时，直接设置remainingSeconds
  if (!endTimestamp.value) {
    remainingSeconds.value = totalSeconds.value;
    // 计算endTimestamp
    endTimestamp.value = Date.now() + totalSeconds.value * 1000;
  }
  saveState();
  isStarted.value = true;

  timer = setInterval(() => {
    if (remainingSeconds.value <= 0) {
      isEnded.value = true;
      clearInterval(timer);
      return;
    }
    remainingSeconds.value--;
  }, 1000);
}

// 更新进度条参数
const progressMetrics = computed(() => [
  {
    label: currentMode.value.label,
    percentage:
      ((totalSeconds.value - remainingSeconds.value) / totalSeconds.value) *
      100,
    barColor: currentMode.value.color,
  },
]);

// 时间计算逻辑调整为使用剩余秒数
const hours = computed(() => Math.floor(remainingSeconds.value / 3600));
const minutes = computed(() =>
  Math.floor((remainingSeconds.value % 3600) / 60)
);
const seconds = computed(() => remainingSeconds.value % 60);

onUnmounted(() => {
  saveState();
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
/* 新增按钮样式 */
.control-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mode-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &.work {
    background: #00adb5;
    color: white;
  }

  &.break {
    background: #4caf50;
    color: white;
  }

  &.restart {
    background: #ff5722;
    color: white;
  }
}

.countdown {
  font-family: Arial, sans-serif;
  text-align: center;
}

.time-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.time-unit {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  min-width: 80px;
}

.number {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.label {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.3rem;
}

.ended {
  font-size: 1.5rem;
  color: #ff4444;
  font-weight: bold;
}
</style>
