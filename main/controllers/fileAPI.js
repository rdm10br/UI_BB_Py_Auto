import { ipcRenderer } from 'electron';

const fileAPI = {
  checkFilesExist: (filePaths) => ipcRenderer.invoke('check-files-exist', filePaths),
};

export default fileAPI;