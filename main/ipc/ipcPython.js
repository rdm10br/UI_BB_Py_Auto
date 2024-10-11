import pythonProcessController from "../controllers/pythonProcess";

export const handlePythonEvents = (ipcMain, mainWindow) => {
  ipcMain.on("run-python-script", (event, scriptPath) => {
    pythonProcessController.startPythonProcess(event, scriptPath);
  });

  ipcMain.on("pause-python-script", () => {
    pythonProcessController.pausePythonProcess();
  });

  ipcMain.on("resume-python-script", () => {
    pythonProcessController.resumePythonProcess();
  });

  ipcMain.on("stop-python-script", () => {
    pythonProcessController.terminatePythonProcess();
  });
};