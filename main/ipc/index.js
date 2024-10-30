import { ipcMain } from "electron";
import { initializeRunPythonHandlers } from './runPython';
import { initializeFileAPIHandlers } from "./checkFile";
import { initializeGitHubAPIHandlers } from "./githubAPI";
import { initializeGeneralAPIHandlers } from "./generalAPI";
import { initializeEnvAPIHandlers } from "./envAPI";
import { initializeFileHandlers } from './fileHandler';

export function initializeIpcHandlers(mainWindow) {
  initializeRunPythonHandlers(ipcMain);
  initializeFileAPIHandlers(ipcMain);
  initializeGitHubAPIHandlers(ipcMain);
  initializeGeneralAPIHandlers(ipcMain, mainWindow);
  initializeEnvAPIHandlers(ipcMain);
  initializeFileHandlers(ipcMain);
}
