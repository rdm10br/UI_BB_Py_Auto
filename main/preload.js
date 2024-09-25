import { contextBridge, ipcRenderer } from 'electron'

const handler = {
  send(channel, value) {
    ipcRenderer.send(channel, value);
  },
  on(channel, callback) {
    const subscription = (_event, ...args) => callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

contextBridge.exposeInMainWorld('ipc', handler);

contextBridge.exposeInMainWorld('githubAPI', {
  getRepo: (GITHUB_REPO) => ipcRenderer.invoke('get-github-repo', GITHUB_REPO),
  showUpdatePopup: (isUpdateAvailable) => ipcRenderer.invoke('show-update-popup', isUpdateAvailable)
});

contextBridge.exposeInMainWorld('fileAPI', {
  // fetchMyApi: (apiUrl) => ipcRenderer.invoke('fetch-my-api', apiUrl),
  checkFilesExist: (filePaths) => ipcRenderer.invoke('check-files-exist', filePaths),
});

contextBridge.exposeInMainWorld('envAPI', {
  getEnvVariables: (envFilePath) => ipcRenderer.invoke('get-env-variables', envFilePath),
  createEnvFile: (envData) => ipcRenderer.invoke('create-env-file', envData),
  deleteEnvFile: () => ipcRenderer.invoke('delete-env-file'),
});