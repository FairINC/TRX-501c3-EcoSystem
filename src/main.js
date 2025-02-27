const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
});

ipcMain.handle('select-file', async () => {
    const { filePaths } = await dialog.showOpenDialog({
        title: "Select a Solidity File",
        filters: [{ name: "Solidity Files", extensions: ["sol"] }],
        properties: ["openFile"]
    });

    return filePaths[0] || null;
});
