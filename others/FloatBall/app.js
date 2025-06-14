// 创建 Vue 应用
const { createApp, ref, onMounted, onUnmounted, computed } = Vue;

const STORAGE_KEY = "timerState";

const app = createApp({
  // 数据选项
  setup(props) {
    const isDragging = ref(false);
    const isExpanded = ref(false);
    const startX = ref(0);
    const startY = ref(0);
    const windowInitialX = ref(0);
    const windowInitialY = ref(0);
    const mouseDownTime = ref(Date.now());

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

    async function handleMouseDown(e) {
      if (isExpanded.value) return; // 展开状态不允许拖动
      isDragging.value = true;
      mouseDownTime.value = Date.now();
    }

    async function handleMouseOver(e) {
      if (isExpanded.value || !isDragging.value) return; // 展开状态不允许拖动
    }

    // 处理鼠标移动事件
    function handleMouseMove(e) {
      if (!isDragging.value) return;
      window.electronAPI.dragWindow(170, 170);
    }

    function handleMouseUp() {
      isDragging.value = false;
      // 如果不是拖拽且点击时间小于200ms，则触发展开/收起
      if (Date.now() - mouseDownTime.value < 200) {
        toggleExpand();
      }
    }

    function handleMouseLeave() {}

    function toggleExpand() {
      isExpanded.value = !isExpanded.value;
    }

    function handleAction(type) {
      switch (type) {
        case "work":
          startTimer(modes.WORK);
          saveState();
          break;
        case "rest":
          startTimer(modes.BREAK);
          saveState();
          break;
        case "reset":
          resetTimer();
          break;
      }
      toggleExpand();
    }

    async function loadState() {
      try {
        const storedData = await window.electronAPI.getStore(STORAGE_KEY);
        console.info("loadState:", storedData);
        if (storedData) {
          const saved = JSON.parse(storedData);
          currentMode.value =
            Object.values(modes).find((m) => m.label === saved.modeLabel) ||
            modes.WORK;
          console.info("currentMode:", currentMode.value);
          endTimestamp.value = saved.endTimestamp;
          console.info("saved:", typeof saved, Object.keys(saved));
          console.info("endTimestamp:", endTimestamp.value);
          // 通过endTimestamp计算remainingSeconds
          const now = Date.now();
          const elapsed = Math.max(0, endTimestamp.value - now);
          remainingSeconds.value = Math.floor(elapsed / 1000);
          console.info("remainingSeconds:", remainingSeconds.value);
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
      timer = null;
      currentMode.value = modes.WORK;
      endTimestamp.value = null;
      remainingSeconds.value = currentMode.value.duration;
      totalSeconds.value = currentMode.value.duration;
      isStarted.value = false;
      isEnded.value = false;
      saveState(); // 重置后立即保存状态
    }

    function startTimer(mode) {
      clearInterval(timer);
      timer = null;
      currentMode.value = mode;
      totalSeconds.value = mode.duration;
      console.info(remainingSeconds.value, endTimestamp.value);
      // 没有endTimestamp时，直接设置remainingSeconds
      if (!endTimestamp.value) {
        remainingSeconds.value = totalSeconds.value;
        // 计算endTimestamp
        endTimestamp.value = Date.now() + totalSeconds.value * 1000;
      }
      isStarted.value = true;
      timer = setInterval(() => {
        if (remainingSeconds.value <= 0) {
          isEnded.value = true;
          clearInterval(timer);
          timer = null;
          return;
        }
        remainingSeconds.value--;
      }, 1000);
    }

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

    const percentage = computed(() => {
      return Math.floor(
        (1 - remainingSeconds.value / totalSeconds.value) * 100
      );
    });

    onMounted(async () => {
      loadState();
      const pos = await window.electronAPI.getFloatWindowPos();
      windowInitialX.value = pos[0];
      windowInitialY.value = pos[1];
      window.electronAPI.onDataUpdated((key, value) => {
        console.log(`数据已更新: ${key} =>`, value);
        loadState();
      });
    });

    onUnmounted(() => {
      saveState();
      clearInterval(timer);
      timer = null;
    });

    return {
      isDragging,
      isExpanded,
      startX,
      startY,
      windowInitialX,
      windowInitialY,
      mouseDownTime,
      modes,
      currentMode,
      endTimestamp,
      totalSeconds,
      remainingSeconds,
      isStarted,
      isEnded,
      handleMouseDown,
      handleMouseOver,
      handleMouseMove,
      handleMouseUp,
      handleMouseLeave,
      toggleExpand,
      handleAction,
      loadState,
      saveState,
      percentage,
    };
  },
});

// 挂载应用
app.mount("#floatApp");
