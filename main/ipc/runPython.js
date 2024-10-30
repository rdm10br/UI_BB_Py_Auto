import { ipcMain } from 'electron';
import { spawn } from 'child_process';
import path from 'path';

let pythonProcess = null;

export function handleRunPython(event, scriptName) {
  const isProd = process.env.NODE_ENV === "production";
  let workingDirectory;

  if (isProd) {
    const parentDir = path.dirname(path.dirname(path.dirname(__dirname)));
    workingDirectory = path.resolve(parentDir, "scripts/BB_Py_Automation");
  } else {
    workingDirectory = path.resolve(__dirname, "../scripts/BB_Py_Automation");
  }

  const pythonPath = path.resolve(workingDirectory, "venv/Scripts/python.exe");
  const scriptPath = path.resolve(workingDirectory, scriptName);

  pythonProcess = spawn(pythonPath, [scriptPath], {
    cwd: workingDirectory,
    windowsHide: true,
  });

  pythonProcess.on("spawn", () => {
    console.log(`Starting Python process with PID ${pythonProcess.pid}`);
    event.reply("python-start", `Starting Python process ${scriptName}`);
  });

  pythonProcess.stdout.on("data", (data) => {
    event.sender.send("python-output", data.toString("utf8"));
  });

  pythonProcess.stderr.on("data", (data) => {
    event.sender.send("python-error", data.toString());
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
    event.sender.send("python-close", `Python script exited with code ${code}`);
    pythonProcess = null;
  });
}

export function handleStopPython() {
  if (pythonProcess) {
    console.log(`Attempting to kill Python process with PID: ${pythonProcess.pid}`);
    try {
      process.kill(pythonProcess.pid, "SIGKILL");
      console.log(`Python process with PID ${pythonProcess.pid} killed.`);
      pythonProcess = null;
    } catch (err) {
      console.error(`Failed to kill process: ${err.message}`);
    }
  } else {
    console.log("No Python process is running");
  }
}

export function initializeRunPythonHandlers() {
  ipcMain.on("run-python", handleRunPython);
  ipcMain.on("stop-python", handleStopPython);
}