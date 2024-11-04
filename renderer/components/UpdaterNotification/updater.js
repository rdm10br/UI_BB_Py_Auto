import { useEffect } from 'react';
const { ipcRenderer } = require('electron');

function UpdateComponent() {
    useEffect(() => {
        // Listen for update events
        ipcRenderer.on('update_available', () => {
            alert('A new update is available! Downloading now...');
        });

        ipcRenderer.on('download_progress', (event, progressObj) => {
            console.log(`Downloaded ${progressObj.percent}%`);
            // Optional: Update a progress bar in the UI
        });

        ipcRenderer.on('update_downloaded', () => {
            alert('Update downloaded. It will be installed on restart.');
        });

        return () => {
            // Clean up event listeners
            ipcRenderer.removeAllListeners('update_available');
            ipcRenderer.removeAllListeners('download_progress');
            ipcRenderer.removeAllListeners('update_downloaded');
        };
    }, []);

    const checkForUpdates = () => {
        ipcRenderer.send('trigger-update-check');
    };

    return (
        <button onClick={checkForUpdates}>Check for Updates</button>
    );
}

export default UpdateComponent;