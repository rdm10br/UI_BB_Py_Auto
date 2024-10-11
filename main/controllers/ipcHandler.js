import { ipcRenderer } from 'electron';

const ipcHandler = {
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

export default ipcHandler;