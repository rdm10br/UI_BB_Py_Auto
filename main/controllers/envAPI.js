import { ipcRenderer } from 'electron';

const envAPI = {
  getEnvVariables: (envFilePath) => ipcRenderer.invoke('get-env-variables', envFilePath),
  createEnvFile: (envData) => ipcRenderer.invoke('create-env-file', envData),
  deleteEnvFile: () => ipcRenderer.invoke('delete-env-file'),
};

export default envAPI;