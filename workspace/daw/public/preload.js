const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  newProject: () => ipcRenderer.send('new-project'),
  openProject: (filePath) => ipcRenderer.send('open-project', filePath),
  saveProject: () => ipcRenderer.send('save-project'),
  exportAudio: () => ipcRenderer.send('export-audio'),
  
  // Listeners
  onNewProject: (callback) => ipcRenderer.on('new-project', callback),
  onOpenProject: (callback) => ipcRenderer.on('open-project', callback),
  onSaveProject: (callback) => ipcRenderer.on('save-project', callback),
  onExportAudio: (callback) => ipcRenderer.on('export-audio', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
