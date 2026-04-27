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
  return {
    summary: `已根据“${_input.brief}”准备理解模型请求，可继续生成结构建议。`,
    keyPoints: _input.sources.flatMap((source) =>
      (source.blocks ?? [])
        .filter((block) => block.type === 'paragraph')
        .map((block) => block.text)
        .slice(0, 2)
    ),
    duplicates: [],
    openQuestions: [],
    visualizable: _input.sources.flatMap((source) =>
      (source.blocks ?? [])
        .filter((block) => block.type === 'table_summary')
        .map((block) => block.text)
    ),
    structureHints: ['建议先给出结论，再展示优势对比与实施路径']
  };
}
