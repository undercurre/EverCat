// 创建 Vue 应用
const { createApp } = Vue;

const app = createApp({
  // 数据选项
  data() {
    return {
      isDragging: false,
      isExpanded: false,
      startX: 0,
      startY: 0,
      windowInitialX: 0,
      windowInitialY: 0,
      mouseDownTime: Date.now(),
    };
  },
  // 方法选项
  methods: {
    // 处理鼠标按下事件
    handleMouseDown(e) {
      if (this.isExpanded) return; // 展开状态不允许拖动
      this.isDragging = true;
      this.windowInitialX = e.screenX - this.startX;
      this.windowInitialY = e.screenY - this.startY;
      this.startX = e.screenX;
      this.startY = e.screenY;
      this.mouseDownTime = Date.now();
    },

    // 处理鼠标移动事件
    handleMouseMove(e) {
      if (!this.isDragging) return;
      const deltaX = e.screenX - this.startX;
      const deltaY = e.screenY - this.startY;

      const newX = this.windowInitialX + deltaX;
      const newY = this.windowInitialY + deltaY;

      window.electronAPI.moveWindow(Math.round(newX), Math.round(newY));
    },
    handleMouseUp() {
      this.isDragging = false;
      // 如果不是拖拽且点击时间小于200ms，则触发展开/收起
      if (Date.now() - this.mouseDownTime < 200) {
        this.toggleExpand();
      }
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    handleAction() {
      console.log("执行操作");
      this.toggleExpand();
    },
  },
  // 计算属性
  computed: {
    todoCount() {
      return this.todos.length;
    },
  },
});

// 挂载应用
app.mount("#floatApp");
