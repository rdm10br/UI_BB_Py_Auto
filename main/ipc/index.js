import { ipcMain } from "electron";
import handleExcelFile from "./ipcExcel";
import handleEnvFile from "./ipcEnv";
import handlePythonEvents from "./ipcPython";
import handleUpdateEvents from "./ipcUpdate";

export const setupIPC = (mainWindow, autoUpdater) => {
  handleExcelFile(ipcMain);
  handleEnvFile(ipcMain);
  handlePythonEvents(ipcMain, mainWindow);
  handleUpdateEvents(ipcMain, autoUpdater);
};
