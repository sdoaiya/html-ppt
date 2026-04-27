import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('desktopBridge', {
  platform: process.platform,
  version: '0.1.0'
});
