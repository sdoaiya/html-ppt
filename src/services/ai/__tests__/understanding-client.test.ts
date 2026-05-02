import { describe, expect, it, vi } from 'vitest';
import { buildUnderstandingRequestConfig, buildUnderstandingWithAi } from '../understanding-client';

describe('buildUnderstandingRequestConfig', () => {
  it('builds request config for openrouter provider', () => {
    const result = buildUnderstandingRequestConfig({
      provider: 'openrouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: 'sk-test',
      model: 'openrouter/auto'
    });

    expect(result.baseUrl).toBe('https://openrouter.ai/api/v1');
    expect(result.model).toBe('openrouter/auto');
  });

  it('returns a fallback understanding result when no remote call is wired yet', async () => {
    const result = await buildUnderstandingWithAi({
      brief: '做成招商汇报',
      sources: []
    });

    expect(result?.summary).toContain('做成招商汇报');
  });

  it('calls remote LLM when config with apiKey is provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({
              summary: '已根据资料生成摘要',
              keyPoints: ['重点1', '重点2'],
              duplicates: [],
              openQuestions: ['是否有补充资料？'],
              visualizable: ['适合做对比图'],
              structureHints: ['建议先结论后优势']
            })
          }
        }]
      })
    });

    const result = await buildUnderstandingWithAi({
      brief: '做成招商汇报',
      sources: [
        {
          id: '1',
          name: '业务介绍.docx',
          kind: 'document',
          path: 'x',
          status: 'ready',
          blocks: [{ type: 'paragraph', text: '业务优势是渠道覆盖全国' }],
          extractStatus: 'success'
        }
      ],
      config: {
        provider: 'openai_compatible',
        baseUrl: 'https://api.test.com/v1',
        apiKey: 'sk-test',
        model: 'gpt-4'
      },
      fetcher: mockFetch as unknown as typeof fetch
    });

    expect(result?.summary).toBe('已根据资料生成摘要');
    expect(result?.keyPoints).toEqual(['重点1', '重点2']);
    expect(result?.structureHints).toEqual(['建议先结论后优势']);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('falls back to local extraction when config has no apiKey', async () => {
    const result = await buildUnderstandingWithAi({
      brief: '做成招商汇报',
      sources: [
        {
          id: '1',
          name: '业务介绍.docx',
          kind: 'document',
          path: 'x',
          status: 'ready',
          blocks: [{ type: 'paragraph', text: '业务优势是渠道覆盖全国' }],
          extractStatus: 'success'
        }
      ],
      config: {
        provider: 'openai_compatible',
        baseUrl: '',
        apiKey: '',
        model: ''
      }
    });

    expect(result?.keyPoints).toContain('业务优势是渠道覆盖全国');
  });

  it('surfaces remote error details in fallback summary when LLM request fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({
        error: {
          type: 'ProviderModelNotFoundError',
          message: 'Model gpt-5.4 not found'
        }
      })
    });

    const result = await buildUnderstandingWithAi({
      brief: '做成招商汇报',
      sources: [],
      config: {
        provider: 'openai_compatible',
        baseUrl: 'https://sub2api.daw111.asia/v1',
        apiKey: 'sk-test',
        model: 'gpt-5.4'
      },
      fetcher: mockFetch as unknown as typeof fetch
    });

    expect(result?.summary).toContain('理解模型请求失败');
    expect(result?.summary).toContain('404');
    expect(result?.summary).toContain('ProviderModelNotFoundError');
    expect(result?.summary).toContain('Model gpt-5.4 not found');
  });
});
