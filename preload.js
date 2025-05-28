// preload.js

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setAlwaysOnTop: (flag) => ipcRenderer.send("set-always-on-top", flag),
  windowDrag: (data) => ipcRenderer.send("window-drag", data),
  selectLogFolder: () => ipcRenderer.invoke("select-folder"),
  getLogFolder: () => ipcRenderer.invoke("get-log-folder"),
  saveLog: (logData) => ipcRenderer.invoke("save-log", logData),
  getFloatWindowState: () => ipcRenderer.invoke("getFloatWindowState"),
  toggleFloatWindow: (state) => ipcRenderer.invoke("toggleFloatWindow", state),
  onFloatWindowStateChange: (callback) =>
    ipcRenderer.on("floatWindow-state-changed", callback),
  getFloatWindowPos: () => ipcRenderer.invoke("getFloatWindowPos"),
  dragWindow: (width, height) => ipcRenderer.send("window-drag", width, height),
  moveWindow: (x, y, width, height) =>
    ipcRenderer.send("move-window", x, y, width, height),
  setStore: (key, value) => ipcRenderer.send("store-set", key, value),
  getStore: (key) => ipcRenderer.invoke("store-get", key),

  onDataUpdated: (callback) => {
    // 安全地包装回调函数
    const safeCallback = (_, ...args) => callback(...args);

    // 监听主进程发送的数据更新事件
    ipcRenderer.on("data-updated", safeCallback);

    // 提供清理函数
    return () => {
      ipcRenderer.off("data-updated", safeCallback);
    };
  },
});
