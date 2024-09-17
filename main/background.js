import path from 'path'
import { app, ipcMain, Tray } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
// import ExcelJS from 'exceljs'
import { spawn, exec } from 'child_process'
const Store = require('electron-store');

const isProd = process.env.NODE_ENV === 'production'

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


// ipcMain.handle('read-excel-file', async () => {
//   const filePath = path.join(__dirname, 'path', 'to', 'your', 'file.xlsx'); // Replace with the fixed path to your Excel file

//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(filePath);

//   const sheet = workbook.worksheets[0];
//   const data = [];
//   sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
//     data.push({ rowNumber, values: row.values });
//   });

//   return data;
// });

ipcMain.on('open-excel-file', (event, filePath) => {
  const fullPath = path.resolve(__dirname, filePath);
  exec(`start "" "${fullPath}"`, (error) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
    }
  });
});

// ipcMain.on('run-python', (event, arg) => {
//   const workingDirectory = path.resolve(__dirname, '../../BB_Py_Automation');
//   const pythonPath = path.resolve(__dirname, '../../BB_Py_Automation/venv/Scripts/python.exe');
//   const scriptPath = path.resolve(__dirname, `../../BB_Py_Automation/src/${arg}`);
//   // exec(`python '${arg}'`, (error, stdout, stderr) => {
//     // console.log(`${path.resolve(__dirname, "../../venv/Scripts/python.exe")} ${path.resolve(__dirname, arg)}`)
//   // exec(`start ${pythonPath} ${scriptPath}`, { cwd: workingDirectory }, (error, stdout, stderr) => {
//   // exec(`start ${pythonPath} ${scriptPath}`, (error, stdout, stderr) => {
//   exec(`cd ${workingDirectory} && start ${pythonPath} ${scriptPath}`, (error, stdout, stderr) => {
//     if (error) {
//       event.reply('python-error', stderr);
//       return;
//     }
//     event.reply('python-result', stdout);
//   });
// });

ipcMain.on('run-python', (event, arg) => {
  const workingDirectory = path.resolve(__dirname, '../../BB_Py_Automation');
  const pythonPath = path.resolve(__dirname, '../../BB_Py_Automation/venv/Scripts/python.exe');
  const scriptPath = path.resolve(__dirname, `../../BB_Py_Automation/src/${arg}`);

  const pythonProcess = spawn(pythonPath, [scriptPath], {
    cwd: workingDirectory,
    windowsHide: true, // This will hide the Python prompt
  });
  let stdoutBuffer = '';
  pythonProcess.stdout.on('data', (data) => {
    console.log(`${data}`);
    // stdoutBuffer += data.toString();
    event.reply('python-result', data);
  });

  pythonProcess.stderr.on('data', (data) => {
    event.reply('python-error', data.toString()); // Send stderr to the renderer process
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    event.reply('python-close', `Python script exited with code ${code}`);
  });
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