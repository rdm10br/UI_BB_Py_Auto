import { ipcRenderer } from 'electron';

const githubAPI = {
  getRepo: (GITHUB_REPO) => ipcRenderer.invoke('get-github-repo', GITHUB_REPO),
  showUpdatePopup: (isUpdateAvailable) => ipcRenderer.invoke('show-update-popup', isUpdateAvailable)
};

export default githubAPI;