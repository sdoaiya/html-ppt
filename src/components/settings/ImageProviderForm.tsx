import { useState } from 'react';

export type ImageProviderFormValue = {
  baseUrl: string;
  apiKey: string;
  model: 'gpt-image-2';
  responseFormat: 'url';
};

type Props = {
  initial: {
    baseUrl: string;
    apiKey: string;
    model: 'gpt-image-2';
  };
  onSave: (value: ImageProviderFormValue) => void;
};

export function ImageProviderForm({ initial, onSave }: Props) {
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl);
  const [apiKey, setApiKey] = useState(initial.apiKey);

  return (
    <form
      className="settings-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ baseUrl, apiKey, model: 'gpt-image-2', responseFormat: 'url' });
      }}
    >
      <label>
        Base URL
        <input aria-label="Base URL" value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} />
      </label>
      <label>
        API Key
        <input aria-label="API Key" type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} />
      </label>
      <p>模型固定为 gpt-image-2，返回格式固定为 url。</p>
      <button type="submit">保存配置</button>
    </form>
  );
}
