const { contextBridge, ipcRenderer } = require('electron');

// Güvenli bir şekilde ana işlem ve işleyici işlem arasında iletişim kurmak için API'leri expose et
contextBridge.exposeInMainWorld('electronAPI', {
    // Firebase işlemleri için
    firebaseOperations: {
        getData: () => ipcRenderer.invoke('firebase:getData'),
        setData: (data) => ipcRenderer.invoke('firebase:setData', data),
        // Diğer Firebase işlemleri buraya eklenebilir
    },
    
    // Dosya işlemleri için
    fileOperations: {
        saveFile: (data) => ipcRenderer.invoke('file:save', data),
        readFile: () => ipcRenderer.invoke('file:read'),
        // Diğer dosya işlemleri buraya eklenebilir
    },
    
    // Uygulama işlemleri için
    appOperations: {
        minimize: () => ipcRenderer.send('app:minimize'),
        maximize: () => ipcRenderer.send('app:maximize'),
        close: () => ipcRenderer.send('app:close'),
        // Diğer uygulama işlemleri buraya eklenebilir
    }
}); 