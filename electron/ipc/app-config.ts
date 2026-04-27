import { ipcMain } from 'electron';
import { appStore } from '../services/store.js';

export type ImageProviderConfig = {
  baseUrl: string;
  apiKey: string;
  model: 'gpt-image-2';
  responseFormat: 'url';
};

export function registerAppConfigHandlers() {
  ipcMain.handle('config:get-image-provider', () => appStore.get('imageProvider'));
  ipcMain.handle('config:set-image-provider', (_event, payload: ImageProviderConfig) => {
    appStore.set('imageProvider', payload);
    return payload;
  });
}
