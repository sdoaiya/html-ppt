export type ImageProviderConfig = {
  baseUrl: string;
  apiKey: string;
  model: 'gpt-image-2';
  responseFormat: 'url';
};

export type ImageGenerateInput = {
  prompt: string;
  size: string;
  n?: number;
  upscale?: '2k' | '4k';
};

export function createImageProvider(fetcher: typeof fetch, config: ImageProviderConfig) {
  const postJson = async (path: string, body: Record<string, unknown>) => {
    const response = await fetcher(`${config.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({ model: config.model, response_format: config.responseFormat, ...body })
    });

    if (!response.ok) {
      throw new Error(`Image request failed: ${response.status}`);
    }

    return response.json();
  };

  return {
    generate(input: ImageGenerateInput) {
      return postJson('/images/generations', input);
    },
    async edit(input: { prompt: string; size: string; files: File[]; upscale?: '2k' | '4k' }) {
      const form = new FormData();
      form.append('model', config.model);
      form.append('prompt', input.prompt);
      form.append('size', input.size);
      if (input.upscale) form.append('upscale', input.upscale);

      input.files.forEach((file, index) => {
        form.append(index === 0 ? 'image' : 'image[]', file);
      });

      const response = await fetcher(`${config.baseUrl}/images/edits`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.apiKey}` },
        body: form
      });

      if (!response.ok) {
        throw new Error(`Image edit failed: ${response.status}`);
      }

      return response.json();
    }
  };
}
