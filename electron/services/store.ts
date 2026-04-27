import Store from 'electron-store';
import type { ImageProviderConfig, UnderstandingProviderConfig } from '../ipc/app-config.js';

type AppStoreSchema = {
  understandingProvider: UnderstandingProviderConfig;
  imageProvider: ImageProviderConfig;
};

export const defaultUnderstandingProviderConfig: UnderstandingProviderConfig = {
  provider: 'openai_compatible',
  baseUrl: '',
  apiKey: '',
  model: ''
};

export const defaultImageProviderConfig: ImageProviderConfig = {
  baseUrl: 'https://free.codesonline.dev/v1',
  apiKey: '',
  model: 'gpt-image-2',
  responseFormat: 'url'
};

export const appStore = new Store<AppStoreSchema>({
  defaults: {
    understandingProvider: defaultUnderstandingProviderConfig,
    imageProvider: defaultImageProviderConfig
  }
});
