import { autoUpdater } from "electron-updater";

const initAutoUpdater = (mainWindow) => {
  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update-available");
  });

  autoUpdater.on("update-not-available", () => {
    mainWindow.webContents.send("update-not-available");
  });
};

export default { initAutoUpdater };