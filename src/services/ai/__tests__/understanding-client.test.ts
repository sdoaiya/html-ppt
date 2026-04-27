import { describe, expect, it } from 'vitest';
import { buildUnderstandingRequestConfig } from '../understanding-client';

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
});
