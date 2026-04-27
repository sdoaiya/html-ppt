import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopBridge', {
  platform: process.platform,
  version: '0.1.0',
  getImageProviderConfig: () => ipcRenderer.invoke('config:get-image-provider'),
  setImageProviderConfig: (payload: unknown) => ipcRenderer.invoke('config:set-image-provider', payload)
});
