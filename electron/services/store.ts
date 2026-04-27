import Store from 'electron-store';
import type { ImageProviderConfig } from '../ipc/app-config.js';

type AppStoreSchema = {
  imageProvider: ImageProviderConfig;
};

export const defaultImageProviderConfig: ImageProviderConfig = {
  baseUrl: 'https://free.codesonline.dev/v1',
  apiKey: '',
  model: 'gpt-image-2',
  responseFormat: 'url'
};

export const appStore = new Store<AppStoreSchema>({
  defaults: {
    imageProvider: defaultImageProviderConfig
  }
});
