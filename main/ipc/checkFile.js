import fs from "fs";
import path from "path";
import { app } from "electron";
import App from "next/app";

const isProd = process.env.NODE_ENV === "production";

export function initializeFileAPIHandlers(ipcMain) {
  ipcMain.handle("check-files-exist", async (event, filePaths) => {
    return filePaths.map((filePath) => ({
      path: filePath,
      exists: fs.existsSync(path.join(process.cwd(), filePath)),
    }));
  });

  ipcMain.handle("read-directory", async (event, dirPath) => {
    try {
      const files = fs.readdirSync(dirPath);
      return files;
    } catch (error) {
      console.error("Error reading directory:", error);
      return [];
    }
  });

  ipcMain.handle("read-log-file", async (event, filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      return content;
    } catch (error) {
      console.error("Error reading log file:", error);
      return "";
    }
  });

  ipcMain.handle("get-json-data", async (event, filePath) => {
    return new Promise((resolve, reject) => {
      if (isProd && filePath == "package.json") {
        resolve(app.getVersion());
      } else {
        fs.readFile(filePath, "utf-8", (err, data) => {
          if (err) {
            reject(`Error reading file: ${err.message}`);
          } else {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (jsonError) {
              reject(`Error parsing JSON: ${jsonError.message}`);
            }
          }
        });
      }
    });
  });
}
