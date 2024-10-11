import { Tray, Menu } from 'electron';
import path from 'path';

let tray = null;

export function createTray(mainWindow) {
    tray = new Tray(path.join(__dirname, "renderer/public/icon/1bad.png"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                mainWindow.show();
            },
        },
        {
            label: 'Quit',
            click: () => {
                mainWindow.close();
            },
        },
    ]);

    tray.setToolTip('My App');
    tray.setContextMenu(contextMenu);
}