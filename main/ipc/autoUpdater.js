const { autoUpdater } = require('electron-updater');
const { dialog, ipcMain } = require('electron');

function checkForUpdates(mainWindow) {
    autoUpdater.autoDownload = true;

    autoUpdater.checkForUpdatesAndNotify();

    // Notify renderer process when an update is available
    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update_available');
    });

    // Show dialog when update is downloaded and prompt for restart
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: "info",
            title: "Update Ready",
            message: "A new update has been downloaded. The application will restart to apply the update.",
            buttons: ["Restart Now"],
        }).then((result) => {
            if (result.response === 0) { // If "Restart Now" is clicked
                autoUpdater.quitAndInstall();
            }
        });
    });

    // Track download progress and send updates to renderer
    autoUpdater.on('download-progress', (progressObj) => {
        mainWindow.webContents.send('download_progress', progressObj);
    });
}

// Expose checkForUpdates function so it can be called from elsewhere
module.exports = { checkForUpdates };