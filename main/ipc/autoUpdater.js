import { autoUpdater } from "electron-updater";
import { dialog } from "electron";

export function checkForUpdates(mainWindow) {
  autoUpdater.autoDownload = true; // Enables background download

  // Begin checking for updates
  autoUpdater.checkForUpdatesAndNotify();

  // Notify renderer when an update is available
  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update_available");
  });

  // Show dialog and prompt to restart when update is downloaded
  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Update Ready",
        message:
          "A new update has been downloaded. The application will restart to apply the update.",
        buttons: ["Restart Now"],
      })
      .then((result) => {
        if (result.response === 0) {
          // If "Restart Now" is clicked
          autoUpdater.quitAndInstall();
        }
      });
  });

  // Send download progress to renderer
  autoUpdater.on("download-progress", (progressObj) => {
    let percent = Math.floor(progressObj.percent);
    mainWindow.webContents.send("download_progress", percent);
  });

  // Optional: Error handling
  autoUpdater.on("error", (error) => {
    const maxLineLength = 50;
    
    const formatMessage = (message, maxLength) => {
      const words = message.split(" ");
      let line = "";
      const lines = [];

      words.forEach((word) => {
        if ((line + word).length > maxLength) {
          lines.push(line.trim());
          line = "";
        }
        line += `${word} `;
      });

      if (line) lines.push(line.trim());
      return lines.join("\n");
    };

    const formattedMessage = formatMessage(error.message, maxLineLength);

    dialog.showErrorBox(
      "Update Error",
      `An error occurred while updating:\n${formattedMessage}`
    );
    mainWindow.webContents.send("update_error", error);
  });
}