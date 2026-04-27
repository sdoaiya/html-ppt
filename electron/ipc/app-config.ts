import { ipcMain } from 'electron';
import { appStore } from '../services/store.js';

export type ImageProviderConfig = {
  baseUrl: string;
  apiKey: string;
  model: 'gpt-image-2';
  responseFormat: 'url';
};

export type UnderstandingProviderConfig = {
  provider: 'openai_compatible' | 'openrouter';
  baseUrl: string;
  apiKey: string;
  model: string;
};

export function registerAppConfigHandlers() {
  ipcMain.handle('config:get-understanding-provider', () => appStore.get('understandingProvider'));
  ipcMain.handle('config:set-understanding-provider', (_event, payload: UnderstandingProviderConfig) => {
    appStore.set('understandingProvider', payload);
    return payload;
  });
  ipcMain.handle('config:get-image-provider', () => appStore.get('imageProvider'));
  ipcMain.handle('config:set-image-provider', (_event, payload: ImageProviderConfig) => {
    appStore.set('imageProvider', payload);
    return payload;
  });
}
