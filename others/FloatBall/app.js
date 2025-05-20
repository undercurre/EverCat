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
      mouseDownTime: Date.now(),
    };
  },
  // 方法选项
  methods: {
    // 处理鼠标按下事件
    handleMouseDown(e) {
      if (this.isExpanded) return; // 展开状态不允许拖动

      this.isDragging = false;
      this.startX = e.clientX; // 使用screenX/screenY获取相对于屏幕的坐标
      this.startY = e.clientY;
      this.mouseDownTime = Date.now();
    },

    // 处理鼠标移动事件
    handleMouseMove(e) {
      const deltaX = e.clientX - this.startX;
      const deltaY = e.clientY - this.startY;

      // 判断是否达到拖动阈值
      if (!this.isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
        this.isDragging = true;
      }

      if (isDragging) {
        // 计算新位置
        const newX = this.startX + deltaX;
        const newY = this.startY + deltaY;

        // 发送新位置到主进程
        window.electronAPI.moveWindow(newX, newY);
      }
    },
    handleMouseUp() {
      // 如果不是拖拽且点击时间小于200ms，则触发展开/收起
      if (!this.isDragging && Date.now() - this.mouseDownTime < 200) {
        toggleExpand();
      }
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
