import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { initializeIpcHandlers } from './ipc';
import { autoUpdater } from 'electron-updater';

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

  function checkForUpdates() {
    autoUpdater.autoDownload = true; // Enables background download
    console.log('Verifying if there is an update...')
    autoUpdater.checkForUpdatesAndNotify();
  
    autoUpdater.on('update-available', () => {
      console.log('update_available')
      mainWindow.webContents.send('update_available');
    });
  
    autoUpdater.on('update-downloaded', () => {
      console.log('update_downloaded')
      mainWindow.webContents.send('update_downloaded');
    });
  }

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
  setInterval(checkForUpdates, 3600000); // 3,600,000 ms = 1 hour
  checkForUpdates()
  initializeIpcHandlers(mainWindow);
})();

// Handle window close behavior
app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});