import { exec } from "child_process";
import path from "path";

export const handleExcelFile = (ipcMain) => {
  ipcMain.on("open-excel-file", (event, filePath) => {
    const fullPath = path.resolve(__dirname, filePath);
    exec(`start "" "${fullPath}"`, (error) => {
      if (error) {
        console.error(`Error opening file: ${error.message}`);
      }
    });
  });
};