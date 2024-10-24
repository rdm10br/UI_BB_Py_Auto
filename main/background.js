import path from "path";
import fs from "fs";
import { app, ipcMain, Tray, dialog } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { spawn, exec } from "child_process";
import axios from "axios";
import { autoUpdater } from "electron-updater";
import { Store } from "electron-store";
// import ExcelJS from 'exceljs'

const isProd = process.env.NODE_ENV === "production";
const isWindows = process.platform === "win32";

let pythonProcess = null;

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  // app.setActivationPolicy(policy='prohibited')
  await app.whenReady();

  const iconPath = "renderer/public/icon/1bad.png";

  // process.icon = iconPath

  const mainWindow = createWindow("main", {
    width: 900,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: false,
      additionalArguments: [
        "--disable-autofill",
        "--disable-features=Autofill",
      ],
    },
  });

  // autoUpdater.checkForUpdatesAndNotify();

  await mainWindow.setMenuBarVisibility(false);

  if (isProd) {
    await mainWindow.loadURL("app://./home");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // mainWindow.webContents.openDevTools()
  }

  // tray = new Tray(iconPath);  // Set the system tray icon using the same icon
  // tray.setToolTip('My Electron App');

})();

// app.on("window-all-closed", () => {
//   if (pythonProcess) {
//     console.log(`Killing Python process with PID: ${pythonProcess.pid}`);
//     process.kill(pythonProcess.pid, "SIGKILL");
//   }
//   app.quit();
// });

app.on("window-all-closed", () => {
  if (isWindows) {
    if (pythonProcess) {
      console.log(`Killing Python process with PID: ${pythonProcess.pid}`);
      process.kill(pythonProcess.pid, "SIGKILL");
    }
    app.quit(); // Quit the app on Windows when all windows are closed
  } else {
    // On macOS, it's common to leave the application open even when no windows are open
    // app.hide(); // Hide the app instead of quitting
    app.quit();
  }
});

ipcMain.on("set-title", (event, title) => {
  // console.log(`BBAutoPy - ${title}`);
  mainWindow.webContents.executeJavaScript(
    `document.title = "BlackBot - ${title}"`
  );
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
  // console.log(`${arg} World!`)
});

ipcMain.on("open-excel-file", (event, filePath) => {
  let fullPath;

  if (isProd){
    const parentDir = path.dirname(path.dirname(path.dirname(__dirname)))
    fullPath = path.resolve(parentDir, filePath);
  }else{
    fullPath = path.resolve(__dirname, `../${filePath}`);
  }

  exec(`start "" "${fullPath}"`, (error) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
    }
  });
});

ipcMain.on("run-python", (event, arg) => {
  let workingDirectory, pythonPath, scriptPath;

  if (isProd){
    const parentDir = path.dirname(path.dirname(path.dirname(__dirname)))
    workingDirectory = path.resolve(parentDir, "scripts/BB_Py_Automation");
    // console.log(workingDirectory)
  }else{
    workingDirectory = path.resolve(__dirname, "../scripts/BB_Py_Automation");
    // console.log(workingDirectory)
  }
  
  pythonPath = path.resolve(workingDirectory, "venv/Scripts/python.exe");
  // console.log(pythonPath)
  scriptPath = path.resolve(workingDirectory, arg);
  // console.log(scriptPath)

  pythonProcess = spawn(pythonPath, [scriptPath], {
    cwd: workingDirectory,
    windowsHide: true, // This will hide the Python prompt
  });

  pythonProcess.stdout.setEncoding("utf8");
  pythonProcess.stderr.setEncoding("utf8");

  pythonProcess.on("spawn", () => {
    console.log(`Starting Python process with PID ${pythonProcess.pid}`);
    event.reply("python-start", `Starting Python process ${arg}`);
  });
  // Capture stdout
  pythonProcess.stdout.on("data", (data) => {
    // Send stdout to the renderer process via IPC
    // console.log(`${data.toString()}`);
    event.sender.send("python-output", data.toString("utf8"));
    // event.sender.send('python-output', `${data.toString()}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    // console.log(`${data.toString()}`);
    // event.reply('python-error', data.toString());
    // event.sender.send('python-error', `${data.toString()}`);
    event.sender.send("python-error", data.toString());
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
    // event.reply('python-close', `Python script exited with code ${code}`);
    event.sender.send("python-close", `Python script exited with code ${code}`);
    pythonProcess = null;
  });
});

ipcMain.on("stop-python", () => {
  if (pythonProcess) {
    console.log(
      `Attempting to kill Python process with PID: ${pythonProcess.pid}`
    );

    try {
      // Kill the process (SIGKILL is safe for both Unix and Windows)
      process.kill(pythonProcess.pid, "SIGKILL");
      console.log(`Python process with PID ${pythonProcess.pid} killed.`);
      pythonProcess = null;
    } catch (err) {
      console.error(`Failed to kill process: ${err.message}`);
    }
  } else {
    console.log("No Python process is running");
  }
});
// Pausing the Python process
ipcMain.on("pause-python", () => {
  if (pythonProcess) {
    console.log(
      `Attempting to pause Python process with PID: ${pythonProcess.pid}`
    );

    if (isWindows) {
      // Windows workaround: create the pause.flag file
      if (!fs.existsSync(pauseFlagPath)) {
        fs.writeFileSync(pauseFlagPath, ""); // Create the flag file
        console.log("Python process paused (pause.flag created).");
      }
    } else {
      // Unix-based systems: send SIGSTOP to pause the process
      try {
        process.kill(pythonProcess.pid, "SIGSTOP");
        console.log(`Python process with PID ${pythonProcess.pid} paused.`);
      } catch (err) {
        console.error(`Failed to pause process: ${err.message}`);
      }
    }
  } else {
    console.log("No Python process is running to pause.");
  }
});

