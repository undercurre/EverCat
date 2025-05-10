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
import { ref, computed, onUnmounted } from "vue";
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
const totalSeconds = ref(currentMode.value.duration);
const remainingSeconds = ref(totalSeconds.value);
const isStarted = ref(false);
let timer = null;

// 修改后的开始计时方法
function startTimer(mode) {
  currentMode.value = mode;
  totalSeconds.value = mode.duration;
  remainingSeconds.value = totalSeconds.value;
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
