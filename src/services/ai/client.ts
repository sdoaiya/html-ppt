import { createImageProvider, type ImageProviderConfig } from './image-provider';

export function createAiClient(config: ImageProviderConfig) {
  return {
    images: createImageProvider(fetch, config)
  };
}
