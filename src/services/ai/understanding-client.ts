import type { ExtractedSourceAsset } from '@/domain/projects/types';
import type { UnderstandingResult } from '@/services/understanding/understanding-service';

export type UnderstandingProviderRoute = {
  provider: 'openai_compatible' | 'openrouter';
  baseUrl: string;
  apiKey: string;
  model: string;
};

export function buildUnderstandingRequestConfig(config: UnderstandingProviderRoute) {
  return {
    provider: config.provider,
    baseUrl: config.provider === 'openrouter' ? (config.baseUrl || 'https://openrouter.ai/api/v1') : config.baseUrl,
    apiKey: config.apiKey,
    model: config.model
  };
}

export async function buildUnderstandingWithAi(_input: {
  brief: string;
  sources: ExtractedSourceAsset[];
}): Promise<UnderstandingResult | null> {
  return null;
}
