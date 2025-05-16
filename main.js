// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");

let logFolderPath = app.getPath("documents") + "\\EverCat\\";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: true,
      nodeIntegration: true,
      contextIsolation: true,
      contentSecurityPolicy: {
        "default-src": "'self'",
        "style-src": "'self' 'unsafe-inline'", // 允许样式内联
        "script-src": "'self'",
      },
    },
  });

  // 开发环境加载 Vite 服务器
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile("dist/index.html");
  }

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
};

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (!result.canceled) {
    logFolderPath = result.filePaths[0];
  }
  return logFolderPath;
});

ipcMain.handle("get-log-folder", () => logFolderPath);

ipcMain.handle("save-log", (_, logData) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logPath = path.join(logFolderPath, `evercat-log-${timestamp}.json`);

  fs.writeFileSync(
    logPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        log: logData,
      },
      null,
      2
    )
  );
});

// 实现窗口拖动
app.on("window-drag", (event, { mouseX, mouseY }) => {
  const [currentX, currentY] = win.getPosition();
  win.setPosition(currentX + mouseX, currentY + mouseY);
});

app.on("set-always-on-top", (event, flag) => {
  BrowserWindow.getFocusedWindow().setAlwaysOnTop(flag);
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。

app.on("before-quit", () => {
  const logData = {
    lastOperation: "应用关闭",
    todoItems: JSON.parse(localStorage.getItem("todo") || "[]"),
    timerState: JSON.parse(localStorage.getItem("timerState") || "{}"),
  };

  // 发送日志到渲染进程
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.webContents.send("save-final-log", logData);
});
