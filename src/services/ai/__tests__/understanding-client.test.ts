import { describe, expect, it } from 'vitest';
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
});
