export const handleWindowEvents = (ipcMain, mainWindow) => {
    ipcMain.on("minimize-window", () => {
      mainWindow.minimize();
    });
  
    ipcMain.on("maximize-window", () => {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    });
  
    ipcMain.on("close-window", () => {
      mainWindow.close();
    });
  };