import { ipcMain } from 'electron';
import path from 'path';
import { exec } from 'child_process';

export function handleOpenExcelFile(event, filePath) {
  const isProd = process.env.NODE_ENV === "production";
  let fullPath;

  if (isProd) {
    const parentDir = path.dirname(path.dirname(path.dirname(__dirname)));
    fullPath = path.resolve(parentDir, filePath);
  } else {
    fullPath = path.resolve(__dirname, `../${filePath}`);
  }

  exec(`start "" "${fullPath}"`, (error) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
      event.reply("file-open-error", `Error opening file: ${error.message}`);
    } else {
      event.reply("file-opened", `Successfully opened file: ${fullPath}`);
    }
  });
}

// Initialize the IPC handlers for file operations
export function initializeFileHandlers() {
  ipcMain.on("open-excel-file", handleOpenExcelFile);
}