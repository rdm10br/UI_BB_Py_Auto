import path from "path";
import { spawn } from "child_process";
import fs from "fs";

let pythonProcess = null;
const isWindows = process.platform === "win32";
const pauseFlagPath = path.join(__dirname, "../../BB_Py_Automation/pause.flag");

const initPythonProcess = (mainWindow) => {
  mainWindow.on("close", () => {
    if (pythonProcess) {
      terminatePythonProcess();
    }
  });
};

const startPythonProcess = (event, scriptPath) => {
  const workingDirectory = path.resolve(__dirname, "../../BB_Py_Automation");
  const pythonPath = path.resolve(__dirname, "../../BB_Py_Automation/venv/Scripts/python.exe");
  const fullScriptPath = path.resolve(__dirname, `../../BB_Py_Automation/${scriptPath}`);

  pythonProcess = spawn(pythonPath, [fullScriptPath], {
    cwd: workingDirectory,
    windowsHide: true,
  });

  pythonProcess.stdout.setEncoding("utf8");
  pythonProcess.stderr.setEncoding("utf8");

  pythonProcess.stdout.on("data", (data) => {
    event.sender.send("python-output", data.toString());
  });

  pythonProcess.stderr.on("data", (data) => {
    event.sender.send("python-error", data.toString());
  });

  pythonProcess.on("close", (code) => {
    event.sender.send("python-close", `Python script exited with code ${code}`);
    pythonProcess = null;
  });
};

const pausePythonProcess = () => {
  if (pythonProcess) {
    if (isWindows && !fs.existsSync(pauseFlagPath)) {
      fs.writeFileSync(pauseFlagPath, "");
    } else {
      process.kill(pythonProcess.pid, "SIGSTOP");
    }
  }
};

const resumePythonProcess = () => {
  if (pythonProcess) {
    if (isWindows && fs.existsSync(pauseFlagPath)) {
      fs.unlinkSync(pauseFlagPath);
    } else {
      process.kill(pythonProcess.pid, "SIGCONT");
    }
  }
};

const terminatePythonProcess = () => {
  if (pythonProcess) {
    process.kill(pythonProcess.pid, "SIGKILL");
    pythonProcess = null;
  }
};

export default {
  initPythonProcess,
  startPythonProcess,
  pausePythonProcess,
  resumePythonProcess,
  terminatePythonProcess,
};