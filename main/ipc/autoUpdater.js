import { autoUpdater } from "electron-updater";
import { dialog } from "electron";
import log from "electron-log";

export function checkForUpdates(mainWindow) {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";

  autoUpdater.fullChangelog = false; // Enable blockmap
  autoUpdater.autoDownload = true; // Enables background download

  // Begin checking for updates
  autoUpdater.checkForUpdatesAndNotify();

  // Notify renderer when an update is available
  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update_available");
    mainWindow.webContents.send("navigate", "/update-download");
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
    console.log('[Main] Download progress:', percent);
    mainWindow.webContents.send("download_progress", {percent});
  });

  // Optional: Error handling
  autoUpdater.on("error", (error) => {
    const maxLineLength = 30;

    const formatMessage = (message, maxLength) => {
      const words = message.split("/");
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