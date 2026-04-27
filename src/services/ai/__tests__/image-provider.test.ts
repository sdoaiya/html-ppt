import { describe, expect, it, vi } from 'vitest';
import { createImageProvider } from '../image-provider';

describe('image provider', () => {
  it('calls generations endpoint with custom base url', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ url: 'https://img.test/result.png' }] })
    });

    const provider = createImageProvider(fetcher, {
      baseUrl: 'https://free.codesonline.dev/v1',
      apiKey: 'sk-demo',
      model: 'gpt-image-2',
      responseFormat: 'url'
    });

    await provider.generate({ prompt: '一张干净的产品海报', size: '2048x1152', n: 1 });

    expect(fetcher).toHaveBeenCalledWith(
      'https://free.codesonline.dev/v1/images/generations',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
