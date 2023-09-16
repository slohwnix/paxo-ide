const { app, BrowserWindow, session, ipcMain, nativeTheme } = require("electron");
const path = require("path");

const createWindow = () => {
    const mainWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
      }
    })
    mainWindow.maximize();
    mainWindow.show();
  
    mainWindow.loadFile(path.join(__dirname, '../public/index.html'))
}

ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:get', () => {
    return nativeTheme.themeSource
})

app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      const headers = details.responseHeaders;
      headers['Content-Security-Policy'] = "script-src 'self' https://cdn.jsdelivr.net";
      callback({ responseHeaders: headers });
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
  