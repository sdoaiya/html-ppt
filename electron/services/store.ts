import Store from 'electron-store';
import type { ImageProviderConfig, OcrProviderConfig, UnderstandingProviderConfig } from '../ipc/app-config.js';

type AppStoreSchema = {
  ocrProvider: OcrProviderConfig;
  understandingProvider: UnderstandingProviderConfig;
  imageProvider: ImageProviderConfig;
};

export const defaultOcrProviderConfig: OcrProviderConfig = {
  apiUrl: 'https://paddleocr.aistudio-app.com/api/v2/ocr/jobs',
  apiKey: '',
  model: 'PaddleOCR-VL-1.5'
};

export const defaultUnderstandingProviderConfig: UnderstandingProviderConfig = {
  provider: 'openrouter',
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: '',
  model: 'openrouter/auto'
};

export const defaultImageProviderConfig: ImageProviderConfig = {
  baseUrl: 'https://free.codesonline.dev/v1',
  apiKey: '',
  model: 'gpt-image-2',
  responseFormat: 'url'
};

export const appStore = new Store<AppStoreSchema>({
  name: 'ziliao-workbench-config',
  defaults: {
    ocrProvider: defaultOcrProviderConfig,
    understandingProvider: defaultUnderstandingProviderConfig,
    imageProvider: defaultImageProviderConfig
  }
});
