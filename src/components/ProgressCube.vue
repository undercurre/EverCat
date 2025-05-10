<template>
  <div class="progress-bars">
    <div class="wrapper">
      <div
        v-for="(metric, index) in metrics"
        :key="index"
        class="progress_container"
      >
        <div class="label" :class="metric.labelClass">{{ metric.label }}</div>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{
              width: `${metric.percentage}%`,
              backgroundColor: metric.barColor,
            }"
          >
            <div class="glow"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  metrics: {
    type: Array,
    default: () => [
      {
        label: "默认指标",
        percentage: 70, // 默认值改为百分比数值
        labelClass: "one",
        barColor: "#04bfff", // 新增颜色自定义
      },
    ],
  },
});
</script>

<style lang="scss" scoped>
$background-color: transparent;
$bar-empty: #55708d;
$bar-color: #cfd6dd;
$glow-width: 20px;
$glow-radius: 10px;
$glow-color: #04bfff;

.progress-bars {
  width: 600px;
  box-sizing: border-box;
  background-color: $background-color;
}

.wrapper {
  max-width: 600px;
  margin: 0 auto;

  .progress_container {
    padding: 20px;

    > * {
      margin-bottom: 10px;
    }
  }
}

.progress-bar {
  height: 3px;
  width: 100%;
  position: relative;
  z-index: 10;
  background-color: $bar-empty;

  .progress {
    position: relative;
    height: 100%;
    background-color: $bar-color;
    transition: width 0.5s ease-out;
    border-radius: 0px 2px 2px 0px;
  }

  .glow {
    width: $glow-width;
    max-width: 100%;
    height: 100%;
    float: right;

    &::before,
    &::after {
      content: "";
      display: block;
      position: relative;
      border-radius: 0px 2px 2px 0px;
    }

    &::before {
      background: transparent;
      height: 100%;
      box-shadow: 0px 0px $glow-radius $bar-color,
        0px 0px $glow-radius $glow-color;
      z-index: -5;
    }

    &::after {
      background: linear-gradient(to right, transparent 0%, transparent 100%);
      height: calc(50% + #{$glow-radius} + #{$glow-radius});
      width: calc(50% + #{$glow-radius});
      top: (-$glow-radius);
      left: (-$glow-radius);
      z-index: -3;
    }
  }
}

.label {
  font-family: Poppins;
  color: white;
  text-shadow: 0px 0px 2px $bar-color;
  font-size: 24px;
  opacity: 0.9;
}
.progress {
  animation: fill-1 0.5s ease-out 0s forwards;
}

.label.one {
  animation: label 0.5s ease-out 0s forwards;
}

@keyframes label {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 0.9;
    transform: translateY(0);
  }
}
</style>
