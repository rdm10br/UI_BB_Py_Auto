export const handleUpdateEvents = (ipcMain, autoUpdater) => {
    ipcMain.on("check-for-updates", () => {
      autoUpdater.checkForUpdates();
    });
  
    ipcMain.on("quit-and-install", () => {
      autoUpdater.quitAndInstall();
    });
  };