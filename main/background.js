import path from "path";
import { app, ipcMain, dialog } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { initializeIpcHandlers } from "./ipc";
import { checkForUpdates } from "./ipc/autoUpdater.js.bak";
// import { autoUpdater } from "electron-updater";

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
    width: 1100,
    height: 700,
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

  // function checkForUpdates() {
  //   autoUpdater.autoDownload = true; // Enables background download

  //   // console.log('Verifying if there is an update...')
  //   // dialog.showMessageBox({
  //   //   type: "info",
  //   //   title: "Update Check",
  //   //   message: 'Verifying if there is an update...',
  //   //   buttons: ["OK"],
  //   // });

  //   autoUpdater.checkForUpdatesAndNotify();

  //   autoUpdater.on("update-available", () => {
  //     // console.log('update_available')
  //     // dialog.showMessageBox({
  //     //   type: "info",
  //     //   title: "Update Check",
  //     //   message: 'update_available',
  //     //   buttons: ["OK"],
  //     // });
  //     mainWindow.webContents.send("update_available");
  //   });

  //   // autoUpdater.on('update-downloaded', () => {
  //   //   console.log('update_downloaded')
  //   //   dialog.showMessageBox({
  //   //     type: "info",
  //   //     title: "Update Check",
  //   //     message: 'update_downloaded',
  //   //     buttons: ["OK"],
  //   //   });
  //   //   mainWindow.webContents.send('update_downloaded');
  //   // });

  //   autoUpdater.on("update-downloaded", () => {
  //     dialog
  //       .showMessageBox({
  //         type: "info",
  //         title: "Update Ready",
  //         message:
  //           "A new update has been downloaded. The application will restart to apply the update.",
  //         buttons: ["Restart Now"],
  //       })
  //       .then((result) => {
  //         if (result.response === 0) {
  //           autoUpdater.quitAndInstall();
  //         }
  //       });
  //   });

  //   // Listen for download progress and send updates to renderer
  //   autoUpdater.on("download-progress", (progressObj) => {
  //     // console.log(`Download speed: ${progressObj.bytesPerSecond}`);
  //     // console.log(`Downloaded ${progressObj.percent}%`);
  //     // console.log(
  //     //   `Downloaded ${progressObj.transferred} of ${progressObj.total} bytes`
  //     // );
  //     mainWindow.webContents.send("download_progress", progressObj);
  //   });
  // }

  mainWindow.setMenuBarVisibility(false);

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // mainWindow.webContents.openDevTools()
  }

  // tray = new Tray(iconPath);  // Set the system tray icon using the same icon
  // tray.setToolTip('My Electron App');
  setInterval(() => checkForUpdates(mainWindow), 3600000); // 3,600,000 ms = 1 hour
  checkForUpdates(mainWindow);
  initializeIpcHandlers(mainWindow);
})();

// Handle window close behavior
app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});