import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('MainIPC', {
  // Method to set the window title
  setTitle: (title) => ipcRenderer.send('set-title', title),

  // Method to send a message and receive a response
  showMessage: (arg) => ipcRenderer.invoke('message', arg),

  // Methods for environment variable handling
  getEnvVariables: (envFilePath) => ipcRenderer.invoke('get-env-variables', envFilePath),
  createEnvFile: (envData) => ipcRenderer.invoke('create-env-file', envData),
  deleteEnvFile: () => ipcRenderer.invoke('delete-env-file'),

  // Method to show an update popup
  showUpdatePopup: (isUpdateAvailable) => ipcRenderer.invoke('show-update-popup', isUpdateAvailable),

  // Methods for running and stopping Python scripts
  runPython: (args) => ipcRenderer.send('run-python', args),
  stopPython: () => ipcRenderer.send('stop-python'),

  // Methods to handle Python output and errors
  onPythonOutput: (callback) => ipcRenderer.on("python-output", (event, data) => callback(data)),
  onPythonError: (callback) => ipcRenderer.on("python-error", (event, data) => callback(data)),
  onPythonClose: (callback) => ipcRenderer.on("python-close", (event, data) => callback(data)),

  // Method to open an Excel file
  openExcel: (args) => ipcRenderer.send('open-excel-file', args),

  // File handling methods
  checkFilesExist: (filePaths) => ipcRenderer.invoke("check-files-exist", filePaths),
  getJsonData: (filePath) => ipcRenderer.invoke('get-json-data', filePath),
  readDirectory: (dirPath) => ipcRenderer.invoke("read-directory", dirPath),
  readLogFile: (filePath) => ipcRenderer.invoke("read-log-file", filePath),

  // Method for update the app
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
  restartApp: () => ipcRenderer.send('restart_app'),

  // Github
  getGitRepo: (GITHUB_REPO) => ipcRenderer.invoke('get-github-repo', GITHUB_REPO),
  postGitIssue: (GITHUB_REPO, title, body) => ipcRenderer.invoke('create-github-issue', {GITHUB_REPO, title, body}),
});