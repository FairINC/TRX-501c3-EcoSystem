const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");

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

    mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
});

ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"]
    });
    return result.filePaths[0] || null;
});

ipcMain.handle("select-file", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ["openFile"],
        filters: [{ name: "Solidity Files", extensions: ["sol"] }]
    });
    return result.filePaths[0] || null;
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});