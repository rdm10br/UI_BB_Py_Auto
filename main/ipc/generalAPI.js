import { dialog } from "electron";
import Store from "electron-store";

export function initializeGeneralAPIHandlers(ipcMain) {
  ipcMain.on("set-title", (event, title) => {
    mainWindow.webContents.executeJavaScript(`document.title = "BlackBot - ${title}"`);
  });

  ipcMain.on("message", async (event, arg) => {
    event.reply("message", `${arg} World!`);
  });

  ipcMain.handle("show-update-popup", async (event, isUpdateAvailable) => {
    const message = isUpdateAvailable
      ? "A new update is available! Would you like to update now?"
      : "You are using the latest version.";

    const buttons = isUpdateAvailable ? ["Update Now", "Later"] : ["OK"];

    // Display the message box as a popup
    const response = await dialog.showMessageBox({
      type: "info",
      title: "Update Check",
      message: message,
      buttons: buttons,
    });

    // If the user clicks "Update Now", return a positive response
    return response.response === 0 && isUpdateAvailable;
  });

  // Add other general handlers as needed
}