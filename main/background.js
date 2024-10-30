import path from "path";
import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { initializeIpcHandlers } from './ipc';

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  // app.setActivationPolicy(policy='prohibited')
  await app.whenReady();
  const iconPath = "renderer/public/icon/1bad.png";

  // process.icon = iconPath

  const mainWindow = createWindow("main", {
    width: 900,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: false,
      additionalArguments: [
        "--disable-autofill",
        "--disable-features=Autofill",
      ],
    },
  });

  // autoUpdater.checkForUpdatesAndNotify();

  await mainWindow.setMenuBarVisibility(false);

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // mainWindow.webContents.openDevTools()
  }

  // tray = new Tray(iconPath);  // Set the system tray icon using the same icon
  // tray.setToolTip('My Electron App');

  initializeIpcHandlers(mainWindow);
})();

// Handle window close behavior
app.on("window-all-closed", () => {
  app.quit();
});