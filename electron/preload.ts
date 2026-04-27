import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopBridge', {
  platform: process.platform,
  version: '0.1.0',
  pickProjectFiles: () => ipcRenderer.invoke('project-files:pick'),
  getImageProviderConfig: () => ipcRenderer.invoke('config:get-image-provider'),
  setImageProviderConfig: (payload: unknown) => ipcRenderer.invoke('config:set-image-provider', payload),
  exportProjectJson: (payload: unknown) => ipcRenderer.invoke('export:project-json', payload)
});