// Resuming the Python process
ipcMain.on("resume-python", () => {
  if (pythonProcess) {
    console.log(
      `Attempting to resume Python process with PID: ${pythonProcess.pid}`
    );

    if (isWindows) {
      // Windows workaround: remove the pause.flag file
      if (fs.existsSync(pauseFlagPath)) {
        fs.unlinkSync(pauseFlagPath); // Remove the flag file
        console.log("Python process resumed (pause.flag removed).");
      }
    } else {
      // Unix-based systems: send SIGCONT to resume the process
      try {
        process.kill(pythonProcess.pid, "SIGCONT");
        console.log(`Python process with PID ${pythonProcess.pid} resumed.`);
      } catch (err) {
        console.error(`Failed to resume process: ${err.message}`);
      }
    }
  } else {
    console.log("No Python process is running to resume.");
  }
});

// Handle saving language preference
ipcMain.on("save-language-preference", (event, language) => {
  const store = new Store();
  store.set("languagePreference", language);
  event.returnValue = "Language preference saved";
});

// Handle retrieving language preference
ipcMain.on("get-language-preference", (event) => {
  const store = new Store();
  const languagePreference = store.get("languagePreference");
  event.returnValue = languagePreference || null;
});

ipcMain.handle("get-github-repo", async (event, GITHUB_REPO) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`
    );
    return response.data; // Return the response data to the renderer process
  } catch (error) {
    console.error("Error fetching latest release:", error);
    return { error: "Error fetching latest release" }; // Return the error to the renderer
  }
});

ipcMain.handle("show-update-popup", async (event, isUpdateAvailable) => {
  const message = isUpdateAvailable
    ? "A new update is available! Would you like to update now?"
    : "You are using the latest version.";

  const buttons = isUpdateAvailable ? ["Update Now", "Later"] : ["OK"];

  // Display the message box as a popup
  const response = await dialog.showMessageBox({
    type: "info",
    title: "Update Check",
    message: message,
    buttons: buttons,
  });

  // If the user clicks "Update Now", return a positive response
  return response.response === 0 && isUpdateAvailable;
});

ipcMain.handle("check-files-exist", async (event, filePaths) => {
  return filePaths.map((filePath) => ({
    path: filePath,
    exists: fs.existsSync(path.join(process.cwd(), filePath)),
  }));
});

ipcMain.handle("get-env-variables", async (event, envFilePath) => {
  return new Promise((resolve, reject) => {
    const readEnvFile = (filePath) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          return reject(`Error reading .env file from ${filePath}`);
        }

        const envVariables = {};
        data.split("\n").forEach((line) => {
          // Skip empty lines and comments
          if (line && !line.startsWith("#")) {
            const [key, value] = line.split("=").map((part) => part.trim());
            if (key && value) {
              envVariables[key] = value;
            }
          }
        });

        if (Object.keys(envVariables).length === 0) {
          // If no env variables are found, try another path
          const alternativePath = path.resolve('../', envFilePath);
          console.warn("No env variables found, trying alternative path:", alternativePath);
          
          // Try reading the alternative file and resolve it if successful
          readEnvFile(alternativePath); // Recursion continues for alternative path
        } else {
          resolve(envVariables); // Resolve once env variables are found
        }
      });
    };

    // Start by reading the initial file path
    readEnvFile(envFilePath);
  });
});

ipcMain.handle("create-env-file", async (event, envData) => {
  const envFilePath = path.join(__dirname, "../scripts/BB_Py_Automation/.env");

  const envContent = Object.entries(envData)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  try {
    fs.writeFileSync(envFilePath, envContent, "utf8");
    return { success: true };
  } catch (error) {
    console.error("Error creating .env file:", error);
    throw new Error("Failed to create .env file");
  }
});

ipcMain.handle("delete-env-file", async () => {
  const envFilePath = path.join(__dirname, "../scripts/BB_Py_Automation/.env");
  try {
    fs.unlinkSync(envFilePath);
    console.log(".env file deleted");
  } catch (error) {
    console.error("Error deleting env file:", error);
    throw error;
  }
});

autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update-available");
});

autoUpdater.on("update-not-available", () => {
  mainWindow.webContents.send("update-not-available");
});

ipcMain.on("check-for-updates", () => {
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.handle('read-directory', async (event, dirPath) => {
  try {
    const files = fs.readdirSync(dirPath);
    return files;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});

ipcMain.handle('read-log-file', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error reading log file:', error);
    return '';
  }
});