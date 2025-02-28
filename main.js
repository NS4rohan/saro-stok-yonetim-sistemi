import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// IPC işleyicilerini ayarla
function setupIpcHandlers() {
    // Firebase işlemleri
    ipcMain.handle('firebase:getData', async () => {
        // Firebase veri alma işlemleri
    });

    ipcMain.handle('firebase:setData', async (event, data) => {
        // Firebase veri kaydetme işlemleri
    });

    // Dosya işlemleri
    ipcMain.handle('file:save', async (event, data) => {
        // Dosya kaydetme işlemleri
    });

    ipcMain.handle('file:read', async () => {
        // Dosya okuma işlemleri
    });

    // Uygulama işlemleri
    ipcMain.on('app:minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.minimize();
    });

    ipcMain.on('app:maximize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win?.isMaximized()) {
            win.unmaximize();
        } else {
            win?.maximize();
        }
    });

    ipcMain.on('app:close', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.close();
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            preload: join(__dirname, 'preload.js')
        }
    });

    win.setMenu(null);
    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    setupIpcHandlers();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
}); 