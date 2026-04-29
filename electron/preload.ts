import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopBridge', {
  platform: process.platform,
  version: '0.1.0',
  pickProjectFiles: () => ipcRenderer.invoke('project-files:pick'),
  readProjectFiles: (paths: string[]) => ipcRenderer.invoke('project-files:read', paths),
  getOcrProviderConfig: () => ipcRenderer.invoke('config:get-ocr-provider'),
  setOcrProviderConfig: (payload: unknown) => ipcRenderer.invoke('config:set-ocr-provider', payload),
  getUnderstandingProviderConfig: () => ipcRenderer.invoke('config:get-understanding-provider'),
  setUnderstandingProviderConfig: (payload: unknown) => ipcRenderer.invoke('config:set-understanding-provider', payload),
  getImageProviderConfig: () => ipcRenderer.invoke('config:get-image-provider'),
  setImageProviderConfig: (payload: unknown) => ipcRenderer.invoke('config:set-image-provider', payload),
  exportProjectJson: (payload: unknown) => ipcRenderer.invoke('export:project-json', payload)
});
