import path from 'path'
import { app, ipcMain, Tray } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { spawn, exec } from 'child_process'
// import ExcelJS from 'exceljs'
const Store = require('electron-store');

const isProd = process.env.NODE_ENV === 'production'
const isWindows = process.platform === 'win32';
let pythonProcess = null;

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  // app.setActivationPolicy(policy='prohibited')
  await app.whenReady()
  
  const iconPath = 'renderer/public/icon/1bad.png'

  process.icon = iconPath

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  await mainWindow.setMenuBarVisibility(false)
  
  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    // await mainWindow.loadURL('https://sereduc.blackboard.com/ultra/admin')
    // mainWindow.webContents.openDevTools()
  }

  // tray = new Tray(iconPath);  // Set the system tray icon using the same icon
  // tray.setToolTip('My Electron App');
  
  ipcMain.on('set-title', (event, title) => {
    // console.log(`BBAutoPy - ${title}`);
    mainWindow.webContents.executeJavaScript(`document.title = "BlacBot - ${title}"`);
  });

})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
  // console.log(`${arg} World!`)
})

ipcMain.on('open-excel-file', (event, filePath) => {
  const fullPath = path.resolve(__dirname, filePath);
  exec(`start "" "${fullPath}"`, (error) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
    }
  });
});

ipcMain.on('run-python', (event, arg) => {
  const workingDirectory = path.resolve(__dirname, '../../BB_Py_Automation');
  const pythonPath = path.resolve(__dirname, '../../BB_Py_Automation/venv/Scripts/python.exe');
  const scriptPath = path.resolve(__dirname, `../../BB_Py_Automation/src/${arg}`);

  pythonProcess = spawn(pythonPath, [scriptPath], {
    cwd: workingDirectory,
    windowsHide: true, // This will hide the Python prompt
  });
  pythonProcess.on('spawn', () => {
    console.log(`Starting Python process with PID ${pythonProcess.pid}`);
    event.reply('python-start', `Starting Python process ${arg}`)
  });

  
  pythonProcess.stdout.on('data', (data) => {
    console.log(`${data}`);
    event.reply('python-result', data);
    // event.sender.send('python-result', data.toString());
  });

  pythonProcess.stderr.on('data', (data) => {
    event.reply('python-error', data.toString()); // Send stderr to the renderer process
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    event.reply('python-close', `Python script exited with code ${code}`);
    pythonProcess = null;
  });
});


ipcMain.on('stop-python', () => {
  if (pythonProcess) {
    console.log(`Attempting to kill Python process with PID: ${pythonProcess.pid}`);

    try {
      // Kill the process (SIGKILL is safe for both Unix and Windows)
      process.kill(pythonProcess.pid, 'SIGKILL');
      console.log(`Python process with PID ${pythonProcess.pid} killed.`);
      pythonProcess = null;
    } catch (err) {
      console.error(`Failed to kill process: ${err.message}`);
    }
  } else {
    console.log('No Python process is running');
  }
});
// Pausing the Python process
ipcMain.on('pause-python', () => {
  if (pythonProcess) {
    console.log(`Attempting to pause Python process with PID: ${pythonProcess.pid}`);

    if (isWindows) {
      // Windows workaround: create the pause.flag file
      if (!fs.existsSync(pauseFlagPath)) {
        fs.writeFileSync(pauseFlagPath, ''); // Create the flag file
        console.log('Python process paused (pause.flag created).');
      }
    } else {
      // Unix-based systems: send SIGSTOP to pause the process
      try {
        process.kill(pythonProcess.pid, 'SIGSTOP');
        console.log(`Python process with PID ${pythonProcess.pid} paused.`);
      } catch (err) {
        console.error(`Failed to pause process: ${err.message}`);
      }
    }
  } else {
    console.log('No Python process is running to pause.');
  }
});

// Resuming the Python process
ipcMain.on('resume-python', () => {
  if (pythonProcess) {
    console.log(`Attempting to resume Python process with PID: ${pythonProcess.pid}`);

    if (isWindows) {
      // Windows workaround: remove the pause.flag file
      if (fs.existsSync(pauseFlagPath)) {
        fs.unlinkSync(pauseFlagPath); // Remove the flag file
        console.log('Python process resumed (pause.flag removed).');
      }
    } else {
      // Unix-based systems: send SIGCONT to resume the process
      try {
        process.kill(pythonProcess.pid, 'SIGCONT');
        console.log(`Python process with PID ${pythonProcess.pid} resumed.`);
      } catch (err) {
        console.error(`Failed to resume process: ${err.message}`);
      }
    }
  } else {
    console.log('No Python process is running to resume.');
  }
});

// Handle saving language preference
ipcMain.on('save-language-preference', (event, language) => {
  const store = new Store();
  store.set('languagePreference', language);
  event.returnValue = 'Language preference saved';
});

// Handle retrieving language preference
ipcMain.on('get-language-preference', (event) => {
  const store = new Store();
  const languagePreference = store.get('languagePreference');
  event.returnValue = languagePreference || null;
});