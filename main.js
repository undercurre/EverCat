// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, Tray, Menu } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const documentsPath = app.getPath("documents");
let logFolderPath = path.join(documentsPath, "EverCat"); // 使用path.join代替字符串拼接

let tray = null;
let mainWindow = null;
let floatWindow = null;

function createTray(win) {
  const iconPath = path.join(__dirname, "src/assets/tray-ico.ico");
  if (!fs.existsSync(iconPath)) {
    console.error("托盘图标文件不存在:", iconPath);
    return;
  }
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        win.show();
        win.focus();
      },
    },
    {
      label: "退出",
      click: () => app.quit(),
    },
  ]);

  tray.setToolTip("EverCat");
  tray.setContextMenu(contextMenu);

  // 点击托盘图标切换窗口显示
  tray.on("click", () => {
    win.isVisible() ? win.hide() : win.show();
  });
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: path.join(__dirname, "src/assets/icon.ico"),
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
  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide(); // 隐藏窗口而不是关闭
  });

  createTray(mainWindow);
};

function createFloatWindow() {
  floatWindow = new BrowserWindow({
    width: 200,
    height: 150,
    transparent: true, // 透明背景
    frame: false, // 无边框
    alwaysOnTop: true, // 置顶
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  floatWindow.loadFile("float.html");
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  if (!fs.existsSync(logFolderPath)) {
    fs.mkdirSync(logFolderPath, { recursive: true }); // recursive确保完整创建嵌套目录
  }

  createWindow();
  createFloatWindow();

  app.on("activate", () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      createFloatWindow();
    }
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
  const datePart = new Date().toLocaleDateString("sv"); // 输出示例："2024-05-01"
  const logPath = path.join(logFolderPath, `evercat-log-${datePart}.json`);

  try {
    // 读取已有日志或初始化空数组
    let logs = [];
    if (fs.existsSync(logPath)) {
      const fileContent = fs.readFileSync(logPath, "utf-8");
      logs = JSON.parse(fileContent);
      if (!Array.isArray(logs)) {
        logs = []; // 处理文件内容损坏的情况
      }
    }

    // 添加新日志记录
    logs.push({
      timestamp: new Date().toISOString(),
      log: logData,
    });

    // 写入更新后的日志
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error("日志保存失败:", e);
  }
});

// 实现窗口拖动
app.on("window-drag", (event, { mouseX, mouseY }) => {
  const [currentX, currentY] = win.getPosition();
  win.setPosition(currentX + mouseX, currentY + mouseY);
});

// 处理窗口移动
ipcMain.on("move-window", (event, x, y) => {
  floatWindow.setPosition(x, y);
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

app.on("before-quit", async () => {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  // 通过IPC请求渲染进程发送数据
  const [todoItems, timerState] = await Promise.all([
    mainWindow.webContents.executeJavaScript(
      'localStorage.getItem("todo") || "[]"'
    ),
    mainWindow.webContents.executeJavaScript(
      'localStorage.getItem("timerState") || "{}"'
    ),
  ]);

  const logData = {
    lastOperation: "应用关闭",
    todoItems: JSON.parse(todoItems),
    timerState: JSON.parse(timerState),
  };

  mainWindow.webContents.send("save-final-log", logData);
});
