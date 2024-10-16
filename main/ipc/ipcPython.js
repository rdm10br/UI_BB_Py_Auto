import pythonProcessController from "../controllers/pythonProcess";

export const handlePythonEvents = (ipcMain, mainWindow) => {
  ipcMain.on("run-python", (event, scriptPath) => {
    pythonProcessController.startPythonProcess(event, scriptPath);
  });

  ipcMain.on("pause-python", () => {
    pythonProcessController.pausePythonProcess();
  });

  ipcMain.on("resume-python", () => {
    pythonProcessController.resumePythonProcess();
  });

  ipcMain.on("stop-python", () => {
    pythonProcessController.terminatePythonProcess();
  });
};