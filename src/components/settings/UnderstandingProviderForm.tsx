import { useEffect, useState } from 'react';

export type UnderstandingProviderFormValue = {
  provider: 'openai_compatible' | 'openrouter';
  baseUrl: string;
  apiKey: string;
  model: string;
};

type Props = {
  initial: UnderstandingProviderFormValue;
  onSave: (value: UnderstandingProviderFormValue) => void;
};

export function UnderstandingProviderForm({ initial, onSave }: Props) {
  const [provider, setProvider] = useState<UnderstandingProviderFormValue['provider']>(initial.provider);
  const [baseUrl, setBaseUrl] = useState(initial.baseUrl);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [model, setModel] = useState(initial.model);

  useEffect(() => {
    setProvider(initial.provider);
    setBaseUrl(initial.baseUrl);
    setApiKey(initial.apiKey);
    setModel(initial.model);
  }, [initial]);

  return (
    <form
      className="settings-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({ provider, baseUrl, apiKey, model });
      }}
    >
      <h3>理解模型</h3>
      <p>用于资料摘要、重点提炼和结构建议。</p>
      <label>
        理解模型 Provider
        <select
          aria-label="理解模型 Provider"
          value={provider}
          onChange={(event) => {
            const nextProvider = event.target.value as UnderstandingProviderFormValue['provider'];
            setProvider(nextProvider);
            if (nextProvider === 'openrouter' && !baseUrl) {
              setBaseUrl('https://openrouter.ai/api/v1');
            }
          }}
        >
          <option value="openai_compatible">OpenAI Compatible</option>
          <option value="openrouter">OpenRouter</option>
        </select>
      </label>
      <label>
        理解模型 Base URL
        <input aria-label="理解模型 Base URL" value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} />
      </label>
      <label>
        理解模型 API Key
        <input aria-label="理解模型 API Key" type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} />
      </label>
      <label>
        理解模型 Model
        <input aria-label="理解模型 Model" value={model} onChange={(event) => setModel(event.target.value)} />
      </label>
      <button type="submit">保存理解模型</button>
    </form>
  );
}
