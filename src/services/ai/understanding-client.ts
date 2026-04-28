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

function buildPrompt(brief: string, sources: ExtractedSourceAsset[]) {
  const textParts = sources.flatMap((source) =>
    (source.blocks ?? [])
      .filter((block) => block.type === 'paragraph')
      .map((block) => `[${source.name}] ${block.text}`)
  );

  const tableParts = sources.flatMap((source) =>
    (source.blocks ?? [])
      .filter((block) => block.type === 'table_summary')
      .map((block) => `表格数据：${block.text}`)
  );

  const contentText = [...textParts, ...tableParts].join('\n');

  return {
    system: `你是一位专业的资料分析顾问。用户的资料已通过本地抽取引擎提取了正文和表格摘要。请根据以下内容完成资料理解任务。返回严格的JSON格式，不要包含任何额外文字。`,
    user: `项目目标：${brief}\n\n资料内容：\n${contentText || '（暂无可提取内容）'}\n\n请返回 JSON，包含：\n- summary: 一段总结（中文，100字内）\n- keyPoints: 3-5个重点信息\n- duplicates: 任何重复或冗余内容\n- openQuestions: 需要用户确认的问题\n- visualizable: 哪些内容适合转成图表、对比页或流程页\n- structureHints: 建议的页面结构和叙事顺序`
  };
}

async function callLlm(
  config: { baseUrl: string; apiKey: string; model: string },
  messages: { role: string; content: string }[],
  fetcher: typeof fetch
) {
  const response = await fetcher(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`LLM request failed: ${response.status}`);
  }

  return response.json();
}

function parseAiResponse(raw: unknown): UnderstandingResult | null {
  try {
    const data = raw as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as UnderstandingResult;
    return {
      summary: String(parsed.summary ?? ''),
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.map(String) : [],
      duplicates: Array.isArray(parsed.duplicates) ? parsed.duplicates.map(String) : [],
      openQuestions: Array.isArray(parsed.openQuestions) ? parsed.openQuestions.map(String) : [],
      visualizable: Array.isArray(parsed.visualizable) ? parsed.visualizable.map(String) : [],
      structureHints: Array.isArray(parsed.structureHints) ? parsed.structureHints.map(String) : []
    };
  } catch {
    return null;
  }
}

export async function buildUnderstandingWithAi(
  input: {
    brief: string;
    sources: ExtractedSourceAsset[];
    config?: UnderstandingProviderRoute;
    fetcher?: typeof fetch;
  }
): Promise<UnderstandingResult | null> {
  const route = input.config ? buildUnderstandingRequestConfig(input.config) : null;
  const fetchFn = input.fetcher ?? fetch;

  if (route?.apiKey && route.model) {
    try {
      const { system, user } = buildPrompt(input.brief, input.sources);
      const raw = await callLlm(route, [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ], fetchFn);

      const aiResult = parseAiResponse(raw);
      if (aiResult) return aiResult;
    } catch {
      // fall through to local extraction
    }
  }

  return {
    summary: `已根据"${input.brief}"准备理解模型请求，可继续生成结构建议。`,
    keyPoints: input.sources.flatMap((source) =>
      (source.blocks ?? [])
        .filter((block) => block.type === 'paragraph')
        .map((block) => block.text)
        .slice(0, 2)
    ),
    duplicates: [],
    openQuestions: [],
    visualizable: input.sources.flatMap((source) =>
      (source.blocks ?? [])
        .filter((block) => block.type === 'table_summary')
        .map((block) => block.text)
    ),
    structureHints: ['建议先给出结论，再展示优势对比与实施路径']
  };
}
