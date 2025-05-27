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
    async handleMouseDown(e) {
      console.log("鼠标按下");
      if (this.isExpanded) return; // 展开状态不允许拖动
      this.isDragging = true;
      this.mouseDownTime = Date.now();
      // this.startX = e.clientX;
      // this.startY = e.clientY;
    },

    async handleMouseOver(e) {
      console.log("鼠标悬浮");
      if (this.isExpanded || !this.isDragging) return; // 展开状态不允许拖动
      // this.startX = e.clientX;
      // this.startY = e.clientY;
    },

    // 处理鼠标移动事件
    handleMouseMove(e) {
      console.log("鼠标移动", this.isDragging);
      if (!this.isDragging) return;
      // const deltaX = e.clientX - this.startX;
      // const deltaY = e.clientY - this.startY;

      // const newX = window.screenLeft + deltaX;
      // const newY = window.screenTop + deltaY;

      // window.electronAPI.moveWindow(newX, newY, 170, 170);
      window.electronAPI.dragWindow(170, 170);
    },
    handleMouseUp() {
      console.log("鼠标松开");
      this.isDragging = false;
      // 如果不是拖拽且点击时间小于200ms，则触发展开/收起
      if (Date.now() - this.mouseDownTime < 200) {
        this.toggleExpand();
      }
    },

    handleMouseLeave() {
      console.log("鼠标离开");
      // this.isDragging = false;
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
  async mounted() {
    const pos = await window.electronAPI.getFloatWindowPos();
    this.windowInitialX = pos[0];
    this.windowInitialY = pos[1];
  },
});

// 挂载应用
app.mount("#floatApp");
