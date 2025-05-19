// 创建 Vue 应用
const { createApp } = Vue;

const app = createApp({
  // 数据选项
  data() {
    return {
      message: "Hello Vue 3!",
      todos: [
        { id: 1, text: "学习 Vue" },
        { id: 2, text: "练习项目" },
      ],
    };
  },
  // 方法选项
  methods: {
    reverseMessage() {
      this.message = this.message.split("").reverse().join("");
    },

    // 处理鼠标按下事件
    handleMouseDown(e) {
      if (isExpanded.value) return; // 展开状态不允许拖动

      isDragging = false;
      initialMouseX = e.screenX; // 使用screenX/screenY获取相对于屏幕的坐标
      initialMouseY = e.screenY;
      mouseDownTime = Date.now();
      // 获取窗口初始位置
      ipcRenderService.invoke("app:window:get-position").then(([x, y]) => {
        windowInitialX = x;
        windowInitialY = y;

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      });
    },

    // 处理鼠标移动事件
    handleMouseMove(e) {
      const deltaX = e.screenX - initialMouseX;
      const deltaY = e.screenY - initialMouseY;

      // 判断是否达到拖动阈值
      if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
        isDragging = true;
      }

      if (isDragging) {
        // 计算新位置
        const newX = windowInitialX + deltaX;
        const newY = windowInitialY + deltaY;

        // 发送新位置到主进程
        ipcRenderService.send("app:window:set-position", { x: newX, y: newY });
      }
    },
    handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // 如果不是拖拽且点击时间小于200ms，则触发展开/收起
      if (!isDragging && Date.now() - mouseDownTime < 200) {
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

// 注册全局组件
app.component("todo-item", {
  props: ["todo"],
  template: `<li>{{ todo.text }}</li>`,
});

// 挂载应用
app.mount("#app");
